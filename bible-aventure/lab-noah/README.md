# Noé — Le jardin de l’arche · Pixel Art LAB

Un chapitre pilote autonome, jouable au clavier et au toucher, sur une branche issue de v2.1.1. Aucun changement aux 10 récits et 50 chapitres existants.

## Essayer

Depuis la racine du dépôt :

```sh
python -m http.server 8000 --bind 127.0.0.1
```

- Jeu : `http://127.0.0.1:8000/bible-aventure/lab-noah/`
- Revue artistique et comparaison : `http://127.0.0.1:8000/bible-aventure/lab-noah/review.html`
- Galerie animée : `http://127.0.0.1:8000/bible-aventure/lab-noah/assets/gallery.html`
- Fichier unique à télécharger : [noah-autonome.html](noah-autonome.html), toutes les images nécessaires embarquées. L’ouverture directe et la sauvegarde en `file:` dépendent des règles de votre navigateur ; la recette cloud vérifie ce document via HTTP local, car sa politique Chromium interdit `file:`.

Marche : flèches, ZQSD/WASD, grandes flèches tactiles ou toucher d’un chemin. Observer : A, Espace ou E. Chercher les trois livres, puis rejoindre Noé devant l’arche. Les explications permettent de terminer même après une réponse incorrecte.

## Livrables

- [Plan de travail](docs/PLAN.md)
- [Guide graphique et comparaison à la cible](docs/GRAPHIC-GUIDE.md)
- [Inventaire des ressources](docs/ASSETS.md), [manifeste avec SHA-256](docs/asset-manifest.json)
- [Prompts ImageGen](docs/prompts.json) et [prompt terrain](docs/terrain-prompt.txt)
- [Décisions techniques et compatibilité](docs/TECHNICAL.md)
- [Résultats et limites](docs/RESULTS.md)
- [Captures](captures/) : gameplay, livres et récompense à 320, 390, 768 et 1280 px
- [Deux concepts originaux](assets/source/concepts.png)
- [Atlas d’animation](assets/explorer.png), [16 poses séparées](assets/frames/), [coordonnées et ancres](assets/atlas.json)

ImageGen a été utilisé. Playwright et Chromium ont été utilisés. Les animaux et Noé restent fixes ; les quatre directions du personnage sont animées. La profondeur et les textures du pilote sont réelles, mais les chemins restent plus géométriques que les concepts.

## Tests reproductibles

Serveur local en marche et Chromium installé :

```sh
python bible-aventure/lab-noah/tests/existing-smoke.py
python bible-aventure/lab-noah/tests/browser.py
python bible-aventure/lab-noah/tests/extra_browser.py
python bible-aventure/lab-noah/tests/validate_assets.py
```

Dépendances de recette : Python, Playwright, Pillow. `browser.py` utilise `/usr/bin/chromium` ; adapter ce chemin sur une autre machine. Pas de dépendance installée ni de service distant requis pour jouer.

Les tests du pilote utilisent uniquement des entrées réelles pour parcourir le chapitre. `window.NoahLab` expose des diagnostics en lecture et la recherche de chemin, sans téléportation ni raccourci de récompense. Les tests historiques emploient l’interface `__BIBLE_TEST__` déjà présente en v2.1.1 pour la validation des cartes et le démarrage des chapitres.

## Isolation

Branche : `experimental/bible-aventure-noah-pixel-lab`.

Base : `ef762a85d46ac479a28e04ec941585ba86fb9bab` sur `experimental/bible-aventure-v2.1-design`.

Clé du pilote : `bible-aventure-lab-noah-pixel-v1`. Aucune lecture intentionnelle, migration ou écriture dans la sauvegarde historique. Les tests vérifient un témoin de production byte pour byte.

Aucun merge ni déploiement. Les fichiers de la base sont conservés ; tout le travail se trouve dans ce sous-dossier. Gratuit, statique et compatible avec un hébergement GitHub Pages si un déploiement est demandé ultérieurement.
