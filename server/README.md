# Library Manager Backend

Backend API pour le système de gestion de bibliothèque, utilisant **MongoDB** avec **Mongoose** et **Node.js/Express**.

##  Prérequis

- Node.js (v14.x ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

##  Installation

1. **Installer les dépendances** :
  ```bash
   npm install
  ```
2. **Configurer l'environnement** :
  - Copier `env.example` vers `.env`
  - Configurer `MONGODB_URI` :
    - Local : `mongodb://localhost:27017/library-manager`
    - Atlas : `mongodb+srv://username:password@cluster.mongodb.net/library-manager`
3. **Démarrer MongoDB** (si local) :
  - Windows : Le service démarre automatiquement
  - macOS/Linux : `mongod` ou `brew services start mongodb-community`

## 🗄️ Base de données

### Initialisation

```bash
# Initialiser la base de données (sans données de test)
npm run init-db

# Insérer des données de test
npm run insert-test-data

# Nettoyer la base de données
npm run clean-db
```

### Structure des données

- **Books** : Catalogue des livres
- **Borrowers** : Emprunteurs
- **Transactions** : Prêts et retours
- **Categories** : Catégories de livres

## 🏃 Démarrage

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000` (ou le port configuré dans `.env`).

## 📡 API Endpoints

### Books

- `GET /api/books` - Liste des livres
- `GET /api/books/:id` - Détails d'un livre
- `POST /api/books` - Créer un livre
- `PUT /api/books/:id` - Mettre à jour un livre
- `DELETE /api/books/:id` - Supprimer un livre
- `GET /api/books/categories/list` - Liste des catégories

### Borrowers

- `GET /api/borrowers` - Liste des emprunteurs
- `GET /api/borrowers/:id` - Détails d'un emprunteur
- `POST /api/borrowers` - Créer un emprunteur
- `PUT /api/borrowers/:id` - Mettre à jour un emprunteur
- `DELETE /api/borrowers/:id` - Supprimer un emprunteur
- `GET /api/borrowers/:id/transactions` - Transactions d'un emprunteur

### Transactions

- `GET /api/transactions` - Liste des transactions
- `GET /api/transactions/:id` - Détails d'une transaction
- `POST /api/transactions/lend` - Prêter un livre
- `POST /api/transactions/return` - Retourner un livre
- `GET /api/transactions/overdue/list` - Livres en retard

### Reports

- `GET /api/reports/inventory` - Résumé de l'inventaire
- `GET /api/reports/books-by-category` - Livres par catégorie
- `GET /api/reports/popular-books` - Livres populaires
- `GET /api/reports/borrower-activity` - Activité des emprunteurs
- `GET /api/reports/overdue-summary` - Résumé des retards
- `GET /api/reports/monthly-stats` - Statistiques mensuelles
- `GET /api/reports/dashboard-summary` - Résumé du dashboard

## 🔧 Configuration

Variables d'environnement (`.env`) :

- `PORT` : Port du serveur (défaut: 5000)
- `NODE_ENV` : Environnement (development/production)
- `MONGODB_URI` : URI de connexion MongoDB
- `SEED_SAMPLE` : Insérer des données de test (true/false)

## 📚 Documentation

Voir `MONGODB_MIGRATION.md` pour plus de détails sur la migration vers MongoDB.