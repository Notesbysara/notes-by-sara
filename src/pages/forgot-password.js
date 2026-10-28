import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { supabase } from '../lib/supabaseClient';
import styles from './auth.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Check your email for a link to reset your password.' });
    }
  };

  return (
    <Layout title="Forgot Password" description="Reset your Notes by Sara password">
      <div className={styles.wrapper}>
        <div className={styles.leftPanel}>
          <img src="/img/favicon.png" className={styles.logo} alt="Notes by Sara logo" />
          <p className={styles.leftText}>
            Enter the email you signed up with, and we'll send you a link to
            reset your password.
          </p>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <h1 style={{ fontFamily: 'Forum, Georgia, serif', fontWeight: 400, fontSize: '1.6rem', margin: '0 0 1.5rem' }}>
              Reset your password
            </h1>

            {message && (
              <p className={`${styles.formMessage} ${message.type === 'error' ? styles.formMessageError : styles.formMessageSuccess}`}>
                {message.text}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="Your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={submitting} style={{ marginTop: '1.25rem' }}>
                {submitting ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
