import React, { useState, useEffect } from 'react';
import ExtraordinaryHeader from '../components/ExtraordinaryHeader';
import MobileHeader from '../components/MobileHeader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import axios from 'axios';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { API_ENDPOINTS } = require('../utils/api');
      const response = await axios.get(API_ENDPOINTS.PRODUCTS);
      const newArrivals = response.data.map(item => ({
        ...item,
        isNew: true,
        arrivalDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        preOrder: Math.random() > 0.8
      })).sort((a, b) => b.arrivalDate - a.arrivalDate);
      setProducts(newArrivals);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }
    addToCart(product.id);
    alert('Added to cart!');
  };

  const getDaysAgo = (date) => {
    const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days} days ago`;
  };

  const categories = ['all', 'popular', 'product'];
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {isMobile ? <MobileHeader /> : <ExtraordinaryHeader />}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">✨ New Arrivals</h1>
          <p className="text-xl mb-8">Fresh products just landed!</p>
          
          {/* Category Pills */}
          <div className="flex justify-center gap-3 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-green-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {category === 'all' ? 'All New' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="mobile-container py-2 md:py-12">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-green-400 to-teal-400 h-full"></div>
          
          {filteredProducts.map((product, index) => (
            <div key={product.id} className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>
              
              {/* Product Card */}
              <div className={`w-full md:w-5/12 ${!isMobile && index % 2 === 0 ? 'md:pr-8' : !isMobile ? 'md:pl-8' : ''}`}>
                <div className="bg-white rounded shadow hover:shadow-md transition-all overflow-hidden mb-4 md:mb-0">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-24 md:h-48 object-cover" />
                    
                    {/* New Badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-green-400 to-teal-400 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      NEW
                    </div>
                    
                    {product.preOrder && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                        PRE-ORDER
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 md:p-6">
                    <div className="text-sm text-green-600 font-medium mb-2">
                      Added {getDaysAgo(product.arrivalDate)}
                    </div>
                    
                    <h3 className="font-bold text-sm md:text-xl mb-1 md:mb-2">{isMobile ? product.name.substring(0, 20) + '...' : product.name}</h3>
                    <p className="hidden md:block text-gray-600 text-sm mb-4">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm md:text-2xl font-bold text-green-600">${product.price}</span>
                      <div className="text-sm text-gray-500">Stock: {product.stock_quantity}</div>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0}
                      className="w-full bg-green-500 text-white py-1 px-2 md:py-3 md:px-4 rounded font-semibold disabled:bg-gray-300 text-xs md:text-base"
                    >
                      {product.preOrder ? 'Pre-Order Now' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Date Label */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'pl-8 text-left' : 'pr-8 text-right'}`}>
                <div className="text-gray-500 font-medium">
                  {product.arrivalDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;