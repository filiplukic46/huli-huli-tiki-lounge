// Declarative motion through data attributes. Authoring happens in markup:
//   data-split="lines|words|chars"   masked text reveal (SplitText), on scroll or on intro
//   data-reveal="up|fade|clip|scale"  block reveal
//   data-intro                        play with the page intro instead of on scroll
//   data-delay="0.2"                  extra delay (seconds)
//   data-parallax="0.15"              scrubbed vertical drift (fraction of element height)
// Every effect is skipped under reduced motion; CSS keeps content visible without JS.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ease, prefersReducedMotion } from './env';

gsap.registerPlugin(ScrollTrigger, SplitText);

const durations = { lines: 1.2, words: 1.1, chars: 0.9 } as const;
const staggers = { lines: 0.08, words: 0.035, chars: 0.018 } as const;

// autoSplit re-splits after font load / resize. A text that already revealed must stay revealed,
// so the state lives outside onSplit.
function splitTween(el: HTMLElement, isIntro: boolean) {
  const type = (el.dataset.split || 'lines') as keyof typeof durations;
  const delay = parseFloat(el.dataset.delay || '0');
  const s = { tween: undefined as gsap.core.Tween | undefined, done: false, requested: false };
  SplitText.create(el, {
    type: type === 'lines' ? 'lines' : `lines,${type}`,
    mask: 'lines',
    autoSplit: true,
    linesClass: 'split-line',
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      if (s.done) return;
      const targets = type === 'lines' ? self.lines : type === 'words' ? self.words : self.chars;
      s.tween = gsap.from(targets, {
        yPercent: 110,
        rotate: type === 'chars' ? 0 : 2,
        duration: durations[type],
        stagger: staggers[type],
        ease: ease.out,
        delay,
        paused: isIntro && !s.requested,
        onComplete: () => { s.done = true; },
        scrollTrigger: isIntro ? undefined : { trigger: el, start: 'top 88%', once: true },
      });
      return s.tween;
    },
  });
  return () => { s.requested = true; s.tween?.play(); };
}

function blockTween(el: HTMLElement, paused: boolean) {
  const kind = el.dataset.reveal || 'up';
  const delay = parseFloat(el.dataset.delay || '0');
  // Clip insets in px with room past the edges, so the frame's offset shadow
  // wipes in with the photo instead of popping in after it.
  const pad = 40;
  const w = el.offsetWidth, h = el.offsetHeight;
  const from: gsap.TweenVars =
    kind === 'fade' ? { autoAlpha: 0 }
    : kind === 'clip' ? { clipPath: `inset(${h}px ${-pad}px ${-pad}px ${-pad}px)`, autoAlpha: 1 }
    : kind === 'scale' ? { scale: 1.15, clipPath: `inset(${h * 0.12}px ${w * 0.12}px ${h * 0.12}px ${w * 0.12}px)`, autoAlpha: 1 }
    : { y: 48, autoAlpha: 0 };
  const to: gsap.TweenVars = kind === 'clip' || kind === 'scale' ? { clipPath: `inset(${-pad}px ${-pad}px ${-pad}px ${-pad}px)`, scale: 1 } : {};
  gsap.set(el, { visibility: 'visible' });
  return gsap.fromTo(el, from, {
    ...to,
    y: 0,
    autoAlpha: 1,
    duration: kind === 'fade' ? 1 : 1.3,
    ease: ease.out,
    delay,
    paused,
    // a finished clip would keep clipping the frame's offset shadow
    ...(kind === 'clip' || kind === 'scale' ? { clearProps: 'clipPath' } : {}),
    scrollTrigger: paused ? undefined : { trigger: el, start: 'top 90%', once: true },
  });
}

/** Wire every reveal inside `root`. Returns the intro timeline (paused) for the page entrance,
 *  and `stop` to disconnect the lazy setup. Reveals below the fold are prepared only when they
 *  come near the viewport: splitting and measuring everything at once blocked slow phones for
 *  seconds. `add` runs a setup inside the page's gsap context, so it is reverted on navigation. */
export function initReveals(root: ParentNode = document, add: (fn: () => void) => void = (fn) => fn()) {
  const intro = gsap.timeline({ paused: true });
  if (prefersReducedMotion()) return { intro, stop: () => {} };

  const later = new Map<Element, () => void>();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const setup = later.get(e.target);
    later.delete(e.target);
    io.unobserve(e.target);
    if (setup) add(setup);
  }), { rootMargin: '0px 0px 35% 0px' });

  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (el.hasAttribute('data-intro')) intro.add(splitTween(el, true), 0);
    else { later.set(el, () => { splitTween(el, false); }); io.observe(el); }
  });
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.hasAttribute('data-intro')) { const t = blockTween(el, true); intro.add(() => t.play(), 0); }
    else { later.set(el, () => { blockTween(el, false); }); io.observe(el); }
  });
  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || '0.15');
    gsap.fromTo(el, { yPercent: -amount * 100 }, {
      yPercent: amount * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  return { intro, stop: () => { io.disconnect(); later.clear(); } };
}
