# Choix techniques et isolation

## Canvas 2D ou bibliothèque ?

Le moteur existant dessine déjà la carte, les objets et les personnages sur Canvas. Sa limite principale pour ce pilote était la direction artistique et la gestion des ressources, pas une impossibilité du Canvas. Le LAB garde Canvas 2D mais extrait un petit moteur autonome : carte de collision stable, BFS de navigation, animation de marche, tri des silhouettes, caméra et effets.

| Option | Bénéfice | Coût pour ce pilote |
| --- | --- | --- |
| Canvas 2D, retenu | Compatible, léger, sans dépendance, fond pré-calculé | Animation, entrées et focus à gérer explicitement |
| Phaser | Scènes, tilemaps, caméra et animations intégrées | Migration et dépendance supplémentaires pour un seul niveau ; validation des versions Android à refaire |
| PixiJS | Batching GPU utile avec des milliers de sprites | Ne fournit pas seul le gameplay ; dépendance et exigence WebGL plus fortes |

Reconsidérer Phaser si le jeu évolue vers de nombreux niveaux illustrés, des scènes scriptées et une équipe d’édition de cartes. Rien dans ce pilote ne justifie encore ce coût. Le moteur du jeu historique et ses 50 chapitres ne sont pas remplacés.

## Compatibilité et performance

- JavaScript analysable en **ECMAScript 5** ; pas de modules, `fetch`, Promises ou WebGL au runtime.
- Canvas 2D et PNG, URLs relatives, aucun service payant, compte ou backend.
- Fond 864 × 608 pré-calculé (~2 Mio RGBA), rendu limité à environ 30 images/s ; exclusion des sprites hors champ. Les images de concepts et sources ne sont pas chargées par le jeu.
- Buffer Canvas adapté à la taille CSS, sans multiplier par le DPR : coût GPU limité sur téléphone.
- Événements Pointer quand disponibles ; repli touch/mouse. Croix de déplacement positionnée sans dépendre de CSS Grid. Ancien navigateur sans Grid : colonne latérale empilée.
- Hauteur `vh` avant `dvh` ; taille minimale du terrain ; textes et dialogues en HTML.
- Sauvegarde à l’arrivée, regroupée par 350 ms pour la position, immédiate pour les livres et la fin, vidée sur `pagehide` et perte de focus.
- Génération et redécoupe hors ligne : Python/Pillow ne font pas partie du runtime.

**Limite de compatibilité** : les tests sont exécutés dans Chromium disponible, avec émulation mobile, et incluent un chemin sans PointerEvent. Ils ne prouvent pas le fonctionnement sur un Android/WebView ancien physique. Les métriques de vitesse de l’environnement cloud ne sont pas des mesures sur téléphone. Faire une recette réelle sur Android 5/6 et sa version de WebView avant d’annoncer un minimum Android garanti. Le jeu historique garde ses propres exigences de compatibilité.

## Sauvegarde

Clé historique : `bible-aventure-eden-premium-v01`.

Clé propre au pilote : `bible-aventure-lab-noah-pixel-v1`.

Aucune migration ni écriture dans la clé historique. Le pilote filtre les IDs de livres invalides, refuse une position non entière ou dans un mur et n’accepte une fin enregistrée qu’avec les trois livres. Un quota ou un refus de stockage produit un avertissement avec Réessayer ; le jeu reste jouable en mémoire. Les tests conservent un témoin de sauvegarde de production et comparent sa valeur exacte après le parcours.

## Accessibilité

Commandes libellées, cibles de 48 px, clavier flèches/ZQSD/WASD, Espace ou E pour observer. Dialogues avec titre, focus contenu, Échap et restitution du focus. État de mission et notifications annoncés. Mode mouvements réduits. Description textuelle du parcours dans l’aide. Ce n’est pas un audit WCAG complet ni une version jouable entièrement au lecteur d’écran.

## Production

Le pilote ajoute uniquement `bible-aventure/lab-noah/`. Le fichier `bible-aventure/index.html`, les récits, les sauvegardes et le workflow Pages de la base restent inchangés. Le workflow existant ne se déclenche automatiquement que sur `main`. Ne pas ajouter ce LAB à `main` ni déclencher de déploiement sans demande explicite.

## Exécuter

Depuis la racine du dépôt :

```sh
python -m http.server 8000 --bind 127.0.0.1
# ouvrir http://127.0.0.1:8000/bible-aventure/lab-noah/
```

Recette navigateur (dépendances de développement seulement) :

```sh
python -m pip install playwright pillow
# adapter executable_path si Chromium n'est pas dans /usr/bin/chromium
python bible-aventure/lab-noah/tests/browser.py
python bible-aventure/lab-noah/tests/validate_assets.py
```

Le fichier `noah-autonome.html` livré à côté du pilote contient les PNG en données embarquées et peut s’ouvrir directement. Il n’inclut pas les 50 chapitres ; utiliser le dépôt et le serveur local pour retourner aux récits existants. La persistance depuis une URL `file:` dépend du navigateur.
