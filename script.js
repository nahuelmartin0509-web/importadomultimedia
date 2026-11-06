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
     CATÁLOGO DE VEHÍCULOS: Búsqueda y Filtro por Marca
  ---------------------------------------------------------- */
  const vehicleCatalogData = [
    {
      brand: "Volkswagen",
      id: "volkswagen",
      models: [
        'Línea VW 9" / VW Universal',
        'Golf (2014 - 2020)',
        'Fox (2014 - 2018)'
      ]
    },
    {
      brand: "Toyota",
      id: "toyota",
      models: [
        'Hilux / Hilux Nueva',
        'Corolla (2009) / Corolla Nuevo',
        'Etios (2011+)',
        'RAV4 (2006 - 2012) / RAV4 (2013 - 2017)'
      ]
    },
    {
      brand: "Honda",
      id: "honda",
      models: [
        'Civic 8va Gen / Civic 9na Gen (2012 - 2015)',
        'CR-V (2006 - 2012) / CR-V (2012+)',
        'HR-V (2015 - 2020)',
        'Fit (2008 - 2013)',
        'City (2006) / City Auto AC (2008 - 2013)'
      ]
    },
    {
      brand: "Ford",
      id: "ford",
      models: [
        'Ranger (2012)',
        'Focus Automático (2007 - 2011)',
        'Focus Manual (2007 - 2011 - 3 agujeros)',
        'Focus (2012 - 2017)'
      ]
    },
    {
      brand: "Chevrolet",
      id: "chevrolet",
      models: [
        'S10 (2015 / 2018)',
        'Onix / Prisma / Spin',
        'Captiva / Aveo / Lova / Gentra / Epica (2006)'
      ]
    },
    {
      brand: "Peugeot",
      id: "peugeot",
      models: [
        '206',
        '208 / 2008',
        '307',
        '308 / 408'
      ]
    },
    {
      brand: "Renault",
      id: "renault",
      models: [
        'Alaskan / Frontier',
        'Duster (2013 - 2017)',
        'Logan / Sandero / Duster (2015 - 2017)',
        'Logan / Sandero / Duster (2017+)'
      ]
    },
    {
      brand: "Jeep",
      id: "jeep",
      models: [
        'Renegade',
        'Compass (2011 - 2016) / Compass (2017)'
      ]
    },
    {
      brand: "Citroën",
      id: "citroen",
      models: [
        'C4 (2008 - 2014)',
        'C4 Lounge (2013 - 2017)'
      ]
    },
    {
      brand: "Fiat",
      id: "fiat",
      models: [
        'Toro',
        'Strada / Fiorino'
      ]
    },
    {
      brand: "Hyundai",
      id: "hyundai",
      models: [
        'i10',
        'Santa Fe (2006 - 2012)'
      ]
    },
    {
      brand: "Audi & Seat",
      id: "audi-seat",
      models: [
        'Audi A3',
        'Seat León (2005 - 2012)'
      ]
    }
  ];

  const searchInput = document.getElementById('vehicle-search');
  const searchClear = document.getElementById('vehicle-search-clear');
  const pillButtons = document.querySelectorAll('.v-pill');
  const vehicleCards = document.querySelectorAll('.vehicle-card');
  const noResultsMsg = document.getElementById('vehicles-no-results');

  let activeBrandFilter = 'all';

  function filterVehicles() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    let visibleCount = 0;

    vehicleCards.forEach(card => {
      const cardBrand = card.getAttribute('data-brand') || '';
      const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const cardText = card.innerText.toLowerCase();

      const matchesBrand = (activeBrandFilter === 'all') || (cardBrand === activeBrandFilter);
      const matchesSearch = !query || cardKeywords.includes(query) || cardText.includes(query);

      if (matchesBrand && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (searchClear) {
      searchClear.style.display = query.length > 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterVehicles);
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      filterVehicles();
    });
  }

  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pillButtons.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      activeBrandFilter = btn.getAttribute('data-filter') || 'all';
      filterVehicles();
    });
  });

  /* ----------------------------------------------------------
     SCROLL-IN ANIMATIONS (fade-up on viewport entry)
  ---------------------------------------------------------- */
  const animateEls = document.querySelectorAll(
    '.product-card, .vehicle-card, .review-card, .blog-card, .sf-item, .trust-item, .faq-item'
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
