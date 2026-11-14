import React, {useState} from 'react';

// A dictionary word inside a note. It links to the word's page in the
// Financial Dictionary (always in a new tab) and shows the dictionary's
// definition when you point at it or move to it with the keyboard.
export default function Term({slug, name, def, children}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="nbs-term" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <a
        href={`/dictionary/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}>
        {children}
      </a>
      {open && def ? (
        <span className="nbs-pop" role="tooltip">
          <b>{name}</b>
          <span style={{color: 'inherit', fontSize: 'inherit', fontWeight: 400}}>{def}</span>
          <span>Opens in the dictionary ↗</span>
        </span>
      ) : null}
    </span>
  );
}
