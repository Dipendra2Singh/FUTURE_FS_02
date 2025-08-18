import React, { useState, useEffect } from 'react';
import ExtraordinaryHeader from '../components/ExtraordinaryHeader';
import MobileHeader from '../components/MobileHeader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import axios from 'axios';

const TodaysDeals = () => {
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchDeals();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDeals = async () => {
    try {
      const { API_ENDPOINTS } = require('../utils/api');
      const response = await axios.get(API_ENDPOINTS.PRODUCTS);
      const dealsData = response.data.slice(0, 8).map(item => ({
        ...item,
        originalPrice: item.price + 5,
        discount: Math.floor(Math.random() * 40) + 20
      }));
      setDeals(dealsData);
    } catch (error) {
      console.error('Error fetching deals:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {isMobile ? <MobileHeader /> : <ExtraordinaryHeader />}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🔥 Today's Hot Deals</h1>
          <p className="text-xl mb-8">Limited time offers - Don't miss out!</p>
          
          {/* Countdown Timer */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 inline-block">
            <div className="text-sm mb-2">Deals end in:</div>
            <div className="flex gap-4 text-3xl font-bold">
              <div className="bg-white text-red-500 px-4 py-2 rounded">
                {String(timeLeft.hours).padStart(2, '0')}
                <div className="text-xs">HOURS</div>
              </div>
              <div className="bg-white text-red-500 px-4 py-2 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}
                <div className="text-xs">MINS</div>
              </div>
              <div className="bg-white text-red-500 px-4 py-2 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}
                <div className="text-xs">SECS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="mobile-container py-2 md:py-12">
        <div className="mobile-grid">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded shadow hover:shadow-md transition-all overflow-hidden">
              <div className="relative">
                <img 
                  src={deal.image} 
                  alt={deal.name} 
                  className="w-full h-16 md:h-48 object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x300/EF4444/FFFFFF?text=${encodeURIComponent(deal.name)}`;
                  }}
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{deal.discount}%
                </div>
                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                  DEAL
                </div>
              </div>
              
              <div className="p-1 md:p-4">
                <h3 className="font-bold text-xs md:text-lg mb-1 md:mb-2">{isMobile ? deal.name.substring(0, 15) + '...' : deal.name}</h3>
                <p className="hidden md:block text-gray-600 text-sm mb-3">{deal.description}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm md:text-2xl font-bold text-red-500">${deal.price}</span>
                  <span className="text-gray-400 line-through">${deal.originalPrice}</span>
                </div>
                
                <div className="hidden md:flex items-center mb-3">
                  <div className="flex text-yellow-400">★★★★☆</div>
                  <span className="text-gray-500 text-sm ml-2">(89)</span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(deal)}
                  disabled={deal.stock_quantity === 0}
                  className="w-full bg-red-500 text-white py-1 px-1 md:py-2 md:px-4 rounded font-semibold disabled:bg-gray-300 text-xs md:text-base"
                >
                  {deal.stock_quantity === 0 ? 'Sold Out' : 'Grab Deal Now!'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysDeals;