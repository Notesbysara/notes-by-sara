import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import NotesSidebar from './NotesSidebar';
import styles from './notes.module.css';

const prettify = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function NotesIndex() {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    let mounted = true;
    supabase
      .from('notes')
      .select('subject, slug, title, description')
      .order('subject', { ascending: true })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) setError(error.message);
        else setNotes(data ?? []);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [authLoading, user]);

  const bySubject = notes.reduce((acc, n) => {
    (acc[n.subject] ??= []).push(n);
    return acc;
  }, {});

  return (
    <Layout title="Subjects" description="Browse notes by subject">
      <div className={styles.wrapper}>
        <NotesSidebar notes={notes} />
        <div className={styles.main}>
          <h1 className={styles.pageTitle}>Browse the notebook</h1>
          {(authLoading || loading) && <p className={styles.stateText}>Loading…</p>}
          {error && <p style={{ color: '#C23B3B' }}>{error}</p>}
          {Object.entries(bySubject).map(([subject, items]) => (
            <div key={subject}>
              <h2 className={styles.subjectSectionTitle}>{prettify(subject)}</h2>
              <div className={styles.cardGrid}>
                {items.map((n) => (
                  <Link
                    key={n.slug}
                    to={`/notes/${encodeURIComponent(subject)}/${encodeURIComponent(n.slug)}`}
                    className={styles.card}>
                    <div className={styles.cardTitle}>{n.title}</div>
                    {n.description && <div className={styles.cardDescription}>{n.description}</div>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
