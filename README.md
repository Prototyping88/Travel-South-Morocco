# Travel South Morocco – Digitale Applicatie Prototype

Prototype voor een reisbureau-constructie (Marrakech + Europa) met focus op Pilot-features.

## Starten

```bash
npm start
```

Open daarna `http://localhost:3000`.

## Wat zit in dit prototype

- **Klantkant**
  - Pakketten bekijken
  - Boeking aanvragen
  - Aanbetaling/restbetaling status
  - Reisschema en noodnummer inzien
- **Beheerkant** (rol: medewerker/beheerder)
  - Klantbeheer en boekingsbeheer
  - Kamerbeheer riad
  - Reisschema koppelen aan gids/chauffeur
  - Calamiteitenregistratie
- **Cross-cutting**
  - Basis meertaligheid (NL/EN)
  - Basis rollen (customer/employee/admin)

## Structuur

- `server.js` — eenvoudige Node HTTP API + static hosting
- `data/db.json` — prototype data-opslag (JSON)
- `public/` — frontend (HTML/CSS/JS)
- `06-digitaal-plan/` — architectuur- en promptdocumenten
