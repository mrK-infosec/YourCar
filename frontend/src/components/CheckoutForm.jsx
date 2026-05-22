/**
 * CHECKOUT FORM COMPONENT
 * Renders the checkout form for guest buyers.
 * Collects Customer details: Full name, Phone number, Email (optional), and Shipping Address.
 * Performs client-side validations to ensure clean data structures.
 * Submits the order details + cart items to backend POST /api/orders.
 * Upon success, displays a congratulations card with their Order Number and Copy buttons.
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Clipboard, Check, HelpCircle } from 'lucide-react';

const CheckoutForm = ({ onSuccess, onCancel }) => {
  const { cartItems, getCartTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form input fields state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });

  // Track simple client-side form validation errors
  const [errors, setErrors] = useState({});

  // Form input fields change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when the user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Perform rigorous local validations before submitting
  const validateForm = () => {
    const tempErrors = {};
    
    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 6) {
      tempErrors.phone = 'Please provide a valid phone number (at least 6 digits)';
    }

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email format';
    }
    
    if (!formData.address.trim()) {
      tempErrors.address = 'Shipping / delivery address is required';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Form submit handler to process order checkout
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Run local form validation check
    if (!validateForm()) {
      toast.error('Please correct form validation errors.');
      return;
    }

    // 2. Prepare order payload
    const orderPayload = {
      customer: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined, // Send undefined if empty so database ignores it
        address: formData.address.trim()
      },
      // Map cart items into standard schema expected by backend controller
      items: cartItems.map(item => ({
        car: item.car,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: getCartTotal()
    };

    setIsSubmitting(true);

    try {
      // 3. Make POST request to our backend API using our Axios client
      const response = await api.post('/orders', orderPayload);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        setCreatedOrder(response.data.data); // Store the created order details to show receipt
      } else {
        toast.error(response.data.message || 'Failed to place order.');
      }
    } catch (error) {
      // Capture and display validation or server errors returned by our backend
      const serverMessage = error.response?.data?.message || 'Server error occurred during checkout.';
      toast.error(serverMessage);
      
      // If the server returns express-validator specific errors, map them to our inputs
      if (error.response?.data?.errors) {
        const mappedErrors = {};
        error.response.data.errors.forEach(err => {
          // Map backend field names (e.g. customer.fullName -> fullName)
          const field = err.field.replace('customer.', '');
          mappedErrors[field] = err.message;
        });
        setErrors(mappedErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy order number to clipboard helper
  const copyToClipboard = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.orderNumber);
      setCopied(true);
      toast.success('Order number copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If the order has been successfully placed, display the success receipt!
  if (createdOrder) {
    return (
      <div className="text-center py-6 px-4 space-y-6 animate-fade-in">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-brand-teal bg-opacity-20 border border-brand-teal flex items-center justify-center mx-auto text-brand-teal shadow-[0_0_20px_rgba(102,252,241,0.25)]">
          <Check size={32} className="stroke-[2.5] animate-bounce" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-white">Congratulations!</h3>
          <p className="text-brand-steel text-xs">Your car purchase order has been placed in our database system.</p>
        </div>

        {/* Receipt Container */}
        <div className="p-4 rounded-xl bg-black bg-opacity-40 border border-brand-charcoal space-y-3">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Customer Name</span>
            <span className="font-bold text-sm text-white">{createdOrder.customer.fullName}</span>
          </div>
          
          <div className="border-t border-brand-charcoal pt-3 flex items-center justify-between">
            <div className="text-left space-y-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Order Number</span>
              <span className="font-mono font-bold text-brand-teal text-sm tracking-wider">{createdOrder.orderNumber}</span>
            </div>
            
            {/* Copy button */}
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-brand-charcoal text-brand-steel hover:text-white border border-white border-opacity-5 hover:border-brand-teal transition-all duration-300"
              title="Copy Order Number"
            >
              {copied ? <Check size={15} className="text-brand-teal" /> : <Clipboard size={15} />}
            </button>
          </div>
        </div>

        <div className="text-xs text-brand-steel flex items-center justify-center space-x-1.5 p-2 bg-brand-charcoal bg-opacity-40 rounded-lg">
          <HelpCircle size={14} className="text-brand-teal" />
          <span>Save this code to check your status under **Track Order**!</span>
        </div>

        {/* Complete Order and Close */}
        <button
          onClick={onSuccess}
          className="w-full btn-teal py-3 text-sm"
        >
          Excellent
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in text-left">
      <div className="mb-2">
        <p className="text-xs text-brand-steel">Provide your details to complete your order checkout reservation.</p>
      </div>

      {/* FULL NAME FIELD */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-brand-steel uppercase tracking-wider">Full Name *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="e.g. John Doe"
          className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.fullName && <span className="text-[10px] text-red-400 font-bold">{errors.fullName}</span>}
      </div>

      {/* PHONE NUMBER FIELD */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-brand-steel uppercase tracking-wider">Phone Number *</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="e.g. +1 555-0199"
          className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.phone && <span className="text-[10px] text-red-400 font-bold">{errors.phone}</span>}
      </div>

      {/* EMAIL ADDRESS FIELD */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-brand-steel uppercase tracking-wider">Email Address (Optional)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="e.g. john@example.com"
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.email && <span className="text-[10px] text-red-400 font-bold">{errors.email}</span>}
      </div>

      {/* BILLING / DELIVERY ADDRESS FIELD */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-brand-steel uppercase tracking-wider">Delivery Address *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          placeholder="Enter full physical address for registration..."
          className={`form-input resize-none ${errors.address ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.address && <span className="text-[10px] text-red-400 font-bold">{errors.address}</span>}
      </div>

      {/* SUBMISSION BUTTONS */}
      <div className="flex items-center space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/3 bg-brand-charcoal text-brand-steel hover:text-white py-2.5 rounded-lg border border-white border-opacity-5 hover:bg-opacity-80 transition-all text-xs font-semibold"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-2/3 btn-teal py-2.5 text-xs font-semibold flex items-center justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              <span>Processing...</span>
            </span>
          ) : (
            <span>Place Order ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(getCartTotal())})</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
