# Cahier des Charges : Mon Prof IA

## 1. Présentation du Projet
**Nom de l'application :** Mon Prof IA
**Objectif :** Offrir une plateforme éducative interactive et ludique pour les élèves du primaire et du collège, utilisant l'IA pour simplifier des cours complexes à partir de documents PDF.
**Cible :** Enfants (7-15 ans), Enseignants et Parents.

---

## 2. Objectifs Fonctionnels
- **Simplification Pédagogique :** Transformer des textes académiques en explications adaptées au niveau de l'élève (du CP à la 3ème).
- **Interactivité :** Utiliser une mascotte animée (Hibou) pour guider l'élève via la voix et des bulles de dialogue.
- **Vérification des Acquis :** Générer des mini-quiz de 3 questions basés sur le contenu du document téléchargé.
- **Accessibilité Multilingue :** Support complet du Français et de l'Arabe (RTL).
- **Engagement :** Système de badges et suivi des progrès pour encourager l'apprentissage.

---

## 3. Spécifications Techniques
### 3.1 Stack Technologique
- **Frontend :** React 18+ avec Vite.
- **Stylisation :** Tailwind CSS (Design System "Vibrant Palette").
- **IA (Cœur) :** Google Gemini API (Google GenAI SDK) pour l'analyse et la simplification.
- **Traitement PDF :** PDF.js (extraction locale de texte).
- **Synthèse Vocale :** Web Speech API (Voix française/arabe intégrée au navigateur).
- **Animations :** Motion (Framer Motion).
- **Icônes :** Lucide React.

### 3.2 Gestion des Données
- **Architecture :** Client-side uniquement (Pas de backend).
- **Persistance :** LocalStorage du navigateur.
- **Vie privée :** Aucune donnée personnelle n'est envoyée à un serveur tiers, excepté le texte du cours envoyé de manière anonyme à l'API Gemini pour traitement.

---

## 4. Architecture de l'Application
### 4.1 Composants principaux
- `App.tsx` : Contrôleur principal (Gestion des routes, thèmes et modes d'affichage).
- `Sidebar.tsx` : Navigation adaptative et gestion du profil.
- `LessonView.tsx` : Interface d'étude (Upload, Mascotte, Tableau Blanc).
- `QuizModal.tsx` : Moteur de quiz généré à la volée par l'IA.
- `Dashboard.tsx` : Visualisation des statistiques et badges.
- `ProfileSetup.tsx` : Onboarding et personnalisation.

### 4.2 Services
- `aiService.ts` : Interaction avec Gemini (Simplification, génération de Quiz).
- `pdfService.ts` : Parsing des fichiers PDF.
- `speechService.ts` : Contrôle de la synthèse vocale.
- `storageService.ts` : Interface avec le LocalStorage.

---

## 5. Design & Ergonomie (UX/UI)
- **Aesthétique :** Style "Cartoon/Modern" avec la palette "Vibrant".
- **Responsive Design :** 
  - Mode PC (Plein écran).
  - Mode Mobile (Portrait/Paysage) avec simulateur intégré dans les réglages.
  - Sidebar rétractable en mode mobile pour maximiser l'espace de lecture.
- **Masquage intelligent :** La barre latérale se ferme automatiquement après une action sur mobile.

---

## 6. Sécurité et Contraintes
- **Mode Enfant :** Pas de liens externes, interface simplifiée, boutons larges.
- **Optimisation Storage :** Le texte brut des PDF n'est pas stocké pour éviter de saturer le LocalStorage (seule la version simplifiée est conservée).
- **Performance :** Limitation du traitement aux 10 premières pages des PDF pour garantir la fluidité sur navigateurs mobiles.

---

## 7. Évolutions Futures
- Support de la reconnaissance vocale pour poser des questions à la mascotte.
- Mode Hors-ligne complet (PWA).
- Exportation des résumés en fiches de révision imprimables.
