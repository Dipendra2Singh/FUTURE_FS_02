import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ExtraordinaryHeader from '../components/ExtraordinaryHeader';
import MobileHeader from '../components/MobileHeader';
import { useIsMobile } from '../hooks/useIsMobile';
import config from '../config';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-orange-600 bg-orange-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      {isMobile ? <MobileHeader /> : <ExtraordinaryHeader />}
      <div className="px-1 md:px-4 py-2 md:py-8 text-center">Loading orders...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {isMobile ? <MobileHeader /> : <ExtraordinaryHeader />}
      <div className="px-1 md:px-4 py-2 md:py-8">
      <h1 className="text-lg md:text-3xl font-bold mb-2 md:mb-6">My Orders</h1>
      
      {!token ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Please login to view your orders</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-2 md:p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm md:text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-sm md:text-lg font-bold mt-2">${order.total_amount}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-sm md:text-base">Items:</h4>
                <div className="grid gap-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 md:gap-4">
                      <img 
                        src={item.image} 
                        alt={item.product_name}
                        className="w-8 h-8 md:w-12 md:h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-xs md:text-sm">{item.product_name}</p>
                        <p className="text-gray-600 text-xs">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-xs md:text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {order.shipping_address && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2 text-sm">Shipping Address:</h4>
                  <p className="text-gray-600 text-xs md:text-sm">{order.shipping_address}</p>
                  {order.phone && <p className="text-gray-600 text-xs md:text-sm">Phone: {order.phone}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Orders;