# Bible Aventure — Pixel Lab v0.4 · Standard artistique de la collection

## But de cette version
Faire d'Éden la **référence artistique** de toute la collection. La v0.4 perfectionne les mondes Noé et Joseph sans modifier les cinq chapitres bibliques, la progression, les collisions ou la difficulté des labyrinthes.

**À ne pas confondre :** un test automatisé qui passe valide le chargement et le fonctionnement, mais n'attribue pas une note artistique. Les anciennes estimations de 92/100, 78/100 et 75/100 n'étaient pas des scores calculés et vérifiés. Le présent document fixe un barème reproductible et une revue manuelle.

## Feuille de route et état de réalisation

| Lot | Livrable | Validation |
| --- | --- | --- |
| 1 — Architecture | Nouveau dossier isolé `pixel-lab-v04/`, moteur Canvas conservé, sauvegardes autonomes v0.4 avec migration v0.3 | Automatique |
| 2 — Illustration | Cinq scènes par récit ; reliefs, végétation, lumières et objets narratifs approfondis dans `shared/art-factory.js` | Technique + comparaison visuelle |
| 3 — Personnages | Noé et Joseph avec atlas de 20 poses / héros (256 × 400 px), détails de silhouettes et vêtements | Technique + inspection humaine |
| 4 — Terrains | Objets propres à chaque histoire, absence de Noé dupliqué et de moutons dans Joseph | Inspection + régression |
| 5 — Interface | Pages de récit, grille des chapitres, contraste, commandes mobiles, grille de comparaison `quality/` | Chromum + revue humaine |
| 6 — Pédagogie | Distinction claire entre récit biblique et mise en scène imaginée | Relecture humaine |
| 7 — Publication | Tests Chromium/Playwright, screenshots, publication GitHub Pages indépendante | Automatique + essai Android réel |

## Standard qualité à réutiliser pour les sept autres récits

Échelle sur 100 points :

| Critère | Maximum | Mesures à examiner |
| --- | ---: | --- |
| Direction artistique | 25 | Identité (10), beauté perçue (10), mémorisation (5) |
| Illustrations | 20 | Différenciation des cinq chapitres (10), détails (5), profondeur (5) |
| Personnages | 15 | Silhouette mobile (5), poses (5), cohérence de style (5) |
| Pédagogie biblique | 15 | Clarté (5), fidélité (5), distinction récit/interprétation (5) |
| Ergonomie mobile | 15 | Commandes (5), lisibilité (5), fluidité (5) |
| Moteur et collection | 10 | Compatibilité (5), unité visuelle (5) |

Conditions impératives d'ouverture de la production d'un nouveau récit :
1. **85/100 minimum** après revue documentée, sans critère obligatoire sous 60 %.
2. Aucun défaut bloquant de déplacement, sauvegarde, chapitre, accès aux livres ou sortie.
3. Tous les événements bibliques vérifiés dans les passages et aucune affirmation visuelle présentée comme fait lorsque le texte est silencieux.
4. Validation sur au moins un smartphone physique et un petit test d'utilisation par un enfant du public visé.
5. Conservation de la précédente version et plan de retour arrière.

L'atelier comparateur est disponible à `pixel-lab-v04/quality/`. Les huit critères de perception se cochent sur le téléphone de l'évaluateur ; ils ne constituent pas automatiquement une note sur 100.

## État vérifiable

- Les trois récits emploient le même moteur Canvas et leurs cinq chapitres existants.
- Éden conserve ses planches et images d'origine, qui servent de référence.
- Noé et Joseph utilisent un atelier SVG local avec des fonds à couches et des motifs propres à chaque chapitre.
- 20 poses sont disponibles sur chacune des nouvelles planches de 256 × 400 pixels ; les images de chapitre mesurent 800 × 600 pixels.
- Aucun service tiers n'est nécessaire au fonctionnement.
- Les images sont des **interprétations artistiques** ; elles ne reconstituent pas avec certitude l'Égypte ancienne, l'arche ou les vêtements historiques.

**La certification des notes n'est pas faite avant la revue visuelle et le test physique.** Ce document ne revendique donc pas que Noé ou Joseph ont atteint 85/100.

## Tester

- Ouvrir `pixel-lab-v04/` pour choisir un récit.
- Ouvrir `pixel-lab-v04/quality/` pour comparer les cinq chapitres d'Éden, Noé et Joseph.
- La CI `.github/workflows/pixel-v04-qa.yml` exécute `tests/pixel-v04-smoke.cjs`, contrôle 3 tailles d'écran, les commandes et les dix variantes de labyrinthes, ainsi que les illustrations comparées.
- Inspecter les captures d'écran de la CI : elles n'impliquent pas à elles seules une homologation artistique.

## À industrialiser ensuite

Le prochain pack narratif (Moïse) ne sera ouvert qu'après accord sur les résultats de qualité. Chaque pack devra fournir : cinq chapitres vérifiés, cinq scènes, un atlas principal de 20 poses, objets thématiques documentés, charte locale de couleurs et suite de tests de régression. Cette règle s'appliquera ensuite à David, Jonas et aux autres récits.
