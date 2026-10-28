import React, {useEffect, useState} from 'react';
import NotFound from '@theme-original/NotFound';
import Link from '@docusaurus/Link';

// Wraps the standard 404 page. If the missing address was a dictionary term,
// add a link back to the dictionary.
export default function NotFoundWrapper(props) {
  const [inDictionary, setInDictionary] = useState(false);
  useEffect(() => {
    setInDictionary(window.location.pathname.startsWith('/dictionary'));
  }, []);
  return (
    <>
      <NotFound {...props} />
      {inDictionary && (
        <p style={{textAlign: 'center', paddingBottom: '4rem', fontSize: '1.05rem'}}>
          <Link to="/dictionary">&larr; Back to the Financial Dictionary</Link>
        </p>
      )}
    </>
  );
}
