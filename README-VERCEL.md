# Dashboard SEO - Déploiement Vercel

Dashboard SEO interactif avec graphiques en temps réel et recommandations IA, déployé sur Vercel.

## 🚀 Déploiement sur Vercel

Ce projet est configuré pour être déployé automatiquement sur Vercel.

### Configuration Vercel:
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist/dashboard/browser`
- **Base HREF**: `/` (racine du domaine)

### Étapes de déploiement:

1. **Créer le repository GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/dashboard-seo.git
   git push -u origin main
   ```

2. **Connecter à Vercel:**
   - Allez sur [vercel.com](https://vercel.com)
   - Importez le repository GitHub `dashboard-seo`
   - Vercel détectera automatiquement Angular
   - Cliquez sur "Deploy"

3. **URL de déploiement:**
   - 🌐 `https://dashboard-seo.vercel.app`

## 📊 Fonctionnalités

- KPIs en temps réel (sessions, utilisateurs, pages vues, taux de rebond)
- Graphiques interactifs (Chart.js)
- Filtres avancés (dates, URLs, sources)
- Recommandations IA
- Design responsive
- Connexion backend Google Analytics API

## 🛠️ Stack Technique

- **Frontend**: Angular 17
- **Charts**: Chart.js 4.4
- **Déploiement**: Vercel
- **Backend**: Flask + Google Analytics API (optionnel)

## 🔧 Développement Local

```bash
npm install
npm start
```

Le dashboard sera disponible sur `http://localhost:4200`

## 📡 API Backend

Pour connecter à de vraies données SEO:
1. Déployez le backend Flask sur Railway/Render
2. Mettez à jour l'URL dans `src/app/seo-data.service.ts`
3. Re-déployez sur Vercel

## 🎨 Personnalisation

- Modifier les couleurs dans `src/app/dashboard.component.css`
- Ajouter de nouveaux KPIs dans `src/app/dashboard.component.ts`
- Étendre les graphiques avec de nouvelles données

---

**Développé avec ❤️ pour l'analyse SEO**
