import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import NotesSidebar from './NotesSidebar';
import styles from './notes.module.css';

export default function NoteViewer({ subject, slug }) {
  const { user, loading: authLoading } = useAuth();
  const [note, setNote] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    let mounted = true;

    supabase
      .from('notes')
      .select('subject, slug, title')
      .order('subject', { ascending: true })
      .then(({ data }) => {
        if (mounted && data) setAllNotes(data);
      });

    supabase
      .from('notes')
      .select('title, description, content')
      .eq('subject', subject)
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) setError(error.message);
        else setNote(data);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [authLoading, user, subject, slug]);

  return (
    <Layout
      title={note?.title ?? 'Note'}
      description={note?.description ?? 'A note from Notes by Sara'}>
      <div className={styles.wrapper}>
        <NotesSidebar notes={allNotes} activeSlug={slug} />
        <div className={styles.main}>
          {(authLoading || loading) && <p className={styles.stateText}>Loading…</p>}
          {error && <p style={{ color: '#C23B3B' }}>Couldn't load this note: {error}</p>}
          {note && (
            <article className={styles.article}>
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </Layout>
  );
}
