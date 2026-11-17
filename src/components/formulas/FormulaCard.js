import React, {memo, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {loadFormulaCards} from '../../lib/formulaCards';
import FitLine from './FitLine';
import styles from '../dictionary/dictionary.module.css';
import fstyles from './formulas.module.css';
import {BookmarkIcon, ChevronIcon, ShareIcon} from '../dictionary/Icons';

// One formula on the list, built like a Dictionary card.
// "Show formula" opens the formula, when to use it, and a link to the calculator.
function FormulaCard({f, isSaved, onToggleSave, onShare}) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [failed, setFailed] = useState(false);
  const panelId = `formula-${f.slug}`;
  const dataUrl = useBaseUrl('/formula-cards.json');
  const to = `/formula-library/${f.slug}`;

  const fetchDetail = () => {
    if (detail) return;
    loadFormulaCards(dataUrl)
      .then((all) => {
        setDetail(all[f.slug] || null);
        setFailed(!all[f.slug]);
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
          <Link to={to}>{f.name}</Link>
        </h2>
        <span className={styles.badge}>{f.level}</span>
      </div>

      <p className={styles.cardDefinition}>{f.finds}</p>

      {open && (
        <div id={panelId} className={styles.explanation}>
          {detail && (
            <>
              {detail.mathml ? (
                <FitLine className={fstyles.cardMath} html={detail.mathml} />
              ) : (
                <p className={fstyles.cardMathText}>{detail.text}</p>
              )}
              <p>{detail.when}</p>
            </>
          )}
          {!detail && !failed && <p className={styles.loading}>Loading formula…</p>}
          {failed && (
            <p>
              The formula could not load here. <Link to={to}>Open the full page</Link>.
            </p>
          )}
          <p className={fstyles.cardLink}>
            <Link to={to}>Open the calculator and worked example &rarr;</Link>
          </p>
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
          <span>{open ? 'Hide formula' : 'Show formula'}</span>
          <span className={styles.srOnly}> for {f.name}</span>
        </button>

        <div className={styles.iconRow}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-pressed={isSaved}
            aria-label={`${isSaved ? 'Remove from saved' : 'Save'}: ${f.name}`}
            title={isSaved ? 'Saved' : 'Save'}
            onClick={() => onToggleSave(f.slug)}>
            <BookmarkIcon filled={isSaved} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Share: ${f.name}`}
            title="Share"
            onClick={() => onShare(f.name, f.slug, '/formula-library')}>
            <ShareIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(FormulaCard);
