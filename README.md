# Les Trésors de Guadeloupe — prototype v1

Prototype statique HTML / CSS / JavaScript d'une boutique de producteurs locaux.

## Contenu

- `index.html` : structure des pages et formulaires
- `styles.css` : mise en forme responsive
- `app.js` : catalogue, panier, commandes, producteurs, inventaire et sauvegarde locale

## Tester en local

Aucune installation ni compilation n'est nécessaire.

1. Téléchargez et décompressez le projet.
2. Ouvrez `index.html` dans un navigateur récent.
3. Les données de démonstration et vos modifications sont conservées dans le `localStorage` du navigateur.

Pour un test plus proche de l'hébergement, vous pouvez lancer un serveur statique local, par exemple avec l'extension **Live Server** de Visual Studio Code.

## Publier sur GitHub

1. Créez un nouveau dépôt GitHub, par exemple `tresors-guadeloupe`.
2. Envoyez les fichiers `index.html`, `styles.css`, `app.js` et `README.md` à la racine du dépôt.
3. Vérifiez que `index.html` est bien à la racine.

## Déployer sur Cloudflare Pages

Méthode recommandée : connexion au dépôt GitHub.

1. Dans le tableau de bord Cloudflare, ouvrez **Workers & Pages**.
2. Choisissez **Create application** puis **Pages** (ou l'option d'import d'un dépôt Git).
3. Connectez GitHub et sélectionnez le dépôt.
4. Paramètres de build :
   - Framework preset : `None`
   - Build command : laisser vide
   - Build output directory : `/` (racine du dépôt)
5. Lancez le déploiement.

Cloudflare Pages publiera le site sur une adresse `*.pages.dev`. Les mises à jour poussées sur la branche configurée pourront déclencher un nouveau déploiement.

## Limites importantes de cette version

Cette version est un prototype front-end, pas encore une plateforme de commerce en production.

- Les données sont enregistrées dans le navigateur avec `localStorage`. Elles ne sont **pas partagées** entre appareils, utilisateurs ou navigateurs.
- Il n'y a pas de connexion administrateur ni de protection des données.
- Les commandes ne sont pas envoyées par e-mail et aucun paiement réel n'est encaissé.
- Les stocks sont simulés localement.
- Les producteurs et produits fournis sont des exemples fictifs de démonstration.
- Les frais de livraison, taxes, retours, facturation et obligations réglementaires ne sont pas encore gérés.

**Ne saisissez pas de données personnelles ou commerciales réelles dans cette version publique.** Avant une ouverture au public, il faudra ajouter un backend avec base de données, authentification, règles d'accès, sauvegardes et paiement sécurisé, puis traiter les obligations légales et RGPD applicables.
