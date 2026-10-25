# Comparaison artistique — ambition et résultat

La référence Phantasy Codex Adventure décrit une démarche de RPG rétro complet : artwork généré, animations directionnelles, interface et retours de récompense, puis itérations répétées sur téléphone et desktop. Le présent LAB reprend cette exigence de ressources réelles et de test, sur un périmètre volontairement limité à un chapitre de Noé. Aucun graphisme, personnage ou gameplay de combat n’a été repris.

## Cible créée avant intégration

- [Concept 01 — explorer](../assets/concept-01.png) : jardin de cèdres, trois livres, grande arche et animaux ; lecture immédiate des chemins.
- [Concept 02 — découvrir](../assets/concept-02.png) : même monde avec livre ouvert et retour de découverte.

Ces images proviennent de la planche ImageGen, pas du moteur du jeu. La composition initiale est plus panoramique et les chemins plus organiques que les couloirs de la carte jouable.

## Ce qui est effectivement intégré

| Dimension | Résultat concret | Limite |
| --- | --- | --- |
| Personnage | Explorateur original en 16 poses PNG, 4 directions ; point d’appui normalisé | Petite animation de marche, sans animation dédiée de lecture ou d’accroupissement |
| Monde | Cèdres, fleurs, rochers, arche, animaux, livres et coffre générés puis découpés | Répétition perceptible des mêmes arbres et rochers |
| Terrain | Quatre matériaux générés, ombres de contact et bordures végétales irrégulières | Topologie encore géométrique ; la couture des textures n’a pas été peinte à la main |
| Profondeur | Objets triés par les pieds ; le personnage passe devant et derrière la végétation | Pas d’éclairage dynamique ou de couches de canopée évoluées |
| Eau et effets | Ondulations animées, particules et indice visuel sur le chemin | Effets simples ; pas de simulation d’eau ni de météo |
| Interface | Livre d’exploration lisible, carnet et retour de médaille | Interface HTML plus sobre que le cadre illustré du concept |
| Gameplay | Trois découvertes, interaction avec Noé, animaux et coffre, question finale, sauvegarde | Un seul chapitre ; animaux fixes, sans embarquement animé |
| Mobile | Commandes tactiles et cadrage spécifique de la clairière de l’arche | Le petit écran impose une vue partielle ; aucun test physique ancien Android |

## Corrections visuelles effectuées

1. Le premier sol procédural était trop plat. Il a été remplacé par de vrais PNG de terrain générés, avec échantillonnage des matériaux herbe, sable, eau et bois.
2. Les bords de chemins étaient trop réguliers. Des petites franges d’herbe et une rive rocheuse ont été ajoutées ; la taille des arbres et leur placement varient sans changer les collisions.
3. Les arbres semblaient posés sur le sol. Des ombres de contact ont été ajoutées sous les troncs.
4. Le cadrage initial cachait l’essentiel de l’arche. La caméra élargit son champ et modifie son point d’appui dans cette clairière sur petit écran. La première correction a révélé un risque de recouvrement par les commandes ; le contrôle géométrique des deux personnages devant l’arche fait désormais partie de la recette.
5. Des pixels d’une ligne voisine de l’atlas faussaient la hauteur des poses vers la droite. La découpe identifie désormais la silhouette principale avant recadrage. Toutes les directions ont la même ligne de pieds.

## Appréciation

Le résultat utilise des graphismes de jeu réutilisables et un vrai parcours, avec un niveau de détail sensiblement supérieur aux formes Canvas et emojis de départ. Il ne rejoint pas encore toute la finesse des concepts ou la richesse de Phantasy Codex Adventure. Le progrès le plus utile ensuite serait de peindre des variantes de bordures et de végétation, puis d’ajouter des animations aux animaux et une courte scène de rencontre avec Noé, avant d’élargir le périmètre.

[Captures finales](../captures/) · [Revue visuelle](../review.html) · [Résultats de recette](RESULTS.md)
