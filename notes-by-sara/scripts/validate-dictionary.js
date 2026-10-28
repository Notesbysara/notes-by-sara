// Run with: npm run validate:dictionary
// Checks data/notes_by_sara_dictionary.json without building the site.
const path = require('path');
const {loadAndValidate} = require('../plugins/dictionary/lib');

try {
  const data = loadAndValidate(path.join(__dirname, '..', 'data', 'notes_by_sara_dictionary.json'));
  console.log(`OK: ${data.length} terms, no duplicate slugs, no missing fields.`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
