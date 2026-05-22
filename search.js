const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticate, optionalAuth } = require('../middleware/auth');

// GET /api/gradmind/posts
router.get('/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    let query = 'SELECT * FROM anonymous_posts WHERE is_approved = 1';
    const params = [];
    if (category) { query += ' AND category = ?'; params.push(category); }
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (page - 1) * parseInt(limit));
    const [posts] = await pool.query(query, params);
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gradmind/posts
router.post('/posts', async (req, res) => {
  try {
    const { content, category } = req.body;
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Post must be at least 10 characters' });
    }
    const [result] = await pool.query(
      'INSERT INTO anonymous_posts (content, category) VALUES (?, ?)',
      [content.trim(), category || 'vent']
    );
    res.status(201).json({ success: true, message: 'Posted anonymously!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gradmind/posts/:id/like
router.post('/posts/:id/like', async (req, res) => {
  try {
    await pool.query('UPDATE anonymous_posts SET likes = likes + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Liked!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gradmind/posts/:id/comments
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const [comments] = await pool.query(
      'SELECT id, content, is_anonymous, created_at FROM post_comments WHERE post_id = ? ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gradmind/posts/:id/comments
router.post('/posts/:id/comments', optionalAuth, async (req, res) => {
  try {
    const { content, is_anonymous = true } = req.body;
    const user_id = !is_anonymous && req.user ? req.user.id : null;
    await pool.query(
      'INSERT INTO post_comments (post_id, content, is_anonymous, user_id) VALUES (?, ?, ?, ?)',
      [req.params.id, content, is_anonymous, user_id]
    );
    res.status(201).json({ success: true, message: 'Comment added!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gradmind/mood
router.get('/mood', authenticate, async (req, res) => {
  try {
    const [moods] = await pool.query(
      'SELECT * FROM moods WHERE user_id = ? ORDER BY date DESC LIMIT 30',
      [req.user.id]
    );
    res.json({ success: true, data: moods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gradmind/mood
router.post('/mood', authenticate, async (req, res) => {
  try {
    const { mood_score, mood_label, note } = req.body;
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO moods (user_id, mood_score, mood_label, note, date) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE mood_score=VALUES(mood_score), mood_label=VALUES(mood_label), note=VALUES(note)`,
      [req.user.id, mood_score, mood_label, note || null, today]
    );
    res.json({ success: true, message: 'Mood logged!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gradmind/chat (AI support chat stub)
router.post('/chat', async (req, res) => {
  try {
    const { message, session_id } = req.body;
    // Save user message
    await pool.query('INSERT INTO support_messages (session_id, role, content) VALUES (?, "user", ?)', [session_id, message]);
    // Simple empathetic responses (replace with AI API in production)
    const responses = [
      "I hear you. It takes courage to share what you're feeling. You're not alone in this journey.",
      "That sounds really tough. Engineering life can be overwhelming. Take it one day at a time.",
      "Your feelings are completely valid. Remember, asking for help is a sign of strength.",
      "I'm here to listen. Many students feel this way. Have you tried talking to a counselor on campus?",
      "You're doing better than you think. Small steps matter. What's one thing that brought you joy recently?"
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];
    await pool.query('INSERT INTO support_messages (session_id, role, content) VALUES (?, "assistant", ?)', [session_id, reply]);
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;