import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import config from '../config';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false
  });
  
  const { user, token } = useAuth();

  const fetchCart = async () => {
    if (!token) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`${config.API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      console.error('No token available for cart operation');
      return Promise.reject(new Error('Please login to add items to cart'));
    }
    
    try {
      const response = await axios.post(`${config.API_URL}/api/cart/add`, 
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (cartId, quantity) => {
    if (!token) return;
    
    if (quantity <= 0) {
      return removeFromCart(cartId);
    }
    
    try {
      await axios.put(`${config.API_URL}/api/cart/update/${cartId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (cartId) => {
    if (!token) return;
    
    try {
      await axios.delete(`${config.API_URL}/api/cart/remove/${cartId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    
    try {
      await axios.delete(`${config.API_URL}/api/cart/clear`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Clear local state even if API fails
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + parseFloat(item.subtotal), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user, token]);

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};