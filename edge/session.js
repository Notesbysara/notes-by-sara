// Signed session cookie shared by the middleware and /api/session.
// Format: base64url(JSON {u: userId, e: expirySeconds}) + "." + base64url(HMAC-SHA256)

export const COOKIE = 'nbs_s';
const enc = new TextEncoder();

function b64url(bytes) {
  let s = '';
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(s + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
async function key(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign', 'verify']);
}

export async function makeToken(userId, maxAgeSeconds, secret) {
  const payload = b64url(enc.encode(JSON.stringify({u: userId, e: Math.floor(Date.now() / 1000) + maxAgeSeconds})));
  const sig = await crypto.subtle.sign('HMAC', await key(secret), enc.encode(payload));
  return payload + '.' + b64url(sig);
}

export function getCookie(request, name) {
  const h = request.headers.get('Cookie') || '';
  for (const part of h.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}

export async function readSession(request, env) {
  if (!env.NBS_SESSION_SECRET) return null; // fail closed: no secret, no full lessons
  const tok = getCookie(request, COOKIE);
  if (!tok) return null;
  const [payload, sig] = tok.split('.');
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await key(env.NBS_SESSION_SECRET), fromB64url(sig), enc.encode(payload));
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    if (!data.u || !data.e || data.e < Date.now() / 1000) return null;
    return data;
  } catch (e) {
    return null;
  }
}
