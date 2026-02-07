const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'library.db');
const db = new sqlite3.Database(dbPath);

console.log('=== DATABASE CONTENTS ===\n');

// List books
db.all('SELECT title, author, category, status FROM books ORDER BY title', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('BOOKS:');
    rows.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} - ${book.author} [${book.category}] - Status: ${book.status}`);
    });
    console.log('');
  }
  
  // List borrowers
  db.all('SELECT name, email, phone, status FROM borrowers ORDER BY name', (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('BORROWERS:');
      rows.forEach((borrower, index) => {
        console.log(`${index + 1}. ${borrower.name} - ${borrower.email} - ${borrower.phone} [${borrower.status}]`);
      });
      console.log('');
    }
    
    // List categories
    db.all('SELECT name, description FROM categories ORDER BY name', (err, rows) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('CATEGORIES:');
        rows.forEach((category, index) => {
          console.log(`${index + 1}. ${category.name} - ${category.description}`);
        });
      }
      
      db.close();
    });
  });
});
