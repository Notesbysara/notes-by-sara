import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import {SUBJECTS, ALL_NOTES, COURSES, noteLabel} from './catalog';
import styles from './LearningPath.module.css';
import Prerequisites from '../Prerequisites';

const GOALS = [
  {
    id: 'new',
    label: 'I am new to finance',
    advice:
      'Start with the prerequisites you need: short lessons on math, statistics and accounting, about five minutes each. Then work down the subjects in order from Foundations, as their notes are published.',
    open: 0,
  },
  {
    id: 'course',
    label: 'I am studying a course',
    advice:
      'Open the subject your course is on and check its status. Notes are published subject by subject, in order.',
    open: -1,
  },
  {
    id: 'topic',
    label: 'I need one topic fast',
    advice:
      'Look the term up in the Financial Dictionary, or work it through in Formulas. Then come back here to see what to learn next.',
    open: -1,
    link: {to: '/dictionary', label: 'Go to the Financial Dictionary'},
  },
];

const STEPS = [
  ['A clear definition', 'of every key term, in a highlighted box.'],
  ['The idea in plain words', 'with an everyday example and a tip.'],
  ['One worked example', 'followed through every step, with charts where they help.'],
  ['What it looks like at work', 'and how to explain it to your manager.'],
];

const ROUTE = 'M28 188 L76 160 L120 176 L164 128 L206 140 L244 92 L284 104 L318 60 L338 30';
const NODES = [
  [28, 188],
  [76, 160],
  [120, 176],
  [164, 128],
  [206, 140],
  [244, 92],
  [284, 104],
  [318, 60],
  [338, 30],
];

function RouteArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <svg viewBox="0 0 360 224" className={styles.artSvg}>
        <g stroke="#dde6e1" strokeWidth="1">
          <line x1="0" y1="56" x2="360" y2="56" />
          <line x1="0" y1="112" x2="360" y2="112" />
          <line x1="0" y1="168" x2="360" y2="168" />
        </g>
        <path
          className={styles.route}
          pathLength="100"
          d={ROUTE}
          fill="none"
          stroke="#0e7c5a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {NODES.map((p, i) => (
          <circle key={i} className={styles.nd} style={{animationDelay: i * 0.6 + 's'}} cx={p[0]} cy={p[1]} r="7" />
        ))}
        <circle className={styles.mk} r="5" fill="#ffffff" stroke="#0a5b42" strokeWidth="2.5">
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            calcMode="linear"
            keyPoints="0;1;1"
            keyTimes="0;0.7;1"
            path={ROUTE}
          />
        </circle>
        <text x="14" y="214" fontSize="11" fill="#4f625a">
          Start here
        </text>
        <text x="320" y="16" fontSize="11" fill="#4f625a" textAnchor="end">
          Where it leads
        </text>
      </svg>
      <div className={styles.artCaption}>One route, one step at a time</div>
    </div>
  );
}

export default function LearningPath() {
  const [goal, setGoal] = useState(null);
  const [open, setOpen] = useState(-1);

  const course = COURSES[0];
  // The first published note, or lesson 1 of the course while no notes are published yet.
  const next = ALL_NOTES[0] || {
    title: 'Numbers in finance',
    blurb: 'The first prerequisite lesson: units, brackets, rounding and big numbers. About five minutes.',
    to: 'pathname:///lessons/mathematics/numbers-in-finance.html',
  };
  const currentGoal = GOALS.find((g) => g.id === goal);

  function pickGoal(g) {
    setGoal(g.id);
    setOpen(g.open);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.eyebrow}>Finance learning path</div>
          <h1 className={styles.h1}>What should I learn next?</h1>
          <p className={styles.lead}>
            One route through finance, in order, from Foundations to Derivatives. Short prerequisite lessons cover the
            math, statistics and accounting it builds on. Looking for one term? Use the <Link to="/dictionary">Financial Dictionary</Link>.
          </p>
        </div>
        <RouteArt />
      </section>

      <section className={styles.goals}>
        <div className={styles.goalsTitle}>Where are you starting?</div>
        <div className={styles.chips}>
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={goal === g.id}
              className={goal === g.id ? styles.chipOn : styles.chip}
              onClick={() => pickGoal(g)}>
              {g.label}
            </button>
          ))}
        </div>
        <div className={styles.advice}>
          {currentGoal ? currentGoal.advice : 'Pick one and the page points you to the right place. You can change it at any time.'}
          {currentGoal && currentGoal.link ? (
            <>
              {' '}
              <Link to={currentGoal.link.to}>{currentGoal.link.label}</Link>
            </>
          ) : null}
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.side}>
          <div className={styles.next}>
            <div className={styles.nextKicker}>Your first lesson</div>
            <div className={styles.nextTitle}>{next.title}</div>
            <div className={styles.nextText}>{next.blurb}</div>
            <Link to={next.to} className={styles.nextCta}>
              Read the lesson
            </Link>
          </div>
        </div>

        <div className={styles.main}>
        <Prerequisites compact title="Prerequisites" lead="3 subjects · 67 short lessons" />
        <div className={styles.thenLabel}>The subjects, in order</div>
        <ol className={styles.stepper}>
          {SUBJECTS.map((s, i) => {
            const live = s.notes.length > 0;
            const isOpen = open === i;
            const status = live ? 'Open now' : 'Coming soon';
            const panelId = 'subject-panel-' + i;
            return (
              <li key={s.name} className={styles.stage}>
                <span className={live ? styles.dotLive : styles.dot} aria-hidden="true">
                  {i + 1}
                </span>
                <div className={live ? styles.cardLive : styles.card}>
                  <button
                    type="button"
                    className={styles.cardHead}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span className={styles.headText}>
                      <span className={styles.subjectName}>{s.name}</span>
                      <span className={live ? styles.statusLive : styles.status}>{status}</span>
                    </span>
                    <span className={styles.toggle}>{isOpen ? 'Hide' : 'Show'}</span>
                  </button>
                  <div id={panelId} className={styles.panel} hidden={!isOpen}>
                    <div className={styles.panelLabel}>What it covers</div>
                    <div className={styles.pills}>
                      {s.covers.map((c) => (
                        <span key={c} className={styles.pill}>
                          {c}
                        </span>
                      ))}
                    </div>
                    {live ? (
                      <>
                        <div className={styles.panelLabel}>Notes, in order</div>
                        {s.notes.map((n, j) => (
                          <div key={n.slug} className={styles.noteRow}>
                            <div className={styles.noteText}>
                              <div className={styles.noteTitle}>
                                {noteLabel(n, j)}. {n.title}
                              </div>
                              <div className={styles.small}>{n.meta}</div>
                            </div>
                            <Link to={n.to} className={styles.readBtn}>
                              Read the note
                            </Link>
                          </div>
                        ))}
                        {s.course ? (
                          <Link to={s.course.to} className={styles.courseLink}>
                            {s.course.label} →
                          </Link>
                        ) : null}
                        <div className={styles.small}>
                          More notes in this subject are added in order. They appear here as they are published.
                        </div>
                      </>
                    ) : (
                      <div className={styles.soon}>
                        Notes for this subject are not published yet. They follow the subjects above, in order.
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <p className={styles.courseLine}>
          Want a hands-on project? Try the free course{' '}
          <Link to={course.to}>{course.name} →</Link>
        </p>
        </div>
      </section>

      <section className={styles.how}>
        <h2 className={styles.h2}>How each note works</h2>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s[0]} className={styles.step}>
              <span className={styles.stepNum}>{i + 1}</span>
              <span>
                <b>{s[0]}</b>, {s[1]}
              </span>
            </div>
          ))}
        </div>
        <p className={styles.suggest}>
          Stuck on a concept? Email <a href="mailto:support@notesbysara.org">support@notesbysara.org</a>. Requests help
          decide what gets written next.
        </p>
      </section>
    </div>
  );
}
