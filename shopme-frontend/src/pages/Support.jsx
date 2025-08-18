import React, { useState } from 'react';
import ExtraordinaryHeader from '../components/ExtraordinaryHeader';
import MobileHeader from '../components/MobileHeader';
import { useIsMobile } from '../hooks/useIsMobile';

const Support = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const isMobile = useIsMobile();

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by going to 'My Orders' section in your account or using the tracking number sent to your email."
    },
    {
      question: "What is your return policy?",
      answer: "We offer 30-day returns for most items. Items must be in original condition with tags attached."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and times vary by location."
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileHeader /> : <ExtraordinaryHeader />}
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 md:py-16">
        <div className="mobile-container text-center">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">💬 Support Center</h1>
          <p className="text-sm md:text-xl">We're here to help you!</p>
        </div>
      </div>

      <div className="mobile-container py-4 md:py-12">
        <div className="bg-white rounded shadow p-2 md:p-6 mb-4 md:mb-8">
          <div className="flex border-b mb-4 md:mb-6">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-2 px-4 text-center font-medium text-sm md:text-base ${
                activeTab === 'faq' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-2 px-4 text-center font-medium text-sm md:text-base ${
                activeTab === 'contact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              Contact Us
            </button>
          </div>

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h2 className="text-lg md:text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded p-3 md:p-4">
                  <h3 className="font-semibold text-sm md:text-base mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <h2 className="text-lg md:text-2xl font-bold mb-4">Contact Us</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    required
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-3 py-2 border rounded text-sm"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 text-sm md:text-base"
                >
                  Send Message
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded shadow p-4 text-center">
            <div className="text-2xl md:text-3xl mb-2">📧</div>
            <h3 className="font-semibold text-sm md:text-base mb-1">Email Support</h3>
            <p className="text-gray-600 text-xs md:text-sm">support@shopme.com</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <div className="text-2xl md:text-3xl mb-2">📞</div>
            <h3 className="font-semibold text-sm md:text-base mb-1">Phone Support</h3>
            <p className="text-gray-600 text-xs md:text-sm">1-800-SHOPME</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <div className="text-2xl md:text-3xl mb-2">💬</div>
            <h3 className="font-semibold text-sm md:text-base mb-1">Live Chat</h3>
            <p className="text-gray-600 text-xs md:text-sm">Available 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;