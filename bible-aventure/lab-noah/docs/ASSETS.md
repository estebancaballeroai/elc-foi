# Inventaire des ressources

Toutes les illustrations nouvelles du pilote ont été générées spécifiquement pour cette mission avec ImageGen, à partir de descriptions originales conservées ici. Aucune image de Phantasy Codex Adventure ou d’une autre franchise n’a été importée. Le texte biblique cité vient de la Louis Segond 1910 ; les résumés sont originaux.

## Sources conservées

| Fichier | Contenu | Prompt |
| --- | --- | --- |
| `assets/source/concepts.png` | Planche de deux écrans conceptuels | `docs/prompts.json` → concepts |
| `assets/source/explorer-generated.png` | Personnage, 4 directions × 4 poses | `docs/prompts.json` → explorer |
| `assets/source/garden-generated.png` | 9 objets et personnages du jardin | `docs/prompts.json` → environment |
| `assets/source/terrain-generated.png` | 4 matériaux de terrain | `docs/terrain-prompt.txt` |

Les sources sont des archives de fabrication et ne sont pas téléchargées au lancement du jeu.

## Ressources runtime

| Ressource | Usage |
| --- | --- |
| `explorer.png` | Atlas transparent 192 × 256 ; cellules 48 × 64 |
| `frames/explorer-{direction}-{0..3}.png` | 16 poses individuelles, pieds normalisés à y=60 |
| `cedar.png` | Cèdre, variantes de taille et position en jeu |
| `flowers.png` | Arbuste fleuri, bordures du labyrinthe |
| `boulder.png` | Rochers et rive |
| `ark.png` | Arche complète avec rampe, 256 × 193 après découpe proportionnelle |
| `noah.png` | Noé et son bâton |
| `sheep.png` | Paire de moutons |
| `book.png` | Livre, interface et découvertes |
| `doves.png` | Paire de colombes |
| `chest.png` | Coffre et médaille du bâtisseur |
| `grass.png`, `sand.png`, `water.png`, `planks.png` | Matériaux de 96 × 96, échantillonnés par case |
| `atlas.json` | Coordonnées des poses, ancres et boîtes de découpe manuelles |

`asset-manifest.json` donne les dimensions exactes, tailles et SHA-256 de tous les PNG. Les dimensions réelles de ce manifeste font foi.

## Fabrication reproductible

Depuis la racine : `python bible-aventure/lab-noah/tests/process_assets.py` (Pillow requis). Les rectangles de découpe sont explicites : la génération du décor n’a pas respecté une grille régulière autour de la grande arche, donc ses cases n’ont pas été découpées automatiquement en tiers. Le personnage est recadré pose par pose puis aligné sur la même ligne de pieds.

Le fond magenta technique a été retiré par détourage chromatique. Ce traitement et les exports nearest-neighbor sont une étape de préparation des ressources ; les dessins sources restent ceux d’ImageGen. La palette et le dessin détaillé ne sont pas garantis comme un travail manuel pixel par pixel.

## Animations et effets

La marche est une vraie animation par images distinctes dans les quatre directions. Les animaux et Noé restent des sprites fixes. L’eau, les lucioles, les éclats de découverte et la flèche de destination utilisent de petits éléments Canvas. Il n’existe pas encore d’animation dédiée d’embarquement des animaux ni de cinématique de pluie : le pilote raconte uniquement la préparation de l’arche.
