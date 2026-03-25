import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';

const buildTransactionPayload = (product, quantity, type, source, note) => ({
  productId: product.id,
  productName: product.name,
  productImage: product.image,
  type,
  quantity,
  source,
  note,
  totalValue: Number(quantity) * Number(product.price)
});

export const productController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.getAll();
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  seedProducts: async (req, res) => {
    try {
      const { products = [] } = req.body;
      const seededProducts = await Product.seedMany(products);
      res.status(201).json({ success: true, data: seededProducts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const product = await Product.update(req.params.id, req.body);

      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const deleted = await Product.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const transactions = await InventoryTransaction.getAll();
      res.json({ success: true, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateStock: async (req, res) => {
    try {
      const { quantity, type, source = 'Manual', note = '' } = req.body;
      if (!quantity || !type) {
        return res.status(400).json({ success: false, error: 'quantity and type are required' });
      }

      const updatedProduct = await Product.updateStock(req.params.id, quantity, type);
      if (!updatedProduct) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const transaction = await InventoryTransaction.create(
        buildTransactionPayload(updatedProduct, quantity, type, source, note)
      );

      res.json({ success: true, data: { product: updatedProduct, transaction } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export default productController;
