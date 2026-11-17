import React from 'react';
import styles from './signup.module.css';

// The sample pages inside the book. They show what the PDF looks like.
const PAGES = [
  ['Compound Interest', 'Beginner', 'Interest calculated on both the original amount and the interest already earned.', '1,000 at 5% a year becomes 1,628.89 in 10 years.'],
  ['Diversification', 'Beginner', 'Spreading money across different assets so one loss does not sink the whole portfolio.', 'Holding shares in 20 industries instead of one.'],
  ['P/E Ratio', 'Beginner', 'Share price divided by earnings per share. A quick way to compare how richly shares are priced.', 'Price 50, earnings per share 5: the P/E is 10.'],
  ['Opportunity Cost', 'Beginner', 'What you give up by choosing one option over the next best one.', 'Spending 500 on a trip means not investing 500.'],
  ['Working Capital', 'Beginner', 'Current assets minus current liabilities: the cash a business has to run day to day.', 'Assets 600, liabilities 400: working capital is 200.'],
  ['Inflation', 'Beginner', 'A general rise in prices over time, so each unit of money buys less.', "At 3% a year, today's 100 buys about 97 worth next year."],
  ['Net Present Value', 'Intermediate', 'The value today of future cash flows, minus what the investment costs. Above zero means it adds value.', 'Pay 900 now for 1,000 in a year at 5%: NPV is 52.38.'],
  ['Current Ratio', 'Intermediate', 'Current assets divided by current liabilities. Above 1 means short-term bills are covered.', '600 divided by 400 gives a current ratio of 1.50.'],
  ['Beta', 'Intermediate', 'How strongly a share moves compared with the whole market. Above 1 means it swings more.', 'Beta of 1.5: it tends to rise 15% when the market rises 10%.'],
  ['Put Option', 'Advanced', 'The right, but not the obligation, to sell an asset at a set price before a set date.', 'Right to sell at 100 when the price falls to 80 gains 20, before the premium.'],
];

function Page({n, side, title, level, text, example, boxLabel = 'Example'}) {
  return (
    <div className={`${styles.pgc} ${side === 'r' ? styles.r : styles.l}`}>
      <div className={styles.pgn}>{n}</div>
      <div className={styles.pt}>{title}</div>
      {level ? <div className={styles.pl}>{level}</div> : null}
      <div className={styles.pd}>{text}</div>
      <div className={styles.pe}>
        <b>{boxLabel}</b>
        {example}
      </div>
    </div>
  );
}

/**
 * The chosen design: a 3D book. The cover opens, the pages turn, then it closes again.
 * Pure CSS, no scripts. With "reduce motion" switched on, it stays closed.
 * `scale` shrinks the whole book (the design is drawn at 480 x 340).
 */
const DICTIONARY_BOOK = {
  pages: PAGES,
  boxLabel: 'Example',
  coverTitle: 'Financial Dictionary',
  coverSub: 'Quick Reference',
  coverFoot: 'Plain-English finance terms',
  lastTitle: 'And many more',
  lastText: 'Every term has a plain-English meaning and a difficulty level, so you know where to start.',
};

export default function BookArt({scale = 1, className = '', book = DICTIONARY_BOOK}) {
  const pages = book.pages;
  const leaves = [0, 1, 2, 3, 4].map((i) => ({front: pages[i * 2], back: pages[i * 2 + 1]}));
  return (
    <div
      className={`${styles.stageBox} ${className}`}
      style={{'--s': scale}}
      aria-hidden="true">
      <div className={styles.stage}>
        <div className={styles.book}>
          <div className={styles.gsh} />
          <div className={styles.base}>
            <div className={`${styles.face} ${styles.pf}`} style={{backfaceVisibility: 'visible'}}>
              <div className={`${styles.pgc} ${styles.r}`}>
                <div className={styles.pgn}>11</div>
                <div className={styles.pt}>{book.lastTitle}</div>
                <div className={styles.pd}>{book.lastText}</div>
                <div className={styles.pe}>
                  <b>Free PDF</b>
                  Sign up to get it.
                </div>
              </div>
            </div>
          </div>
          {leaves.map((lf, i) => (
            <div key={i} className={`${styles.leaf} ${styles['lf' + i]}`}>
              <div className={`${styles.face} ${styles.pf}`}>
                <Page n={i * 2 + 1} side="r" title={lf.front[0]} level={lf.front[1]} text={lf.front[2]} example={lf.front[3]} boxLabel={book.boxLabel} />
              </div>
              <div className={`${styles.face} ${styles.pb}`}>
                <Page n={i * 2 + 2} side="l" title={lf.back[0]} level={lf.back[1]} text={lf.back[2]} example={lf.back[3]} boxLabel={book.boxLabel} />
              </div>
            </div>
          ))}
          <div className={styles.cover}>
            <div className={`${styles.face} ${styles.front}`}>
              <div>
                <div className={styles.coverBar} />
                <div className={styles.coverTitle}>{book.coverTitle}</div>
                <div className={styles.coverSub}>{book.coverSub}</div>
              </div>
              <div className={styles.coverFoot}>{book.coverFoot}</div>
            </div>
            <div className={`${styles.face} ${styles.cback}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small closed cover for the phone strip. No animation. */
export function MiniCover({className = ''}) {
  return (
    <div className={`${styles.mini} ${className}`} aria-hidden="true">
      <span className={styles.miniBar} />
      <span className={styles.miniText}>NS</span>
    </div>
  );
}
