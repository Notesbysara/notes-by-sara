// Instant client-side search for the dictionary. No library needed:
// 1,500 terms is small enough to rank on every keystroke.

/** Lowercase, drop accents and apostrophes, turn punctuation into spaces.
 *  "P/E" -> "p e", "401(k)" -> "401 k", "Price-to-Earnings" -> "price to earnings". */
export function normalize(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
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
  if (e.nTerm === nq || e.names.includes(nq)) return 1000;
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

/** Returns the positions (in the original sorted list) that match, best first. */
export function searchPositions(index, query) {
  const nq = normalize(query);
  if (!nq) return null; // no search: caller shows everything alphabetically
  const qWords = words(nq);
  const hits = [];
  for (const e of index) {
    const s = scoreEntry(e, nq, qWords);
    if (s > 0) hits.push([s, e.position]);
  }
  hits.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  return hits.map((h) => h[1]);
}
