require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const sampleData = {
  lessons: [
    { id: 1, title: 'Greetings', level: 'Beginner', description: 'Basic greetings and introductions', content: 'Muraho = Hello. Mwaramutse = Good morning.' },
    { id: 2, title: 'Numbers', level: 'Beginner', description: 'Learn the basics of counting', content: 'Rimwe, kabiri, gatatu...' },
    { id: 3, title: 'Family', level: 'Beginner', description: 'Vocabulary for daily family life', content: 'Umubyeyi = parent, Umwana = child' },
  ],
  vocabulary: [
    { id: 1, word: 'Muraho', meaning: 'Hello', example_sentence: 'Muraho neza!' },
    { id: 2, word: 'Murakoze', meaning: 'Thank you', example_sentence: 'Murakoze cyane.' },
  ],
  quizzes: [
    { id: 1, question: 'What does Muraho mean?', option1: 'Hello', option2: 'Goodbye', option3: 'Thank you', option4: 'No', answer: 'Hello' },
  ],
};

const pool = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME
  ? mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    })
  : null;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

async function safeRead(query, params = [], fallback) {
  try {
    if (!pool) {
      return fallback;
    }

    const [rows] = await pool.query(query, params);
    return rows.length ? rows : fallback;
  } catch (error) {
    return fallback;
  }
}

app.get('/api/health', async (req, res) => {
  if (!pool) {
    return res.json({
      status: 'ok',
      database: 'demo-mode',
      message: 'Kinyarwanda API is running in demo mode.',
    });
  }

  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', database: 'connected', message: 'Kinyarwanda API is running.', rows: rows[0] });
  } catch (error) {
    res.json({ status: 'ok', database: 'fallback', message: 'Database unavailable. Running in safe demo mode.', error: error.message });
  }
});

app.get('/api/lessons', async (req, res) => {
  const lessons = await safeRead('SELECT * FROM lessons ORDER BY id DESC', [], sampleData.lessons);
  res.json(lessons);
});

app.get('/api/vocabulary', async (req, res) => {
  const vocabulary = await safeRead('SELECT * FROM vocabulary ORDER BY id DESC', [], sampleData.vocabulary);
  res.json(vocabulary);
});

app.get('/api/quizzes', async (req, res) => {
  const quizzes = await safeRead('SELECT * FROM quizzes ORDER BY id DESC', [], sampleData.quizzes);
  res.json(quizzes);
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!pool) {
    return res.json({ message: 'Demo account created successfully. Connect MySQL to persist data.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);
    res.json({ message: 'Account created successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!pool) {
    const demoUser = { id: 1, name: 'Demo learner', role: 'student', email };
    const token = jwt.sign({ id: demoUser.id, role: demoUser.role }, process.env.JWT_SECRET || 'demo-secret');
    return res.json({ token, user: demoUser });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).json({ error: 'Invalid login credentials.' });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'demo-secret');
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
