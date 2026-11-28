import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {supabase} from '@site/src/lib/supabaseClient';
import {useAuth, syncServerSession} from '@site/src/contexts/AuthContext';
import styles from './login.module.css';

// Only allow returning to pages on this site.
function safeNext(raw) {
  if (!raw || typeof raw !== 'string') return '/notes';
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/login') || raw.startsWith('/welcome')) return '/notes';
  return raw;
}

const Google = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
);
const GitHub = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
);

export default function Login() {
  const {user, loading, signOut} = useAuth();
  const [next, setNext] = useState('/notes');
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState('');
  const [emailOpen, setEmailOpen] = useState(false);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const n = safeNext(p.get('next'));
    setNext(n);
    if (window.location.hash === '#email') setEmailOpen(true);
    try { setRemember(localStorage.getItem('nbs-remember') !== '0'); } catch (e) {}
    const provider = p.get('provider');
    if (provider === 'google' || provider === 'github') {
      // Coming from a lesson's sign-in card: start straight away, unless already signed in.
      supabase.auth.getSession().then(({data}) => {
        if (!data.session) oauth(provider, n);
      });
    }
  }, []);

  // Already signed in: make sure the server knows, then go where they were heading.
  useEffect(() => {
    if (loading || !user) return;
    const p = new URLSearchParams(window.location.search);
    if (!p.get('next')) return; // visiting /login directly: show the signed-in panel instead
    supabase.auth.getSession().then(async ({data}) => {
      if (data.session) await syncServerSession(data.session, true);
      window.location.replace(safeNext(p.get('next')));
    });
  }, [loading, user]);

  function saveRemember(v) {
    setRemember(v);
    try { localStorage.setItem('nbs-remember', v ? '1' : '0'); } catch (e) {}
  }

  async function oauth(provider, n = next) {
    setBusy(provider);
    setMsg(null);
    const {error} = await supabase.auth.signInWithOAuth({
      provider,
      options: {redirectTo: `${window.location.origin}/welcome?next=${encodeURIComponent(n)}`},
    });
    if (error) {
      setBusy('');
      setMsg({bad: true, text: 'Sign-in could not start. Please try again in a moment.'});
    }
  }

  async function emailLink(e) {
    e.preventDefault();
    if (!email) return;
    setBusy('email');
    setMsg(null);
    const {error} = await supabase.auth.signInWithOtp({
      email,
      options: {emailRedirectTo: `${window.location.origin}/welcome?next=${encodeURIComponent(next)}`},
    });
    setBusy('');
    setMsg(error
      ? {bad: true, text: 'We could not send the link. Check the address and try again.'}
      : {bad: false, text: `Check ${email} for a sign-in link. It works once and expires in an hour.`});
  }

  return (
    <Layout title="Sign in" description="Sign in to Notes by Sara. Every lesson is free with an account.">
      <main className={styles.page}>
        <section className={styles.split}>
          <div className={styles.left}>
            <span className={styles.freeDark}>Free, always</span>
            <h1 className={styles.h1}>Learn finance from the ground up. Free with your account.</h1>
            <p className={styles.leftLead}>Sign in once and every lesson, practice set and tool is yours to use.</p>
            <ul className={styles.ticks}>
              <li><i>✓</i>Short lessons with real examples from the US, UK, India and Taiwan</li>
              <li><i>✓</i>Your progress saved on any device</li>
              <li><i>✓</i>Calculators, practice sets and the financial dictionary</li>
            </ul>
            <div className={styles.stats}>
              <div><b>129</b><span>lessons</span></div>
              <div><b>6</b><span>courses</span></div>
              <div><b>$0</b><span>to learn</span></div>
            </div>
          </div>

          <div className={styles.right}>
            {!loading && user ? (
              <>
                <h2 className={styles.h2}>You're signed in</h2>
                <p className={styles.small}>Signed in as {user.email}. Everything on the site is open to you.</p>
                <Link className={`${styles.btn} ${styles.primary}`} to="/notes">Go to the learning path</Link>
                <button type="button" className={styles.btn} onClick={signOut}>Sign out</button>
              </>
            ) : (
              <>
                <h2 className={styles.h2}>Welcome</h2>
                <p className={styles.small}>Sign in or create your free account in one step.</p>
                <div className={styles.oauth}>
                  <button type="button" className={styles.btn} onClick={() => oauth('google')} disabled={!!busy}>
                    <Google />{busy === 'google' ? 'Opening Google…' : 'Continue with Google'}
                  </button>
                  <button type="button" className={`${styles.btn} ${styles.gh}`} onClick={() => oauth('github')} disabled={!!busy}>
                    <GitHub />{busy === 'github' ? 'Opening GitHub…' : 'Continue with GitHub'}
                  </button>
                </div>

                <details className={styles.email} open={emailOpen} onToggle={(e) => setEmailOpen(e.currentTarget.open)}>
                  <summary>Or use your email</summary>
                  <form onSubmit={emailLink} className={styles.form}>
                    <label className={styles.field}>
                      Email
                      <input type="email" name="email" autoComplete="email" required placeholder="you@example.com"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={!!busy}>
                      {busy === 'email' ? 'Sending…' : 'Email me a sign-in link'}
                    </button>
                    <p className={styles.fine}>No password to remember: the link signs you in.</p>
                  </form>
                </details>

                <label className={styles.chk}>
                  <input type="checkbox" checked={remember} onChange={(e) => saveRemember(e.target.checked)} />
                  Keep me signed in on this device
                </label>

                {msg ? <p className={msg.bad ? styles.bad : styles.good} role="status">{msg.text}</p> : null}

                <p className={styles.fine}>
                  By continuing you agree to the <Link to="/terms">terms</Link> and <Link to="/privacy">privacy policy</Link>.
                  We never post anything to your Google or GitHub account.
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
