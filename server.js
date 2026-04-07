
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const pool = require('./db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Ensure admin user exists in users table
(async () => {
  try {
    await pool.query(`INSERT INTO users (email, password, role, is_logged_in)
      VALUES ('admin@raisnet.com', 'admin', 'admin', false)
      ON CONFLICT (email) DO UPDATE SET password = 'admin', role = 'admin';`);
    console.log('✅ Admin user ensured in users table.');
  } catch (err) {
    console.error('❌ Error ensuring admin user:', err);
  }
})();

// Create a new project (admin or customer)
app.post('/api/projects', async (req, res) => {
  const { title, creator, goal, category, days_left, chain, role } = req.body;
  if (!title || !creator || !goal) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  try {
    // Only admin can set any creator, customer can only set themselves
    let creatorValue = creator;
    if (role !== 'admin') {
      creatorValue = creator; // In real app, get from session
    }
    const result = await pool.query(
      'INSERT INTO projects (title, creator, goal, category, days_left, chain) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, creatorValue, goal, category, days_left, chain]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Get all projects (admin) or own projects (customer)
app.get('/api/projects', async (req, res) => {
  const role = req.query.role;
  const creator = req.query.creator;
  try {
    let result;
    if (role === 'admin') {
      result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    } else if (creator) {
      result = await pool.query('SELECT * FROM projects WHERE creator = $1 ORDER BY created_at DESC', [creator]);
    } else {
      result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC LIMIT 10');
    }
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Admin: get all users (role-based access)
app.get('/api/admin/users', async (req, res) => {
  // In production, check for admin session/auth here
  try {
    const result = await pool.query('SELECT email, role, last_login, last_logout, is_logged_in FROM users ORDER BY role, email');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Login endpoint for role-based access (Supabase/PostgreSQL)
// Login: set is_logged_in, last_login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt:', { email, password });
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    console.log('Login query result:', result.rows);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    await pool.query('UPDATE users SET is_logged_in = true, last_login = NOW() WHERE id = $1', [user.id]);
    res.json({ success: true, role: user.role, email: user.email });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Logout: set is_logged_in, last_logout
app.post('/api/logout', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });
  try {
    await pool.query('UPDATE users SET is_logged_in = false, last_logout = NOW() WHERE email = $1', [email]);
    res.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Check session: is user logged in?
app.post('/api/check-session', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });
  try {
    const result = await pool.query('SELECT is_logged_in FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, is_logged_in: result.rows[0].is_logged_in });
  } catch (err) {
    console.error('Session check error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve customer dashboard and related pages
app.get('/customer-dashboard.html', (req, res) => {
  res.redirect('/customer/dashboard.html');
});
app.get('/customer/fund.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'customer', 'fund.html'));
});
app.get('/customer/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'customer', 'profile.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 DecentralizedFunding Infrastructure running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});
