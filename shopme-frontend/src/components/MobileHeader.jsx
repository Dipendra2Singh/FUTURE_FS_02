import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const MobileHeader = ({ onSearch }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <>
      <div className="bg-purple-600 text-white text-center py-1 text-xs">
        ✨ FREE SHIPPING over $50 ✨
      </div>
      
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between mb-2">
            <Link to="/" className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-sm font-bold text-purple-600">ShopMe</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              {user && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1"
                >
                  <span className="text-lg">🛒</span>
                  {getCartCount() > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {getCartCount()}
                    </div>
                  )}
                </button>
              )}
              
              {user ? (
                <button onClick={logout} className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                  Out
                </button>
              ) : (
                <Link to="/login" className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              placeholder="Search products..."
              className="flex-1 px-2 py-1 border rounded-l text-xs"
            />
            <button className="bg-purple-600 text-white px-2 py-1 rounded-r text-xs">
              🔍
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-1 text-xs">
            <Link to="/deals" className="text-center text-gray-600 py-1">🔥<br/>Deals</Link>
            <Link to="/popular" className="text-center text-gray-600 py-1">⭐<br/>Popular</Link>
            <Link to="/new-arrivals" className="text-center text-gray-600 py-1">✨<br/>New</Link>
            <Link to="/best-sellers" className="text-center text-gray-600 py-1">🏆<br/>Best</Link>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-xs mt-1">
            {user && <Link to="/orders" className="text-center text-gray-600 py-1">📦<br/>Orders</Link>}
            <Link to="/support" className="text-center text-gray-600 py-1">💬<br/>Help</Link>
            <Link to="/" className="text-center text-gray-600 py-1">🏠<br/>Home</Link>
          </div>
        </div>
      </header>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default MobileHeader;