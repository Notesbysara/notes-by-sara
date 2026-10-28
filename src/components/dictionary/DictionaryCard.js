import React, {memo, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {loadExplanations} from '../../lib/dictionaryExplanations';
import styles from './dictionary.module.css';
import {BookmarkIcon, ChevronIcon, ShareIcon} from './Icons';

function DictionaryCard({entry, isSaved, onToggleSave, onShare}) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [failed, setFailed] = useState(false);
  const panelId = `explain-${entry.slug}`;
  const dataUrl = useBaseUrl('/dictionary-explanations.json');

  const fetchDetail = () => {
    if (detail) return;
    loadExplanations(dataUrl)
      .then((all) => {
        setDetail(all[entry.id] || null);
        setFailed(!all[entry.id]);
      })
      .catch(() => setFailed(true));
  };

  const toggleOpen = () => {
    if (!open) {
      setFailed(false);
      fetchDetail();
    }
    setOpen((v) => !v);
  };

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <h2 className={styles.cardTerm}>
          <Link to={`/dictionary/${entry.slug}`}>{entry.term}</Link>
        </h2>
        <span className={styles.badge}>{entry.difficulty}</span>
      </div>

      {entry.also_known_as.length > 0 && (
        <p className={styles.aka}>
          <span className={styles.akaLabel}>Also known as:</span> {entry.also_known_as.join(', ')}
        </p>
      )}

      <p className={styles.cardDefinition}>{entry.definition}</p>

      {open && (
        <div id={panelId} className={styles.explanation}>
          {detail &&
            detail.explanation.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          {detail && detail.note && <p className={styles.note}>Note: {detail.note.replace(/^Note:\s*/i, '')}</p>}
          {!detail && !failed && <p className={styles.loading}>Loading explanation…</p>}
          {failed && (
            <p>
              The explanation could not load here. <Link to={`/dictionary/${entry.slug}`}>Open the full page</Link>.
            </p>
          )}
        </div>
      )}

      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.expandBtn}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onMouseEnter={fetchDetail}
          onFocus={fetchDetail}
          onClick={toggleOpen}>
          <span className={open ? styles.chevronOpen : styles.chevron}>
            <ChevronIcon />
          </span>
          <span>{open ? 'Hide explanation' : 'Show explanation'}</span>
          <span className={styles.srOnly}> for {entry.term}</span>
        </button>

        <div className={styles.iconRow}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-pressed={isSaved}
            aria-label={`${isSaved ? 'Remove from saved' : 'Save'}: ${entry.term}`}
            title={isSaved ? 'Saved' : 'Save'}
            onClick={() => onToggleSave(entry.id)}>
            <BookmarkIcon filled={isSaved} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Share: ${entry.term}`}
            title="Share"
            onClick={() => onShare(entry.term, entry.slug)}>
            <ShareIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(DictionaryCard);
