import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8001'}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    addToCart(product.id);
    alert('Added to cart!');
  };

  return (
    <section id="products" className="py-16 bg-pizza-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-pizza-dark leading-tight text-center mb-12">
          The Most <br /> Devoured Pizzas
        </h2>

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.sort((a, b) => {
              const aHasImage = a.image && a.image.startsWith('https://');
              const bHasImage = b.image && b.image.startsWith('https://');
              if (aHasImage && !bHasImage) return -1;
              if (!aHasImage && bHasImage) return 1;
              return 0;
            }).map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <img src={product.image} alt={product.name} className="w-32 h-32 mx-auto mb-4" />
              
              <h3 className="text-lg font-semibold text-pizza-dark mb-2">
                {product.name.split(' ').map((word, index) => (
                  <span key={index}>
                    {word}
                    {index === 0 && <br />}
                    {index > 0 && ' '}
                  </span>
                ))}
              </h3>
              
              <span className="text-2xl font-bold text-pizza-orange mb-2 block">${product.price}</span>
              
              {product.description && (
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className="bg-pizza-orange text-white p-3 rounded-full hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.stock_quantity === 0 ? '❌' : '🛒'}
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;