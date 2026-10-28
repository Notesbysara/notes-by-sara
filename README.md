# Notes by Sara

Structured finance notes, built with Docusaurus. Live at https://notesbysara.org.

## Run it locally

```
npm install
npm start
```

Opens the site at http://localhost:3000 with live reload.

## Add a new note

Notes are Markdown files in `docs/`, published under `/notes`. They are public and readable by search engines.

1. Put the note in its stage folder, e.g. `docs/foundations/`. For a new stage, create a folder with a `_category_.json` (copy the one in `docs/foundations/`).
2. Copy the frontmatter from `docs/foundations/time-value-of-money.md` and fill in:
   - `title`: what students would search for, e.g. "Present Value Explained: Formula and Examples"
   - `sidebar_label`: the short name for the sidebar
   - `description`: one or two sentences (about 150 characters) shown in Google results
   - `keywords` and `slug`
3. Update the stage's status in `docs/index.md` and `src/pages/index.js` when a stage opens.
4. Run `npm start` to preview.

## Publish

```
git add .
git commit -m "describe the change"
git push
$env:GIT_USER="Notesbysara"; npm run deploy
```

## Accounts

Login pages still exist (`/login`, `/signup`) and use Supabase, but nothing is locked behind login and the Log in link is hidden. They are kept for later features such as saved progress or paid material.
