/* Site interactions — custom cursor, scroll bar, modals, skill bars, reveals */

/* ── Custom cursor ───────────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with eased lag for a premium feel
  (function loop() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Expand ring on interactive elements
  const interactiveSelector = 'a, button, .project-card, [role="button"], .social-link, .modal-link, .resume-download';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ── Scroll progress bar ─────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  function update() {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? (window.scrollY / max * 100) + '%' : '0';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Modal system ────────────────────────────────────────── */
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  document.querySelectorAll('[data-modal]').forEach(card => {
    card.addEventListener('click', () => {
      const target = document.getElementById(card.dataset.modal);
      if (!target) return;
      overlay.querySelectorAll('.modal').forEach(m => (m.hidden = true));
      target.hidden = false;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── Skill bar animations ────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.sb-bar[data-w]');
  if (!bars.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w;
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => io.observe(b));
}

/* ── Active nav link ─────────────────────────────────────── */
function initNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Scroll-reveal ───────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const style = document.createElement('style');
  style.textContent = '.revealed{opacity:1!important;transform:none!important}';
  document.head.appendChild(style);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollProgress();
  initModals();
  initSkillBars();
  initNav();
  initReveal();

  // Keyboard accessibility for project cards
  document.querySelectorAll('.project-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
});
