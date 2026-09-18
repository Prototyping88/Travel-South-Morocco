# Fase 1 – Technische Architectuur

## 1. Doel en scope
Deze architectuur beschrijft een digitale applicatie voor **Travel South Morocco** met twee domeinen:
- **Klantkant**: boekingen, reizen, events en communicatie
- **Beheerkant**: planning, capaciteit, betalingen en operationele afhandeling

Doel van fase 1 is een technische basis die eerst een MVP ondersteunt en daarna schaalbaar uitbreidbaar is.

## 2. Technische stack
- **Frontend**: Next.js (React + TypeScript)
- **Backend**: Next.js API routes of Node.js service-laag
- **Database**: PostgreSQL
- **Authenticatie**: JWT + role-based access control (klant, medewerker, admin)
- **Bestandsopslag**: Object storage (bijv. S3-compatibel) voor vouchers, documenten en media
- **E-mail/Notificaties**: Transactional e-mailprovider + optionele WhatsApp/SMS-koppeling
- **Deployment**: Containerized deployment (Docker) met gescheiden omgevingen (dev/staging/prod)

## 3. Domeinmodel (hoog niveau)
Kernentiteiten:
- **User** (profiel, rol, contactgegevens)
- **Trip** (bestemming, programma, capaciteit, prijs)
- **Event** (los evenement of gekoppeld aan trip)
- **Booking** (boeker, deelnemers, status, betaalstatus)
- **Payment** (bedrag, methode, status, referentie)
- **ItineraryItem** (dagplanning, activiteit, tijden)
- **Accommodation** (hotel/riad, kamerallocatie)
- **Transport** (transfer, chauffeur, voertuig)
- **SupportTicket** (klantvraag, status, prioriteit)

Relaties:
- Een **User** kan meerdere **Bookings** hebben
- Een **Trip** bevat meerdere **ItineraryItems** en kan meerdere **Events** bevatten
- Een **Booking** heeft één of meerdere **Payments**
- **Accommodation** en **Transport** worden aan **Trip** en/of **Booking** gekoppeld

## 4. Modulestructuur
### 4.1 Klantmodules
- Accountregistratie en login
- Trip- en eventcatalogus
- Boekingsflow (selectie → gegevens → betaling → bevestiging)
- Mijn reizen (status, documenten, planning)
- Klantenservice en communicatie

### 4.2 Beheermodules
- Productbeheer (trips, events, prijzen, beschikbaarheid)
- Boekingsbeheer (wijzigen, annuleren, handmatige interventie)
- Capaciteitsplanning (kamers, transport, gidsen)
- Financieel overzicht (betalingen, openstaand, refunds)
- Operationeel dashboard (komende vertrekken, incidenten)

## 5. API-interfaces (concept)
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Trips & events
- `GET /api/trips`
- `GET /api/trips/{id}`
- `GET /api/events`
- `GET /api/events/{id}`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/{id}`
- `PATCH /api/bookings/{id}`
- `POST /api/bookings/{id}/cancel`

### Payments
- `POST /api/payments/checkout`
- `POST /api/payments/webhook`
- `GET /api/payments/{id}`

### Admin
- `POST /api/admin/trips`
- `PATCH /api/admin/trips/{id}`
- `GET /api/admin/bookings`
- `GET /api/admin/operations/dashboard`

## 6. Niet-functionele eisen
- **Beveiliging**: inputvalidatie, rate limiting, versleutelde data-overdracht (TLS), least-privilege autorisatie
- **Betrouwbaarheid**: retry-mechanismen bij externe providers, audit logging, foutmonitoring
- **Performance**: server-side caching op catalogusdata, paginatie op lijsten
- **Schaalbaarheid**: stateless API-laag, DB-indexering op zoek- en filtervelden
- **Compliance**: AVG-proof dataverwerking met dataminimalisatie en bewaartermijnen

## 7. MVP-afbakening
MVP bevat:
- Registratie/login
- Catalogus van trips/events
- Eenvoudige boekingsflow
- Basisbetaling en boekingsbevestiging
- Beheer van trips en boekingen

Niet in MVP (wel voorbereid):
- Geavanceerde dynamische prijsregels
- Multi-tenant ondersteuning
- Volledige CRM-automatisering

## 8. Implementatievolgorde
1. Basisproject + authenticatie
2. Datamodel en migraties
3. Catalogus + detailpagina’s
4. Boekingsflow + betaling
5. Beheerschermen voor trips/boekingen
6. Monitoring, logging en hardening
