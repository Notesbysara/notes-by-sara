import React, { useEffect } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const history = useHistory();
  const isProtected = location.pathname.startsWith('/notes');

  useEffect(() => {
    if (!loading && isProtected && !user) {
      history.replace('/login');
    }
  }, [loading, isProtected, user, location.pathname]);

  if (isProtected && (loading || !user)) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', fontFamily: 'Poppins, sans-serif', color: '#8A8378' }}>
        Checking your session…
      </div>
    );
  }

  return children;
}

export default function Root({ children }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
