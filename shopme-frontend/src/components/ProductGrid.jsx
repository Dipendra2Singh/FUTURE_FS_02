import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import config from '../config';
import axios from 'axios';

const ProductGrid = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/api/products`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }
    try {
      await addToCart(product.id);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const displayProducts = products.filter(product => {
    const searchMatch = !filters?.searchQuery || 
      product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    return searchMatch;
  }).sort((a, b) => {
    const aHasImage = a.image && a.image.startsWith('https://');
    const bHasImage = b.image && b.image.startsWith('https://');
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    return 0;
  });

  if (loading) return <div className="text-center py-4 text-sm">Loading products...</div>;

  return (
    <div className="px-1 py-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-4">
        {displayProducts.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
            {filters?.searchQuery ? 'No products found' : 'No products available'}
          </div>
        ) : (
          displayProducts.map((product) => (
            <div key={product.id} className="bg-white rounded shadow p-1 md:p-4">
              <div className="relative mb-1">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-16 md:h-32 lg:h-48 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                {product.category === 'popular' && (
                  <span className="absolute top-0 left-0 bg-orange-500 text-white px-1 text-xs rounded">
                    Popular
                  </span>
                )}
              </div>
              
              <h3 className="font-medium text-xs md:text-sm lg:text-base mb-1 leading-tight">
                {product.name.length > 12 ? product.name.substring(0, 12) + '...' : product.name}
              </h3>
              
              <div className="mb-1">
                <span className="text-sm md:text-base lg:text-lg font-bold text-red-600">${product.price}</span>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock_quantity === 0}
                className="w-full bg-yellow-400 text-black font-medium py-1 md:py-2 rounded text-xs md:text-sm disabled:bg-gray-300"
              >
                {product.stock_quantity === 0 ? 'Out' : 'Add'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;