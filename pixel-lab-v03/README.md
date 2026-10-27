# Bible Aventure — Pixel Lab v0.3

Une version de **perfectionnement visuel**, isolée des versions `pixel-lab/` et `pixel-lab-v02/`. Les récits et les règles de jeu ne sont pas modifiés.

## Trois mondes, un moteur

- **Éden** reste le témoin graphique avec Adam et Ève, cinq chapitres et leurs illustrations historiques.
- **Noé** utilise les mêmes commandes et le même Canvas, mais avec un sprite Noé plus détaillé, cinq scènes enrichies et un rendu thématique : chantier, animaux, pluie, eaux qui se retirent et promesse.
- **Joseph** dispose d'un sprite dédié et de cinq scènes supplémentaires : Canaan, route d'Égypte, épreuves, greniers et retrouvailles.

## Ce qui change en v0.3

1. **Personnages** : enrichissement de l'atlas de 20 poses (4 colonnes × 5 lignes), coiffures, textures, ceintures, contrastes et ombrages supplémentaires. Génération locale et reproductible en SVG.
2. **Illustrations** : nouvelles couches atmosphériques, reliefs en arrière-plan, végétation, premiers et derniers plans pour chaque chapitre. Ce sont des images originales produites par le moteur local, pas des photographies ni des reconstructions historiques.
3. **Décors jouables** : ajout de textures des chemins et d'objets de récit : bois, roseaux et poissons pour Noé ; gerbes, jarres, tentes et palmiers pour Joseph.
4. **Cohérence** : le personnage Noé n'est plus dupliqué à la sortie ; les moutons décoratifs arbitraires sont retirés du parcours de Joseph.
5. **Mobile** : davantage de lisibilité dans les cartes, contrastes, légendes, boutons de direction et focus clavier.

## Pédagogie biblique

Les textes des chapitres restent ceux de la version précédemment validée, basés sur Genèse 2–3, 6–9 et 37–45. Les couleurs du vêtement de Joseph, les plans de l'arche, les détails des bâtiments et des personnages ne sont pas présentés comme des certitudes bibliques. Aucune représentation nouvelle n'est censée compléter le texte inspiré.

## Tests

`tests/pixel-v03-smoke.cjs` valide le moteur commun et l'affichage sur 360, 390 et 768 px avec Chromium/Playwright. Les contrôles vérifient les 5 chapitres, les deux variantes de difficulté, l'accessibilité des destinations, les textures, les 20 poses des nouveaux personnages, les 5 scènes 800 × 600, les commandes et les sauvegardes. Des captures PNG sont déposées comme artefacts GitHub Actions.

**Les essais sur un vrai smartphone sont à réaliser avant d'intégrer cette version à la production principale.**

## Architecture et préservation

Les dossiers `pixel-lab/`, `pixel-lab-v02/`, `bible-aventure/` et les versions historiques de Noé/Éden ne sont pas modifiés. Les sauvegardes v0.3 utilisent la clé locale `bible-aventure-pixel-shared-v03-<id>` avec reprise des données v0.2 quand elles existent.
