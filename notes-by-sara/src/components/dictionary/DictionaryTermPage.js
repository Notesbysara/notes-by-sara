import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './dictionary.module.css';
import {BookmarkIcon, ShareIcon} from './Icons';
import useShare from './useShare';
import {useSavedTerms} from '../../lib/savedTerms';

/** About 155 characters, cut at a word boundary. */
function metaDescription(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= 155) return clean;
  const cut = clean.slice(0, 154);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s-]+$/, '')}…`;
}

export default function DictionaryTermPage({entry}) {
  const {siteConfig} = useDocusaurusContext();
  const {saved, toggle} = useSavedTerms();
  const {share, notice} = useShare();
  const isSaved = saved.includes(entry.id);
  const url = `${siteConfig.url}/dictionary/${entry.slug}`;
  const description = metaDescription(entry.definition);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.term,
    description: entry.definition,
    termCode: entry.id,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Notes by Sara Financial Dictionary',
      url: `${siteConfig.url}/dictionary`,
    },
  };
  if (entry.also_known_as.length > 0) jsonLd.alternateName = entry.also_known_as;

  return (
    <Layout title={`${entry.term}: Definition and Explanation`} description={description}>
      <Head>
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
      </Head>

      <div className={styles.page}>
        <div className={styles.termBand}>
          <div className={styles.termBandInner}>
            <Link to="/dictionary" className={styles.backLinkBand}>
              &larr; Back to dictionary
            </Link>
          </div>
        </div>

        <main className={styles.column}>
          <article className={styles.termArticle}>
            <div className={styles.termHead}>
              <h1 className={styles.termTitle}>{entry.term}</h1>
              <span className={styles.badge}>{entry.difficulty}</span>
            </div>

            {entry.also_known_as.length > 0 && (
              <p className={styles.aka}>
                <span className={styles.akaLabel}>Also known as:</span> {entry.also_known_as.join(', ')}
              </p>
            )}

            <section className={styles.definitionBox} aria-label="Definition">
              <p>{entry.definition}</p>
            </section>

            <section className={styles.termBody} aria-label="Explanation">
              {entry.explanation.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {entry.note && <p className={styles.note}>Note: {entry.note.replace(/^Note:\s*/i, '')}</p>}
            </section>

            <div className={styles.termActions}>
              <button
                type="button"
                className={styles.textBtn}
                aria-pressed={isSaved}
                onClick={() => toggle(entry.id)}>
                <BookmarkIcon filled={isSaved} />
                <span>{isSaved ? 'Saved' : 'Save this term'}</span>
              </button>
              <button type="button" className={styles.textBtn} onClick={() => share(entry.term, entry.slug)}>
                <ShareIcon />
                <span>Share</span>
              </button>
            </div>

            <p className={styles.cta}>
              For worked examples and full lessons, visit <Link to="/">notesbysara.org</Link>.
            </p>
          </article>

          <nav className={styles.prevNext} aria-label="Previous and next term">
            {entry.prev ? (
              <Link to={`/dictionary/${entry.prev.slug}`} className={styles.prevNextLink} rel="prev">
                <span className={styles.prevNextLabel}>&larr; Previous</span>
                <span className={styles.prevNextTerm}>{entry.prev.term}</span>
              </Link>
            ) : (
              <span />
            )}
            {entry.next ? (
              <Link
                to={`/dictionary/${entry.next.slug}`}
                className={`${styles.prevNextLink} ${styles.prevNextRight}`}
                rel="next">
                <span className={styles.prevNextLabel}>Next &rarr;</span>
                <span className={styles.prevNextTerm}>{entry.next.term}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <p className={styles.backRow}>
            <Link to="/dictionary">Back to dictionary</Link>
          </p>
        </main>
      </div>

      <div className={styles.toastWrap} role="status" aria-live="polite">
        {notice && <div className={styles.toast}>{notice}</div>}
      </div>
    </Layout>
  );
}
