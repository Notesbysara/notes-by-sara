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
const GROUPS = [
  {name: 'Foundations', subjects: ['Finance Foundations']},
  {name: 'Companies and valuation', subjects: ['Corporate Finance', 'Valuation', 'Financial Statement Analysis']},
  {name: 'Markets and instruments', subjects: ['Investments & Portfolio Theory', 'Equity Markets', 'Fixed Income', 'Derivatives']},
  {name: 'Risk and quantitative methods', subjects: ['Risk Management', 'Quantitative Finance']},
  {name: 'Money, banks and the economy', subjects: ['Economics for Finance', 'Banking & Financial Institutions', 'International Finance']},
  {name: 'Personal finance', subjects: ['Personal Finance']},
  {name: 'Modern finance and practice', subjects: ['Behavioral Finance', 'Alternative Investments', 'Fintech & Digital Finance', 'Regulation, Ethics & ESG']},
];
const SUBJECT_GROUP = {};
GROUPS.forEach((g) => g.subjects.forEach((x) => {
  SUBJECT_GROUP[x] = g.name;
}));
const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
const introFor = (count) => `Clear, plain-English explanations of ${count.toLocaleString('en-US')} finance terms.`;

function readUrl() {
  const p = new URLSearchParams(window.location.search);
  const level = p.get('level');
  const letter = (p.get('letter') || '').toUpperCase();
  return {
    q: p.get('q') || '',
    level: LEVELS.includes(level) ? level : 'All',
    letter: LETTERS.includes(letter) ? letter : '',
    topic: p.get('topic') || '',
    savedOnly: p.get('saved') === '1',
  };
}

export default function DictionaryPage({terms}) {
  const {siteConfig} = useDocusaurusContext();
  const INTRO = introFor(terms.length);
  const history = useHistory();
  const searchRef = useRef(null);
  const ready = useRef(false);

  const [q, setQ] = useState('');
  const [level, setLevel] = useState('All');
  const [letter, setLetter] = useState('');
  const [topic, setTopic] = useState('');
  const [openGroup, setOpenGroup] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {saved, toggle} = useSavedTerms();
  const {share, notice} = useShare();
  const index = useMemo(() => buildIndex(terms), [terms]);

  // Read the address bar once the page is on screen.
  useEffect(() => {
    const s = readUrl();
    setQ(s.q);
    setLevel(s.level);
    setLetter(s.letter);
    setTopic(s.topic);
    setOpenGroup(SUBJECT_GROUP[s.topic] || (GROUPS.some((g) => g.name === s.topic) ? s.topic : ''));
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
    if (topic) p.set('topic', topic);
    if (savedOnly) p.set('saved', '1');
    const qs = p.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, '', next);
    }
  }, [q, level, letter, topic, savedOnly]);

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
  }, [q, level, letter, topic, savedOnly]);

  const savedSet = useMemo(() => new Set(saved), [saved]);

  // The search and the Saved filter. Level and letter are applied on top of this.
  const base = useMemo(() => {
    const positions = searchPositions(index, q);
    const all = positions || terms.map((_, i) => i);
    return savedOnly ? all.filter((i) => savedSet.has(terms[i].id)) : all;
  }, [index, terms, q, savedOnly, savedSet]);

  const inTopic = useCallback(
    (t) => !topic || t.section === topic || SUBJECT_GROUP[t.section] === topic,
    [topic],
  );

  // How many terms each section and group has with the current search (topic itself not applied).
  const topicCounts = useMemo(() => {
    const c = {};
    base.forEach((i) => {
      const sec = terms[i].section;
      c[sec] = (c[sec] || 0) + 1;
      const g = SUBJECT_GROUP[sec];
      if (g) c[g] = (c[g] || 0) + 1;
    });
    return c;
  }, [base, terms]);

  // Everything except the letter filter, so the letter grid can grey out empty letters.
  const beforeLetter = useMemo(
    () =>
      base.filter((i) => inTopic(terms[i]) && (level === 'All' || terms[i].difficulty === level)),
    [base, terms, level, inTopic],
  );

  const results = useMemo(
    () => (letter ? beforeLetter.filter((i) => terms[i].letter === letter) : beforeLetter),
    [beforeLetter, letter, terms],
  );

  const lettersWithTerms = useMemo(() => {
    const s = new Set();
    beforeLetter.forEach((i) => s.add(terms[i].letter));
    return s;
  }, [beforeLetter, terms]);

  // How many terms each difficulty would show with the current search and letter.
  const levelCounts = useMemo(() => {
    const c = {All: 0};
    LEVELS.forEach((l) => {
      c[l] = 0;
    });
    base.forEach((i) => {
      if (letter && terms[i].letter !== letter) return;
      if (!inTopic(terms[i])) return;
      c.All += 1;
      if (c[terms[i].difficulty] !== undefined) c[terms[i].difficulty] += 1;
    });
    return c;
  }, [base, terms, letter, inTopic]);

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
    setTopic('');
    setSavedOnly(false);
  }, []);

  const filtered = q.trim() || level !== 'All' || letter || topic || savedOnly;

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
      description={`${INTRO.replace(/\.$/, '')}, from NPV and P/E ratio to share buybacks and working capital.`}>
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

        <div className={styles.layout}>
          <aside className={styles.side} aria-label="Filters">
            <button
              type="button"
              className={styles.sideToggle}
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}>
              <span>Filters{filtered ? ' (on)' : ''}</span>
              <span aria-hidden="true">{filtersOpen ? '\u25B4' : '\u25BE'}</span>
            </button>

            <div className={filtersOpen ? `${styles.sideBody} ${styles.sideOpen}` : styles.sideBody}>
              <h2 className={styles.sideHead}>Topics</h2>
              <div role="group" aria-label="Filter by topic" className={styles.sideList}>
                <button
                  type="button"
                  className={!topic ? styles.sideItemOn : styles.sideItem}
                  aria-pressed={!topic}
                  onClick={() => setTopic('')}>
                  <span>All topics</span>
                  <b>{base.length.toLocaleString('en-US')}</b>
                </button>
                {GROUPS.map((g) => {
                  const open = openGroup === g.name;
                  const groupOn = topic === g.name;
                  return (
                    <div key={g.name}>
                      <button
                        type="button"
                        className={groupOn ? styles.sideItemOn : styles.groupBtn}
                        aria-expanded={open}
                        onClick={() => {
                          setOpenGroup(open && !groupOn ? '' : g.name);
                          setTopic(g.name);
                        }}>
                        <span>
                          <span aria-hidden="true">{open ? '\u25BE ' : '\u25B8 '}</span>
                          {g.name}
                        </span>
                        <b>{(topicCounts[g.name] || 0).toLocaleString('en-US')}</b>
                      </button>
                      {open && g.subjects.length > 1 && (
                        <div className={styles.subList}>
                          {g.subjects.map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              className={topic === sub ? styles.sideItemOn : styles.subItem}
                              aria-pressed={topic === sub}
                              onClick={() => setTopic(sub)}>
                              <span>{sub}</span>
                              <b>{(topicCounts[sub] || 0).toLocaleString('en-US')}</b>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <h2 className={styles.sideHead}>Saved</h2>
              <div className={styles.sideList}>
                <button
                  type="button"
                  className={savedOnly ? styles.sideItemOn : styles.sideItem}
                  aria-pressed={savedOnly}
                  onClick={() => setSavedOnly((v) => !v)}>
                  <span>Saved terms</span>
                  <b>{saved.length}</b>
                </button>
              </div>

              {filtered && (
                <button type="button" className={styles.clear} onClick={clearAll}>
                  Clear search and filters
                </button>
              )}
            </div>
          </aside>

          <div className={styles.mainCol}>
            <div role="group" aria-label="Filter by difficulty" className={styles.pillRow}>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={level === l ? styles.pillOn : styles.pill}
                  aria-pressed={level === l}
                  onClick={() => setLevel(l)}>
                  {l === 'All' ? 'All levels' : l} <span>{levelCounts[l].toLocaleString('en-US')}</span>
                </button>
              ))}
            </div>

            <nav className={styles.letterBar} aria-label="Filter by first letter">
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

            <p id="dictionary-count" className={styles.countLine} aria-live="polite">
              Showing {results.length.toLocaleString('en-US')} {results.length === 1 ? 'term' : 'terms'}{topic ? ` in ${topic}` : ''}
            </p>

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
      </div>

      <div className={styles.toastWrap} role="status" aria-live="polite">
        {notice && <div className={styles.toast}>{notice}</div>}
      </div>
    </Layout>
  );
}
