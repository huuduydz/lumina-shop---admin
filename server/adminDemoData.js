import Customer from './models/Customer.js';
import Order from './models/Order.js';
import Product from './models/Product.js';
import { calculateMembershipLevel, calculateRewardPoints } from './utils/customerMetrics.js';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DEMO_NOTE_PREFIX = '[DEMO-SEED]';

const demoCustomers = [
  {
    name: 'Nguyen Minh Anh',
    email: 'minhanh.demo@lumina.vn',
    phone: '+84 912 345 101',
    address: '12 Nguyen Hue, District 1, Ho Chi Minh City',
    referredBy: 'Facebook Ads',
    joinDate: '2026-01-08T09:00:00.000Z'
  },
  {
    name: 'Tran Bao Chau',
    email: 'baochau.demo@lumina.vn',
    phone: '+84 934 567 202',
    address: '88 Le Loi, Hai Chau, Da Nang',
    referredBy: 'Friend Referral',
    joinDate: '2026-01-15T10:30:00.000Z'
  },
  {
    name: 'Le Hoang Duy',
    email: 'hoangduy.demo@lumina.vn',
    phone: '+84 978 654 303',
    address: '145 Tran Phu, Nha Trang, Khanh Hoa',
    referredBy: 'Zalo OA',
    joinDate: '2026-02-02T08:20:00.000Z'
  },
  {
    name: 'Pham Gia Han',
    email: 'giahan.demo@lumina.vn',
    phone: '+84 909 234 404',
    address: '37 Bach Dang, Hai Chau, Da Nang',
    referredBy: 'Instagram',
    joinDate: '2026-02-18T07:45:00.000Z'
  },
  {
    name: 'Vo Quoc Viet',
    email: 'quocviet.demo@lumina.vn',
    phone: '+84 936 112 505',
    address: '216 Cach Mang Thang 8, Ninh Kieu, Can Tho',
    referredBy: 'Returning Customer',
    joinDate: '2026-03-04T12:10:00.000Z'
  }
];

const demoOrderTemplates = [
  {
    key: 'demo-order-001',
    customerEmail: 'minhanh.demo@lumina.vn',
    paymentMethod: 'Momo',
    status: 'Delivered',
    daysAgo: 28,
    discount: 20,
    items: [
      { productOffset: 0, quantity: 1, colorIndex: 0, sizeIndex: 0 },
      { productOffset: 6, quantity: 1, colorIndex: 1, sizeIndex: 0 }
    ]
  },
  {
    key: 'demo-order-002',
    customerEmail: 'baochau.demo@lumina.vn',
    paymentMethod: 'COD',
    status: 'Processing',
    daysAgo: 14,
    discount: 0,
    items: [{ productOffset: 2, quantity: 2, colorIndex: 0, sizeIndex: 0 }]
  },
  {
    key: 'demo-order-003',
    customerEmail: 'hoangduy.demo@lumina.vn',
    paymentMethod: 'Credit Card',
    status: 'Shipped',
    daysAgo: 10,
    discount: 15,
    items: [
      { productOffset: 10, quantity: 1, colorIndex: 1, sizeIndex: 1 },
      { productOffset: 17, quantity: 1, colorIndex: 0, sizeIndex: 0 }
    ]
  },
  {
    key: 'demo-order-004',
    customerEmail: 'minhanh.demo@lumina.vn',
    paymentMethod: 'PayPal',
    status: 'Delivered',
    daysAgo: 6,
    discount: 10,
    items: [{ productOffset: 23, quantity: 1, colorIndex: 0, sizeIndex: 0 }]
  },
  {
    key: 'demo-order-005',
    customerEmail: 'giahan.demo@lumina.vn',
    paymentMethod: 'COD',
    status: 'Pending',
    daysAgo: 3,
    discount: 0,
    items: [
      { productOffset: 35, quantity: 1, colorIndex: 1, sizeIndex: 0 },
      { productOffset: 41, quantity: 2, colorIndex: 0, sizeIndex: 0 }
    ]
  },
  {
    key: 'demo-order-006',
    customerEmail: 'quocviet.demo@lumina.vn',
    paymentMethod: 'Momo',
    status: 'Delivered',
    daysAgo: 1,
    discount: 25,
    items: [
      { productOffset: 52, quantity: 1, colorIndex: 0, sizeIndex: 0 },
      { productOffset: 70, quantity: 1, colorIndex: 1, sizeIndex: 1 }
    ]
  }
];

const fallbackProducts = [
  {
    id: 'DEMO-PROD-001',
    name: 'Lumina Smart Headphones',
    category: 'Electronics',
    price: 129,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    availableColors: [{ name: 'Black', hex: '#111827' }],
    availableSizes: ['Standard']
  },
  {
    id: 'DEMO-PROD-002',
    name: 'Urban Carry Backpack',
    category: 'Accessories',
    price: 89,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    availableColors: [{ name: 'Sand', hex: '#D6B98C' }],
    availableSizes: ['M']
  },
  {
    id: 'DEMO-PROD-003',
    name: 'Minimal Desk Lamp',
    category: 'Home Decor',
    price: 75,
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
    availableColors: [{ name: 'White', hex: '#F8FAFC' }],
    availableSizes: ['Standard']
  }
];

const toCurrencyNumber = (value) => Number(Number(value).toFixed(2));

const selectVariant = (list, index, fallback) => {
  if (!Array.isArray(list) || list.length === 0) {
    return fallback;
  }

  return list[index % list.length];
};

const buildOrderItem = (product, config) => {
  const color = selectVariant(product.availableColors, config.colorIndex ?? 0, { name: 'Standard' });
  const selectedSize = selectVariant(product.availableSizes, config.sizeIndex ?? 0, undefined);

  return {
    id: product.id || product.productId || `DEMO-ITEM-${config.productOffset}`,
    name: product.name,
    category: product.category,
    price: toCurrencyNumber(product.price ?? 0),
    image: product.image,
    quantity: config.quantity,
    selectedColor: color?.name || 'Standard',
    ...(selectedSize ? { selectedSize } : {}),
    stockStatus: product.stockStatus || 'In Stock',
    stockQuantity: Number(product.stockQuantity ?? 0),
    minStock: Number(product.minStock ?? 0),
    sku: product.sku || '',
    description: product.description || ''
  };
};

const getProductsForSeed = async () => {
  const products = await Product.getAll();
  return products.length > 0 ? products : fallbackProducts;
};

const ensureDemoCustomers = async () => {
  const existingCustomers = await Customer.getAll();
  const customerMap = new Map(
    existingCustomers.map((customer) => [customer.email.toLowerCase(), customer])
  );

  for (const sample of demoCustomers) {
    const email = sample.email.toLowerCase();
    if (!customerMap.has(email)) {
      const created = await Customer.create(sample);
      customerMap.set(email, created);
    }
  }

  return customerMap;
};

const ensureDemoOrders = async (customerMap) => {
  const products = await getProductsForSeed();
  const existingOrders = await Order.getAll();
  const existingDemoOrderKeys = new Set(
    existingOrders
      .map((order) => order.notes)
      .filter((note) => typeof note === 'string' && note.startsWith(DEMO_NOTE_PREFIX))
  );

  let createdOrders = 0;

  for (const template of demoOrderTemplates) {
    const note = `${DEMO_NOTE_PREFIX}:${template.key}`;
    if (existingDemoOrderKeys.has(note)) {
      continue;
    }

    const customer = customerMap.get(template.customerEmail.toLowerCase());
    if (!customer) {
      continue;
    }

    const items = template.items.map((item) =>
      buildOrderItem(products[item.productOffset % products.length], item)
    );
    const subtotal = toCurrencyNumber(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const discount = toCurrencyNumber(template.discount ?? 0);
    const totalAmount = toCurrencyNumber(Math.max(subtotal - discount, 0));

    await Order.create({
      customerId: customer.id,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        note: ''
      },
      subtotal,
      discount,
      totalAmount,
      paymentMethod: template.paymentMethod,
      status: template.status,
      items,
      notes: note,
      orderDate: new Date(Date.now() - template.daysAgo * DAY_IN_MS),
      crmSynced: true
    });

    createdOrders += 1;
  }

  return createdOrders;
};

const refreshCustomerMemberships = async (customerMap) => {
  for (const customer of customerMap.values()) {
    const orders = await Order.getByCustomerId(customer.id);
    const totalSpent = orders
      .filter((order) => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    await Customer.updateMembership(
      customer.id,
      calculateMembershipLevel(totalSpent),
      totalSpent,
      calculateRewardPoints(totalSpent)
    );
  }
};

export const ensureAdminDemoData = async () => {
  const customerMap = await ensureDemoCustomers();
  const createdOrders = await ensureDemoOrders(customerMap);
  await refreshCustomerMemberships(customerMap);

  const customers = await Customer.getAll();
  const orders = await Order.getAll();

  return {
    createdOrders,
    totalCustomers: customers.length,
    totalOrders: orders.length
  };
};

export default ensureAdminDemoData;
