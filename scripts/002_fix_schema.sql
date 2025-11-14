-- Drop existing tables if they exist (for fresh start)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create messages table with all required columns
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sender TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  recipients TEXT DEFAULT 'all',
  custom_groups JSONB DEFAULT '[]'::jsonb,
  read_count INTEGER DEFAULT 0,
  total_recipients INTEGER DEFAULT 0,
  category TEXT DEFAULT 'General',
  acknowledged BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]'::jsonb,
  schedule_type TEXT DEFAULT 'now',
  schedule_date TEXT,
  schedule_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT REFERENCES messages(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  "read" BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_notifications_message_id ON notifications(message_id);
CREATE INDEX idx_notifications_read ON notifications("read");
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
