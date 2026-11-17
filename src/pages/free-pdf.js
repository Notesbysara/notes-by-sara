import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Redirect} from '@docusaurus/router';

// The Dictionary PDF page moved to /dictionary-free-pdf. Old links land here and are sent on.
export default function Moved() {
  return (
    <Layout title="Free Financial Dictionary Quick Reference" noFooter>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/dictionary-free-pdf" />
        <link rel="canonical" href="https://notesbysara.org/dictionary-free-pdf" />
      </Head>
      <Redirect to="/dictionary-free-pdf" />
      <main style={{padding: '48px 16px', textAlign: 'center'}}>
        <p>
          This page has moved to <Link to="/dictionary-free-pdf">the free Dictionary PDF page</Link>.
        </p>
      </main>
    </Layout>
  );
}
