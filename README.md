# Pilot Weather Briefing (MVP)

## Objectif du projet
Pilot Weather Briefing est une application web responsive destinée aux pilotes privés. Elle génère un premier dossier météo de préparation VFR à partir :
- d’un aérodrome de départ (OACI),
- d’un aérodrome d’arrivée (OACI),
- d’une date et heure locale prévues de départ.

⚠️ La version MVP utilise uniquement des données météo mockées (démonstration).

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Installation
```bash
npm install
```

## Lancement en local
```bash
npm run dev
```
Puis ouvrir [http://localhost:3000](http://localhost:3000).

## Fonctionnalités MVP
- Page d’accueil simple avec explication.
- Formulaire de briefing (départ, arrivée, date, heure locale, type de vol, altitude).
- Résultats affichés après soumission : résumé, METAR/TAF départ et arrivée.
- Avertissement visuel explicite sur le caractère démonstratif des données.
- Analyse simple de mots-clés météo (CB, TS, FG, BR, BKN, OVC) avec points d’attention.
- Aucun avis automatique « vol possible/impossible ».

## Limites de cette version MVP
- Aucune connexion à une source météo aviation réelle.
- Pas de backend séparé.
- Pas de base de données.
- Pas d’authentification.
- Pas de paiement.

## Pourquoi commencer en web uniquement
Le web permet de valider rapidement les flux UX et la logique métier sans complexifier l’infrastructure.

## Évolutivité vers une application mobile
La logique météo est isolée dans `src/lib/weather` :
- `types.ts` (types réutilisables),
- `mockWeatherProvider.ts` (source mock),
- `weatherService.ts` (orchestration),
- `analyzeWeather.ts` (analyse).

Cette séparation permet plus tard :
1. d’ajouter un provider API réel (même interface),
2. d’exposer la logique via une API backend,
3. de connecter une application mobile à la même logique métier et aux mêmes contrats de données.
