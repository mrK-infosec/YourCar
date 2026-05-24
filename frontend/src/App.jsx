/**
 * MAIN APP COMPONENT (React Client Router)
 * This is the primary root component of our frontend React application.
 * Features:
 * 1. Sets up the main header Navbar and sliding CartModal.
 * 2. Tracks the active "isCartOpen" sidebar state globally.
 * 3. Mounts React Router DOM <Routes> mapping URLs to pages:
 *    - "/" -> HomePage (Browse catalogs)
 *    - "/cars/:id" -> CarDetailsPage (Detailed specifications)
 *    - "/track" -> OrderTrackingPage (Fulfillment tracing)
 *    - "/admin" -> AdminPage (Administrative command dashboards)
 * 4. Mounts the `<Toaster />` to display gorgeous animated notifications anywhere.
 * 5. Appends a corporate premium brand Footer at the bottom.
 */

import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartModal from './components/CartModal';
import { Toaster } from 'react-hot-toast';
import { Car, Compass, Mail, Phone, MapPin } from 'lucide-react';

// Lazy loaded pages to optimize bundle size and speed up initial page load
const HomePage = lazy(() => import('./pages/HomePage'));
const CarDetailsPage = lazy(() => import('./pages/CarDetailsPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// A loading fallback component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
  </div>
);

const App = () => {
  // Global state to track if the sliding Cart Modal sidebar is open or closed
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Helper toggle functions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    // Central container with our dark branding background color
    <div className="min-h-screen bg-[#0B0C10] flex flex-col justify-between text-[#C5C6C7]">
      
      {/* 1. TOAST NOTIFICATION CONTAINER */}
      {/* Renders global notifications with customized dark glass templates */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1F2833',
            color: '#FFFFFF',
            border: '1px solid rgba(102, 252, 241, 0.15)',
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif"
          },
          success: {
            iconTheme: {
              primary: '#66FCF1',
              secondary: '#0B0C10'
            }
          }
        }}
      />

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <Navbar onCartClick={openCart} />

      {/* 3. SLIDING SHOPPING CART DRAWER */}
      <CartModal isOpen={isCartOpen} onClose={closeCart} />

      {/* 4. MAIN PAGE CONTENT CONTAINER */}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cars/:id" element={<CarDetailsPage />} />
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* 5. LUXURY BRAND FOOTER */}
      <footer className="bg-black border-t border-brand-charcoal pt-16 pb-8 mt-20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column A: Logo & Brand Description */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center text-black">
                <Car size={16} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                TIMGAD<span className="text-brand-teal font-normal ml-0.5">MOTORS</span>
              </span>
            </Link>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Timgad Motors represents an elite corporate inventory catalog dedicated to sourcing certified sports, executive, and SUV listings.
            </p>
          </div>

          {/* Column B: Sitemap Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Sitemap Fleet</h4>
            <div className="flex flex-col space-y-2 text-xs">
              <Link to="/" className="text-gray-500 hover:text-brand-teal transition-colors">Browse Fleet Collections</Link>
              <Link to="/track" className="text-gray-500 hover:text-brand-teal transition-colors">Track Active Bookings</Link>
              <Link to="/admin" className="text-gray-500 hover:text-brand-teal transition-colors">Authorized Portals</Link>
            </div>
          </div>

          {/* Column C: Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Showroom Hours</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-500">
              <div>Monday - Friday: 09:00 - 19:00</div>
              <div>Saturday: 10:00 - 17:00</div>
              <div>Sunday: Closed Showcase</div>
            </div>
          </div>

          {/* Column D: Contact Support Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Support Desk</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Phone size={13} className="text-brand-teal" />
                <span>+1 555-TIMGAD</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={13} className="text-brand-teal" />
                <span>support@timgad.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={13} className="text-brand-teal" />
                <span>100 Luxury Blvd, Timgad City</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-brand-charcoal border-opacity-40 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-600">
          <span>&copy; {new Date().getFullYear()} Timgad Motors. All rights reserved globally.</span>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-brand-teal">Privacy Policy</a>
            <a href="#" className="hover:text-brand-teal">Terms of Reservation</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
