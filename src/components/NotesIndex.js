import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

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
      .select('subject, slug, title')
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

  const prettify = (slug) =>
    slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <Layout title="Subjects" description="Browse notes by subject">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ fontFamily: 'Forum, Georgia, serif', fontWeight: 400, fontSize: '2.2rem' }}>
          Browse the notebook
        </h1>
        {(authLoading || loading) && <p style={{ color: '#8A8378' }}>Loading…</p>}
        {error && <p style={{ color: '#C23B3B' }}>{error}</p>}
        {Object.entries(bySubject).map(([subject, items]) => (
          <div key={subject} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, Georgia, serif', fontWeight: 400, fontSize: '1.4rem' }}>{prettify(subject)}</h2>
            <ul>
              {items.map((n) => (
                <li key={n.slug}>
                  <Link to={`/notes/${encodeURIComponent(subject)}/${encodeURIComponent(n.slug)}`}>{n.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  );
}
