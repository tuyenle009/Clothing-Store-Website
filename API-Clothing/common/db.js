const mysql = require('mysql2')
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'clothing_store'
})

// Kiểm tra kết nối
db.connect(error => {
  if (error) {
    console.error('Error connecting to database:', error);
  } else {
    console.log('Successfully connected to the database');
  }
});

module.exports = db;