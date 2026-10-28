import React from 'react';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '../contexts/AuthContext';

export default function AuthNavbarItem() {
  const { user, loading, signOut } = useAuth();
  const history = useHistory();

  if (loading) return null;

  if (!user) {
    return (
      <Link className="navbar__item navbar__link" to="/login">
        Log in
      </Link>
    );
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut();
    history.push('/');
  };

  return (
    <a className="navbar__item navbar__link" href="#" onClick={handleLogout}>
      Log out
    </a>
  );
}
