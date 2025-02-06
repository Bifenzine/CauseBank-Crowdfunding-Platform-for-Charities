import React from 'react';
import { FaCreditCard, FaPaypal, FaLock, FaHeart } from 'react-icons/fa';

const PaymentCard = ({ cause, formData, setFormData, loading, error, handleSubmit, predefinedAmounts }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Left Panel - Donation Info */}
      <div className="bg-gradient-to-r from-[#3767a6] to-[#2773d6] p-8 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <FaHeart className="text-pink-400" />
            <span className="text-sm font-medium text-pink-200">Donation Form</span>
          </div>
          
          {/* Cause details */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4">{cause.title}</h2>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={cause.organization.logoUrl} 
                alt={cause.organization.name}
                className="w-10 h-10 rounded-full border-2 border-white/30"
              />
              <div>
                <p className="font-medium">{cause.organization.name}</p>
                <p className="text-sm text-indigo-200">Verified Organization</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-indigo-200">Raised</span>
                <span className="font-medium">${cause.currentAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-700 h-2 rounded-full"
                  style={{ width: `${(cause.currentAmount / cause.goalAmount) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo-200">Goal: ${cause.goalAmount.toLocaleString()}</span>
                <span className="text-indigo-200">
                  {((cause.currentAmount / cause.goalAmount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-indigo-100 mb-8 line-clamp-3">{cause.description}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center gap-3 text-sm mb-2">
              <FaLock className="text-green-400" />
              <span>Secure Payment</span>
            </div>
            <p className="text-xs text-indigo-200">All transactions are secured and encrypted</p>
          </div>
          
          <div className="text-xs text-indigo-200">
            <p>• 256-bit SSL Encryption</p>
            <p>• PCI DSS Compliant</p>
            <p>• Bank-level Security</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Payment Form */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Select Amount
            </label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData({ ...formData, amount })}
                  className={`py-3 rounded-xl transition-all ${
                    formData.amount === amount
                      ? 'bg-blue-700 text-white shadow-lg shadow-indigo-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="mt-3 w-full px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none"
            />
          </div>

          {/* Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            {['CREDIT_CARD', 'PAYPAL'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: method })}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.paymentMethod === method
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                {method === 'CREDIT_CARD' ? <FaCreditCard /> : <FaPaypal />}
                {method === 'CREDIT_CARD' ? 'Card' : 'PayPal'}
              </button>
            ))}
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none"
            />
          </div>

          {/* Card Details */}
          {formData.paymentMethod === 'CREDIT_CARD' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  className="px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Complete Donation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentCard;
