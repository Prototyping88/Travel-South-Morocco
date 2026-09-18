const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function normalize(text) {
  return text.toLowerCase();
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function markdownLinkPattern(file) {
  return new RegExp(`\\]\\(\\./${escapeRegex(file)}\\)`, 'i');
}

test('documentation deliverables exist at repository root', () => {
  for (const file of ['README.md', 'ARCHITECTURE.md', 'DEVELOPMENT.md', 'DEPLOYMENT.md']) {
    assert.ok(fs.existsSync(path.join(ROOT, file)), `${file} should exist`);
  }
});

test('README describes the South Morocco travel-planning focus and linked docs', () => {
  const readme = normalize(read('README.md'));

  for (const commandOrEndpointPattern of [
    /npm start/i,
    /npm test/i,
    /\/api\/health/i,
    /\/api\/packages/i,
    /\/api\/testimonials/i,
    /\/api\/social-links/i,
    /\/api\/customers/i,
    /\/api\/bookings/i,
    /\/api\/rooms/i,
    /\/api\/services/i,
    /\/api\/incidents/i
  ]) {
    assert.match(readme, commandOrEndpointPattern);
  }

  for (const topicPattern of [
    /(itinerary|reisschema)/,
    /(accommodation|verblijf|riad)/,
    /(historical site|historical sites|historische|plekken)/,
    /(guide|gids)/,
    /(weather|season|seizoen)/,
    /(currency|kosten|budget|mad|eur)/,
    /(cultural|cultuur|voorbereiding)/
  ]) {
    assert.match(readme, topicPattern);
  }

  for (const linkedDoc of ['ARCHITECTURE.md', 'DEVELOPMENT.md', 'DEPLOYMENT.md']) {
    assert.match(readme, markdownLinkPattern(linkedDoc));
  }
});

test('architecture and developer docs retain Course2Go translation context', () => {
  const architecture = normalize(read('ARCHITECTURE.md'));
  const development = normalize(read('DEVELOPMENT.md'));
  const deployment = normalize(read('DEPLOYMENT.md'));

  assert.ok(architecture.includes('course2go'));
  assert.ok(architecture.includes('reisdossier'));
  for (const linkedDoc of ['DEVELOPMENT.md', 'DEPLOYMENT.md']) {
    assert.match(architecture, markdownLinkPattern(linkedDoc));
  }
  assert.ok(architecture.includes('api'));
  assert.ok(development.includes('zuid-marokko'));
  for (const linkedDoc of ['README.md', 'ARCHITECTURE.md']) {
    assert.match(development, markdownLinkPattern(linkedDoc));
  }
  assert.ok(development.includes('testen'));
  assert.ok(deployment.includes('productie'));
  for (const linkedDoc of ['README.md', 'ARCHITECTURE.md']) {
    assert.match(deployment, markdownLinkPattern(linkedDoc));
  }
  assert.match(deployment, /(security|beveiliging)/);
});
