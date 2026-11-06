(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll entrances, once.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  document.querySelectorAll('[data-reveal], [data-reveal-band], .portrait, .mail').forEach((el) => io.observe(el));

  // The bar: transparent over the hero, solid after it, out of the way while reading down.
  const bar = document.querySelector('.bar');
  const hero = document.querySelector('.hero');
  let lastY = window.scrollY;

  // Parallax: pictures drift a little slower than the page.
  const drift = [...document.querySelectorAll('[data-parallax]')];
  let ticking = false;
  const frame = () => {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    if (bar) {
      bar.classList.toggle('is-solid', y > hero.offsetHeight - 80);
      bar.classList.toggle('is-hidden', y > lastY && y > 400);
      lastY = y;
    }
    if (reduce) return;
    for (const img of drift) {
      const host = img.parentElement.tagName === 'PICTURE' ? img.parentElement.parentElement : img.parentElement;
      const box = host.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) continue;
      const centre = box.top + box.height / 2 - vh / 2;
      img.style.transform = `translate3d(0, ${(-centre * parseFloat(img.dataset.parallax)).toFixed(1)}px, 0)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  // Contact form: send in the page, keep the visitor where they are.
  const form = document.querySelector('form[name="contact"]');
  if (form && window.fetch) {
    const status = form.querySelector('.form__status');
    const send = form.querySelector('button[type="submit"]');
    const show = (html) => { status.innerHTML = html; status.hidden = false; };
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      send.disabled = true; send.textContent = 'Sending…';
      try {
        const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
        if (!res.ok) throw new Error(res.status);
        [...form.children].forEach((el) => { if (el !== status) el.hidden = true; });
        show('Thanks. We have your message and will reply soon.');
        status.setAttribute('tabindex', '-1'); status.focus();
      } catch (err) {
        send.disabled = false; send.textContent = 'Send message';
        show('The message did not send. Please try again, or email <a href="mailto:anastas@beyondzenith.com.au">anastas@beyondzenith.com.au</a>.');
      }
    });
  }
})();
