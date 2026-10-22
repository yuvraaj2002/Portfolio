(() => {
  'use strict';
  const projects = window.PORTFOLIO_PROJECTS || [];
  const categoryKey = value => ({All:'all', Relecura:'relecura', MaxVal:'maxval', Freelance:'independent', 'Independent Client Work':'independent', 'Product Partnerships':'independent'}[value] || value);
  const grid = document.querySelector('#projects');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const workGroups = [
    {key:'independent', title:'Product Partnerships', label:'INDEPENDENT ENGAGEMENTS', description:'AI-powered products built around client needs.'},
    {key:'relecura', title:'Relecura', label:'CURRENT ORGANIZATION', description:'Applied AI and platform contributions within a product organization.'},
    {key:'maxval', title:'MaxVal', label:'PREVIOUS ORGANIZATION', description:'Professional experience applying AI to intellectual-property workflows.'},
  ];
  function projectCard(project, lead = false) {
    return `<a class="project-card project-card-link ${lead ? 'work-group-lead' : ''}" href="work/${escape(project.id)}/" aria-label="View work overview: ${escape(project.title)}"><div class="project-card-content"><div class="project-category"><span>${escape(project.eyebrow || project.category)}</span><span class="project-number">${String(projects.indexOf(project) + 1).padStart(2, '0')}</span></div><h4 class="project-title">${escape(project.title)}</h4><p class="project-summary">${escape(project.summary)}</p><div class="project-tags" aria-label="Key skills">${project.stack.map(tag => `<span>${escape(tag)}</span>`).join('')}</div><div class="project-footer"><span>${escape(categoryKey(project.category) === 'independent' ? 'Product Partnerships' : project.category)}</span><span class="project-open">Get Details <span aria-hidden="true">↗</span></span></div></div></a>`;
  }
  function render(filter = 'all') {
    const key = categoryKey(filter);
    const visible = projects.filter(project => key === 'all' || categoryKey(project.category) === key);
    grid.classList.toggle('work-groups-filtered', key !== 'all');
    grid.innerHTML = workGroups.filter(group => key === 'all' || group.key === key).map(group => {
      const items = visible.filter(project => categoryKey(project.category) === group.key);
      if (!items.length) return '';
      return `<section class="work-group work-group--${group.key}" aria-labelledby="work-group-${group.key}"><header class="work-group-header"><div class="work-group-meta"><p>${group.label}</p><span>${String(items.length).padStart(2,'0')} ${group.key === 'maxval' ? 'ROLE OVERVIEW' : 'PROJECTS'}</span></div><h3 id="work-group-${group.key}">${group.title}</h3><p class="work-group-description">${group.description}</p></header><div class="work-group-projects">${items.map((project,index) => projectCard(project, index === 0 && group.key !== 'maxval')).join('')}</div></section>`;
    }).join('');
    if (!visible.length) grid.innerHTML = `<article class="empty-state"><p class="section-label">${key === 'maxval' ? 'MAXVAL IP SERVICES' : 'PROJECTS'}</p><h3>${key === 'maxval' ? 'Professional experience at MaxVal.' : 'No case studies in this category yet.'}</h3><p>${key === 'maxval' ? 'My full-time work at MaxVal is part of my professional journey. Project details are not published here yet.' : 'Explore another category to see the documented work.'}</p><a class="journey-proof" href="https://www.linkedin.com/in/yuvraaj-singh/" target="_blank" rel="noopener noreferrer">View experience on LinkedIn ↗<span class="sr-only"> (opens in a new tab)</span></a></article>`;
    document.querySelector('#project-count').textContent = `${String(visible.length).padStart(2, '0')} CASE STUDIES`;
  }
  const filters = [...document.querySelectorAll('[data-filter]')];
  function selectFilter(value, updateUrl = false) {
    const requested = categoryKey(value);
    const key = filters.some(button => button.dataset.filter === requested) ? requested : 'all';
    filters.forEach(button => {const active = button.dataset.filter === key; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active));});
    render(key);
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (key === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', key);
      history.replaceState(null, '', url);
    }
  }
  filters.forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter, true)));
  document.querySelectorAll('[data-evidence]').forEach(link => link.addEventListener('click', () => {
    selectFilter(link.dataset.evidence, true);
  }));
  document.querySelector('#year').textContent = new Date().getFullYear();
  const chart = document.querySelector('#github-chart');
  if (chart) {
    const status = document.querySelector('#github-chart-status');
    const calendar = document.querySelector('#gh-calendar');
    const year = new Date().getFullYear();
    let drawn = false;
    const loaded = () => {if (!drawn) status.textContent = 'Activity, not a measure of impact.';};
    const failed = () => {chart.hidden = true; if (!drawn) status.textContent = 'Chart unavailable. Use the profile link above to view activity on GitHub.';};
    chart.addEventListener('load', loaded);
    chart.addEventListener('error', failed);
    if (chart.complete) { if (chart.naturalWidth) loaded(); else failed(); }
    // Draw the current calendar year (Jan–Dec) from public contribution data;
    // the rolling past-year image above stays as the fallback.
    if (calendar && window.fetch) fetch(`https://github-contributions-api.jogruber.de/v4/yuvraaj2002?y=${year}`).then(response => response.ok ? response.json() : Promise.reject()).then(data => {
      const days = (data.contributions || []).filter(day => day.date.startsWith(`${year}-`));
      if (!days.length) return;
      const lead = new Date(`${year}-01-01T00:00:00`).getDay();
      const weeks = Math.ceil((lead + days.length) / 7);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const today = new Date().toISOString().slice(0, 10);
      const cells = Array.from({length: lead}, () => '<span class="gh-day is-blank"></span>').concat(days.map(day => {
        const label = `${day.count || 'No'} contribution${day.count === 1 ? '' : 's'} on ${new Date(`${day.date}T00:00:00`).toLocaleDateString('en', {month:'short', day:'numeric'})}`;
        return `<span class="gh-day gh-level-${Math.min(4, day.level)}${day.date > today ? ' is-future' : ''}" title="${label}"></span>`;
      }));
      const monthLabels = months.map((name, i) => `<span style="grid-column:${Math.floor((lead + Math.round((new Date(year, i, 1) - new Date(year, 0, 1)) / 864e5)) / 7) + 1}">${name}</span>`).join('');
      const total = (data.total && data.total[year]) || days.reduce((sum, day) => sum + day.count, 0);
      calendar.style.setProperty('--gh-weeks', weeks);
      calendar.innerHTML = `<div class="gh-months" aria-hidden="true">${monthLabels}</div><div class="gh-grid" role="img" aria-label="${total} GitHub contributions in ${year}">${cells.join('')}</div><div class="gh-legend" aria-hidden="true">Less${[0,1,2,3,4].map(level => `<span class="gh-day gh-level-${level}"></span>`).join('')}More</div>`;
      calendar.hidden = false;
      chart.hidden = true;
      drawn = true;
      document.querySelector('#github-chart-label').textContent = `GitHub contributions · ${year}`;
      status.textContent = `${total.toLocaleString('en')} contributions so far this year. Activity, not a measure of impact.`;
    }).catch(() => {});
  }
  selectFilter(new URLSearchParams(window.location.search).get('category') || 'all');
  // Testimonials: each quote links back to the client project it is about.
  const testimonialGrid = document.querySelector('#testimonial-grid');
  const testimonials = window.PORTFOLIO_TESTIMONIALS || [];
  if (testimonialGrid) {
    const initials = name => name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
    testimonialGrid.innerHTML = testimonials.map(item => {
      const project = projects.find(entry => entry.id === item.project);
      const avatar = item.photo ? `<img class="testimonial-avatar" src="${escape(item.photo)}" alt="" width="48" height="48" loading="lazy">` : `<span class="testimonial-avatar" aria-hidden="true">${escape(initials(item.name))}</span>`;
      const stars = Array.from({length: 5}, (_, i) => `<span class="${i < item.rating ? 'is-on' : ''}">★</span>`).join('');
      return `<figure class="testimonial-card">${item.sample ? '<span class="testimonial-sample">Sample</span>' : ''}<div class="testimonial-stars" role="img" aria-label="Rated ${item.rating} out of 5">${stars}</div><blockquote><p>${escape(item.quote)}</p></blockquote><figcaption>${avatar}<span class="testimonial-person"><strong>${escape(item.name)}</strong><span>${escape(item.role)}</span></span></figcaption>${project ? `<a class="testimonial-project" href="work/${escape(project.id)}/"><span>Project</span>${escape(project.title)}<i aria-hidden="true">↗</i></a>` : ''}</figure>`;
    }).join('');
    if (!testimonials.length) testimonialGrid.closest('section').hidden = true;
    // Carousel: drifts continuously and loops through a cloned set of cards.
    // Hovering or keyboard focus holds it; swiping, arrows and dots still work.
    const dots = document.querySelector('#testimonial-dots');
    const pause = document.querySelector('#testimonial-pause');
    const originals = [...testimonialGrid.children];
    const count = originals.length;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = false, holding = false, inView = true, pos = 0, resumeAt = 0, last = 0, stepTimer = 0;
    if (count > 1) originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a').forEach(link => link.tabIndex = -1);
      testimonialGrid.append(clone);
    });
    const cards = [...testimonialGrid.children];
    const step = () => count > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : testimonialGrid.clientWidth;
    const loop = () => count > 1 ? cards[count].offsetLeft - cards[0].offsetLeft : 0;
    const current = () => Math.round(pos / step()) % count;
    const wrap = value => { const width = loop(); return width ? ((value % width) + width) % width : 0; };
    function syncDots() {
      const active = current();
      [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === active)));
    }
    function goTo(index) {
      let target = index * step();
      // Stepping back from the first card jumps to the cloned copy first so it can glide.
      if (target < 0) { pos += loop(); testimonialGrid.scrollLeft = pos; target += loop(); }
      testimonialGrid.scrollTo({left: target, behavior: reduced.matches ? 'auto' : 'smooth'});
      resumeAt = performance.now() + 1500;
    }
    function setPaused(value) {
      paused = value;
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', paused ? 'Resume rotation' : 'Pause rotation');
      pause.firstElementChild.innerHTML = paused ? '<svg viewBox="0 0 12 12" width="12" height="12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 12 12" width="12" height="12"><path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" fill="currentColor"/></svg>';
    }
    function tick(now) {
      const dt = last ? Math.min(now - last, 64) : 0;
      last = now;
      const moving = !paused && !holding && inView && !document.hidden && count > 1 && now > resumeAt;
      if (moving && !reduced.matches) {
        pos = wrap(pos + dt * 0.035);
        testimonialGrid.scrollLeft = pos;
      } else if (moving && now - stepTimer > 5000) {
        // Reduced motion: change cards without animating them.
        stepTimer = now;
        pos = wrap((current() + 1) * step());
        testimonialGrid.scrollLeft = pos;
      }
      if (!moving) stepTimer = Math.max(stepTimer, now);
      requestAnimationFrame(tick);
    }
    if (count) {
      dots.innerHTML = originals.map((_, i) => `<button type="button" class="testimonial-dot" aria-label="Show testimonial ${i + 1}"></button>`).join('');
      dots.closest('.testimonial-controls').hidden = count < 2;
      setPaused(false);
      syncDots();
      dots.addEventListener('click', event => { const dot = event.target.closest('.testimonial-dot'); if (dot) goTo([...dots.children].indexOf(dot)); });
      document.querySelector('#testimonial-prev').addEventListener('click', () => goTo(current() - 1));
      document.querySelector('#testimonial-next').addEventListener('click', () => goTo(current() + 1));
      pause.addEventListener('click', () => setPaused(!paused));
      testimonialGrid.addEventListener('scroll', () => {
        // Follow manual swipes and smooth jumps; keep the position inside the first copy.
        if (Math.abs(testimonialGrid.scrollLeft - pos) > 2) {
          pos = testimonialGrid.scrollLeft;
          if (pos >= loop()) { pos = wrap(pos); testimonialGrid.scrollLeft = pos; }
          resumeAt = Math.max(resumeAt, performance.now() + 1500);
        }
        requestAnimationFrame(syncDots);
      }, {passive: true});
      testimonialGrid.addEventListener('keydown', event => { if (event.key === 'ArrowRight') goTo(current() + 1); if (event.key === 'ArrowLeft') goTo(current() - 1); });
      const carousel = testimonialGrid.closest('.testimonial-carousel');
      testimonialGrid.addEventListener('pointerenter', () => { holding = true; });
      testimonialGrid.addEventListener('pointerleave', () => { holding = false; });
      carousel.addEventListener('focusin', event => { holding = event.target !== pause; });
      carousel.addEventListener('focusout', () => { holding = testimonialGrid.matches(':hover'); });
      if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, {threshold: 0.1}).observe(carousel);
      requestAnimationFrame(tick);
    }
  }
  // Toolkit: filter by area or search, and pick a tool to see the projects behind it.
  const skillGroups = window.PORTFOLIO_SKILLS || [];
  const skillsRoot = document.querySelector('#skills-groups');
  if (skillsRoot && skillGroups.length) {
    const tabs = document.querySelector('#skills-tabs');
    const search = document.querySelector('#skills-search');
    const detail = document.querySelector('#skills-detail');
    const all = skillGroups.flatMap(group => group.items.map(item => ({...item, group: group.group})));
    const byId = Object.fromEntries(projects.map(project => [project.id, project]));
    let area = 'all', query = '', selected = all.reduce((best, item) => item.count > best.count ? item : best, all[0]).name;
    const core = all.filter(item => item.count >= 3).sort((a, b) => b.count - a.count);
    const chip = item => `<button type="button" class="skill-chip${item.count >= 3 ? ' is-core' : ''}" data-skill="${escape(item.name)}" aria-pressed="${item.name === selected}"><span>${escape(item.name)}</span><span class="skill-count" aria-label="used in ${item.count} ${item.count === 1 ? 'project' : 'projects'}">${item.count}</span></button>`;
    document.querySelector('#skills-stats').innerHTML = [[all.length, 'tools & technologies used'], [projects.length, 'projects they come from'], [core.length, 'core tools, each in 3+ projects']].map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');
    tabs.innerHTML = [['all', 'All'], ...skillGroups.map(group => [group.group, group.group])].map(([value, label]) => `<button type="button" class="skills-tab" data-area="${escape(value)}" aria-pressed="${value === 'all'}">${escape(label)}</button>`).join('');
    // Tools that appear in the same projects, strongest overlap first.
    function paired(item) {
      const scored = all.filter(other => other.name !== item.name).map(other => ({name: other.name, shared: other.projects.filter(id => item.projects.includes(id)).length, count: other.count})).filter(other => other.shared).sort((a, b) => b.shared - a.shared || b.count - a.count).slice(0, 5);
      return scored.length ? `<p class="skills-detail-label skills-paired-label">Often paired with</p><div class="skills-paired">${scored.map(other => `<button type="button" data-skill="${escape(other.name)}">${escape(other.name)}</button>`).join('')}</div>` : '';
    }
    function select(name) {
      selected = name;
      skillsRoot.querySelectorAll('[data-skill]').forEach(other => other.setAttribute('aria-pressed', String(other.dataset.skill === name)));
      showDetail();
    }
    function showDetail() {
      const item = all.find(skill => skill.name === selected);
      if (!item) { detail.innerHTML = ''; return; }
      detail.innerHTML = `<p class="skills-detail-label">${escape(item.group)}</p><h3>${escape(item.name)}</h3><p class="skills-detail-count">Used in <strong>${item.count}</strong> of ${projects.length} projects</p><ul>${item.projects.map(id => byId[id]).filter(Boolean).map(project => `<li><a href="work/${escape(project.id)}/"><span>${escape(categoryKey(project.category) === 'independent' ? 'Partnership' : project.category)}</span>${escape(project.title)}<i aria-hidden="true">↗</i></a></li>`).join('')}</ul>${paired(item)}`;
    }
    function renderSkills() {
      const needle = query.trim().toLowerCase();
      const html = skillGroups.filter(group => area === 'all' || group.group === area).map(group => {
        const items = group.items.filter(item => !needle || item.name.toLowerCase().includes(needle));
        if (!items.length) return '';
        return `<section class="skills-group"><h3>${escape(group.group)}<span>${String(items.length).padStart(2, '0')}</span></h3><div class="skills-chips">${items.map(chip).join('')}</div></section>`;
      }).join('');
      const coreRow = area === 'all' && !needle ? `<section class="skills-core"><h3>Core stack<span>Used in 3 or more projects</span></h3><div class="skills-chips">${core.map(chip).join('')}</div></section>` : '';
      skillsRoot.innerHTML = html ? coreRow + html : `<p class="skills-empty">No tool matches “${escape(query)}”.</p>`;
      showDetail();
    }
    tabs.addEventListener('click', event => {
      const button = event.target.closest('[data-area]');
      if (!button) return;
      area = button.dataset.area;
      tabs.querySelectorAll('[data-area]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
      renderSkills();
    });
    search.addEventListener('input', () => { query = search.value; renderSkills(); });
    skillsRoot.addEventListener('click', event => {
      const target = event.target.closest('[data-skill]');
      if (target) select(target.dataset.skill);
    });
    detail.addEventListener('click', event => {
      const target = event.target.closest('[data-skill]');
      if (target) select(target.dataset.skill);
    });
    // Hovering previews which projects a tool came from without changing the selection.
    skillsRoot.addEventListener('pointerover', event => {
      const hovered = event.target.closest('[data-skill]');
      const item = hovered && all.find(skill => skill.name === hovered.dataset.skill);
      skillsRoot.querySelectorAll('.skill-chip').forEach(other => {
        const shared = item && all.find(skill => skill.name === other.dataset.skill).projects.some(id => item.projects.includes(id));
        other.classList.toggle('is-related', Boolean(item && shared && other.dataset.skill !== item.name));
        other.classList.toggle('is-dimmed', Boolean(item && !shared));
      });
    });
    skillsRoot.addEventListener('pointerleave', () => skillsRoot.querySelectorAll('.skill-chip').forEach(chip => chip.classList.remove('is-related', 'is-dimmed')));
    renderSkills();
  }
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('is-visible'); observer.unobserve(entry.target);}}), {threshold: 0.08});
    document.querySelectorAll('.section-heading, .experience-row, .principle, .contact-title').forEach(element => {element.classList.add('reveal'); observer.observe(element);});
  }
})();
