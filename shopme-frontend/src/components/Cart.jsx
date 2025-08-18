import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import config from '../config';

const Cart = ({ isOpen, onClose }) => {
  const { items, loading, updateCartItem, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem(cartId, newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-96 h-full overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        
        {!user ? (
          <div className="p-4 text-center">
            <p>Please login to view your cart</p>
          </div>
        ) : loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-center">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="p-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center mb-4 border-b pb-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="ml-3 flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total: ${getCartTotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
        
        {showCheckout && (
          <CheckoutForm 
            onClose={() => setShowCheckout(false)} 
            onSuccess={() => {
              setShowCheckout(false);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
};

const CheckoutForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Placing order with data:', formData);
      const response = await fetch(`${config.API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      console.log('Order response:', result);
      
      if (response.ok) {
        alert('Order placed successfully!');
        clearCart();
        onSuccess();
      } else {
        console.error('Order failed:', result);
        alert(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Error placing order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Checkout</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Shipping Address</label>
            <textarea
              value={formData.shipping_address}
              onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;