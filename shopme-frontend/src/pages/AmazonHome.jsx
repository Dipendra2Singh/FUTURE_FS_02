import React, { useState } from 'react';
import ExtraordinaryHeader from '../components/ExtraordinaryHeader';
import MobileHeader from '../components/MobileHeader';
import HeroBanner from '../components/HeroBanner';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import { useIsMobile } from '../hooks/useIsMobile';

const AmazonHome = () => {
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 50],
    searchQuery: ''
  });
  const isMobile = useIsMobile();

  const handleSearch = (searchQuery) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isMobile ? (
        <MobileHeader onSearch={handleSearch} />
      ) : (
        <>
          <ExtraordinaryHeader onSearch={handleSearch} />
          <HeroBanner />
        </>
      )}
      
      <div className="mobile-container py-6">
        <ProductGrid filters={filters} />
      </div>
      
      <footer className="bg-gray-900 text-white py-4 md:py-12 mt-4 md:mt-12">
        <div className="mobile-container">
          {isMobile ? (
            <div className="text-center">
              <div className="text-lg font-bold text-orange-400 mb-2">ShopMe</div>
              <p className="text-xs text-gray-400">
                © 2024 ShopMe.com, Inc.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-bold mb-4">Get to Know Us</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-orange-400">About ShopMe</a></li>
                    <li><a href="#" className="hover:text-orange-400">Careers</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Make Money with Us</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-orange-400">Sell on ShopMe</a></li>
                    <li><a href="#" className="hover:text-orange-400">Become an Affiliate</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Payment Products</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-orange-400">ShopMe Rewards</a></li>
                    <li><a href="#" className="hover:text-orange-400">ShopMe Credit Card</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Let Us Help You</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-orange-400">Your Account</a></li>
                    <li><a href="#" className="hover:text-orange-400">Your Orders</a></li>
                    <li><a href="#" className="hover:text-orange-400">Help</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <div className="text-2xl font-bold text-orange-400 mb-4">ShopMe</div>
                <p className="text-sm text-gray-400">
                  © 2024 ShopMe.com, Inc. or its affiliates
                </p>
              </div>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

export default AmazonHome;