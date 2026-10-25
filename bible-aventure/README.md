# Bible Aventure v2.1 — Design LAB (expérimental)

Prototype de refonte de la **v2.0 : 10 récits / 50 labyrinthes**. Ne pas fusionner dans `main` sans validation.

**Figma :** https://www.figma.com/design/rUUAvcffXe9FVzmcqBWy3T

## Travail effectué
- Accueil repensé pour mobile, cartes des 10 récits défilantes horizontalement.
- Écran de Noé : mission et déplacements mieux différenciés, contrastes et dimensions optimisés.
- Récompenses : médaillons, insignes, albums et gros caractères.
- Code JavaScript de v2.0 inchangé (SHA-256 74986fee49df413eb197790c577d1d97ece1eada4ece992233dbe6966201920b). Les 10 récits, questions, étoiles et la clé de sauvegarde locale sont conservés.

## Recette
- 100 labyrinthes (50 chapitres × 2 difficultés) franchissables.
- 50 chapitres joués automatiquement de bout en bout.
- 46 contrôles supplémentaires de migration, paramètres, sauvegarde et rendu responsive.
- Écrans vérifiés à 320, 390, 768 et 1280 px, sans erreur JavaScript détectée.

## Limite
Quota Figma MCP Starter atteint : comparaison exacte avec les trois maquettes inaccessible. Cette interface est une **proposition graphique inspirée du cahier des charges**, pas une reproduction certifiée des maquettes. Elle doit faire l'objet d'une validation graphique et d'un test réel sur ancienne tablette.

## Versions
- Production : branche `main` (v2.0), inchangée.
- Sauvegarde : `backup/bible-aventure-v2.0-20261025`.
- Prototype : `experimental/bible-aventure-v2.1-design`.
