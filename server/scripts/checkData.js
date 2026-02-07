const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'library.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking database contents...\n');

db.get('SELECT COUNT(*) as count FROM books', (err, row) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(`Books: ${row.count}`);
  }
  
  db.get('SELECT COUNT(*) as count FROM borrowers', (err, row) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(`Borrowers: ${row.count}`);
    }
    
    db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log(`Categories: ${row.count}`);
      }
      
      db.get('SELECT COUNT(*) as count FROM transactions', (err, row) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log(`Transactions: ${row.count}`);
        }
        
        db.close();
      });
    });
  });
});
