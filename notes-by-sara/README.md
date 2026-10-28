# Notes by Sara

A personal finance notebook, built with Docusaurus.

## Run it locally

```
cd notes-by-sara
npm install
npm start
```

This opens the site at http://localhost:3000 with live-reload as you edit.

## Add a new note

1. Pick the right subject folder under `docs/` (e.g. `docs/valuation/`).
2. Create a new `.md` file there, using `docs/corporate-finance/time-value-of-money.md` as your template.
3. Fill in the frontmatter: `title`, `description`, `slug`, `tags`.
4. Run `npm start` to preview it before publishing.

## Deploy it

1. Push this project to a GitHub repository.
2. In `docusaurus.config.js`, replace `organizationName` and `projectName` with your real GitHub username and repo name, and `url` with your real domain once you have one.
3. Connect the repo to GitHub Pages (Settings → Pages → Deploy from a branch, or use `npm run deploy` with the `gh-pages` package already configured by Docusaurus).
4. Point your custom domain's DNS at GitHub Pages, following GitHub's instructions for a custom domain.

## What's already set up

- Six subject folders under `docs/`: Corporate Finance, Valuation, Financial Markets, Accounting, Personal Finance, Investment Analysis.
- One real sample note: `docs/corporate-finance/time-value-of-money.md`.
- Homepage (`src/pages/index.js`) matching the locked "Modern Vault" design.
- About, Privacy Policy, and Terms & Conditions pages under `src/pages/`.
- No blog, no contact page, no public upload — matches the current MVP scope.

## Not yet built (next phases)

- Login / accounts (planned: Supabase)
- "View only" note protection
- Financial dictionary + calculator
- Paid subject access (planned: Stripe)

## Financial Dictionary

Live at `/dictionary` (search and filters) and `/dictionary/<slug>` (one page per term).
It is public: no login needed.

**Update the dictionary:** replace `data/notes_by_sara_dictionary.json` with the new file, then run
`npm run build` (or `npm run deploy`). The build checks the file first and stops with a clear message
if a slug is duplicated or a required field is missing. To run only that check: `npm run validate:dictionary`.

**Test locally:** `npm start` for a live preview, or `npm run build` then `npm run serve` to see exactly
what will be published.

**Where things live**
- `data/notes_by_sara_dictionary.json` the single source of truth (wording is never edited by code)
- `plugins/dictionary/` reads and validates the data at build time, creates all the pages
- `src/components/dictionary/` the dictionary page, term page, cards and styles
- `src/lib/dictionarySearch.js` the search; `src/lib/savedTerms.js` the Save feature (browser storage today, built so it can move to accounts)
- `static/dictionary-explanations.json` is generated on every build (not committed)
