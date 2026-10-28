// Long explanations are not bundled into the dictionary page. They live in one
// generated file (static/dictionary-explanations.json) that is fetched the first
// time a card is opened, then kept in memory.

let cache = null;
let pending = null;

export function loadExplanations(url) {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        cache = data;
        return data;
      })
      .catch((e) => {
        pending = null; // allow another try
        throw e;
      });
  }
  return pending;
}
