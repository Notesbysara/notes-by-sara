import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {supabase} from '@site/src/lib/supabaseClient';
import {syncServerSession} from '@site/src/contexts/AuthContext';
import styles from './login.module.css';

function safeNext(raw) {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/login') || raw.startsWith('/welcome')) return '/notes';
  return raw;
}

// Landing page after Google, GitHub or an email link.
// First visit: one optional choice about emails, both switches off.
// Later visits: straight on to the page they were reading.
export default function Welcome() {
  const [state, setState] = useState('loading'); // loading | choose | error
  const [next, setNext] = useState('/notes');
  const [lessons, setLessons] = useState(false);
  const [freebies, setFreebies] = useState(false);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const n = safeNext(new URLSearchParams(window.location.search).get('next'));
    setNext(n);
    let done = false;

    async function proceed(s) {
      if (done || !s) return;
      done = true;
      setSession(s);
      await syncServerSession(s, true);
      const {data} = await supabase.from('profiles').select('onboarded_at').eq('id', s.user.id).maybeSingle();
      if (data && data.onboarded_at) window.location.replace(n);
      else setState('choose');
    }

    supabase.auth.getSession().then(({data}) => proceed(data.session));
    const {data: listener} = supabase.auth.onAuthStateChange((_e, s) => proceed(s));
    const t = setTimeout(() => { if (!done) setState('error'); }, 8000);
    return () => { listener.subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  async function save() {
    if (!session) return;
    setSaving(true);
    await supabase.from('profiles').upsert({
      id: session.user.id,
      email: session.user.email,
      email_new_lessons: lessons,
      email_freebies: freebies,
      onboarded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    window.location.replace(next);
  }

  const Opt = ({on, set, title, text}) => (
    <button type="button" role="switch" aria-checked={on} className={styles.opt} onClick={() => set(!on)}>
      <span className={styles.sw} aria-hidden="true" />
      <span><b>{title}</b><span>{text}</span></span>
    </button>
  );

  return (
    <Layout title="Welcome" description="Welcome to Notes by Sara.">
      <main className={styles.page} style={{minHeight: '70vh'}}>
        <div className={styles.card}>
          {state === 'loading' && <p className={styles.small}>Signing you in…</p>}
          {state === 'error' && (
            <>
              <h1 className={styles.h2}>That sign-in didn't finish</h1>
              <p className={styles.small}>The link may have expired or been used already. Please try again.</p>
              <Link className={`${styles.btn} ${styles.primary}`} to={`/login?next=${encodeURIComponent(next)}`}>Back to sign in</Link>
            </>
          )}
          {state === 'choose' && (
            <>
              <h1 className={styles.h2}>You're in.</h1>
              <p className={styles.small}>Everything on the site is now open to you, free. One optional choice before you start:</p>
              <Opt on={lessons} set={setLessons} title="New lessons, as they are published"
                text="A short note when a new course or section goes live. About once a month." />
              <Opt on={freebies} set={setFreebies} title="Free resources"
                text="Cheat sheets, workbooks and templates, sent before they appear on the site." />
              <button type="button" className={`${styles.btn} ${styles.primary}`} onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Start learning'}
              </button>
              <p className={styles.fine}>Both are off unless you turn them on, and you can change them any time. Your email is never shared or sold.</p>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
