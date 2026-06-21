/* =============================================================
   HALDEN — scroll & entrance animations (GSAP + ScrollTrigger)
   Ported from the Claude Design prototype.
   ============================================================= */
(function () {
  'use strict';

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
