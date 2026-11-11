(() => {
  const root = document.querySelector('.nav-social');
  if (!root) return;
  const button = root.querySelector('.nav-social-toggle');
  const menu = root.querySelector('.nav-social-menu');
  if (!button || !menu) return;

  const setOpen = open => {
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
  };

  button.addEventListener('click', event => {
    event.stopPropagation();
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('pointerdown', event => {
    if (!root.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
})();
