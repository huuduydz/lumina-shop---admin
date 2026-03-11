-- ===================================================
-- LUMINA CRM - SAMPLE DATA
-- Tạo dữ liệu mẫu cho hệ thống
-- ===================================================

-- Sử dụng database
USE lumina_crm;

-- ===================================================
-- 1. ADMIN USERS
-- ===================================================

INSERT INTO users (name, email, password, role, status, avatar, lastLogin) VALUES
('Admin Lumina', 'admin@lumina.com', 'hashed_password_here', 'Admin', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', NOW()),
('Nhân viên Hà Nội', 'staff.hanoi@lumina.com', 'hashed_password_here', 'Staff', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff1', NOW()),
('Nhân viên TP HCM', 'staff.hcm@lumina.com', 'hashed_password_here', 'Staff', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff2', NOW());

-- ===================================================
-- 2. CUSTOMERS - Gold & Diamond
-- ===================================================

INSERT INTO customers (name, email, phone, address, membershipLevel, totalSpent, points, referralCode, referralCount, joinDate, lastPurchaseDate) VALUES

-- Diamond Tier (> 20 triệu)
('Nguyễn Văn Anh', 'nva@email.com', '0912345678', '123 Đường Lê Lợi, TP HCM', 'Diamond', 45000000, 4500, 'REF-NGUYEN-001', 5, '2023-01-15 10:30:00', '2026-02-28 15:45:00'),
('Trần Thị Bình', 'ttb@email.com', '0987654321', '456 Đường Võ Văn Kiệt, TP HCM', 'Diamond', 38500000, 3850, 'REF-TRAN-002', 3, '2023-02-20 14:20:00', '2026-03-02 09:15:00'),
('Phạm Minh Chính', 'pmc@email.com', '0923456789', '789 Đường Nguyễn Huệ, TP HCM', 'Diamond', 52000000, 5200, 'REF-PHAM-003', 8, '2022-12-10 11:00:00', '2026-03-01 16:30:00'),

-- Gold Tier (10-20 triệu)
('Đặng Hoàng Đức', 'dhd@email.com', '0934567890', '012 Đường Lê Thánh Tông, Hà Nội', 'Gold', 18500000, 1850, 'REF-DANG-004', 2, '2023-04-05 09:45:00', '2026-02-25 13:20:00'),
('Hoàng Thanh Ený', 'hte@email.com', '0945678901', '345 Đường Trần Hưng Đạo, Hà Nội', 'Gold', 15200000, 1520, 'REF-HOANG-005', 4, '2023-05-12 10:15:00', '2026-02-20 14:45:00'),
('Lý Thành Phong', 'lsp@email.com', '0956789012', '678 Đường Hàng Bộc, Hà Nội', 'Gold', 12750000, 1275, 'REF-LY-006', 1, '2023-06-18 15:30:00', '2026-03-03 10:00:00'),

-- Silver Tier (5-10 triệu)
('Võ Quốc Hùng', 'vqh@email.com', '0967890123', '910 Đường Chu Văn An, TP HCM', 'Silver', 8900000, 890, 'REF-VO-007', 0, '2023-07-22 12:00:00', '2026-02-15 11:30:00'),
('Bùi Mỹ Hạnh', 'bmh@email.com', '0978901234', '234 Đường Bến Cát, Bình Dương', 'Silver', 6750000, 675, 'REF-BUI-008', 2, '2023-08-30 09:20:00', '2026-02-28 15:10:00'),
('Chu Tuấn Minh', 'ctm@email.com', '0989012345', '567 Đường Trường Chinh, Bình Dương', 'Silver', 7200000, 720, 'REF-CHU-009', 1, '2023-09-14 13:45:00', '2026-03-02 12:25:00'),

-- Bronze Tier (< 5 triệu)
('Tô Ngọc Linh', 'tnl@email.com', '0990123456', '890 Đường Khánh Hội, TP HCM', 'Bronze', 2500000, 250, 'REF-TO-010', 0, '2024-01-05 14:15:00', '2026-02-10 10:00:00'),
('Đỗ Minh Quân', 'dmq@email.com', '0901234567', '123 Đường Cách Mạng Tháng 8, TP HCM', 'Bronze', 1850000, 185, 'REF-DO-011', 0, '2024-02-10 11:30:00', '2026-02-22 14:40:00'),
('Phan Anh Túi', 'pat@email.com', '0912345670', '456 Đường Trần Hữu Tước, Hà Nội', 'Bronze', 3200000, 320, 'REF-PHAN-012', 1, '2024-03-15 09:50:00', '2026-03-01 16:15:00');

-- ===================================================
-- 3. ORDERS - Đơn hàng mẫu
-- ===================================================

INSERT INTO orders (customerId, orderNumber, totalAmount, status, items, notes, orderDate) VALUES

-- Orders cho Nguyễn Văn Anh (Diamond)
(1, 'ORD-1709044200001', 5500000, 'Delivered', '[{"id":1,"name":"Laptop Dell XPS 13","price":12000000,"quantity":1}]', 'Giao thành công', '2026-01-15 10:30:00'),
(1, 'ORD-1709044200002', 3200000, 'Delivered', '[{"id":2,"name":"Chuột Logitech MX Master 3","price":1600000,"quantity":2}]', 'Giao thành công', '2026-02-05 14:20:00'),
(1, 'ORD-1709044200003', 8500000, 'Shipped', '[{"id":3,"name":"Màn hình 4K LG 27 inch","price":8500000,"quantity":1}]', 'Đang giao hàng', '2026-02-28 15:45:00'),

-- Orders cho Trần Thị Bình (Diamond)
(2, 'ORD-1709044200004', 4200000, 'Delivered', '[{"id":4,"name":"Keyboard cơ RK Akko","price":2100000,"quantity":2}]', 'Giao thành công', '2026-01-20 09:15:00'),
(2, 'ORD-1709044200005', 6800000, 'Processing', '[{"id":5,"name":"Tai nghe Sony WH-1000XM5","price":6800000,"quantity":1}]', 'Đang xử lý', '2026-03-02 09:15:00'),

-- Orders cho Phạm Minh Chính (Diamond)
(3, 'ORD-1709044200006', 9200000, 'Delivered', '[{"id":6,"name":"iPad Air M1","price":18400000,"quantity":1}]', 'Giao thành công', '2026-02-10 11:30:00'),
(3, 'ORD-1709044200007', 5500000, 'Delivered', '[{"id":7,"name":"Apple Pencil","price":2750000,"quantity":2}]', 'Giao thành công', '2026-03-01 16:30:00'),

-- Orders cho Đặng Hoàng Đức (Gold)
(4, 'ORD-1709044200008', 3800000, 'Delivered', '[{"id":8,"name":"Chuột Razer DeathAdder V3","price":1900000,"quantity":2}]', 'Giao thành công', '2026-01-25 13:20:00'),
(4, 'ORD-1709044200009', 4500000, 'Delivered', '[{"id":9,"name":"Webcam Logitech 4K","price":4500000,"quantity":1}]', 'Giao thành công', '2026-02-25 13:20:00'),

-- Orders cho Hoàng Thanh Ény (Gold)
(5, 'ORD-1709044200010', 6200000, 'Delivered', '[{"id":10,"name":"Monitor ASUS 165Hz","price":6200000,"quantity":1}]', 'Giao thành công', '2026-02-01 14:45:00'),
(5, 'ORD-1709044200011', 5000000, 'Processing', '[{"id":11,"name":"Bàn phím Ducky One 3","price":5000000,"quantity":1}]', 'Đang xử lý', '2026-02-20 14:45:00'),

-- Orders cho Lý Thành Phong (Gold)
(6, 'ORD-1709044200012', 3250000, 'Delivered', '[{"id":12,"name":"Mouse pad SteelSeries QCK","price":650000,"quantity":5}]', 'Giao thành công', '2026-01-30 10:00:00'),
(6, 'ORD-1709044200013', 4500000, 'Shipped', '[{"id":13,"name":"Headset HyperX Cloud","price":4500000,"quantity":1}]', 'Đang giao hàng', '2026-03-03 10:00:00'),

-- Orders cho Võ Quốc Hùng (Silver)
(7, 'ORD-1709044200014', 2800000, 'Delivered', '[{"id":14,"name":"USB Hub Anker","price":700000,"quantity":4}]', 'Giao thành công', '2026-02-05 11:30:00'),

-- Orders cho Bùi Mỹ Hạnh (Silver)
(8, 'ORD-1709044200015', 3300000, 'Delivered', '[{"id":15,"name":"Cáp HDMI 2.1","price":550000,"quantity":6}]', 'Giao thành công', '2026-02-15 15:10:00'),
(8, 'ORD-1709044200016', 2450000, 'Pending', '[{"id":16,"name":"Bộ sạc nhanh 65W","price":1225000,"quantity":2}]', 'Chờ xác nhận', '2026-02-28 15:10:00'),

-- Orders cho Chu Tuấn Minh (Silver)
(9, 'ORD-1709044200017', 3600000, 'Delivered', '[{"id":17,"name":"Webcam HD 1080P","price":1800000,"quantity":2}]', 'Giao thành công', '2026-02-20 12:25:00'),

-- Orders cho Tô Ngọc Linh (Bronze)
(10, 'ORD-1709044200018', 1250000, 'Delivered', '[{"id":18,"name":"Cáp Type-C 2m","price":250000,"quantity":5}]', 'Giao thành công', '2026-02-05 10:00:00'),

-- Orders cho Đỗ Minh Quân (Bronze)
(11, 'ORD-1709044200019', 925000, 'Delivered', '[{"id":19,"name":"Adapter USB-C","price":185000,"quantity":5}]', 'Giao thành công', '2026-02-10 14:40:00'),

-- Orders cho Phan Anh Túi (Bronze)
(12, 'ORD-1709044200020', 1600000, 'Delivered', '[{"id":20,"name":"Dán bảo vệ màn hình","price":160000,"quantity":10}]', 'Giao thành công', '2026-02-15 16:15:00'),
(12, 'ORD-1709044200021', 1200000, 'Shipped', '[{"id":21,"name":"Ốp lưng điện thoại","price":400000,"quantity":3}]', 'Đang giao hàng', '2026-03-01 16:15:00');

-- ===================================================
-- 4. REFERRALS - Chương trình giới thiệu
-- ===================================================

INSERT INTO referrals (referrerCustomerId, referredCustomerId, referralCode, bonusPoints, status, createdAt, completedAt) VALUES

-- Nguyễn Văn Anh (5 referrals)
(1, 7, 'REF-NGUYEN-001', 100, 'Completed', '2024-06-15 10:00:00', '2024-07-15 10:00:00'),
(1, 10, 'REF-NGUYEN-001', 100, 'Completed', '2024-07-20 14:30:00', '2024-08-20 14:30:00'),
(1, 12, 'REF-NGUYEN-001', 100, 'Completed', '2024-08-10 11:20:00', '2024-09-10 11:20:00'),
(1, 8, 'REF-NGUYEN-001', 100, 'Completed', '2024-09-05 15:45:00', '2024-10-05 15:45:00'),
(1, 11, 'REF-NGUYEN-001', 100, 'Pending', '2024-10-01 09:30:00', NULL),

-- Trần Thị Bình (3 referrals)
(2, 4, 'REF-TRAN-002', 100, 'Completed', '2024-06-20 13:15:00', '2024-07-20 13:15:00'),
(2, 9, 'REF-TRAN-002', 100, 'Completed', '2024-08-15 10:45:00', '2024-09-15 10:45:00'),
(2, 6, 'REF-TRAN-002', 100, 'Pending', '2024-09-20 14:20:00', NULL),

-- Phạm Minh Chính (8 referrals)
(3, 5, 'REF-PHAM-003', 100, 'Completed', '2024-07-01 11:30:00', '2024-08-01 11:30:00'),
(3, 7, 'REF-PHAM-003', 100, 'Completed', '2024-07-15 15:00:00', '2024-08-15 15:00:00'),
(3, 8, 'REF-PHAM-003', 100, 'Completed', '2024-08-20 09:45:00', '2024-09-20 09:45:00'),
(3, 10, 'REF-PHAM-003', 100, 'Completed', '2024-09-10 13:20:00', '2024-10-10 13:20:00'),
(3, 11, 'REF-PHAM-003', 100, 'Completed', '2024-10-05 14:30:00', '2024-11-05 14:30:00'),
(3, 12, 'REF-PHAM-003', 100, 'Completed', '2024-11-01 10:15:00', '2024-12-01 10:15:00'),
(3, 9, 'REF-PHAM-003', 100, 'Pending', '2024-12-20 16:45:00', NULL),
(3, 6, 'REF-PHAM-003', 100, 'Pending', '2025-01-10 11:00:00', NULL);

-- ===================================================
-- 5. COUPONS - Mã khuyến mãi
-- ===================================================

INSERT INTO coupons (code, description, type, value, usageCount, usageLimit, expiryDate, status) VALUES

-- Percentage Discount
('SUMMER2026', 'Giảm 20% tất cả sản phẩm mùa hè', 'Percentage', 20, 45, 100, '2026-06-30 23:59:59', 'Active'),
('NEWUSER10', 'Giảm 10% cho khách hàng mới', 'Percentage', 10, 123, 500, '2026-12-31 23:59:59', 'Active'),
('VIP25', 'VIP Member - 25% off', 'Percentage', 25, 8, 50, '2026-09-30 23:59:59', 'Active'),

-- Fixed Amount
('FIXED500K', 'Giảm 500K cho đơn từ 5 triệu', 'Fixed Cart', 500000, 32, 100, '2026-06-30 23:59:59', 'Active'),
('LUCKY100K', 'Giảm 100K cho tất cả đơn hàng', 'Fixed Cart', 100000, 156, 500, '2026-12-31 23:59:59', 'Active'),

-- Free Shipping
('FREESHIP', 'Miễn phí vận chuyển', 'Free Shipping', 0, 78, 1000, '2026-12-31 23:59:59', 'Active'),
('SHIPFREE50K', 'Miễn phí ship cho đơn trên 50K', 'Free Shipping', 0, 245, 2000, '2026-12-31 23:59:59', 'Active'),

-- Product Discount
('LAPTOP100K', 'Giảm 100K cho Laptop', 'Fixed Product', 100000, 12, 50, '2026-05-31 23:59:59', 'Scheduled'),

-- Expired
('OLD2025', 'Mã cũ đã hết hạn', 'Percentage', 15, 50, 100, '2025-12-31 23:59:59', 'Expired');

-- ===================================================
-- 6. NOTIFICATIONS - Thông báo mẫu
-- ===================================================

INSERT INTO notifications (customerId, title, message, type, isRead, createdAt) VALUES

-- Notifications cho Nguyễn Văn Anh
(1, 'Nâng cấp thành viên', 'Chúc mừng! Bạn đã nâng cấp lên thành viên Diamond. Bạn được hưởng 20% giảm giá tất cả sản phẩm.', 'Success', 1, '2026-02-28 15:50:00'),
(1, 'Đơn hàng mới', 'Đơn hàng ORD-1709044200003 của bạn đang được chuẩn bị giao. Mã theo dõi: TRACKING123', 'Info', 1, '2026-02-28 16:00:00'),
(1, 'Ưu đãi đặc biệt', 'Bạn có 100 điểm reward! Dùng ngay để nhận ưu đãi.', 'Success', 0, '2026-03-04 08:30:00'),

-- Notifications cho Trần Thị Bình
(2, 'Đơn hàng chờ xác nhận', 'Đơn hàng ORD-1709044200005 cần xác nhận trong 24 giờ.', 'Warning', 0, '2026-03-02 09:20:00'),
(2, 'Giản giữa người giới thiệu', 'Bạn đã giới thiệu 1 khách hàng mới. Nhận 100 điểm thưởng!', 'Success', 1, '2026-02-15 10:00:00'),

-- Notifications cho Phạm Minh Chính
(3, 'Mã khuyến mãi mới', 'Bạn có mã VIP25 - Giảm 25% cho các sản phẩm cao cấp. Hạn sử dụng: 30/09/2026', 'Info', 0, '2026-03-03 09:00:00'),
(3, 'Giao dịch thành công', 'Giao dịch ORD-1709044200007 đã hoàn tất. Cảm ơn bạn đã mua hàng!', 'Success', 1, '2026-03-01 17:00:00'),

-- Notifications cho Võ Quốc Hùng
(7, 'Bạn gần đó rồi!', 'Bạn cần chi tiêu thêm 1.1 triệu để nâng cấp lên Silver. Hãy tiếp tục mua sắm!', 'Info', 0, '2026-02-10 12:00:00'),

-- Notifications cho Bùi Mỹ Hạnh
(8, 'Đơn hàng đang chờ', 'Đơn hàng ORD-1709044200016 chưa được xác nhận. Nhấp để xem chi tiết.', 'Warning', 0, '2026-02-28 15:30:00'),

-- Notifications cho mới khách hàng
(10, 'Chào mừng', 'Chào mừng bạn đến với Lumina Shop! Nhận ngay 10% giảm giá cho đơn hàng đầu tiên với mã NEWUSER10', 'Success', 1, '2024-01-05 14:20:00'),
(11, 'Đơn hàng hoàn tất', 'Đơn hàng ORD-1709044200019 đã giao thành công. Cảm ơn bạn!', 'Success', 1, '2026-02-10 20:00:00'),
(12, 'Khuyến mãi hạn chế', 'Chỉ còn 5 mã LUCKY100K! Dùng ngay để nhận giảm 100K.', 'Warning', 0, '2026-03-02 10:00:00');

-- ===================================================
-- SUMMARY - Tóm tắt dữ liệu
-- ===================================================

-- Tổng số khách hàng: 12 (3 Diamond, 3 Gold, 3 Silver, 3 Bronze)
-- Tổng số đơn hàng: 22
-- Tổng doanh thu: ~245 triệu VND
-- Tổng điểm thưởng: ~23,500 điểm
-- Mã giới thiệu hoàn thành: 14
-- Mã giới thiệu chờ: 3

SELECT 'Dữ liệu mẫu đã được thêm thành công!' AS 'Status';
