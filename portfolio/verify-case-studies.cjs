const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {projects, details, render, skills, skillsScript, testimonials} = require('./build-case-studies.cjs');
const {assertPublicContent, assertPublicText, isClientWork} = require('./publication-policy.cjs');
const root = __dirname;
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Generated pages must be fresh, independently navigable, and public-safe.
for (const [index, project] of projects.entries()) {
  const file = path.join(root, 'work', project.id, 'index.html');
  assert.ok(fs.existsSync(file), `Missing page: ${project.id}`);
  const html = fs.readFileSync(file, 'utf8');
  assert.equal(html, render(project, index), `Rebuild stale case study: ${project.id}`);
  for (const id of ['main', 'case-title', 'overview', 'contribution', 'outcomes', 'boundaries']) {
    assert.ok(html.includes(`id="${id}"`), `${project.id}: missing ${id}`);
  }
  assert.ok(!/id="(?:architecture|decisions)"|SIMPLIFIED PUBLIC ARCHITECTURE|class="case-flow"/.test(html), 'Implementation walkthrough must not return');
  assertPublicText(html, project.id, {allowTools: isClientWork(project)});
  if (isClientWork(project)) for (const id of ['numbers', 'tools']) assert.ok(html.includes(`id="${id}"`), `${project.id}: client work needs ${id}`);
  assert.equal(fs.readFileSync(path.join(root,'dist','work',project.id,'index.html'),'utf8'),html, 'Published page differs from approved source');
  assert.ok(!/<dialog\b|showModal\(|Resources\/|MASTER_PROJECT_|Master_Project_|\.md["<]/.test(html), 'Raw sources or modal leaked');
  assert.ok(!/amplifyapp\.com|arn:aws:|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]+|sk-proj-[A-Za-z0-9]+/.test(html), 'Private identifier or credential-like value in output');
  // Follow local links exactly as a static host would, including deep links.
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^https?:/.test(value)) continue;
    const [resource, fragment] = value.split('#');
    const local = resource.split('?')[0];
    let target = local ? path.resolve(path.dirname(file), local) : file;
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert.ok(fs.existsSync(target), `${project.id}: broken local URL ${value}`);
    if (fragment) assert.ok(fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`), `${project.id}: missing anchor ${value}`);
  }
}

// A title containing markup must remain text, including in meta attributes.
const hostileTitle = '<img src=x onerror="alert(1)">';
const escaped = render({...projects[0], title:hostileTitle}, 0);
assert.ok(!escaped.includes(hostileTitle));
assert.ok(escaped.includes('&lt;img'));
assert.ok(!home.includes('<dialog'));

function runHome(search = '') {
  const elements = new Map();
  const element = () => ({innerHTML:'', textContent:'', dataset:{}, handlers:{}, classList:{add(){}, toggle(){}}, setAttribute(k,v){this[k]=v;}, addEventListener(k,v){this.handlers[k]=v;}});
  for (const key of ['#projects', '#project-count', '#year']) elements.set(key, element());
  const buttons = ['all', 'relecura', 'maxval', 'independent'].map(filter => Object.assign(element(), {dataset:{filter}}));
  const links = [...home.matchAll(/data-evidence="([^"]+)"/g)].map(match => Object.assign(element(), {dataset:{evidence:match[1]}}));
  const location = {search, href:`http://localhost:3000/${search}#work`};
  const context = {
    window:{location}, URL, URLSearchParams, Date,
    history:{replaceState(state,title,url){location.href=String(url); location.search=new URL(url).search;}},
    document:{querySelector:s=>elements.get(s), querySelectorAll:s=>s==='[data-filter]'?buttons:s==='[data-evidence]'?links:[]}
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'content.js'),'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'), context);
  return {elements, buttons, links, location};
}

const ui = runHome();
const allWork = ui.elements.get('#projects').innerHTML;
assert.ok(allWork.indexOf('id="work-group-independent"') < allWork.indexOf('id="work-group-relecura"'), 'Client work should be visible first, including on mobile');
assert.ok(allWork.indexOf('id="work-group-relecura"') < allWork.indexOf('id="work-group-maxval"'), 'MaxVal should remain its own experience group');
assert.equal([...allWork.matchAll(/<section class="work-group /g)].length,3,'All three work contexts should be visible without filtering');
assert.equal([...allWork.matchAll(/project-card-link work-group-lead/g)].length,2,'Client work and Relecura need equal featured-card treatment');
assert.ok(!allWork.includes('project-featured'),'Do not feature only the first Relecura project');
const allDestinations = [...allWork.matchAll(/href="work\/([^/]+)\/"/g)].map(match=>match[1]);
assert.equal(new Set(allDestinations).size,7,'Every work overview should appear once');
for (const [index, count] of [[0,7],[1,3],[2,1],[3,3]]) {
  ui.buttons[index].handlers.click();
  assert.equal(ui.elements.get('#project-count').textContent, `${String(count).padStart(2,'0')} CASE STUDIES`);
  assert.equal(ui.buttons[index]['aria-pressed'], 'true');
  const markup = ui.elements.get('#projects').innerHTML;
  assert.equal([...markup.matchAll(/<section class="work-group /g)].length,index===0?3:1,'Filters should retain the matching context heading');
  assert.equal([...markup.matchAll(/class="project-card project-card-link/g)].length, count);
  assert.ok(!markup.includes('<button'), 'Nested controls inside project links');
  for (const [, id] of markup.matchAll(/href="work\/([^/]+)\/"/g)) assert.ok(fs.existsSync(path.join(root,'work',id,'index.html')));
}
for (const link of ui.links) {
  link.handlers.click();
  assert.notEqual(ui.elements.get('#project-count').textContent, '00 CASE STUDIES');
}
assert.equal(runHome('?category=relecura').elements.get('#project-count').textContent, '03 CASE STUDIES');
assert.equal(runHome('?category=maxval').elements.get('#project-count').textContent, '01 CASE STUDIES');
assert.equal(runHome('?category=independent').elements.get('#project-count').textContent, '03 CASE STUDIES');
assert.equal(runHome('?category=invalid').elements.get('#project-count').textContent, '07 CASE STUDIES');

const css = fs.readFileSync(path.join(root,'styles.css'),'utf8');
assert.ok(!/#(?:000|000000)(?:[0-9a-f]{1,2})?\b|\b(?:color|background|border-color)\s*:\s*black\b|var\(--black\)/i.test(css), 'Pure-black styling must not return');
for (const [, value] of css.matchAll(/#([0-9a-f]{3,8})\b/gi)) {
  const rgb = value.length < 5 ? value.slice(0,3).split('') : value.slice(0,6).match(/../g);
  assert.ok(rgb.every(channel => channel === rgb[0]), `Nonneutral color ${value}`);
}
assertPublicContent(projects, details);
assert.equal(fs.readFileSync(path.join(root,'skills.js'),'utf8'), skillsScript(), 'Rebuild stale skills overview');
assert.equal(fs.readFileSync(path.join(root,'dist','skills.js'),'utf8'), skillsScript(), 'Published skills differ from source');
assert.ok(skills.every(group => group.items.every(item => item.count === item.projects.length && item.projects.every(id => projects.some(project => project.id === id)))), 'Every skill comes from a public project');
assert.ok(home.includes('id="skills"') && home.includes('src="skills.js'), 'Homepage skills overview is wired up');
assertPublicText(home, 'homepage');
assertPublicText(fs.readFileSync(path.join(root,'testimonials.js'),'utf8'), 'testimonials');
assert.ok(home.includes('id="testimonials"') && home.includes('src="testimonials.js'), 'Homepage testimonials are wired up');
assert.ok(testimonials.every(item => !item.sample || /^Sample feedback:/.test(item.quote)), 'Sample testimonials must say so in their text');
assertPublicText(fs.readFileSync(path.join(root,'app.js'),'utf8'), 'homepage renderer');
assert.throws(() => assertPublicContent([{...projects[0], approach:'implementation detail'}], details));
assert.throws(() => assertPublicContent(projects, {...details, [projects[0].id]:{...details[projects[0].id], architecture:'implementation detail'}}));
assert.throws(() => assertPublicText('BM25 combined with reciprocal rank fusion'));
assert.throws(() => assertPublicText('virtual-key routing policy'));
assert.throws(() => assertPublicText('Qdrant'), 'Provider names stay off employer and homepage copy');
assert.throws(() => assertPublicContent(projects, {...details, 'ai-gateway':{...details['ai-gateway'], tools:[{group:'AI', items:['Bedrock']}]}}));
assert.ok(projects.find(project=>project.id==='ai-gateway').stack.includes('LiteLLM'));
assert.ok(projects.find(project=>project.id==='citation-intelligence').stack.includes('Vision-Language Models'));
const published = fs.readdirSync(path.join(root,'dist'), {recursive:true,withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>path.relative(path.join(root,'dist'),path.join(entry.parentPath,entry.name)).replaceAll(path.sep,'/'));
const allowed = new Set(['.portfolio-generated','index.html','styles.css','app.js','content.js','skills.js','testimonials.js',...testimonials.map(item=>item.photo).filter(Boolean),'journey.js','smooth-scroll.js','case-study.js','favicon.svg','assets/profile.png','assets/signature.png','vendor/lenis.min.js','vendor/lenis.css','vendor/LENIS-LICENSE',...projects.map(project=>`work/${project.id}/index.html`)]);
allowed.add('weekend-builds/index.html');
assert.deepEqual(new Set(published),allowed,'Unexpected or missing file in publication artifact');
const weekends = fs.readFileSync(path.join(root,'weekend-builds/index.html'),'utf8');
assert.equal(fs.readFileSync(path.join(root,'dist/weekend-builds/index.html'),'utf8'),weekends);
assert.ok(home.includes('href="weekend-builds/"'), 'Side projects must be reachable from navigation');
assert.ok(!home.includes('id="diffstory-title"'), 'Side projects belong on their own page');
assert.ok(weekends.includes('https://github.com/yuvraaj2002/DiffStory'));
for (const [,value] of weekends.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (/^https?:/.test(value)) continue;
  const [resource,fragment] = value.split('#');
  let target = resource ? path.resolve(root,'weekend-builds',resource.split('?')[0]) : path.join(root,'weekend-builds/index.html');
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target,'index.html');
  assert.ok(fs.existsSync(target), `Broken weekend URL: ${value}`);
  if (fragment) assert.ok(fs.readFileSync(target,'utf8').includes(`id="${fragment}"`));
}
for(const file of ['index.html','app.js','content.js']) assertPublicText(fs.readFileSync(path.join(root,'dist',file),'utf8'),file);
console.log('PASS: 7 minimal public overviews; client tools and numbers; skills overview; testimonials; no implementation fields or walkthroughs; reviewed keywords; publication allowlist; 4 filters; links; escaped copy; grayscale styling.');
