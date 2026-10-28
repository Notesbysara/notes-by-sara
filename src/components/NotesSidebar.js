import React from 'react';
import Link from '@docusaurus/Link';
import styles from './notes.module.css';

const prettify = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function NotesSidebar({ notes, activeSlug }) {
  const bySubject = notes.reduce((acc, n) => {
    (acc[n.subject] ??= []).push(n);
    return acc;
  }, {});

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarLabel}>Finance</div>
      {Object.entries(bySubject).map(([subject, items]) => (
        <div key={subject} className={styles.subjectGroup}>
          <div className={styles.subjectTitle}>{prettify(subject)}</div>
          {items.map((n) => (
            <Link
              key={n.slug}
              to={`/notes/${encodeURIComponent(subject)}/${encodeURIComponent(n.slug)}`}
              className={`${styles.noteLink} ${n.slug === activeSlug ? styles.noteLinkActive : ''}`}>
              {n.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
