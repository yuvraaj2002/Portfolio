(() => {
  const page = document.body;
  if (!page || (!page.classList.contains('blogs-page') && !page.classList.contains('post-page'))) return;

  const KEY = 'writing-theme';
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const readStored = () => {
    try {
      return localStorage.getItem(KEY);
    } catch (_) {
      return null;
    }
  };

  const writeStored = value => {
    try {
      localStorage.setItem(KEY, value);
    } catch (_) {}
  };

  const resolve = () => {
    const stored = readStored();
    if (stored === 'dark' || stored === 'light') return stored;
    return media.matches ? 'dark' : 'light';
  };

  const apply = theme => {
    const dark = theme === 'dark';
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#121212' : '#ffffff');
    if (!toggle) return;
    toggle.setAttribute('aria-checked', dark ? 'true' : 'false');
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    toggle.setAttribute('aria-label', dark ? 'Switch to light appearance' : 'Switch to dark appearance');
  };

  apply(resolve());
  root.classList.add('theme-ready');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      writeStored(next);
      apply(next);
    });
  }

  const onSchemeChange = () => {
    if (readStored()) return;
    apply(resolve());
  };
  if (typeof media.addEventListener === 'function') media.addEventListener('change', onSchemeChange);
  else if (typeof media.addListener === 'function') media.addListener(onSchemeChange);

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
