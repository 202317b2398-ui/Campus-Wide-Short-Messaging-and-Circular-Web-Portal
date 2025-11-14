-- Simplified SQL to fix syntax error - removed incorrect DEFAULT clause
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email_password ON users(email, password);
