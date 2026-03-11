<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🛍️ Lumina Shop & Admin - PP2 CRM Project

Hệ thống quản lý cửa hàng bán hàng điện tử và CRM được xây dựng từ đầu (Local)

## 📦 Project Structure

```
lumina-shop-&-admin/
├── src/                  # Frontend React code
│   ├── context/         # React Context (Auth, Cart, CRM, Orders...)
│   ├── pages/           # Pages (Home, Shop, Admin, CRM...)
│   └── ...
├── server/              # Backend NodeJS + Express API
│   ├── config/          # Database config
│   ├── models/          # Database models
│   ├── controllers/      # API controllers
│   ├── routes/          # API routes
│   ├── package.json
│   └── index.js         # Main server file
├── vite.config.ts       # Vite configuration
└── tsconfig.json
```

## 🚀 Quick Start

### Frontend Setup

```bash
# Install frontend dependencies
npm install

# Run dev server (Frontend)
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

### Backend Setup

```bash
# Install backend dependencies
cd server
npm install

# Run backend server
npm run dev
```

Backend sẽ chạy tại: **http://localhost:3001/api**

## ⚙️ Configuration

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lumina_crm
JWT_SECRET=lumina_secret_key_2025
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## ✨ Tính năng PP2 (Implemented)

- ✅ Quản lý khách hàng (CRUD)
- ✅ Lịch sử mua hàng
- ✅ Login/Logout với phân quyền
- ✅ Membership Level (Bronze, Silver, Gold, Diamond)
- ✅ Dashboard KPI
- ✅ Referral Program (Mã giới thiệu)
- ✅ Notifications system
- ✅ Database MySQL integration
- ✅ RESTful API

## 📚 API Documentation

Xem chi tiết tại: [Server README](./server/README.md)
