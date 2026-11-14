import {HIDE_DAYS} from './config';

const HIDE_KEY = 'nbs_signup_hidden_until';
const SUBSCRIBED_KEY = 'nbs_signup_done';
const VIEWS_KEY = 'nbs_dict_views';

// Browser storage can be blocked or throw, so every call is wrapped.
function read(store, key) {
  try {
    return window[store].getItem(key);
  } catch (e) {
    return null;
  }
}
function write(store, key, value) {
  try {
    window[store].setItem(key, value);
  } catch (e) {
    /* ignore */
  }
}

export function isHidden() {
  const until = Number(read('localStorage', HIDE_KEY));
  return Boolean(until) && Date.now() < until;
}

export function hideForDays(days = HIDE_DAYS) {
  write('localStorage', HIDE_KEY, String(Date.now() + days * 86400000));
}

export function markSubscribed() {
  write('localStorage', SUBSCRIBED_KEY, '1');
  hideForDays();
}

export function isSubscribed() {
  return read('localStorage', SUBSCRIBED_KEY) === '1';
}

/** Records a dictionary term page in this visit and returns how many different ones were opened. */
export function recordTermView(slug) {
  let list = [];
  try {
    list = JSON.parse(read('sessionStorage', VIEWS_KEY) || '[]');
    if (!Array.isArray(list)) list = [];
  } catch (e) {
    list = [];
  }
  if (!list.includes(slug)) {
    list.push(slug);
    write('sessionStorage', VIEWS_KEY, JSON.stringify(list));
  }
  return list.length;
}
