# Lumina CRM Backend API

Backend API cho hệ thống CRM quản lý khách hàng Lumina Shop.

## 🚀 Công nghệ

- **Node.js** + **Express.js**
- **MySQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email notifications

## 📋 Yêu cầu

- Node.js >= 16
- MySQL Server >= 5.7
- npm hoặc yarn

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
cd server
npm install
```

### 2. Cấu hình database

Sửa file `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lumina_crm
JWT_SECRET=your_secret_key
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Khởi tạo Database

Database sẽ tự động khởi tạo khi server startup (nếu chưa có).

Tables được tạo:
- `users` - Admin/Staff accounts
- `customers` - Customer information
- `orders` - Customer orders
- `referrals` - Referral program tracking
- `notifications` - Customer notifications
- `membershipTiers` - Membership configurations
- `coupons` - Discount coupons

## ✅ Chạy Server

### Development

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3001`

### Production

```bash
npm start
```

## 📚 API Endpoints

### CRM - Quản lý khách hàng

#### Dashboard
- `GET /api/crm/dashboard` - Lấy thống kê dashboard

#### Customers
- `GET /api/crm/customers` - Lấy danh sách khách hàng
- `GET /api/crm/customers/detail/:id` - Chi tiết khách hàng
- `POST /api/crm/customers` - Thêm khách hàng
- `PUT /api/crm/customers/:id` - Cập nhật khách hàng
- `DELETE /api/crm/customers/:id` - Xóa khách hàng

#### Membership
- `GET /api/crm/customers/membership/:level` - Lấy khách hàng theo cấp độ

#### Top Customers
- `GET /api/crm/customers/top?limit=10` - Top khách hàng chi tiêu cao nhất

### Orders - Quản lý đơn hàng

#### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/customer/:customerId` - Đơn hàng của khách hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

#### Statistics
- `GET /api/orders/stats/revenue` - Thống kê doanh thu

## 🎯 Tính năng PP2

✅ **Quản lý khách hàng**
- Thêm/sửa/xóa khách hàng
- Lưu thông tin: Tên, SĐT, Email, Địa chỉ

✅ **Lịch sử mua hàng**
- Xem đơn hàng
- Tổng tiền
- Sản phẩm đã mua

✅ **Login/Logout**
- Phân quyền: Admin, Staff

✅ **Membership**
- Bronze: < 5 triệu
- Silver: 5-10 triệu
- Gold: 10-20 triệu
- Diamond: > 20 triệu

✅ **Dashboard KPI**
- Tổng số khách hàng
- Doanh thu tháng
- Số đơn hàng
- Tỷ lệ khách quay lại

✅ **Referral Program**
- Sinh mã tự động
- Theo dõi số người giới thiệu
- Thưởng điểm

✅ **Notifications**
- Gửi thông báo
- Email marketing (Nodemailer)

## 📱 Frontend Integration

Frontend React sẽ gọi API qua file `api.ts`:

```typescript
import { crmAPI, orderAPI } from './api';

// Lấy danh sách khách hàng
const { data: customers } = await crmAPI.getCustomers();

// Lấy dashboard
const { data: dashboard } = await crmAPI.getDashboard();

// Tạo đơn hàng
await orderAPI.createOrder({
  customerId: 1,
  totalAmount: 5000000,
  items: [...],
  notes: "Order notes"
});
```

## 🔗 Liên kết

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

## 📝 Ghi chú

- Tất cả responses là JSON
- Tất cả dates ở định dạng ISO 8601
- Membership level tự động cập nhật dựa vào tổng chi tiêu

## ⚠️ Tiếp theo

Để hoàn thiện PP2, cần thêm:
1. Authentication API (Login/Register)
2. Email notifications
3. Referral tracking chi tiết
4. Admin user management
