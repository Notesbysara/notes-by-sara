import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import NoteExtras from '@site/src/components/notes/NoteExtras';

// Adds the side note and the phone bottom bar to course topics only.
export default function FooterWrapper(props) {
  const {metadata, frontMatter} = useDoc();
  const isTopic = metadata.permalink.startsWith('/notes/foundations/') && !frontMatter.unlisted;
  return (
    <>
      <Footer {...props} />
      {isTopic ? <NoteExtras permalink={metadata.permalink} previous={metadata.previous} next={metadata.next} /> : null}
    </>
  );
}
