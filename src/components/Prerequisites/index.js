import React, {useEffect, useState} from 'react';
import {PREREQS} from '../LearningPath/catalog';
import styles from './Prerequisites.module.css';

// The three Toolkit subjects. Lessons are static pages in static/lessons; progress is read from this browser.
export default function Prerequisites({title = 'Before you start: prerequisites', lead = 'Optional. Use them when a subject needs a skill.', compact = false}) {
  const [done, setDone] = useState([]);
  useEffect(() => {
    try {
      setDone(JSON.parse(window.localStorage.getItem('nbs-lessons-done') || '[]') || []);
    } catch (e) {}
  }, []);
  return (
    <div className={compact ? styles.bandCompact : styles.band}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.lead}>{lead}</span>
      </div>
      <div className={styles.grid}>
        {PREREQS.map((p) => {
          const n = done.filter((s) => s.indexOf(p.group + '/') === 0).length;
          return (
            <a key={p.group} href={p.to} className={styles.card}>
              <span className={styles.kicker}>Prerequisite</span>
              <span className={styles.name}>{p.name}</span>
              <span className={styles.meta}>
                {p.lessons} lessons · {p.sections} sections
              </span>
              <span className={styles.desc}>{p.desc}</span>
              <span className={styles.bar} aria-hidden="true">
                <i style={{width: `${(n / p.lessons) * 100}%`}} />
              </span>
              <span className={styles.prog}>{n ? `${n} of ${p.lessons} done` : 'Not started'}</span>
              <span className={styles.go}>Open →</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
