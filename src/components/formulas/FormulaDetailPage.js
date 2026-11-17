import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CALC from '../../lib/formulaCalc';
import {prettyWorking, prettyValue, prettyText, isNegative} from '../../lib/formulaFormat';
import {useCalc, UNIT_SKIP} from './Calculator';
import FitLine from './FitLine';
import s from './formulaPage.module.css';

/** About 155 characters, cut at a word boundary. */
function metaDescription(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= 155) return clean;
  const cut = clean.slice(0, 154);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s-]+$/, '')}…`;
}

const shortLabel = (label) => String(label).split(' = ')[0];
const lowerFirst = (t) => (t && /^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

function Panel({id, title, note, action, className, children}) {
  return (
    <section id={id} className={`${s.panel} ${className || ''}`} aria-labelledby={id ? `${id}-h` : undefined}>
      <h2 id={id ? `${id}-h` : undefined} className={s.ph}>
        {title}
        {note ? <span className={s.phNote}>{note}</span> : null}
        {action}
      </h2>
      <div className={s.pb}>{children}</div>
    </section>
  );
}

function FormulaLines({f}) {
  const lines = f.lines && f.lines.length ? f.lines : null;
  if (!lines) return <p>{f.formula.text}</p>;
  return (
    <div className={s.lines}>
      {lines.map((l, i) =>
        l.lhs ? (
          <React.Fragment key={i}>
            <span className={s.lhs} dangerouslySetInnerHTML={{__html: l.lhs}} />
            <FitLine className={s.rhs} html={l.rhs} />
          </React.Fragment>
        ) : (
          <FitLine key={i} className={s.full} html={l.rhs} />
        ),
      )}
    </div>
  );
}

function CalcPanel({f, className}) {
  const c = f.calculator;
  const {vals, setVals, result, reset} = useCalc(c);
  const [all, setAll] = useState(false);
  const stepById = Object.fromEntries(c.steps.map((st) => [st.id, st]));
  const value = (st) => prettyValue(CALC.fmt(st.format, result.out[st.id]));
  return (
    <Panel
      id="calculator"
      title="Calculator"
      className={className}
      action={
        <button type="button" className={s.phBtn} onClick={reset}>
          Reset to the example
        </button>
      }>
      <div className={s.calcInputs}>
        {c.inputs.map((i) => {
          const unit = i.unit === '%' ? '%' : UNIT_SKIP.has(i.unit) ? '' : i.unit;
          const id = `calc-${f.slug}-${i.id}`;
          return (
            <label key={i.id} htmlFor={id} className={s.calcLabel}>
              <span>
                {i.label}
                {unit ? ` (${unit})` : ''}
              </span>
              <input
                id={id}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={vals[i.id]}
                onChange={(e) => setVals((v) => ({...v, [i.id]: e.target.value}))}
              />
              {i.type === 'list' ? <small>Separate the values with commas.{i.hint ? ` ${i.hint}` : ''}</small> : i.hint ? <small>{i.hint}</small> : null}
            </label>
          );
        })}
      </div>
      {result.msg ? (
        <p className={s.calcWarn} role="alert">
          {result.msg}
        </p>
      ) : (
        <>
          <div className={s.results} aria-live="polite">
            {c.results.map((rid, n) => {
              const st = stepById[rid];
              if (!st) return null;
              const v = value(st);
              const key = n === c.results.length - 1 && c.results.length > 1;
              return (
                <div key={rid} className={key ? `${s.result} ${s.resultKey}` : s.result}>
                  <span className={s.resultLabel}>{shortLabel(st.label)}</span>
                  <b className={isNegative(v) && !key ? s.neg : undefined}>{v}</b>
                </div>
              );
            })}
          </div>
          {c.steps.length > c.results.length && (
            <button type="button" className={s.textBtn} aria-expanded={all} onClick={() => setAll((x) => !x)}>
              {all ? 'Hide the steps' : 'Show every step'}
            </button>
          )}
          {all && (
            <table className={`${s.table} ${s.calcTable}`}>
              <tbody>
                {c.steps.map((st) => (
                  <tr key={st.id}>
                    <td>{shortLabel(st.label)}</td>
                    <td className={s.val}>{value(st)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </Panel>
  );
}

export default function FormulaDetailPage({entry}) {
  const {siteConfig} = useDocusaurusContext();
  const f = entry;
  const w = f.worked_example;
  const c = f.calculator;
  const url = `${siteConfig.url}/formula-library/${f.slug}`;
  const description = metaDescription(`${f.name}: ${f.finder.finds}. ${f.when_to_use} Worked example and step-by-step calculator.`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: f.name,
    description: f.when_to_use,
    educationalLevel: f.level,
    learningResourceType: 'Formula and calculator',
    url,
    isAccessibleForFree: true,
    isPartOf: {'@type': 'CollectionPage', name: 'Financial Formula & Calculator Library', url: `${siteConfig.url}/formula-library`},
  };
  if (f.aliases && f.aliases.length) jsonLd.alternateName = f.aliases;

  const hasCalc = c && c.available;
  const subject = f.subject;

  return (
    <Layout title={`${f.name}: Formula, Example and Calculator`} description={description}>
      <Head>
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
      </Head>

      <main className={s.page}>
        <header className={s.top}>
          <div>
            <nav className={s.crumb} aria-label="Breadcrumb">
              <Link to="/formula-library">Formulas</Link> <span aria-hidden="true">›</span>{' '}
              <Link to={`/formula-library?topic=${encodeURIComponent(f.group)}`}>{f.group}</Link>
            </nav>
            <h1 className={s.title}>{f.name}</h1>
            <div className={s.meta}>
              <span className={s.pill}>{f.level}</span>
              <span>{subject}</span>
              {f.aliases && f.aliases.length > 0 && (
                <>
                  <span className={s.dot} aria-hidden="true" />
                  <span>Also known as: {f.aliases.join(', ')}</span>
                </>
              )}
            </div>
            <nav className={s.nav} aria-label="Previous and next formula">
              {f.prev && (
                <Link to={`/formula-library/${f.prev.slug}`} className={s.navLink} rel="prev" title={f.prev.name}>
                  &larr; {f.prev.name}
                </Link>
              )}
              {f.next && (
                <Link to={`/formula-library/${f.next.slug}`} className={s.navLink} rel="next" title={f.next.name}>
                  {f.next.name} &rarr;
                </Link>
              )}
            </nav>
          </div>
          <div className={s.intro}>
            <p className={s.finds}>Finds: {lowerFirst(f.finder.finds)}.</p>
            <p className={s.when}>
              <b>When to use it:</b> {f.when_to_use}
            </p>
          </div>
        </header>

        <nav className={s.jump} aria-label="Jump to">
          <a href="#formula">Formula</a>
          <a href="#example">Example</a>
          {hasCalc && <a href="#calculator">Calculator</a>}
        </nav>

        <div className={s.grid}>
          <div className={s.col}>
            <Panel id="formula" title="The formula" className={s.aFormula}>
              <FormulaLines f={f} />
              <p className={s.words}>
                <b>In words:</b> {prettyText(f.formula.text).replace(/ - /g, ' \u2212 ')}
              </p>
            </Panel>
            <Panel id="symbols" title="What each symbol means" className={`${s.aSymbols} ${s.grow}`}>
              <table className={s.table}>
                <tbody>
                  {f.symbols.map((sy) => (
                    <tr key={sy.symbol}>
                      <td className={s.sym}>{sy.symbol}</td>
                      <td>{sy.meaning}</td>
                      <td className={s.unit}>{sy.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>

          <div className={s.col}>
            <Panel id="example" title="Worked example" className={`${s.aExample} ${s.grow}`}>
              <p className={s.problem}>{prettyText(w.problem)}</p>
              <table className={`${s.table} ${s.steps}`}>
                <tbody>
                  {w.steps.map((st, i) => {
                    const v = prettyValue(st.value);
                    return (
                      <tr key={i}>
                        <td className={s.stepLabel}>{shortLabel(st.label)}</td>
                        <td className={s.work}>{prettyWorking(st.working)}</td>
                        <td className={isNegative(v) ? `${s.val} ${s.neg}` : s.val}>{v}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className={s.answer}>
                <span className={s.kicker}>The answer</span>
                <p>{prettyText(w.answer)}</p>
              </div>
            </Panel>
            <div className={`${s.pdf} ${s.aPdf}`}>
              <span>Want every formula on a few pages?</span>
              <Link to="/formula-free-pdf">Get the free Cheat Sheet (PDF) &rarr;</Link>
            </div>
          </div>

          <div className={s.col}>
            {hasCalc ? (
              <CalcPanel f={f} className={s.aCalc} />
            ) : (
              <Panel id="calculator" title="Calculator" className={s.aCalc}>
                <p>No calculator for this formula. {c && c.reason}</p>
              </Panel>
            )}
            {(f.related.length > 0 || f.lesson) && (
              <Panel title="Keep going" className={`${s.aKeep} ${s.grow}`}>
                <div className={s.chips}>
                  {f.related.map((r) => (
                    <Link key={r.slug} to={`/formula-library/${r.slug}`} className={s.chip}>
                      {r.name}
                    </Link>
                  ))}
                  {f.lesson && (
                    <Link to={f.lesson.to} className={`${s.chip} ${s.chipLesson}`}>
                      {/^lesson/i.test(f.lesson.name) ? f.lesson.name : `Lesson: ${f.lesson.name}`} &rarr;
                    </Link>
                  )}
                </div>
              </Panel>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
