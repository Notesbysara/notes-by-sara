import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {SUBJECTS, ALL_NOTES} from '../components/LearningPath/catalog';
import styles from './notes-library.module.css';

export default function NotesLibrary() {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All');

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      ALL_NOTES.filter(
        (n) =>
          (subject === 'All' || n.subject === subject) &&
          (!q || (n.title + ' ' + n.blurb + ' ' + n.subject).toLowerCase().indexOf(q) >= 0)
      ),
    [q, subject]
  );

  const live = SUBJECTS.filter((s) => s.notes.length > 0);
  const soon = SUBJECTS.filter((s) => s.notes.length === 0);

  return (
    <Layout
      title="Finance Notes by Subject"
      description="Search every published finance note and browse by subject. Each note gives the idea in plain words, the formula, a worked example and the common mistakes.">
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroKicker}>Notes</div>
            <h1 className={styles.heroTitle}>Find a note</h1>
            <p className={styles.heroLead}>
              Every published note in one place. Search for a topic, or browse by subject. Not sure where to begin? The{' '}
              <Link to="/notes">Learning path</Link> puts the notes in order.
            </p>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the notes"
              aria-label="Search the notes"
              className={styles.search}
            />
          </div>
        </header>

        <div className={styles.layout}>
          <nav className={styles.side} aria-label="Subjects">
            <div className={styles.sideTitle}>Subjects</div>
            <button
              type="button"
              className={subject === 'All' ? styles.subjOn : styles.subj}
              onClick={() => setSubject('All')}>
              <span>All</span>
              <span className={styles.count}>{ALL_NOTES.length}</span>
            </button>
            {live.map((s) => (
              <button
                key={s.name}
                type="button"
                className={subject === s.name ? styles.subjOn : styles.subj}
                onClick={() => setSubject(s.name)}>
                <span>{s.name}</span>
                <span className={styles.count}>{s.notes.length}</span>
              </button>
            ))}
          </nav>

          <div className={styles.main}>
            <div className={styles.result} aria-live="polite">
              {shown.length === 1 ? '1 published note' : shown.length + ' published notes'}
            </div>

            {shown.map((n) => (
              <article key={n.slug} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardSubject}>{n.subject}</span>
                  <span className={styles.cardMeta}>{n.meta}</span>
                </div>
                <h2 className={styles.cardTitle}>{n.title}</h2>
                <p className={styles.cardBlurb}>{n.blurb}</p>
                <div className={styles.cardActions}>
                  <Link to={n.to} className={styles.read}>
                    Read the note
                  </Link>
                  <span className={styles.step}>
                    Part of {n.subject} on the <Link to="/notes">Learning path</Link>
                  </span>
                </div>
              </article>
            ))}

            {shown.length === 0 ? (
              <div className={styles.empty}>
                No published note matches that yet. Try the <Link to="/dictionary">Financial Dictionary</Link> for the
                term itself, or <Link to="/formula-library">Formulas</Link> if you are after a calculation.
              </div>
            ) : null}

            {soon.length > 0 ? (
              <div className={styles.soonBlock}>
                <div className={styles.sideTitle}>Coming soon</div>
                <div className={styles.pills}>
                  {soon.map((s) => (
                    <span key={s.name} className={styles.pill}>
                      {s.name}
                    </span>
                  ))}
                </div>
                <div className={styles.small}>
                  These subjects are collapsed on purpose. They appear above as notes are published, so this page never
                  shows empty shelves.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
