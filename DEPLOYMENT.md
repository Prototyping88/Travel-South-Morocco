# DEPLOYMENT.md

## Doel

Dit document beschrijft hoe Travel South Morocco van lokaal prototype naar productie-opzet kan groeien zonder de Zuid-Marokko-reisdomeinen uit het oog te verliezen.

## 1. Huidige deploymentvorm

De applicatie draait momenteel als één Node-proces:

```bash
npm start
```

Dat start `server.js`, die:
- API-verkeer afhandelt
- statische assets serveert
- JSON-data leest en schrijft

Dit is geschikt voor demo's, interne validatie en vroege pilotfases.

## 2. Minimale productievereisten

Voor productie of serieuze pilotomgevingen zijn minimaal nodig:
- Linux-host of containerplatform
- Node.js runtime
- reverse proxy (bijv. Nginx)
- TLS-certificaten
- procesmanager (bijv. systemd of PM2)
- backupstrategie voor data
- logging en health monitoring

## 3. Aanbevolen deployment-architectuur

### Fase A — Hardened prototype
- draai de app achter een reverse proxy
- beperk directe toegang tot het Node-proces
- maak periodieke backups van `data/db.json`
- log errors en operationele mutaties

### Fase B — Small production pilot
- verplaats data naar PostgreSQL/Supabase
- voeg authenticatie toe
- splits publieke en operationele toegang logisch
- voeg environment-based configuratie toe

### Fase C — Scale-up
- containerized deployment
- managed database
- object storage voor documenten en vouchers
- externe integraties voor weer, valuta en betalingen

## 4. Environment- en configuratie-aanpak

De huidige repo gebruikt nog geen `.env`-gestuurde configuratie. Voor volgende iteraties is dit wenselijk:

- `PORT`
- `NODE_ENV`
- `APP_BASE_URL`
- `DATABASE_URL`
- `PAYMENT_PROVIDER_KEY`
- `WEATHER_API_KEY`
- `CURRENCY_API_KEY`
- `NOTIFICATION_WEBHOOK_URL`

### Let op
- commit nooit secrets naar de repository
- gebruik per omgeving gescheiden configuratie
- documenteer nieuwe configuratievelden direct in dit bestand

## 5. Reverse proxy en netwerk

Aanbevolen netwerkopzet:
- internet → TLS terminator / reverse proxy
- reverse proxy → Node applicatie op interne poort
- applicatie → database / externe providers

Basismaatregelen:
- force HTTPS
- beperk request body size
- stel timeouts in
- overweeg rate limiting op publieke endpoints

## 6. Data en back-up

### Nu
- `data/db.json` is single-file persistentie
- risico op overschrijven, corruptie en beperkte concurrency

### Aanbevolen
- dagelijkse backup
- write-locking of migratie naar database
- restore-procedure testen
- changelog van bookingmutaties bewaren

## 7. Observability

Minimaal monitoren:
- processtatus
- responstijd op `/api/health`
- foutpercentages op muterende endpoints
- write failures op data-opslag
- incidentregistraties met hoge severity

## 8. Security-hardening

Voor productie zijn deze stappen belangrijk:
- authenticatie en autorisatie toevoegen
- read-endpoints met klantgegevens afschermen
- inputvalidatie aanscherpen
- logging van gevoelige data beperken
- dependency- en secret-scans opnemen in releaseflow

## 9. Releaseworkflow

Aanbevolen volgorde:
1. code/documentatie aanpassen
2. `npm test` draaien
3. handmatige smoke test via `npm start`
4. secretscan uitvoeren
5. release naar staging/pilot
6. health en logs controleren
7. pas daarna productie-uitrol

## 10. Domeinspecifieke productieaandacht

Voor dit platform zijn extra relevant:
- seizoensdrukte rond populaire Zuid-Marokko-routes
- operationele betrouwbaarheid van gids- en transferinformatie
- duidelijke kostencommunicatie in EUR/MAD
- culturele/preparatie-informatie die actueel en zorgvuldig blijft
- incident- en noodnummerflows die snel te bereiken zijn

## 11. Relatie met andere documentatie

- product en scope: [`README.md`](./README.md)
- technische diepgang: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- developer workflow: [`DEVELOPMENT.md`](./DEVELOPMENT.md)
