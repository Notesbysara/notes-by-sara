import React, {useCallback, useEffect, useRef, useState} from 'react';
import BookArt, {MiniCover} from './BookArt';
import SignupForm from './SignupForm';
import {PDF_TITLE} from './config';
import {hideForDays, isHidden, isSubscribed, recordTermView} from './storage';
import styles from './signup.module.css';

// Rough heights, used only to keep the pop-up clear of the definition.
const DESKTOP_HEIGHT = 330;
const PHONE_HEIGHT = 110;
const PHONE_QUERY = '(max-width: 768px)';

/**
 * Extra sign-up prompt for dictionary term pages only. Rules:
 * - never on first arrival: only after the reader scrolls past half the page, or opens a second term page;
 * - never covers the definition, and steps aside when the card at the bottom of the page is on screen;
 * - fixed to the bottom of the screen, so it never pushes content down; no dimmed background;
 * - on phones it is one small strip that points to the card at the bottom of the page;
 * - the close button or Escape closes it, and it stays away for 30 days after closing or signing up.
 */
export default function SignupPopup({slug}) {
  const [armed, setArmed] = useState(false);
  const [fits, setFits] = useState(false);
  const [closed, setClosed] = useState(true);
  const [phone, setPhone] = useState(false);
  const armedRef = useRef(false);

  useEffect(() => {
    if (isHidden() || isSubscribed()) {
      setClosed(true);
      return undefined;
    }
    setClosed(false);
    setArmed(false);
    setFits(false);
    armedRef.current = false;

    const secondPage = recordTermView(slug) >= 2;
    const mq = window.matchMedia(PHONE_QUERY);
    let isPhone = mq.matches;
    setPhone(isPhone);
    let frame = 0;
    let armTimer = 0;

    const scrolledHalf = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 200 && window.scrollY / max >= 0.5;
    };

    const arm = () => {
      armedRef.current = true;
      setArmed(true);
    };

    const fitsNow = () => {
      const top = window.innerHeight - (isPhone ? PHONE_HEIGHT : DESKTOP_HEIGHT) - 16;
      const def = document.querySelector('[aria-label="Definition"]');
      if (def) {
        const r = def.getBoundingClientRect();
        if (r.bottom > top && r.top < window.innerHeight) return false;
      }
      const card = document.getElementById('free-pdf');
      if (card) {
        const r = card.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) return false;
      }
      return true;
    };

    const evaluate = () => {
      frame = 0;
      if (!armedRef.current && scrolledHalf()) arm();
      setFits(fitsNow());
    };

    const queue = () => {
      if (!frame) frame = window.requestAnimationFrame(evaluate);
    };

    const onMq = (e) => {
      isPhone = e.matches;
      setPhone(isPhone);
      queue();
    };

    if (secondPage) armTimer = window.setTimeout(arm, 1500);
    window.addEventListener('scroll', queue, {passive: true});
    window.addEventListener('resize', queue);
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else mq.addListener(onMq);
    queue();

    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      if (mq.removeEventListener) mq.removeEventListener('change', onMq);
      else mq.removeListener(onMq);
      window.clearTimeout(armTimer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [slug]);

  const close = useCallback(() => {
    hideForDays();
    setClosed(true);
  }, []);

  const visible = armed && fits && !closed;

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, close]);

  const goToCard = () => {
    const card = document.getElementById('free-pdf');
    if (card) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      card.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'center'});
    }
    close();
  };

  if (!visible) return null;

  return (
    <div className={styles.popup} role="dialog" aria-label={`Free ${PDF_TITLE}`}>
      <button type="button" className={styles.close} onClick={close} aria-label="Close">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </button>
      {phone ? (
        <div className={styles.popupPhone}>
          <MiniCover />
          <p className={styles.popupPhoneTitle}>Free {PDF_TITLE}</p>
          <button type="button" className={styles.btnSmall} onClick={goToCard}>
            Get it free
          </button>
        </div>
      ) : (
        <>
          <BookArt scale={0.6} />
          <div className={styles.popupBody}>
            <p className={styles.kicker}>Free {PDF_TITLE}</p>
            <p className={styles.popupTitle}>Keep the key finance terms in your pocket</p>
            <SignupForm idPrefix="pop" onDone={() => hideForDays()} />
          </div>
        </>
      )}
    </div>
  );
}
