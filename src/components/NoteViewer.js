import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function NoteViewer() {
  const { subject, slug } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    let mounted = true;
    supabase
      .from('notes')
      .select('title, description, content')
      .eq('subject', decodeURIComponent(subject))
      .eq('slug', decodeURIComponent(slug))
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
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 2rem' }}>
        {(authLoading || loading) && <p style={{ color: '#8A8378' }}>Loading…</p>}
        {error && <p style={{ color: '#C23B3B' }}>Couldn't load this note: {error}</p>}
        {note && (
          <article>
            <h1 style={{ fontFamily: 'Forum, Georgia, serif', fontWeight: 400 }}>{note.title}</h1>
            <div style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
          </article>
        )}
      </div>
    </Layout>
  );
}
