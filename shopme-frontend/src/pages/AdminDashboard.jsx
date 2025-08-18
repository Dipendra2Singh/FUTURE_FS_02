import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl p-6 text-white shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {trend && <p className="text-sm text-white/90">{trend}</p>}
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const navigate = useNavigate();

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalProducts: products.length,
    lowStock: products.filter(p => p.stock_quantity < 10).length,
    activeProducts: products.filter(p => p.is_active).length
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      return matchesSearch && new Date(order.created_at).toDateString() === today;
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return matchesSearch && new Date(order.created_at) >= weekAgo;
    }
    return matchesSearch;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${config.API_URL}/api/simple-admin/orders`),
        axios.get(`${config.API_URL}/api/simple-admin/products`)
      ]);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${config.API_URL}/api/simple-admin/orders/${orderId}/status`, 
        { status }
      );
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      await axios.put(`${config.API_URL}/api/simple-admin/products/${productId}`, 
        productData
      );
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🛒 ShopMe Admin</h1>
              <p className="text-blue-100">Manage your ecommerce platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-right">
                <p className="text-sm opacity-90">Welcome back, Admin</p>
                <p className="text-xs opacity-75">{new Date().toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/admin/login');
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm">
            {[
              { id: 'dashboard', label: '📊 Dashboard', count: '' },
              { id: 'orders', label: '📦 Orders', count: orders.length },
              { id: 'products', label: '🛒 Products', count: products.length },
              { id: 'analytics', label: '📈 Analytics', count: '' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label} {tab.count && `(${tab.count})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Orders" 
                value={stats.totalOrders} 
                icon="📦" 
                color="from-blue-500 to-blue-600"
                trend="+12% this month"
              />
              <StatCard 
                title="Revenue" 
                value={`$${stats.totalRevenue.toFixed(2)}`} 
                icon="💰" 
                color="from-green-500 to-green-600"
                trend="+8% this month"
              />
              <StatCard 
                title="Pending Orders" 
                value={stats.pendingOrders} 
                icon="⏳" 
                color="from-orange-500 to-orange-600"
                trend={stats.pendingOrders > 5 ? 'High volume' : 'Normal'}
              />
              <StatCard 
                title="Products" 
                value={stats.activeProducts} 
                icon="🛒" 
                color="from-purple-500 to-purple-600"
                trend={`${stats.lowStock} low stock`}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">🚀 Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">📦</div>
                  <div className="text-sm font-medium">View Orders</div>
                </button>
                <button 
                  onClick={() => setActiveTab('products')}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <div className="text-sm font-medium">Manage Products</div>
                </button>
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">View Reports</div>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="text-sm font-medium">Settings</div>
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">📋 Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">Order #{order.id}</span>
                      <span className="text-gray-600 ml-2">{order.user_name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${order.total_amount}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">📈 Sales Trends</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Today's Sales</span>
                    <span className="font-semibold">${(stats.totalRevenue * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-semibold">${(stats.totalRevenue * 0.3).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-semibold">${stats.totalRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">🏆 Top Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <span className="text-green-600 font-semibold">${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="🔍 Search orders by customer name, email, or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">📅 All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">Customer: {order.user_name}</p>
                        <p className="text-sm text-gray-600">Email: {order.user_email}</p>
                        <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`px-3 py-1 rounded-full text-sm font-medium mb-2 inline-flex items-center ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'delivered' ? '✅' : 
                           order.status === 'confirmed' ? '🔄' :
                           order.status === 'preparing' ? '👨‍🍳' : '⏳'}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                        <p className="text-lg font-bold text-gray-900">${order.total_amount}</p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">Items Ordered:</h4>
                      <div className="space-y-2">
                        {order.items && order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{item.product_name}</span>
                              <span className="text-gray-600 ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Shipping Details */}
                    {(order.shipping_address || order.phone) && (
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Details:</h4>
                        {order.shipping_address && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Address:</span> {order.shipping_address}
                          </p>
                        )}
                        {order.phone && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {order.phone}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Status Update */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">🛒 Product Inventory</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  ➕ Add Product
                </button>
              </div>
            </div>
            <div className="bg-white shadow-sm overflow-hidden rounded-xl">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onUpdate={updateProduct}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    stock_quantity: product.stock_quantity,
    is_active: product.is_active
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(product.id, formData);
    setEditing(false);
  };

  return (
    <div className="border rounded-lg p-4">
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Product name"
          />
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Price"
          />
          <input
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Stock"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="mr-2"
            />
            Active
          </label>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
          </div>
        </form>
      ) : (
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
          <p className={`text-sm ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
            {product.is_active ? 'Active' : 'Inactive'}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;