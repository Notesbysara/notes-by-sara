import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Redirect} from '@docusaurus/router';

// The course page moved to /courses/financial-data-to-insight.
export default function Moved() {
  return (
    <Layout title="Financial Data-to-Insight" noFooter>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/courses/financial-data-to-insight" />
        <link rel="canonical" href="https://notesbysara.org/courses/financial-data-to-insight" />
      </Head>
      <Redirect to="/courses/financial-data-to-insight" />
      <main style={{padding: '48px 16px', textAlign: 'center'}}>
        <p>
          This page has moved to <Link to="/courses/financial-data-to-insight">/courses/financial-data-to-insight</Link>.
        </p>
      </main>
    </Layout>
  );
}
