# 🔧 Installation Instructions - PP2 CRM System

## Prerequisites Check

Trước khi bắt đầu, hãy xác minh bạn có:

```bash
# 1. Check Node.js
node --version   # Should be >= 16.x

# 2. Check npm
npm --version    # Should be >= 8.x

# 3. Check Git (optional)
git --version
```

If any is missing, install from:
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/
- **MySQL**: https://www.mysql.com/downloads/
- **Docker**: https://www.docker.com/products/docker-desktop (optional)

---

## 📦 Installation Steps

### Option A: Automatic Setup (Recommended for Windows)

#### Step 1: Prepare MySQL

**Method 1: MySQL Server installed locally**
```powershell
# Open Command Prompt or PowerShell as Administrator
# Start MySQL service
net start MySQL80

# Verify connection
mysql -u root -e "SELECT 1;"
```

**Method 2: Docker (Easier)**
```bash
# Start MySQL in Docker
docker run --name lumina_mysql ^
  -e MYSQL_ROOT_PASSWORD=root ^
  -p 3306:3306 ^
  -d mysql:8.0
```

#### Step 2: Run Install Script

```bash
# Navigate to project root
cd lumina-shop-&-admin

# Run installation
# Windows:
start.bat

# Or if that doesn't work, run for servers separately
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend (new PowerShell window)
npm install
npm run dev
```

---

### Option B: Manual Setup (Step by Step)

#### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
# This installs:
# - express (web framework)
# - mysql2/promise (database driver)
# - cors (cross-origin support)
# - bcryptjs (password hashing - ready for auth)
# - jsonwebtoken (JWT - ready for auth)
# - nodemailer (email sending)
# - dotenv (environment variables)
```

**Frontend:**
```bash
cd .. # back to root
npm install
# This installs:
# - react (UI library)
# - react-router-dom (routing)
# - lucide-react (icons)
# - TypeScript (type checking)
# - Vite (build tool)
```

#### Step 2: Database Setup

**Create Database and User:**

```bash
# Connect to MySQL
mysql -u root

# Then run these SQL commands:
```

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS lumina_crm;

-- Create separate user (optional but recommended)
CREATE USER 'lumina_user'@'localhost' IDENTIFIED BY 'lumina_pass';
GRANT ALL PRIVILEGES ON lumina_crm.* TO 'lumina_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES LIKE 'lumina%';
```

**Or use script:**
```bash
# If you have the SQL script
mysql -u root < setup.sql
```

#### Step 3: Configure Environment

**Backend (.env):**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Leave empty if no password
DB_NAME=lumina_crm

# Server Configuration
PORT=3001
JWT_SECRET=lumina_secret_key_2025

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Frontend (.env.local):**
```bash
cd .. # back to root
cat > .env.local << EOF
VITE_API_URL=http://localhost:3001/api
EOF
```

#### Step 4: Initialize Database

The database will auto-initialize when you start the backend:

```bash
cd server
npm run dev
# Watch for messages:
# ✅ Connected to MySQL
# ✅ All tables created successfully
# ✅ Membership tiers inserted
```

---

## 🚀 Running the Application

### Terminal 1: Backend Server

```bash
cd server
npm run dev
```

**Expected output:**
```
✅ Connected to MySQL
✅ All tables created successfully
✅ Membership tiers inserted

🚀 Server running on http://localhost:3001
📍 Frontend URL: http://localhost:3000
```

### Terminal 2: Frontend Server

Open a **new terminal window** and run:

```bash
cd [project-root]
npm run dev
```

**Expected output:**
```
  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

---

## ✅ Verification

### 1. Check Frontend
Open in browser: **http://localhost:3000**

You should see the Lumina Shop homepage.

### 2. Check Backend

```bash
# Terminal
curl http://localhost:3001/api/health

# Response should be:
# {"status":"OK","timestamp":"2026-03-04T..."}
```

### 3. Check Database

```bash
mysql -u root
USE lumina_crm;
SHOW TABLES;

# Should show:
# - customers
# - orders
# - referrals
# - notifications
# - membershipTiers
# - coupons
# - users
```

### 4. Test API

```bash
# Get customers (empty on first run)
curl http://localhost:3001/api/crm/customers

# Response:
# {"success":true,"data":[]}
```

---

## 🔧 Configuration Reference

### MySQL Connection String

**Default:**
```
Host: localhost
Port: 3306
User: root
Password: (empty)
Database: lumina_crm
```

**If using Docker:**
```
Host: mysql (when running docker-compose)
Port: 3306
User: lumina_user
Password: lumina_pass
Database: lumina_crm
```

### API Endpoints Summary

```
Frontend calls Backend at: http://localhost:3001/api

Key endpoints:
GET  /api/crm/dashboard              → KPI Dashboard
GET  /api/crm/customers              → All customers
POST /api/crm/customers              → Add customer
GET  /api/crm/customers/detail/{id}  → Customer detail
PUT  /api/crm/customers/{id}         → Update customer
DELETE /api/crm/customers/{id}       → Delete customer

GET  /api/orders                     → All orders
POST /api/orders                     → Create order
GET  /api/orders/customer/{id}       → Customer orders
```

---

## 🐛 Troubleshooting

### MySQL Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
```bash
# 1. Check if MySQL is running
mysql -u root -e "SELECT 1;"

# 2. If error, start MySQL:
# Windows:
net start MySQL80

# Mac:
brew services start mysql

# 3. Verify credentials in server/.env
# 4. Create database if missing:
mysql -u root -e "CREATE DATABASE lumina_crm;"
```

### Port Already in Use

```
Error: listen EADDRINUSE :::3001
```

**Solution:**
```bash
# Windows - Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID [PID] /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9

# Or use different port in server/.env
PORT=3002
```

### CORS Error in Browser

```
Access to XMLHttpRequest blocked by CORS
```

**Solution:**
1. Ensure backend is running
2. Check FRONTEND_URL in `server/.env`:
   ```
   FRONTEND_URL=http://localhost:3000
   ```
3. Restart backend

### npm install hangs

```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

---

## 📋 File Structure After Installation

```
lumina-shop-&-admin/
├── node_modules/          # Frontend dependencies
├── server/
│   ├── node_modules/      # Backend dependencies
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env               # Database configuration
│   ├── package.json
│   └── index.js
├── src/                   # React components
├── public/
├── .env.local            # Frontend environment
├── vite.config.ts
├── package.json
└── (other files)
```

---

## 🔑 First Run Checklist

- [ ] Node.js installed and >= 16.x
- [ ] MySQL running locally or in Docker
- [ ] `server/.env` configured correctly
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running on :3001
- [ ] Frontend server running on :3000
- [ ] Can access http://localhost:3000 in browser
- [ ] No errors in console/terminal
- [ ] Database tables created successfully

---

## 🎉 Next Steps

1. **Create Admin Account** (when auth is complete)
2. **Add Sample Customers** via Admin UI
3. **Create Test Orders** to see dashboard
4. **Test Referral Program** with multiple customers
5. **Configure Email** (if implementing)

---

**Installation Complete! Happy Coding! 🚀**

For more help, see: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
