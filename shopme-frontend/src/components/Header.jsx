import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full bg-pizza-light shadow-md z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 text-xl font-bold text-pizza-dark">
          <img src="/assets/img/logo-pizza.svg" alt="Pizza Logo" className="w-8 h-8" />
          Pizza
        </a>

        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full md:top-0 left-0 w-full md:w-auto bg-pizza-light md:bg-transparent flex-col md:flex-row items-center gap-6 p-4 md:p-0 shadow-md md:shadow-none`}>
          <ul className="flex flex-col md:flex-row gap-6">
            <li><a href="#home" className="text-pizza-dark hover:text-pizza-orange transition-colors">Home</a></li>
            <li><a href="#about" className="text-pizza-dark hover:text-pizza-orange transition-colors">About Us</a></li>
            <li><a href="#popular" className="text-pizza-dark hover:text-pizza-orange transition-colors">Popular</a></li>
            <li><a href="#products" className="text-pizza-dark hover:text-pizza-orange transition-colors">Products</a></li>
            <li><a href="#contact" className="text-pizza-dark hover:text-pizza-orange transition-colors">Contact</a></li>
          </ul>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/orders"
                className="text-pizza-dark hover:text-pizza-orange transition-colors"
              >
                My Orders
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-pizza-dark hover:text-pizza-orange transition-colors"
              >
                🛒
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <span className="text-pizza-dark">Hi, {user.name}</span>
              <button 
                onClick={logout}
                className="bg-pizza-orange text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link 
                to="/login"
                className="text-pizza-dark hover:text-pizza-orange transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link 
                to="/signup"
                className="bg-pizza-orange text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
          
          <button 
            className="md:hidden absolute top-4 right-4 text-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <button 
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;