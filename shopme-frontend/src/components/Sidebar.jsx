import React, { useState } from 'react';

const Sidebar = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    { id: 'popular', name: 'Popular Products', count: 5 },
    { id: 'product', name: 'Regular Products', count: 15 },
  ];

  const priceRanges = [
    { label: 'Under $15', min: 0, max: 15 },
    { label: '$15 to $20', min: 15, max: 20 },
    { label: '$20 to $25', min: 20, max: 25 },
    { label: '$25 & Above', min: 25, max: 100 },
  ];

  const handleCategoryChange = (categoryId) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updated);
  };

  const handlePriceRangeChange = (min, max) => {
    const newPriceRange = [min, max];
    setPriceRange(newPriceRange);
  };

  const applyFilters = () => {
    onFilterChange({ categories: selectedCategories, priceRange });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50]);
    onFilterChange({ categories: [], priceRange: [0, 50] });
  };

  return (
    <div className="w-64 bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg mb-4">Filters</h3>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Category</h4>
        {categories.map(category => (
          <label key={category.id} className="flex items-center mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              className="mr-2"
            />
            <span className="text-sm">
              {category.name} ({category.count})
            </span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price</h4>
        {priceRanges.map((range, index) => (
          <label key={index} className="flex items-center mb-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="mr-2"
              checked={priceRange[0] === range.min && priceRange[1] === range.max}
              onChange={() => handlePriceRangeChange(range.min, range.max)}
            />
            <span className="text-sm">{range.label}</span>
          </label>
        ))}
      </div>

      {/* Customer Reviews */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Customer Reviews</h4>
        {[4, 3, 2, 1].map(stars => (
          <label key={stars} className="flex items-center mb-2 cursor-pointer">
            <input type="checkbox" className="mr-2" />
            <div className="flex items-center">
              <div className="flex text-yellow-400 text-sm">
                {'★'.repeat(stars)}{'☆'.repeat(5-stars)}
              </div>
              <span className="text-sm ml-2">& Up</span>
            </div>
          </label>
        ))}
      </div>

      {/* Delivery Options */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Delivery Options</h4>
        <label className="flex items-center mb-2 cursor-pointer">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm">FREE Delivery</span>
        </label>
        <label className="flex items-center mb-2 cursor-pointer">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm">Same-Day Delivery</span>
        </label>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-2">
        <button 
          onClick={applyFilters}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
        <button 
          onClick={clearFilters}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Sidebar;