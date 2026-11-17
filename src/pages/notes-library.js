import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Redirect} from '@docusaurus/router';

// The Notes library is folded into the Learning path until the first notes are published.
// The full library page is saved in _notes-library.saved.js. To bring it back, copy that file over this one.
export default function Moved() {
  return (
    <Layout title="Learning path" noFooter>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/notes" />
        <link rel="canonical" href="https://notesbysara.org/notes" />
      </Head>
      <Redirect to="/notes" />
      <main style={{padding: '48px 16px', textAlign: 'center'}}>
        <p>
          This page has moved to <Link to="/notes">/notes</Link>.
        </p>
      </main>
    </Layout>
  );
}
