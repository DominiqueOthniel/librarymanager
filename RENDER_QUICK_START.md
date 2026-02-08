# ⚡ Déploiement Rapide sur Render - Checklist

## 🎯 Étapes Rapides

### 1. Créer le Web Service sur Render
- Allez sur **https://render.com**
- **New +** → **Web Service**
- Connectez votre repo GitHub : `DominiqueOthniel/librarymanager`

### 2. Configuration (IMPORTANT)
```
Name: library-manager-backend
Root Directory: server          ← TRÈS IMPORTANT !
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 3. Variables d'Environnement
Ajoutez ces 2 variables :
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/library-manager
NODE_ENV = production
```

### 4. MongoDB Atlas Network Access
- MongoDB Atlas → **Network Access**
- **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)

### 5. Obtenir l'URL Render
Après déploiement, vous aurez :
```
https://library-manager-backend.onrender.com
```

### 6. Configurer Netlify
- Netlify Dashboard → **Environment Variables**
- Ajoutez :
```
VITE_API_BASE_URL = https://votre-backend.onrender.com/api
```

### 7. Tester
- Backend Health : `https://votre-backend.onrender.com/api/health`
- Devrait retourner : `{"status":"ok","database":"connected"}`

## ✅ C'est tout !

Voir `RENDER_DEPLOYMENT.md` pour le guide complet avec détails.
