/* =========================================================================
   SPOCART — site behaviour
   Vanilla JS, no dependencies. Progressive enhancement only:
   every page remains usable with JS disabled.
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('primary-menu');
    var backdrop = document.querySelector('.nav__backdrop');
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      if (backdrop) backdrop.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------------
     Sticky header shadow + back-to-top visibility
     --------------------------------------------------------------------- */
  function initScrollState() {
    var header = document.querySelector('.header');
    var toTop = document.querySelector('.q-top');
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-stuck', y > 8);
      if (toTop) toTop.classList.toggle('is-visible', y > 640);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update();
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el, i) {
      // Stagger siblings inside the same grid/row
      if (!el.style.getPropertyValue('--d')) {
        var group = el.parentElement;
        var idx = group ? Array.prototype.indexOf.call(group.children, el) : i;
        el.style.setProperty('--d', Math.min(idx, 6) * 70 + 'ms');
      }
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     Animated counters (only runs on elements with data-count)
     --------------------------------------------------------------------- */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        var target = parseFloat(el.getAttribute('data-count'));
        if (isNaN(target)) return;
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';

        if (reduceMotion) { el.textContent = prefix + target + suffix; return; }

        var start = performance.now();
        var dur = 1400;
        (function step(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.4 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Accordion (FAQ)
     --------------------------------------------------------------------- */
  function initAccordion() {
    document.querySelectorAll('.acc').forEach(function (acc) {
      var single = acc.hasAttribute('data-single');
      acc.querySelectorAll('.acc__btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var panel = document.getElementById(btn.getAttribute('aria-controls'));
          var open = btn.getAttribute('aria-expanded') === 'true';

          if (single && !open) {
            acc.querySelectorAll('.acc__btn[aria-expanded="true"]').forEach(function (other) {
              other.setAttribute('aria-expanded', 'false');
              var op = document.getElementById(other.getAttribute('aria-controls'));
              if (op) op.classList.remove('is-open');
            });
          }

          btn.setAttribute('aria-expanded', String(!open));
          if (panel) panel.classList.toggle('is-open', !open);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Enquiry forms
     Client-side validation + friendly confirmation.
     NOTE: no backend is wired up. Point `action` at your form handler
     (Formspree / Netlify Forms / your CRM endpoint) before launch.
     --------------------------------------------------------------------- */
  function initForms() {
    document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
      var status = form.querySelector('.form-status');

      function errorSlot(field) {
        var slot = field.parentElement.querySelector('.field-error');
        if (!slot) {
          slot = document.createElement('span');
          slot.className = 'field-error';
          field.parentElement.appendChild(slot);
        }
        return slot;
      }

      function validate(field) {
        var slot = errorSlot(field);
        var msg = '';
        var val = (field.value || '').trim();

        if (field.hasAttribute('required') && !val) {
          msg = 'This field is required.';
        } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
          msg = 'Enter a valid email address.';
        } else if (field.type === 'tel' && val && val.replace(/\D/g, '').length < 8) {
          msg = 'Enter a valid phone number.';
        } else if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
          msg = 'Please confirm to continue.';
        }

        slot.textContent = msg;
        field.setAttribute('aria-invalid', msg ? 'true' : 'false');
        return !msg;
      }

      form.querySelectorAll('.input, input[type="checkbox"]').forEach(function (field) {
        field.addEventListener('blur', function () { validate(field); });
        field.addEventListener('input', function () {
          if (field.getAttribute('aria-invalid') === 'true') validate(field);
        });
      });

      form.addEventListener('submit', function (e) {
        var fields = form.querySelectorAll('.input[required], input[type="checkbox"][required]');
        var ok = true;
        var first = null;

        fields.forEach(function (field) {
          if (!validate(field)) { ok = false; if (!first) first = field; }
        });

        if (!ok) {
          e.preventDefault();
          if (first) first.focus();
          if (status) {
            status.textContent = 'Please correct the highlighted fields and try again.';
            status.classList.add('is-visible');
          }
          return;
        }

        // No backend connected yet — show a confirmation instead of a dead POST.
        if (!form.getAttribute('action')) {
          e.preventDefault();
          if (status) {
            status.textContent = 'Thank you — your enquiry has been captured. Our team will respond within one business day. (Demo mode: connect a form handler to receive submissions.)';
            status.classList.add('is-visible');
            status.setAttribute('role', 'status');
          }
          form.reset();
          form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
          form.querySelectorAll('.field-error').forEach(function (s) { s.textContent = ''; });
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Image loading: fade in, and keep a clean placeholder if a photo
     fails to load (remote demo photography).
     --------------------------------------------------------------------- */
  function initImages() {
    document.querySelectorAll('.imgwrap img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.display = 'none';
        img.parentElement.setAttribute('data-img-failed', 'true');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Category filter (Sports / Products page)
     --------------------------------------------------------------------- */
  function initFilter() {
    var bar = document.querySelector('[data-filter-bar]');
    var grid = document.querySelector('[data-filter-grid]');
    if (!bar || !grid) return;

    var items = Array.prototype.slice.call(grid.children);
    var empty = document.querySelector('[data-filter-empty]');

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;

      bar.querySelectorAll('[data-filter]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
        b.classList.toggle('btn--dark', b === btn);
        b.classList.toggle('btn--outline', b !== btn);
      });

      var key = btn.getAttribute('data-filter');
      var shown = 0;
      items.forEach(function (item) {
        var match = key === 'all' || (item.getAttribute('data-tags') || '').indexOf(key) > -1;
        item.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  /* ---------------------------------------------------------------------
     Current year in footers
     --------------------------------------------------------------------- */
  function initYear() {
    var y = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });
  }

  /* --------------------------------------------------------------------- */
  function boot() {
    initNav();
    initScrollState();
    initReveal();
    initCounters();
    initAccordion();
    initForms();
    initImages();
    initFilter();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
