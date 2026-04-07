-- Ensure only one admin exists and set credentials
DELETE FROM users WHERE role = 'admin' AND email != 'admin@raisnet.com';
INSERT INTO users (email, password, role, is_logged_in) VALUES ('admin@raisnet.com', 'admin', 'admin', false)
ON CONFLICT (email) DO UPDATE SET password = 'admin', role = 'admin';
