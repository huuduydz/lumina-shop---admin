import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    productImage: { type: String, default: '' },
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now, index: true },
    source: { type: String, enum: ['Manual', 'Order', 'API Sync'], default: 'Manual' },
    note: { type: String, default: '' },
    totalValue: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const InventoryTransactionModel =
  mongoose.models.InventoryTransaction ||
  mongoose.model('InventoryTransaction', inventoryTransactionSchema);

const serializeTransaction = (document) => {
  if (!document) {
    return null;
  }

  const transaction = typeof document.toObject === 'function' ? document.toObject() : document;
  return {
    ...transaction,
    id: transaction.transactionId || transaction.id || transaction._id?.toString()
  };
};

const buildTransactionId = () =>
  `TX-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export const InventoryTransaction = {
  getAll: async () => {
    const transactions = await InventoryTransactionModel.find().sort({ date: -1 });
    return transactions.map(serializeTransaction);
  },

  create: async (data) => {
    const transaction = await InventoryTransactionModel.create({
      transactionId: data.id || data.transactionId || buildTransactionId(),
      productId: data.productId,
      productName: data.productName,
      productImage: data.productImage || '',
      type: data.type,
      quantity: Number(data.quantity),
      date: data.date || new Date(),
      source: data.source || 'Manual',
      note: data.note || '',
      totalValue: Number(data.totalValue ?? 0)
    });

    return serializeTransaction(transaction);
  }
};

export default InventoryTransaction;
