-- Create projects table for real project data
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  creator VARCHAR(255) NOT NULL,
  goal NUMERIC NOT NULL,
  raised NUMERIC DEFAULT 0,
  backers INTEGER DEFAULT 0,
  category VARCHAR(100),
  days_left INTEGER,
  chain VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
