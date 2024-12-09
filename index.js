const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());

// MySQL Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Test database connection
db.getConnection((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

// API Endpoints
app.post('/recommendation', (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Text is required.' });
  }
  db.query('INSERT INTO recommends (text) VALUES (?)', [question], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Opinion saved!', data: results });
  });
});

// Get all questions
app.get('/recommendation', (req, res) => {
  db.query('SELECT * FROM recommends', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
