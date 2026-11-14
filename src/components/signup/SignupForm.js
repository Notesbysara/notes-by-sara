import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {subscribe} from './subscribe';
import {markSubscribed} from './storage';
import {PDF_PATH} from './config';
import styles from './signup.module.css';

/** One form, used by both the card at the bottom of the page and the pop-up. */
export default function SignupForm({idPrefix, onDone}) {
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');
  const pdfUrl = useBaseUrl(PDF_PATH);

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!agree) {
      setStatus('error');
      setMessage('Please tick the box to continue.');
      return;
    }
    setStatus('sending');
    setMessage('');
    try {
      await subscribe(email.trim());
      markSubscribed();
      setStatus('done');
      if (onDone) onDone();
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <div className={styles.doneBox} role="status">
        <span className={styles.doneIcon} aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className={styles.doneTitle}>You're in. Your PDF is ready.</p>
        <p className={styles.doneText}>Tap the button to download the Financial Dictionary Quick Reference.</p>
        <a className={styles.dlBtn} href={pdfUrl} download>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
          </svg>
          Download the PDF
        </a>
        <p className={styles.doneNote}>A copy is also on its way to {email.trim()}</p>
        <p className={styles.doneNote}>Don't see it? Check Promotions or Updates, and drag it to Primary.</p>
      </div>
    );
  }

  const emailId = `${idPrefix}-email`;
  const agreeId = `${idPrefix}-agree`;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      <div className={styles.row}>
        <label htmlFor={emailId} className={styles.srOnly}>
          Email address
        </label>
        <input
          id={emailId}
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className={styles.btn} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send me the free PDF'}
        </button>
      </div>
      <div className={styles.consent}>
        <input id={agreeId} type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <label htmlFor={agreeId}>
          Yes, email me the free PDF and the occasional study update. Unsubscribe at any time. See the{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </label>
      </div>
      {status === 'error' && message ? (
        <p className={styles.error} role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
