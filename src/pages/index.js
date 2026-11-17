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
    name: 'Learning path',
    text: 'One route through finance, in order, starting with a free hands-on course.',
    cta: 'See the learning path',
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
  {name: 'Free course: Financial Data-to-Insight', live: true, to: '/courses/financial-data-to-insight'},
  {name: 'Foundations'},
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
    a: 'University students, people preparing for finance exams, and anyone who wants to understand how finance works. No finance background is needed to start the free Financial Data-to-Insight course.',
  },
  {
    q: 'How is this different from asking an AI chatbot?',
    a: 'A chatbot answers the question you think to ask. Notes by Sara gives you the full path: what to learn, in what order, explained the same way every time, with worked examples you can check.',
  },
  {
    q: 'Are the notes free?',
    a: 'Yes. The course, the Financial Dictionary and the formulas are free to use, with no account needed.',
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
    a: 'The free Financial Data-to-Insight course is open now. Notes are published subject by subject, starting with Foundations.',
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

// Sections are always visible. (They used to stay hidden until scrolled into view.)
function useReveal() {
  const ref = useRef(null);
  return [ref, 'init'];
}

// The counts show the real number straight away (no count-up from 0).
function useCountUp(target) {
  return target;
}

function money(v) {
  return '$' + Math.round(v).toLocaleString('en-US');
}

function GrowthChart() {
  const [rate, setRate] = useState(8);
  const [t, setT] = useState(1);
  const cardRef = useRef(null);

  // Draw the curve once, the first time the chart is on screen. After that it only
  // moves when the reader drags the slider.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || reducedMotion() || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    let frame;
    let done = false;
    const play = () => {
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / 1100);
        setT(Math.max(0.02, 1 - Math.pow(1 - p, 3)));
        if (p < 1) frame = requestAnimationFrame(step);
      };
      setT(0.02);
      frame = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      if (!done && entries.some((e) => e.isIntersecting)) {
        done = true;
        io.disconnect();
        play();
      }
    }, {threshold: 0.4});
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

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
    <div className={styles.chartCard} ref={cardRef}>
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
          onChange={(e) => { setRate(Number(e.target.value)); setT(1); }} />
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
          <div className={`${styles.fu} ${styles.lockup}`} style={{animationDelay: '0s'}}>
            <img src={logo} alt="Notes by Sara logo" className={styles.lockupLogo} />
            <div>
              <div className={styles.lockupName}>Notes by Sara</div>
              <div className={styles.lockupTag}>Structured finance notes</div>
            </div>
          </div>
          <Heading as="h1" className={`${styles.fu} ${styles.heroTitle}`} style={{animationDelay: '.03s'}}>
            Finance, <span className={styles.heroAccent}>explained in order</span>
          </Heading>
          <p className={`${styles.fu} ${styles.heroSubtitle}`} style={{animationDelay: '.06s'}}>
            Clear notes that take you from your first spreadsheet to derivatives,
            with the working shown at every step.
          </p>
          <div className={`${styles.fu} ${styles.heroButtons}`} style={{animationDelay: '.09s'}}>
            <Link className={styles.primaryButton} to="/courses/financial-data-to-insight">
              Start the free course
            </Link>
            <Link className={styles.secondaryButton} to="/notes">
              See the learning path
            </Link>
          </div>
          <p className={`${styles.fu} ${styles.heroNote}`} style={{animationDelay: '.12s'}}>
            Free to read. No account needed.
          </p>
        </div>
        <div className={`${styles.fu} ${styles.heroChart}`} style={{animationDelay: '.06s'}}>
          <GrowthChart />
        </div>
      </div>
      <div className={`${styles.fu} ${styles.projBand}`} style={{animationDelay: '.12s'}}>
        <div className={styles.projText}>
          <div className={styles.projKicker}>Free project · Start here</div>
          <p className={styles.projLine}>
            Your first real analysis: compare Walmart and Target using their published results, with a
            workbook that checks your answers. New to this?{' '}
            <Link to="/courses/financial-data-to-insight/from-raw-numbers-to-decisions" className={styles.projLink}>
              Start the course from lesson 1.
            </Link>
          </p>
        </div>
        <Link className={styles.projButton} to="/courses/financial-data-to-insight/project-01-walmart-vs-target">
          Start the free project →
        </Link>
      </div>
    </header>
  );
}

function TermStrip() {
  const list = TERMS;
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
            Start with the free course, then work forward. Each subject opens as its notes are published.
          </p>
        </div>
        <div ref={ref} className={`${styles.path} ${cls}`}>
          <div className={styles.rail} aria-hidden="true">
            <div className={styles.railLine} />
            <div className={styles.railDots}>
              {subjects.map((s, i) => (
                <div key={s.name} className={styles.dot} />
              ))}
            </div>
          </div>
          <div className={styles.vline} aria-hidden="true" />
          <div className={styles.stageGrid}>
            {subjects.map((s, i) => (
              <div key={s.name} className={styles.stageWrap}>
                <div className={styles.tileDot} aria-hidden="true" />
                {s.live ? (
                  <Link to={s.to} className={styles.stageLive}>
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
          <Link to="/courses/financial-data-to-insight/from-raw-numbers-to-decisions" className={styles.featureCard}>
            <span className={styles.featureEyebrow}>Free course · Lesson 1 of 12</span>
            <span className={styles.featureTitle}>Read a business through its numbers</span>
            <span className={styles.featureBody}>
              The three financial statements, and the six-step method that takes you
              from numbers to a decision. The first lesson of the free Financial
              Data-to-Insight course.
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
