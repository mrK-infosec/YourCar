/**
 * HOME PAGE PAGE
 * The primary client-facing page of Revora (Revora).
 * Features:
 * 1. Hero Section: Catchy marketing text, modern dark overlay styling, call-to-actions.
 * 2. Services Section: Informative boxes detailing Sales, Rentals, and Trades.
 * 3. About Section: Elegant history and value propositions.
 * 4. Catalog Showcase: Filters cars by categories and fetches live data from MongoDB.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Sparkles, ShieldCheck, Award, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Available inventory filters
  const categories = ['All', 'First Class', 'Business Class', 'SUV', 'Economy'];

  // 1. Fetch cars list from Express backend on page mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        // GET /api/cars using Axios instance - fetching 500 to ensure we have all fallback cars!
        const response = await api.get('/cars?limit=500');
        
        if (response.data.success) {
          // Backward compatibility for both v1 array and v2 paginated { cars: [] } structure
          const carsList = response.data.data.cars || response.data.data;
          setCars(carsList);
          setFilteredCars(carsList); // Initialize filtered list with full set
        } else {
          toast.error('Failed to load vehicle catalog.');
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error('Backend connection offline. Make sure MongoDB and Node server are running.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // 2. Filter cars when activeCategory changes
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter(car => car.category === activeCategory));
    }
  }, [activeCategory, cars]);

  // Handle category button selection clicks
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    toast.success(`Showing ${category} vehicles`, { id: 'category-toast' });
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        
        {/* Animated Background decorative light blots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-red opacity-[0.03] blur-[100px] animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-silver opacity-[0.03] blur-[100px] animate-pulse-subtle"></div>

        {/* Content Box */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-brand-charcoal bg-opacity-50 px-4 py-1.5 rounded-full border border-white border-opacity-5 text-xs text-brand-red">
            <Sparkles size={14} className="animate-spin [animation-duration:4s]" />
            <span className="font-semibold uppercase tracking-wider">Welcome to Revora</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-emerald">Ultimate Luxury</span><br />
            Car For Your Journey
          </h1>

          <p className="max-w-2xl mx-auto text-brand-steel text-sm sm:text-base leading-relaxed text-opacity-80">
            Discover a curated boutique collection of executive sports cars, business-class sedans, and high-fidelity utility SUVs engineered to elevate every mile.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <a
              href="#catalog"
              className="btn-red text-sm flex items-center space-x-1.5"
            >
              <span>Explore Fleet</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="#about"
              className="btn-silver text-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>


      {/* =========================================================================
          2. SERVICES SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">Our Operations</span>
          <h2 className="text-3xl font-extrabold text-white">Engineered For Service Excellence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card A: Car Sales */}
          <div className="glass-card-interactive p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-brand-red bg-opacity-10 border border-brand-red border-opacity-20 flex items-center justify-center text-brand-red">
              <Award size={26} />
            </div>
            <h3 className="text-lg font-bold text-white">Car Sales</h3>
            <p className="text-brand-steel text-xs leading-relaxed text-opacity-80">
              Own the vehicle of your dreams. Our direct sales catalog provides comprehensive, certified vehicle transfers with detailed histories and warranties.
            </p>
          </div>

          {/* Card B: Car Rental */}
          <div className="glass-card-interactive p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-brand-red bg-opacity-10 border border-brand-red border-opacity-20 flex items-center justify-center text-brand-red">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-lg font-bold text-white">Car Rental</h3>
            <p className="text-brand-steel text-xs leading-relaxed text-opacity-80">
              Premium transportation rentals. Experience short-term daily bookings or long-term leasing options featuring clean, freshly serviced luxury fleets.
            </p>
          </div>

          {/* Card C: Car Trading */}
          <div className="glass-card-interactive p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-brand-red bg-opacity-10 border border-brand-red border-opacity-20 flex items-center justify-center text-brand-red">
              <TrendingUp size={26} />
            </div>
            <h3 className="text-lg font-bold text-white">Car Trading</h3>
            <p className="text-brand-steel text-xs leading-relaxed text-opacity-80">
              Instant equity valuations. Bring in your existing luxury vehicle and easily trade it in against a newer models catalog with zero stress.
            </p>
          </div>
        </div>
      </section>


      {/* =========================================================================
          3. ABOUT SECTION
          ========================================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Photo Frame Mockup */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-charcoal border border-white border-opacity-5 shadow-2xl">
          <img
            src="https://picsum.photos/id/111/800/600"
            alt="Revora Showcase Room"
            className="w-full h-full object-cover filter brightness-75 hover:scale-105 transition-transform duration-500"
          />
          {/* Accent decoration */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent"></div>
        </div>

        {/* Right Side: Copy block */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">About Our Fleet</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Redefining Premium Driving Experiences</h2>
          </div>

          <p className="text-brand-steel text-sm leading-relaxed text-opacity-80">
            Founded with a vision to deliver outstanding vehicle options, Revora (Revora) represents a standard-setting inventory boutique. We carefully acquire only premium-class selections, ensuring every model on our floor is fully verified and freshly prepared.
          </p>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-brand-red bg-opacity-10 text-brand-red flex items-center justify-center text-xs font-bold font-mono">1</span>
              <span className="text-white font-medium">100-Point Multipoint Certification on every car</span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-brand-red bg-opacity-10 text-brand-red flex items-center justify-center text-xs font-bold font-mono">2</span>
              <span className="text-white font-medium">Completely secure backend transactions with tracking</span>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-brand-red bg-opacity-10 text-brand-red flex items-center justify-center text-xs font-bold font-mono">3</span>
              <span className="text-white font-medium">Dedicated expert maintenance support desk</span>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          4. CAR SHOWCASE GRID
          ========================================================================= */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0 border-b border-brand-charcoal pb-6">
          <div className="space-y-2">
            <span className="text-brand-silver text-xs font-bold uppercase tracking-widest">Our Available Fleet</span>
            <h2 className="text-3xl font-extrabold text-white">Browse Premium Collections</h2>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`text-xs font-semibold py-2 px-4 rounded-md transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-brand-red text-black shadow-md'
                    : 'bg-brand-charcoal bg-opacity-40 text-brand-steel hover:text-white border border-white border-opacity-5 hover:border-brand-red hover:border-opacity-20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog loader, empty, or populated grid states */}
        {loading ? (
          <LoadingSpinner fullPage={false} />
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-brand-charcoal bg-opacity-20 border border-brand-charcoal rounded-2xl p-6">
            <h3 className="font-bold text-white text-lg">No vehicles found</h3>
            <p className="text-brand-steel text-xs mt-1">We currently do not have cars cataloged under the "{activeCategory}" category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div key={car._id} className="animate-fade-in">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default HomePage;
