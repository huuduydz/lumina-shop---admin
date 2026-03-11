# 📋 Setup Guide - Lumina Shop & Admin (PP2)

## 🔍 Tổng Quan

Dự án này là một hệ thống **CRM tự xây dựng (PP2)** với:
- **Frontend**: React + TypeScript + Vite
- **Backend**: NodeJS + Express + MySQL
- **Database**: MySQL (Local hoặc Docker)

## 📋 Yêu Cầu Hệ Thống

- **Node.js** >= 16.x
- **MySQL** >= 5.7 (hoặc Docker)
- **Git** (tùy chọn)
- **npm** hoặc **yarn**

## 🚀 Cách 1: Chạy Nhanh (Windows)

### Step 1: Chuẩn bị MySQL

**Cách A: MySQL cài sẵn**
```bash
# Bắt đầu MySQL Service trên Windows
# Hoặc mở MySQL Command Line Client
```

**Cách B: Docker**
```bash
# Cần cài Docker Desktop
# Chạy trong folder project
docker run --name lumina_mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

### Step 2: Check cấu hình

Mở file `server/.env` và kiểm tra:
```env
DB_HOST=localhost       # MySQL server
DB_USER=root            # MySQL user
DB_PASSWORD=            # MySQL password (nếu có)
DB_NAME=lumina_crm      # Database name
```

### Step 3: Chạy tất cả

**Windows:**
```bash
# Double-click start.bat
# Hoặc chạy trong PowerShell/CMD:
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

## 🔧 Cách 2: Setup Chi Tiết (Step by Step)

### Backend Setup

```bash
# 1. Vào folder server
cd server

# 2. Cài đặt dependencies
npm install

# 3. Cấu hình database (server/.env)
# Sửa nếu cần:
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

# 4. Chạy server
npm run dev
# Kết quả: 🚀 Server running on http://localhost:3001
```

### Frontend Setup (Tab/Terminal mới)

```bash
# 1. Từ folder root
cd [project-root]

# 2. Cài đặt dependencies
npm install

# 3. Chạy frontend
npm run dev
# Kết quả: http://localhost:3000/
```

## 🐳 Cách 3: Docker Compose (Recommended)

```bash
# 1. Chuẩn bị
# Cần cài Docker Desktop

# 2. Update server/.env
# Thay đổi DB_HOST từ localhost thành mysql

# 3. Chạy Docker
docker-compose up -d

# 4. Check logs
docker-compose logs -f backend
```

## ✅ Xác Minh Setup

### Frontend
Mở browser: **http://localhost:3000**
- Thấy trang Home → ✅ OK

### Backend
```bash
curl http://localhost:3001/api/health
# Kết quả: {"status":"OK","timestamp":"..."}
```

### Database
```bash
# Kiểm tra databases
mysql -u root -e "SHOW DATABASES LIKE 'lumina%';"

# Kiểm tra tables
mysql -u lumina_crm -e "USE lumina_crm; SHOW TABLES;"
```

## 🎯 Features Đã Implement

### ✅ Level Basic
- Quản lý khách hàng (Add/Edit/Delete)
  - Tên, SĐT, Email, Địa chỉ
- Lịch sử mua hàng (Order tracking)
- Login / Logout
- Membership (Bronze, Silver, Gold, Diamond)

### ✅ Level Advanced
- Dashboard KPI
  - Tổng số khách
  - Doanh thu
  - Số đơn hàng
  - Tỷ lệ khách quay lại
- Referral Program
  - Sinh mã tự động
  - Theo dõi
- Notification System
- Database MySQL

## 📚 API Endpoints Chính

```
GET    /api/crm/dashboard              → Lấy KPI
GET    /api/crm/customers              → Danh sách khách
POST   /api/crm/customers              → Thêm khách
GET    /api/crm/customers/detail/:id   → Chi tiết
PUT    /api/crm/customers/:id          → Cập nhật
DELETE /api/crm/customers/:id          → Xóa

GET    /api/orders                     → Danh sách đơn
POST   /api/orders                     → Tạo đơn
GET    /api/orders/customer/:customerId → Đơn của khách
```

## 🔑 Database Schema

### Customers
```sql
id, name, email, phone, address, membershipLevel, totalSpent, points, referralCode, joinDate
```

### Orders
```sql
id, customerId, orderNumber, totalAmount, status, items, orderDate
```

### Referrals
```sql
id, referrerCustomerId, referredCustomerId, bonusPoints, status, createdAt
```

### Notifications
```sql
id, customerId, message, type, isRead, createdAt
```

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Giải pháp:**
1. Kiểm tra MySQL service: `mysql -u root`
2. Cấu hình .env: DB_HOST, DB_USER, DB_PASSWORD
3. Tạo database: `CREATE DATABASE lumina_crm;`

### Port 3000/3001 Already in Use
```bash
# Kill process on port
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Giải pháp:**
1. Kiểm tra `server/index.js` - CORS config
2. Frontend URL trong `server/.env`:
   ```
   FRONTEND_URL=http://localhost:3000
   ```

## 💡 Mẹo Phát Triển

### Thêm tính năng mới
1. **Backend**: Thêm controller → route → test API
2. **Frontend**: Gọi API từ Context → Component

### Cách cấu trúc code
```
Components → Context (State) → API calls → Backend
```

### Debug
```bash
# Backend logs
tail -f server/logs/app.log

# Frontend browser console
F12 → Console tab
```

## 📞 Hỗ Trợ

Nếu gặp lỗi:
1. Kiểm tra file ERRORS.md (nếu có)
2. Xem logs (Backend/Frontend)
3. Kiểm tra GitHub Issues của project

---

**Happy Coding! 🎉**
