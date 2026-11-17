import React, {useLayoutEffect, useRef} from 'react';

// Shows one line of a formula. If the line is wider than its box, the text shrinks a little
// to fit, so the page never needs a side-to-side scrollbar.
const useIsoLayoutEffect = typeof window === 'undefined' ? () => {} : useLayoutEffect;

export default function FitLine({html, className}) {
  const ref = useRef(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      el.style.fontSize = '';
      const inner = el.firstElementChild;
      if (!inner) return;
      const avail = el.clientWidth;
      const need = inner.scrollWidth;
      if (need > avail && avail > 0) el.style.fontSize = `${Math.max(0.55, avail / need) * 100}%`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [html]);
  return (
    <span ref={ref} className={className}>
      <span style={{display: 'inline-block', whiteSpace: 'nowrap'}} dangerouslySetInnerHTML={{__html: html}} />
    </span>
  );
}
