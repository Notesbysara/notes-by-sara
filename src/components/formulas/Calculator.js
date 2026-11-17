import React, {useMemo, useState} from 'react';
import CALC from '../../lib/formulaCalc';
import styles from './formulas.module.css';

// The live calculator for one formula. Change any number and the steps and the answer update.
const UNIT_SKIP = new Set(['money', 'number', 'x', 'rate', 'count', 'index']);
const startValues = (c) =>
  Object.fromEntries(c.inputs.map((i) => [i.id, Array.isArray(i.default) ? i.default.join(', ') : String(i.default)]));

function compute(calc, vals) {
  {
    const v = {};
    for (const i of calc.inputs) {
      const raw = String(vals[i.id] ?? '');
      if (i.type === 'list') {
        const p = raw.split(/[,;\s]+/).filter(Boolean).map(Number);
        if (!p.length || p.some((x) => !Number.isFinite(x))) return {msg: `Enter numbers only in "${i.label}", separated by commas.`};
        v[i.id] = p;
      } else {
        const x = Number(raw.replace(/,/g, '').trim());
        if (raw.trim() === '' || !Number.isFinite(x)) return {msg: `Enter a number in "${i.label}".`};
        if (i.min !== undefined && x < i.min) return {msg: `"${i.label}" must be at least ${i.min}.`};
        v[i.id] = x;
      }
    }
    try {
      const r = CALC.run(calc, v);
      if (r.err) return {msg: r.err};
      return {out: r.out};
    } catch (e) {
      return {msg: 'These numbers cannot be calculated. Check the values and try again.'};
    }
  }
}

/** The live numbers for one calculator: the values typed in and what they work out to. */
export function useCalc(calc) {
  const [vals, setVals] = useState(() => startValues(calc));
  const result = useMemo(() => compute(calc, vals), [calc, vals]);
  const reset = () => setVals(startValues(calc));
  return {vals, setVals, result, reset};
}

export {UNIT_SKIP};

export default function Calculator({calc, name}) {
  const {vals, setVals, result} = useCalc(calc);

  const results = new Set(calc.results);
  return (
    <div className={styles.calc}>
      <div className={styles.calcInputs}>
        {calc.inputs.map((i) => {
          const unit = i.unit === '%' ? '%' : UNIT_SKIP.has(i.unit) ? '' : i.unit;
          const id = `calc-${name}-${i.id}`;
          return (
            <label key={i.id} htmlFor={id} className={styles.calcLabel}>
              <span>
                {i.label}
                {unit ? <em> ({unit})</em> : null}
              </span>
              <input
                id={id}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={vals[i.id]}
                onChange={(e) => setVals((s) => ({...s, [i.id]: e.target.value}))}
              />
              {i.type === 'list' ? (
                <small>Separate the values with commas.{i.hint ? ` ${i.hint}` : ''}</small>
              ) : i.hint ? (
                <small>{i.hint}</small>
              ) : null}
            </label>
          );
        })}
      </div>
      {result.msg ? (
        <p className={styles.calcWarn} role="alert">
          {result.msg}
        </p>
      ) : (
        <table className={styles.calcSteps}>
          <thead>
            <tr>
              <th>Step</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {calc.steps.map((s) => (
              <tr key={s.id} className={results.has(s.id) ? styles.calcResult : undefined}>
                <td>{s.label}</td>
                <td>{CALC.fmt(s.format, result.out[s.id])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button type="button" className={styles.calcReset} onClick={() => setVals(startValues(calc))}>
        Reset to the example
      </button>
    </div>
  );
}
