# Résultats de recette — 25 octobre 2026

## État initial vérifié

- Copie de départ : `102dae656c3bf03e03c4b8c3d3ddbaa14077085a`, Bible Aventure v2.0. Le smoke test existant fourni dans l’environnement est relancé avant tout travail : portail, dix récits, mode sauvegardé, démarrage du chapitre, Canvas et mobile réussissent. Preuve : [baseline-main.txt](../captures/baseline-main.txt).
- Dépôt distant vérifié : `main` est à `898765fe4ba43d8eb278bd61e9ec0ec52ac5948b`. Il comporte aussi un aperçu expérimental dans un dossier séparé. Le dernier workflow Pages consulté est en succès, mais ce workflow ne contient pas de suite de tests de gameplay : ce succès n’est pas compté comme une recette.
- Branche de base : `experimental/bible-aventure-v2.1-design`, commit `ef762a85d46ac479a28e04ec941585ba86fb9bab`, version v2.1.1. Son README documente une recette antérieure des 50 chapitres ; les résultats ci-dessous sont ceux relancés pour cette mission. Smoke test v2.1.1 : [baseline-v2.1.1.txt](../captures/baseline-v2.1.1.txt).
- Nouvelle branche : `experimental/bible-aventure-noah-pixel-lab`, issue exactement de cette base. Ni `main` ni la branche source n’ont été modifiées.

## Résultats finaux

**71 contrôles de recette navigateur + 9 contrôles de ressources + 7 essais complémentaires = 87 contrôles réussis.** Aucune erreur JavaScript relevée dans les parcours testés. Le smoke test existant est aussi relancé séparément ; il n’est pas inclus dans ce total.

### Jeu historique

Les dix récits et les cinquante chapitres sont présents. Les 100 cartes, soit 50 dans chacune des deux difficultés, ont leurs livres, énigmes, souvenirs et sortie accessibles. Les 50 chapitres démarrent. Preuve détaillée : [legacy-maps.json](../captures/legacy-maps.json).

Ce contrôle ne constitue pas un nouveau parcours complet de chacune des interactions des 50 chapitres. Les quatre parcours complets par entrées réelles concernent le nouveau pilote Noé.

### Pilote : quatre parcours complets

| Taille | Pas parcourus par vraies touches | Résultat |
| --- | ---: | --- |
| 320 × 568 | 51 | PASS |
| 390 × 844 | 51 | PASS |
| 768 × 1024 | 51 | PASS |
| 1280 × 900 | 51 | PASS |

Sur chaque format :

- Commandes tactiles de 48 px visibles dès la première vue, sans débordement horizontal.
- Touche réelle sur une flèche ; collision de la rivière ; navigation par toucher d’un chemin.
- Collecte des trois livres par de vraies touches clavier, sans téléportation ni modification de progression par les tests.
- Rechargement : livres et position repris ; mauvaise réponse explicable ; médaille obtenue et conservée ; carnet relisible.
- Cadrage devant l’arche : les rectangles de Noé et de l’explorateur ne recouvrent aucune commande.
- Une valeur témoin dans la sauvegarde historique est conservée exactement après le parcours.

[Résultats JSON](../captures/test-results.json) · [Captures](../captures/)

### Robustesse et confort

Repli touch sans `PointerEvent`, mouvements réduits, quota localStorage atteint, JSON corrompu, champs invalides, image manquante et focus contenu dans les dialogues sont testés. Le jeu signale les échecs de sauvegarde et de chargement. Un maintien du bouton produit plusieurs pas puis s’arrête au relâchement.

### Ressources et compatibilité syntaxique

16 poses séparées contrôlées, atlas 4 × 4 de cellules 48 × 64, pieds alignés à y=60, au moins deux poses distinctes par direction, transparence et absence de fond magenta contrôlées. Neuf objets détourés et quatre matériaux réutilisables. Total des images chargées par le jeu : **267,428 octets**, environ 261 Kio. Les sources et concepts ne sont pas chargés par le runtime.

Le script `game.js` passe l’analyseur Acorn en `ecmaVersion: 5`, sans transpilation. [Preuve](../captures/syntax-check.txt). Les bibliothèques de test ne sont pas livrées au runtime.

### Version HTML autonome

Le fichier unique contient les styles, le script et les images nécessaires. Il a été exécuté dans Chromium via le serveur local : une requête document, aucune requête HTTP supplémentaire pour les ressources, déplacement et dialogues fonctionnels.

L’ouverture `file:` n’a pas pu être testée dans le Chromium géré : sa politique renvoie `ERR_BLOCKED_BY_ADMINISTRATOR`. Ce refus concerne ce mode d’ouverture, pas les tests navigateur HTTP qui ont bien été exécutés. La persistance depuis `file:` dépend aussi du navigateur de l’utilisateur.

[Essais complémentaires](../captures/extra-tests.json) · [HTML autonome](../noah-autonome.html)

## Isolation de la production

Tout le travail est ajouté dans `bible-aventure/lab-noah/`. Le fichier historique `bible-aventure/index.html` est identique à celui de la base v2.1.1 ; SHA-256 :

`5294d768f8da2c90cd348708959584add7a9ef7fec1b7eb75a6daefa725e9ea4`

Le workflow Pages et le portail de la base ne sont pas modifiés. La clé du pilote est `bible-aventure-lab-noah-pixel-v1`. Il n’y a ni migration ni écriture dans `bible-aventure-eden-premium-v01`. Aucun merge, déclenchement de publication ou déploiement de production.

## Disponibilité et limites

**ImageGen : disponible et utilisé. Playwright/Chromium : disponibles et exécutés.**

- Pas de recette sur un Android/WebView ancien physique, ni dans Firefox ou Safari.
- Pas d’audit WCAG complet ; la version n’est pas intégralement jouable au lecteur d’écran.
- Les animaux et Noé sont fixes ; seul l’explorateur a une planche de marche dans quatre directions.
- Les concepts sont plus riches et plus organiques que le résultat ; voir la [comparaison artistique](COMPARISON.md). Le pilote ne prétend pas égaler la totalité d’un RPG comme Phantasy Codex Adventure.
- Aucune séance de test avec des enfants de 7 à 11 ans n’a été réalisée.

## Reproduire

Voir [README](../README.md) et [choix techniques](TECHNICAL.md). Les tests `browser.py`, `extra_browser.py`, `existing-smoke.py` et `validate_assets.py` sont livrés. Les captures et rapports sont ceux des exécutions finales ; les essais intermédiaires ayant conduit aux corrections restent dans le dossier de travail local et ne sont pas présentés comme des succès finaux.

## Livraison distante

Après le refus initial de la validation automatique, l’utilisateur a explicitement autorisé l’envoi de la seule branche `experimental/bible-aventure-noah-pixel-lab` sur GitHub, sans fusion ni déploiement. Cet envoi utilise Git sans forçage. L’autorisation ne porte sur aucune modification de `main` ni de la branche v2.1 ; le workflow GitHub Pages reste limité aux pushes sur `main` et à son déclenchement manuel.
