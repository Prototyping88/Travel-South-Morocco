# Digitaal Plan: Systemen en Infrastructuur

## 1. Doel en context

Dit document beschrijft de systeembasis en infrastructuurkeuzes voor de digitale ondersteuning van Marrakech Passion.

## 2. Kernprincipes

- MVP-first: eerst een werkbare pilot met uitbreidbare basis.
- Modulaire opzet: onderdelen per domein apart uitbreidbaar.
- Datagedreven beheer: klant-, boekings- en operationele data in één consistente bron.

## 3. Systeemcomponenten

- Frontend voor klantzijde en beheerkant.
- Backend/API-laag voor domeinlogica en integraties.
- Database voor klanten, boekingen, verblijf, betalingen en operationele planning.

## 4. Infrastructuur en beheer

- Veilige hosting met toegangsbeheer op rollen.
- Logging en basisrapportage voor operationele opvolging.
- Voorbereiding op opschaling naar extra functionaliteiten en integraties.

## 5. Betalingen

De technische afhandeling van aanbetaling, restbetaling en facturatie bevat:

- Ondersteuning van meerdere betaalmomenten per boeking.
- Vastlegging van betaalstatus per klant en boeking.
- Verwerking van bedragen in euro en dirham, inclusief duidelijke koers- en boekingsregistratie.
