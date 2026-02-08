# 🚀 Guide de Déploiement - Library Manager

Ce guide explique comment déployer l'application Library Manager avec MongoDB Atlas.

## 📋 Architecture de Déploiement

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │  ────>  │    Backend      │  ────>  │  MongoDB Atlas  │
│   (Netlify)     │         │  (Render/Railway)│         │   (Cloud DB)    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

**Important** : Le frontend et le backend doivent être déployés séparément.

## 🌐 Déploiement Frontend (Netlify)

### 1. Préparer le projet

```bash
# Build le frontend
npm run build
```

### 2. Déployer sur Netlify

**Option A : Via GitHub (Recommandé)**
1. Connectez votre repo GitHub à Netlify
2. Netlify détectera automatiquement Vite
3. Configuration automatique :
   - Build command: `npm run build`
   - Publish directory: `build`

**Option B : Via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 3. Configurer les Variables d'Environnement sur Netlify

Dans Netlify Dashboard → Site settings → Environment variables, ajoutez :

```
VITE_API_BASE_URL=https://votre-backend.render.com/api
```

**Remplacez** `https://votre-backend.render.com` par l'URL réelle de votre backend déployé.

## 🔧 Déploiement Backend

### Option 1 : Render (Gratuit, Recommandé)

1. **Créer un compte** sur [render.com](https://render.com)

2. **Créer un nouveau Web Service**
   - Connectez votre repo GitHub
   - Sélectionnez le dossier `server`
   - Configuration :
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Variables d'Environnement sur Render** :
   ```
   PORT=10000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://Betterlife2026:Betterlife2026@onlcluster.otfo1if.mongodb.net/library-manager?retryWrites=true&w=majority
   ```

4. **MongoDB Atlas Configuration** :
   - Allez dans MongoDB Atlas → Network Access
   - Ajoutez l'IP `0.0.0.0/0` (toutes les IPs) OU l'IP de Render
   - Vérifiez que le cluster est démarré (pas en pause)

5. **URL du Backend** :
   - Render vous donnera une URL comme : `https://library-manager-backend.onrender.com`
   - Utilisez cette URL dans `VITE_API_BASE_URL` sur Netlify

### Option 2 : Railway

1. Créez un compte sur [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Sélectionnez le dossier `server`
4. Ajoutez les variables d'environnement (même que Render)
5. Railway génère automatiquement une URL

### Option 3 : Heroku

1. Installez Heroku CLI
2. Créez un `Procfile` dans `server/` :
   ```
   web: node server.js
   ```
3. Déployez :
   ```bash
   cd server
   heroku create library-manager-api
   heroku config:set MONGODB_URI=votre_uri_atlas
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

## 🔐 Configuration MongoDB Atlas

### 1. Network Access
- Allez dans **Network Access** sur MongoDB Atlas
- Cliquez **Add IP Address**
- Ajoutez `0.0.0.0/0` pour autoriser toutes les IPs (ou l'IP spécifique de votre hébergeur)

### 2. Database User
- Créez un utilisateur avec username/password
- Notez les identifiants pour la connection string

### 3. Connection String
Format : `mongodb+srv://username:password@cluster.mongodb.net/library-manager`

## ✅ Checklist de Déploiement

### Frontend (Netlify)
- [ ] Code poussé sur GitHub
- [ ] Site connecté à GitHub sur Netlify
- [ ] Build réussi
- [ ] Variable `VITE_API_BASE_URL` configurée
- [ ] Site accessible sur `https://librarynager.netlify.app`

### Backend (Render/Railway/Heroku)
- [ ] Backend déployé et accessible
- [ ] Variables d'environnement configurées :
  - [ ] `MONGODB_URI`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT` (généré automatiquement par l'hébergeur)
- [ ] Test de l'endpoint `/api/health` : doit retourner `{"status":"ok","database":"connected"}`
- [ ] Swagger accessible sur `/api-docs`

### MongoDB Atlas
- [ ] Cluster démarré (pas en pause)
- [ ] IP autorisée dans Network Access
- [ ] Utilisateur de base de données créé
- [ ] Connection string correcte dans les variables d'environnement

## 🧪 Tests Post-Déploiement

1. **Test Frontend** :
   - Accédez à `https://librarynager.netlify.app`
   - Vérifiez que la page se charge

2. **Test Backend** :
   - Testez `https://votre-backend.onrender.com/api/health`
   - Devrait retourner : `{"status":"ok","database":"connected"}`

3. **Test Intégration** :
   - Depuis le frontend Netlify, essayez de charger des livres
   - Vérifiez la console du navigateur pour les erreurs CORS

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que le backend autorise l'origine Netlify dans CORS
- Vérifiez que `VITE_API_BASE_URL` est correctement configuré

### Erreur de connexion MongoDB
- Vérifiez que le cluster Atlas n'est pas en pause
- Vérifiez Network Access (IP autorisée)
- Vérifiez la connection string (username/password corrects)

### Backend ne démarre pas
- Vérifiez les logs sur Render/Railway
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez que `PORT` est bien utilisé (les hébergeurs définissent cette variable)

## 📝 URLs de Production

Après déploiement, vous aurez :
- **Frontend** : `https://librarynager.netlify.app`
- **Backend** : `https://votre-backend.onrender.com` (exemple)
- **API Docs** : `https://votre-backend.onrender.com/api-docs`
- **MongoDB Atlas** : Accessible via le backend uniquement

## 🔄 Mise à Jour

Pour mettre à jour l'application :
1. Faites vos modifications localement
2. Commitez et poussez sur GitHub
3. Netlify redéploiera automatiquement le frontend
4. Render/Railway redéploiera automatiquement le backend

---

**Note** : MongoDB Atlas fonctionne parfaitement avec cette architecture. Le backend se connecte à Atlas, et le frontend communique avec le backend via l'API REST.
