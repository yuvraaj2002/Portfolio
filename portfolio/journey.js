(() => {
  const experience = document.querySelector('#experience');
  const work = document.querySelector('#work');
  const testimonials = document.querySelector('#testimonials');
  const skills = document.querySelector('#skills');
  const about = document.querySelector('#about');
  const github = document.querySelector('#github');
  if (!experience || !work) return;
  // Experience establishes the context; case studies provide the evidence.
  work.before(experience);
  const story = document.createElement('div');
  story.className = 'story';
  experience.before(story);
  const svgNS = 'http://www.w3.org/2000/svg';
  story.innerHTML = `<div class="story-rail" aria-hidden="true"><svg class="story-thread"><polyline class="thread-base"/><polyline class="thread-progress"/><g class="thread-nodes"></g><circle class="thread-head" r="4"/></svg></div>`;
  story.append(...[experience, work, skills, about, testimonials, github].filter(Boolean));
  const svg = story.querySelector('.story-thread');
  const base = svg.querySelector('.thread-base');
  const trail = svg.querySelector('.thread-progress');
  const nodeLayer = svg.querySelector('.thread-nodes');
  const head = svg.querySelector('.thread-head');
  const graph = github && github.querySelector('.github-activity');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let points = [], lengths = [], total = 0, extraNodes = [], dirty = true, pending = false;

  // Major components the thread must pass through, top to bottom.
  // `dot: true` draws a node for elements that have no marker of their own.
  function anchors(origin) {
    const center = el => { const r = el.getBoundingClientRect(); return {x: r.left + r.width / 2 - origin.left, y: r.top + r.height / 2 - origin.top}; };
    const atLane = (el, lane, dot) => el && {x: lane, y: center(el).y, dot};
    const markers = [...story.querySelectorAll('.journey-marker')].map(center);
    const lane = markers.length ? markers[0].x : 27;
    const heading = work.querySelector('#work-heading');
    let workDot = null;
    if (heading) {
      // The work heading's node is a pseudo-element, so locate it from its computed box.
      const cs = getComputedStyle(heading, '::before');
      const r = heading.getBoundingClientRect();
      const size = parseFloat(cs.width) || 13;
      workDot = {x: r.left + parseFloat(cs.left) + size / 2 - origin.left, y: r.top + parseFloat(cs.top) + size / 2 - origin.top};
    }
    const grid = work.querySelector('#projects');
    const gridEnd = grid && grid.offsetHeight && {x: lane, y: grid.getBoundingClientRect().bottom - origin.top - 40, dot: true};
    const nodes = [
      atLane(experience.querySelector('.section-label'), lane, true),
      ...markers,
      atLane(experience.querySelector('.handoff-title'), lane, true),
      workDot,
      atLane(work.querySelector('.work-toolbar'), lane, true),
      gridEnd,
      testimonials && atLane(testimonials.querySelector('.section-label'), lane, true),
      skills && atLane(skills.querySelector('.section-label'), lane, true),
      about && atLane(about.querySelector('.section-label'), lane, true),
      github && atLane(github.querySelector('.section-label'), lane, true)
    ].filter(Boolean).sort((a, b) => a.y - b.y);
    // The thread ends by turning into the contribution graph and merging with it.
    const chart = github && github.querySelector('.github-chart-scroll');
    if (chart && chart.offsetHeight) {
      const r = chart.getBoundingClientRect();
      const y = r.top + r.height / 2 - origin.top;
      nodes.push({x: lane, y}, {x: r.left - origin.left, y, merge: true});
    }
    return nodes;
  }

  // Zigzag between consecutive anchors: the thread swings out to a second lane
  // and back, always landing exactly on each anchor.
  function layout() {
    dirty = false;
    const origin = story.getBoundingClientRect();
    svg.setAttribute('width', origin.width);
    svg.setAttribute('height', origin.height);
    const nodes = anchors(origin);
    const gutter = parseFloat(getComputedStyle(experience).paddingLeft) || 90;
    points = [];
    nodes.forEach((node, i) => {
      if (i && !node.merge) {
        const prev = nodes[i - 1];
        const amp = Math.max(10, (gutter - Math.max(prev.x, node.x)) * 0.6);
        const steps = Math.max(2, Math.round((node.y - prev.y) / 150 / 2) * 2);
        for (let s = 1; s < steps; s++) {
          const t = s / steps;
          points.push({x: prev.x + (node.x - prev.x) * t + (s % 2 ? amp : 0), y: prev.y + (node.y - prev.y) * t});
        }
      }
      points.push({x: node.x, y: node.y, merge: node.merge});
    });
    lengths = [0];
    for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
    total = lengths[lengths.length - 1] || 0;
    const attr = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    base.setAttribute('points', attr);
    trail.setAttribute('points', attr);
    trail.style.strokeDasharray = total;
    nodeLayer.replaceChildren();
    extraNodes = nodes.filter(n => n.dot).map(n => {
      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('class', 'thread-node');
      c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', 5);
      nodeLayer.append(c);
      return {el: c, y: n.y};
    });
  }

  function update() {
    pending = false;
    if (dirty) layout();
    if (points.length < 2) return;
    const origin = story.getBoundingClientRect();
    const reachY = motion.matches ? Infinity : innerHeight * 0.58 - origin.top;
    // Find where the thread crosses the reading line and draw up to that point.
    let i = 1;
    while (i < points.length - 1 && (points[i].y < reachY || (points[i + 1].merge && points[i].y <= reachY))) i++;
    const a = points[i - 1], b = points[i];
    // A horizontal run (the merge into the graph) draws across the next 120px of scroll.
    const t = Math.max(0, Math.min(1, (reachY - a.y) / (b.y - a.y || 120)));
    const drawn = reachY <= points[0].y ? 0 : lengths[i - 1] + (lengths[i] - lengths[i - 1]) * t;
    trail.style.strokeDashoffset = total - drawn;
    head.setAttribute('cx', a.x + (b.x - a.x) * t);
    head.setAttribute('cy', a.y + (b.y - a.y) * t);
    head.style.opacity = drawn > 0 && drawn < total ? 1 : 0;
    if (graph) graph.classList.toggle('is-merged', points[points.length - 1].merge && drawn >= total - 0.5);
    extraNodes.forEach(n => n.el.classList.toggle('is-reached', n.y <= reachY));
    const stages = [...story.querySelectorAll('.journey-step, #work-heading')];
    stages.forEach(stage => stage.classList.toggle('is-reached', stage.getBoundingClientRect().top < innerHeight * 0.65));
  }
  const schedule = () => { if (!pending) {pending = true; requestAnimationFrame(update);} };
  const relayout = () => { dirty = true; schedule(); };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', relayout);
  motion.addEventListener('change', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(story);
  if (document.fonts) document.fonts.ready.then(relayout);
  update();
})();
