import {useCallback, useEffect, useState} from 'react';

// Saved dictionary terms.
//
// Today the saved term IDs live in this browser (localStorage). The UI only
// talks to useSavedTerms(), so when accounts are ready, only the three small
// functions below need to change (for example, to read and write a Supabase
// table). The buttons and the "Saved (N)" filter will not change.

const KEY = 'nbs.dictionary.saved.v1';
const FORMULA_KEY = 'nbs.formulas.saved.v1';

function readSaved(key = KEY) {
  try {
    const raw = window.localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : [];
  } catch (e) {
    return [];
  }
}

function writeSaved(ids, key = KEY) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch (e) {
    // Storage can be blocked (private mode). Saving then lasts for this visit only.
  }
}

function useSavedList(key) {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(readSaved(key));
    const onStorage = (e) => {
      if (e.key === key) setSaved(readSaved(key));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const toggle = useCallback((id) => {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      writeSaved(next, key);
      return next;
    });
  }, [key]);

  return {saved, toggle};
}

/** Saved dictionary terms (by term id). */
export function useSavedTerms() {
  return useSavedList(KEY);
}

/** Saved formulas (by formula slug). Kept apart from saved terms. */
export function useSavedFormulas() {
  return useSavedList(FORMULA_KEY);
}
