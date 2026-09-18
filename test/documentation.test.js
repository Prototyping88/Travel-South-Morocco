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
    assert.equal(fs.existsSync(path.join(ROOT, file)), true, `${file} should exist`);
  }
});

test('README describes the South Morocco travel-planning focus and linked docs', () => {
  const readme = normalize(read('README.md'));

  for (const heading of [
    '## projectoverzicht',
    '## technische stack en architectuur-analyse',
    '## projectstructuur met annotaties',
    '## setup & deployment instructies',
    '## kernfeatures en use cases',
    '## api / integratie-overzicht',
    '## developmentworkflow',
    '## credits'
  ]) {
    assert.ok(readme.includes(heading), `README should contain heading: ${heading}`);
  }

  for (const topic of [
    'itinerary',
    'accommodation',
    'historical site',
    'guide',
    'seasonal',
    'currency',
    'cultural'
  ]) {
    assert.ok(readme.includes(topic), `README should mention topic: ${topic}`);
  }

  assert.ok(readme.includes('architecture.md'));
  assert.ok(readme.includes('development.md'));
  assert.ok(readme.includes('deployment.md'));
});

test('architecture and developer docs retain Course2Go translation context', () => {
  const architecture = read('ARCHITECTURE.md');
  const development = read('DEVELOPMENT.md');
  const deployment = read('DEPLOYMENT.md');

  assert.match(architecture, /Course2Go/i);
  assert.match(architecture, /reisdossier/i);
  assert.match(architecture, /DEVELOPMENT\.md/);
  assert.match(architecture, /DEPLOYMENT\.md/);
  assert.match(architecture, /API-oppervlak/i);
  assert.match(development, /Zuid-Marokko/i);
  assert.match(development, /README\.md/);
  assert.match(development, /ARCHITECTURE\.md/);
  assert.match(development, /Testen/i);
  assert.match(deployment, /productie/i);
  assert.match(deployment, /README\.md/);
  assert.match(deployment, /ARCHITECTURE\.md/);
  assert.match(deployment, /Security-hardening/i);
});
