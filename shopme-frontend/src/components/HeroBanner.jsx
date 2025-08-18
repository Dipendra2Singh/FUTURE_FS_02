import React from 'react';

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Great deals on products
        </h1>
        <p className="text-xl mb-8">
          Fast delivery • Quality products • Best prices
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Shop Now
          </button>
          <button className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500">
            View Deals
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;