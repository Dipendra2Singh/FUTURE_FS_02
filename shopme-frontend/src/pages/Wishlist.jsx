import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ExtraordinaryHeader from '../components/ExtraordinaryHeader';

const Wishlist = () => {
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <ExtraordinaryHeader />
      <div className="container mx-auto px-4 py-8 text-center">Loading wishlist...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <ExtraordinaryHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        
        {!user ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Please login to view your wishlist</p>
          </div>
        ) : !items || !Array.isArray(items) || items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4">
                <div className="relative mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-red-600">${product.price}</span>
                  <div className="text-sm text-gray-500">Stock: {product.stock_quantity}</div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded disabled:bg-gray-300"
                >
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;