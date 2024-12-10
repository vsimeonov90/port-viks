const express = require('express');
sql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database connection
const pool = sql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    pool.query(`CREATE TABLE IF NOT EXISTS recommends (id INT AUTO_INCREMENT PRIMARY KEY, content TEXT NOT NULL, sender_mail TEXT NOT NULL, created_at TEXT NOT NULL);`, (err) => {
        console.log('Database recommends created.');
      console.log('Connected to MySQL database');
    });
  }
});

// API Endpoints
app.post('/recommendation', (req, res) => {
  const { text } = req.body;
  const { email } = req.body;
  const { tStamp } = req.body;
  if (!text || !email) {
    return res.status(400).json({ error: 'Text is required.' });
  }
  pool.query(`INSERT INTO recommends (content, sender_mail, created_at) VALUES (?, ?, ?)`, [text, email, tStamp], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to add question' });
    } else {
      console.log(req.body);
    }
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
