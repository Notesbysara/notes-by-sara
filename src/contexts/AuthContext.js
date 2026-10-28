import React, { createContext, useContext, useEffect, useState } from 'react';
// The Supabase client is loaded after the page appears (dynamic import), so it
// does not slow down first paint on public pages like the dictionary.
const loadSupabase = () => import('../lib/supabaseClient').then((m) => m.supabase);

const AuthContext = createContext({ user: null, loading: true, signOut: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => {};

    loadSupabase().then((supabase) => {
      if (!mounted) return;

      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        setUser(data.session?.user ?? null);
        setLoading(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
      unsubscribe = () => listener.subscription.unsubscribe();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = await loadSupabase();
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
