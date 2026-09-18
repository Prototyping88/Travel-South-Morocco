# ARCHITECTURE.md

## Doel

Dit document beschrijft hoe de huidige Travel South Morocco-prototypearchitectuur werkt en hoe de diepgaande analyse van Course2Go-creator is vertaald naar een reisplannings-app voor Zuid-Marokko.

## 1. Architectuurvisie

Course2Go-creator laat een duidelijke scheiding zien tussen publieke routes, onboarding, hoofdworkspace en beheer. Voor Travel South Morocco vertaalt dat zich naar vier logische domeinen:

1. **Discover** — marketing, pakketten, testimonials, historische context en seizoensinformatie
2. **Plan** — klantprofiel, voorkeuren, budget, itinerary-opbouw en voorbereiding
3. **Operate** — kamerbeheer, gidsen, chauffeurs, incidenten en wijzigingen
4. **Control** — betalingen, statussen, capaciteit, audittrail en rapportage

De huidige repository implementeert hiervan een compacte prototypeversie in één Node-proces met een statische frontend.

## 2. Huidige systeemopbouw

### 2.1 Runtime-topologie

- één Node.js-proces behandelt API-verkeer en statische bestanden
- de browserclient roept JSON-endpoints aan via `fetch`
- data wordt persistent opgeslagen in `data/db.json`
- er is geen externe database of authenticatieserver in deze fase

### 2.2 Lagenmodel

#### Presentatielaag
Bestanden:
- `public/index.html`
- `public/app.js`
- `public/styles.css`

Verantwoordelijkheden:
- meertalige labels (NL/EN)
- klantzicht versus medewerker-/beheerzicht
- formulieren voor booking, planning en incidentregistratie
- rendering van pakketten, testimonials, betalingen en itineraries

#### Applicatie-/servicelaag
Bestand:
- `server.js`

Verantwoordelijkheden:
- routing van HTTP-verzoeken
- request body parsing
- validatie op basisniveau
- genereren van IDs
- domeinmutaties op boekingen, kamers, klanten en incidenten
- statische hosting van frontendbestanden

#### Persistentielaag
Bestand:
- `data/db.json`

Verantwoordelijkheden:
- marketing-content
- pakketten
- klanten en contacthistorie
- kamers en beschikbaarheid
- boekingen, itinerary en betalingsstatus
- gidsen, transport en incidenten

## 3. Course2Go → Travel South Morocco vertaalslag

| Course2Go-patroon | Travel South Morocco-vertaling |
|---|---|
| Public landing + auth + preparation + client + back | marketing + booking + reisdossier + operations/admin |
| Dossier met bronnen, claims en tijdlijn | reisdossier met klant, itinerary, betalingen, verblijf en incidenten |
| Domeinspecifieke configuratie in libs | reisregels, seizoenslogica, budget- en voorbereidingsregels |
| Reusable UI components | herbruikbare reiswidgets voor pakketkaarten, budgetblokken, checklisten en planningtabellen |
| Admin console voor beheer | operations console voor bookings, rooms, guides, transfers en calamiteiten |

Belangrijk verschil: de huidige repo heeft nog geen component-first front-end of aparte businesslogic modules. De documentatie hieronder beschrijft hoe dat alsnog logisch kan doorgroeien.

## 4. Domeinmodel

### 4.1 Reeds aanwezig in prototype
- **Package** — bestemming, duur, prijs, inbegrepen onderdelen
- **Customer** — contactgegevens, dieet, voorkeuren, communicatiegeschiedenis
- **Booking** — package-koppeling, deelnemers, status, betalingen, itinerary, changelog
- **Room** — naam, prijs per nacht, beschikbaarheid
- **Transport** — route, voertuig, chauffeur
- **Guide** — naam, specialisatie
- **Incident** — ernst, samenvatting, actie, contactnummer

### 4.2 Aanbevolen uitbreiding
- **HistoricalSite** — regio, beschrijving, bezoekadvies, bronverwijzingen
- **SeasonWindow** — regio, maand, temperatuur, reistype, waarschuwingen
- **BudgetItem** — valuta, categorie, verwacht/werkelijk bedrag
- **AccommodationPartner** — riad, policies, voorzieningen, partnercontacten
- **GuideAssignment** — gids/chauffeur per itinerary-item of boeking
- **PreparationChecklist** — kleding, cultuur, documenten, gezondheid, veiligheid

## 5. Dataflow

### Boekingsflow
1. klant vult boekingsformulier in
2. frontend maakt eerst een `Customer` aan via `POST /api/customers`
3. frontend maakt daarna een `Booking` aan via `POST /api/bookings`
4. server schrijft beide entiteiten naar `data/db.json`
5. frontend herlaadt pakketten, boekingsstatus en itinerary

### Operationsflow
1. medewerker opent admin-weergave
2. frontend laadt klanten, boekingen, kamers en services parallel op
3. medewerker bevestigt of annuleert boekingen, wijzigt kamers of voegt planningitems toe
4. server appendt wijzigingen aan changelog en schrijft terug naar JSON-opslag

### Incidentflow
1. medewerker registreert een incident
2. server voegt incident toe aan dataset
3. klant- en operationscontext kan later verrijkt worden met notificaties en escalatieregels

## 6. API-oppervlak

### Read endpoints
- `GET /api/health`
- `GET /api/packages`
- `GET /api/testimonials`
- `GET /api/social-links`
- `GET /api/customers`
- `GET /api/bookings`
- `GET /api/rooms`
- `GET /api/services`

### Write endpoints
- `POST /api/customers`
- `POST /api/bookings`
- `PATCH /api/bookings/:id`
- `PATCH /api/rooms/:id`
- `POST /api/incidents`

### Ontbrekende maar logische volgende endpoints
- `GET /api/historical-sites`
- `GET /api/seasons`
- `GET /api/currency-rates`
- `POST /api/guide-assignments`
- `POST /api/preparation-checklists`

## 7. Business logic-migratie vanuit Course2Go

De belangrijkste conceptuele migraties zijn:

- **studieplanning → reisplanning**
  - week- of periodegebaseerde logica wordt seizoens- en vertreklogica
- **brondossier → reisdossier**
  - bronnen en claims worden routepunten, accommodaties, gidsafspraken en voorbereidingsinformatie
- **owner/admin tools → operations dashboard**
  - beheerfuncties verschuiven naar capaciteit, logistiek, betalingen en incidentafhandeling
- **tab-configuratie → travel workspace tabs**
  - voorstel: Itinerary, Accommodation, Budget, Heritage, Preparation, Operations

## 8. Niet-functionele eisen

### Security
- valideer request bodies strikter dan nu gebeurt
- beperk payload size en voeg rate limiting toe
- introduceer authenticatie en role-based access control
- voorkom directe PII-lekken in onbeveiligde read-endpoints

### Reliability
- vervang JSON-opslag uiteindelijk door een relationele database
- voeg audit logging toe voor status- en betalingswijzigingen
- gebruik backups en versiebeheer voor operationele data

### Performance
- cache read-heavy catalogusdata
- splits grote operations-overzichten in paginatie/filtering
- overweeg aparte services voor read/write als het platform groeit

### Maintainability
- verplaats domeinmutaties uit `server.js` naar aparte modules
- maak frontendcomponenten herbruikbaar per domein
- definieer een expliciet schema voor booking-, room- en incidentdata

## 9. Gewenste doelarchitectuur

### Kortetermijn
- Node API behouden
- JSON-opslag vervangen door PostgreSQL of Supabase
- frontend opsplitsen in modules per domein
- eenvoudige auth toevoegen

### Middellangetermijn
- route-/workspace-architectuur vergelijkbaar met Course2Go
- rijker reisdossier met tabs en checklisten
- externe integraties voor weer, betalingen en valuta
- partnerportalen voor riads en gidsen

### Langetermijn
- volwaardig operations platform voor Zuid-Marokko-reizen
- contentlaag voor historische locaties en culturele voorbereiding
- datagedreven prijs-, capaciteits- en seizoensplanning

## 10. Documentrelaties

- overzicht en productpositionering: [`README.md`](./README.md)
- developer-aanpak: [`DEVELOPMENT.md`](./DEVELOPMENT.md)
- uitrol en operations: [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- bestaande repo-architectuurschets: [`06-digitaal-plan/01-architectuur.md`](./06-digitaal-plan/01-architectuur.md)
