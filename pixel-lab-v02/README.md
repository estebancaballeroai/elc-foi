# Bible Aventure — Pixel Lab v0.2

Version experimentale et independante du moteur commun v0.1. Les versions principales et `pixel-lab/` sont preservees.

## Livrables

- `shared/engine.js` : moteur Canvas commun, deplacements mobiles, itineraires BFS, progression, sauvegarde locale, camera amortie, ombres, animation et effets atmospheriques.
- `shared/art-factory.js` : atelier **sans IA integree**, sans reseau, qui produit a la demande des sprites SVG de 256 x 400 pixels (20 poses, 4 colonnes, 5 lignes) et des illustrations de scenes SVG 800 x 600 pixels.
- `stories/noe-upgrade.js` et `stories/joseph-upgrade.js` : modules qui remplacent le personnage generique par un avatar dedie, avec cinq nouvelles scenes.
- `stories/eden.js` : contenu de reference v2.5 preserve.
- `stories/noe.js` : contenu biblique du pilote Noe preserve, 18 decouvertes.
- `stories/joseph.js` : contenu biblique v2.0 preserve, 20 decouvertes.

## Direction artistique

Noe : personnage age avec barbe blanche et robe marron, cinq ambiances: chantier, animaux, deluge, eaux qui se retirent, arc-en-ciel. Pluie et vagues discretes selon les scenes.

Joseph : personnage plus jeune au vetement bleu et or (representation artistique), cinq environnements: Canaan, route, maison/epreuves, greniers, retrouvailles. Animations directionnelles.

Eden : conserve les images historiques, les deux planches d'Adam et Eve et les cinq chapitres.

## Frontiere Bible / fiction

Le jeu propose des paraphrases originales des passages bibliques et distingue explicitement ses objets et paysages imagines. La couleur de la tunique de Joseph, les formes de l'arche et les monuments ne sont pas presentes comme des details historiques certains.

## Verification

`node tests/pixel-v02-smoke.cjs` (Playwright et Chromium requis) verifie chaque monde en 390, 360 et 768 pixels de largeur, la presence des atlas de personnage, le chargement des cinq illustrations, les dix variantes de labyrinthes, la sauvegarde et les deplacements. Des captures d'ecran sont stockees en artefact GitHub Actions.

Cette version est un prototype pour validation visuelle sur smartphone. Aucune connexion a un service externe, publicite ou compte n'est requis pour jouer.

## Suite

1. Revue visuelle sur smartphone Android et correction eventuelle des graphismes.
2. Affiner les planches (transitions, proportions, silhouettes) selon retour utilisateur.
3. Passer aux autres recits bibliques en reemployant les packs narratifs et le moteur commun.
