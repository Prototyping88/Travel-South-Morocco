const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DB_PATH = path.join(__dirname, 'data', 'db.json');

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = {
      marketing: {
        testimonials: [
          { id: 't1', author: 'Familie El Idrissi', message: 'Perfect geregeld van aankomst tot vertrek.' },
          { id: 't2', author: 'Team Rotterdam', message: 'Betrouwbaar, halal-vriendelijk en persoonlijk.' }
        ],
        socialLinks: {
          instagram: 'https://instagram.com',
          facebook: 'https://facebook.com'
        }
      },
      packages: [
        {
          id: 'pkg-riad-sahara',
          title: { nl: 'Riad & Sahara Beleving', en: 'Riad & Sahara Experience' },
          destination: 'Marrakech + Merzouga',
          days: 6,
          pricePerPerson: 890,
          includes: ['Riad verblijf', 'Transfer', 'Gids', 'Evenementenopties']
        },
        {
          id: 'pkg-culture-family',
          title: { nl: 'Culturele Familie Reis', en: 'Cultural Family Journey' },
          destination: 'Marrakech + Atlas',
          days: 5,
          pricePerPerson: 740,
          includes: ['Riad verblijf', 'Familietrips', 'Historische gids']
        }
      ],
      users: [
        { id: 'u1', name: 'Eigenaar', role: 'admin' },
        { id: 'u2', name: 'Planner', role: 'employee' }
      ],
      customers: [
        {
          id: 'c1',
          name: 'Amina de Vries',
          email: 'amina@example.com',
          phone: '+31 6 12345678',
          preferences: ['non-alcoholisch'],
          diet: 'halal',
          communicationHistory: [
            { channel: 'email', note: 'Aanvraag familiepakket ontvangen', at: '2026-09-10T09:30:00Z' }
          ],
          feedback: []
        }
      ],
      rooms: [
        { id: 'r1', name: 'Atlas Suite', pricePerNight: 110, available: true },
        { id: 'r2', name: 'Sahara Kamer', pricePerNight: 85, available: true },
        { id: 'r3', name: 'Patio Family Room', pricePerNight: 130, available: false }
      ],
      bookings: [
        {
          id: 'b1',
          customerId: 'c1',
          packageId: 'pkg-riad-sahara',
          participants: 2,
          status: 'confirmed',
          createdAt: '2026-09-11T10:15:00Z',
          roomIds: ['r1'],
          emergencyNumber: '+212 600 000 111',
          cancellationPolicy: 'Tot 14 dagen voor vertrek kosteloos wijzigen.',
          payments: {
            depositAmount: 300,
            depositPaid: true,
            remainingAmount: 1480,
            remainingPaid: false
          },
          vouchers: [
            { id: 'v1', type: 'desert-trip', status: 'issued' }
          ],
          itinerary: [
            { day: 1, activity: 'Aankomst + transfer naar riad', guide: 'Youssef', driver: 'Khalid' },
            { day: 2, activity: 'Marrakech medina tour', guide: 'Sara', driver: 'N/A' }
          ],
          changeLog: [
            { at: '2026-09-12T12:00:00Z', note: 'Transfer tijd aangepast op verzoek klant' }
          ]
        }
      ],
      transports: [
        { id: 'tr1', bookingId: 'b1', driver: 'Khalid', vehicle: 'Van 8p', route: 'Airport -> Riad' }
      ],
      guides: [
        { id: 'g1', bookingId: 'b1', name: 'Youssef', specialty: 'Historie' }
      ],
      incidents: [
        {
          id: 'i1',
          bookingId: 'b1',
          severity: 'medium',
          summary: 'Vertraging bij transfer',
          action: 'Alternatieve chauffeur ingezet',
          contactNumber: '+212 600 000 111'
        }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function notFound(res) {
  sendJson(res, 404, { error: 'Not found' });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error('Request too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function handleApi(req, res, db, url) {
  const method = req.method;
  const pathname = url.pathname;

  if (method === 'GET' && pathname === '/api/health') return sendJson(res, 200, { ok: true });
  if (method === 'GET' && pathname === '/api/packages') return sendJson(res, 200, db.packages);
  if (method === 'GET' && pathname === '/api/testimonials') return sendJson(res, 200, db.marketing.testimonials);
  if (method === 'GET' && pathname === '/api/social-links') return sendJson(res, 200, db.marketing.socialLinks);

  if (method === 'GET' && pathname === '/api/customers') return sendJson(res, 200, db.customers);
  if (method === 'POST' && pathname === '/api/customers') {
    return parseBody(req)
      .then((body) => {
        const customer = {
          id: randomId('c'),
          name: body.name || 'Onbekende klant',
          email: body.email || '',
          phone: body.phone || '',
          preferences: body.preferences || [],
          diet: body.diet || '',
          communicationHistory: [],
          feedback: []
        };
        db.customers.push(customer);
        saveDb(db);
        sendJson(res, 201, customer);
      })
      .catch((err) => sendJson(res, 400, { error: err.message }));
  }

  if (method === 'GET' && pathname === '/api/bookings') return sendJson(res, 200, db.bookings);
  if (method === 'POST' && pathname === '/api/bookings') {
    return parseBody(req)
      .then((body) => {
        const booking = {
          id: randomId('b'),
          customerId: body.customerId,
          packageId: body.packageId,
          participants: Number(body.participants) || 1,
          status: 'requested',
          createdAt: new Date().toISOString(),
          roomIds: body.roomIds || [],
          emergencyNumber: '+212 600 000 111',
          cancellationPolicy: 'Tot 14 dagen voor vertrek kosteloos wijzigen.',
          payments: {
            depositAmount: Number(body.depositAmount) || 0,
            depositPaid: Boolean(body.depositPaid),
            remainingAmount: Number(body.remainingAmount) || 0,
            remainingPaid: Boolean(body.remainingPaid)
          },
          vouchers: body.vouchers || [],
          itinerary: body.itinerary || [],
          changeLog: [{ at: new Date().toISOString(), note: 'Boeking aangemaakt' }]
        };
        db.bookings.push(booking);
        saveDb(db);
        sendJson(res, 201, booking);
      })
      .catch((err) => sendJson(res, 400, { error: err.message }));
  }
  if (method === 'PATCH' && pathname.startsWith('/api/bookings/')) {
    return parseBody(req)
      .then((body) => {
        const id = pathname.split('/').pop();
        const booking = db.bookings.find((b) => b.id === id);
        if (!booking) return notFound(res);
        if (body.status) booking.status = body.status;
        if (body.payments) booking.payments = { ...booking.payments, ...body.payments };
        if (body.itineraryItem) booking.itinerary.push(body.itineraryItem);
        booking.changeLog.push({ at: new Date().toISOString(), note: body.note || 'Boeking aangepast' });
        saveDb(db);
        sendJson(res, 200, booking);
      })
      .catch((err) => sendJson(res, 400, { error: err.message }));
  }

  if (method === 'GET' && pathname === '/api/rooms') return sendJson(res, 200, db.rooms);
  if (method === 'PATCH' && pathname.startsWith('/api/rooms/')) {
    return parseBody(req)
      .then((body) => {
        const id = pathname.split('/').pop();
        const room = db.rooms.find((r) => r.id === id);
        if (!room) return notFound(res);
        if (typeof body.available === 'boolean') room.available = body.available;
        if (body.pricePerNight !== undefined) room.pricePerNight = Number(body.pricePerNight);
        saveDb(db);
        sendJson(res, 200, room);
      })
      .catch((err) => sendJson(res, 400, { error: err.message }));
  }

  if (method === 'GET' && pathname === '/api/services') {
    return sendJson(res, 200, {
      transports: db.transports,
      guides: db.guides,
      incidents: db.incidents,
      emergencyNumber: '+212 600 000 111'
    });
  }

  if (method === 'POST' && pathname === '/api/incidents') {
    return parseBody(req)
      .then((body) => {
        const incident = {
          id: randomId('i'),
          bookingId: body.bookingId || '',
          severity: body.severity || 'low',
          summary: body.summary || '',
          action: body.action || '',
          contactNumber: body.contactNumber || '+212 600 000 111'
        };
        db.incidents.push(incident);
        saveDb(db);
        sendJson(res, 201, incident);
      })
      .catch((err) => sendJson(res, 400, { error: err.message }));
  }

  notFound(res);
}

function serveStatic(req, res, pathname) {
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? '/index.html' : pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8'
    };

    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const db = loadDb();
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) {
    return handleApi(req, res, db, url);
  }
  return serveStatic(req, res, url.pathname);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Travel South Morocco prototype running at http://localhost:${PORT}`);
  });
}

module.exports = { server };
