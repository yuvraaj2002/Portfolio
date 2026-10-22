(() => {
  if (!('IntersectionObserver' in window)) return;
  const links = [...document.querySelectorAll('.case-index a')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, {rootMargin:'-15% 0px -50% 0px', threshold:0});
  document.querySelectorAll('.case-chapter').forEach(chapter => observer.observe(chapter));
})();
