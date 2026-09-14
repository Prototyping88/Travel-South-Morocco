const test = require('node:test');
const assert = require('node:assert');
const { server } = require('../server');

function request(port, pathname) {
  return new Promise((resolve, reject) => {
    const req = require('http').request(
      {
        hostname: '127.0.0.1',
        port,
        path: pathname,
        method: 'GET'
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

test('health endpoint responds ok', async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const response = await request(port, '/api/health');
  assert.equal(response.status, 200);
  assert.match(response.body, /"ok":true/);
  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});
