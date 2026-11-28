import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({ user: null, loading: true, signOut: () => {} });

const SYNC_KEY = 'nbs-session-sync';
const REMEMBER_KEY = 'nbs-remember';
const WEEK = 7 * 24 * 60 * 60 * 1000;

// Tells the server (Cloudflare) that this browser is signed in, so full lesson
// pages are sent. The server checks the token with Supabase and sets a signed,
// HttpOnly cookie. Re-sent at most once a week per user, or on demand.
export async function syncServerSession(session, force = false) {
  if (typeof window === 'undefined' || !session) return false;
  let remember = true;
  try { remember = localStorage.getItem(REMEMBER_KEY) !== '0'; } catch (e) {}
  try {
    const last = JSON.parse(localStorage.getItem(SYNC_KEY) || 'null');
    if (!force && last && last.u === session.user.id && Date.now() - last.t < WEEK) return true;
  } catch (e) {}
  try {
    const r = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ access_token: session.access_token, remember }),
    });
    if (!r.ok) return false;
    try { localStorage.setItem(SYNC_KEY, JSON.stringify({ u: session.user.id, t: Date.now() })); } catch (e) {}
    return true;
  } catch (e) {
    return false; // e.g. local development without the Cloudflare functions
  }
}

async function clearServerSession() {
  try { localStorage.removeItem(SYNC_KEY); } catch (e) {}
  try { await fetch('/api/session', { method: 'DELETE', credentials: 'same-origin' }); } catch (e) {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session) syncServerSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_IN' && session) syncServerSession(session, true);
      if (event === 'SIGNED_OUT') clearServerSession();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await clearServerSession();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
