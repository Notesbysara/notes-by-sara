const fs = require('fs');
const path = require('path');
const {loadAndValidate, sortTerms, letterOf} = require('./lib');

/**
 * Financial Dictionary plugin.
 * Reads data/notes_by_sara_dictionary.json at build time, validates it,
 * then registers /dictionary and one static route per term.
 * Each term is its own route (no ":slug" pattern) so every page is pre-rendered
 * and the build works on Windows.
 */
module.exports = function dictionaryPlugin(context) {
  const dataFile = path.join(context.siteDir, 'data', 'notes_by_sara_dictionary.json');

  return {
    name: 'dictionary-plugin',

    getPathsToWatch() {
      return [dataFile];
    },

    async loadContent() {
      return sortTerms(loadAndValidate(dataFile));
    },

    async contentLoaded({content, actions}) {
      const {addRoute, createData} = actions;
      const terms = content;

      // List used by /dictionary: everything a card shows, without the long
      // explanations (those load when a card is opened). Wording is untouched.
      const listPath = await createData(
        'dictionary-terms.json',
        JSON.stringify(
          terms.map(({explanation, note, ...rest}) => ({
            ...rest,
            letter: letterOf(rest.term),
            hasNote: Boolean(note),
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
