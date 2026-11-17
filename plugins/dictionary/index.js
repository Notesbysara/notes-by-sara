const fs = require('fs');
const path = require('path');
const {loadAndValidate, sortTerms, letterOf} = require('./lib');

/**
 * Financial Dictionary plugin.
 * Reads data/notes_by_sara_dictionary.json at build time, validates it,
 * then registers /dictionary and one static route per term.
 * Each term is its own route (no ":slug" pattern) so every page is pre-rendered
 * and the build works on Windows.
 *
 * data/dictionary_sections.json maps each term slug to its lesson section
 * (for the topic sidebar). The dictionary file itself is not changed.
 */
/**
 * Finds the first course lesson that uses each dictionary term (<Term slug="...">),
 * so a term page can link to "Learn it in a lesson". Lessons are read in course order:
 * the toolkits, then the numbered lessons, then the project.
 */
function termLessons(siteDir) {
  const map = {};
  const coursesDir = path.join(siteDir, 'courses');
  if (!fs.existsSync(coursesDir)) return map;
  for (const course of fs.readdirSync(coursesDir)) {
    const dir = path.join(coursesDir, course);
    if (!fs.statSync(dir).isDirectory()) continue;
    const rank = (f) => (/^\d/.test(f) ? 1 : /project/i.test(f) ? 2 : 0);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
    for (const file of files) {
      const text = fs.readFileSync(path.join(dir, file), 'utf8');
      const slug = (text.match(/^slug:\s*(\S+)\s*$/m) || [])[1];
      const label = ((text.match(/^sidebar_label:\s*"?(.*?)"?\s*$/m) || [])[1] || '').replace(/\\u201c/g, '\u201c').replace(/\\u201d/g, '\u201d');
      if (!slug || /^unlisted:\s*true/m.test(text)) continue;
      let name = label;
      const num = label.match(/^(\d+)\.\s*(.*)$/);
      const kit = label.match(/^([A-Z])\.\s*(.*)$/);
      if (num) name = `Lesson ${num[1]} · ${num[2]}`;
      else if (kit) name = `Toolkit ${kit[1]} · ${kit[2]}`;
      const to = `/courses${slug.startsWith('/') ? slug : `/${slug}`}`;
      // Score each term by how often the lesson mentions it, so the term links to the
      // lesson that covers it most, not just the first one that mentions it.
      const lower = text.toLowerCase();
      const re = /<Term\s+slug="([^"]+)"(?:\s+name="([^"]+)")?/g;
      let m;
      const seen = new Set();
      while ((m = re.exec(text))) {
        const slugT = m[1];
        if (seen.has(slugT)) continue;
        seen.add(slugT);
        const word = (m[2] || slugT.replace(/-/g, ' ')).toLowerCase();
        const score = lower.split(word).length - 1;
        if (!map[slugT] || score > map[slugT].score) map[slugT] = {name, to, score};
      }
    }
  }
  return map;
}

module.exports = function dictionaryPlugin(context) {
  const dataFile = path.join(context.siteDir, 'data', 'notes_by_sara_dictionary.json');
  const sectionFile = path.join(context.siteDir, 'data', 'dictionary_sections.json');

  return {
    name: 'dictionary-plugin',

    getPathsToWatch() {
      return [dataFile, sectionFile, path.join(context.siteDir, 'courses')];
    },

    async loadContent() {
      return sortTerms(loadAndValidate(dataFile));
    },

    async contentLoaded({content, actions}) {
      const {addRoute, createData} = actions;
      const terms = content;

      let sections = {};
      try {
        sections = JSON.parse(fs.readFileSync(sectionFile, 'utf8'));
      } catch (e) {
        console.warn('[dictionary] data/dictionary_sections.json not found, topic sidebar will be empty.');
      }

      // List used by /dictionary: everything a card shows, without the long
      // explanations (those load when a card is opened). Wording is untouched.
      const listPath = await createData(
        'dictionary-terms.json',
        JSON.stringify(
          terms.map(({explanation, note, ...rest}) => ({
            ...rest,
            letter: letterOf(rest.term),
            hasNote: Boolean(note),
            section: sections[rest.slug] || 'Finance Foundations',
          })),
        ),
      );

      // Explanations and notes, fetched on demand by the cards. Generated file,
      // rewritten on every build (it is in .gitignore). Only written if changed.
      const explanations = {};
      terms.forEach((t) => {
        explanations[t.id] = {explanation: t.explanation, note: t.note};
      });
      const outFile = path.join(context.siteDir, 'static', 'dictionary-explanations.json');
      const json = JSON.stringify(explanations);
      if (!fs.existsSync(outFile) || fs.readFileSync(outFile, 'utf8') !== json) {
        fs.writeFileSync(outFile, json);
      }

      addRoute({
        path: '/dictionary',
        exact: true,
        component: '@site/src/components/dictionary/DictionaryPage',
        modules: {terms: listPath},
      });

      const lessons = termLessons(context.siteDir);

      // One static page per term, with its alphabetical neighbours.
      for (let i = 0; i < terms.length; i += 1) {
        const t = terms[i];
        const prev = i > 0 ? terms[i - 1] : null;
        const next = i < terms.length - 1 ? terms[i + 1] : null;
        const entryPath = await createData(
          `dictionary-term-${t.slug}.json`,
          JSON.stringify({
            ...t,
            total: terms.length,
            prev: prev && {slug: prev.slug, term: prev.term},
            next: next && {slug: next.slug, term: next.term},
            lesson: lessons[t.slug] ? {name: lessons[t.slug].name, to: lessons[t.slug].to} : null,
          }),
        );
        addRoute({
          path: `/dictionary/${t.slug}`,
          exact: true,
          component: '@site/src/components/dictionary/DictionaryTermPage',
          modules: {entry: entryPath},
        });
      }
    },
  };
};
module.exports.termLessons = termLessons;
