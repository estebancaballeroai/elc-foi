# Guide graphique — Le jardin de l’arche

## Intention

Une promenade lumineuse, calme et curieuse. Le petit explorateur fictif apprend le récit de Noé sans en modifier les événements. Pas de combat, d’angoisse liée au déluge, de chronomètre ou de représentation de Dieu. Le chapitre couvre Genèse 6, 9–22 : Noé, les instructions pour l’arche et son obéissance. Il n’anticipe pas l’arc-en-ciel de Genèse 9.

## Composition et échelle

Vue orthographique de dessus avec faces sud visibles, sans grille isométrique. Carte logique de 27 × 19 cases de 32 px. Le personnage utilise des cellules de 48 × 64 px, pieds en [24, 60], dessinées dans une zone de 32 × 43 px. L’arbre occupe environ 44 × 54 px, Noé 26 × 39 px, l’arche 256 × 194 px. Les silhouettes sont triées par la position des pieds pour assurer le passage devant et derrière les arbres.

L’explorateur porte une tunique bleu pétrole, un foulard rouge et un sac miel : sa silhouette se distingue du décor. Noé porte une robe ocre, une écharpe bleu pétrole et une barbe blanche. Les décors maintiennent la même lumière venant du nord-ouest. Les animaux sont paisibles et stylisés.

La caméra suit le personnage ; le mobile montre moins de terrain qu’un desktop. Le cadrage de la clairière de l’arche doit préserver sa lecture comme destination. Les commandes sont superposées aux coins inférieurs et le centre reste libre pour le personnage.

## Palette

| Usage | Couleur directrice |
| --- | --- |
| Texte et contours profonds | `#183f39` |
| Ombres végétales | `#37634c` |
| Mousse et feuillages | `#59845b` |
| Sauge et lumière des feuilles | `#a5bc75` |
| Bois et récompenses | `#ddb46b` |
| Chemins | `#e4c68b` |
| Papier et interface | `#fff0c9` |
| Eau | `#4d9eac` |

Ce sont des couleurs directrices : les PNG générés comportent davantage de nuances. Une réduction stricte à une palette indexée reste une amélioration possible.

## Règles pixel art

- PNG à transparence réelle ; aucun fond magenta restant autour des sprites utiles.
- Rééchantillonnage au plus proche voisin et `imageSmoothingEnabled=false` ; pas d’agrandissement flou.
- Les originaux ImageGen sont conservés : le rendu n’est pas une garantie de pixels dessinés manuellement ou d’un atlas parfait à la sortie du générateur.
- Animation de marche : quatre poses bas, gauche, droite, haut ; même point d’appui. Les poses 1 et 3 servent de repos.
- Petits effets sur Canvas : éclats carrés, ondulations de l’eau et points d’indice. Les animations décoratives sont désactivées avec `prefers-reduced-motion`.
- Les livres se reconnaissent par leur silhouette et leur scintillement ; les livres découverts restent présents avec une opacité réduite.
- Le texte de lecture reste en HTML, sur papier clair, pour conserver sa netteté et le focus clavier.

## Comparer les concepts au pilote

Les concepts sont une cible d’ambiance et de composition, pas des captures du jeu. Leurs illustrations sont plus denses, leurs chemins plus organiques et leur mise en scène plus riche. Le pilote emploie des sprites indépendants sur un vrai labyrinthe : il reprend la palette, les cèdres, les fleurs, les livres, l’arche et les personnages, mais assume une structure de chemins plus géométrique. Voir le rapport de recette pour les corrections réellement appliquées et les limites restantes.
