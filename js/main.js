(function () {
  'use strict';

  /* ── DOM refs ── */
  var header    = document.getElementById('header');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks  = document.getElementById('nav-links');
  var modal     = document.getElementById('entry-modal');
  var modalSkip = document.getElementById('modal-skip');
  var floatCta  = document.getElementById('float-cta');

  /* ── Entry modal (show once per session) ── */
  function closeModal() {
    modal.classList.add('hidden');
    sessionStorage.setItem('shg-visited', '1');
  }

  if (!sessionStorage.getItem('shg-visited')) {
    modalSkip.addEventListener('click', closeModal);
    document.getElementById('modal-join').addEventListener('click', closeModal);
  } else {
    modal.classList.add('hidden');
  }

  /* ── Sticky header ── */
  function onScroll() {
    var scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    floatCta.classList.toggle('visible', window.scrollY > 500);
    if (whatsappBtn) whatsappBtn.classList.toggle('visible', window.scrollY > 500);
    highlightNav();
    animateBars();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Active nav highlight ── */
  var sections   = document.querySelectorAll('main section[id]');
  var navAnchors = navLinks.querySelectorAll('li:not(.nav__mobile-cta) a');

  function highlightNav() {
    var current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ── Mobile nav ── */
  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    header.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      header.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── Scroll fade-in ── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(function (el) { observer.observe(el); });

  /* ── Results Club bar animation ── */
  var barsStarted = false;
  function animateBars() {
    if (barsStarted) return;
    var rc = document.querySelector('.results-club__visual');
    if (!rc) return;
    var rect = rc.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;
    barsStarted = true;
    document.querySelectorAll('.rc-bar-fill').forEach(function (bar) {
      var target = bar.style.getPropertyValue('--w');
      bar.style.width = target;
    });
  }

  /* ── Pause hero video on mobile to save battery ── */
  var heroVideo = document.querySelector('.hero__video');
  if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.pause();
  }

  /* ── WhatsApp button visibility ── */
  var whatsappBtn = document.getElementById('whatsapp-btn');

  /* ── Cookie banner ── */
  var cookieBanner = document.getElementById('cookie-banner');
  if (!localStorage.getItem('shg-cookies')) {
    setTimeout(function () { if (cookieBanner) cookieBanner.hidden = false; }, 1500);
  }
  document.getElementById('cookie-accept').addEventListener('click', function () {
    localStorage.setItem('shg-cookies', 'accepted');
    cookieBanner.hidden = true;
  });
  document.getElementById('cookie-decline').addEventListener('click', function () {
    localStorage.setItem('shg-cookies', 'declined');
    cookieBanner.hidden = true;
  });

  /* ── Pricing tab toggle ── */
  var pricingTabs = document.querySelectorAll('.pricing-tab');
  pricingTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');
      pricingTabs.forEach(function (t) {
        t.classList.remove('pricing-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('pricing-tab--active');
      this.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.pricing-panel').forEach(function (p) {
        p.classList.remove('pricing-panel--active');
        p.hidden = true;
      });
      var panel = document.getElementById('panel-' + target);
      if (panel) { panel.classList.add('pricing-panel--active'); panel.hidden = false; }
    });
  });

  /* ── Timetable collapsible dropdown ── */
  var ttToggle = document.getElementById('tt-toggle');
  var ttBody   = document.getElementById('tt-body');
  if (ttToggle && ttBody) {
    ttToggle.addEventListener('click', function () {
      var open = ttToggle.getAttribute('aria-expanded') === 'true';
      ttToggle.setAttribute('aria-expanded', String(!open));
      ttToggle.classList.toggle('open', !open);
      ttBody.hidden = open;
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-item__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = this.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) { item.classList.add('open'); this.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ── App join popup (tap the phone mockup) ── */
  var phoneTrigger = document.getElementById('app-phone-trigger');
  var appPopup     = document.getElementById('app-popup');
  if (phoneTrigger && appPopup) {
    var openAppPopup = function () {
      appPopup.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    var closeAppPopup = function () {
      appPopup.hidden = true;
      document.body.style.overflow = '';
    };
    phoneTrigger.addEventListener('click', openAppPopup);
    phoneTrigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAppPopup(); }
    });
    document.getElementById('app-popup-close').addEventListener('click', closeAppPopup);
    document.getElementById('app-popup-backdrop').addEventListener('click', closeAppPopup);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !appPopup.hidden) closeAppPopup();
    });
  }

  /* ── Mobile carousels (auto-rotating) ── */
  function initCarousels() {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    document.querySelectorAll('[data-carousel]').forEach(function (track) {
      if (track.dataset.carouselReady) return;
      var slides = Array.prototype.slice.call(track.children);
      if (slides.length < 2) return;
      track.dataset.carouselReady = '1';

      /* make sure fade-in cards aren't stuck invisible inside the scroller */
      if (track.classList.contains('fade-in')) track.classList.add('visible');
      track.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });

      /* dots */
      var dots = document.createElement('div');
      dots.className = 'carousel-dots';
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', function () { goTo(i, true); });
        dots.appendChild(d);
      });
      track.parentNode.insertBefore(dots, track.nextSibling);

      var idx = 0, timer = null;
      function goTo(i, user) {
        idx = (i + slides.length) % slides.length;
        var child = slides[idx];
        var left = track.scrollLeft + (child.getBoundingClientRect().left - track.getBoundingClientRect().left);
        track.scrollTo({ left: left, behavior: 'smooth' });
        setActive();
        if (user) restart();
      }
      function setActive() {
        dots.querySelectorAll('.carousel-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === idx);
        });
      }
      function next() { goTo(idx + 1); }
      function restart() { stop(); timer = setInterval(next, 4500); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }

      var scrollTimer;
      track.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          var nearest = 0, min = Infinity, trackLeft = track.getBoundingClientRect().left;
          slides.forEach(function (s, i) {
            var d = Math.abs(s.getBoundingClientRect().left - trackLeft);
            if (d < min) { min = d; nearest = i; }
          });
          idx = nearest;
          setActive();
        }, 120);
      }, { passive: true });

      track.addEventListener('pointerdown', stop);
      track.addEventListener('pointerup', restart);
      restart();
    });
  }
  initCarousels();

  /* ── Initial call ── */
  onScroll();

}());
