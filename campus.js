const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');

// GET /api/buddy/mentors
router.get('/mentors', async (req, res) => {
  try {
    const { skills, availability, search } = req.query;
    let query = `SELECT m.*, u.name, u.college, u.branch, u.year, u.avatar 
                 FROM mentors m JOIN users u ON m.user_id = u.id 
                 WHERE m.is_available = 1`;
    const params = [];
    if (availability) { query += ' AND m.availability = ?'; params.push(availability); }
    if (search) { query += ' AND (u.name LIKE ? OR m.bio LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ' ORDER BY m.rating DESC, m.session_count DESC';
    const [mentors] = await pool.query(query, params);
    res.json({ success: true, data: mentors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/buddy/mentors/:id
router.get('/mentors/:id', async (req, res) => {
  try {
    const [mentors] = await pool.query(
      'SELECT m.*, u.name, u.college, u.branch, u.year, u.avatar FROM mentors m JOIN users u ON m.user_id = u.id WHERE m.id = ?',
      [req.params.id]
    );
    if (!mentors.length) return res.status(404).json({ success: false, message: 'Mentor not found' });
    res.json({ success: true, data: mentors[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/buddy/become-mentor
router.post('/become-mentor', authenticate, async (req, res) => {
  try {
    const { bio, skills, interests, availability, max_mentees } = req.body;
    const [existing] = await pool.query('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);
    if (existing.length > 0) {
      await pool.query('UPDATE mentors SET bio=?, skills=?, interests=?, availability=?, max_mentees=? WHERE user_id=?',
        [bio, JSON.stringify(skills), JSON.stringify(interests), availability, max_mentees || 3, req.user.id]);
    } else {
      await pool.query('INSERT INTO mentors (user_id, bio, skills, interests, availability, max_mentees) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.id, bio, JSON.stringify(skills), JSON.stringify(interests), availability, max_mentees || 3]);
    }
    await pool.query("UPDATE users SET role = 'mentor' WHERE id = ?", [req.user.id]);
    res.json({ success: true, message: 'Mentor profile saved!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/buddy/chat-request
router.post('/chat-request', authenticate, async (req, res) => {
  try {
    const { receiver_id, message } = req.body;
    await pool.query('INSERT INTO chat_requests (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [req.user.id, receiver_id, message || null]);
    res.status(201).json({ success: true, message: 'Chat request sent!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/buddy/interests
router.get('/interests', async (req, res) => {
  try {
    const [interests] = await pool.query('SELECT * FROM interests ORDER BY category, name');
    res.json({ success: true, data: interests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/buddy/matches
router.get('/matches', authenticate, async (req, res) => {
  try {
    const [matches] = await pool.query(
      `SELECT bm.*, u.name as mentor_name, u.avatar as mentor_avatar 
       FROM buddy_matches bm JOIN mentors m ON bm.mentor_id = m.id JOIN users u ON m.user_id = u.id 
       WHERE bm.mentee_id = ?`,
      [req.user.id]
    );
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;