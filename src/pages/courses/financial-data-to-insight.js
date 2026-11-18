import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import {COURSES, noteLabel} from '../../components/LearningPath/catalog';
import styles from './course.module.css';

// The lessons come from the Learning path catalog, so this page stays in step with it.
// This page only links to the lessons. It never copies their text.
const COURSE = COURSES[0];
const NOTES = COURSE.lessons;
const FIRST = COURSE.to + '/from-raw-numbers-to-decisions';
const TOOLKIT_A = COURSE.to + '/excel-for-this-course';
const PROJECT = COURSE.to + '/project-01-walmart-vs-target';

const GROUPS = [
  {name: 'Start here · Optional', labels: ['A', 'B']},
  {name: 'Getting started', labels: ['1']},
  {name: 'Step 1 · Assess', labels: ['2', '3']},
  {name: 'Step 2 · Inquire', labels: ['4', '5']},
  {name: 'Step 3 · Analyze', labels: ['6', '7']},
  {name: 'Step 4 · Visualize', labels: ['8', '9']},
  {name: 'Step 5 · Interpret', labels: ['10']},
  {name: 'Step 6 · Prompt', labels: ['11']},
  {name: 'All six steps', labels: ['12']},
  {name: 'Final project', labels: ['P']},
];

const METHOD = ['Assess', 'Inquire', 'Analyze', 'Visualize', 'Interpret', 'Prompt'];

const WHO = [
  'University students',
  'People preparing for finance exams',
  'Anyone who wants to understand how finance works',
];

const OUTCOMES = [
  'Read the three financial statements and check data before you trust it',
  'Ask a sharp question and pick the metrics that matter',
  'Work out ratios, variances, break-even and simple forecasts',
  'Choose honest charts and write a one-page summary that leads with the answer',
];

const byLabel = {};
NOTES.forEach((n, j) => {
  byLabel[noteLabel(n, j)] = n;
});

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Financial Data-to-Insight',
  description:
    'A free course that teaches you to turn a company’s numbers into a clear answer, in twelve lessons and one real-company project.',
  isAccessibleForFree: true,
  provider: {'@type': 'Organization', name: 'Notes by Sara', sameAs: 'https://notesbysara.org'},
  url: 'https://notesbysara.org/courses/financial-data-to-insight',
  hasCourseInstance: {'@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'Self-paced'},
};

export default function Course() {
  return (
    <Layout
      title="Financial Data-to-Insight: A Free Finance Data Course"
      description="A free course in 12 lessons: read financial statements, check data, work out ratios and forecasts, chart honestly, then practice on Walmart and Target.">
      <Head>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.inner}>
            <nav className={styles.crumb} aria-label="Breadcrumb">
              <Link to="/courses">Courses</Link> <span aria-hidden="true">›</span> <span>Financial Data-to-Insight</span>
            </nav>
            <p className={styles.kicker}>Free course · No account needed</p>
            <h1 className={styles.title}>Financial Data-to-Insight</h1>
            <p className={styles.sub}>
              Learn to turn a company&rsquo;s numbers into a clear answer someone can act on. Twelve short lessons
              follow one six-step method, then you use it on Walmart&rsquo;s and Target&rsquo;s real results.
            </p>
            <div className={styles.buttons}>
              <Link to={FIRST} className={styles.btnGold}>
                Start lesson 1
              </Link>
              <Link to={TOOLKIT_A} className={styles.btnLine}>
                New to Excel? Start with Toolkit A
              </Link>
            </div>
            <div className={styles.facts}>
              <div>
                <b>12</b>lessons
              </div>
              <div>
                <b>2</b>optional toolkits
              </div>
              <div>
                <b>1</b>real-company project
              </div>
              <div>
                <b>Free</b>workbooks that check your answers
              </div>
            </div>
          </div>
        </header>

        <main className={styles.inner}>
          <div className={styles.two}>
            <section className={styles.box}>
              <h2 className={styles.boxTitle}>Who it&rsquo;s for</h2>
              <ul className={styles.ticks}>
                {WHO.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <p className={styles.small}>
                No finance background needed. If Excel or percentages feel shaky, the two toolkits cover what you
                need first.
              </p>
            </section>
            <section className={styles.box}>
              <h2 className={styles.boxTitle}>By the end you&rsquo;ll be able to</h2>
              <ul className={styles.ticks}>
                {OUTCOMES.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </section>
          </div>

          <h2 className={styles.h2}>The six-step method</h2>
          <ol className={styles.method}>
            {METHOD.map((m, i) => (
              <li key={m}>
                <b>{i + 1}</b>
                {m}
              </li>
            ))}
          </ol>
          <p className={styles.small}>Every lesson belongs to one step, so you always know where you are in an analysis.</p>

          <h2 className={styles.h2}>What&rsquo;s inside</h2>
          {GROUPS.map((g) => {
            const items = g.labels.map((l) => [l, byLabel[l]]).filter(([, n]) => n);
            if (!items.length) return null;
            return (
              <section key={g.name} className={styles.group}>
                <h3 className={styles.groupName}>{g.name}</h3>
                {items.map(([l, n]) => (
                  <Link key={n.slug} to={n.to} className={l === 'P' ? styles.lessonProj : styles.lesson}>
                    <span className={styles.num}>{l}</span>
                    <span className={styles.lessonText}>
                      <span className={styles.lessonTitle}>{n.title}</span>
                      <span className={styles.small}>{n.blurb}</span>
                    </span>
                  </Link>
                ))}
              </section>
            );
          })}

          <section className={styles.end}>
            <h2 className={styles.endTitle}>Ready to start?</h2>
            <p className={styles.endText}>It&rsquo;s free, and you can stop and pick up any time.</p>
            <div className={styles.buttons}>
              <Link to={FIRST} className={styles.btnSolid}>
                Start lesson 1
              </Link>
              <Link to={PROJECT} className={styles.btnGhost}>
                See the free project
              </Link>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
