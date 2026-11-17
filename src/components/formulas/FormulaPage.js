import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';
import styles from '../dictionary/dictionary.module.css';
import fstyles from './formulas.module.css';
import {SearchIcon} from '../dictionary/Icons';
import {buildFormulaIndex, searchPositions, relatedSearches} from '../../lib/dictionarySearch';
import {useSavedFormulas} from '../../lib/savedTerms';
import useShare from '../dictionary/useShare';
import FormulaCard from './FormulaCard';

// Same layout and behavior as the Financial Dictionary page, for the 522 formulas.
const PAGE_SIZE = 30;
const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
const letterOf = (name) => {
  const c = name.trim().charAt(0).toUpperCase();
  return c >= 'A' && c <= 'Z' ? c : '#';
};

function readUrl(levels) {
  const p = new URLSearchParams(window.location.search);
  const level = p.get('level');
  const letter = (p.get('letter') || '').toUpperCase();
  return {
    q: p.get('q') || '',
    level: levels.includes(level) ? level : 'All',
    letter: LETTERS.includes(letter) ? letter : '',
    topic: p.get('topic') || '',
    savedOnly: p.get('saved') === '1',
  };
}

export default function FormulaPage({formulas, groups}) {
  const {siteConfig} = useDocusaurusContext();
  const history = useHistory();
  const searchRef = useRef(null);
  const ready = useRef(false);

  const GROUPS = useMemo(() => groups.map(([name, subjects]) => ({name, subjects})), [groups]);
  const SUBJECT_GROUP = useMemo(() => {
    const m = {};
    GROUPS.forEach((g) => g.subjects.forEach((s) => {
      m[s] = g.name;
    }));
    return m;
  }, [GROUPS]);
  // Only show the levels that have formulas.
  const LEVELS = useMemo(() => {
    const has = new Set(formulas.map((f) => f.level));
    return ['All', ...['Beginner', 'Intermediate', 'Advanced'].filter((l) => has.has(l))];
  }, [formulas]);
  const INTRO = `${formulas.length.toLocaleString('en-US')} formulas, each with a worked example and a calculator that shows its steps.`;

  const [q, setQ] = useState('');
  const [level, setLevel] = useState('All');
  const [letter, setLetter] = useState('');
  const [topic, setTopic] = useState('');
  const [openGroup, setOpenGroup] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const {saved, toggle} = useSavedFormulas();
  const {share, notice} = useShare();
  const savedSet = useMemo(() => new Set(saved), [saved]);

  const index = useMemo(() => buildFormulaIndex(formulas), [formulas]);

  useEffect(() => {
    const s = readUrl(LEVELS);
    setQ(s.q);
    setLevel(s.level);
    setLetter(s.letter);
    setTopic(s.topic);
    setSavedOnly(s.savedOnly);
    setOpenGroup(SUBJECT_GROUP[s.topic] || (GROUPS.some((g) => g.name === s.topic) ? s.topic : ''));
    ready.current = true;
  }, [LEVELS, SUBJECT_GROUP, GROUPS]);

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

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q, level, letter, topic, savedOnly]);

  const base = useMemo(() => {
    const positions = searchPositions(index, q);
    const all = positions || formulas.map((_, i) => i);
    return savedOnly ? all.filter((i) => savedSet.has(formulas[i].slug)) : all;
  }, [index, formulas, q, savedOnly, savedSet]);
  const related = useMemo(() => relatedSearches(q), [q]);

  const inTopic = useCallback(
    (f) => !topic || f.subject === topic || f.group === topic,
    [topic],
  );

  const topicCounts = useMemo(() => {
    const c = {};
    base.forEach((i) => {
      const f = formulas[i];
      c[f.subject] = (c[f.subject] || 0) + 1;
      c[f.group] = (c[f.group] || 0) + 1;
    });
    return c;
  }, [base, formulas]);

  const beforeLetter = useMemo(
    () => base.filter((i) => inTopic(formulas[i]) && (level === 'All' || formulas[i].level === level)),
    [base, formulas, level, inTopic],
  );
  const results = useMemo(
    () => (letter ? beforeLetter.filter((i) => letterOf(formulas[i].name) === letter) : beforeLetter),
    [beforeLetter, letter, formulas],
  );
  const lettersWith = useMemo(() => {
    const s = new Set();
    beforeLetter.forEach((i) => s.add(letterOf(formulas[i].name)));
    return s;
  }, [beforeLetter, formulas]);
  const levelCounts = useMemo(() => {
    const c = {};
    LEVELS.forEach((l) => {
      c[l] = 0;
    });
    base.forEach((i) => {
      const f = formulas[i];
      if (letter && letterOf(f.name) !== letter) return;
      if (!inTopic(f)) return;
      c.All += 1;
      if (c[f.level] !== undefined) c[f.level] += 1;
    });
    return c;
  }, [base, formulas, letter, inTopic, LEVELS]);

  const shown = results.slice(0, visible);

  const onSearchKey = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      history.push(`/formula-library/${formulas[results[0]].slug}`);
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Notes by Sara Financial Formula & Calculator Library',
    description: INTRO,
    url: `${siteConfig.url}/formula-library`,
    inLanguage: 'en',
    publisher: {'@type': 'Organization', name: 'Notes by Sara', url: siteConfig.url},
  };

  return (
    <Layout
      title="Financial Formula & Calculator Library"
      description={`${INTRO.replace(/\.$/, '')}: from NPV and loan payments to ratios, bonds and options.`}>
      <Head>
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
      </Head>

      <div className={styles.page}>
        <header className={styles.band}>
          <div className={styles.bandInner}>
            <h1 className={styles.bandTitle}>Financial Formulas</h1>
            <p className={styles.bandIntro}>{INTRO}</p>
            <form className={styles.searchForm} role="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="formula-search" className={styles.srOnly}>
                Search the formulas
              </label>
              <span className={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                id="formula-search"
                ref={searchRef}
                type="search"
                className={styles.searchInput}
                placeholder="Search: NPV, loan payment, how risky"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onSearchKey}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                enterKeyHint="go"
                aria-describedby="formula-count"
              />
              <kbd className={styles.slashHint} aria-hidden="true">
                /
              </kbd>
            </form>
            <Link className={styles.pdfLink} to="/formula-free-pdf">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M3 2.5h8a1.5 1.5 0 0 1 1.5 1.5v9.5H4.5A1.5 1.5 0 0 1 3 12V2.5z" />
                <path d="M3 12a1.5 1.5 0 0 1 1.5-1.5h8" />
              </svg>
              Get the free Financial Formulas Cheat Sheet (PDF)
            </Link>
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
                  <span>All formulas</span>
                  <b>{base.length.toLocaleString('en-US')}</b>
                </button>
                {GROUPS.map((g) => {
                  const open = openGroup === g.name;
                  const groupOn = topic === g.name;
                  const subs = g.subjects.filter((s) => formulas.some((f) => f.subject === s));
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
                      {open && subs.length > 1 && (
                        <div className={styles.subList}>
                          {subs.map((sub) => (
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
                  <span>Saved formulas</span>
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
            <div role="group" aria-label="Filter by level" className={styles.pillRow}>
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
                const has = lettersWith.has(l);
                const active = letter === l;
                return (
                  <button
                    key={l}
                    type="button"
                    className={active ? styles.letterActive : styles.letter}
                    aria-pressed={active}
                    aria-label={l === '#' ? 'Formulas starting with a number' : `Formulas starting with ${l}`}
                    disabled={!has && !active}
                    onClick={() => setLetter(active ? '' : l)}>
                    {l}
                  </button>
                );
              })}
            </nav>

            <p id="formula-count" className={styles.countLine} aria-live="polite">
              Showing {results.length.toLocaleString('en-US')} {results.length === 1 ? 'formula' : 'formulas'}
              {topic ? ` in ${topic}` : ''}
            </p>
            {related.length > 0 && results.length > 0 && (
              <p className={fstyles.related}>Also showing formulas for {related.slice(0, 3).join(', ')}, which match what you typed.</p>
            )}

            <section aria-label="Formulas">
              {shown.map((i) => (
                <FormulaCard
                  key={formulas[i].slug}
                  f={formulas[i]}
                  isSaved={savedSet.has(formulas[i].slug)}
                  onToggleSave={toggle}
                  onShare={share}
                />
              ))}
              {results.length === 0 && savedOnly && saved.length === 0 && (
                <div className={styles.empty}>
                  <p>You have not saved any formulas yet. Use the bookmark icon on a formula to save it here.</p>
                </div>
              )}
              {results.length === 0 && !(savedOnly && saved.length === 0) && (
                <div className={styles.empty}>
                  <p>
                    No formula matches that yet. Try a shorter word, or look the term up in the{' '}
                    <Link to={`/dictionary${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`}>Financial Dictionary</Link>.
                  </p>
                </div>
              )}
              {results.length > shown.length && (
                <div className={styles.more}>
                  <button type="button" className={styles.moreBtn} onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Show more formulas
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
