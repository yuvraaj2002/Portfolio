const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Check both source payloads and generated copy. A warning or hidden section
// must never substitute for removing a proprietary explanation.
const prohibited = /\b(?:BM25|RRF|RapidOCR|HMAC|nonce|xref)\b|reciprocal rank fusion|selective OCR|page offsets|virtual.keys?|pre.signed|health\/liveliness|store_prompts|arn:aws:|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]+|sk-proj-[A-Za-z0-9]+/i;
// Vendor and provider names stay off the homepage and employer overviews.
// Independent client pages may name the tools used to build them.
const providerNames = /\b(?:Gemini|Claude|Bedrock|ECS|ECR|PostgreSQL|Qdrant|ChromaDB|PyMuPDF)\b/i;
const approvedKeywords = new Set(['Generative AI','Patent Intelligence','Explainability','Vision-Language Models','Document AI','PDF Processing','LiteLLM','AI Platform','Cloud Engineering','Machine Learning','IP Automation','Voice AI','Workflow Automation','Full-Stack','RAG','Document Automation','Human Review','Multimodal AI','Multilingual','Product Discovery','FastAPI','React','Next.js','Django']);

// Private hostnames and organization names live in a gitignored local file so
// the guard itself never publishes them. One case-insensitive substring per line.
const privateIdentifiers = (() => {
  try { return fs.readFileSync(path.join(__dirname, 'private-identifiers.local.txt'), 'utf8').split('\n').map(line => line.trim().toLowerCase()).filter(line => line && !line.startsWith('#')); }
  catch { return []; }
})();

function assertPublicText(text, label = 'public content', {allowTools = false} = {}) {
  assert.ok(!prohibited.test(text), `Review restricted implementation detail in ${label}`);
  const lower = text.toLowerCase();
  assert.ok(!privateIdentifiers.some(identifier => lower.includes(identifier)), `Private identifier in ${label}`);
  if (!allowTools) assert.ok(!providerNames.test(text), `Review restricted provider name in ${label}`);
}

const isClientWork = project => project.category === 'Product Partnerships';

function assertToolsAndNumbers(detail, id) {
  if (detail.tools !== undefined) {
    assert.ok(Array.isArray(detail.tools) && detail.tools.length <= 6, `Tool groups: ${id}`);
    for (const group of detail.tools) assert.ok(Object.keys(group).join() === 'group,items' && typeof group.group === 'string' && Array.isArray(group.items) && group.items.length && group.items.every(item => typeof item === 'string' && item.length <= 40), `Tool group shape: ${id}`);
  }
  if (detail.numbers !== undefined) {
    assert.ok(Array.isArray(detail.numbers) && detail.numbers.length <= 4, `Headline numbers: ${id}`);
    for (const stat of detail.numbers) assert.ok(Object.keys(stat).join() === 'value,label' && /^[\d.,]+[+%kKxX]?$/.test(stat.value) && typeof stat.label === 'string', `Number shape: ${id}`);
  }
}

function assertPublicContent(projects, details) {
  const projectFields = new Set(['id','category','eyebrow','title','summary','stack']);
  const detailFields = new Set(['role','scope','focus','lead','overview','ownership','numbers','tools','outcomes']);
  for (const project of projects) {
    assert.ok(Object.keys(project).every(key => projectFields.has(key)), `Unexpected public project field: ${project.id}`);
    const detail = details[project.id];
    assert.ok(detail, `Missing overview: ${project.id}`);
    assert.ok(Object.keys(detail).every(key => detailFields.has(key)), `Implementation field in ${project.id}`);
    assert.ok(project.stack.length <= 3 && project.stack.every(tag => approvedKeywords.has(tag)), `Unreviewed keywords: ${project.id}`);
    assertToolsAndNumbers(detail, project.id);
    assertPublicText(JSON.stringify(project), `${project.id} card`);
    assertPublicText(JSON.stringify(detail), project.id, {allowTools: isClientWork(project)});
  }
}

module.exports = {assertPublicText, assertPublicContent, isClientWork};
