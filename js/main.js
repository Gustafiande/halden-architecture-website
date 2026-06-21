/* =============================================================
   HALDEN — scroll & entrance animations (GSAP + ScrollTrigger)
   Ported from the Claude Design prototype.
   ============================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     Mobile navigation (hamburger menu). Runs unconditionally —
     independent of GSAP and reduced-motion preferences.
     ----------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    var root = document.documentElement;

    function open() {
      root.classList.add('is-nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      root.classList.remove('is-nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (root.classList.contains('is-nav-open')) close();
      else open();
    });

    // Any in-menu link (and the brand) closes the overlay before jumping.
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    var brand = document.querySelector('.nav__brand');
    if (brand) brand.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // Close if the viewport grows past the mobile breakpoint.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) close();
    });
  }

  function init() {
    var g = window.gsap;
    var ST = window.ScrollTrigger;
    if (!g || !ST) return;

    g.registerPlugin(ST);

    var prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var d = document;

    // Reduced motion: skip entrance/parallax, leave everything in its
    // final state so the page is fully legible without animation.
    if (prefersReduced) return;

    // Hero: stacked lines wipe up from their clipping mask.
    var lines = d.querySelectorAll('[data-hero-line]');
    if (lines.length) {
      g.set(lines, { yPercent: 112 });
      g.to(lines, {
        yPercent: 0,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.1,
        delay: 0.12,
      });
    }

    // Hero background drifts down slightly as the section scrolls past.
    var heroImg = d.querySelector('[data-hero-img]');
    if (heroImg) {
      g.to(heroImg, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: '#halden-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Single-element reveals.
    d.querySelectorAll('[data-reveal]').forEach(function (el) {
      g.from(el, {
        y: 52,
        opacity: 0,
        duration: 1.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    // Grouped reveals — children stagger in.
    d.querySelectorAll('[data-reveal-group]').forEach(function (grp) {
      g.from(Array.prototype.slice.call(grp.children), {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: grp, start: 'top 86%' },
      });
    });

    // Image parallax — inner layer translates within its overflow frame.
    d.querySelectorAll('[data-parallax]').forEach(function (el) {
      var sp = parseFloat(el.getAttribute('data-parallax')) || 14;
      var trig = el.closest('[data-parallax-trigger]') || el;
      g.to(el, {
        yPercent: -sp,
        ease: 'none',
        scrollTrigger: {
          trigger: trig,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Recalculate positions once fonts/images settle.
    var refresh = function () { ST.refresh(); };
    window.addEventListener('load', refresh);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(refresh);
    setTimeout(refresh, 700);
  }

  function boot() {
    initNav();
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
