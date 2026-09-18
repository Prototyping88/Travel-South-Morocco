# DEVELOPMENT.md

## Doel

Dit document helpt developers om veilig en consistent verder te bouwen aan Travel South Morocco als reisplannings-app voor Zuid-Marokko.

## 1. Lokale setup

### Vereisten
- Node.js
- npm

### Installatie

```bash
npm install
```

### Starten

```bash
npm start
```

Applicatie beschikbaar op `http://localhost:3000`.

## 2. Testen

Gebruik de bestaande Node test runner:

```bash
npm test
```

Huidige testdekking:
- API health endpoint
- documentatiebestanden en kernthema's

Bij functionele uitbreidingen horen gerichte tests die aansluiten op de bestaande `node:test`-stijl in `test/`.

## 3. Ontwikkelprincipes

### Houd wijzigingen klein
- wijzig alleen de bestanden die nodig zijn
- houd documentatie in sync met code
- vermijd grote refactors zolang de repo nog prototype-status heeft

### Respecteer de domeinrichting
Nieuwe features moeten passen binnen de Zuid-Marokko-focus:
- itinerary planning
- riads en accommodaties
- historische locaties en culturele voorbereiding
- gidsen, chauffeurs en lokale partners
- weer, seizoenen en kostenbeheer

### Bouw vanuit reisdossiers
Denk bij nieuwe functionaliteit niet in losse formulieren, maar in één gedeeld reisdossier met:
- klantcontext
- boekingsstatus
- verblijf
- itinerary
- budget en betalingen
- voorbereiding en incidentafhandeling

## 4. Huidige code-organisatie

### Backend
`server.js` bevat momenteel:
- data bootstrap (`loadDb`)
- persistentie (`saveDb`)
- request parsing
- API routing
- static file serving

### Frontend
`public/app.js` bevat momenteel:
- taalkeuze NL/EN
- rolweergave voor klant versus admin
- rendering van pakketten en testimonials
- booking flow
- planning- en incidentformulieren
- refresh-cycle voor schermdelen

### Data
`data/db.json` bevat een voorbeeldmodel voor:
- marketing
- packages
- customers
- rooms
- bookings
- transports
- guides
- incidents

## 5. Aanbevolen uitbreidingsvolgorde

1. **Schemas expliciteren**
   - valideer booking-, customer- en incidentpayloads strikter
2. **Domeinen isoleren**
   - splits `server.js` op in modules zoals `bookings`, `customers`, `rooms`, `services`
3. **Nieuwe reisdossierdomeinen toevoegen**
   - historical sites
   - season planning
   - budget/currency tracking
   - preparation checklists
4. **Beveiliging toevoegen**
   - auth, rollen en beperkingen op muterende endpoints
5. **Opslag moderniseren**
   - overstap van JSON naar database

## 6. Richtlijnen voor API-uitbreiding

### Nieuwe endpoints
- gebruik consistente prefixing onder `/api/`
- behoud duidelijke scheiding tussen read en write
- geef JSON-responses terug met voorspelbare vorm
- voeg gerichte tests toe voor elk nieuw endpoint

### Inputvalidatie
Minimaal:
- vereiste velden controleren
- types normaliseren
- prijs- en deelnemersvelden op geldige ranges controleren
- booking- en room-ID's valideren

### Auditability
Wanneer een booking verandert:
- voeg een changelog-item toe
- bewaar statusovergangen expliciet
- documenteer operationele consequenties in code en docs

## 7. Frontend-richtlijnen

- behoud progressive enhancement en eenvoudige laadtijd
- groepeer UI per domeinpanel of toekomstige route/tab
- vermijd duplicatie tussen klant- en adminweergaven
- zorg dat nieuwe labels meertalig voorbereid zijn als ze in de bestaande UI terechtkomen

## 8. Handmatige validatie

Controleer na relevante wijzigingen:
- laadt `/api/health` correct?
- worden pakketten zichtbaar op de homepage?
- kan een klant een boeking aanmaken?
- kan een medewerker een bookingstatus wijzigen?
- kan een kamer worden getoggeld?
- kan een incident worden geregistreerd?

## 9. Documentatieverplichtingen

Werk deze bestanden bij wanneer de scope verandert:
- `README.md` voor productpositionering en structuur
- `ARCHITECTURE.md` voor technische keuzes
- `DEVELOPMENT.md` voor workflow en developerafspraken
- `DEPLOYMENT.md` voor hosting en operations

## 10. Credits en context

Deze developer-richtlijnen bouwen voort op de conceptuele analyse van Course2Go-creator, maar zijn aangepast aan de huidige realiteit van deze repository: een compacte Node/HTML/JSON-prototypecodebase gericht op reizen in Zuid-Marokko.
