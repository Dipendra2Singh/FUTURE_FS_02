import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import AmazonHome from './pages/AmazonHome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import TodaysDeals from './pages/TodaysDeals';
import PopularProducts from './pages/PopularProducts';
import NewArrivals from './pages/NewArrivals';
import BestSellers from './pages/BestSellers';
import CustomerService from './pages/CustomerService';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<AmazonHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/deals" element={<TodaysDeals />} />
              <Route path="/popular" element={<PopularProducts />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/best-sellers" element={<BestSellers />} />
              <Route path="/support" element={<CustomerService />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;