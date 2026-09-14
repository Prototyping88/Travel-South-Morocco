Twee prompts, voor de twee stappen die je noemt:

## Stap 1 — voor GitHub Copilot (architectuur)

```text
Context: We bouwen een applicatie voor een dienstverlenend kantoor (reisbureau-constructie)
dat vanuit Europa reizen naar Marokko verkoopt: verblijf, trips en evenementen,
non-alcoholisch/non-haram, met volledige logistieke ontzorging. De organisatie werkt
vanuit twee locaties: een riad in Marrakech en een Europese kant voor verkoop/marketing.

Bijgevoegd is een featuretabel met de functionaliteiten die de applicatie moet
ondersteunen, verdeeld in: Online reclame & marketing, Klantbeheer (CRM), Reizenbeheer,
Tickets & boekingen, Verblijf, Overige diensten, en een beheerlaag (rollen/rechten, AVG,
rapportage, boekhouding). Elke feature heeft een fase: Pilot (MVP, nu nodig) of
Opschaling (later, bij groter volume).

Vraag: ontwerp een solide technische architectuur VOORDAT er code geschreven wordt.
Lever op:
1. Aanbevolen technische stack (frontend, backend, database, hosting) passend bij een
   klein team, MVP-first, met ruimte om later op te schalen.
2. Een datamodel: de belangrijkste entiteiten (klant, boeking, reis, accommodatie,
   leverancier, gebruiker/rol, betaling, ticket) en hun onderlinge relaties.
3. Een modulestructuur die aansluit op de zes gebieden uit de tabel, met per module
   de Pilot-features als scope voor de eerste versie.
4. Een voorstel voor de interfaces/API's tussen deze modules.
5. Niet-functionele eisen die vanaf het begin meegenomen moeten worden: AVG/privacy
   (Europese klantgegevens), meertaligheid (NL/EN/FR), rollen en rechten (eigenaren
   vs. medewerkers), en schaalbaarheid richting de Opschaling-features.
6. Een korte onderbouwing van de keuzes.

Lever dit op als architectuurdocument (geen code), zodat we dit eerst kunnen
valideren voordat we naar de bouwfase in Lovable gaan.
```

## Stap 2 — voor Lovable (prototype), pas gebruiken nadat de architectuur uit Copilot vaststaat

```text
Context: zelfde project als hierboven — reisbureau-constructie Marrakech/Europa,
non-alcoholisch/non-haram, volledige ontzorging van boeking tot terugreis.

Bijgevoegd: de featuretabel (Pilot/Opschaling) en de architectuur die in de vorige
fase is vastgesteld (datamodel, modulestructuur, technische richting).

Bouw een eerste werkende versie (MVP) van deze applicatie, uitsluitend gericht op de
functionaliteiten die in de tabel als "Pilot" zijn gemarkeerd. Richt twee kanten in:

- Klantkant: pakketten bekijken, boeken, aanbetaling/restbetaling doen, reisschema
  en noodnummer inzien.
- Beheerkant (voor het team): klant- en boekingsbeheer, kamerbeheer van de riad,
  reisschema per boeking koppelen aan gids/chauffeur, noodnummer/calamiteiten-module.

Houd rekening met: meertaligheid (NL/EN als basis), eenvoudige rollen (beheerder vs.
medewerker), en een opzet die later zonder herbouw uitgebreid kan worden met de
Opschaling-features (CRM-segmentatie, vluchtboekingen, dashboard/rapportage,
boekhoudkoppeling).

Volg voor het datamodel en de modulestructuur de architectuur uit de vorige fase.
```

De knip tussen Pilot en Opschaling uit de tabel bepaalt bewust de scope van de Lovable-prompt, zodat het eerste prototype behapbaar blijft. Opgeslagen als **06-digitaal-plan/ai-bouwprompts.md**.
