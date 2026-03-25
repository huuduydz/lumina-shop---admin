import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    customerPhone: { type: String, default: '' },
    customerAddress: { type: String, default: '' },
    customerNote: { type: String, default: '' },
    orderNumber: { type: String, required: true, unique: true, index: true },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'COD' },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    notes: { type: String, default: '' },
    orderDate: { type: Date, default: Date.now, index: true },
    crmSynced: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

const serializeOrder = (document) => {
  if (!document) {
    return null;
  }

  const order = typeof document.toObject === 'function' ? document.toObject() : document;
  return {
    ...order,
    id: order._id?.toString() || order.id
  };
};

const buildOrderNumber = () =>
  `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

export const Order = {
  getAll: async () => {
    const orders = await OrderModel.find().sort({ orderDate: -1 });
    return orders.map(serializeOrder);
  },

  getById: async (id) => {
    const searchFilter =
      mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { orderNumber: id };
    const order = await OrderModel.findOne(searchFilter);
    return serializeOrder(order);
  },

  getByCustomerId: async (customerId) => {
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return [];
    }

    const orders = await OrderModel.find({ customerId }).sort({ orderDate: -1 });
    return orders.map(serializeOrder);
  },

  create: async (data) => {
    const order = await OrderModel.create({
      customerId: data.customerId,
      customerName: data.customer.name,
      customerEmail: data.customer.email,
      customerPhone: data.customer.phone || '',
      customerAddress: data.customer.address || '',
      customerNote: data.customer.note || '',
      orderNumber: buildOrderNumber(),
      subtotal: data.subtotal || data.totalAmount,
      discount: data.discount || 0,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod || 'COD',
      status: data.status || 'Pending',
      items: data.items || [],
      notes: data.notes || '',
      orderDate: data.orderDate || new Date(),
      crmSynced: data.crmSynced ?? true
    });

    return serializeOrder(order);
  },

  updateStatus: async (id, status) => {
    const searchFilter =
      mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { orderNumber: id };
    const updated = await OrderModel.findOneAndUpdate(searchFilter, { status }, { new: true });
    return serializeOrder(updated);
  },

  getRevenueStats: async () => {
    const stats = await OrderModel.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$orderDate'
            }
          },
          orderCount: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    return stats.map(stat => ({
      month: stat._id,
      orderCount: stat.orderCount,
      revenue: stat.revenue
    }));
  },

  getTotalRevenue: async () => {
    const [result] = await OrderModel.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    return result?.total || 0;
  }
};

export default Order;
