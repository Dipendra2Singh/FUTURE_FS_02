import React, { useState, useEffect } from 'react';
import ExtraordinaryHeader from '../components/ExtraordinaryHeader';
import MobileHeader from '../components/MobileHeader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import axios from 'axios';

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
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
      const popularData = response.data.map(item => ({
        ...item,
        popularity: Math.floor(Math.random() * 1000) + 500,
        trending: Math.random() > 0.7
      })).sort((a, b) => b.popularity - a.popularity);
      setProducts(popularData);
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

  const filteredProducts = products.filter(product => {
    if (filter === 'trending') return product.trending;
    if (filter === 'top-rated') return product.popularity > 800;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {isMobile ? <MobileHeader /> : <ExtraordinaryHeader />}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">🌟 Popular Products</h1>
            <p className="text-xl mb-8">Most loved by our customers</p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex justify-center gap-4">
            {[
              { key: 'all', label: 'All Popular' },
              { key: 'trending', label: '🔥 Trending' },
              { key: 'top-rated', label: '⭐ Top Rated' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  filter === tab.key 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-1 md:px-4 py-2 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-8">
          {filteredProducts.sort((a, b) => {
            const aHasImage = a.image && a.image.startsWith('https://');
            const bHasImage = b.image && b.image.startsWith('https://');
            if (aHasImage && !bHasImage) return -1;
            if (!aHasImage && bHasImage) return 1;
            return 0;
          }).map((product, index) => (
            <div key={product.id} className="bg-white rounded shadow hover:shadow-md transition-all overflow-hidden group">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-16 md:h-56 object-cover" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {index < 3 && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                      #{index + 1} POPULAR
                    </div>
                  )}
                  {product.trending && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🔥 TRENDING
                    </div>
                  )}
                </div>
                
                {/* Popularity Score */}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {product.popularity} sold
                </div>
              </div>
              
              <div className="p-1 md:p-6">
                <h3 className="font-bold text-xs md:text-xl mb-1 md:mb-2">{isMobile ? product.name.substring(0, 15) + '...' : product.name}</h3>
                <p className="hidden md:block text-gray-600 text-sm mb-4">{product.description}</p>
                
                <div className="hidden md:flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">★★★★★</div>
                  <span className="text-gray-500 text-sm ml-2">({product.popularity})</span>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-4">
                  <span className="text-sm md:text-3xl font-bold text-blue-600">${product.price}</span>
                  <div className="hidden md:block text-sm text-gray-500">Stock: {product.stock_quantity}</div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className="w-full bg-blue-500 text-white py-1 px-2 md:py-3 md:px-4 rounded font-semibold disabled:bg-gray-300 text-xs md:text-base"
                >
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProducts;