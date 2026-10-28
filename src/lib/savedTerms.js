import {useCallback, useEffect, useState} from 'react';

// Saved dictionary terms.
//
// Today the saved term IDs live in this browser (localStorage). The UI only
// talks to useSavedTerms(), so when accounts are ready, only the three small
// functions below need to change (for example, to read and write a Supabase
// table). The buttons and the "Saved (N)" filter will not change.

const KEY = 'nbs.dictionary.saved.v1';

function readSaved() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : [];
  } catch (e) {
    return [];
  }
}

function writeSaved(ids) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch (e) {
    // Storage can be blocked (private mode). Saving then lasts for this visit only.
  }
}

export function useSavedTerms() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(readSaved());
    const onStorage = (e) => {
      if (e.key === KEY) setSaved(readSaved());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((id) => {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      writeSaved(next);
      return next;
    });
  }, []);

  return {saved, toggle};
}
