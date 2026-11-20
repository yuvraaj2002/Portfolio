const fs = require('node:fs');
const path = require('node:path');
const {marked} = require('marked');

const postsRoot = path.join(__dirname, '..', 'engineering-blogs', 'posts');
const blogsOut = path.join(__dirname, 'blogs');

const seriesLabels = {
  'ai-security-guardrails': 'AI Security & Guardrails',
};

const seriesDirs = {
  'ai-security-guardrails': 'ai-security',
};

const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[c]));

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return {meta: {}, body: raw};
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return {meta, body: match[2]};
}

function walkMarkdown(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(absolute, files);
    else if (entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md') {
      files.push(absolute);
    }
  }
  return files;
}

function readingMinutes(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return {
    iso,
    label: new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'}).format(date),
  };
}

function postNumber(filename) {
  const match = path.basename(filename).match(/^(\d+)/);
  return match ? match[1] : null;
}

function configureMarked() {
  const renderer = new marked.Renderer();
  renderer.image = ({href, text}) => {
    const src = escape(href || '');
    const alt = escape(text || '');
    return `<figure class="post-figure"><img src="${src}" alt="${alt}" loading="lazy"></figure>`;
  };
  renderer.code = ({text, lang}) => {
    const language = lang ? ` language-${escape(lang)}` : '';
    return `<pre class="post-code"><code class="${language.trim()}">${escape(text)}</code></pre>`;
  };
  marked.setOptions({renderer, gfm: true, breaks: false});
}

function loadSeriesPlan(seriesSlug) {
  const dirName = seriesDirs[seriesSlug];
  if (!dirName) return [];
  const readme = path.join(postsRoot, dirName, 'README.md');
  if (!fs.existsSync(readme)) return [];
  return fs.readFileSync(readme, 'utf8').split(/\r?\n/)
    .map(line => {
      const match = line.match(/^\d+\.\s+\[([ xX])\]\s+(.+)$/);
      if (!match) return null;
      return {done: match[1].toLowerCase() === 'x', title: match[2].trim()};
    })
    .filter(Boolean);
}

function enrichSeries(posts) {
  const bySeries = new Map();
  for (const post of posts) {
    if (!post.seriesSlug) continue;
    if (!bySeries.has(post.seriesSlug)) bySeries.set(post.seriesSlug, []);
    bySeries.get(post.seriesSlug).push(post);
  }
  for (const [seriesSlug, group] of bySeries) {
    group.sort((a, b) => Number(a.number || 0) - Number(b.number || 0));
    const plan = loadSeriesPlan(seriesSlug);
    group.forEach((post, index) => {
      post.seriesLabel = seriesLabels[seriesSlug] || seriesSlug;
      post.seriesPlan = plan;
      post.prevPost = index > 0 ? group[index - 1] : null;
      post.nextPost = index < group.length - 1 ? group[index + 1] : null;
      const planIndex = plan.findIndex(item => item.title === post.title);
      post.nextPlanned = planIndex >= 0
        ? plan.slice(planIndex + 1).find(item => !item.done)
        : plan.find(item => !item.done);
    });
  }
  return posts;
}

function renderFooter(post) {
  if (post.nextPost) {
    return `<a class="case-next" href="../${escape(post.nextPost.slug)}/">
          <span class="section-label">NEXT IN SERIES · ${escape((post.seriesLabel || 'Writing').toUpperCase())}</span>
          <span class="case-next-title">${escape(post.nextPost.title)}</span>
          <span class="case-next-arrow" aria-hidden="true">↗</span>
        </a>`;
  }
  if (post.nextPlanned) {
    return `<div class="case-next post-next-planned" role="note">
          <span class="section-label">UP NEXT IN SERIES · ${escape((post.seriesLabel || 'Writing').toUpperCase())}</span>
          <span class="case-next-title">${escape(post.nextPlanned.title)}</span>
          <p class="post-next-note">In progress. <a href="../#series">See the full series →</a></p>
        </div>`;
  }
  return `<a class="case-next" href="../">
          <span class="section-label">MORE WRITING</span>
          <span class="case-next-title">Back to the reading room</span>
          <span class="case-next-arrow" aria-hidden="true">↗</span>
        </a>`;
}

function renderPostPage(post) {
  const series = post.seriesLabel || seriesLabels[post.seriesSlug] || post.seriesSlug || 'Writing';
  const number = post.number ? ` · Post ${post.number}` : '';
  const tags = post.tags.length ? post.tags.join(', ') : '';
  const dateMarkup = post.date
    ? `<time datetime="${escape(post.date.iso)}">${escape(post.date.label)}</time>`
    : '';
  const metaBits = [
    dateMarkup,
    `<span>${escape(String(post.minutes))} min read</span>`,
    tags ? `<span>${escape(tags)}</span>` : '',
  ].filter(Boolean).join('<span>·</span>');
  const prevLink = post.prevPost
    ? `<a href="../${escape(post.prevPost.slug)}/">← ${escape(post.prevPost.title)}</a>`
    : `<a href="../">← Writing</a>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content="${escape(post.subtitle || post.title)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escape(post.title)} — Yuvraj Singh">
  <meta property="og:description" content="${escape(post.subtitle || post.title)}">
  ${post.cover ? `<meta property="og:image" content="${escape(post.cover)}">` : ''}
  <title>${escape(post.title)} — Yuvraj Singh</title>
  <link rel="icon" href="../../favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../../styles.css?v=writing-1">
  <link rel="stylesheet" href="../../vendor/lenis.css">
  <script src="../../vendor/lenis.min.js" defer></script>
  <script src="../../smooth-scroll.js" defer></script>
  <script src="../../nav.js" defer></script>
</head>
<body class="case-page post-page">
  <a class="skip-link" href="#main">Skip to article</a>
  <header class="site-header"><nav class="nav-shell" aria-label="Main navigation"><a class="wordmark" href="../../">Yuvraj Singh.</a><div class="nav-links"><a href="../../#work">Work</a><a href="../../weekend-builds/">Side projects</a><a href="../" aria-current="page">Writing</a><a href="https://drive.google.com/drive/folders/1nn5lLW_3h1EwfIEO0q5XM7mNQE1rlnuR?usp=sharing" target="_blank" rel="noopener noreferrer">Resume ↗<span class="sr-only"> (opens in a new tab)</span></a></div></nav></header>
  <main id="main">
    <article>
      <header class="case-hero case-shell post-hero" aria-labelledby="post-title">
        <a class="case-back" href="../">← Writing</a>
        <p class="section-label">${escape(series.toUpperCase())}${escape(number.toUpperCase())}</p>
        <h1 id="post-title">${escape(post.title)}</h1>
        ${post.subtitle ? `<p class="case-summary">${escape(post.subtitle)}</p>` : ''}
        <p class="post-meta">${metaBits}</p>
      </header>
      <div class="case-shell post-body">
${post.html}
      </div>
      <div class="case-shell post-footer">
        ${renderFooter(post)}
        <div class="case-bottom">
          ${prevLink}
          <a href="../#series">All series posts</a>
        </div>
      </div>
    </article>
  </main>
  <footer class="footer"><a class="wordmark" href="../../">Yuvraj Singh.</a><p>Written in public. © <span id="year">2026</span></p><a href="#main">Back to top ↑</a></footer>
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;
}

function loadPosts() {
  configureMarked();
  const posts = walkMarkdown(postsRoot).map(file => {
    const raw = fs.readFileSync(file, 'utf8');
    const {meta, body} = parseFrontmatter(raw);
    const draft = String(meta.saveAsDraft || '').toLowerCase() === 'true';
    const slug = meta.slug || path.basename(file, '.md').replace(/^\d+-/, '');
    const tags = (meta.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
    return {
      file,
      draft,
      slug,
      title: meta.title || slug,
      subtitle: meta.subtitle || '',
      tags,
      seriesSlug: meta.seriesSlug || '',
      cover: meta.cover || '',
      date: formatDate(meta.date),
      number: postNumber(file),
      minutes: readingMinutes(body),
      html: String(marked.parse(body.trim())).replace(/<p>\s*(<figure[\s\S]*?<\/figure>)\s*<\/p>/g, '$1'),
      imagesDir: path.join(path.dirname(file), 'images'),
    };
  }).filter(post => !post.draft && post.slug);
  return enrichSeries(posts);
}

function emptyGeneratedPosts() {
  if (!fs.existsSync(blogsOut)) return;
  for (const entry of fs.readdirSync(blogsOut, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;
    fs.rmSync(path.join(blogsOut, entry.name), {recursive: true, force: true});
  }
}

function copyImages(sourceDir, destinationDir) {
  if (!fs.existsSync(sourceDir)) return;
  fs.mkdirSync(destinationDir, {recursive: true});
  for (const entry of fs.readdirSync(sourceDir, {withFileTypes: true})) {
    if (!entry.isFile()) continue;
    fs.copyFileSync(path.join(sourceDir, entry.name), path.join(destinationDir, entry.name));
  }
}

function buildBlogs() {
  if (!fs.existsSync(postsRoot)) {
    console.warn('No engineering-blogs/posts directory found; keeping existing generated blog pages.');
    return collectExistingPosts();
  }
  const posts = loadPosts();
  emptyGeneratedPosts();
  for (const post of posts) {
    const outDir = path.join(blogsOut, post.slug);
    fs.mkdirSync(outDir, {recursive: true});
    fs.writeFileSync(path.join(outDir, 'index.html'), renderPostPage(post));
    copyImages(post.imagesDir, path.join(outDir, 'images'));
  }
  console.log(`Built ${posts.length} blog post(s) from engineering-blogs markdown.`);
  return posts;
}

function collectExistingPosts() {
  if (!fs.existsSync(blogsOut)) return [];
  return fs.readdirSync(blogsOut, {withFileTypes: true})
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(blogsOut, entry.name, 'index.html')))
    .map(entry => ({slug: entry.name}));
}

module.exports = {buildBlogs, loadPosts, loadSeriesPlan};
if (require.main === module) buildBlogs();
