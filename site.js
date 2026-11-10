(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A looping band video plays only when the visitor allows motion. Otherwise the poster frame shows.
  if (reduce) document.querySelectorAll('video[data-motion]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });

  // Scroll entrances, once. The 'js' class hides the content until it comes into view, so add it
  // only here, where the observer can show it again. If this script does not run, all content shows.
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    let answered = false;
    const io = new IntersectionObserver((entries) => {
      answered = true;
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-reveal], [data-reveal-band], .portrait, .mail, .rise').forEach((el) => io.observe(el));
    // The observer always answers once soon after it starts. If it does not, show everything.
    setTimeout(() => { if (!answered) document.documentElement.classList.remove('js'); }, 2000);
  }

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
      bar.classList.toggle('is-solid', !hero || y > hero.offsetHeight - 80);
      bar.classList.toggle('is-hidden', !bar.classList.contains('is-open') && y > lastY && y > 400);
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

  // Menu on narrow screens: a button opens the full-screen menu. Without this script the button
  // stays hidden (it shows only under the 'has-menu' class) and the Contact button remains.
  const menuButton = document.querySelector('.bar__menu');
  const menu = document.getElementById('menu');
  if (bar && menuButton && menu) {
    document.documentElement.classList.add('has-menu');
    const setMenu = (open) => {
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? 'Close' : 'Menu';
      menu.hidden = !open;
      bar.classList.toggle('is-open', open);
      bar.classList.remove('is-hidden');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) menu.querySelector('a').focus();
    };
    menuButton.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (ev) => { if (ev.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && !menu.hidden) { setMenu(false); menuButton.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (ev) => { if (ev.matches && !menu.hidden) setMenu(false); });
  }

  // Header dropdowns: open on click or Enter (hover opens them through CSS), close on Escape,
  // on a click outside, or when focus leaves the dropdown.
  const drops = Array.from(document.querySelectorAll('[data-drop]'));
  if (drops.length) {
    document.documentElement.classList.add('has-drop');
    const setDrop = (d, open) => {
      d.classList.toggle('is-open', open);
      d.querySelector('.drop__btn').setAttribute('aria-expanded', String(open));
    };
    drops.forEach((d) => {
      const btn = d.querySelector('.drop__btn');
      btn.addEventListener('click', () => {
        const open = !d.classList.contains('is-open');
        drops.forEach((x) => setDrop(x, false));
        setDrop(d, open);
      });
      d.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && d.classList.contains('is-open')) { setDrop(d, false); btn.focus(); }
      });
      d.addEventListener('focusout', (ev) => { if (!d.contains(ev.relatedTarget)) setDrop(d, false); });
    });
    document.addEventListener('click', (ev) => { drops.forEach((d) => { if (!d.contains(ev.target)) setDrop(d, false); }); });
  }

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
        show('The message did not send. Please try again, or email <a href="mailto:hello@beyondzenith.com.au">hello@beyondzenith.com.au</a>.');
      }
    });
  }
})();
