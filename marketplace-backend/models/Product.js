const Airtable = require('airtable');
require('dotenv').config();

const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(process.env.AIRTABLE_BASE_ID);

const productsTable = base('Table 1');
const ordersTable = base('Table 2');

const fieldMap = {
  products: {
    name: 'Name',
    description: 'Pasted field 1',
    price: 'Pasted field 2',
    imageUrl: 'Pasted field 3',
    sellerId: 'Pasted field 4'
  },
  orders: {
    productId: 'Name',
    buyerName: 'Notes',
    buyerEmail: 'Assignee',
    quantity: 'Status',
    status: 'Pasted field 1'
  }
};

const Product = {
  getAll: async () => {
    const records = await productsTable.select().all();
    return records.map(record => ({
      id: record.id,
      name: record.get(fieldMap.products.name) || '',
      description: record.get(fieldMap.products.description) || '',
      price: parseFloat(record.get(fieldMap.products.price)) || 0,
      imageUrl: record.get(fieldMap.products.imageUrl) || '',
      sellerId: record.get(fieldMap.products.sellerId) || ''
    }));
  },

  getById: async (id) => {
    const record = await productsTable.find(id);
    return {
      id: record.id,
      name: record.get(fieldMap.products.name),
      description: record.get(fieldMap.products.description),
      price: parseFloat(record.get(fieldMap.products.price)),
      imageUrl: record.get(fieldMap.products.imageUrl),
      sellerId: record.get(fieldMap.products.sellerId)
    };
  },

  create: async (product) => {
    const record = await productsTable.create({
      [fieldMap.products.name]: product.name,
      [fieldMap.products.description]: product.description,
      [fieldMap.products.price]: product.price.toString(),
      [fieldMap.products.imageUrl]: product.imageUrl,
      [fieldMap.products.sellerId]: product.sellerId
    });
    return record.id;
  },

  update: async (id, updates) => {
    const record = await productsTable.update(id, {
      [fieldMap.products.name]: updates.name,
      [fieldMap.products.description]: updates.description,
      [fieldMap.products.price]: updates.price.toString(),
      [fieldMap.products.imageUrl]: updates.imageUrl,
      [fieldMap.products.sellerId]: updates.sellerId
    });
    return record.id;
  },

  delete: async (id) => {
    await productsTable.destroy(id);
  }
};

const Order = {
  create: async (order) => {
    const record = await ordersTable.create({
      [fieldMap.orders.productId]: [order.productId],
      [fieldMap.orders.buyerName]: order.buyerName,
      [fieldMap.orders.buyerEmail]: order.buyerEmail,
      [fieldMap.orders.quantity]: order.quantity.toString(),
      [fieldMap.orders.status]: order.status
    });
    return record.id;
  },

  getByUser: async (email) => {
    const records = await ordersTable.select({
      filterByFormula: `{${fieldMap.orders.buyerEmail}} = '${email}'`
    }).all();
    
    return records.map(record => ({
      id: record.id,
      productId: record.get(fieldMap.orders.productId)?.[0] || '',
      buyerName: record.get(fieldMap.orders.buyerName) || '',
      buyerEmail: record.get(fieldMap.orders.buyerEmail) || '',
      quantity: parseInt(record.get(fieldMap.orders.quantity)) || 0,
      status: record.get(fieldMap.orders.status) || ''
    }));
  }
};

module.exports = { Product, Order };