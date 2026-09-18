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

test('documentation deliverables exist at repository root', () => {
  for (const file of ['README.md', 'ARCHITECTURE.md', 'DEVELOPMENT.md', 'DEPLOYMENT.md']) {
    assert.ok(fs.existsSync(path.join(ROOT, file)), `${file} should exist`);
  }
});

test('README describes the South Morocco travel-planning focus and linked docs', () => {
  const readme = normalize(read('README.md'));

  for (const marker of [
    'projectoverzicht',
    'architectuur',
    'projectstructuur',
    'setup',
    'deployment',
    'use cases',
    'api',
    'credits'
  ]) {
    assert.ok(readme.includes(marker), `README should contain marker: ${marker}`);
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

  assert.ok(readme.includes('architecture.md'));
  assert.ok(readme.includes('development.md'));
  assert.ok(readme.includes('deployment.md'));
});

test('architecture and developer docs retain Course2Go translation context', () => {
  const architecture = normalize(read('ARCHITECTURE.md'));
  const development = normalize(read('DEVELOPMENT.md'));
  const deployment = normalize(read('DEPLOYMENT.md'));

  assert.ok(architecture.includes('course2go'));
  assert.ok(architecture.includes('reisdossier'));
  assert.ok(architecture.includes('development.md'));
  assert.ok(architecture.includes('deployment.md'));
  assert.ok(architecture.includes('api'));
  assert.ok(development.includes('zuid-marokko'));
  assert.ok(development.includes('readme.md'));
  assert.ok(development.includes('architecture.md'));
  assert.ok(development.includes('testen'));
  assert.ok(deployment.includes('productie'));
  assert.ok(deployment.includes('readme.md'));
  assert.ok(deployment.includes('architecture.md'));
  assert.match(deployment, /(security|beveiliging)/);
});
