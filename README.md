# Travel South Morocco

Travel South Morocco is een reisplannings-platform in wording voor **Zuid-Marokko**. De repository bevat vandaag een werkend Node.js-prototype met publieke boekingsflow, eenvoudige backoffice en JSON-gedreven API. De documentatie in deze repository vertaalt daarnaast de eerder onderzochte **Course2Go-creator**-architectuur naar een domein rond reisplanning, riads, lokale gidsen, historische plekken en culturele voorbereiding.

## Projectoverzicht

De beoogde productrichting is een digitale reisworkspace waarin reizigers en medewerkers samenwerken rond één reisdossier:

- **Travel itinerary planning** voor dag-tot-dag schema's, transfers en activiteiten
- **Riad & accommodation booking** voor kamerallocatie, beschikbaarheid en verblijfslogistiek
- **Historical site documentation** voor context rond medina's, kasbahs, UNESCO-locaties en erfgoedroutes
- **Local guide integrations** voor gids-, chauffeur- en begeleiderstoewijzing
- **Weather & seasonal planning** voor hitte, regen, woestijncondities en beste reisperiodes
- **Currency & cost management** voor aanbetaling, restbetaling, budgetindicaties en MAD/EUR-context
- **Cultural insights & preparation** voor halal-vriendelijke opties, lokale etiquette en veiligheidsvoorbereiding

## Course2Go-analyse vertaald naar Travel South Morocco

Uit de diepgaande analyse van Course2Go-creator kwamen enkele sterke patronen naar voren die hier zijn hergebruikt op conceptueel niveau:

1. **Gescheiden productoppervlakken**  
   Zoals Course2Go een publieke voorkant, onboarding, werkruimte en beheerzijde scheidt, gebruikt Travel South Morocco een vergelijkbare indeling:
   - publieke marketing- en boekingslaag
   - klantgericht reisdossier
   - operationele planning voor medewerkers
   - beheerlaag voor capaciteit, betalingen en incidenten

2. **Dossier-gedreven business logic**  
   Course2Go groepeert bronnen, claims en tijdlijnen in één dossier. In deze reisvertaling wordt dat een **reisdossier** met klantgegevens, boeking, betalingen, itinerary-items, gidsen, transport, kamers en incidenten.

3. **Route- en taakgericht werken**  
   Waar Course2Go per route een duidelijk productdoel heeft, krijgt deze app functionele zones voor boeken, plannen, beheren en opvolgen.

4. **Sterke domeinlaag**  
   In plaats van onderwijslogica draait de domeinlaag hier om reizen: beschikbaarheid, verblijf, begeleiding, culturele voorbereiding, noodnummers en wijzigingsbeheer.

De huidige codebase is nog bewust eenvoudiger dan Course2Go: geen TanStack Start, Supabase of componentbibliotheek, maar een klein prototype waarmee dezelfde productrichting tastbaar wordt gemaakt.

## Technische stack en architectuur-analyse

### Huidige implementatie

- **Runtime:** Node.js
- **Backend:** eigen HTTP-server in `server.js`
- **Frontend:** statische HTML/CSS/JavaScript in `public/`
- **Data-opslag:** JSON-bestand in `data/db.json`
- **Tests:** `node --test`
- **Deployvorm:** eenvoudige process-based deployment (`npm start`)

### Architectuurlagen

- **Presentation layer** — `public/index.html`, `public/app.js`, `public/styles.css`
- **API/service layer** — `server.js`
- **Persistence layer** — `data/db.json`
- **Documentatie-/analyselaag** — root docs + `06-digitaal-plan/`

### Waarom deze vorm werkt voor dit project

- laagdrempelig prototype voor snelle iteratie
- alle kernflows zijn lokaal te demonstreren zonder extra infrastructuur
- eenvoudig uit te breiden richting rijkere route-/dossierarchitectuur
- goede basis om Course2Go-principes later te migreren naar een volwaardige full-stack reisapp

Zie voor diepgaande details [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Projectstructuur met annotaties

```text
.
├── README.md                 # Hoofdoverzicht, analyse, setup en links naar documentatie
├── ARCHITECTURE.md           # Diepgaande technische architectuur en vertaalslag vanuit Course2Go
├── DEVELOPMENT.md            # Developer workflow, API-richtlijnen, testen en bijdrage-afspraken
├── DEPLOYMENT.md             # Productie-setup, operations, hardening en release-aanpak
├── package.json              # Start- en testcommando's
├── server.js                 # Node HTTP-server, API-routing, static file serving en JSON-persistentie
├── data/
│   └── db.json               # Prototype-dataset: pakketten, klanten, kamers, boekingen, gidsen, incidenten
├── public/
│   ├── index.html            # UI-skelet voor marketing, booking en admin panels
│   ├── app.js                # Clientlogica, taalwisseling, formulierflows en API-calls
│   └── styles.css            # Basale styling voor panels, grids en formulieren
├── test/
│   ├── server.test.js        # Bestaande health-check test voor de Node server
│   └── documentation.test.js # Gerichte validatie van de nieuwe documentatiebestanden
└── 06-digitaal-plan/
    ├── 01-architectuur.md            # Eerdere architectuurschets binnen de repo
    ├── functionaliteiten-overzicht.md # Pilot/Opschaling featurematrix
    └── ai-bouwprompts.md              # Prompt- en bouwcontext
```

## Kernfeatures en use cases

### Reiziger / klant
- pakketten voor Zuid-Marokko bekijken
- boeking aanvragen met contact- en dieetvoorkeuren
- aanbetaling en restbetaling opvolgen
- reisschema en noodnummer bekijken
- culturele en praktische voorbereiding ontvangen

### Planner / medewerker
- klantprofielen raadplegen
- boekingen bevestigen of annuleren
- kamers beheren
- itineraries verrijken met gids/chauffeur/planningitems
- incidenten registreren en opvolgen

### Toekomstige uitbreiding op basis van Course2Go-patronen
- onboarding-flow voor reizigers en voorkeuren
- dossier-tabs voor planning, budget, erfgoed, verblijf en voorbereiding
- weer- en seizoenssignalen per bestemming
- historische locaties met curated context en bronnen
- lokale partnerintegraties voor gidsen, riads en transfers

## API / integratie-overzicht

### Bestaande API-endpoints
- `GET /api/health` — health check
- `GET /api/packages` — pakketoverzicht
- `GET /api/testimonials` — testimonials voor marketing
- `GET /api/social-links` — sociale links
- `GET /api/customers` — klantlijst
- `POST /api/customers` — klant aanmaken
- `GET /api/bookings` — boekingslijst
- `POST /api/bookings` — boeking aanmaken
- `PATCH /api/bookings/:id` — status, payments of itinerary bijwerken
- `GET /api/rooms` — kamerlijst
- `PATCH /api/rooms/:id` — beschikbaarheid of prijs aanpassen
- `GET /api/services` — transports, guides, incidents en noodnummer
- `POST /api/incidents` — incident registreren

### Doelintegraties voor volgende fases
- weerdata per regio/seizoen
- valuta- en kostenreferenties (EUR/MAD)
- externe betaalprovider
- messaging voor bevestigingen en operationele updates
- partnerfeeds voor riads, gidsen en excursies

## Setup & deployment instructies

### Lokaal starten

```bash
npm install
npm start
```

Open daarna `http://localhost:3000`.

### Tests draaien

```bash
npm test
```

### Verdere deploymentdocumentatie

- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — productie- en hostingaanpak
- [`DEVELOPMENT.md`](./DEVELOPMENT.md) — developer workflow en richtlijnen

## Developmentworkflow

1. Werk documentatie en/of prototypecode bij in kleine, gerichte wijzigingen
2. Draai `npm test`
3. Controleer handmatig de boekings- en beheerflows via `npm start`
4. Houd domeindocumentatie in sync met code en data-model
5. Gebruik de root docs voor actuele productrichting en `06-digitaal-plan/` voor aanvullend historisch contextmateriaal

## Credits

- **Travel South Morocco repository** — huidige prototypecode, domeinschetsen en operationele reisscope
- **Course2Go-creator analysebasis** — architectuurinzichten rond gescheiden productoppervlakken, dossierdenken, domeinlogica en werkruimtestructuur
- **Analyse & documentatievertaling** — opgesteld voor `Prototyping88/Travel-South-Morocco` met focus op later hergebruik voor educatie, productverfijning en teamoverdracht

## Aanvullende documentatie

- [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- [`DEVELOPMENT.md`](./DEVELOPMENT.md)
- [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- [`06-digitaal-plan/01-architectuur.md`](./06-digitaal-plan/01-architectuur.md)
- [`06-digitaal-plan/functionaliteiten-overzicht.md`](./06-digitaal-plan/functionaliteiten-overzicht.md)
