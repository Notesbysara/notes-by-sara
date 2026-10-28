import {useCallback, useEffect, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/** Share a term page: native share sheet where available, otherwise copy the link. */
export default function useShare() {
  const {siteConfig} = useDocusaurusContext();
  const [notice, setNotice] = useState('');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (message) => {
    setNotice(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(''), 2200);
  };

  const share = useCallback(
    async (term, slug) => {
      const url = `${siteConfig.url}/dictionary/${slug}`;
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({title: `${term} | Notes by Sara`, url});
          return;
        } catch (e) {
          if (e && e.name === 'AbortError') return; // person closed the share sheet
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        show('Link copied');
      } catch (e) {
        // Older browsers: fall back to a hidden text box.
        try {
          const box = document.createElement('textarea');
          box.value = url;
          box.setAttribute('readonly', '');
          box.style.position = 'fixed';
          box.style.opacity = '0';
          document.body.appendChild(box);
          box.select();
          document.execCommand('copy');
          document.body.removeChild(box);
          show('Link copied');
        } catch (err) {
          show(url);
        }
      }
    },
    [siteConfig.url],
  );

  return {share, notice};
}
