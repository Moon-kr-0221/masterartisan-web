---
name: project-motion
description: Motion system for this project (masterartisan-web) — scroll-driven animation used on the main (/) and history (/history) pages. Use when adding or editing scroll animations, GSAP ScrollTrigger, Lenis smooth scroll, framer-motion reveals, or the dark-green 3D dial intro. Captures the non-obvious recipes: Lenis↔ScrollTrigger sync, the house easing/reveal patterns, the CSS-3D perspective scrub, and Playwright transform-matrix verification.
---

# Project Motion System

Reference implementations:
- `components/history/Intro3DDial.tsx` — the 3D scroll intro (dark-green, line drop, tilted dial stands up).
- `app/history/page.tsx` — Lenis setup, ScrollTrigger era tracking, dial rotation, reveals.

## House tokens

- **Easing**: `const EASE_OUT = [0.16, 1, 0.3, 1]` for framer-motion; `'none'` for scrub tweens (keep them scroll-faithful).
- **Reveal — BlurReveal**: `initial {opacity:0, y:22, filter:'blur(8px)'}` → `whileInView {opacity:1, y:0, filter:'blur(0px)'}`, `viewport {once:true, margin:'-80px'}`, `duration 1.1`. For headlines.
- **Reveal — FadeUp**: `opacity:0, y:18` → `0`, `duration 0.75`, stagger via `delay`. For list rows.
- Palette: ivory `#F8F5F0`, ink `#1A1714`, gold `#C4A882`, hairline `#E2DDD6`, intro green `#16261C`, cream `#F5F0E8`.

## Lenis ↔ GSAP ScrollTrigger (required for any scroll work)

```ts
const lenis = new Lenis({ duration: 1.35, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.9 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
// cleanup: lenis.destroy()
```
Without this, ScrollTrigger reads stale scroll positions and pins jitter. Tab/dot jumps use `lenis.scrollTo(el, { offset: -120, duration: 1.8 })`.

## 3D scroll-intro pattern (perspective + rotateX scrub)

Structure: `section(trigger) > pinWrap(h-screen) > perspective-div > dial(preserve-3d)`.

- Parent gets `perspective: 1100px`; dial gets `transformStyle: 'preserve-3d'`.
- GSAP property names are `rotationX` / `rotationZ` (NOT rotateX). GSAP writes the SVG/DOM `transform` so it composes with parent perspective → real `matrix3d`.
- Entrance (on load) sets the tilted rest state: `gsap.set(dial, { rotationX: 72, rotationZ: 90, autoAlpha: 0 })`, then fade in.
- Scrub timeline pins and stands it up:

```ts
const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=3200', scrub: 1, pin: pinWrap, anticipatePin: 1 } });
tl.to(dial, { rotationX: 0, rotationZ: 0, duration: 4, ease: 'none' }, 0)   // flatten + align
  .to([line, hint], { autoAlpha: 0, duration: 1, ease: 'none' }, 0.4)
  .to(centerCopy, { autoAlpha: 1, y: 0, duration: 1.5, ease: 'none' }, 4.2) // copy after flat
  // HOLD gap (no tween) = readable beat
  .to(pinWrap, { autoAlpha: 0, duration: 1.6, ease: 'none' }, 7.8)          // Phase 3 retire
  .to(section, { backgroundColor: '#F8F5F0', duration: 1.6, ease: 'none' }, 7.6);
```

Gotchas:
- **Radial labels stay upright** by counter-rotating: marker `transform: translate(-50%,-50%) rotate(${a}deg) translateY(-${R}px)`, then inner text `transform: rotate(${-a}deg)`. Net text rotation = the dial's `rotationZ` only, so it spins during scrub and reads upright at 0.
- Place era `i` at angle `-90 + (i/N)*360` so index 0 lands at 12 o'clock; rotate `rotationZ` from an offset → 0 (positive→0 = counter-clockwise in CSS) to "settle" it at top.
- SVG `overflow: hidden` to clip labels; leave a HOLD gap in the timeline so the center copy is readable before Phase 3.
- The global `Navigation` is `fixed` + ivory on non-home routes — it overlays a dark hero. Keep critical content (dial) at viewport center, clear of the 72px nav.

## Verify (don't trust the code — observe the matrix)

Playwright is not a dependency; install transiently only to verify, then leave it out of commits.

```js
// read the dial transform at several scroll offsets
const dial = document.querySelector('div[style*="preserve-3d"]'); // or 'svg g'
getComputedStyle(dial).transform; // expect matrix3d(... cos72=0.309, sin72=0.951 ...) at load; matrix(1,0,0,1,0,0) when flat
```
Scroll via `window.scrollTo(0, y)` + `waitForTimeout`, screenshot each phase, and confirm: tilted ellipse at load → flat circle with index-0 at top → center copy opacity 0→1 → dial fades, bg → ivory.