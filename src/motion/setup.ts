// Global motion for Huli Huli. The verb is "turn over": cards, labels and the page itself turn.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setTransition, setLoaderExit, setLoaderFormat, onPage, onScroll, ease, isTouch, isMobile, prefersReducedMotion, stopScroll, startScroll, scrollToTarget } from '../engine';
import { site } from '../data/site';

gsap.registerPlugin(ScrollTrigger);

const idle = { t: 0, x: 0, y: 0 };

// Back and forward restore a page the visitor has seen: no intro replay there.
let returning = false;
document.addEventListener('astro:before-preparation', (e: any) => { returning = e.navigationType === 'traverse'; });

function startIdle() {
  if (prefersReducedMotion()) return;
  const touch = isTouch();
  const aim = { x: 0, y: 0 };
  if (touch) onScroll(({ velocity }) => { aim.x = gsap.utils.clamp(-0.5, 0.5, velocity / 50); });
  else addEventListener('pointermove', (e) => { aim.x = e.clientX / innerWidth - 0.5; aim.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  gsap.ticker.add((t) => {
    const r = gsap.ticker.deltaRatio();
    if (touch) aim.x *= Math.pow(0.92, r);
    const k = 1 - Math.pow(0.95, r);
    idle.t = t; idle.x += (aim.x - idle.x) * k; idle.y += (aim.y - idle.y) * k;
  });
}

// Page transition: a sunset sign turns in over the page, then turns away from the new one.
function turnTransition() {
  setTransition({
    leave: (c) => {
      const p = c.querySelector<HTMLElement>('.curtain__panel')!;
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .fromTo(p, { rotateY: -92, transformOrigin: '0% 50%' }, { rotateY: 0, duration: 0.75, ease: ease.inOut });
    },
    enter: (c) => {
      const p = c.querySelector<HTMLElement>('.curtain__panel')!;
      return gsap.timeline()
        .set(p, { transformOrigin: '100% 50%' })
        .to(p, { rotateY: 92, duration: 0.8, ease: ease.inOut })
        .set(c, { autoAlpha: 0 })
        .set(p, { rotateY: 0 });
    },
  });
}

// Header steps aside on scroll down, returns on scroll up.
function frameAway() {
  let last = 0;
  onScroll(({ y }) => {
    if (Math.abs(y - last) < 6) return;
    const menuOpen = document.documentElement.classList.contains('menu-open');
    document.documentElement.classList.toggle('frame-away', !menuOpen && y > 200 && y > last);
    last = y;
  });
}

// Mobile menu overlay: focus trap, Escape, restore focus.
function menu() {
  onPage(() => {
    const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
    const panel = document.querySelector<HTMLElement>('[data-menu]');
    if (!btn || !panel) return;
    const links = () => [...panel.querySelectorAll<HTMLAnchorElement>('a')];
    const open = () => {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('menu-open');
      stopScroll();
      if (!prefersReducedMotion()) gsap.from(panel.querySelectorAll('li'), { yPercent: 60, rotateX: -70, autoAlpha: 0, transformOrigin: '50% 0%', stagger: 0.05, duration: 0.7, ease: ease.out });
      links()[0]?.focus();
    };
    const close = (restore = true) => {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-open');
      startScroll();
      if (restore) btn.focus();
    };
    const toggle = () => (panel.hidden ? open() : close());
    const key = (e: KeyboardEvent) => {
      if (panel.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = [btn, ...links()];
        const i = f.indexOf(document.activeElement as HTMLAnchorElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    const linkClick = () => close(false);
    btn.addEventListener('click', toggle);
    document.addEventListener('keydown', key);
    links().forEach((a) => a.addEventListener('click', linkClick));
    return () => {
      btn.removeEventListener('click', toggle);
      document.removeEventListener('keydown', key);
      document.documentElement.classList.remove('menu-open');
    };
  });
}

// Hero: a poster. The Octoskull rises out of the marquee as you scroll and sways at rest,
// and the $45 sticker gets slapped on after the intro.
function heroPoster() {
  onPage(({ intro }) => {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (!hero || prefersReducedMotion()) return;
    const mug = hero.querySelector<HTMLElement>('[data-hero-mug]')!;
    const word = hero.querySelector<HTMLElement>('[data-hero-word]')!;
    const sticker = hero.querySelector<HTMLElement>('.sticker');
    const labels = hero.querySelectorAll<HTMLElement>('.hero__label');
    const html = document.documentElement;
    const skipIntro = returning || html.classList.contains('loader-bail');

    if (!skipIntro) {
    // The captions wait until the title has landed, so it never runs over them.
    intro.add(gsap.from(labels, { autoAlpha: 0, y: 12, duration: 0.6, ease: ease.soft, stagger: 0.06 }), 0.75);
    intro.add(gsap.from(word, { yPercent: 28, duration: 1.1, ease: ease.out }), 0);
    // The mug waits for the title, then rises up from behind the band.
    intro.add(gsap.from(mug, { y: () => innerHeight * 0.75, duration: 1.3, ease: 'back.out(1.2)' }), 0.7);
    if (sticker) intro.add(gsap.timeline()
      .from(sticker, { scale: 1.8, autoAlpha: 0, y: -30, duration: 0.3, ease: 'power3.in' })
      .to(sticker, { scale: 0.9, duration: 0.08, ease: 'power1.out' })
      .to(sticker, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' }), 1.8);
    }

    const scroll = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } })
      // The scroll uses other properties than the intro (yPercent here, y there) and fixed start
      // values, so scrolling during the intro can never record a half-risen mug as "the top".
      .fromTo(mug, { yPercent: 0, scale: 1 }, { yPercent: -16, scale: 1.06, ease: 'none', immediateRender: false }, 0)
      .fromTo(word, { y: 0 }, { y: () => word.getBoundingClientRect().height * 0.22, ease: 'none', immediateRender: false }, 0);

    const rot = gsap.quickSetter(mug, 'rotation', 'deg');
    let live = true;
    const io = new IntersectionObserver(([e]) => { live = e.isIntersecting; });
    io.observe(hero);
    const tick = () => {
      if (!live) return;
      const t = idle.t;
      rot(Math.sin(t * 0.8) * 1.2 + idle.x * 2);
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); io.disconnect(); scroll.scrollTrigger?.kill(); scroll.kill(); };
  });
}

// The $45 sticker turns over like a coin.
function stickerTurn() {
  onPage(() => {
    const sticker = document.querySelector<HTMLElement>('.sticker');
    if (sticker && !prefersReducedMotion()) {
      // It turns over like a coin. The link box itself never turns, so the pointer
      // cannot slip off it mid-turn and start a flicker.
      const inner = sticker.querySelector<HTMLElement>('.sticker__in')!;
      const turn = (back: boolean) => gsap.to(inner, { rotationY: back ? 180 : 0, duration: 0.8, ease: 'back.out(1.5)', overwrite: true });
      if (isTouch()) {
        // No hover on touch: it turns over by itself now and then.
        let back = false;
        const loop = gsap.delayedCall(4, () => { back = !back; turn(back); loop.restart(true); });
        return () => loop.kill();
      }
      const on = () => turn(true), off = () => turn(false);
      sticker.addEventListener('pointerenter', on);
      sticker.addEventListener('pointerleave', off);
      sticker.addEventListener('focus', on);
      sticker.addEventListener('blur', off);
      return () => {
        sticker.removeEventListener('pointerenter', on);
        sticker.removeEventListener('pointerleave', off);
        sticker.removeEventListener('focus', on);
        sticker.removeEventListener('blur', off);
      };
    }
  });
}

// Idle: hanging signs sway with the pointer and a slow clock.
function sway() {
  onPage(() => {
    if (prefersReducedMotion()) return;
    const els = [...document.querySelectorAll<HTMLElement>('[data-sway]')];
    if (!els.length) return;
    const setters = els.map((el) => ({
      ry: gsap.quickSetter(el, 'rotationY', 'deg'),
      rz: gsap.quickSetter(el, 'rotation', 'deg'),
      el,
    }));
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement))));
    els.forEach((el) => io.observe(el));
    const tick = () => {
      setters.forEach((s, i) => {
        if (!visible.has(s.el)) return;
        s.ry(Math.sin(idle.t * 0.6 + i) * 2.5 + idle.x * 14);
        s.rz(Math.sin(idle.t * 0.45 + i * 2) * 0.8 + idle.x * 1.5);
      });
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); io.disconnect(); };
  });
}

// Photo frames turn a few degrees toward the pointer.
function tilt() {
  onPage(() => {
    if (isTouch() || prefersReducedMotion()) return;
    const off: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>('.tilt').forEach((el) => {
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: ease.soft });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: ease.soft });
      gsap.set(el, { transformPerspective: 1200 });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 9);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
      };
      const leave = () => { ry(0); rx(0); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      off.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
    });
    return () => off.forEach((f) => f());
  });
}

// The signature: the lineup turns over one glass at a time as the stage scrolls.
function lineup() {
  onPage(() => {
    const section = document.querySelector<HTMLElement>('[data-lineup]');
    if (!section) return;
    const cards = [...section.querySelectorAll<HTMLButtonElement>('[data-turn]')];
    const manual = cards.map(() => false);
    const driven = !prefersReducedMotion() && !isMobile() && !isTouch();
    const scrollAngle = cards.map(() => 0);
    const last = cards.map(() => 0);
    // Under the pointer (or keyboard focus) a card starts to turn, so its back peeks out.
    const peek = cards.map(() => false);
    const render = () => cards.forEach((c, i) => {
      const flat = scrollAngle[i] + (manual[i] ? 180 : 0);
      const a = flat + (peek[i] ? (Math.round(flat / 180) % 2 ? -32 : 32) : 0);
      if (driven && a !== last[i]) { last[i] = a; gsap.to(c, { rotationY: a, duration: 0.6, ease: 'back.out(1.4)', overwrite: true }); }
      const showsBack = Math.round(flat / 180) % 2 === 1;
      c.setAttribute('aria-pressed', String(showsBack));
    });
    const clicks = cards.map((c, i) => {
      const fn = () => { manual[i] = !manual[i]; peek[i] = false; render(); };
      const on = () => { peek[i] = true; render(); };
      const off = () => { peek[i] = false; render(); };
      c.addEventListener('click', fn);
      if (driven) { c.addEventListener('pointerenter', on); c.addEventListener('pointerleave', off); c.addEventListener('focus', on); c.addEventListener('blur', off); }
      return () => { c.removeEventListener('click', fn); c.removeEventListener('pointerenter', on); c.removeEventListener('pointerleave', off); c.removeEventListener('focus', on); c.removeEventListener('blur', off); };
    });
    let st: ScrollTrigger | undefined;
    if (driven) {
      section.classList.add('lineup--driven');
      st = ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress * cards.length * 1.05;
          cards.forEach((_, i) => {
            const local = gsap.utils.clamp(0, 1, (p - i * 0.92) / 0.9);
            scrollAngle[i] = Math.round(local * 180);
          });
          render();
        },
      });
    }
    render();
    return () => { clicks.forEach((f) => f()); st?.kill(); section.classList.remove('lineup--driven'); };
  });
}

// Menu page: each section's art turns in like a card as it arrives, the cocktail art and then the food art.
function menuArt() {
  onPage(() => {
    if (prefersReducedMotion()) return;
    const arts = [...document.querySelectorAll<HTMLElement>('.msec__art')];
    const tweens = arts.map((art) => gsap.fromTo(art, { rotationY: -80, transformPerspective: 1100, transformOrigin: '0% 50%' }, {
      rotationY: 0, duration: 1.1, ease: 'back.out(1.2)',
      scrollTrigger: { trigger: art, start: 'top 85%', once: true },
    }));
    return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  });
}

// Order list: a dish photo follows the pointer.
function preview() {
  onPage(() => {
    const list = document.querySelector('[data-index]');
    const box = document.querySelector<HTMLElement>('.preview');
    if (!list || !box || isTouch()) return;
    const imgs = [...box.querySelectorAll<HTMLImageElement>('[data-preview-img]')];
    const x = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' });
    const rot = gsap.quickTo(box, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    let lastX = 0, px = 0, py = 0;
    gsap.set(box, { transformPerspective: 900 });
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; x((list as HTMLElement).getBoundingClientRect().left - box.offsetWidth * 0.5 - 90); y(py); rot(gsap.utils.clamp(-25, 25, (px - lastX) * 1.2)); lastX = px; };
    const show = (e: Event) => {
      const key = (e.currentTarget as HTMLElement).dataset.preview;
      imgs.forEach((i) => i.classList.toggle('is-on', i.dataset.previewImg === key));
      if (e.type === 'focus') { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); x(r.left - box.offsetWidth * 0.5 - 90); y(r.top + r.height / 2); }
      gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.out });
    };
    const hide = () => gsap.to(box, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: ease.out });
    const anchors = [...list.querySelectorAll<HTMLAnchorElement>('a[data-preview]')];
    anchors.forEach((a) => { a.addEventListener('pointerenter', show); a.addEventListener('focus', show); a.addEventListener('blur', hide); });
    list.addEventListener('pointerleave', hide);
    addEventListener('pointermove', move);
    const off = onScroll(() => { if (!list.contains(document.elementFromPoint(px, py))) hide(); });
    return () => { removeEventListener('pointermove', move); off(); hide(); };
  });
}

// Gallery strip drifts at rest and speeds up with scroll.
function marquee() {
  onPage(() => {
    const tracks = [...document.querySelectorAll<HTMLElement>('[data-marquee] [data-track]')];
    if (!tracks.length || prefersReducedMotion()) return;
    // The hero band ships one copy of its text; the seamless loop needs a second.
    tracks.forEach((track) => {
      if (track.children.length === 1) {
        const copy = track.firstElementChild!.cloneNode(true) as HTMLElement;
        copy.setAttribute('aria-hidden', 'true');
        track.append(copy);
      }
    });
    // While it moves on its own it is not a scroll box, so it leaves the tab order.
    tracks.forEach((track) => track.closest('[data-marquee]')?.removeAttribute('tabindex'));
    const loops = tracks.map((track) => gsap.to(track, { xPercent: -50, ease: 'none', duration: track.closest('[data-hero]') ? 32 : 60, repeat: -1, paused: true }));
    // Each loop runs only while its band is on screen; that keeps the phone's frames for the scroll.
    const on = loops.map(() => false);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const i = tracks.indexOf(e.target as HTMLElement);
      on[i] = e.isIntersecting;
      e.isIntersecting ? loops[i].play() : loops[i].pause();
    }));
    tracks.forEach((t) => io.observe(t));
    let lastV = 0;
    const off = onScroll(({ velocity }) => {
      if (Math.abs(velocity - lastV) < 0.5) return; // skip a new tween for every tiny change
      lastV = velocity;
      const dir = velocity < 0 ? -1 : 1;
      loops.forEach((loop, i) => { if (on[i]) gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(velocity) / 6, 6)), duration: 0.4, overwrite: true }); });
    });
    return () => { off(); io.disconnect(); loops.forEach((l) => l.kill()); };
  });
}

// Forms: no endpoint yet, so requests open a pre-filled email (placeholder address in site.ts).
function forms() {
  onPage(() => {
    const form = document.querySelector<HTMLFormElement>('[data-book-form]');
    const news = document.querySelector<HTMLFormElement>('[data-news-form]');
    const off: (() => void)[] = [];
    const bookLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-book]')];
    bookLinks.forEach((a) => {
      const fn = () => {
        const r = form?.querySelector<HTMLInputElement>(`input[name="type"][value="${a.dataset.book}"]`);
        if (r) r.checked = true;
      };
      a.addEventListener('click', fn);
      off.push(() => a.removeEventListener('click', fn));
    });
    if (form) {
      const status = form.querySelector<HTMLElement>('[data-form-status]')!;
      const submit = (e: SubmitEvent) => {
        e.preventDefault();
        let bad: HTMLInputElement | null = null;
        form.querySelectorAll<HTMLInputElement>('input[required]').forEach((i) => {
          const wrap = i.closest('.field');
          const ok = i.checkValidity();
          wrap?.toggleAttribute('data-invalid', !ok);
          if (!ok && !bad) bad = i;
        });
        if (bad) { status.textContent = 'Fill in the marked fields and send again.'; (bad as HTMLInputElement).focus(); return; }
        const d = new FormData(form);
        const kind = { table: 'Table request', party: 'Private party', catering: 'Catering request' }[String(d.get('type'))] ?? 'Request';
        const body = `Name: ${d.get('name')}\nEmail: ${d.get('email')}\nDate: ${d.get('date')}\nTime: ${d.get('time')}\nGuests: ${d.get('guests')}\n\n${d.get('notes') || ''}`;
        location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${kind} for ${d.get('guests')}`)}&body=${encodeURIComponent(body)}`;
        status.textContent = 'Your email app is opening with the request filled in. Press send there.';
      };
      form.addEventListener('submit', submit);
      off.push(() => form.removeEventListener('submit', submit));
    }
    if (news) {
      const status = news.querySelector<HTMLElement>('[data-news-status]')!;
      const submit = (e: SubmitEvent) => {
        e.preventDefault();
        const input = news.querySelector<HTMLInputElement>('input[type="email"]')!;
        if (!input.checkValidity()) { status.textContent = 'That email address looks incomplete.'; input.focus(); return; }
        status.textContent = 'Thanks. Watch your inbox for the next menu drop.';
        input.value = '';
      };
      news.addEventListener('submit', submit);
      off.push(() => news.removeEventListener('submit', submit));
    }
    return () => off.forEach((f) => f());
  });
}

// Today's hours, in Powell's time zone.
function openNow() {
  onPage(() => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = order[now.getDay()];
    const key = ['Tue', 'Wed', 'Thu'].includes(day) ? 'Tue to Thu' : day;
    const h = site.hours.find((x) => x.short === key);
    document.querySelectorAll(`.hours tr[data-day="${key}"]`).forEach((tr) => tr.classList.add('is-today'));
    const el = document.querySelector('[data-open-now]');
    if (!el || !h) return;
    const t = now.getHours() + now.getMinutes() / 60;
    if (!h.open) el.textContent = 'Closed today, back Tuesday at 4:30 pm';
    else if (t >= h.open[0] && t < h.open[1]) el.textContent = `Open now, until ${h.time.split(' to ')[1]}`;
    else if (t < h.open[0]) el.textContent = `Opens today at ${h.time.split(' to ')[0]}${h.open[0] < 12 ? ' am' : ' pm'}`;
    else el.textContent = 'Closed for tonight';
  });
}

// Same-page hash links scroll smoothly through Lenis.
function hashLinks() {
  onPage(() => {
    const fn = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      e.preventDefault();
      history.replaceState(null, '', url.hash);
      scrollToTarget(target);
    };
    document.addEventListener('click', fn, true);
    return () => document.removeEventListener('click', fn, true);
  });
}


// Loader: the screen is the sun band. A pineapple turns ("huli" means turn) while the page loads,
// then the sun slides down and lands on the hero band, so the loader's last frame is the hero's band.
function sunLoader() {
  const root = document.getElementById('loader');
  if (!root) return;
  // Too late: the CSS fallback has started fading it, so the hero shows as it stands.
  if (performance.now() > 2200) { document.documentElement.classList.add('loader-bail'); return; }
  root.style.animation = 'none'; // in time: the scripted exit takes over from the CSS fallback
  if (prefersReducedMotion() || getComputedStyle(root).display === 'none') return;
  const pine = root.querySelector<SVGElement>('[data-loader-pine]');
  // The pineapple fills up like a glass as the page really loads, with a slight sway.
  const level = root.querySelector<SVGRectElement>('[data-pine-level]');
  setLoaderFormat((p) => {
    level?.setAttribute('y', String(54 - (p / 100) * 44));
    return String(Math.round(p)).padStart(3, '0');
  });
  const spin = gsap.fromTo(pine, { rotation: -4 }, { rotation: 4, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 90%' });
  setLoaderExit((el, handoff) => {
    const sun = el.querySelector<HTMLElement>('[data-loader-sun]')!;
    const band = document.querySelector<HTMLElement>('.hero__band');
    const land = band ? band.getBoundingClientRect().top + 4 : innerHeight + 8;
    return gsap.timeline({ onComplete: () => { spin.kill(); } })
      .to(el.querySelectorAll('[data-loader-out]'), { autoAlpha: 0, y: 14, duration: 0.3, ease: 'power2.in', stagger: 0.04 }, 0)
      .to(pine, { scale: 0.4, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0.05)
      .to(sun, { y: land, duration: 0.7, ease: ease.inOut }, 0.15)
      .add(handoff, 0.35)
      .to(sun, { autoAlpha: 0, duration: 0.2, ease: 'none' }, 0.85);
  });
}

export function setupMotion() {
  sunLoader();
  startIdle();
  turnTransition();
  frameAway();
  menu();
  heroPoster();
  stickerTurn();
  sway();
  tilt();
  lineup();
  menuArt();
  preview();
  marquee();
  forms();
  openNow();
  hashLinks();
}
