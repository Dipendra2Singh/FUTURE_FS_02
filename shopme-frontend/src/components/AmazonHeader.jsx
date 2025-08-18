import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const AmazonHeader = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <>
      <header className="bg-gray-900 text-white">
        {/* Top bar */}
        <div className="bg-gray-800 text-sm py-2">
          <div className="container mx-auto px-4 flex justify-between">
            <span>Free delivery on orders over $25</span>
            <div className="flex gap-4">
              {!user ? (
                <>
                  <Link to="/login" className="hover:text-orange-400">Sign In</Link>
                  <Link to="/signup" className="hover:text-orange-400">Create Account</Link>
                </>
              ) : (
                <button onClick={logout} className="hover:text-orange-400">Sign Out</button>
              )}
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="py-4">
          <div className="container mx-auto px-4 flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-orange-400">
              ShopMe
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl">
              <div className="flex">
                <select className="bg-gray-200 text-black px-3 py-2 rounded-l border-r">
                  <option>All Categories</option>
                  <option>Popular</option>
                  <option>New Arrivals</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 px-4 py-2 text-black"
                />
                <button className="bg-orange-400 px-6 py-2 rounded-r hover:bg-orange-500">
                  🔍
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
              {user && (
                <>
                  <div className="text-sm">
                    <div>Hello, {user.name}</div>
                    <Link to="/orders" className="font-bold hover:text-orange-400">Orders & Returns</Link>
                  </div>
                  
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex items-center gap-2 hover:text-orange-400"
                  >
                    <div className="relative">
                      🛒
                      {getCartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {getCartCount()}
                        </span>
                      )}
                    </div>
                    <span className="font-bold">Cart</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-700 py-2">
          <div className="container mx-auto px-4">
            <nav className="flex gap-6 text-sm">
              <Link to="/deals" className="hover:text-orange-400">Today's Deals</Link>
              <Link to="/popular" className="hover:text-orange-400">Popular Products</Link>
              <Link to="/new-arrivals" className="hover:text-orange-400">New Arrivals</Link>
              <Link to="/best-sellers" className="hover:text-orange-400">Best Sellers</Link>
              <Link to="/support" className="hover:text-orange-400">Customer Service</Link>
            </nav>
          </div>
        </div>
      </header>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default AmazonHeader;