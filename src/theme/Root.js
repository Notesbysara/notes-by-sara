import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

// All notes are public. Accounts are kept for later features
// (saved progress, paid material), but nothing is locked behind login.
export default function Root({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
