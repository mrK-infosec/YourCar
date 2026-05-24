/**
 * CART MODAL/SIDEBAR COMPONENT
 * Renders a sliding sidebar on the right side of the screen.
 * Displays all items currently in the cart, item quantities, and prices.
 * Allows users to adjust item amounts (+/-) or remove items completely.
 * Displays a running grand total and a checkout action.
 * When "Proceed to Checkout" is clicked, it shifts to render the CheckoutForm inside the sidebar.
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutForm from './CheckoutForm';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  // If the drawer is not set to open, render nothing (hidden)
  if (!isOpen) return null;

  // Helper to format currency
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    // BACKDROP PANEL (Closes drawer when clicked)
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in bg-black bg-opacity-70 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={() => {
          setShowCheckout(false);
          onClose();
        }}
      />

      {/* DRAWER BODY (Frosted glassmorphism sidebar) */}
      <div className="relative w-full max-w-md h-full glass-sidebar flex flex-col shadow-2xl text-white z-10 animate-slide-up">
        
        {/* DRAWER HEADER */}
        <div className="p-5 border-b border-brand-charcoal flex justify-between items-center bg-black bg-opacity-30">
          <div className="flex items-center space-x-2">
            {showCheckout ? (
              // Back button to return to cart listing
              <button 
                onClick={() => setShowCheckout(false)}
                className="p-1 rounded-full text-brand-steel hover:text-brand-red transition-colors"
                title="Back to shopping cart"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <ShoppingBag size={20} className="text-brand-red" />
            )}
            <h2 className="text-lg font-bold tracking-tight">
              {showCheckout ? 'Confirm Purchase' : `Your Cart (${getCartCount()})`}
            </h2>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => {
              setShowCheckout(false);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-brand-charcoal text-brand-steel hover:text-white transition-colors duration-300"
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* DRAWER BODY SECTION */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {showCheckout ? (
            // Render the Checkout Form component
            <CheckoutForm 
              onSuccess={() => {
                clearCart();
                setShowCheckout(false);
                onClose();
              }}
              onCancel={() => setShowCheckout(false)}
            />
          ) : cartItems.length === 0 ? (
            // Render empty cart state
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="w-16 h-16 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-steel text-opacity-40 border border-white border-opacity-5">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Your cart is empty</h3>
                <p className="text-brand-steel text-xs mt-1">Explore our catalog and add a car to get started!</p>
              </div>
              <button
                onClick={onClose}
                className="btn-red py-2 text-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            // Render list of cart items
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.car}
                  className="flex items-center space-x-4 p-3 rounded-xl bg-black bg-opacity-20 border border-brand-charcoal border-opacity-40 transition-colors duration-300 hover:border-brand-red hover:border-opacity-10 group"
                >
                  {/* Item Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-brand-charcoal"
                  />

                  {/* Name and Price calculations */}
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">{item.brand}</span>
                    <h4 className="font-bold text-white text-sm truncate mt-0.5">{item.name}</h4>
                    <div className="flex items-baseline space-x-1.5 mt-1">
                      <span className="text-brand-red text-xs font-bold">{formatPrice(item.price)}</span>
                      <span className="text-gray-500 text-[10px]">x {item.quantity}</span>
                    </div>
                  </div>

                  {/* Quantity and Delete Controls */}
                  <div className="flex flex-col items-end justify-between space-y-2">
                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.car)}
                      className="text-gray-500 hover:text-red-400 p-1 rounded-md transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Quantity selectors */}
                    <div className="flex items-center bg-black bg-opacity-30 border border-brand-charcoal rounded-md py-0.5 px-1 space-x-2 text-xs">
                      <button
                        onClick={() => updateQuantity(item.car, item.quantity - 1)}
                        className="text-brand-steel hover:text-brand-red p-0.5"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={11} />
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.car, item.quantity + 1)}
                        className="text-brand-steel hover:text-brand-red p-0.5"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DRAWER FOOTER (Total costs and call-to-actions) */}
        {!showCheckout && cartItems.length > 0 && (
          <div className="p-5 border-t border-brand-charcoal bg-black bg-opacity-40 space-y-4">
            {/* Price Summations */}
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-brand-steel text-sm">Grand Subtotal:</span>
              <span className="text-brand-silver text-2xl font-black font-sans">
                {formatPrice(getCartTotal())}
              </span>
            </div>

            {/* Check-out and Continuation Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full btn-red py-3 text-sm flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-brand-steel hover:text-brand-red py-2 transition-colors duration-300"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
