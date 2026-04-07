
const express = require('express');
const router = express.Router();
const pool = require('../db');

// --- Register endpoint ---
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required.' });
  }
  try {
    // Check if user exists
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }
    // Insert new user
    await pool.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3)', [email, password, 'customer']);
    res.json({ success: true });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Database error.' });
  }
});

// Mock platform statistics
const platformStats = {
  totalFunded: "142.7M",
  activeProjects: 3847,
  investors: 128500,
  successRate: "94.2%",
  chains: ["Ethereum", "Polygon", "Solana", "Avalanche"]
};

// Mock featured projects
const featuredProjects = [
  {
    id: 1,
    title: "DeFi Lending Protocol",
    creator: "0x1a2b...3c4d",
    goal: 500000,
    raised: 387500,
    backers: 1240,
    category: "DeFi",
    daysLeft: 12,
    chain: "Ethereum",
    image: "https://images.unsplash.com/photo-1518544887729-2f6e6857f318?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    title: "NFT Marketplace v2",
    creator: "0x5e6f...7g8h",
    goal: 250000,
    raised: 250000,
    backers: 890,
    category: "NFT",
    daysLeft: 0,
    chain: "Polygon",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    title: "Cross-Chain Bridge",
    creator: "0x9i0j...1k2l",
    goal: 1000000,
    raised: 620000,
    backers: 3100,
    category: "Infrastructure",
    daysLeft: 28,
    chain: "Multi-Chain",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    title: "Stablecoin Yield Vault",
    creator: "0x2b3c...4d5e",
    goal: 300000,
    raised: 150000,
    backers: 600,
    category: "DeFi",
    daysLeft: 20,
    chain: "Ethereum",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    title: "Gaming DAO",
    creator: "0x3c4d...5e6f",
    goal: 800000,
    raised: 400000,
    backers: 2000,
    category: "Gaming",
    daysLeft: 15,
    chain: "Polygon",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    title: "Green Energy Token",
    creator: "0x4d5e...6f7g",
    goal: 100000,
    raised: 90000,
    backers: 350,
    category: "Sustainability",
    daysLeft: 10,
    chain: "Avalanche",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 7,
    title: "Decentralized Storage",
    creator: "0x5e6f...7g8h",
    goal: 600000,
    raised: 320000,
    backers: 1100,
    category: "Infrastructure",
    daysLeft: 18,
    chain: "Solana",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3c8b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 8,
    title: "Charity Chain",
    creator: "0x6f7g...8h9i",
    goal: 120000,
    raised: 80000,
    backers: 500,
    category: "Charity",
    daysLeft: 25,
    chain: "Ethereum",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 9,
    title: "Metaverse Land Sale",
    creator: "0x7g8h...9i0j",
    goal: 900000,
    raised: 450000,
    backers: 1700,
    category: "Metaverse",
    daysLeft: 8,
    chain: "Polygon",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 10,
    title: "Privacy Mixer",
    creator: "0x8h9i...0j1k",
    goal: 200000,
    raised: 120000,
    backers: 420,
    category: "Privacy",
    daysLeft: 30,
    chain: "Ethereum",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 11,
    title: "DEX Aggregator",
    creator: "0x9i0j...1k2l",
    goal: 700000,
    raised: 500000,
    backers: 2100,
    category: "DeFi",
    daysLeft: 14,
    chain: "Avalanche",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 12,
    title: "Yield Farming Optimizer",
    creator: "0x0j1k...2l3m",
    goal: 400000,
    raised: 250000,
    backers: 900,
    category: "DeFi",
    daysLeft: 22,
    chain: "Polygon",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 13,
    title: "NFT Art Launchpad",
    creator: "0x1k2l...3m4n",
    goal: 150000,
    raised: 100000,
    backers: 300,
    category: "NFT",
    daysLeft: 16,
    chain: "Solana",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 14,
    title: "Insurance Protocol",
    creator: "0x2l3m...4n5o",
    goal: 350000,
    raised: 200000,
    backers: 700,
    category: "Insurance",
    daysLeft: 19,
    chain: "Ethereum",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 15,
    title: "Launchpad Platform",
    creator: "0x3m4n...5o6p",
    goal: 500000,
    raised: 300000,
    backers: 1200,
    category: "Launchpad",
    daysLeft: 13,
    chain: "Polygon",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3c8b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 16,
    title: "DAO Governance Suite",
    creator: "0x4n5o...6p7q",
    goal: 250000,
    raised: 180000,
    backers: 650,
    category: "DAO",
    daysLeft: 17,
    chain: "Ethereum",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 17,
    title: "Web3 Social Network",
    creator: "0x5o6p...7q8r",
    goal: 750000,
    raised: 500000,
    backers: 1600,
    category: "Social",
    daysLeft: 21,
    chain: "Polygon",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 18,
    title: "Prediction Market",
    creator: "0x6p7q...8r9s",
    goal: 300000,
    raised: 220000,
    backers: 800,
    category: "Prediction",
    daysLeft: 11,
    chain: "Avalanche",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
  }
];

// GET /api/stats
router.get('/stats', (req, res) => {
  res.json({ success: true, data: platformStats });
});

// GET /api/projects
router.get('/projects', (req, res) => {
  res.json({ success: true, data: featuredProjects, total: featuredProjects.length });
});

// GET /api/projects/:id
router.get('/projects/:id', (req, res) => {
  const project = featuredProjects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
  res.json({ success: true, data: project });
});

// POST /api/waitlist
router.post('/waitlist', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email required' });
  }
  console.log(`✅ New waitlist signup: ${email}`);
  res.json({ success: true, message: 'Successfully joined the waitlist!' });
});

// POST /api/record-tx
router.post('/record-tx', async (req, res) => {
  const { address, hash, timestamp, value, gasUsed } = req.body;
  if (!address || !hash || !timestamp || !value || !gasUsed) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  try {
    // Create table if not exists (id SERIAL PRIMARY KEY, address TEXT, hash TEXT, timestamp BIGINT, value TEXT, gasUsed TEXT)
    await pool.query(`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      address TEXT,
      hash TEXT,
      timestamp BIGINT,
      value TEXT,
      gasUsed TEXT
    )`);
    await pool.query(
      'INSERT INTO transactions (address, hash, timestamp, value, gasUsed) VALUES ($1, $2, $3, $4, $5)',
      [address, hash, timestamp, value, gasUsed]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Record tx error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// GET /api/tx-history?address=0x...
router.get('/tx-history', async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ success: false, error: 'Address required' });
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      address TEXT,
      hash TEXT,
      timestamp BIGINT,
      value TEXT,
      gasUsed TEXT
    )`);
    const result = await pool.query(
      'SELECT * FROM transactions WHERE address = $1 ORDER BY timestamp DESC LIMIT 10',
      [address]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Tx history error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

module.exports = router;
