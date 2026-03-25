import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true }
  },
  { _id: false }
);

const specificationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    author: { type: String, required: true },
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: String, required: true },
    comment: { type: String, required: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    image: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Low Stock'],
      default: 'In Stock'
    },
    stockQuantity: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
    sku: { type: String, index: true },
    description: { type: String, default: '' },
    availableColors: { type: [colorSchema], default: [] },
    availableSizes: { type: [String], default: [] },
    specifications: { type: [specificationSchema], default: [] },
    detailSections: { type: [String], default: [] },
    customerReviews: { type: [reviewSchema], default: [] }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

const serializeProduct = (document) => {
  if (!document) {
    return null;
  }

  const product = typeof document.toObject === 'function' ? document.toObject() : document;
  return {
    ...product,
    id: product.productId || product.id || product._id?.toString()
  };
};

const normalizeStockStatus = (stockQuantity, minStock) => {
  if (stockQuantity <= 0) {
    return 'Out of Stock';
  }

  if (stockQuantity <= minStock) {
    return 'Low Stock';
  }

  return 'In Stock';
};

const buildProductId = () => `PRD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export const Product = {
  getAll: async () => {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    return products.map(serializeProduct);
  },

  getById: async (productId) => {
    const product = await ProductModel.findOne({ productId });
    return serializeProduct(product);
  },

  create: async (data) => {
    const stockQuantity = Number(data.stockQuantity ?? 0);
    const minStock = Number(data.minStock ?? 0);

    const product = await ProductModel.create({
      productId: data.id || data.productId || buildProductId(),
      name: data.name,
      category: data.category,
      price: Number(data.price),
      originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : undefined,
      rating: Number(data.rating ?? 0),
      reviews: Number(data.reviews ?? 0),
      image: data.image,
      thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails : [],
      stockStatus: data.stockStatus || normalizeStockStatus(stockQuantity, minStock),
      stockQuantity,
      minStock,
      sku: data.sku,
      description: data.description || '',
      availableColors: Array.isArray(data.availableColors) ? data.availableColors : [],
      availableSizes: Array.isArray(data.availableSizes) ? data.availableSizes : [],
      specifications: Array.isArray(data.specifications) ? data.specifications : [],
      detailSections: Array.isArray(data.detailSections) ? data.detailSections : [],
      customerReviews: Array.isArray(data.customerReviews) ? data.customerReviews : []
    });

    return serializeProduct(product);
  },

  seedMany: async (products) => {
    if (!Array.isArray(products) || !products.length) {
      return [];
    }

    const operations = products.map(product => {
      const stockQuantity = Number(product.stockQuantity ?? 0);
      const minStock = Number(product.minStock ?? 0);
      return {
        updateOne: {
          filter: { productId: product.id || product.productId },
          update: {
            $set: {
              productId: product.id || product.productId || buildProductId(),
              name: product.name,
              category: product.category,
              price: Number(product.price),
              originalPrice:
                product.originalPrice !== undefined ? Number(product.originalPrice) : undefined,
              rating: Number(product.rating ?? 0),
              reviews: Number(product.reviews ?? 0),
              image: product.image,
              thumbnails: Array.isArray(product.thumbnails) ? product.thumbnails : [],
              stockStatus: product.stockStatus || normalizeStockStatus(stockQuantity, minStock),
              stockQuantity,
              minStock,
              sku: product.sku,
              description: product.description || '',
              availableColors: Array.isArray(product.availableColors) ? product.availableColors : [],
              availableSizes: Array.isArray(product.availableSizes) ? product.availableSizes : [],
              specifications: Array.isArray(product.specifications) ? product.specifications : [],
              detailSections: Array.isArray(product.detailSections) ? product.detailSections : [],
              customerReviews: Array.isArray(product.customerReviews) ? product.customerReviews : []
            }
          },
          upsert: true
        }
      };
    });

    await ProductModel.bulkWrite(operations, { ordered: false });
    return Product.getAll();
  },

  update: async (productId, data) => {
    const current = await ProductModel.findOne({ productId });
    if (!current) {
      return null;
    }

    const nextStockQuantity = Number(data.stockQuantity ?? current.stockQuantity);
    const nextMinStock = Number(data.minStock ?? current.minStock);

    const updated = await ProductModel.findOneAndUpdate(
      { productId },
      {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.price !== undefined ? { price: Number(data.price) } : {}),
        ...(data.originalPrice !== undefined ? { originalPrice: Number(data.originalPrice) } : {}),
        ...(data.rating !== undefined ? { rating: Number(data.rating) } : {}),
        ...(data.reviews !== undefined ? { reviews: Number(data.reviews) } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.thumbnails !== undefined ? { thumbnails: data.thumbnails } : {}),
        ...(data.stockQuantity !== undefined ? { stockQuantity: nextStockQuantity } : {}),
        ...(data.minStock !== undefined ? { minStock: nextMinStock } : {}),
        ...(data.stockStatus !== undefined
          ? { stockStatus: data.stockStatus }
          : { stockStatus: normalizeStockStatus(nextStockQuantity, nextMinStock) }),
        ...(data.sku !== undefined ? { sku: data.sku } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.availableColors !== undefined ? { availableColors: data.availableColors } : {}),
        ...(data.availableSizes !== undefined ? { availableSizes: data.availableSizes } : {}),
        ...(data.specifications !== undefined ? { specifications: data.specifications } : {}),
        ...(data.detailSections !== undefined ? { detailSections: data.detailSections } : {}),
        ...(data.customerReviews !== undefined ? { customerReviews: data.customerReviews } : {})
      },
      { new: true }
    );

    return serializeProduct(updated);
  },

  delete: async (productId) => {
    const deleted = await ProductModel.findOneAndDelete({ productId });
    return Boolean(deleted);
  },

  updateStock: async (productId, quantity, type) => {
    const product = await ProductModel.findOne({ productId });
    if (!product) {
      return null;
    }

    const delta = Number(quantity);
    const nextQuantity =
      type === 'IN'
        ? product.stockQuantity + delta
        : Math.max(0, product.stockQuantity - delta);

    product.stockQuantity = nextQuantity;
    product.stockStatus = normalizeStockStatus(nextQuantity, product.minStock);
    await product.save();

    return serializeProduct(product);
  }
};

export default Product;
