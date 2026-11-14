import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {COURSE_TOPICS} from './courseTopics';
import styles from './NoteExtras.module.css';

// Shown at the end of every course topic: a small side note, and on phones
// a bottom bar with Previous, Topics and Next.
export default function NoteExtras({permalink, previous, next}) {
  const [sheet, setSheet] = useState(false);
  useEffect(() => {
    if (!sheet) return undefined;
    const onKey = (e) => e.key === 'Escape' && setSheet(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet]);

  return (
    <>
      <p className={styles.sideNote}>
        Spotted a mistake or something unclear? Email{' '}
        <span className={styles.mail}>support@notesbysara.org</span> or use the{' '}
        <Link to="/contact">contact page</Link>. For education only; not financial or investment advice.
      </p>

      <div className={styles.spacer} aria-hidden="true" />
      <nav className={styles.bar} aria-label="Topic navigation">
        {previous ? (
          <Link className={styles.btn} to={previous.permalink}><b>‹</b>Previous</Link>
        ) : (
          <span className={`${styles.btn} ${styles.off}`}><b>‹</b>Previous</span>
        )}
        <button type="button" className={styles.btn} onClick={() => setSheet(true)} aria-expanded={sheet}>
          <b>☰</b>Topics
        </button>
        {next ? (
          <Link className={styles.btn} to={next.permalink}>Next<b>›</b></Link>
        ) : (
          <span className={`${styles.btn} ${styles.off}`}>Next<b>›</b></span>
        )}
      </nav>

      {sheet ? (
        <>
          <div className={styles.scrim} onClick={() => setSheet(false)} aria-hidden="true" />
          <div className={styles.sheet} role="dialog" aria-label="Course topics">
            <div className={styles.grab} />
            <div className={styles.sheetHead}>
              <p>Foundations · Financial Data-to-Insight</p>
              <button type="button" onClick={() => setSheet(false)} aria-label="Close topics">✕</button>
            </div>
            <ol className={styles.list}>
              {COURSE_TOPICS.map((t) => (
                <li key={t.n}>
                  {t.to ? (
                    <Link to={t.to} className={t.to === permalink ? styles.on : undefined} onClick={() => setSheet(false)}>
                      <span>{t.n}</span>{t.title}
                    </Link>
                  ) : (
                    <span className={styles.soon}><span>{t.n}</span>{t.title}<em>Coming soon</em></span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : null}
    </>
  );
}
