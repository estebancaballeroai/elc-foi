# Bible Aventure · Pixel Lab v0.5 — quatrième monde : Moïse

Version expérimentale autonome basée sur le standard v0.4 d'Éden. **Aucun des anciens dossiers** `bible-aventure/`, `pixel-lab/`, `pixel-lab-v02/`, `pixel-lab-v03/` ou `pixel-lab-v04/` n'est modifié.

## Nouveauté majeure

Le quatrième récit jouable est **Moïse et l'Exode**. Cinq chapitres issus du contenu préexistant dans `bible-aventure/index.html` (réécriture originale des notices de fiction, références vérifiées avec le récit de l'Exode), répartis en **15 découvertes et 5 questions**.

| Chapitre | Référence | Figure jouée | Monde illustré |
| --- | --- | --- | --- |
| 1. Un panier sur le Nil | Exode 2,1–10 | Sœur de Moïse | Nil, roseaux, corbeille |
| 2. La voix dans le buisson | Exode 3,1–4,17 | Moïse | Horeb, moutons, buisson lumineux |
| 3. Face au Pharaon | Exode 5–11 | Moïse | Cours et architecture égyptienne imaginaire |
| 4. La nuit du départ | Exode 12,1–13,22 | Moïse | Pâque, départ et colonne de feu |
| 5. Un passage au milieu de la mer | Exode 14 | Moïse | Mer ouverte, route sèche, peuple en marche |

## Art et animation

`shared/moses-art.js` contient les fonctions **éditables, reproductibles et sans téléchargement distant** qui créent deux atlas de personnages de 256 × 400 pixels, **20 poses pour chacun** : Moïse adulte et la sœur de Moïse (figure du chapitre 1). Les cinq grands tableaux de 800 × 600 pixels sont des SVG originaux en couches, chacun avec une composition différente. Les accessoires sont des ressources SVG de 64 × 64 pixels (panier, roseaux, buisson, bâton, piliers, pain, eau, lumière, nuée).

Le moteur unique `shared/engine.js` (Canvas, 32 px/case) reprend le pilotage tactile, la caméra, la recherche de chemin, les livres, les questions, les sauvegardes et les dix variantes de labyrinthes pour chaque récit. Le terrain de Moïse utilise des thèmes narratifs propres à chaque chapitre ; **une décoration ne modifie jamais les collisions**.

## Point de vigilance biblique

Le chapitre du panier fait jouer **la sœur qui observe le bébé**, sans prétendre que le texte d'Exode 2 donne ici son nom. Le buisson ardent est représenté **sans image de Dieu**. Les plaies, la Pâque et la mer sont expliquées avec sérieux et sans transformer les souffrances en spectacle. Le joueur **ne commande pas** le passage de la mer. Les silhouettes, la couleur des vêtements, l'architecture, l'implantation des roseaux et les itinéraires restent des éléments artistiques signalés.

Les textes sont des paraphrases pédagogiques originales, non des reproductions de traductions modernes protégées. La forme historique précise des décors n'est pas connue.

## Quatre mondes sur un moteur

Éden, Noé, Joseph et Moïse partagent les mêmes contrôles, composants et mécanismes. Les trois mondes historiques gardent leurs graphismes et contenus précédents. Moïse dispose d'un pack propre et n'exige aucune intégration d'IA ni connexion à un service externe.

## Tests et seuil qualité

Le workflow `.github/workflows/pixel-v05-qa.yml` vérifie quatre mondes, trois formats d'écran et les 10 variantes de labyrinthes par récit (**40 parcours possibles**, 5 chapitres × 2 difficultés × 4 mondes), le rendu des illustrations, les atlas, les commandes tactiles réelles simulées dans Chromium, les sauvegardes et le comparateur de qualité.

Le seuil d'extension est **85/100 avec aucun critère en dessous de 60 %**, référence Éden, validé par un évaluateur sur un vrai smartphone et lors d'un essai adapté avec des enfants. **Les tests automatisés ne certifient pas la qualité esthétique**.

- Jouer au portail `pixel-lab-v05/`.
- Comparer les quatre récits : `pixel-lab-v05/quality/`.
- Outil qualité réutilisable : `quality/standard.json`.

## Suite des récits

Après revue des scores, prochain récit : **David et Goliath**, puis Jonas et Ninive. Chaque nouveau monde sera isolé, alimenté par les données bibliques du jeu existant, accompagné d'illustrations originales et d'un contrôle de régression complet, avant diffusion à des enfants.
