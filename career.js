const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticate, optionalAuth } = require('../middleware/auth');

// GET /api/campus/hostels
router.get('/hostels', async (req, res) => {
  try {
    const { city, type, min_price, max_price, search, page = 1, limit = 12 } = req.query;
    let query = 'SELECT * FROM hostels WHERE 1=1';
    const params = [];
    if (city) { query += ' AND city = ?'; params.push(city); }
    if (type) { query += ' AND type = ?'; params.push(type); }
    if (min_price) { query += ' AND price_per_month >= ?'; params.push(min_price); }
    if (max_price) { query += ' AND price_per_month <= ?'; params.push(max_price); }
    if (search) { query += ' AND (name LIKE ? OR address LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    const offset = (page - 1) * limit;
    query += ` ORDER BY rating DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    const [hostels] = await pool.query(query, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM hostels WHERE 1=1');
    res.json({ success: true, data: hostels, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/campus/hostels/:id
router.get('/hostels/:id', async (req, res) => {
  try {
    const [hostels] = await pool.query('SELECT * FROM hostels WHERE id = ?', [req.params.id]);
    if (hostels.length === 0) return res.status(404).json({ success: false, message: 'Hostel not found' });
    const [reviews] = await pool.query(
      'SELECT r.*, u.name as user_name, u.avatar FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.entity_type = "hostel" AND r.entity_id = ? ORDER BY r.created_at DESC',
      [req.params.id]
    );
    res.json({ success: true, data: { ...hostels[0], reviews } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/campus/mess
router.get('/mess', async (req, res) => {
  try {
    const { city, food_type, search, page = 1, limit = 12 } = req.query;
    let query = 'SELECT * FROM mess_services WHERE 1=1';
    const params = [];
    if (city) { query += ' AND city = ?'; params.push(city); }
    if (food_type) { query += ' AND food_type = ?'; params.push(food_type); }
    if (search) { query += ' AND (name LIKE ? OR address LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ` ORDER BY rating DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (page - 1) * parseInt(limit));
    const [mess] = await pool.query(query, params);
    res.json({ success: true, data: mess });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/campus/reviews
router.post('/reviews', authenticate, async (req, res) => {
  try {
    const { entity_type, entity_id, rating, title, comment } = req.body;
    await pool.query(
      'INSERT INTO reviews (user_id, entity_type, entity_id, rating, title, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, entity_type, entity_id, rating, title, comment]
    );
    const table = entity_type === 'hostel' ? 'hostels' : 'mess_services';
    await pool.query(`UPDATE ${table} SET rating = (SELECT AVG(rating) FROM reviews WHERE entity_type = ? AND entity_id = ?), review_count = review_count + 1 WHERE id = ?`,
      [entity_type, entity_id, entity_id]);
    res.status(201).json({ success: true, message: 'Review submitted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/campus/favorites
router.post('/favorites', authenticate, async (req, res) => {
  try {
    const { entity_type, entity_id } = req.body;
    await pool.query('INSERT IGNORE INTO favorites (user_id, entity_type, entity_id) VALUES (?, ?, ?)',
      [req.user.id, entity_type, entity_id]);
    res.json({ success: true, message: 'Added to favorites!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;