import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://20.5.250.178/jovanfidello',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const connection = new sqlite3.Database('./db/aplikasi.db');

// Get subdomain name from environment variable (set in Dockerfile or docker-compose)
const subdomain = process.env.NAME || 'default';

// API route to get user by ID
app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?'; // Menggunakan parameterized query
  connection.all(query, [req.params.id], (error, results) => {
        if (error) throw error;
        res.json(results);
  });
});

// API route to change user email
app.post('/api/user/:id/change-email', (req, res) => {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
        return res.status(400).send('Invalid email format');
  }

  const newEmail = req.body.email;
  const query = 'UPDATE users SET email = ? WHERE id = ?'; // Menggunakan parameterized query

  connection.run(query, [newEmail, req.params.id], function (err) {
    if (err) return res.status(500).send('Database error');
    if (this.changes === 0) res.status(404).send('User not found');
    else res.status(200).send('Email updated successfully');
  });
});

// File serving route
app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Dapatkan nama file dan validasi untuk mencegah path traversal
  const fileName = path.basename(req.query.name);  
  const filePath = path.join(__dirname, 'files', fileName);

  // Periksa apakah file ada
  fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
        // Jika file tidak ditemukan atau tidak bisa diakses, kirim error
        return res.status(404).send('File not found');
        }

        // Jika file ada, kirim file ke pengguna
        res.sendFile(filePath);
  });
});

// Serve static files from frontend (built Vue app)
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Route for serving the app at the subdomain path
app.get(`/${subdomain}`, (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url)); 
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen on port 3000
app.listen(3000, () => {
  console.log(`Server running on port 3000. Access the app at http://localhost:3000/${subdomain}`);
});

