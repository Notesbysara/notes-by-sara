import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './about.module.css';

// Update these two numbers when you add terms or formulas.
const DICTIONARY_TERMS = '1,725';
const FORMULAS = '522';

const TILES = [
  {
    kicker: 'Start here',
    name: 'Learning path',
    text: 'One route through finance, in order, starting with a free hands-on course.',
    cta: 'See the learning path',
    to: '/notes',
  },
  {
    kicker: 'Free course',
    name: 'Courses',
    text: 'Hands-on courses that use real company numbers, with workbooks that check your answers.',
    cta: 'See the courses',
    to: '/courses',
  },
  {
    kicker: `${DICTIONARY_TERMS} terms`,
    name: 'Financial Dictionary',
    text: 'Plain-English explanations, searchable, with a level on every term.',
    cta: 'Open the dictionary',
    to: '/dictionary',
  },
  {
    kicker: `${FORMULAS} formulas`,
    name: 'Formulas and Calculators',
    text: 'Each formula has a worked example and a calculator that shows its steps.',
    cta: 'Open the formulas',
    to: '/formula-library',
  },
];

const STEPS = [
  { n: '1', title: 'A clear definition', text: 'Every key term defined in a highlighted box, nothing assumed.' },
  { n: '2', title: 'The idea in plain words', text: 'With an everyday example and a tip.' },
  { n: '3', title: 'One worked example', text: 'Followed through every step, with charts where they help.' },
  { n: '4', title: 'What it looks like at work', text: 'Including how to explain it to your manager.' },
];

export default function About() {
  return (
    <Layout
      title="About"
      description="Finance notes for people just starting out. Every answer comes with its working."
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>About</div>
            <h1 className={styles.headline}>
              Finance notes that show the working behind every answer.
            </h1>
            <div className={styles.rule} />
            <p className={styles.lead}>
              Notes for people who are just starting out in finance. Every answer comes with its
              working, so you can see why it is right and not only what it is.
            </p>
            <p className={styles.me}>I am Sara. I built these notes because I needed them.</p>
            <p className={styles.me}>
              <a href="https://www.youtube.com/@notes-by-sara" target="_blank" rel="noopener noreferrer" style={{color: '#E3C26F', textDecoration: 'underline', textUnderlineOffset: '3px'}}>
                Watch the lessons on YouTube ↗
              </a>
            </p>
          </div>
        </section>

        <section className={styles.tilesWrap}>
          <div className={styles.tiles}>
            {TILES.map((t) => (
              <Link key={t.name} to={t.to} className={styles.tile}>
                <div className={styles.kicker}>{t.kicker}</div>
                <div className={styles.tileName}>{t.name}</div>
                <div className={styles.tileText}>{t.text}</div>
                <div className={styles.cta}>{t.cta}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.how}>
          <div className={styles.howInner}>
            <div className={styles.howKicker}>How it works</div>
            <h2 className={styles.howTitle}>One path, and every note follows the same pattern.</h2>
            <p className={styles.howLead}>
              Each topic builds on the one before it, so you are never asked to use something you
              have not met yet.
            </p>
            <ol className={styles.path}>
              {STEPS.map((s) => (
                <li key={s.n} className={styles.pathStep}>
                  <span className={styles.pathNum} aria-hidden="true">{s.n}</span>
                  <div>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepText}>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.corrWrap}>
          <div className={styles.corr}>
            <div className={styles.corrMain}>
              <div className={styles.corrTitle}>Corrections and requests</div>
              <p className={styles.corrText}>
                I am one person, so mistakes will happen. If you find one, or want a topic
                explained, send me a message.
              </p>
              <Link className={styles.mail} to="/contact">
                Send me a message
              </Link>
            </div>
            <p className={styles.legal}>
              Everything on this site is for education only. It is not financial, investment or
              professional advice.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
