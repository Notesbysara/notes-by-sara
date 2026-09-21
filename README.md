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
