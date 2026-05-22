/**
 * ORDER TRACKING PAGE
 * Allows clients to track the fulfillment phase of their vehicle checkout.
 * Features:
 * 1. Form demanding Order Tracking ID (e.g. "TM-XXXXXXXXX") and registered Phone.
 * 2. Connects to backend GET /api/orders/:id?phone=:phone.
 * 3. Renders a luxury horizontal progress stepper representing fulfillment stages.
 * 4. Displays full receipt details (items, billing profile, totals) upon validation success.
 */

import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Search, Package, MapPin, Truck, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';

const OrderTrackingPage = () => {
  // Input fields state
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  
  // Results and loadings states
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Form submit handler to fetch tracking data
  const handleTrackingSearch = async (e) => {
    e.preventDefault();

    // Local validation checks
    if (!orderNumber.trim()) {
      toast.error('Please enter your Order Number.');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter your Phone Number.');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setOrder(null);

    try {
      // GET /api/orders/:id?phone=:phone using Axios client
      // The backend will check if the order exists AND verify the phone match!
      const response = await api.get(`/orders/${orderNumber.trim()}`, {
        params: { phone: phone.trim() }
      });

      if (response.data.success) {
        setOrder(response.data.data);
        toast.success('Order records retrieved successfully!');
      } else {
        toast.error('Failed to locate order.');
      }
    } catch (error) {
      // Capture phone number mismatch or incorrect code errors
      const serverMessage = error.response?.data?.message || 'Order search failed. Check details.';
      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper: check progress step index mapping based on current status
  const getStatusStepIndex = (status) => {
    const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
    return steps.indexOf(status.toLowerCase());
  };

  // Helper: return status badges styling color mappings
  const getStatusBadgeStyles = (status) => {
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'bg-yellow-500 bg-opacity-15 text-yellow-400 border-yellow-500';
    if (lower === 'confirmed') return 'bg-blue-500 bg-opacity-15 text-blue-400 border-blue-500';
    if (lower === 'shipped') return 'bg-indigo-500 bg-opacity-15 text-indigo-400 border-indigo-500';
    if (lower === 'delivered') return 'bg-green-500 bg-opacity-15 text-green-400 border-green-500';
    return 'bg-red-500 bg-opacity-15 text-red-400 border-red-500'; // Cancelled status
  };

  // Helper: format prices
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Stepper structure configuration
  const trackingSteps = [
    { title: 'Pending', desc: 'Order Placed', icon: ShoppingBag },
    { title: 'Confirmed', desc: 'Payment Approved', icon: ShieldCheck },
    { title: 'Shipped', desc: 'Vehicle Transit', icon: Truck },
    { title: 'Delivered', desc: 'Listing Handover', icon: CheckCircle2 }
  ];

  const currentStepIndex = order ? getStatusStepIndex(order.status) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
      
      {/* HEADER CAPTION */}
      <div className="text-center space-y-2">
        <span className="text-brand-teal text-xs font-bold uppercase tracking-widest">Order Tracking</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Track Your Car Purchase</h1>
        <p className="max-w-md mx-auto text-brand-steel text-xs text-opacity-80">
          Enter your unique Order Number and associated Phone Number to view your contract's real-time shipment status.
        </p>
      </div>

      {/* TRACKING INQUIRY BOX */}
      <div className="glass-card p-6 rounded-2xl border border-brand-charcoal">
        <form onSubmit={handleTrackingSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Order tracking ID */}
          <div className="md:col-span-5 flex flex-col space-y-1.5 text-left">
            <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Order Tracking Code *</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. TM-168239402"
              className="form-input text-sm"
              disabled={loading}
            />
          </div>

          {/* phone check */}
          <div className="md:col-span-5 flex flex-col space-y-1.5 text-left">
            <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Associated Phone *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 555-0199"
              className="form-input text-sm"
              disabled={loading}
            />
          </div>

          {/* submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-teal text-sm py-2.5 flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Search size={15} />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH RESULTS LAYOUTS */}
      {order ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* A. Dynamic Horizontal Stepper Progress Tracker */}
          {order.status.toLowerCase() !== 'cancelled' && (
            <div className="glass-card p-8 rounded-2xl border border-brand-charcoal overflow-x-auto">
              <div className="min-w-[600px] flex justify-between items-center relative py-2">
                {/* Stepper background line */}
                <div className="absolute top-[26px] left-[5%] right-[5%] h-0.5 bg-brand-charcoal z-0"></div>
                
                {/* Active progress color indicator line */}
                {currentStepIndex > 0 && (
                  <div 
                    className="absolute top-[26px] left-[5%] h-0.5 bg-brand-teal z-0 transition-all duration-500 ease-out"
                    style={{ width: `${(currentStepIndex / 3) * 90}%` }}
                  ></div>
                )}

                {/* Draw each step circle and label */}
                {trackingSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = idx < currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  const isFuture = idx > currentStepIndex;

                  return (
                    <div key={step.title} className="flex flex-col items-center relative z-10 w-1/4">
                      {/* Step Circle Frame */}
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border ${
                          isCompleted 
                            ? 'bg-brand-teal text-black border-brand-teal shadow-[0_0_12px_rgba(102,252,241,0.25)]' 
                            : isActive 
                            ? 'bg-[#0B0C10] text-brand-teal border-brand-teal shadow-[0_0_15px_rgba(102,252,241,0.35)] animate-pulse-subtle' 
                            : 'bg-brand-charcoal text-brand-steel border-white border-opacity-5'
                        }`}
                      >
                        <StepIcon size={18} />
                      </div>
                      
                      {/* Labels */}
                      <div className="text-center mt-3">
                        <h4 className={`text-xs font-bold ${isActive ? 'text-brand-teal' : isFuture ? 'text-gray-500' : 'text-white'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[9px] text-gray-500 uppercase font-medium mt-0.5 block">{step.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* B. General receipt and Status Badge layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left side: Billing & Delivery Details */}
            <div className="md:col-span-5 glass-card p-6 rounded-2xl border border-brand-charcoal space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-brand-charcoal pb-4">
                <h3 className="font-bold text-white text-base">Booking Profile</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusBadgeStyles(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Customer Name</span>
                  <span className="font-bold text-white text-sm">{order.customer.fullName}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Contact Phone</span>
                  <span className="font-bold text-white text-sm">{order.customer.phone}</span>
                </div>

                {order.customer.email && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Email Address</span>
                    <span className="font-bold text-white text-sm">{order.customer.email}</span>
                  </div>
                )}

                <div className="space-y-1.5 pt-2 border-t border-brand-charcoal">
                  <div className="flex items-center space-x-1.5 text-gray-500">
                    <MapPin size={12} className="text-brand-teal" />
                    <span className="text-[10px] uppercase tracking-widest">Delivery Address</span>
                  </div>
                  <span className="font-medium text-brand-steel leading-relaxed block">{order.customer.address}</span>
                </div>
              </div>
            </div>

            {/* Right side: Items details and Totals */}
            <div className="md:col-span-7 glass-card p-6 rounded-2xl border border-brand-charcoal flex flex-col justify-between text-left">
              <div className="border-b border-brand-charcoal pb-4">
                <h3 className="font-bold text-white text-base">Receipt Items</h3>
              </div>

              {/* Items List */}
              <div className="divide-y divide-brand-charcoal divide-opacity-40 overflow-y-auto max-h-56 pr-2 my-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={item._id || idx} className="flex justify-between items-center py-2 text-xs">
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <span className="text-gray-500 text-[10px]">
                        {formatPrice(item.price)} x {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-brand-teal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="border-t border-brand-charcoal pt-4 flex justify-between items-baseline mt-auto">
                <span className="text-brand-steel text-xs font-semibold">Total Amount:</span>
                <span className="text-[#D4AF37] text-xl font-black">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

          </div>

        </div>
      ) : hasSearched && !loading ? (
        // Render Empty Results notification
        <div className="animate-fade-in text-center py-16 bg-brand-charcoal bg-opacity-20 border border-brand-charcoal rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-950 bg-opacity-20 border border-red-900 border-opacity-35 flex items-center justify-center mx-auto text-red-400">
            <Package size={22} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">No Order Found</h3>
            <p className="text-brand-steel text-xs mt-1">
              We couldn't find any contract matching **{orderNumber}** with phone ending in **...{phone.slice(-3)}**.
            </p>
          </div>
          <p className="text-[10px] text-gray-500 max-w-xs mx-auto">
            Please double-check your Order ID token and verify that the associated phone matching checkout registration is correct.
          </p>
        </div>
      ) : null}

    </div>
  );
};

export default OrderTrackingPage;
