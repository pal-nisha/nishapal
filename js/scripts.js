// Nisha Pal portfolio interactions: restored soft mouse-follow glow, accessible menu, reveal motion and private anonymous traffic.
(() => {
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursorGlow = document.querySelector('.cursor-glow');
  if (finePointer && !reducedMotion) {
    let x = -600, y = -600, targetX = x, targetY = y;
    const ease = 0.12;
    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    }, { passive: true });
    const frame = () => {
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      document.documentElement.style.setProperty('--mx', `${x}px`);
      document.documentElement.style.setProperty('--my', `${y}px`);
      if (cursorGlow) cursorGlow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      window.requestAnimationFrame(frame);
    };
    frame();
  }
})();

(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const navLinks = nav ? [...nav.querySelectorAll('a')] : [];
  const navWrap = document.querySelector('.nav-wrap');
  const navBackdrop = document.createElement('div');
  navBackdrop.className = 'mobile-nav-backdrop';
  navBackdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(navBackdrop);
  const placeNavForViewport = () => {
    if (!nav || !menuToggle || !navWrap) return;
    if (window.innerWidth <= 760) {
      if (nav.parentElement !== document.body) document.body.appendChild(nav);
    } else if (nav.parentElement !== navWrap) {
      menuToggle.insertAdjacentElement('afterend', nav);
    }
  };
  placeNavForViewport();
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 15);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
    navBackdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    nav?.classList.toggle('open', !open);
    navBackdrop.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  navBackdrop.addEventListener('click', closeMenu);
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
    placeNavForViewport();
  });

  const revealItems = document.querySelectorAll('.reveal');
  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && motionAllowed) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }


  // Entire project cards open their destination; inner links keep their own behavior.
  document.querySelectorAll('.project-card[data-project-url]').forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('a, button, input, select, textarea')) return;
      const destination = card.dataset.projectUrl;
      if (!destination) return;
      if (destination.startsWith('mailto:')) window.location.href = destination;
      else window.open(destination, '_blank', 'noopener,noreferrer');
    });
    card.addEventListener('keydown', event => {
      if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      const destination = card.dataset.projectUrl;
      if (destination?.startsWith('mailto:')) window.location.href = destination;
      else if (destination) window.open(destination, '_blank', 'noopener,noreferrer');
    });
  });

})();
