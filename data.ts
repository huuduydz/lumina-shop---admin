import {
  Coupon,
  Product,
  ProductColorOption,
  ProductReview,
  ProductSpecification,
  SecurityLog,
  User
} from './types';

type CategoryKey = 'Electronics' | 'Fashion' | 'Home Decor' | 'Footwear' | 'Accessories';

interface CategorySeed {
  category: CategoryKey;
  prefix: string;
  basePrice: number;
  priceStep: number;
  names: string[];
  images: string[];
  colors: ProductColorOption[];
  sizes: string[];
}

const CATEGORY_COLORS: Record<CategoryKey, ProductColorOption[]> = {
  Electronics: [
    { name: 'Midnight Black', hex: '#0f172a' },
    { name: 'Silver', hex: '#cbd5e1' },
    { name: 'Navy Blue', hex: '#1d4ed8' }
  ],
  Fashion: [
    { name: 'Ivory', hex: '#f8fafc' },
    { name: 'Camel', hex: '#b45309' },
    { name: 'Forest', hex: '#166534' }
  ],
  'Home Decor': [
    { name: 'Clay', hex: '#b45309' },
    { name: 'Stone', hex: '#64748b' },
    { name: 'Olive', hex: '#4d7c0f' }
  ],
  Footwear: [
    { name: 'Jet Black', hex: '#111827' },
    { name: 'Cloud White', hex: '#f8fafc' },
    { name: 'Race Red', hex: '#dc2626' }
  ],
  Accessories: [
    { name: 'Classic Black', hex: '#0f172a' },
    { name: 'Gold Accent', hex: '#ca8a04' },
    { name: 'Mocha', hex: '#92400e' }
  ]
};

const CATEGORY_SIZES: Record<CategoryKey, string[]> = {
  Electronics: ['Standard', 'Plus', 'Pro'],
  Fashion: ['S', 'M', 'L', 'XL'],
  'Home Decor': ['Small', 'Medium', 'Large'],
  Footwear: ['39', '40', '41', '42'],
  Accessories: ['Compact', 'Standard', 'Premium']
};

const CATEGORY_IMAGES: Record<CategoryKey, string[]> = {
  Electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop'
  ],
  Fashion: [
    'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop'
  ],
  'Home Decor': [
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop'
  ],
  Footwear: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528701800489-20be3c30c1d5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1200&auto=format&fit=crop'
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop'
  ]
};

const CATEGORY_SEEDS: CategorySeed[] = [
  {
    category: 'Electronics',
    prefix: 'TECH',
    basePrice: 149,
    priceStep: 28,
    names: [
      'Wireless Noise-Cancelling Headphones Pro',
      'Series 7 Smart Watch',
      'Instant Film Camera',
      'Ultra-Slim 14" Laptop',
      '4K Ultra HD Monitor',
      'Smart Home Speaker',
      'Retro Mechanical Keyboard',
      'Wireless Gaming Mouse',
      'Portable Bluetooth Speaker',
      'USB-C Fast Charging Hub',
      'Smart Air Purifier Mini',
      'Action Camera 5K',
      'True Wireless Earbuds Max',
      'Mechanical Number Pad',
      'Gaming Headset Elite',
      'Mini Projector Beam',
      'Magnetic Wireless Charger',
      'Tablet Stand Dock',
      'Creator Streaming Mic',
      'Home Security Camera Kit'
    ],
    images: CATEGORY_IMAGES.Electronics,
    colors: CATEGORY_COLORS.Electronics,
    sizes: CATEGORY_SIZES.Electronics
  },
  {
    category: 'Fashion',
    prefix: 'FASH',
    basePrice: 49,
    priceStep: 11,
    names: [
      'Classic Vintage Denim Jacket',
      'Summer Floral Maxi Dress',
      'Leather Crossbody Bag',
      'Oversized Cotton Blazer',
      'Relaxed Linen Shirt',
      'City Commuter Trench Coat',
      'Pleated Midi Skirt',
      'Silk Blend Office Blouse',
      'Everyday Straight Jeans',
      'Premium Knit Cardigan',
      'Minimal Tailored Trousers',
      'Weekend Ribbed Tee',
      'Structured Work Tote',
      'Lightweight Bomber Jacket',
      'Soft Cashmere Scarf',
      'Layered Travel Hoodie',
      'Classic Polo Dress',
      'Studio Wide-Leg Pants',
      'Modern Utility Vest',
      'Signature Leather Belt'
    ],
    images: CATEGORY_IMAGES.Fashion,
    colors: CATEGORY_COLORS.Fashion,
    sizes: CATEGORY_SIZES.Fashion
  },
  {
    category: 'Home Decor',
    prefix: 'HOME',
    basePrice: 35,
    priceStep: 19,
    names: [
      'Minimalist Ceramic Vase',
      'Scandinavian Grey Sofa',
      'Modern Bamboo Plant Stand',
      'Abstract Geometric Rug',
      'Marble Coffee Table',
      'Nordic Table Lamp',
      'Oak Floating Shelf',
      'Handwoven Throw Blanket',
      'Stoneware Dinner Set',
      'Arch Floor Mirror',
      'Organic Cotton Cushion Cover',
      'Wooden Storage Bench',
      'Framed Botanical Art Set',
      'Pebble Bathroom Organizer',
      'Woven Seagrass Basket',
      'Textured Wall Clock',
      'Matte Black Candle Holder',
      'Linen Dining Runner',
      'Accent Reading Chair',
      'Terracotta Planter Duo'
    ],
    images: CATEGORY_IMAGES['Home Decor'],
    colors: CATEGORY_COLORS['Home Decor'],
    sizes: CATEGORY_SIZES['Home Decor']
  },
  {
    category: 'Footwear',
    prefix: 'SHOE',
    basePrice: 65,
    priceStep: 9,
    names: [
      'Air Max Runner Sport',
      'Leather Oxford Loafers',
      'Everyday Canvas Sneakers',
      'Performance Trail Shoes',
      'Urban Street High Tops',
      'Classic White Trainers',
      'Premium Chelsea Boots',
      'Slip-On Weekend Shoes',
      'Studio Ballet Flats',
      'Running Knit Sneakers',
      'Cushioned Walking Shoes',
      'Suede Desert Boots',
      'Mesh Court Trainers',
      'Minimal Leather Sandals',
      'Retro Jogger Sneakers',
      'Comfort Office Loafers',
      'Waterproof Hiking Boots',
      'Platform Casual Sneakers',
      'Lightweight Gym Shoes',
      'All-Day Commuter Runners'
    ],
    images: CATEGORY_IMAGES.Footwear,
    colors: CATEGORY_COLORS.Footwear,
    sizes: CATEGORY_SIZES.Footwear
  },
  {
    category: 'Accessories',
    prefix: 'ACC',
    basePrice: 25,
    priceStep: 8,
    names: [
      'Aviator Sunglasses',
      'Minimal Leather Wallet',
      'Travel Passport Holder',
      'Smart RFID Card Case',
      'Stainless Steel Watch Strap',
      'Canvas Weekend Cap',
      'Premium Laptop Sleeve',
      'Convertible Phone Lanyard',
      'Classic Link Bracelet',
      'Compact Makeup Organizer',
      'Travel Cable Pouch',
      'Foldable Tote Bag',
      'Pearl Accent Hair Clip Set',
      'Slim Key Holder',
      'Sport Water Bottle Sleeve',
      'Camera Crossbody Strap',
      'Signature Silk Tie',
      'Protective Eyewear Case',
      'Metal Bookmark Set',
      'Desk Essentials Organizer'
    ],
    images: CATEGORY_IMAGES.Accessories,
    colors: CATEGORY_COLORS.Accessories,
    sizes: CATEGORY_SIZES.Accessories
  }
];

const buildDescription = (category: CategoryKey, name: string): string => {
  const copy: Record<CategoryKey, string> = {
    Electronics:
      'Built for modern shoppers who want performance, clean design and reliable everyday use.',
    Fashion:
      'Designed to elevate everyday styling with premium materials, comfortable fits and versatile details.',
    'Home Decor':
      'A refined interior piece that brings warmth, texture and a polished modern look to any space.',
    Footwear:
      'Engineered for comfort, grip and confident movement from daily commutes to weekend plans.',
    Accessories:
      'A practical finishing piece that adds function, style and a more complete lifestyle experience.'
  };

  return `${name} is part of the Lumina ${category} collection. ${copy[category]}`;
};

const buildSpecifications = (
  category: CategoryKey,
  name: string,
  index: number
): ProductSpecification[] => {
  switch (category) {
    case 'Electronics':
      return [
        { label: 'Connectivity', value: index % 2 === 0 ? 'Bluetooth 5.3 / USB-C' : 'Wi-Fi 6 / USB-C' },
        { label: 'Battery', value: `${24 + index * 2} hours` },
        { label: 'Warranty', value: '24 months official warranty' }
      ];
    case 'Fashion':
      return [
        { label: 'Material', value: index % 2 === 0 ? 'Premium cotton blend' : 'Linen blend fabric' },
        { label: 'Fit', value: index % 3 === 0 ? 'Relaxed fit' : 'Tailored fit' },
        { label: 'Care', value: 'Machine wash cold' }
      ];
    case 'Home Decor':
      return [
        { label: 'Material', value: index % 2 === 0 ? 'Ceramic / engineered wood' : 'Natural wood / cotton mix' },
        { label: 'Style', value: 'Modern minimalist' },
        { label: 'Best Use', value: `Ideal for ${name.toLowerCase()}` }
      ];
    case 'Footwear':
      return [
        { label: 'Upper', value: index % 2 === 0 ? 'Breathable mesh upper' : 'Premium leather upper' },
        { label: 'Sole', value: 'Lightweight rubber outsole' },
        { label: 'Comfort', value: 'Cushioned insole with arch support' }
      ];
    case 'Accessories':
      return [
        { label: 'Material', value: index % 2 === 0 ? 'Vegan leather and metal' : 'Canvas and alloy' },
        { label: 'Function', value: 'Portable, everyday essential' },
        { label: 'Packaging', value: 'Gift-ready premium box' }
      ];
    default:
      return [];
  }
};

const buildDetailSections = (
  category: CategoryKey,
  name: string,
  index: number
): string[] => {
  const intro: Record<CategoryKey, string> = {
    Electronics:
      'This model is tuned for shoppers who want clean performance, stable connectivity and a premium day-to-day experience.',
    Fashion:
      'The silhouette is designed to be easy to style for both work and weekend looks while still feeling comfortable throughout the day.',
    'Home Decor':
      'This piece adds warmth and texture to interiors without overwhelming the room, making it easy to mix with modern or neutral palettes.',
    Footwear:
      'The structure focuses on comfort, grip and long-wear support, so it works for both daily use and more active routines.',
    Accessories:
      'This accessory balances practicality and style, helping complete an outfit or workspace with a polished finishing touch.'
  };

  return [
    `${name} is one of Lumina's standout ${category.toLowerCase()} picks for this season.`,
    intro[category],
    `Version ${index + 1} in this line keeps the same design language while adding refined finishing details for better usability.`
  ];
};

const buildCustomerReviews = (
  category: CategoryKey,
  name: string,
  rating: number,
  index: number
): ProductReview[] => {
  const authors = ['Minh Anh', 'Bao Tran', 'Linh Pham'];
  const titles = ['Worth the money', 'Looks even better in person', 'Will buy again'];
  const comments: Record<CategoryKey, string[]> = {
    Electronics: [
      `${name} feels premium and the overall performance is very stable in daily use.`,
      'Setup was quick and the finish looks clean on my desk.',
      'Battery, sound and comfort are all balanced really well for the price.'
    ],
    Fashion: [
      `${name} has a flattering fit and the fabric feels better than expected.`,
      'Easy to mix with basic outfits and still looks polished.',
      'The stitching and finishing details make it feel more premium than many similar items.'
    ],
    'Home Decor': [
      `${name} fits perfectly into a modern apartment and instantly upgrades the space.`,
      'The color and texture match the product photos very closely.',
      'It is decorative, practical and easy to place in different rooms.'
    ],
    Footwear: [
      `${name} is comfortable from the first wear and feels supportive when walking a lot.`,
      'The outsole grip is reliable and the shape looks modern.',
      'I like that it balances comfort with a clean everyday design.'
    ],
    Accessories: [
      `${name} is compact, useful and adds a nice premium touch to daily carry.`,
      'Material quality is solid and the details are well finished.',
      'A practical item that also works well as a gift.'
    ]
  };

  return authors.map((author, reviewIndex) => ({
    id: `${category}-${index + 1}-review-${reviewIndex + 1}`,
    author,
    title: titles[reviewIndex],
    rating: Math.max(4, Math.min(5, Math.round(rating))),
    date: `2026-0${reviewIndex + 4}-1${(index % 8) + 1}`,
    comment: comments[category][reviewIndex]
  }));
};

const resolveStockStatus = (stockQuantity: number, minStock: number): Product['stockStatus'] => {
  if (stockQuantity === 0) {
    return 'Out of Stock';
  }

  if (stockQuantity <= minStock) {
    return 'Low Stock';
  }

  return 'In Stock';
};

const buildCategoryProducts = (seed: CategorySeed, categoryIndex: number): Product[] =>
  seed.names.map((name, index) => {
    const numericId = categoryIndex * 20 + index + 1;
    const image = seed.images[index % seed.images.length];
    const altImageOne = seed.images[(index + 1) % seed.images.length];
    const altImageTwo = seed.images[(index + 2) % seed.images.length];
    const minStock = 4 + (index % 4);
    const stockQuantity =
      index % 11 === 0 ? 0 : index % 6 === 0 ? Math.max(1, minStock - 1) : minStock + 14 + ((index * 3) % 18);
    const price = Number((seed.basePrice + seed.priceStep * index).toFixed(2));
    const rating = Number((4.2 + ((index + categoryIndex) % 6) * 0.1).toFixed(1));
    const reviews = 48 + index * 17 + categoryIndex * 23;

    return {
      id: String(numericId),
      name,
      category: seed.category,
      price,
      originalPrice: index % 4 === 0 ? Number((price * 1.18).toFixed(2)) : undefined,
      rating,
      reviews,
      image,
      thumbnails: [image, altImageOne, altImageTwo],
      stockStatus: resolveStockStatus(stockQuantity, minStock),
      stockQuantity,
      minStock,
      sku: `${seed.prefix}-${String(index + 1).padStart(3, '0')}`,
      description: buildDescription(seed.category, name),
      availableColors: seed.colors,
      availableSizes: seed.sizes,
      specifications: buildSpecifications(seed.category, name, index),
      detailSections: buildDetailSections(seed.category, name, index),
      customerReviews: buildCustomerReviews(seed.category, name, rating, index)
    };
  });

export const PRODUCTS: Product[] = CATEGORY_SEEDS.flatMap(buildCategoryProducts);

export const USERS: User[] = [
  { id: '1', name: 'Duy admin', email: 'duyadmin@gmail.com', role: 'Admin', status: 'Active', lastLogin: '2 mins ago', avatar: 'https://picsum.photos/id/64/100/100' },
  { id: '2', name: 'Duy Staff', email: 'duystaff@gmail.com', role: 'Staff', status: 'Active', lastLogin: '3 hours ago', avatar: 'https://picsum.photos/id/65/100/100' },
  { id: '3', name: 'Duy Khach Hang', email: 'duykhachhang@gmail.com', role: 'Customer', status: 'Inactive', lastLogin: '1 day ago', avatar: 'https://picsum.photos/id/66/100/100' },
  { id: '4', name: 'Cameron Williamson', email: 'cameron.w@example.com', role: 'Customer', status: 'Active', lastLogin: '2 days ago', avatar: 'https://picsum.photos/id/67/100/100' },
  { id: '5', name: 'Jane Cooper', email: 'jane.cooper@example.com', role: 'Admin', status: 'Active', lastLogin: '10 mins ago', avatar: 'https://picsum.photos/id/68/100/100' },
  { id: '6', name: 'Esther Howard', email: 'esther.howard@example.com', role: 'Customer', status: 'Active', lastLogin: '5 hours ago', avatar: 'https://picsum.photos/id/69/100/100' }
];

export const COUPONS: Coupon[] = [
  { id: '1', code: 'SUMMER2024', description: 'End of season sale', type: 'Percentage', value: 20, usageCount: 145, usageLimit: 500, expiryDate: 'Aug 31, 2024', status: 'Active' },
  { id: '2', code: 'WELCOME10', description: 'New user bonus', type: 'Fixed Cart', value: 10, usageCount: 0, usageLimit: 0, expiryDate: 'No Expiry', status: 'Active' },
  { id: '3', code: 'FLASH50', description: '24hr Flash Sale', type: 'Percentage', value: 50, usageCount: 50, usageLimit: 50, expiryDate: 'Yesterday', status: 'Expired' },
  { id: '4', code: 'FREESHIP', description: 'Free shipping > $50', type: 'Free Shipping', value: 0, usageCount: 1203, usageLimit: 0, expiryDate: 'Dec 31, 2024', status: 'Active' },
  { id: '5', code: 'VIP25', description: 'Loyalty Rewards', type: 'Percentage', value: 25, usageCount: 12, usageLimit: 100, expiryDate: 'Oct 15, 2024', status: 'Scheduled' }
];

export const SECURITY_LOGS: SecurityLog[] = [
  { id: '1', type: 'Warning', title: 'Failed Login Attempt', detail: 'IP 192.168.1.42 - 10m ago' },
  { id: '2', type: 'Info', title: 'System Updated', detail: 'Core v2.4.1 - 2h ago' },
  { id: '3', type: 'Success', title: 'Backup Completed', detail: 'Automated - 5h ago' }
];
