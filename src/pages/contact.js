import React, {useState} from 'react';
import Layout from '@theme/Layout';
import styles from './contact.module.css';

// ── Web3Forms ──────────────────────────────────────────────────────────
// Messages are delivered to support@notesbysara.org by Web3Forms.
// Get the access key at https://web3forms.com (enter support@notesbysara.org;
// the key arrives by email) and paste it between the quotes below.
// The key is designed to be public, like the MailerLite form ID.
const WEB3FORMS_ACCESS_KEY = '9fefa0ff-9d21-4db1-9e83-95278d15a097';
// ───────────────────────────────────────────────────────────────────────

const EMAIL = 'support@notesbysara.org';

export default function Contact() {
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter your email so I can reply.');
    if (message.length < 5) return fail('Please write a short message.');
    if (data.get('botcheck')) return; // spam trap: real people never fill this in
    if (!WEB3FORMS_ACCESS_KEY) return fail(`The form isn't connected yet. Please email ${EMAIL}.`);

    setState('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New message from notesbysara.org',
          from_name: 'Notes by Sara website',
          email,
          message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error();
      setSentTo(email);
      setState('sent');
    } catch (err) {
      fail(`Your message didn't send. Please try again, or email ${EMAIL}.`);
    }
  }

  function fail(msg) {
    setError(msg);
    setState('error');
  }

  return (
    <Layout title="Contact" description="Send Sara a message: a mistake you spotted, a question about a topic, or a topic you'd like covered.">
      <main className={styles.page}>
        <div className={styles.card}>
          {state === 'sent' ? (
            <div className={styles.done}>
              <div className={styles.tick} aria-hidden="true">✓</div>
              <h1 className={styles.title}>Message sent</h1>
              <p className={styles.text}>
                Thank you. I'll reply to <b>{sentTo}</b> within 5 working days. If you don't see it, check your spam folder.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <h1 className={styles.title}>Leave a message</h1>
              <p className={styles.text}>A mistake you spotted, a question, or a topic you'd like covered. I reply within 5 working days.</p>
              <label className={styles.label} htmlFor="contact-email">Your email</label>
              <input className={styles.input} id="contact-email" name="email" type="email" autoComplete="email" maxLength={120} required />
              <label className={styles.label} htmlFor="contact-message">Message</label>
              <textarea className={styles.input} id="contact-message" name="message" rows={5} maxLength={2000} required />
              <input type="checkbox" name="botcheck" className={styles.trap} tabIndex={-1} autoComplete="off" aria-hidden="true" />
              {state === 'error' ? <p className={styles.error} role="alert">{error}</p> : null}
              <button className={styles.button} type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p className={styles.small}>
                Used only to reply to you. Or email <span className={styles.mail}>{EMAIL}</span>.
              </p>
            </form>
          )}
        </div>
      </main>
    </Layout>
  );
}
