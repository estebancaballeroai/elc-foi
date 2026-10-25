# Bible Aventure v2.1.1 — stabilisation expérimentale

**Ne pas fusionner ni déployer en production sans validation.** La branche `main` reste en v2.0 (10 récits / 50 chapitres).

Correctifs de l’audit Codex :
- P1 : commandes visibles dès l’ouverture sur mobile, superposées au labyrinthe, taille 48 × 48 px, sans chevauchement ; mission dépliable ; en-tête raccourci.
- P1 : focus contenu dans les dialogues et restauré à la fermeture.
- P1 : échec de sauvegarde signalé avec bouton Réessayer ; regroupement des écritures pendant les déplacements.
- P2 : récupération des entrées de progression altérées ; voix FR arrivant tardivement ; formulation de la fin d’histoire ; animations Canvas arrêtées avec `prefers-reduced-motion` ; description textuelle des chemins et objectifs ; contrastes ajustés.
- Repli CSS `vh` avant `dvh`.

Tests Chromium/Playwright : les 100 cartes des deux difficultés sont accessibles ; les 50 chapitres sont traversés complètement (158 livres, 146 énigmes, 200 souvenirs), avec sauvegarde et rechargement ; 30 configurations de géométrie ciblées (2 récits, 5 tailles, 3 polices) ; 20 contrôles de robustesse et d’accessibilité ; commandes et clavier réels testés sur 4 tailles ; aucune erreur JavaScript.

**Limites :** pas de comparaison exacte aux maquettes Figma (quota), ni de test physique Android/WebView, ni d’audit complet WCAG 2.2. Validation utilisateur et mode graphique léger encore à réaliser.

**Sauvegarde avant correctifs :** branche `backup/bible-aventure-v2.1-design-avant-correctifs-20261025` au commit `2dbe4cf`. Aucun changement sur `main`.
