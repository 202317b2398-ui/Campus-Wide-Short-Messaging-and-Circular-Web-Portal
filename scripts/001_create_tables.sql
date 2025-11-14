-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sender TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  recipients TEXT DEFAULT 'all',
  custom_groups JSONB DEFAULT '[]',
  read_count INTEGER DEFAULT 0,
  total_recipients INTEGER DEFAULT 0,
  category TEXT DEFAULT 'General',
  acknowledged BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]',
  schedule_type TEXT DEFAULT 'now',
  schedule_date TEXT,
  schedule_time TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  age INTEGER,
  blood_group TEXT,
  phone_number TEXT,
  department TEXT,
  course TEXT,
  sub_course TEXT,
  dob TEXT,
  parent_phone_number TEXT,
  responsible_staff TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT REFERENCES messages(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_notifications_message_id ON notifications(message_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
