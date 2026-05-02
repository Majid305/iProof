# Guide de Déploiement : Mon Prof IA (GitHub + Vercel)

Ce projet est une application React (Vite) prête à être déployée sur Vercel via GitHub.

## 🚀 Étapes de déploiement

1.  **Créer un dépôt sur GitHub** : Poussez votre code sur un nouveau dépôt GitHub.
2.  **Importer sur Vercel** : Connectez votre compte Vercel à GitHub et importez le projet.
3.  **Configurer les Variables d'Environnement** :
    *   Dans les paramètres du projet sur Vercel, allez dans **Environment Variables**.
    *   Ajoutez la clé suivante :
        *   `GEMINI_API_KEY` : Votre clé API Google AI Studio (obtenue sur [aistudio.google.com](https://aistudio.google.com)).
4.  **Déployer** : Vercel détectera automatiquement les paramètres de build pour Vite (`npm run build`).

## 🛠 Configuration technique
*   **Framework** : Vite / React
*   **Routing** : Géré via `vercel.json` (redirection vers `index.html` pour le mode SPA).
*   **Sécurité** : La clé API est injectée au moment du build par Vite. 

> [!CAUTION]
> Comme il s'agit d'une application 100% côté client (MVP), la clé API est présente dans le bundle Javascript. Pour une version de production à large échelle, il est recommandé de passer par un proxy backend (Vercel Functions) pour masquer la clé.

## 📦 Commandes utiles
- `npm run dev` : Lancer le serveur de développement.
- `npm run build` : Générer les fichiers de production dans le dossier `dist/`.
- `npm run lint` : Vérifier les erreurs de code.
