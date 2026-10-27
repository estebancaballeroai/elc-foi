# Bible Aventure — Pixel Lab v0.6 : David et Goliath

## État

**Cinquième récit jouable expérimental** sur le moteur Pixel commun. La v0.6 est conservée séparément des versions v0.1 à v0.5 et du jeu principal.

Les cinq mondes sont : Éden, Noé, Joseph, Moïse et David. Chaque monde présente **cinq chapitres et deux difficultés**. Soit cinquante variantes de labyrinthes accessibles via un même code de génération et de recherche d'itinéraire.

## Nouveau récit : David et Goliath (1 Samuel 16–17)

| Chapitre | Référence principale | Ambiance | Question |
| --- | --- | --- | --- |
| 1. Un jeune berger | 1 Samuel 16,1–13 ; 17,12–15 | Pâturages, collines, brebis | Où David se trouve-t-il ? |
| 2. Samuel choisit David | 1 Samuel 16,6–13 | Bethléhem, huile et rencontre | Qui reçoit l’onction ? |
| 3. Deux armées dans la vallée | 1 Samuel 17,1–30 | Vallée d’Éla, camps, provisions | Comment les Israélites réagissent-ils ? |
| 4. Cinq pierres polies | 1 Samuel 17,31–40 | Ruisseau et pierres | Pourquoi David retire-t-il l’armure ? |
| 5. Un courage inattendu | 1 Samuel 17,41–54 | Aube et vallée après le défi | Quelle arme David utilise-t-il ? |

Le contenu reprend les cinq chapitres pédagogiques et les références déjà préparés dans `bible-aventure/index.html`, avec **15 découvertes**, cinq questions et des notices qui identifient les éléments artistiques.

## Créations graphiques

- `shared/david-art.js` : un atlas de personnage David (256 × 400 px, **20 poses directionnelles**), cinq scènes originales SVG (800 × 600 px), dix accessoires narratifs (brebis, bâton, huile, parchemin, bouclier, provisions, armure, pierres, fronde, soleil).
- `stories/david-upgrade.js` : enregistre les images locales, la palette et les objets du récit.
- `shared/engine.js` : conserve le moteur Canvas, les flèches tactiles, la caméra, les trois livres par chapitre, la progression et les sauvegardes locales ; ajoute les terrains propres à David.
- `david/index.html` : interface mobile-first identique à la collection.

**Les objets symboliques ne doivent pas être confondus avec une reconstitution.** La forme de la fronde, les maisons, les visages et les couleurs des vêtements sont inventés. Le combat n’est jamais joué en tant qu’action violente et aucune blessure n’est représentée graphiquement. Le jeu explique que la confiance de David ne garantit pas automatiquement une victoire personnelle dans toutes les situations.

## Cadre d’évaluation

Éden demeure la référence esthétique. La grille `quality/` permet de noter chacun des cinq mondes sur 100 : direction artistique /25 ; illustrations /20 ; personnages /15 ; contenu biblique /15 ; ergonomie mobile /15 ; cohérence moteur /10.

**Seuil de passage : au moins 85/100, aucun critère sous 60 %, aucun problème bloquant**, vérification biblique et essais humains (smartphone et public cible). Une batterie de tests automatiques valide le fonctionnement et non la beauté des scènes.

## Vérification

Workflow GitHub Actions : `.github/workflows/pixel-v06-qa.yml`. Script Playwright : `tests/pixel-v06-smoke.cjs`. Il parcourt les cinq récits, les 50 labyrinthes théoriques (5 mondes × 5 chapitres × 2 difficultés), vérifie le chargement des images, les déplacements clavier/tactiles, les sauvegardes et le comparateur, puis joue les premiers chapitres de Moïse et de David jusqu’à la question et au souvenir.

## Déploiement et conservation

Après validation, l'essai est proposé dans `pixel-lab-v06/` sur GitHub Pages. Toutes les versions précédentes restent disponibles : aucune modification de `bible-aventure/`, `pixel-lab-v05/` ou des dossiers plus anciens.

## Étape suivante

Après les essais de David et la comparaison visuelle avec Éden, appliquer le même protocole à **Jonas et Ninive**, sans sacrifier la profondeur biblique ni la lisibilité pour les enfants.
