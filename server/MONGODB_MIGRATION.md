# Migration vers MongoDB

Le backend a été migré de SQLite vers MongoDB avec Mongoose.

## 📋 Prérequis

1. **Installer MongoDB** :
   - **Windows** : Télécharger depuis [mongodb.com](https://www.mongodb.com/try/download/community)
   - **macOS** : `brew install mongodb-community`
   - **Linux** : Suivre les instructions sur [mongodb.com](https://www.mongodb.com/docs/manual/installation/)

2. **Démarrer MongoDB** :
   - **Windows** : Le service démarre automatiquement après l'installation
   - **macOS/Linux** : `mongod` ou `brew services start mongodb-community`

## 🔧 Configuration

1. **Créer le fichier `.env`** dans le dossier `server/` :
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/library-manager
   SEED_SAMPLE=false
   ```

2. **Pour MongoDB Atlas (cloud)** :
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-manager
   ```

## 🚀 Installation

```bash
cd server
npm install
```

## 📊 Initialisation de la base de données

```bash
# Initialiser la base de données (sans données de test)
npm run init-db

# Insérer des données de test
npm run insert-test-data

# Nettoyer la base de données
npm run clean-db
```

## 🏗️ Structure

- **Modèles** : `server/models/` (Book, Borrower, Transaction, Category)
- **Configuration** : `server/config/database.js`
- **Routes** : `server/routes/` (toutes migrées vers MongoDB)

## ✨ Avantages de MongoDB

- **Scalabilité** : Meilleure performance avec de grandes quantités de données
- **Flexibilité** : Schéma flexible pour évoluer facilement
- **Agrégations** : Requêtes complexes plus faciles
- **Cloud** : Support natif pour MongoDB Atlas

## 🔄 Migration des données existantes

Si vous avez des données SQLite existantes, vous devrez :
1. Exporter les données SQLite
2. Les convertir au format MongoDB
3. Les importer dans MongoDB

Pour l'instant, utilisez `npm run insert-test-data` pour avoir des données de test.
