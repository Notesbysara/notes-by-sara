import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';
import styles from './dictionary.module.css';
import DictionaryCard from './DictionaryCard';
import {SearchIcon} from './Icons';
import useShare from './useShare';
import {buildIndex, searchPositions} from '../../lib/dictionarySearch';
import {useSavedTerms} from '../../lib/savedTerms';

const PAGE_SIZE = 30;
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
const INTRO = 'Clear, plain-English explanations of 1,500 finance terms.';

function readUrl() {
  const p = new URLSearchParams(window.location.search);
  const level = p.get('level');
  const letter = (p.get('letter') || '').toUpperCase();
  return {
    q: p.get('q') || '',
    level: LEVELS.includes(level) ? level : 'All',
    letter: LETTERS.includes(letter) ? letter : '',
    savedOnly: p.get('saved') === '1',
  };
}

export default function DictionaryPage({terms}) {
  const {siteConfig} = useDocusaurusContext();
  const history = useHistory();
  const searchRef = useRef(null);
  const ready = useRef(false);

  const [q, setQ] = useState('');
  const [level, setLevel] = useState('All');
  const [letter, setLetter] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const {saved, toggle} = useSavedTerms();
  const {share, notice} = useShare();
  const index = useMemo(() => buildIndex(terms), [terms]);

  // Read the address bar once the page is on screen.
  useEffect(() => {
    const s = readUrl();
    setQ(s.q);
    setLevel(s.level);
    setLetter(s.letter);
    setSavedOnly(s.savedOnly);
    ready.current = true;
  }, []);

  // Keep the address bar in step with the search and filters.
  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (level !== 'All') p.set('level', level);
    if (letter) p.set('letter', letter);
    if (savedOnly) p.set('saved', '1');
    const qs = p.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, '', next);
    }
  }, [q, level, letter, savedOnly]);

  // Press "/" anywhere to jump to the search box.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement;
      const tag = el && el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) return;
      e.preventDefault();
      searchRef.current && searchRef.current.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Start again at the first page whenever the search or a filter changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q, level, letter, savedOnly]);

  const savedSet = useMemo(() => new Set(saved), [saved]);

  // Everything except the letter filter, so the letter bar can grey out empty letters.
  const beforeLetter = useMemo(() => {
    const positions = searchPositions(index, q);
    const base = positions || terms.map((_, i) => i);
    return base.filter((i) => {
      const t = terms[i];
      if (level !== 'All' && t.difficulty !== level) return false;
      if (savedOnly && !savedSet.has(t.id)) return false;
      return true;
    });
  }, [index, terms, q, level, savedOnly, savedSet]);

  const results = useMemo(
    () => (letter ? beforeLetter.filter((i) => terms[i].letter === letter) : beforeLetter),
    [beforeLetter, letter, terms],
  );

  const lettersWithTerms = useMemo(() => {
    const s = new Set();
    beforeLetter.forEach((i) => s.add(terms[i].letter));
    return s;
  }, [beforeLetter, terms]);

  const shown = results.slice(0, visible);

  const onSearchKey = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      history.push(`/dictionary/${terms[results[0]].slug}`);
    } else if (e.key === 'Escape' && q) {
      setQ('');
    }
  };

  const clearAll = useCallback(() => {
    setQ('');
    setLevel('All');
    setLetter('');
    setSavedOnly(false);
  }, []);

  const filtered = q.trim() || level !== 'All' || letter || savedOnly;

  const pageUrl = `${siteConfig.url}/dictionary`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Notes by Sara Financial Dictionary',
    description: INTRO,
    url: pageUrl,
    inLanguage: 'en',
    publisher: {'@type': 'Organization', name: 'Notes by Sara', url: siteConfig.url},
  };

  return (
    <Layout
      title="Financial Dictionary"
      description="Clear, plain-English explanations of 1,500 finance terms, from NPV and P/E ratio to share buybacks and working capital.">
      <Head>
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
      </Head>

      <div className={styles.page}>
        <header className={styles.band}>
          <div className={styles.bandInner}>
            <h1 className={styles.bandTitle}>Financial Dictionary</h1>
            <p className={styles.bandIntro}>{INTRO}</p>
            <form className={styles.searchForm} role="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="dictionary-search" className={styles.srOnly}>
                Search the dictionary
              </label>
              <span className={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                id="dictionary-search"
                ref={searchRef}
                type="search"
                className={styles.searchInput}
                placeholder="Search: NPV, P/E, buyback"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onSearchKey}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                enterKeyHint="go"
                aria-describedby="dictionary-count"
              />
              <kbd className={styles.slashHint} aria-hidden="true">
                /
              </kbd>
            </form>
          </div>
        </header>

        <div className={styles.column}>
          <div className={styles.controls}>
            <div className={styles.controlRow}>
              <div className={styles.levels} role="group" aria-label="Filter by difficulty">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={level === l ? styles.pillActive : styles.pill}
                    aria-pressed={level === l}
                    onClick={() => setLevel(l)}>
                    {l}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={savedOnly ? styles.pillActive : styles.pill}
                aria-pressed={savedOnly}
                onClick={() => setSavedOnly((v) => !v)}>
                Saved ({saved.length})
              </button>
            </div>

            <nav className={styles.letters} aria-label="Filter by first letter">
              {LETTERS.map((l) => {
                const has = lettersWithTerms.has(l);
                const active = letter === l;
                return (
                  <button
                    key={l}
                    type="button"
                    className={active ? styles.letterActive : styles.letter}
                    aria-pressed={active}
                    aria-label={l === '#' ? 'Terms starting with a number' : `Terms starting with ${l}`}
                    disabled={!has && !active}
                    onClick={() => setLetter(active ? '' : l)}>
                    {l}
                  </button>
                );
              })}
            </nav>

            <div className={styles.countRow}>
              <p id="dictionary-count" className={styles.count} aria-live="polite">
                Showing {results.length.toLocaleString('en-US')} {results.length === 1 ? 'term' : 'terms'}
              </p>
              {filtered && (
                <button type="button" className={styles.clear} onClick={clearAll}>
                  Clear search and filters
                </button>
              )}
            </div>
          </div>

          <section aria-label="Dictionary terms">
            {shown.map((i) => (
              <DictionaryCard
                key={terms[i].id}
                entry={terms[i]}
                isSaved={savedSet.has(terms[i].id)}
                onToggleSave={toggle}
                onShare={share}
              />
            ))}

            {results.length === 0 && (
              <div className={styles.empty}>
                <p>
                  {savedOnly && saved.length === 0
                    ? 'You have not saved any terms yet. Use the bookmark icon on a term to save it here.'
                    : 'No terms match that search. Try a shorter word or another spelling, or clear the filters.'}
                </p>
              </div>
            )}

            {results.length > shown.length && (
              <div className={styles.more}>
                <button type="button" className={styles.moreBtn} onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Show more terms
                </button>
                <p className={styles.moreHint}>
                  {shown.length.toLocaleString('en-US')} of {results.length.toLocaleString('en-US')} on screen
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className={styles.toastWrap} role="status" aria-live="polite">
        {notice && <div className={styles.toast}>{notice}</div>}
      </div>
    </Layout>
  );
}
