/**
 * NAVBAR COMPONENT
 * The navigation header bar of the application.
 * It contains the logo, links to sections/pages, and a floating Shopping Bag icon.
 * Clicking the Shopping Bag opens the Cart Sidebar Modal.
 * It features responsive design (hamburger menu on mobile) and a glassmorphism background.
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, Car, ClipboardList, UserCog } from 'lucide-react';

const Navbar = ({ onCartClick }) => {
  const { getCartCount } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Detect if page is scrolled down to add a background blur effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Helper to check if a navigation route is currently active
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-dark bg-opacity-80 backdrop-blur-md border-b border-white border-opacity-5 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-red to-brand-emerald flex items-center justify-center text-black shadow-md group-hover:scale-105 transition-transform duration-300">
              <Car size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-sans group-hover:text-brand-red transition-colors duration-300">
                REV<span className="text-brand-red font-normal ml-0.5">ORA</span>
              </span>
            </div>
          </Link>

          {/* DESKTOP ROUTING LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-brand-red ${
                isActive('/') ? 'text-brand-red font-semibold' : 'text-brand-steel'
              }`}
            >
              Browse Cars
            </Link>
            
            <Link
              to="/track"
              className={`flex items-center space-x-1.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:text-brand-red ${
                isActive('/track') ? 'text-brand-red font-semibold' : 'text-brand-steel'
              }`}
            >
              <ClipboardList size={16} />
              <span>Track Order</span>
            </Link>

            <Link
              to="/admin"
              className={`flex items-center space-x-1.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:text-brand-red ${
                isActive('/admin') ? 'text-brand-red font-semibold' : 'text-brand-steel'
              }`}
            >
              <UserCog size={16} />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* INTERACTIONS: CART ICON AND MOBILE SANDWICH */}
          <div className="flex items-center space-x-4">
            {/* CART TRIGGER BUTTON */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 rounded-full bg-brand-charcoal text-white hover:text-brand-red border border-white border-opacity-5 hover:border-brand-red hover:border-opacity-30 transition-all duration-300 group shadow-md"
              aria-label="Open shopping cart"
            >
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform duration-300" />
              
              {/* Dynamic Notification Badge showing item quantity */}
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-black text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Hamburger menu for small devices */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md md:hidden text-brand-steel hover:text-white hover:bg-brand-charcoal transition-all duration-300"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in bg-brand-dark border-b border-brand-charcoal py-4 px-6 space-y-4 shadow-2xl">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block text-base font-medium py-2 ${
              isActive('/') ? 'text-brand-red' : 'text-brand-steel'
            }`}
          >
            Browse Cars
          </Link>
          
          <Link
            to="/track"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-2 text-base font-medium py-2 ${
              isActive('/track') ? 'text-brand-red' : 'text-brand-steel'
            }`}
          >
            <ClipboardList size={18} />
            <span>Track Order</span>
          </Link>

          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-2 text-base font-medium py-2 ${
              isActive('/admin') ? 'text-brand-red' : 'text-brand-steel'
            }`}
          >
            <UserCog size={18} />
            <span>Admin Portal</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
