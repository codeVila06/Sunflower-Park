
// Mobile navigation toggle (Global)
(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      // small delay to allow transition
      requestAnimationFrame(() => nav.classList.toggle('show'));
    });

    // close when clicking outside
    document.addEventListener('click', (ev) => {
      if (!nav.contains(ev.target) && !navToggle.contains(ev.target)) {
        nav.classList.remove('open', 'show');
      }
    });
    // close on escape
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') nav.classList.remove('open', 'show');
    });
  }
})();


// Slideshow Logic
(function () {
  const slideshow = document.getElementById('slideshow');
  if (!slideshow) return;
  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  const prev = slideshow.querySelector('.slide-arrow.prev');
  const next = slideshow.querySelector('.slide-arrow.next');
  const dotsContainer = document.getElementById('slide-dots');
  let current = 0;
  let timer = null;
  const interval = 6000; // 6s

  function show(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function nextSlide(dir = 1) {
    let idx = (current + dir + slides.length) % slides.length;
    show(idx);
  }

  function start() {
    stop();
    timer = setInterval(() => nextSlide(1), interval);
  }
  function stop() { if (timer) clearInterval(timer); }

  // setup dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => { show(i); start(); });
    dotsContainer.appendChild(btn);
  });

  // arrows
  if (prev) prev.addEventListener('click', () => { nextSlide(-1); start(); });
  if (next) next.addEventListener('click', () => { nextSlide(1); start(); });

  // initial
  show(0);
  start();

  // pause on hover
  slideshow.addEventListener('mouseenter', stop);
  slideshow.addEventListener('mouseleave', start);
})();

// Back-to-top button behaviour
(function () {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  // Scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // Show/hide based on scroll position
  function toggle() {
    if (window.scrollY > 300) btn.style.opacity = '1';
    else btn.style.opacity = '0';
  }
  btn.style.transition = 'opacity 220ms ease';
  btn.style.opacity = '0';
  window.addEventListener('scroll', toggle);
  toggle();
})();

// Scroll reveal for sections: adds `in-view` when elements enter the viewport
(function () {
  const reveals = Array.from(document.querySelectorAll('.reveal-on-scroll'));
  if (!reveals.length) return;

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // small stagger based on document order
        const idx = Math.max(0, reveals.indexOf(el));
        el.style.transitionDelay = `${Math.min(idx * 80, 420)}ms`;
        el.classList.add('in-view');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(r => obs.observe(r));
})();
