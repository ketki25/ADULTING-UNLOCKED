const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');

// GET /api/finance/expenses
router.get('/expenses', authenticate, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = 'SELECT * FROM expenses WHERE user_id = ?';
    const params = [req.user.id];
    if (month && year) {
      query += ' AND MONTH(date) = ? AND YEAR(date) = ?';
      params.push(month, year);
    }
    query += ' ORDER BY date DESC';
    const [expenses] = await pool.query(query, params);
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/finance/expenses
router.post('/expenses', authenticate, async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO expenses (user_id, title, amount, category, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, amount, category || 'other', date, notes || null]
    );
    res.status(201).json({ success: true, message: 'Expense added!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/finance/expenses/:id
router.delete('/expenses/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/finance/analytics
router.get('/analytics', authenticate, async (req, res) => {
  try {
    const { month, year } = req.query;
    const [categoryTotals] = await pool.query(
      'SELECT category, SUM(amount) as total FROM expenses WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY category',
      [req.user.id, month || new Date().getMonth() + 1, year || new Date().getFullYear()]
    );
    const [monthlyTrend] = await pool.query(
      'SELECT MONTH(date) as month, YEAR(date) as year, SUM(amount) as total FROM expenses WHERE user_id = ? GROUP BY YEAR(date), MONTH(date) ORDER BY year, month',
      [req.user.id]
    );
    res.json({ success: true, data: { categoryTotals, monthlyTrend } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/finance/budget
router.get('/budget', authenticate, async (req, res) => {
  try {
    const { month, year } = req.query;
    const [goals] = await pool.query(
      'SELECT * FROM budget_goals WHERE user_id = ? AND month = ? AND year = ?',
      [req.user.id, month || new Date().getMonth() + 1, year || new Date().getFullYear()]
    );
    res.json({ success: true, data: goals[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/finance/budget
router.post('/budget', authenticate, async (req, res) => {
  try {
    const { month, year, total_budget, food_budget, transport_budget, education_budget, entertainment_budget, other_budget, savings_goal } = req.body;
    await pool.query(
      `INSERT INTO budget_goals (user_id, month, year, total_budget, food_budget, transport_budget, education_budget, entertainment_budget, other_budget, savings_goal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE total_budget=VALUES(total_budget), food_budget=VALUES(food_budget), transport_budget=VALUES(transport_budget), savings_goal=VALUES(savings_goal)`,
      [req.user.id, month, year, total_budget, food_budget||0, transport_budget||0, education_budget||0, entertainment_budget||0, other_budget||0, savings_goal||0]
    );
    res.json({ success: true, message: 'Budget saved!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/finance/scholarships
router.get('/scholarships', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = 'SELECT * FROM scholarships WHERE is_active = 1';
    const params = [];
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (level) { query += ' AND (level = ? OR level = "all")'; params.push(level); }
    if (search) { query += ' AND (name LIKE ? OR provider LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    query += ' ORDER BY deadline ASC';
    const [scholarships] = await pool.query(query, params);
    res.json({ success: true, data: scholarships });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;