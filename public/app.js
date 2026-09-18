const t = {
  nl: {
    subtitle: 'Non-alcoholisch / non-haram reizen met volledige ontzorging',
    packagesTitle: 'Reispakketten',
    testimonialsTitle: 'Reviews',
    bookingTitle: 'Boek jouw reis',
    bookBtn: 'Boeking aanvragen',
    paymentsTitle: 'Betalingen',
    itineraryTitle: 'Reisschema',
    emergencyTitle: 'Noodnummer',
    adminTitle: 'Beheerkant',
    crmTitle: 'Klantbeheer (CRM)',
    bookingsAdminTitle: 'Boekingsbeheer',
    roomsTitle: 'Kamerbeheer riad',
    planningTitle: 'Reisplanning koppelen',
    planningBtn: 'Planning opslaan',
    incidentTitle: 'Calamiteiten-module',
    incidentBtn: 'Incident registreren',
    bookingSuccess: 'Boeking en klant opgeslagen.'
  },
  en: {
    subtitle: 'Non-alcoholic / non-haram travel with full logistics support',
    packagesTitle: 'Travel packages',
    testimonialsTitle: 'Testimonials',
    bookingTitle: 'Book your trip',
    bookBtn: 'Request booking',
    paymentsTitle: 'Payments',
    itineraryTitle: 'Itinerary',
    emergencyTitle: 'Emergency number',
    adminTitle: 'Admin side',
    crmTitle: 'Customer management (CRM)',
    bookingsAdminTitle: 'Booking management',
    roomsTitle: 'Riad room management',
    planningTitle: 'Assign itinerary planning',
    planningBtn: 'Save planning',
    incidentTitle: 'Incident module',
    incidentBtn: 'Register incident',
    bookingSuccess: 'Booking and customer saved.'
  }
};

const state = {
  lang: 'nl',
  role: 'customer'
};

const $ = (id) => document.getElementById(id);

function setText(id, key) {
  $(id).textContent = t[state.lang][key];
}

function updateLanguage() {
  setText('subtitle', 'subtitle');
  setText('packagesTitle', 'packagesTitle');
  setText('testimonialsTitle', 'testimonialsTitle');
  setText('bookingTitle', 'bookingTitle');
  setText('bookBtn', 'bookBtn');
  setText('paymentsTitle', 'paymentsTitle');
  setText('itineraryTitle', 'itineraryTitle');
  setText('emergencyTitle', 'emergencyTitle');
  setText('adminTitle', 'adminTitle');
  setText('crmTitle', 'crmTitle');
  setText('bookingsAdminTitle', 'bookingsAdminTitle');
  setText('roomsTitle', 'roomsTitle');
  setText('planningTitle', 'planningTitle');
  setText('planningBtn', 'planningBtn');
  setText('incidentTitle', 'incidentTitle');
  setText('incidentBtn', 'incidentBtn');
}

function updateRoleView() {
  $('adminPanel').classList.toggle('hidden', state.role === 'customer');
}

async function fetchJson(url, options) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

function packageTitle(pkg) {
  return pkg.title[state.lang] || pkg.title.nl;
}

async function loadMarketingAndPackages() {
  const [packages, testimonials] = await Promise.all([
    fetchJson('/api/packages'),
    fetchJson('/api/testimonials')
  ]);

  $('packages').innerHTML = packages
    .map(
      (pkg) => `
      <article>
        <strong>${packageTitle(pkg)}</strong> — ${pkg.destination} (${pkg.days} dagen)
        <br />€${pkg.pricePerPerson} p.p.
      </article>`
    )
    .join('');

  $('testimonials').innerHTML = testimonials
    .map((r) => `<li><strong>${r.author}</strong>: ${r.message}</li>`)
    .join('');

  $('packageId').innerHTML = packages
    .map((pkg) => `<option value="${pkg.id}">${packageTitle(pkg)}</option>`)
    .join('');
}

async function loadBookingsSection() {
  const [bookings, services] = await Promise.all([
    fetchJson('/api/bookings'),
    fetchJson('/api/services')
  ]);

  const recent = bookings[bookings.length - 1];
  if (!recent) return;

  $('payments').innerHTML = `
    Aanbetaling: €${recent.payments.depositAmount} (${recent.payments.depositPaid ? 'betaald' : 'open'})<br />
    Restbetaling: €${recent.payments.remainingAmount} (${recent.payments.remainingPaid ? 'betaald' : 'open'})
  `;

  $('itinerary').innerHTML = recent.itinerary
    .map((i) => `<li>Dag ${i.day}: ${i.activity} — gids ${i.guide}, chauffeur ${i.driver}</li>`)
    .join('');

  $('emergency').textContent = services.emergencyNumber;
}

async function loadAdminSections() {
  const [customers, bookings, rooms, services] = await Promise.all([
    fetchJson('/api/customers'),
    fetchJson('/api/bookings'),
    fetchJson('/api/rooms'),
    fetchJson('/api/services')
  ]);

  $('customers').innerHTML = customers
    .map((c) => `<li>${c.name} (${c.email}) — dieet: ${c.diet || '-'}</li>`)
    .join('');

  $('bookings').innerHTML = bookings
    .map(
      (b) => `<li>${b.id} — ${b.status} — deelnemers: ${b.participants}
        <button data-booking="${b.id}" data-status="confirmed">confirm</button>
        <button data-booking="${b.id}" data-status="cancelled">cancel</button>
      </li>`
    )
    .join('');

  $('rooms').innerHTML = rooms
    .map(
      (r) => `<li>${r.name} (€${r.pricePerNight}) — ${r.available ? 'beschikbaar' : 'bezet'}
        <button data-room="${r.id}" data-available="${!r.available}">toggle</button>
      </li>`
    )
    .join('');

  $('incidents').innerHTML = services.incidents
    .map((i) => `<li>${i.bookingId || '-'}: ${i.summary} (${i.severity})</li>`)
    .join('');
}

async function handleBookingSubmit(event) {
  event.preventDefault();
  const customer = await fetchJson('/api/customers', {
    method: 'POST',
    body: JSON.stringify({
      name: $('name').value,
      email: $('email').value,
      phone: $('phone').value,
      diet: $('diet').value,
      preferences: ['non-alcoholisch']
    })
  });

  await fetchJson('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      customerId: customer.id,
      packageId: $('packageId').value,
      participants: $('participants').value,
      depositAmount: 250,
      depositPaid: false,
      remainingAmount: 1000,
      remainingPaid: false,
      vouchers: [{ id: `v-${Date.now()}`, type: 'trip', status: 'issued' }],
      itinerary: [
        {
          day: 1,
          activity: 'Aankomst en welkomstmoment in riad',
          guide: 'TBD',
          driver: 'TBD'
        }
      ]
    })
  });

  alert(t[state.lang].bookingSuccess);
  event.target.reset();
  await refreshAll();
}

async function onBookingsClick(event) {
  const button = event.target.closest('button[data-booking]');
  if (!button) return;
  await fetchJson(`/api/bookings/${button.dataset.booking}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: button.dataset.status, note: `Status naar ${button.dataset.status}` })
  });
  await refreshAll();
}

async function onRoomsClick(event) {
  const button = event.target.closest('button[data-room]');
  if (!button) return;
  await fetchJson(`/api/rooms/${button.dataset.room}`, {
    method: 'PATCH',
    body: JSON.stringify({ available: button.dataset.available === 'true' })
  });
  await refreshAll();
}

async function handlePlanningSubmit(event) {
  event.preventDefault();
  await fetchJson(`/api/bookings/${$('planningBookingId').value}`, {
    method: 'PATCH',
    body: JSON.stringify({
      itineraryItem: {
        day: Number($('planningDay').value),
        activity: $('planningActivity').value,
        guide: $('planningGuide').value,
        driver: $('planningDriver').value
      },
      note: 'Planningitem toegevoegd'
    })
  });
  event.target.reset();
  await refreshAll();
}

async function handleIncidentSubmit(event) {
  event.preventDefault();
  await fetchJson('/api/incidents', {
    method: 'POST',
    body: JSON.stringify({
      bookingId: $('incidentBookingId').value,
      severity: $('incidentSeverity').value,
      summary: $('incidentSummary').value,
      action: $('incidentAction').value
    })
  });
  event.target.reset();
  await refreshAll();
}

async function refreshAll() {
  updateLanguage();
  updateRoleView();
  await loadMarketingAndPackages();
  await loadBookingsSection();
  if (state.role !== 'customer') {
    await loadAdminSections();
  }
}

function bindEvents() {
  $('langSelect').addEventListener('change', async (event) => {
    state.lang = event.target.value;
    await refreshAll();
  });

  $('roleSelect').addEventListener('change', async (event) => {
    state.role = event.target.value;
    await refreshAll();
  });

  $('bookingForm').addEventListener('submit', handleBookingSubmit);
  $('planningForm').addEventListener('submit', handlePlanningSubmit);
  $('incidentForm').addEventListener('submit', handleIncidentSubmit);
  $('bookings').addEventListener('click', onBookingsClick);
  $('rooms').addEventListener('click', onRoomsClick);
}

bindEvents();
refreshAll().catch((error) => {
  console.error(error);
  alert('Fout bij laden van de prototype-data.');
});
