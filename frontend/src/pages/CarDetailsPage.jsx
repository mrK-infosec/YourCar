/**
 * CAR DETAILS PAGE
 * Displays exhaustive specifications of a single vehicle catalog item.
 * Features:
 * 1. Fetches specific car details via GET /api/cars/:id.
 * 2. Visual layout detailing pricing, descriptions, and structural spec badges.
 * 3. Interactive quantity adjuster (+/-).
 * 4. Add to Cart button which syncs choice into CartContext.
 * 5. Back-to-home button for navigation continuity.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Users, Briefcase, Plus, Minus, ArrowLeft, ShoppingCart, ShieldCheck, HelpCircle } from 'lucide-react';

const CarDetailsPage = () => {
  // Extract the URL parameter (e.g. /cars/66258f...)
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // 1. Fetch the specific car from database on mount or ID change
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        // GET /api/cars/:id using Axios instance
        const response = await api.get(`/cars/${id}`);
        
        if (response.data.success) {
          setCar(response.data.data);
        } else {
          toast.error('Vehicle listing not found.');
          navigate('/'); // Redirect to home on failure
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        toast.error('Error loading car details. Redirecting to fleet catalog...');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  // Quantity modification handlers
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Handler to add the item into context cart
  const handleAddToCart = () => {
    if (car) {
      addToCart(car, quantity);
      toast.success(`Added ${quantity}x ${car.name} to cart!`);
    }
  };

  // Helper function to format prices
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) return <LoadingSpinner />;
  
  if (!car) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 pt-20">
        <h2 className="text-xl font-bold text-white">Car details not found</h2>
        <Link to="/" className="btn-red flex items-center space-x-2">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
      
      {/* BACK TO FLEET ROUTE LINK */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-brand-steel hover:text-brand-red text-sm font-semibold tracking-wide transition-colors duration-300"
        >
          <ArrowLeft size={18} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* CORE SPECIFICATIONS COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: VEHICLE IMAGE */}
        <div className="lg:col-span-7 relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-charcoal border border-white border-opacity-5 shadow-2xl">
          <img
            src={car.imageUrl}
            alt={car.name}
            className="w-full h-full object-cover object-center"
          />
          {/* Floating Category tag */}
          <span className="absolute top-6 left-6 bg-black bg-opacity-70 backdrop-blur-sm border border-white border-opacity-10 text-brand-red text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-md">
            {car.category}
          </span>
          
          {/* Out of Stock Overlay */}
          {!car.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <span className="text-red-400 font-extrabold tracking-widest uppercase border border-red-400 px-6 py-2.5 rounded-md text-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: VEHICLE INFORMATION CARD */}
        <div className="lg:col-span-5 space-y-8 glass-card p-8 rounded-2xl border border-brand-charcoal">
          
          {/* Brand & Name */}
          <div className="space-y-1">
            <span className="text-brand-silver text-xs font-bold uppercase tracking-widest">{car.brand}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{car.name}</h1>
          </div>

          {/* Pricing Tag */}
          <div className="flex flex-col space-y-4 border-b border-brand-charcoal pb-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-brand-red text-3xl font-extrabold tracking-tight">
                {formatPrice(car.price)}
              </span>
              <span className="text-brand-steel text-sm font-medium">Full purchase value</span>
            </div>

            {car.marketPrice && car.marketPrice > car.price && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-brand-steel">Market Value:</span>
                <span className="text-gray-400 line-through">{formatPrice(car.marketPrice)}</span>
                <span className="text-green-400 font-bold ml-2">
                  Save {formatPrice(car.marketPrice - car.price)}
                </span>
                {car.marketTrend === 'up' && (
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ml-2 border border-red-500/30">
                    Market Trending Up
                  </span>
                )}
              </div>
            )}

            {/* Installment Options */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#1D1E24] border border-[#30323D] rounded-lg p-3 flex flex-col justify-between hover:border-[#38ffc8] transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#38ffc8] font-black text-sm tracking-tight group-hover:scale-105 transition-transform">tabby</span>
                  <span className="text-[10px] text-brand-steel bg-black/50 px-1.5 py-0.5 rounded">4 Months</span>
                </div>
                <div className="text-white font-bold text-sm">
                  {formatPrice(car.price / 4)} <span className="text-[10px] text-brand-steel font-normal">/mo</span>
                </div>
                <div className="text-[10px] text-brand-steel mt-1">No interest, no hidden fees.</div>
              </div>

              <div className="bg-[#1D1E24] border border-[#30323D] rounded-lg p-3 flex flex-col justify-between hover:border-[#F2A900] transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#F2A900] font-black text-sm tracking-tight group-hover:scale-105 transition-transform">tamara</span>
                  <span className="text-[10px] text-brand-steel bg-black/50 px-1.5 py-0.5 rounded">3 Months</span>
                </div>
                <div className="text-white font-bold text-sm">
                  {formatPrice(car.price / 3)} <span className="text-[10px] text-brand-steel font-normal">/mo</span>
                </div>
                <div className="text-[10px] text-brand-steel mt-1">Split in 3, zero interest.</div>
              </div>
            </div>
          </div>

          {/* Description paragraphs */}
          <div className="space-y-4 text-brand-steel text-sm leading-relaxed text-opacity-80">
            <h3 className="text-white font-bold text-base">Vehicle Overview</h3>
            <p>{car.description}</p>
          </div>

          {/* Specifications indicators Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-brand-charcoal py-6 my-6 text-sm">
            {/* Seats spec */}
            <div className="flex items-center space-x-3 text-brand-steel">
              <div className="w-9 h-9 rounded-lg bg-brand-charcoal flex items-center justify-center text-brand-red border border-white border-opacity-5">
                <Users size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Seats</span>
                <span className="font-bold text-white text-xs">{car.seats} Passengers</span>
              </div>
            </div>

            {/* Luggage spec */}
            <div className="flex items-center space-x-3 text-brand-steel">
              <div className="w-9 h-9 rounded-lg bg-brand-charcoal flex items-center justify-center text-brand-red border border-white border-opacity-5">
                <Briefcase size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Luggage</span>
                <span className="font-bold text-white text-xs">{car.luggage || 2} Large Suitcases</span>
              </div>
            </div>
          </div>

          {/* QUANTITY AND CART INTEGRATION */}
          {car.inStock ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-steel uppercase tracking-wider">Select Quantity:</span>
                
                {/* Plus / Minus Adjuster */}
                <div className="flex items-center bg-black bg-opacity-30 border border-brand-charcoal rounded-lg py-1 px-2.5 space-x-4">
                  <button
                    onClick={decrementQuantity}
                    className="text-brand-steel hover:text-brand-red p-1 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold w-6 text-center text-sm">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="text-brand-steel hover:text-brand-red p-1 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="w-full btn-red py-3.5 text-sm flex items-center justify-center space-x-2 font-bold shadow-lg"
              >
                <ShoppingCart size={18} className="stroke-[2.5]" />
                <span>Add to Shopping Cart ({formatPrice(car.price * quantity)})</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 text-center text-xs text-red-400 bg-red-950 bg-opacity-20 border border-red-900 border-opacity-35 p-4 rounded-xl">
              <span>This luxury vehicle is currently out of stock. Please check back later or contact support.</span>
            </div>
          )}

          {/* Secure Purchase Assurances */}
          <div className="flex items-center justify-center space-x-2 border-t border-brand-charcoal pt-6 text-[10px] text-gray-500 font-medium">
            <ShieldCheck size={14} className="text-brand-red" />
            <span>Secure 256-bit encrypted administrative booking reservation</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
