// Notes by Sara: login wall for lesson pages (Cloudflare Pages Functions).
//
// Lesson pages in /lessons are sent in full only to signed-in readers.
// Everyone else gets the top of the lesson (title, "In plain words" and the
// first paragraphs) followed by a sign-in card. The rest of the lesson is
// never sent, so copying the page source only gets the teaser.
//
// Signed-in status is a cookie (nbs_s) issued by /api/session after Supabase
// confirms the user. It is signed with NBS_SESSION_SECRET.
//
// Environment variables (Cloudflare Pages > Settings > Variables and secrets):
//   NBS_SESSION_SECRET  long random string (secret)
//   SUPABASE_URL        https://ihxourpiqsrkksyplvyy.supabase.co
//   SUPABASE_ANON_KEY   the public anon key

import {readSession} from '../edge/session.js';

// The first lesson of each course stays fully open as a free sample.
const FREE = new Set([
  'mathematics/numbers-in-finance',
  'statistics/mean-median-mode',
  'accounting/accounting-equation',
  'economics/supply-and-demand',
  'foundations/what-finance-is',
  'personal-finance/income-and-paychecks',
]);

function lessonKey(pathname) {
  // /lessons/<course>/<slug>(.html) -> "<course>/<slug>", or null for anything else.
  const m = pathname.match(/^\/lessons\/([a-z0-9-]+)\/([a-z0-9-]+?)(?:\.html)?\/?$/);
  if (!m) return null;
  if (m[2] === 'index') return null;
  return `${m[1]}/${m[2]}`;
}

function isGatedFile(pathname) {
  return pathname.startsWith('/files/');
}

export async function onRequest(context) {
  const {request, env} = context;
  const url = new URL(request.url);
  const key = lessonKey(url.pathname);
  const gatedFile = isGatedFile(url.pathname);

  if (!key && !gatedFile) return context.next();
  if (key && FREE.has(key)) return context.next();

  const session = await readSession(request, env);
  if (session) {
    const res = await context.next();
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-store');
    return out;
  }

  const next = url.pathname + url.search;
  if (gatedFile) {
    return Response.redirect(new URL('/login?next=' + encodeURIComponent(next), url).toString(), 302);
  }

  const res = await context.next();
  const type = res.headers.get('Content-Type') || '';
  if (res.status !== 200 || !type.includes('text/html')) return res; // e.g. the .html -> clean URL redirect
  const full = await res.text();
  const html = teaser(full, next);
  return new Response(html, {
    status: 200,
    headers: {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'},
  });
}

// ---------- teaser ----------

const GOOGLE = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>';
const GITHUB = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

const GATE_CSS = `<style>
.nbs-fade{-webkit-mask-image:linear-gradient(to bottom,#000 15%,transparent 95%);mask-image:linear-gradient(to bottom,#000 15%,transparent 95%);max-height:150px;overflow:hidden}
.nbs-gate{display:flex;justify-content:center;margin:4px 0 40px}
.nbs-card{background:#fff;border:1px solid var(--line,#E6E1D5);border-radius:18px;box-shadow:0 18px 40px rgba(6,53,42,.14);padding:26px 28px;max-width:440px;width:100%;display:flex;flex-direction:column;gap:14px}
.nbs-free{display:inline-flex;font-size:12.5px;font-weight:600;color:var(--green-text,#0B6A4C);background:var(--pale,#EAF4EF);border-radius:999px;padding:5px 11px;width:max-content}
.nbs-card h2{font-family:var(--display,Georgia,serif);font-weight:400;font-size:1.65rem;margin:0;color:var(--brand,#0B4F3C)}
.nbs-card p{margin:0;color:var(--muted,#5A6862);font-size:14px;line-height:1.55}
.nbs-btn{text-transform:none;letter-spacing:normal;font-family:var(--body,system-ui,sans-serif);display:flex;align-items:center;justify-content:center;gap:10px;font-weight:500;font-size:15px;padding:12px 16px;border-radius:12px;border:1px solid var(--line,#E6E1D5);background:#fff;color:var(--ink,#1F2A26);text-decoration:none}
.nbs-btn svg{width:18px;height:18px;flex:none}
.nbs-btn.nbs-gh{background:#1F2328;color:#fff;border-color:#1F2328}
.nbs-btn:hover{filter:brightness(.97)}
.nbs-row{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:13px}
.nbs-row a{color:var(--green-text,#0B6A4C)}
</style>`;

function gateCard(next) {
  const n = encodeURIComponent(next);
  return `<div class="nbs-gate"><div class="nbs-card" role="region" aria-label="Sign in to keep reading">
<span class="nbs-free">Free with an account</span>
<h2>Keep reading. It's free.</h2>
<p>Sign in to read the rest of this lesson and every other one. Your progress is saved wherever you sign in.</p>
<a class="nbs-btn" href="/login?provider=google&amp;next=${n}">${GOOGLE}Continue with Google</a>
<a class="nbs-btn nbs-gh" href="/login?provider=github&amp;next=${n}">${GITHUB}Continue with GitHub</a>
<div class="nbs-row"><a href="/login?next=${n}#email">Use email instead</a><span>New or returning, the same buttons work.</span></div>
</div></div>`;
}

// Keeps the lesson banner, the "In plain words" box and the start of the first
// section, then closes the article with the sign-in card. Everything else in
// the article, and the lesson's own scripts, are dropped.
export function teaser(html, next) {
  const a = html.indexOf('<article class="page">');
  const e = html.indexOf('</article>', a);
  if (a < 0 || e < 0) return fallback(html, next);
  const article = html.slice(a, e);

  const s = article.indexOf('<section');
  let kept = s > 0 ? article.slice(0, s) : article.slice(0, 2000);
  if (s > 0) {
    const sEnd = article.indexOf('</section>', s);
    const open = article.slice(s, article.indexOf('>', s) + 1);
    const inner = article.slice(s + open.length, sEnd > 0 ? sEnd : article.length);
    kept += open + firstBlocks(inner) + '</section>';
  }
  kept = kept.replace(/<a class="next"[\s\S]*?<\/a>/g, '');

  // After the article: drop the lesson's own scripts but keep the shared
  // side-list and progress scripts (they start with the KEY variable).
  const after = html.slice(e + '</article>'.length);
  const tailStart = after.indexOf("<script>\n(function(){\n  var KEY=");
  const closeDiv = after.trimStart().startsWith('</div>') ? '</div>' : '';
  const tail = tailStart >= 0 ? after.slice(tailStart) : '</body></html>';

  const head = html.slice(0, a).replace('</head>', GATE_CSS + '</head>');
  return head + kept + gateCard(next) + '</article>' + closeDiv + '\n' + tail;
}

// Top-level blocks of the first section are indented 4 spaces in every lesson.
// Keep blocks until two ordinary paragraphs are included; fade the last one.
function firstBlocks(inner) {
  const lines = inner.split('\n');
  const blocks = [];
  let cur = null;
  for (const line of lines) {
    if (/^ {4}<(?!\/)/.test(line)) {
      if (cur) blocks.push(cur);
      cur = line;
    } else if (cur !== null) {
      cur += '\n' + line;
    }
  }
  if (cur) blocks.push(cur);
  if (!blocks.length) return '';
  const out = [];
  let paras = 0;
  for (const b of blocks) {
    const t = b.trim();
    if (t.startsWith('<div class="guess"') || t.startsWith('<div class="box"') || t.startsWith('<div class="calc"')) break;
    const isPara = t.startsWith('<p') && !t.startsWith('<p class="src"') && !t.startsWith('<p class="hook"');
    if (isPara) paras++;
    if (isPara && paras === 2) { out.push('<div class="nbs-fade">' + b + '</div>'); break; }
    out.push(b);
    if (out.length >= 6) break;
  }
  return '\n' + out.join('\n') + '\n';
}

function fallback(html, next) {
  // Unknown layout: send only the head and the card.
  const b = html.indexOf('<body');
  const head = (b > 0 ? html.slice(0, b) : '<!DOCTYPE html><html><head>').replace('</head>', GATE_CSS + '</head>');
  return head + '<body><main style="padding:40px 16px">' + gateCard(next) + '</main></body></html>';
}
