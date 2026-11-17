const fs = require('fs');
const path = require('path');
const {termLessons} = require('../dictionary');

/**
 * Formula Library plugin.
 * Reads data/formulas.json at build time and registers /formula-library (the list)
 * and one static page per formula at /formula-library/<slug>, so Google can find
 * every formula. Each formula is drawn with KaTeX at build time, so the pages
 * need no extra script to show the math.
 */

function plainName(name) {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

// Split a formula into lines for the page: "A=1,\\quad B=2" becomes two lines, and each line
// is cut at its first top-level "=" so the equals signs can line up.
function topLevelSplit(tex, re) {
  const out = [];
  let depth = 0;
  let last = 0;
  for (let i = 0; i < tex.length; i += 1) {
    const ch = tex[i];
    if (ch === '{' || ch === '(' || ch === '[') depth += 1;
    else if (ch === '}' || ch === ')' || ch === ']') depth -= 1;
    else if (depth === 0) {
      re.lastIndex = i;
      const m = re.exec(tex);
      if (m && m.index === i) {
        out.push(tex.slice(last, i));
        last = i + m[0].length;
        i = last - 1;
      }
    }
  }
  out.push(tex.slice(last));
  return out;
}

function formulaLines(tex) {
  if (/\\begin\{/.test(tex)) return [{rhs: tex}];
  const parts = topLevelSplit(tex, /[,;]?\s*\\q?quad\s*/y)
    .map((p) => p.trim().replace(/[,;]\s*$/, ''))
    .filter(Boolean);
  return parts.map((p) => {
    const eq = topLevelSplit(p, /=/y);
    if (eq.length < 2 || !eq[0].trim()) return {rhs: p};
    return {lhs: eq[0].trim(), rhs: `=${eq.slice(1).join('=')}`};
  });
}

function norm(t) {
  return String(t).toLowerCase().replace(/isation/g, 'ization').replace(/[^a-z0-9]+/g, ' ').trim();
}

module.exports = function formulasPlugin(context) {
  const dataFile = path.join(context.siteDir, 'data', 'formulas.json');
  const dictFile = path.join(context.siteDir, 'data', 'notes_by_sara_dictionary.json');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const katex = require(path.join(context.siteDir, 'static', 'vendor', 'katex-0.16.9.min.js'));
  const math = (tex, fallback) => {
    try {
      return katex.renderToString(tex, {output: 'mathml', throwOnError: false, displayMode: true});
    } catch (e) {
      return null;
    }
  };

  const inline = (tex) => {
    try {
      return katex.renderToString(`\\displaystyle ${tex}`, {output: 'mathml', throwOnError: false, displayMode: false});
    } catch (e) {
      return null;
    }
  };

  return {
    name: 'formulas-plugin',

    getPathsToWatch() {
      return [dataFile];
    },

    async loadContent() {
      return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    },

    async contentLoaded({content, actions}) {
      const {addRoute, createData} = actions;
      const groupOf = {};
      content.groups.forEach(([g, subjects]) => subjects.forEach((s) => {
        groupOf[s] = g;
      }));
      const all = [...content.formulas].sort((a, b) => a.name.localeCompare(b.name, 'en'));
      const bySlug = {};
      all.forEach((f) => {
        bySlug[f.slug] = f;
      });

      // "Learn it in a lesson": match the formula's name or other names to a dictionary term
      // that a course lesson uses.
      const lessons = termLessons(context.siteDir);
      const termSlug = {};
      try {
        JSON.parse(fs.readFileSync(dictFile, 'utf8')).forEach((t) => {
          [t.term, plainName(t.term), ...(t.also_known_as || [])].forEach((n) => {
            termSlug[norm(n)] = t.slug;
          });
        });
      } catch (e) {
        console.warn('[formulas] dictionary not found, lesson links skipped.');
      }
      const lessonFor = (f) => {
        for (const n of [f.name, plainName(f.name), ...(f.aliases || [])]) {
          const s = termSlug[norm(n)];
          if (s && lessons[s]) return {name: lessons[s].name, to: lessons[s].to};
        }
        return null;
      };

      const listPath = await createData(
        'formulas-list.json',
        JSON.stringify(
          all.map((f) => ({
            slug: f.slug,
            name: f.name,
            level: f.level,
            subject: f.subject,
            section: f.section,
            topic: f.topic,
            group: groupOf[f.subject] || 'Other',
            aliases: f.aliases || [],
            finds: f.finder.finds,
            needs: f.finder.needs,
            text: f.formula.text,
          })),
        ),
      );
      const groupsPath = await createData('formulas-groups.json', JSON.stringify(content.groups));

      // What "Show formula" opens on the list: the formula drawn as math and when to use it.
      // Fetched the first time a card is opened, so the list itself stays small.
      // Generated file, rewritten on every build (it is in .gitignore). Only written if changed.
      const cards = {};
      all.forEach((f) => {
        cards[f.slug] = {mathml: math(f.formula.latex), text: f.formula.text, when: f.when_to_use};
      });
      const cardsFile = path.join(context.siteDir, 'static', 'formula-cards.json');
      const cardsJson = JSON.stringify(cards);
      if (!fs.existsSync(cardsFile) || fs.readFileSync(cardsFile, 'utf8') !== cardsJson) {
        fs.writeFileSync(cardsFile, cardsJson);
      }

      addRoute({
        path: '/formula-library',
        exact: true,
        component: '@site/src/components/formulas/FormulaPage',
        modules: {formulas: listPath, groups: groupsPath},
      });

      for (let i = 0; i < all.length; i += 1) {
        const f = all[i];
        const prev = i > 0 ? all[i - 1] : null;
        const next = i < all.length - 1 ? all[i + 1] : null;
        const entryPath = await createData(
          `formula-${f.slug}.json`,
          JSON.stringify({
            ...f,
            group: groupOf[f.subject] || 'Other',
            mathml: math(f.formula.latex),
            lines: [...formulaLines(f.formula.latex), ...(f.formula.also || []).flatMap((a) => formulaLines(a))].map((l) => ({
              lhs: l.lhs ? inline(l.lhs) : null,
              rhs: inline(l.rhs),
            })),
            alsoMathml: (f.formula.also || []).map((a) => math(a)),
            related: (f.related || []).filter((r) => bySlug[r]).map((r) => ({slug: r, name: bySlug[r].name})),
            prev: prev && {slug: prev.slug, name: prev.name},
            next: next && {slug: next.slug, name: next.name},
            lesson: lessonFor(f),
            total: all.length,
          }),
        );
        addRoute({
          path: `/formula-library/${f.slug}`,
          exact: true,
          component: '@site/src/components/formulas/FormulaDetailPage',
          modules: {entry: entryPath},
        });
      }
    },
  };
};
