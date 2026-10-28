const fs = require('fs');

const REQUIRED_STRINGS = ['id', 'slug', 'term', 'difficulty', 'definition'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

/**
 * Reads the dictionary JSON and checks it. Throws one error that lists every
 * problem found, so a bad file fails the build with a clear message.
 * The wording of the data is never changed here.
 */
function loadAndValidate(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`[dictionary] Data file not found: ${file}`);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`[dictionary] The data file is not valid JSON: ${e.message}`);
  }
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('[dictionary] The data file must be a non-empty array of terms.');
  }

  const problems = [];
  const slugs = new Map();
  const ids = new Map();

  data.forEach((t, i) => {
    const label = `item ${i + 1}${t && t.term ? ` (${t.term})` : ''}`;
    if (!t || typeof t !== 'object') {
      problems.push(`${label}: not an object`);
      return;
    }
    for (const key of REQUIRED_STRINGS) {
      if (typeof t[key] !== 'string' || t[key].trim() === '') {
        problems.push(`${label}: missing or empty "${key}"`);
      }
    }
    if (!Array.isArray(t.also_known_as)) {
      problems.push(`${label}: "also_known_as" must be an array`);
    }
    if (!Array.isArray(t.explanation) || t.explanation.length === 0) {
      problems.push(`${label}: "explanation" must be a non-empty array`);
    }
    if (typeof t.note !== 'string') {
      problems.push(`${label}: "note" must be a string (it may be empty)`);
    }
    if (t.difficulty && !LEVELS.includes(t.difficulty)) {
      problems.push(`${label}: difficulty "${t.difficulty}" is not one of ${LEVELS.join(', ')}`);
    }
    if (typeof t.slug === 'string' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug)) {
      problems.push(`${label}: slug "${t.slug}" must be lowercase letters, numbers and hyphens`);
    }
    if (typeof t.slug === 'string') {
      if (slugs.has(t.slug)) problems.push(`${label}: duplicate slug "${t.slug}" (also item ${slugs.get(t.slug)})`);
      else slugs.set(t.slug, i + 1);
    }
    if (typeof t.id === 'string') {
      if (ids.has(t.id)) problems.push(`${label}: duplicate id "${t.id}" (also item ${ids.get(t.id)})`);
      else ids.set(t.id, i + 1);
    }
  });

  if (problems.length) {
    const shown = problems.slice(0, 30).join('\n  - ');
    const more = problems.length > 30 ? `\n  ...and ${problems.length - 30} more` : '';
    throw new Error(`[dictionary] ${problems.length} problem(s) in the data file:\n  - ${shown}${more}`);
  }
  return data;
}

/** Key used for alphabetical order: lowercase letters and digits only. */
function sortKey(term) {
  return term
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Letter bucket: A-Z, or "#" for terms that start with a number. */
function letterOf(term) {
  const ch = sortKey(term).charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

function sortTerms(data) {
  return [...data].sort((a, b) => {
    const ka = sortKey(a.term);
    const kb = sortKey(b.term);
    // Numbers sort before letters, then plain alphabetical.
    const na = /^[0-9]/.test(ka);
    const nb = /^[0-9]/.test(kb);
    if (na !== nb) return na ? -1 : 1;
    if (ka < kb) return -1;
    if (ka > kb) return 1;
    return a.slug < b.slug ? -1 : 1;
  });
}

module.exports = {loadAndValidate, sortTerms, sortKey, letterOf};
