import React from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function FormulaLibrary() {
  const src = useBaseUrl('/formula-library-app.html');
  return (
    <Layout
      title="Financial Formula & Calculator Library"
      description="Finance formulas with plain-English meanings, worked examples and step-by-step calculators."
      noFooter
    >
      <iframe
        src={src}
        title="Financial Formula & Calculator Library"
        style={{ width: '100%', height: 'calc(100vh - var(--ifm-navbar-height))', border: 0, display: 'block' }}
      />
    </Layout>
  );
}
