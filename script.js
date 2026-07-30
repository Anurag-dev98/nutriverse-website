/* script.js — Production-ready animations and small UX polish */
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Safe DOM helpers
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Header scroll: add/remove scrolled class
  const header = $('.site-header');
  const logoWrap = $('.logo-wrap');
  let _prevScrolled = null;
  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 50;
    if (scrolled) header.classList.add('scrolled'); else header.classList.remove('scrolled');

    // If GSAP available and wide screen, animate logoWrap smoothly (only on state change)
    if (logoWrap && (scrolled !== _prevScrolled) && window.gsap && !prefersReduced && window.innerWidth >= 900) {
      try {
        const gs = window.gsap;
        if (scrolled) {
          gs.to(logoWrap, { left: '50%', xPercent: -50, duration: 0.56, ease: 'power3.out' });
        } else {
          // animate back to left edge
          gs.to(logoWrap, { left: getComputedStyle(logoWrap).getPropertyValue('--orig-left') || "16px", xPercent: 0, duration: 0.48, ease: 'power3.out' });
        }
      } catch (e) { /* noop */ }
    }
    _prevScrolled = scrolled;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle (robust + keyboard support)
  const toggle = $('.menu-toggle');
  const mobileNav = $('.nav-mobile');
  if (toggle && mobileNav) {
    const toggleMenu = () => {
      mobileNav.classList.toggle('active');
      const expanded = mobileNav.classList.contains('active');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      document.body.style.overflow = expanded ? 'hidden' : '';
    };
    toggle.addEventListener('click', toggleMenu);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });
  }

  // Intersection-based reveal for store cards (staggered)
  const storeCards = $$('.store-card');
  const availability = $('.availability-impact');
  if (availability && storeCards.length) {
    const obs = new IntersectionObserver((entries, o) => {
      if (entries[0].isIntersecting) {
        storeCards.forEach((c, i) => setTimeout(() => c.classList.add('active'), i * 180));
        o.disconnect();
      }
    }, { threshold: 0.35 });
    obs.observe(availability);
  }

  // Defer heavy animations if user prefers reduced motion
  if (prefersReduced) return;

  // GSAP-driven animations (if available)
  if (window.gsap) {
    try {
      const { gsap } = window;
      gsap.registerPlugin(window.ScrollTrigger);

      // Hero: fade video in, subtle scale
      const heroEl = $('.hero-video');
      const heroVideo = document.querySelector('.hero-video-element');
      if (heroVideo && heroEl) {
        heroVideo.addEventListener('loadeddata', () => {
          document.documentElement.classList.add('hero-loaded');
          gsap.fromTo(heroVideo, { autoAlpha: 0, scale: 1.02 }, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.out' });
        });
        // If video doesn't load quickly, ensure it fades in
        setTimeout(() => { document.documentElement.classList.add('hero-loaded'); }, 1200);
      }

      // Subtle floating for product image in why/right and contact card
      gsap.utils.toArray('.why-right img, .contact-card img').forEach((img) => {
        gsap.to(img, { y: 8, rotation: 1, duration: 4 + Math.random() * 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });

      // Staggered reveal for why section
      gsap.from('.why-title, .why-desc, .badges .badge', {
        scrollTrigger: { trigger: '.why-nutriverse', start: 'top 80%' },
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });

      // Cookies heading reveal. The product image stays visible as a reliable
      // fallback when animation resources are delayed or unavailable.
      gsap.from('.cookies-right .cookies-title', {
        scrollTrigger: { trigger: '.cookies-section', start: 'top 80%' },
        y: 60,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out'
      });

      // Floating CTA micro-interaction
      const cta = document.querySelector('.contact-btn');
      if (cta) {
        gsap.fromTo(cta, { y: 0 }, { y: -6, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }

    } catch (err) {
      // silently fail — keep UI functional
      console.warn('GSAP animation failed to initialize', err);
    }
  } else {
    // Fallback: apply simple CSS utility classes
    document.querySelectorAll('.why-title, .why-desc, .badges .badge').forEach(el => el.classList.add('u-slide-up'));
  }

  // Pause hero video on small devices to save bandwidth
  const videoEl = document.querySelector('.hero-video-element');
  const syncHeroMedia = () => {
    if (!videoEl) return;
    const isMobile = window.innerWidth < 700;
    if (isMobile) {
      try { videoEl.pause(); } catch (e) { /* ignore */ }
    } else if (!prefersReduced) {
      try { videoEl.play(); } catch (e) { /* ignore autoplay restrictions */ }
    }
  };

  syncHeroMedia();
  window.addEventListener('resize', () => {
    syncHeroMedia();
  }, { passive: true });

  if (videoEl && window.innerWidth < 700) {
    try { videoEl.pause(); } catch (e) { /* ignore */ }
  }

  // Clean up listeners on page unload
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('scroll', onScroll);
  });

})();
