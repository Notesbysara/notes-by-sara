// POST /api/session  {access_token, remember}  -> sets the signed nbs_s cookie
// DELETE /api/session                         -> clears it
// The access token is checked with Supabase before any cookie is issued.

import {COOKIE, makeToken} from '../../edge/session.js';

const THIRTY_DAYS = 60 * 60 * 24 * 30;
const ONE_DAY = 60 * 60 * 24;

function sameOrigin(request) {
  const origin = request.headers.get('Origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function onRequestPost({request, env}) {
  if (!sameOrigin(request)) return new Response('Forbidden', {status: 403});
  if (!env.NBS_SESSION_SECRET || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return new Response('Not configured', {status: 500});
  }
  let body;
  try { body = await request.json(); } catch (e) { return new Response('Bad request', {status: 400}); }
  const token = body && body.access_token;
  if (!token || typeof token !== 'string') return new Response('Bad request', {status: 400});

  const r = await fetch(env.SUPABASE_URL.replace(/\/$/, '') + '/auth/v1/user', {
    headers: {Authorization: 'Bearer ' + token, apikey: env.SUPABASE_ANON_KEY},
  });
  if (!r.ok) return new Response('Unauthorized', {status: 401});
  const user = await r.json();
  if (!user || !user.id) return new Response('Unauthorized', {status: 401});

  const remember = body.remember !== false;
  // Even a "this browser session only" cookie is capped at one day on the server.
  const value = await makeToken(user.id, remember ? THIRTY_DAYS : ONE_DAY, env.NBS_SESSION_SECRET);
  const cookie = `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax` + (remember ? `; Max-Age=${THIRTY_DAYS}` : '');
  return new Response(JSON.stringify({ok: true}), {
    headers: {'Content-Type': 'application/json', 'Set-Cookie': cookie, 'Cache-Control': 'no-store'},
  });
}

export async function onRequestDelete({request}) {
  if (!sameOrigin(request)) return new Response('Forbidden', {status: 403});
  return new Response(JSON.stringify({ok: true}), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      'Cache-Control': 'no-store',
    },
  });
}
