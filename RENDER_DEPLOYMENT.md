# 🚀 Guide de Déploiement sur Render

Guide complet pour déployer le backend Library Manager sur Render.

## ✅ Prérequis

- ✅ Compte GitHub avec votre code poussé
- ✅ Compte MongoDB Atlas avec cluster créé
- ✅ Connection string MongoDB Atlas prête

## 📋 Étape 1 : Créer un compte Render

1. Allez sur **https://render.com**
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec votre compte **GitHub** (recommandé)

## 📋 Étape 2 : Créer un nouveau Web Service

1. Dans le dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre repository GitHub si ce n'est pas déjà fait :
   - Cliquez sur **"Connect account"** si nécessaire
   - Autorisez Render à accéder à votre GitHub
   - Sélectionnez le repository : **`DominiqueOthniel/librarymanager`**

## 📋 Étape 3 : Configurer le Web Service

Remplissez les champs suivants :

### Informations de base
- **Name** : `library-manager-backend` (ou le nom que vous préférez)
- **Region** : Choisissez la région la plus proche (ex: `Frankfurt` pour l'Europe)
- **Branch** : `main` (ou `master` selon votre repo)

### Build & Deploy
- **Root Directory** : `server` ⚠️ **IMPORTANT** : Spécifiez le dossier `server`
- **Environment** : `Node`
- **Build Command** : `npm install`
- **Start Command** : `npm start`

### Plan
- **Free** : Sélectionnez le plan gratuit (suffisant pour commencer)

## 📋 Étape 4 : Configurer les Variables d'Environnement

Dans la section **"Environment Variables"**, ajoutez :

### Variable 1 : MongoDB URI
- **Key** : `MONGODB_URI`
- **Value** : Votre connection string MongoDB Atlas
  ```
  mongodb+srv://username:password@cluster.mongodb.net/library-manager?retryWrites=true&w=majority
  ```
  ⚠️ Remplacez `username`, `password`, et `cluster` par vos vraies valeurs

### Variable 2 : Node Environment
- **Key** : `NODE_ENV`
- **Value** : `production`

### Variable 3 : Port (Optionnel)
- **Key** : `PORT`
- **Value** : Render définit automatiquement le PORT, mais vous pouvez le laisser vide

## 📋 Étape 5 : Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement :
   - Cloner votre repo
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)
3. Attendez 2-5 minutes pour le premier déploiement

## 📋 Étape 6 : Vérifier le Déploiement

Une fois le déploiement terminé, Render vous donnera une URL comme :
```
https://library-manager-backend.onrender.com
```

### Tests à faire :

1. **Test Health Check** :
   ```
   https://votre-backend.onrender.com/api/health
   ```
   Devrait retourner : `{"status":"ok","database":"connected"}`

2. **Test Swagger Docs** :
   ```
   https://votre-backend.onrender.com/api-docs
   ```
   Devrait afficher la documentation Swagger

3. **Test API Info** :
   ```
   https://votre-backend.onrender.com/api
   ```
   Devrait retourner la liste des endpoints

## 📋 Étape 7 : Configurer Netlify

Maintenant que le backend est déployé, configurez Netlify pour pointer vers Render :

1. Allez sur **Netlify Dashboard** → Votre site
2. **Site settings** → **Environment variables**
3. Ajoutez/modifiez :
   - **Key** : `VITE_API_BASE_URL`
   - **Value** : `https://votre-backend.onrender.com/api`
     ⚠️ Remplacez par votre vraie URL Render

4. **Redéployez** le site Netlify (ou attendez le prochain déploiement automatique)

## 📋 Étape 8 : Configurer MongoDB Atlas Network Access

Pour que Render puisse se connecter à MongoDB Atlas :

1. Allez sur **MongoDB Atlas Dashboard**
2. **Network Access** (dans le menu de gauche)
3. Cliquez sur **"Add IP Address"**
4. Cliquez sur **"Allow Access from Anywhere"** (ajoute `0.0.0.0/0`)
   - Ou ajoutez spécifiquement l'IP de Render (mais `0.0.0.0/0` est plus simple)
5. Cliquez sur **"Confirm"**

## ✅ Checklist Finale

- [ ] Backend déployé sur Render
- [ ] URL Render obtenue (ex: `https://library-manager-backend.onrender.com`)
- [ ] `/api/health` retourne `{"status":"ok","database":"connected"}`
- [ ] Swagger accessible sur `/api-docs`
- [ ] Variable `VITE_API_BASE_URL` configurée sur Netlify
- [ ] MongoDB Atlas Network Access configuré (`0.0.0.0/0`)
- [ ] Frontend Netlify redéployé
- [ ] Test complet depuis le frontend : charger des livres, créer un emprunt, etc.

## 🐛 Dépannage

### Erreur : "Cannot connect to MongoDB"
- Vérifiez que MongoDB Atlas Network Access autorise `0.0.0.0/0`
- Vérifiez que le cluster n'est pas en pause
- Vérifiez la connection string (username/password corrects)

### Erreur : "Build failed"
- Vérifiez que **Root Directory** est bien `server`
- Vérifiez les logs de build dans Render Dashboard
- Assurez-vous que `package.json` existe dans le dossier `server`

### Erreur CORS depuis Netlify
- Vérifiez que l'URL Netlify est dans la liste des origines autorisées dans `server.js`
- Vérifiez que `VITE_API_BASE_URL` est correctement configuré sur Netlify

### Le service se met en veille
- C'est normal sur le plan gratuit Render
- La première requête après inactivité peut prendre 30-60 secondes
- Pour éviter cela, utilisez Railway ou un plan payant

## 📝 URLs Finales

Après déploiement, vous aurez :
- **Frontend** : `https://librarynager.netlify.app`
- **Backend** : `https://library-manager-backend.onrender.com`
- **API Docs** : `https://library-manager-backend.onrender.com/api-docs`
- **Health Check** : `https://library-manager-backend.onrender.com/api/health`

## 🔄 Mises à Jour Futures

Pour mettre à jour le backend :
1. Faites vos modifications localement
2. Commitez et poussez sur GitHub
3. Render détectera automatiquement les changements
4. Render redéploiera automatiquement (Auto-Deploy est activé par défaut)

---

**Note** : Le premier déploiement peut prendre 5-10 minutes. Les déploiements suivants sont plus rapides (2-3 minutes).
