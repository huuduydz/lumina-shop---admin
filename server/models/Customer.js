import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    membershipLevel: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Diamond'],
      default: 'Bronze'
    },
    totalSpent: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, index: true },
    referralCount: { type: Number, default: 0 },
    referredBy: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now },
    lastPurchaseDate: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const CustomerModel = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

const serializeCustomer = (document) => {
  if (!document) {
    return null;
  }

  const customer = typeof document.toObject === 'function' ? document.toObject() : document;
  return {
    ...customer,
    id: customer._id?.toString() || customer.id
  };
};

const buildReferralCode = (name) =>
  `REF-${name.split(' ')[0].toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export const Customer = {
  getAll: async () => {
    const customers = await CustomerModel.find().sort({ createdAt: -1 });
    return customers.map(serializeCustomer);
  },

  getById: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const customer = await CustomerModel.findById(id);
    return serializeCustomer(customer);
  },

  getByEmail: async (email) => {
    const customer = await CustomerModel.findOne({ email: email.toLowerCase() });
    return serializeCustomer(customer);
  },

  create: async (data) => {
    const customer = await CustomerModel.create({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      membershipLevel: data.membershipLevel || 'Bronze',
      totalSpent: data.totalSpent || 0,
      points: data.points || 0,
      referralCode: data.referralCode || buildReferralCode(data.name),
      referredBy: data.referredBy || '',
      joinDate: data.joinDate || new Date()
    });

    return serializeCustomer(customer);
  },

  update: async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const updated = await CustomerModel.findByIdAndUpdate(
      id,
      {
        ...(data.name ? { name: data.name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.email ? { email: data.email.toLowerCase() } : {})
      },
      { new: true }
    );

    return Boolean(updated);
  },

  delete: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const deleted = await CustomerModel.findByIdAndDelete(id);
    return Boolean(deleted);
  },

  updateMembership: async (id, membershipLevel, totalSpent, points) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const updated = await CustomerModel.findByIdAndUpdate(
      id,
      {
        membershipLevel,
        totalSpent,
        points,
        lastPurchaseDate: new Date()
      },
      { new: true }
    );

    return Boolean(updated);
  },

  getByMembership: async (level) => {
    const customers = await CustomerModel.find({ membershipLevel: level }).sort({ totalSpent: -1 });
    return customers.map(serializeCustomer);
  },

  getTopCustomers: async (limit = 10) => {
    const customers = await CustomerModel.find().sort({ totalSpent: -1 }).limit(limit);
    return customers.map(serializeCustomer);
  }
};

export default Customer;
