import React, {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

// Update these two numbers when you add dictionary terms or formulas.
const DICTIONARY_TERMS = 1725;
const FORMULAS = 522;

const TERMS = [
  'NPV', 'WACC', 'Duration', 'Beta', 'Yield curve', 'Sharpe ratio',
  'Black-Scholes', 'Free cash flow', 'Convexity', 'CAPM', 'EBITDA', 'Put-call parity',
];

const doors = [
  {
    kicker: 'Start here',
    name: 'Notes',
    text: 'The step-by-step lessons, in order, from the idea to the worked example.',
    cta: 'Open the notes',
    to: '/notes',
  },
  {
    count: DICTIONARY_TERMS,
    unit: 'terms',
    name: 'Financial Dictionary',
    text: 'Plain-English explanations, searchable, with a level on every term.',
    cta: 'Open the dictionary',
    to: '/dictionary',
  },
  {
    count: FORMULAS,
    unit: 'formulas',
    name: 'Formulas and calculators',
    text: 'Every formula has a worked example and a calculator that shows its steps.',
    cta: 'Open the formulas',
    to: '/formula-library',
  },
];

const subjects = [
  {name: 'Foundations', live: true},
  {name: 'Personal Finance'},
  {name: 'Financial Statement Analysis'},
  {name: 'Corporate Finance'},
  {name: 'Valuation'},
  {name: 'Investments & Portfolio Theory'},
  {name: 'Equity Markets'},
  {name: 'Fixed Income'},
  {name: 'Derivatives'},
];

const faqs = [
  {
    q: 'What is Notes by Sara?',
    a: 'Notes by Sara is a free, structured set of finance notes. It covers finance subject by subject, from working with financial data and accounting basics to valuation, fixed income and derivatives.',
  },
  {
    q: 'Who are the notes for?',
    a: 'University students, people preparing for finance exams, and anyone who wants to understand how finance works. No finance background is needed to start with Foundations.',
  },
  {
    q: 'How is this different from asking an AI chatbot?',
    a: 'A chatbot answers the question you think to ask. Notes by Sara gives you the full path: what to learn, in what order, explained the same way every time, with worked examples you can check.',
  },
  {
    q: 'Are the notes free?',
    a: 'Yes. Every note on the site is free to read, with no account needed.',
  },
  {
    q: 'What else is on the site?',
    a: 'A Financial Dictionary with plain-English explanations of finance terms, and a Financial Formula & Calculator Library where every formula has a worked example and a calculator that shows its steps.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. All content is for education only and is not financial, investment or professional advice.',
  },
  {
    q: 'How often are new notes published?',
    a: 'Notes are published subject by subject. Foundations is open now, and the other subjects follow in order.',
  },
  {
    q: 'Can I suggest a topic?',
    a: 'Yes. Send a message through the Contact page, or email support@notesbysara.org, with the concept you would like explained.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {'@type': 'Answer', text: f.a},
  })),
};

function reducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// 'init' = server render and first paint (everything visible),
// 'hide' = below the fold and waiting, 'show' = scrolled into view.
function useReveal() {
  const ref = useRef(null);
  const [state, setState] = useState('init');
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || typeof IntersectionObserver === 'undefined') {
      setState('show');
      return undefined;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setState('show');
      return undefined;
    }
    setState('hide');
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setState('show');
        io.disconnect();
      }
    }, {threshold: 0.15});
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, state];
}

function useCountUp(target, run) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!run) {
      return undefined;
    }
    if (reducedMotion()) {
      setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, target]);
  return value;
}

function money(v) {
  return '$' + Math.round(v).toLocaleString('en-US');
}

function GrowthChart() {
  const [rate, setRate] = useState(8);
  const [t, setT] = useState(1);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) {
      return undefined;
    }
    if (reducedMotion()) {
      setAuto(false);
      return undefined;
    }
    let tt = 0.05;
    setT(tt);
    const id = setInterval(() => {
      tt += 0.014;
      if (tt > 1.5) {
        tt = 0.05;
      }
      setT(Math.min(tt, 1));
    }, 60);
    return () => clearInterval(id);
  }, [auto]);

  const r = rate / 100;
  const N = 20;
  const maxV = 1000 * Math.pow(1 + r, N);
  const X = (y) => 20 + (y / N) * 420;
  const Y = (v) => 190 - ((v - 1000) / (maxV - 1000)) * 160;
  const steps = Math.max(1, Math.round(Math.min(1, t) * 60));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const y = (i / 60) * N;
    pts.push(X(y).toFixed(1) + ',' + Y(1000 * Math.pow(1 + r, y)).toFixed(1));
  }
  const endY = (steps / 60) * N;
  const endV = 1000 * Math.pow(1 + r, endY);
  const area = pts.join(' ') + ' ' + X(endY).toFixed(1) + ',190 20,190';

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTop}>
        <div>$1,000 growing at {rate}% a year</div>
        <div>Year {Math.round(endY)}</div>
      </div>
      <div className={styles.chartBalance}>{money(endV)}</div>
      <svg viewBox="0 0 460 220" className={styles.chartSvg} role="img"
        aria-label="A curve showing money growing with compound interest">
        <line x1="20" y1="190" x2="440" y2="190" stroke="#b9c7c0" strokeWidth="1" />
        <polygon points={area} fill="#0e7c5a" fillOpacity="0.12" />
        <polyline points={pts.join(' ')} fill="none" stroke="#0e7c5a" strokeWidth="4"
          strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={X(endY).toFixed(1)} cy={Y(endV).toFixed(1)} r="7" fill="#e0b04a"
          stroke="#ffffff" strokeWidth="3" />
      </svg>
      <label className={styles.chartLabel}>
        <span>Drag to change the rate</span>
        <input type="range" min="3" max="12" step="1" value={rate}
          onChange={(e) => { setRate(Number(e.target.value)); setAuto(false); setT(1); }} />
      </label>
    </div>
  );
}

function Hero() {
  const logo = useBaseUrl('/img/favicon.png');
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <div className={`${styles.fu} ${styles.lockup}`} style={{animationDelay: '.05s'}}>
            <img src={logo} alt="Notes by Sara logo" className={styles.lockupLogo} />
            <div>
              <div className={styles.lockupName}>Notes by Sara</div>
              <div className={styles.lockupTag}>Structured finance notes</div>
            </div>
          </div>
          <Heading as="h1" className={`${styles.fu} ${styles.heroTitle}`} style={{animationDelay: '.15s'}}>
            Finance, <span className={styles.heroAccent}>explained in order</span>
          </Heading>
          <p className={`${styles.fu} ${styles.heroSubtitle}`} style={{animationDelay: '.3s'}}>
            Clear notes that take you from your first spreadsheet to derivatives,
            with the working shown at every step.
          </p>
          <div className={`${styles.fu} ${styles.heroButtons}`} style={{animationDelay: '.45s'}}>
            <Link className={styles.primaryButton} to="/notes/foundations/from-raw-numbers-to-decisions">
              Start with Foundations
            </Link>
            <Link className={styles.secondaryButton} to="/notes">
              See the learning path
            </Link>
          </div>
          <p className={`${styles.fu} ${styles.heroNote}`} style={{animationDelay: '.55s'}}>
            Free to read. No account needed.
          </p>
          <div className={`${styles.fu} ${styles.pdfRow}`} style={{animationDelay: '.65s'}}>
            <Link className={styles.pdfButton} to="/free-pdf">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M3 2.5h8a1.5 1.5 0 0 1 1.5 1.5v9.5H4.5A1.5 1.5 0 0 1 3 12V2.5z" />
                <path d="M3 12a1.5 1.5 0 0 1 1.5-1.5h8" />
              </svg>
              Get the free Financial Dictionary Quick Reference (PDF)
            </Link>
          </div>
        </div>
        <div className={`${styles.fu} ${styles.heroChart}`} style={{animationDelay: '.35s'}}>
          <GrowthChart />
        </div>
      </div>
    </header>
  );
}

function TermStrip() {
  const list = [...TERMS, ...TERMS];
  return (
    <div className={styles.strip} aria-hidden="true">
      <div className={styles.track}>
        {list.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

function Door({d, run}) {
  const n = useCountUp(d.count || 0, run && !!d.count);
  return (
    <Link to={d.to} className={styles.door}>
      <div className={styles.doorKicker}>
        {d.count ? `${n.toLocaleString('en-US')} ${d.unit}` : d.kicker}
      </div>
      <div className={styles.doorName}>{d.name}</div>
      <div className={styles.doorText}>{d.text}</div>
      <div className={styles.doorCta}>{d.cta}</div>
    </Link>
  );
}

function Doors() {
  const [ref, state] = useReveal();
  const cls = state === 'hide' ? styles.hideIt : state === 'show' ? styles.showIt : '';
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <Heading as="h2" className={styles.sectionTitle}>Three ways in</Heading>
          <p className={styles.sectionLead}>Learn in order, look a term up, or work a formula yourself.</p>
        </div>
        <div ref={ref} className={`${styles.doorGrid} ${cls}`}>
          {doors.map((d) => <Door key={d.name} d={d} run={state !== 'hide'} />)}
        </div>
      </div>
    </section>
  );
}

function LearningPath() {
  const [ref, state] = useReveal();
  const cls = state === 'hide' ? styles.pathHide : state === 'show' ? styles.pathShow : '';
  return (
    <section className={`${styles.section} ${styles.sectionTinted}`}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <Heading as="h2" className={styles.sectionTitle}>The learning path</Heading>
          <p className={styles.sectionLead}>
            Start at the foundations and work forward. Each subject opens as its notes are published.
          </p>
        </div>
        <div ref={ref} className={`${styles.path} ${cls}`}>
          <div className={styles.rail} aria-hidden="true">
            <div className={styles.railLine} />
            <div className={styles.railDots}>
              {subjects.map((s, i) => (
                <div key={s.name} className={styles.dot} style={{animationDelay: `${0.4 + i * 0.28}s`}} />
              ))}
            </div>
          </div>
          <div className={styles.vline} aria-hidden="true" />
          <div className={styles.stageGrid}>
            {subjects.map((s, i) => (
              <div key={s.name} className={styles.stageWrap}>
                <div className={styles.tileDot} aria-hidden="true" style={{animationDelay: `${0.4 + i * 0.28}s`}} />
                {s.live ? (
                  <Link to="/notes/foundations/from-raw-numbers-to-decisions" className={styles.stageLive}>
                    <span className={styles.stageName}>{s.name}</span>
                    <span className={styles.stageStatusLive}>Open now</span>
                  </Link>
                ) : (
                  <div className={styles.stageSoon}>
                    <span className={styles.stageName}>{s.name}</span>
                    <span className={styles.stageStatusSoon}>Coming soon</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.centerLink}>
          <Link to="/notes">See the learning path</Link>
        </div>
      </div>
    </section>
  );
}

function StartHere() {
  const [ref, state] = useReveal();
  const cls = state === 'hide' ? styles.hideIt : state === 'show' ? styles.showIt : '';
  return (
    <section className={styles.section}>
      <div className={styles.narrow}>
        <Heading as="h2" className={styles.sectionTitle}>Start here</Heading>
        <div ref={ref} className={cls}>
          <Link to="/notes/foundations/from-raw-numbers-to-decisions" className={styles.featureCard}>
            <span className={styles.featureEyebrow}>Foundations · Topic 1 of 12</span>
            <span className={styles.featureTitle}>From raw numbers to decisions</span>
            <span className={styles.featureBody}>
              Six steps that take you from a spreadsheet full of numbers to a clear
              decision. The first topic of the free Financial Data-to-Insight course.
            </span>
            <span className={styles.featureCta}>Read the note →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [ref, state] = useReveal();
  const cls = state === 'hide' ? styles.hideIt : state === 'show' ? styles.showIt : '';
  return (
    <section className={styles.section}>
      <div className={styles.narrow}>
        <Heading as="h2" className={styles.sectionTitle}>Frequently asked questions</Heading>
        <div ref={ref} className={`${styles.faqList} ${cls}`}>
          {faqs.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{f.q}</summary>
              <p className={styles.faqAnswer}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Learn Finance From Scratch: Structured Finance Notes"
      description="Free, structured finance notes from working with financial data to valuation, markets and derivatives, with worked examples, a financial dictionary and a formula and calculator library.">
      <Head>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Head>
      <div className={styles.page}>
        <Hero />
        <TermStrip />
        <main>
          <Doors />
          <LearningPath />
          <StartHere />
          <FAQ />
        </main>
      </div>
    </Layout>
  );
}
