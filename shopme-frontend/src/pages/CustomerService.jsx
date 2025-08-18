import React, { useState } from 'react';
import ExtraordinaryHeader from '../components/ExtraordinaryHeader';

const CustomerService = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', message: 'Hello! How can I help you today?' }
  ]);

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by going to "My Orders" in your account or using the tracking number sent to your email.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all products. Items must be in original condition.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-3 business days. Express delivery is available for next-day delivery.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship within the United States. International shipping coming soon!'
    }
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
    
    // Simulate bot response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        message: 'Thank you for your message. Our team will get back to you shortly!' 
      }]);
    }, 1000);
    
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <ExtraordinaryHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🎧 Customer Service</h1>
          <p className="text-xl">We're here to help you 24/7</p>
        </div>
      </div>

      {/* Service Options */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Speak with our support team</p>
            <div className="text-2xl font-bold text-indigo-600">1-800-SHOPME</div>
            <div className="text-sm text-gray-500 mt-2">Available 24/7</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with us instantly</p>
            <button 
              onClick={() => setActiveTab('chat')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Chat
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us your questions</p>
            <div className="text-lg font-semibold text-indigo-600">support@shopme.com</div>
            <div className="text-sm text-gray-500 mt-2">Response within 24hrs</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            {[
              { key: 'faq', label: '❓ FAQ', icon: '❓' },
              { key: 'chat', label: '💬 Live Chat', icon: '💬' },
              { key: 'contact', label: '📝 Contact Form', icon: '📝' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'chat' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Live Chat Support</h2>
                <div className="border rounded-lg h-96 flex flex-col">
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-lg max-w-xs ${
                          msg.type === 'user' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white border'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Form</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Select Issue Type</option>
                    <option>Order Issue</option>
                    <option>Payment Problem</option>
                    <option>Product Question</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    rows="6"
                    placeholder="Describe your issue..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;