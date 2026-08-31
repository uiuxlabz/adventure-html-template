/* ============================================================
   ADVENTURE — main.js
   Vanilla JS, canonical IIFE. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sticky header ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('site-header--scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Hero slideshow ---------- */
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    var current = 0;
    var timer = null;
    var go = function (i) {
      slides[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
    };
    var advance = function () {
      go(current + 1);
    };
    var start = function () { timer = setInterval(advance, 5000); };
    var stop = function () { clearInterval(timer); timer = null; };
    start();
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      hero.addEventListener('touchstart', stop, { passive: true });
      hero.addEventListener('touchend', start, { passive: true });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('reveal-in'); });
  }

  /* ---------- Stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var runCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (String(target).split('.')[1] || '').length;
      var dur = 1600, startTime = null;
      var step = function (ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / dur, 1);
        var val = target * ease(p);
        el.textContent = val.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Trip detail thumbnail switcher ---------- */
  var tdMain = document.querySelector('.td-main img');
  var tdThumbs = document.querySelectorAll('.td-thumb');
  if (tdMain && tdThumbs.length) {
    var setThumb = function (thumb) {
      tdMain.src = thumb.getAttribute('data-src') || thumb.src;
      tdMain.alt = thumb.getAttribute('data-alt') || thumb.alt;
      tdThumbs.forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    };
    tdThumbs.forEach(function (t) {
      t.addEventListener('click', function () { setThumb(t); });
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.querySelector('[data-form]');
  if (form) {
    var status = form.querySelector('.form-status');
    var setStatus = function (msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form-status' + (ok ? ' ok' : ' err');
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('input, textarea').forEach(function (field) {
        var bad = false;
        if (field.hasAttribute('required') && !field.value.trim()) bad = true;
        if (!bad && field.type === 'email' && field.value.trim()) {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        field.classList.toggle('invalid', bad);
        if (bad) valid = false;
      });
      if (!valid) {
        setStatus('Please fill in the required fields.', false);
        return;
      }
      setStatus('Thanks! Your message is logged. We will get back to you within one business day.', true);
      form.reset();
    });
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () { field.classList.remove('invalid'); });
    });
  }

  /* ---------- Auto year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
