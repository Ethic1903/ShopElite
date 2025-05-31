import axios from 'axios';

// Оригинальная версия api с запросами к fakestoreapi.com
export const api = {
  async getProducts() {
    const res = await axios.get('https://fakestoreapi.com/products');
    // Convert prices from USD to RUB for all products
    return res.data.map((product: any) => ({
      ...product,
      name: product.title,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviews: Math.floor(Math.random() * 500 + 10),
      inStock: Math.random() > 0.1,
      price: Math.round(product.price * 89) // Convert USD to RUB with realistic rate
    }));
  },

  async getCategories() {
    const res = await axios.get('https://fakestoreapi.com/products/categories');
    return res.data;
  },

  async getProductById(id: number) {
    try {
      const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
      const product = res.data;
      return {
        ...product,
        name: product.title,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        reviews: Math.floor(Math.random() * 500 + 10),
        inStock: Math.random() > 0.1,
        price: Math.round(product.price * 89) // Convert USD to RUB with realistic rate
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async createOrder(orderData: any) {
    // Имитация создания заказа
    const order = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Сохраняем заказ в localStorage для пользователя
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '{}');
      if (!allOrders[userEmail]) {
        allOrders[userEmail] = [];
      }
      allOrders[userEmail].push(order);
      localStorage.setItem('orders', JSON.stringify(allOrders));
    }

    return order;
  }
};