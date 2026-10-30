import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const pillars = [
  {
    title: 'One path, in order',
    body: 'Nine subjects, arranged so every concept builds on the one before it. You always know what to learn next.',
  },
  {
    title: 'Intuition before formulas',
    body: 'Each note explains the idea in plain words first, then the formula, with every term defined.',
  },
  {
    title: 'Worked examples throughout',
    body: 'Real numbers, every step shown, so you can follow the method and repeat it in an exam.',
  },
  {
    title: 'One consistent system',
    body: 'The same structure, notation and level of detail across every subject, from financial math to derivatives.',
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
    a: 'Notes by Sara is a free, structured set of finance notes. It covers finance in nine subjects, from the time value of money and accounting basics to valuation, fixed income and derivatives.',
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
    q: 'Is this financial advice?',
    a: 'No. All content is for education only and is not financial, investment or professional advice.',
  },
  {
    q: 'How often are new notes published?',
    a: 'Notes are published subject by subject. Foundations is open now, and the other subjects follow in order.',
  },
  {
    q: 'Can I suggest a topic?',
    a: 'Yes. Email support@notesbysara.org with the concept you would like explained.',
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

function Hero() {
  return (
    <header className={styles.heroBanner}>
      <p className={styles.heroEyebrow}>Structured finance notes</p>
      <Heading as="h1" className={styles.heroTitle}>
        Finance, <span className={styles.heroAccent}>explained in order</span>
      </Heading>
      <p className={styles.heroSubtitle}>
        Clear, structured notes that take you from the time value of money to
        valuation, markets and derivatives, with a worked example in
        every lesson.
      </p>
      <div className={styles.heroButtons}>
        <Link className={`button button--lg ${styles.primaryButton}`} to="/notes/foundations/time-value-of-money">
          Start with Foundations
        </Link>
        <Link className={`button button--lg button--outline ${styles.secondaryButton}`} to="/notes">
          See the learning path
        </Link>
      </div>
      <p className={styles.heroNote}>Free to read. No account needed.</p>
    </header>
  );
}

function Pillars() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Why learn with Notes by Sara</Heading>
        <p className={styles.sectionLead}>
          AI tools answer single questions. Notes by Sara teaches finance in order.
        </p>
        <div className={styles.pillarGrid}>
          {pillars.map((p) => (
            <div key={p.title} className={styles.stepCard}>
              <div className={styles.stepTitle}>{p.title}</div>
              <div className={styles.stepBody}>{p.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningPath() {
  return (
    <section className={`${styles.section} ${styles.sectionTinted}`}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>The learning path</Heading>
        <p className={styles.sectionLead}>
          Start at the foundations and work forward. Each subject opens as its notes are published.
        </p>
        <div className={styles.stageGrid}>
          {subjects.map((s) =>
            s.live ? (
              <Link key={s.name} to="/notes/foundations/time-value-of-money" className={styles.stageLive}>
                <span className={styles.stageName}>{s.name}</span>
                <span className={styles.stageStatus}>Open now</span>
              </Link>
            ) : (
              <div key={s.name} className={styles.stageSoon}>
                <span className={styles.stageName}>{s.name}</span>
                <span className={styles.stageStatusSoon}>Coming soon</span>
              </div>
            ),
          )}
        </div>
        <div className={styles.centerLink}>
          <Link to="/notes">See the learning path</Link>
        </div>
      </div>
    </section>
  );
}

function StartHere() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Start here</Heading>
        <Link to="/notes/foundations/time-value-of-money" className={styles.featureCard}>
          <span className={styles.featureEyebrow}>Foundations</span>
          <span className={styles.featureTitle}>Time value of money</span>
          <span className={styles.featureBody}>
            Why money today is worth more than money tomorrow, how to discount a
            future cash flow, and how annuities are valued. The idea every other
            topic in finance is built on.
          </span>
          <span className={styles.featureCta}>Read the note →</span>
        </Link>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Frequently asked questions</Heading>
        <div className={styles.faqList}>
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
      description="Free, structured finance notes in nine subjects, from the time value of money to valuation, markets and derivatives, with worked examples in every lesson.">
      <Head>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Head>
      <Hero />
      <main>
        <Pillars />
        <LearningPath />
        <StartHere />
        <FAQ />
      </main>
    </Layout>
  );
}
