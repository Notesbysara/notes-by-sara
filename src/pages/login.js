import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { supabase } from '../lib/supabaseClient';
import styles from './auth.module.css';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.02l7.73 6c4.51-4.18 7.09-10.36 7.09-17.49z"/>
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.86.92 7.51 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#181717">
      <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3" />
    </svg>
  );
}

export default function LoginPage() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordInvalid = touched && !PASSWORD_RULE.test(password);

  const handleOAuth = async (provider) => {
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/notes/corporate-finance/time-value-of-money` },
    });
    if (error) setMessage({ type: 'error', text: error.message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setMessage(null);
    if (!PASSWORD_RULE.test(password)) return;

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      history.push('/notes/corporate-finance/time-value-of-money');
    }
  };

  return (
    <Layout title="Log In" description="Log in to Notes by Sara">
      <div className={styles.wrapper}>
        <div className={styles.leftPanel}>
          <img src="/img/favicon.png" className={styles.logo} alt="Notes by Sara logo" />
          <p className={styles.leftText}>
            Notes by Sara is a personal, continuously-updated notebook covering
            corporate finance, valuation, and markets. Create an account to
            read the notes, written plainly with real worked examples.
          </p>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <div className={styles.tabs}>
              <span className={`${styles.tab} ${styles.tabActive}`}>Log In</span>
              <Link to="/signup" className={styles.tab}>Sign Up</Link>
            </div>

            {message && (
              <p className={`${styles.formMessage} ${message.type === 'error' ? styles.formMessageError : styles.formMessageSuccess}`}>
                {message.text}
              </p>
            )}

            <div className={styles.oauthGroup}>
              <button type="button" className={styles.oauthBtn} onClick={() => handleOAuth('google')}>
                <GoogleIcon /> Sign in with Google
              </button>
              <button type="button" className={styles.oauthBtn} onClick={() => handleOAuth('github')}>
                <GitHubIcon /> Sign in with GitHub
              </button>
            </div>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>OR CONTINUE WITH EMAIL</span>
              <div className={styles.dividerLine} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="Email (this will be your username)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div>
                  <input
                    type="password"
                    required
                    className={styles.input}
                    placeholder="Password (min. 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched(true)}
                  />
                  {passwordInvalid && (
                    <p className={styles.helperError}>
                      Password must be at least 8 characters long and include an
                      uppercase letter, a lowercase letter, and a special
                      character (!@#$%^&amp;).
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.forgotRow}>
                <Link to="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Logging in…' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
