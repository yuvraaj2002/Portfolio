(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.querySelector('#project-dialog');
  let lenis;

  function syncDialog() {
    if (!lenis) return;
    if (dialog?.open) lenis.stop();
    else lenis.start();
  }

  function configure() {
    lenis?.destroy();
    lenis = undefined;
    if (preference.matches || typeof window.Lenis !== 'function') return;
    lenis = new window.Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      prevent: node => Boolean(node.closest?.('dialog')),
    });
    syncDialog();
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!lenis || !link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const hash = link.getAttribute('href');
    let target;
    try { target = hash === '#' ? document.documentElement : document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target) return;
    event.preventDefault();
    const header = document.querySelector('.site-header');
    lenis.scrollTo(target, {
      offset: -(header?.getBoundingClientRect().height || 0) - 24,
      onComplete: () => {
        if (location.hash !== hash) history.pushState(null, '', hash);
        const temporary = !target.hasAttribute('tabindex');
        if (temporary) target.setAttribute('tabindex', '-1');
        target.focus({preventScroll: true});
        if (temporary) target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once:true});
      },
    });
  });

  if (dialog) new MutationObserver(syncDialog).observe(dialog, {attributes:true, attributeFilter:['open']});
  preference.addEventListener('change', configure);
  addEventListener('pagehide', () => {lenis?.destroy(); lenis = undefined;});
  addEventListener('pageshow', configure);
  configure();
})();
