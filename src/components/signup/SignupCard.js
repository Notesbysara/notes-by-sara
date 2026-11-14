import React from 'react';
import BookArt from './BookArt';
import SignupForm from './SignupForm';
import {PDF_TITLE} from './config';
import styles from './signup.module.css';

/** The main sign-up. Sits at the bottom of every dictionary term page. Always safe for search ranking. */
export default function SignupCard() {
  return (
    <section className={styles.card} id="free-pdf" aria-labelledby="free-pdf-title">
      <BookArt scale={0.62} />
      <div className={styles.cardBody}>
        <p className={styles.kicker}>Free {PDF_TITLE}</p>
        <h2 id="free-pdf-title" className={styles.cardTitle}>
          Keep the key finance terms in your pocket
        </h2>
        <ul className={styles.cardList}>
          <li>A plain-English meaning for every term</li>
          <li>A difficulty level so you know where to start</li>
          <li>Works on your phone or printed out</li>
        </ul>
        <SignupForm idPrefix="card" />
      </div>
    </section>
  );
}
