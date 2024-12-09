const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database connection
const pool = new Pool({ connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false}
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    pool.query('CREATE DATABASE recommends', (err) => {
      if (err && !~err.message.indexOf('already exists')) {
        console.log('Database recommends already exists.');
      } else {
        console.log('Database recommends created.');
      }
    console.log('Connected to MySQL database');
  }
});

// API Endpoints
app.post('/recommendation', (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Text is required.' });
  }
  pool.query('INSERT INTO recommends (text) VALUES ($1) RETURNING *', [question], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Opinion saved!', data: results });
  });
});

// Get all questions
app.get('/recommendation', (req, res) => {
  pool.query('SELECT * FROM recommends', (err, results) => {
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
