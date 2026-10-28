import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';
import { supabase } from '../lib/supabaseClient';
import styles from './auth.module.css';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/;

export default function ResetPasswordPage() {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordInvalid = touched && !PASSWORD_RULE.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setMessage(null);

    if (!PASSWORD_RULE.test(password)) return;
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated. You can log in now.' });
      setTimeout(() => history.push('/login'), 2000);
    }
  };

  return (
    <Layout title="Set New Password" description="Set a new Notes by Sara password">
      <div className={styles.wrapper}>
        <div className={styles.leftPanel}>
          <img src="/img/favicon.png" className={styles.logo} alt="Notes by Sara logo" />
          <p className={styles.leftText}>Choose a new password for your account.</p>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <h1 style={{ fontFamily: 'Forum, Georgia, serif', fontWeight: 400, fontSize: '1.6rem', margin: '0 0 1.5rem' }}>
              Set a new password
            </h1>

            {message && (
              <p className={`${styles.formMessage} ${message.type === 'error' ? styles.formMessageError : styles.formMessageSuccess}`}>
                {message.text}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <input
                  type="password"
                  required
                  className={styles.input}
                  placeholder="New Password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                />
                <div>
                  <input
                    type="password"
                    required
                    className={styles.input}
                    placeholder="Re-enter New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              <button type="submit" className={styles.submitBtn} disabled={submitting} style={{ marginTop: '1.25rem' }}>
                {submitting ? 'Saving…' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
