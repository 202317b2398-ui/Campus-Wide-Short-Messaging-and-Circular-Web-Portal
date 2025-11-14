# Database Setup Instructions

## Overview
Your Campus Messaging Portal uses Supabase PostgreSQL to store all data. The database schema is defined in SQL migration scripts.

## Migration Scripts

The following SQL migration scripts need to be executed in Supabase:

### 1. Initial Schema (Required) - `scripts/002_fix_schema.sql`
Creates the core tables:
- `users` - Student, Staff, and Admin accounts
- `messages` - All circulars and messages
- `notifications` - Message notifications

**Status:** Must be executed first

### 2. Groups Table (Required) - `scripts/003_add_groups_table.sql`
Adds the groups table for managing distribution lists.

**Status:** Must be executed after the initial schema

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste the SQL from `scripts/002_fix_schema.sql`
6. Click **Run**
7. Repeat steps 4-6 for `scripts/003_add_groups_table.sql`

### Option 2: Using Supabase CLI
\`\`\`bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref your_project_ref

# Run migrations
supabase migration up
\`\`\`

## Troubleshooting

### Error: "table 'public.groups' not found"
**Solution:** Run the `scripts/003_add_groups_table.sql` migration script

### Error: "table 'public.users' not found"
**Solution:** Run the `scripts/002_fix_schema.sql` migration script first

### Error: "unique constraint violation on email"
**Solution:** Email addresses must be unique. Use different names when creating users.

## Default Admin Account

After running migrations, you can login with:
- **Email:** admin@college.edu
- **Password:** admin123

## Next Steps

1. Run both migration scripts in Supabase
2. Login to the app as admin
3. Create student and staff accounts using the Admin Panel
4. Create distribution groups in the Admin Panel
5. Staff can now send messages to groups
6. Students can receive and acknowledge messages
