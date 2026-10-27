# Bible Aventure · Moteur Pixel commun 0.1

Architecture experimentale de trois mondes bibliques jouables en autonomie, mobile-first, hors service distant.

## Sources

- `shared/engine.js` : moteur Canvas 2D derive d'Eden Pixel 2.5 (deplacement, generation de cartes, recherche BFS, camera, collisions, animation, interactions, sauvegarde locale et points de controle pour tests).
- `shared/style.css` : styles mobiles et variations graphiques selon le monde.
- `stories/eden.js` : cinq chapitres et images originales conservees d'Eden 2.5.
- `stories/noe.js` : cinq chapitres et images originales conservees de Noe 2.3.1.
- `stories/joseph.js` : cinq chapitres de Joseph issus du jeu v2.0 et cinq illustrations SVG originales dans les tons du Nil et de Canaan.
- `eden/index.html`, `noe/index.html`, `joseph/index.html` : interfaces reutilisant les memes composants.

## Etat graphique

Eden : deux personnages animes en planche 20 poses chacun ; cinq grandes illustrations.
Noe : reutilisation des sprites de Noe et de ses textures ; ajout du nouveau moteur de camera et de traces de pas ; cinq ambiances de decor. Ces ameli orations n'ajoutent pas encore un nouveau sprite de Noe jouable.
Joseph : premier pilote, dont le decor et les cinq illustrations sont propres au recit. Sprite d'explorateur provisoire reutilise de Noe, a remplacer par un personnage Joseph dedie.

## Donnees bibliques

Recits bases sur Genese 2-3, 6-9 et 37-45. Les citations textuelles des traductions protegees ont ete evitees dans les nouveaux contenus. Les descriptions sont des paraphrases pedagogiques ; chemins, accessoires et paysages decoratifs sont imagines. Le jeu doit distinguer les faits du texte biblique des interpretations et des illustrations.

## Regression

Le test `tests/pixel-shared-smoke.cjs` lance Chromium pour 390, 360 et 768 px. Il verifie le chargement des trois packs, les cinq chapitres, les dix cartes procedurales par recit, les déplacements, les contrôles Android, l'accessibilite des destinations, la sauvegarde et les erreurs JavaScript. L'execution continue se declenche sur la branche experimentale.

## Isolation

Ce laboratoire n'ecrase ni `bible-aventure/`, ni les essais Eden/Noe precedents. Chaque monde utilise sa propre cle locale `bible-aventure-pixel-shared-v01-<id>`.

## Etapes suivantes

1. Validation sur smartphones physiques.
2. Remplacement des graphismes provisoires de Joseph et animation de nouveaux PNJ de Noe.
3. Harmonisation complete des sprites et des atlas.
4. Migration vers les sept autres recits bibliques seulement apres validation pedagogique et technique.
