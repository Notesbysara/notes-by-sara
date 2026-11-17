import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {COURSES} from '../../components/LearningPath/catalog';
import styles from './courses.module.css';

// One card per course. Add a course to COURSES in the Learning path catalog and it appears here.
export default function Courses() {
  return (
    <Layout
      title="Free Finance Courses: Learn by Doing"
      description="Hands-on finance courses that use real company numbers, with workbooks that check your answers. Start with Financial Data-to-Insight, free and with no account needed.">
      <div className={styles.page}>
        <main className={styles.inner}>
          <p className={styles.kicker}>Courses</p>
          <h1 className={styles.title}>Learn by doing</h1>
          <p className={styles.lead}>
            Hands-on courses that take finance ideas and use them on real numbers, with workbooks that check your
            answers.
          </p>
          <div className={styles.list}>
            {COURSES.map((c) => (
              <article key={c.slug} className={styles.card}>
                <div className={styles.cardText}>
                  <span className={styles.badge}>Free · No account needed</span>
                  <h2 className={styles.cardTitle}>
                    <Link to={c.to}>{c.name}</Link>
                  </h2>
                  <p className={styles.cardBlurb}>{c.blurb}</p>
                  <div className={styles.tags}>
                    {c.covers.map(([a, b]) => (
                      <span key={a}>
                        <b>{a}</b> {b}
                      </span>
                    ))}
                  </div>
                </div>
                <Link to={c.to} className={styles.btn}>
                  See the course
                </Link>
              </article>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}
