import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BookArt from '../components/signup/BookArt';
import SignupForm from '../components/signup/SignupForm';
import {PDF_TITLE} from '../components/signup/config';
import styles from './free-pdf.module.css';

const STEPS = [
  ['Enter your email.', 'Tick the box to agree.'],
  ['Download the PDF.', 'The button appears on this page straight away.'],
  ['Check your inbox.', 'A copy of the link is sent to your email too.'],
];

export default function FreePdf() {
  return (
    <Layout
      title={`Free ${PDF_TITLE} (PDF)`}
      description="Free PDF of key finance terms in plain English, each with a difficulty level. Works on your phone or printed out.">
      <Head>
        <meta property="og:type" content="website" />
      </Head>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.bookHolder}>
            <BookArt scale={0.95} />
          </div>
          <div className={styles.text}>
            <p className={styles.kicker}>Free {PDF_TITLE}</p>
            <h1 className={styles.title}>Keep the key finance terms in your pocket</h1>
            <ul className={styles.list}>
              <li>A plain-English meaning for every term</li>
              <li>A difficulty level so you know where to start</li>
              <li>Works on your phone or printed out</li>
            </ul>
            <SignupForm idPrefix="page" />
          </div>
        </section>

        <section className={styles.how} aria-labelledby="how-title">
          <h2 id="how-title" className={styles.howTitle}>
            How it works
          </h2>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li key={s[0]} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span>
                  <b>{s[0]}</b> {s[1]}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Layout>
  );
}
