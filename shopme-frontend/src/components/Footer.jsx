import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer className="bg-pizza-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <a href="#" className="text-2xl font-bold mb-6 block">Pizza</a>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Social</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 text-2xl hover:text-blue-400">
                📘
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-pink-500 text-2xl hover:text-pink-400">
                📷
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-2xl hover:text-blue-300">
                🐦
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
            <div className="flex gap-2">
              <img src="/assets/img/footer-card-1.png" alt="Card" className="w-8 h-6" />
              <img src="/assets/img/footer-card-2.png" alt="Card" className="w-8 h-6" />
              <img src="/assets/img/footer-card-3.png" alt="Card" className="w-8 h-6" />
              <img src="/assets/img/footer-card-4.png" alt="Card" className="w-8 h-6" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Subscribe For Discounts</h3>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded text-pizza-dark"
                required
              />
              <button type="submit" className="bg-pizza-orange px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white">Terms & Agreements</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            </div>
            <span className="text-gray-400">© All Rights Reserved By Bedimcode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;