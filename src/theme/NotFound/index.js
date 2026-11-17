import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import styles from './NotFound.module.css';

// The site's own 404 page: a short note, a dictionary search and three ways back in.
export default function NotFound() {
  const history = useHistory();
  const [q, setQ] = useState('');
  const search = (e) => {
    e.preventDefault();
    const term = q.trim();
    history.push(term ? `/dictionary?q=${encodeURIComponent(term)}` : '/dictionary');
  };
  return (
    <Layout title="Page not found">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={styles.page}>
        <p className={styles.big} aria-hidden="true">404</p>
        <h1 className={styles.title}>This page isn&rsquo;t here</h1>
        <p className={styles.text}>It may have moved when the course got its own section. Try one of these instead.</p>
        <form className={styles.form} role="search" onSubmit={search}>
          <label htmlFor="nf-search" className={styles.srOnly}>Search the Financial Dictionary</label>
          <input
            id="nf-search"
            type="search"
            className={styles.input}
            placeholder="Search 1,725 finance terms"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className={styles.go}>Search</button>
        </form>
        <div className={styles.links}>
          <Link to="/courses/financial-data-to-insight" className={styles.primary}>Start the free course</Link>
          <Link to="/notes" className={styles.ghost}>See the learning path</Link>
          <Link to="/dictionary" className={styles.ghost}>Open the dictionary</Link>
        </div>
      </main>
    </Layout>
  );
}
