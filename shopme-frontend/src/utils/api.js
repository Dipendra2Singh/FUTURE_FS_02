import config from '../config';

const API_BASE_URL = config.API_URL;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  
  // Cart
  CART: `${API_BASE_URL}/api/cart`,
  CART_ADD: `${API_BASE_URL}/api/cart/add`,
  CART_UPDATE: (id) => `${API_BASE_URL}/api/cart/update/${id}`,
  CART_REMOVE: (id) => `${API_BASE_URL}/api/cart/remove/${id}`,
  CART_CLEAR: `${API_BASE_URL}/api/cart/clear`,
  
  // Orders
  ORDERS_CREATE: `${API_BASE_URL}/api/orders/create`,
  ORDERS_MY: `${API_BASE_URL}/api/orders/my-orders`,
  
  // Admin
  ADMIN_LOGIN: `${API_BASE_URL}/api/simple-admin/login`,
  ADMIN_ORDERS: `${API_BASE_URL}/api/simple-admin/orders`,
  ADMIN_PRODUCTS: `${API_BASE_URL}/api/simple-admin/products`,
  ADMIN_ORDER_STATUS: (id) => `${API_BASE_URL}/api/simple-admin/orders/${id}/status`,
  ADMIN_PRODUCT_UPDATE: (id) => `${API_BASE_URL}/api/simple-admin/products/${id}`
};

export default API_BASE_URL;