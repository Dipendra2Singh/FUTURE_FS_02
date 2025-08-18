import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`https://shopme-backend.vercel.app/api/pizzas/search/${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching pizzas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (pizza) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    addToCart(pizza.id);
    alert('Added to cart!');
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Search Pizzas</h2>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for pizzas..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {loading && <div className="text-center">Searching...</div>}

        {results.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((pizza) => (
              <div key={pizza.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <img src={pizza.image} alt={pizza.name} className="w-full h-32 object-cover rounded mb-3" />
                <h3 className="font-semibold mb-2">{pizza.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{pizza.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-orange-500">${pizza.price}</span>
                  <button
                    onClick={() => handleAddToCart(pizza)}
                    disabled={pizza.stock_quantity === 0}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition-colors disabled:bg-gray-400"
                  >
                    {pizza.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <div className="text-center text-gray-600">No pizzas found for "{query}"</div>
        )}
      </div>
    </section>
  );
};

export default Search;