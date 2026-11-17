// Instant client-side search for the Dictionary and the Formulas. No library needed:
// a few thousand entries are small enough to rank on every keystroke.
// On top of plain matching it understands everyday phrases (searchThesaurus.js),
// forgives small typos, and ignores word order.
import {THESAURUS} from './searchThesaurus';

/** Lowercase, drop accents and apostrophes, turn punctuation into spaces.
 *  "P/E" -> "p e", "401(k)" -> "401 k", "Price-to-Earnings" -> "price to earnings". */
export function normalize(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    // British and American spellings find the same thing.
    .replace(/isation/g, 'ization')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function words(text) {
  return text ? text.split(' ') : [];
}

/** Text inside the last pair of brackets in a term, e.g. "Net Present Value (NPV)" -> "npv". */
function abbreviationOf(term) {
  const m = term.match(/\(([^)]+)\)\s*$/);
  return m ? normalize(m[1]) : '';
}

/** Build the searchable index once, when the page loads. */
export function buildIndex(terms) {
  return terms.map((t, position) => {
    const nTerm = normalize(t.term);
    const nAliases = t.also_known_as.map(normalize).filter(Boolean);
    const names = [nTerm, ...nAliases];
    const nameWords = new Set();
    names.forEach((n) => words(n).forEach((w) => nameWords.add(w)));
    return {
      position,
      nTerm,
      abbr: abbreviationOf(t.term),
      names,
      nameWords: [...nameWords],
      defWords: words(normalize(t.definition)),
    };
  });
}

/** The same index for the Formula Library: name and other names, plus what it finds and needs. */
export function buildFormulaIndex(formulas) {
  return formulas.map((f, position) => {
    const nTerm = normalize(f.name);
    const nAliases = (f.aliases || []).map(normalize).filter(Boolean);
    const names = [nTerm, ...nAliases];
    const nameWords = new Set();
    names.forEach((n) => words(n).forEach((w) => nameWords.add(w)));
    return {
      position,
      nTerm,
      abbr: abbreviationOf(f.name),
      names,
      nameWords: [...nameWords],
      defWords: words(normalize(`${f.finds} ${f.needs} ${f.section} ${f.topic}`)),
    };
  });
}

function hasWord(list, qw, exactOnly) {
  let best = 0;
  for (const w of list) {
    if (w === qw) return 3;
    if (!exactOnly && w.startsWith(qw)) best = 1;
  }
  return best;
}

function containsPhrase(name, phrase) {
  return (` ${name} `).includes(` ${phrase} `);
}

function scoreEntry(e, nq, qWords) {
  // 1. The whole query is the term, one of its other names, or its abbreviation.
  if (e.nTerm === nq) return 1000;
  if (e.names.includes(nq)) return 950;
  if (e.abbr && e.abbr === nq) return 900;

  // 2. The query appears as a whole phrase inside a name.
  for (const n of e.names) {
    if (n.startsWith(`${nq} `)) return 700 - Math.min(n.length, 99) / 100;
  }
  for (const n of e.names) {
    if (containsPhrase(n, nq)) return 600 - Math.min(n.length, 99) / 100;
  }

  // 3. Every query word matches a word in the term or its other names.
  let nameScore = 0;
  let ok = true;
  for (const qw of qWords) {
    const s = hasWord(e.nameWords, qw, qw.length === 1);
    if (!s) {
      ok = false;
      break;
    }
    nameScore += s;
  }
  if (ok) return 300 + nameScore;

  // 4. Every query word appears in the definition (lowest rank).
  let defScore = 0;
  for (const qw of qWords) {
    const s = hasWord(e.defWords, qw, qw.length === 1);
    if (!s) return 0;
    defScore += s;
  }
  return 100 + defScore;
}

function rawHits(index, nq) {
  const qWords = words(nq);
  const hits = new Map();
  for (const e of index) {
    const sc = scoreEntry(e, nq, qWords);
    if (sc > 0) hits.set(e.position, sc);
  }
  return hits;
}

const THES = THESAURUS.map(([from, to]) => [from.map(normalize), to.map(normalize)]);

/** The everyday phrases in a query that the thesaurus knows, and what they mean. */
export function relatedSearches(query) {
  const nq = normalize(query);
  if (!nq) return [];
  const padded = ` ${nq} `;
  const out = [];
  THES.forEach(([from, to]) => {
    if (from.some((p) => padded.includes(` ${p} `))) to.forEach((t) => !out.includes(t) && out.push(t));
  });
  return out;
}

function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  let prev = Array.from({length: b.length + 1}, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const cur = [i];
    for (let j = 1; j <= b.length; j += 1) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

const vocabCache = new WeakMap();
function vocabOf(index) {
  if (!vocabCache.has(index)) {
    const v = new Set();
    index.forEach((e) => e.nameWords.forEach((w) => v.add(w)));
    vocabCache.set(index, [...v]);
  }
  return vocabCache.get(index);
}

/** Swaps each unknown word for the closest known one, so "ammortization" finds "amortization". */
function correctTypos(index, nq) {
  const vocab = vocabOf(index);
  const known = new Set(vocab);
  const fixed = words(nq).map((w) => {
    if (known.has(w) || w.length < 4) return w;
    let best = w;
    let bestD = 9;
    for (const v of vocab) {
      const d = editDistance(w, v);
      if (d < bestD) {
        bestD = d;
        best = v;
      }
    }
    return bestD <= (w.length >= 8 ? 2 : 1) ? best : w;
  });
  return fixed.join(' ');
}

/** Returns the positions (in the original sorted list) that match, best first. */
export function searchPositions(index, query) {
  const nq = normalize(query);
  if (!nq) return null; // no search: caller shows everything in its normal order
  const best = rawHits(index, nq);
  const merge = (hits, weight) => {
    hits.forEach((sc, pos) => {
      const v = sc * weight;
      if (!best.has(pos) || best.get(pos) < v) best.set(pos, v);
    });
  };
  // Everyday phrases: also show what they usually mean, after the direct matches.
  // The first meanings in a thesaurus row count a little more than the later ones.
  relatedSearches(query).forEach((t, k) => merge(rawHits(index, t), Math.max(0.6, 0.85 - k * 0.03)));
  // Few or no matches: try again with typos corrected.
  if (best.size < 3) {
    const fixed = correctTypos(index, nq);
    if (fixed !== nq) merge(rawHits(index, fixed), 0.9);
  }
  return [...best.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map((h) => h[0]);
}
