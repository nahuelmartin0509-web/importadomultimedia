/* ============================================================
   script.js — Importado Multimedia
============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     HEADER: scroll state
  ---------------------------------------------------------- */
  const header = document.getElementById('header');

  function handleScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ----------------------------------------------------------
     HAMBURGER MENU (mobile)
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------
     ACTIVE NAV LINK on scroll (Intersection Observer)
  ---------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ----------------------------------------------------------
     FAQ ACCORDION
  ---------------------------------------------------------- */
  const faqButtons = document.querySelectorAll('.faq-q');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId   = btn.getAttribute('aria-controls');
      const answer     = document.getElementById(answerId);

      // Close all others
      faqButtons.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId  = other.getAttribute('aria-controls');
          const otherAns = document.getElementById(otherId);
          if (otherAns) otherAns.hidden = true;
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', !isExpanded);
      if (answer) answer.hidden = isExpanded;
    });
  });

  /* ----------------------------------------------------------
     SCROLL-IN ANIMATIONS (fade-up on viewport entry)
  ---------------------------------------------------------- */
  const animateEls = document.querySelectorAll(
    '.product-card, .review-card, .blog-card, .sf-item, .trust-item, .faq-item'
  );

  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px' }
  );

  animateEls.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = `opacity .55s ease ${i * .06}s, transform .55s ease ${i * .06}s`;
    animObserver.observe(el);
  });

  document.addEventListener('animationend', () => {}, { once: true });

  // Add "visible" class handler via CSS
  const style = document.createElement('style');
  style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

})();
