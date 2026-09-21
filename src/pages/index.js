import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const steps = [
  {n: 1, title: 'Pick a subject', body: "Browse by topic, or search for exactly the concept you're stuck on."},
  {n: 2, title: 'Read the note', body: 'Written plainly, with worked examples, so it actually sticks before an exam.'},
  {n: 3, title: 'Come back as it grows', body: 'This is a running notebook. New notes and subjects get added as I write them.'},
];

const faqs = [
  {
    q: 'What is Notes by Sara?',
    a: "A personal, continuously-updated notebook of finance notes, written by Sara as she studies corporate finance, valuation, and markets. It's free to read and open to anyone studying the same subjects.",
  },
  {
    q: 'Is this financial advice?',
    a: 'No. Everything here is for learning purposes only and should not be treated as financial, investment, or professional advice.',
  },
  {
    q: 'How often are new notes added?',
    a: "There's no fixed schedule. New notes and subjects go up as Sara writes them, alongside her own studying.",
  },
  {
    q: 'Can I suggest a topic?',
    a: 'Yes. Reach out at support@notesbysara.org with anything you\'d like to see covered.',
  },
];

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <p className={styles.heroEyebrow}>Hi, I'm Sara</p>
      <Heading as="h1" className={styles.heroTitle}>
        A finance education, one honest note at a time
      </Heading>
      <p className={styles.heroSubtitle}>
        I've spent the last few years teaching myself finance, valuation, and
        markets. This is that notebook, kept up as I keep learning, open for
        anyone studying the same things.
      </p>
      <div className={styles.heroButtons}>
        <Link className="button button--lg" to="/docs/corporate-finance/time-value-of-money" style={{background: 'var(--nbs-accent)', color: '#FCFBF7', border: 'none', fontWeight: 600}}>
          Start with Corporate Finance
        </Link>
        <Link className="button button--lg button--outline" to="/about" style={{color: '#221F1B', borderColor: '#221F1B', borderWidth: '2px'}}>
          Why this exists
        </Link>
      </div>
    </header>
  );
}

function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>How this notebook works</Heading>
        <div className={styles.stepsGrid}>
          {steps.map((s) => (
            <div key={s.n} className={styles.stepCard}>
              <div className={styles.stepNumber}>{s.n}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <div className={styles.stepBody}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Subjects() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Browse the notebook</Heading>
        <div className={styles.subjectGrid}>
          <Link to="/docs/corporate-finance/time-value-of-money" className={styles.subjectCardLive}>
            <div className={styles.subjectLabel}>Corporate Finance</div>
            <div className={styles.subjectBlurbLive}>Time value of money</div>
          </Link>
          <div className={styles.subjectCardSoon}>
            <div className={styles.subjectLabel}>More subjects</div>
            <div className={styles.subjectBlurbSoon}>Coming as I write them</div>
          </div>
        </div>
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
      title="Notes by Sara"
      description="A personal, continuously-updated finance notebook covering corporate finance, valuation, and markets, explained clearly.">
      <HomepageHeader />
      <main>
        <HowItWorks />
        <Subjects />
        <FAQ />
      </main>
    </Layout>
  );
}
