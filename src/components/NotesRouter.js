import React from 'react';
import { useLocation } from '@docusaurus/router';
import NotesIndex from './NotesIndex';
import NoteViewer from './NoteViewer';

export default function NotesRouter() {
  const location = useLocation();
  const parts = location.pathname
    .replace(/^\/notes\/?/, '')
    .split('/')
    .filter(Boolean);

  if (parts.length >= 2) {
    const [subject, slug] = parts;
    return <NoteViewer subject={decodeURIComponent(subject)} slug={decodeURIComponent(slug)} />;
  }

  return <NotesIndex />;
}
