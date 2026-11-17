// Small text helpers that make the numbers on formula pages read like a textbook:
// "4200 x 0.5" becomes "4,200 × 0.5", "2,100.00" becomes "2,100", "-140" becomes "−140".

const MINUS = '−';

function commas(int) {
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** The working shown next to a step, for example "2300 / 4200" -> "2,300 ÷ 4,200". */
export function prettyWorking(s) {
  if (!s) return '';
  let t = String(s);
  t = t.replace(/(^|[^\d.,])(\d{4,})(?!\d|,\d)/g, (m, a, b) => a + commas(b));
  t = t.replace(/\s+x\s+/g, ' × ');
  t = t.replace(/\s*\*\s*/g, ' × ');
  t = t.replace(/\s*\/\s*/g, ' ÷ ');
  // A minus between two things gets spaces; a minus that starts a number does not.
  t = t.replace(/([\w)%])\s*-\s*(?=[\w(.])/g, `$1 ${MINUS} `);
  t = t.replace(/-/g, MINUS);
  t = t.replace(/([\w)%])\s*\+\s*(?=[\w(.])/g, '$1 + ');
  return t;
}

/** A result value: drop ".00" on whole amounts and use a real minus sign. */
export function prettyValue(v) {
  if (v === null || v === undefined) return '';
  let t = String(v);
  t = t.replace(/(\d)\.0{1,2}(?=%|,|\s|$)/g, '$1');
  t = t.replace(/(^|[\s,(])-(?=\d)/g, `$1${MINUS}`);
  if (/^−0%?$/.test(t)) t = t.replace(MINUS, '');
  return t;
}

export function isNegative(v) {
  const t = prettyValue(v);
  return t.startsWith(MINUS);
}

/** Sentences such as the worked answer: tidy the numbers inside them the same way. */
export function prettyText(s) {
  if (!s) return '';
  return String(s)
    .replace(/(\d)\.00(?![\d])/g, '$1')
    .replace(/(^|[\s(])-(?=\d)/g, `$1${MINUS}`);
}

/** A starting number from the worked example, shown in a tile. */
export function prettyInput(value, unit) {
  if (Array.isArray(value)) return value.map((x) => prettyInput(x)).join(', ');
  if (typeof value !== 'number') return String(value);
  const abs = Math.abs(value);
  const txt = abs.toLocaleString('en-US', {maximumFractionDigits: 6});
  const signed = value < 0 ? `${MINUS}${txt}` : txt;
  return unit === '%' ? `${signed}%` : signed;
}
