# Plan de travail — pilote Noé

Ce LAB est un ajout isolé sur `experimental/bible-aventure-noah-pixel-lab`, depuis `experimental/bible-aventure-v2.1-design` au commit `ef762a85d46ac479a28e04ec941585ba86fb9bab`. Il ne remplace pas le jeu existant.

1. **État initial** : vérifier le dépôt distant, la base expérimentale, le workflow Pages, les résultats documentés et le smoke test existant. Distinguer les tests effectivement relancés des recettes historiques.
2. **Direction artistique** : deux concepts d’écrans de gameplay, une palette, une vue et un vocabulaire visuel. Référence de qualité et de méthode : [Phantasy Codex Adventure](https://developers.openai.com/showcase/phantasy-codex-adventure), sans reprise de ses images ou personnages.
3. **Ressources** : générer les personnages, objets et textures ; garder les originaux et prompts ; détourer, découper et aligner les animations ; contrôler les atlas.
4. **Boucle jouable** : explorer un seul jardin labyrinthique, trouver trois livres, relire le carnet, observer les animaux, parler à Noé, répondre à une question et recevoir une médaille. Une réponse incorrecte ouvre une explication.
5. **Itération visuelle** : capturer desktop et mobile ; enrichir les sols, rompre les bords rectilignes, ancrer les arbres et recadrer l’arrivée devant l’arche.
6. **Recette** : parcourir le pilote avec des entrées réelles à 320, 390, 768 et 1280 px ; vérifier sauvegarde, collision, dialogues, récompense, dégradation et absence d’erreurs. Contrôler l’accessibilité des 100 cartes historiques.
7. **Livraison** : branche de travail et preuves consultables, documentation et version autonome. Aucun merge, changement de production ou déploiement.

## Critères de sortie

- Les trois livres et la sortie sont accessibles, la fin fonctionne et se conserve après rechargement.
- Le personnage marche dans quatre directions avec quatre poses par direction.
- Commandes de 48 px visibles dans la première vue des quatre tailles testées.
- Aucune écriture dans la clé de sauvegarde de production.
- Graphismes de jeu exportés en PNG, sans emojis ni SVG servant de personnages ou décors.
- Rapport explicite sur les écarts artistiques et les appareils non testés.
