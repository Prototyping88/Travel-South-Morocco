const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

test('documentation deliverables exist at repository root', () => {
  for (const file of ['README.md', 'ARCHITECTURE.md', 'DEVELOPMENT.md', 'DEPLOYMENT.md']) {
    assert.equal(fs.existsSync(path.join(ROOT, file)), true, `${file} should exist`);
  }
});

test('README describes the South Morocco travel-planning focus and linked docs', () => {
  const readme = read('README.md');
  assert.match(readme, /Travel itinerary planning/i);
  assert.match(readme, /Riad & accommodation booking/i);
  assert.match(readme, /Historical site documentation/i);
  assert.match(readme, /Local guide integrations/i);
  assert.match(readme, /Weather & seasonal planning/i);
  assert.match(readme, /Currency & cost management/i);
  assert.match(readme, /Cultural insights & preparation/i);
  assert.match(readme, /ARCHITECTURE\.md/);
  assert.match(readme, /DEVELOPMENT\.md/);
  assert.match(readme, /DEPLOYMENT\.md/);
});

test('architecture and developer docs retain Course2Go translation context', () => {
  const architecture = read('ARCHITECTURE.md');
  const development = read('DEVELOPMENT.md');
  const deployment = read('DEPLOYMENT.md');

  assert.match(architecture, /Course2Go/i);
  assert.match(architecture, /reisdossier/i);
  assert.match(development, /Zuid-Marokko/i);
  assert.match(deployment, /productie/i);
});
