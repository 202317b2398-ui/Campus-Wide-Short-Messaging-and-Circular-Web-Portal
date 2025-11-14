# Campus Messaging Portal - Login Credentials

## Default Admin Account

Use these credentials to login and create other users:

### Admin Login
- **Email:** `admin@college.edu`
- **Password:** `admin123` (or any 6+ character password)
- **Role:** Admin
- **Permissions:** Full system access, user management, message creation, group management

---

## How to Create New Users

1. **Login as Admin** using credentials above
2. Go to **Admin Panel** → **User Management** tab
3. Click **"Add Student"** or **"Add Staff"** button
4. Fill in all required details
5. Email will be auto-generated (format: firstname.lastname@college.edu)
6. New user can then login with:
   - **Email:** Auto-generated email
   - **Password:** Any 6+ character password

---

## Example: Creating a Student User

\`\`\`
Name: John Doe
Age: 20
Blood Group: B+
Date of Birth: 2004-05-15
Phone Number: +91-9876543210
Parent Phone: +91-9876543211
Course: B.Tech
Sub Course: Computer Science
Department: Engineering
Responsible Staff: (select from dropdown)

Auto-generated Email: john.doe@college.edu
\`\`\`

The student can then login with:
- **Email:** `john.doe@college.edu`
- **Password:** Any password (minimum 6 characters)

---

## Example: Creating a Staff User

\`\`\`
Name: Prof. Sarah Smith
Age: 38
Blood Group: A+
Phone Number: +91-9876543220
Department: Computer Science

Auto-generated Email: sarah.smith@college.edu
\`\`\`

The staff can then login with:
- **Email:** `sarah.smith@college.edu`
- **Password:** Any password (minimum 6 characters)

---

## User Roles & Capabilities

### Admin
- Create/Edit/Delete users
- Create/Edit/Delete groups
- Create and send messages to all groups
- View system analytics and health
- Configure system settings

### Staff
- View all messages
- Create and send messages to students/staff/all members
- Schedule messages for later delivery
- View acknowledgment statistics
- Search message archive

### Student
- View all messages
- Acknowledge messages
- View notifications
- Search message archive

---

## Important Notes

- First password is any 6+ character value of your choice
- Email format is auto-generated: firstname.lastname@college.edu
- All data persists in Supabase database
- Admin can manage all users from Admin Panel
