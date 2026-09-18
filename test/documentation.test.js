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

  for (const commandPattern of [
    /npm start/i,
    /npm test/i
  ]) {
    assert.match(readme, commandPattern);
  }

  for (const apiPattern of [
    /get `?\/api\/health`?/i,
    /get `?\/api\/packages`?/i,
    /get `?\/api\/testimonials`?/i,
    /get `?\/api\/social-links`?/i,
    /get `?\/api\/customers`?/i,
    /post `?\/api\/customers`?/i,
    /get `?\/api\/bookings`?/i,
    /post `?\/api\/bookings`?/i,
    /patch `?\/api\/bookings\/:id`?/i,
    /get `?\/api\/rooms`?/i,
    /patch `?\/api\/rooms\/:id`?/i,
    /get `?\/api\/services`?/i,
    /post `?\/api\/incidents`?/i
  ]) {
    assert.match(readme, apiPattern);
  }

  for (const topicPattern of [
    /(itinerary|reisschema)/i,
    /(accommodation|verblijf|riad)/i,
    /(historical site|historical sites|historische|plekken)/i,
    /(guide|gids)/i,
    /(weather|season|seizoen)/i,
    /(currency|kosten|budget|mad|eur)/i,
    /(cultural|cultuur|voorbereiding)/i
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

  for (const architecturePattern of [/(course2go|creator)/, /(reisdossier|itinerary|booking)/, /(api|endpoint)/]) {
    assert.match(architecture, architecturePattern);
  }
  for (const linkedDoc of ['README.md', 'DEVELOPMENT.md', 'DEPLOYMENT.md']) {
    assert.match(architecture, markdownLinkPattern(linkedDoc));
  }
  for (const developmentPattern of [/(zuid-marokko|travel south morocco)/, /(testen|node:test|npm test)/]) {
    assert.match(development, developmentPattern);
  }
  for (const linkedDoc of ['README.md', 'ARCHITECTURE.md', 'DEPLOYMENT.md']) {
    assert.match(development, markdownLinkPattern(linkedDoc));
  }
  assert.match(deployment, /(productie|deployment|hosting)/);
  for (const linkedDoc of ['README.md', 'ARCHITECTURE.md', 'DEVELOPMENT.md']) {
    assert.match(deployment, markdownLinkPattern(linkedDoc));
  }
  assert.match(deployment, /(course2go|workspace-gedreven architectuur)/);
  assert.match(deployment, /(security|beveiliging)/);
});
