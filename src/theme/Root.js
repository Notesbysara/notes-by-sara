import React from 'react';
import {useLocation} from '@docusaurus/router';
import {AuthProvider, useAuth} from '../contexts/AuthContext';

// Every lesson is free with an account. Lesson pages in /lessons are protected
// on the server (functions/_middleware.js). Course topics are built into the
// site's scripts, so here they are covered in the browser: visitors who are not
// signed in see the start of the topic and a sign-in card.
const COURSE_FREE = new Set([
  '/courses/financial-data-to-insight/excel-for-this-course',
  '/courses/financial-data-to-insight/numbers-and-statistics',
  '/courses/financial-data-to-insight/from-raw-numbers-to-decisions',
]);

function isGatedCourseTopic(path) {
  const p = path.replace(/\/$/, '');
  return /^\/courses\/[^/]+\/[^/]+$/.test(p) && !COURSE_FREE.has(p);
}

function CourseGate() {
  const {user, loading} = useAuth();
  const {pathname} = useLocation();
  const gated = isGatedCourseTopic(pathname);
  React.useEffect(() => {
    const on = gated && !loading && !user;
    document.documentElement.classList.toggle('nbs-gated', on);
    return () => document.documentElement.classList.remove('nbs-gated');
  }, [gated, loading, user]);
  if (!gated || loading || user) return null;
  const next = encodeURIComponent(pathname);
  return (
    <div className="nbs-course-gate" role="region" aria-label="Sign in to keep reading">
      <div className="nbs-course-card">
        <span className="nbs-course-free">Free with an account</span>
        <h2>Keep reading. It's free.</h2>
        <p>Sign in to read the rest of this topic and every lesson on the site. Your progress is saved wherever you sign in.</p>
        <a className="nbs-course-btn" href={`/login?provider=google&next=${next}`}>Continue with Google</a>
        <a className="nbs-course-btn nbs-course-gh" href={`/login?provider=github&next=${next}`}>Continue with GitHub</a>
        <a className="nbs-course-link" href={`/login?next=${next}#email`}>Use email instead</a>
      </div>
    </div>
  );
}

export default function Root({children}) {
  return (
    <AuthProvider>
      {children}
      <CourseGate />
    </AuthProvider>
  );
}
