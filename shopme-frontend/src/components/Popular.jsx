import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Popular = () => {
  const [popularPizzas, setPopularPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchPopularPizzas();
  }, []);

  const fetchPopularPizzas = async () => {
    try {
      const response = await axios.get('https://shopme-backend.vercel.app/api/pizzas/category/popular');
      setPopularPizzas(response.data);
    } catch (error) {
      console.error('Error fetching popular pizzas:', error);
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
    <section id="popular" className="py-16 bg-pizza-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-pizza-dark leading-tight mb-4">
            Discover <br /> Popular Orders
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select the best prepared and delicious flavors. We have collected some popular recipes from around the world for you to choose your favorite.
          </p>
        </div>

        <div className="relative">
          <img src="/assets/img/popular-dish.png" alt="Dish" className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-32 h-32 z-10" />
          
          {loading ? (
            <div className="text-center py-8">Loading popular pizzas...</div>
          ) : (
            <Swiper
              modules={[Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="pt-16"
            >
              {popularPizzas.sort((a, b) => {
                const aHasImage = a.image && a.image.startsWith('https://');
                const bHasImage = b.image && b.image.startsWith('https://');
                if (aHasImage && !bHasImage) return -1;
                if (!aHasImage && bHasImage) return 1;
                return 0;
              }).map((pizza) => (
                <SwiperSlide key={pizza.id}>
                  <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                    <img src={pizza.image} alt={pizza.name} className="w-32 h-32 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-pizza-dark mb-2">{pizza.name}</h3>
                    <span className="text-lg font-bold text-pizza-orange mb-4 block">${pizza.price}</span>
                    <button 
                      onClick={() => handleAddToCart(pizza)}
                      disabled={pizza.stock_quantity === 0}
                      className="bg-pizza-orange text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {pizza.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Popular;