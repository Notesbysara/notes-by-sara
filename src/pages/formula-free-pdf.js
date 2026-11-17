import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import BookArt from '../components/signup/BookArt';
import {FORMULA_BOOK} from '../components/signup/formulaBook';
import SignupForm from '../components/signup/SignupForm';
import {FORMULA_PDF_PATH, FORMULA_PDF_TITLE, ML_FORM_FORMULAS} from '../components/signup/config';
import styles from './free-pdf.module.css';

const STEPS_SIGNUP = [
  ['Enter your email.', 'Tick the box to agree.'],
  ['Download the PDF.', 'The button appears on this page straight away.'],
  ['Check your inbox.', 'A copy of the link is sent to your email too.'],
];
const STEPS_DIRECT = [
  ['Download the PDF.', "Tap the button. It's free."],
  ['Keep it on your phone.', 'Or print it out.'],
  ['Tap a formula name.', 'It opens that formula on the site, with a worked example and a calculator.'],
];

export default function FormulaFreePdf() {
  const pdfUrl = useBaseUrl(FORMULA_PDF_PATH);
  const steps = ML_FORM_FORMULAS ? STEPS_SIGNUP : STEPS_DIRECT;
  return (
    <Layout
      title={`Free ${FORMULA_PDF_TITLE} (PDF)`}
      description="Free PDF of all 522 finance formulas, grouped into seven subjects, each with what it finds. Works on your phone or printed out.">
      <Head>
        <meta property="og:type" content="website" />
      </Head>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.bookHolder}>
            <BookArt scale={0.95} book={FORMULA_BOOK} />
          </div>
          <div className={styles.text}>
            <p className={styles.kicker}>Free {FORMULA_PDF_TITLE}</p>
            <h1 className={styles.title}>Every finance formula in one free PDF</h1>
            <ul className={styles.list}>
              <li>All 522 formulas, grouped into seven subjects</li>
              <li>What each one finds, in one line</li>
              <li>Tap a name to open its calculator on the site</li>
            </ul>
            {ML_FORM_FORMULAS ? (
              <SignupForm idPrefix="formula" pdfPath={FORMULA_PDF_PATH} pdfTitle={FORMULA_PDF_TITLE} form={ML_FORM_FORMULAS} />
            ) : (
              <p className={styles.direct}>
                <a className={styles.directBtn} href={pdfUrl} download>
                  Download the free PDF
                </a>
              </p>
            )}
            <p className={styles.also}>
              Looking for terms instead? Get the free <Link to="/dictionary-free-pdf">Financial Dictionary Quick Reference</Link>.
            </p>
          </div>
        </section>

        <section className={styles.how} aria-labelledby="how-title">
          <h2 id="how-title" className={styles.howTitle}>
            How it works
          </h2>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
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
