# Convertisseur pieds → mètres

Application web composée d'une API Node.js/Express et d'une interface React utilisant Material UI.

## Prérequis

- Node.js 20 ou plus récent
- npm 10 ou plus récent

## Démarrage

Depuis la racine du projet :

```bash
npm install
npm run dev
```

Ouvrez ensuite <http://localhost:5173>. Le frontend transmet les requêtes `/api` au backend disponible sur le port `3001`.

## Commandes

```bash
npm run dev    # démarre le frontend et le backend
npm test       # exécute les tests du backend
npm run build  # crée la version de production du frontend
```

## API

`POST /api/convert`

```json
{
  "feet": 10
}
```

Réponse :

```json
{
  "feet": 10,
  "meters": 3.048,
  "formula": "1 pied = 0,3048 mètre"
}
```
