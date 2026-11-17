// When a reader moves to another page (for example with Next), always start at the top.
// Browsers sometimes keep the old scroll position while the new page loads, which can
// land the reader at the bottom of the next lesson. Links to a heading (#...) are left alone.
export function onRouteDidUpdate({location, previousLocation}) {
  if (!previousLocation || location.hash) return;
  if (location.pathname === previousLocation.pathname) return;
  const top = () => window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  top();
  window.requestAnimationFrame(top);
  window.setTimeout(top, 60);
}
