const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/career/careers
router.get('/careers', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = 'SELECT * FROM careers WHERE 1=1';
    const params = [];
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (difficulty) { query += ' AND difficulty = ?'; params.push(difficulty); }
    if (search) { query += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    const [careers] = await pool.query(query, params);
    res.json({ success: true, data: careers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/career/careers/:id
router.get('/careers/:id', async (req, res) => {
  try {
    const [careers] = await pool.query('SELECT * FROM careers WHERE id = ?', [req.params.id]);
    if (!careers.length) return res.status(404).json({ success: false, message: 'Career not found' });
    const [resources] = await pool.query('SELECT * FROM resources WHERE career_id = ?', [req.params.id]);
    res.json({ success: true, data: { ...careers[0], resources } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/career/alumni
router.get('/alumni', async (req, res) => {
  try {
    const { career_path, featured } = req.query;
    let query = 'SELECT * FROM alumni WHERE 1=1';
    const params = [];
    if (career_path) { query += ' AND career_path = ?'; params.push(career_path); }
    if (featured === 'true') { query += ' AND is_featured = 1'; }
    query += ' ORDER BY is_featured DESC, graduation_year DESC';
    const [alumni] = await pool.query(query, params);
    res.json({ success: true, data: alumni });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/career/resources
router.get('/resources', async (req, res) => {
  try {
    const { type, career_id } = req.query;
    let query = 'SELECT * FROM resources WHERE 1=1';
    const params = [];
    if (type) { query += ' AND type = ?'; params.push(type); }
    if (career_id) { query += ' AND career_id = ?'; params.push(career_id); }
    const [resources] = await pool.query(query, params);
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;