/**
 * CAR CARD COMPONENT
 * Renders a single vehicle product card.
 * Used on the HomePage inventory grid.
 * Displays the car photo, pricing, specs badges (seats, luggage, category),
 * and buttons to "View Details" or "Add to Cart" immediately.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Users, Briefcase, Eye, ShoppingCart } from 'lucide-react';

const CarCard = ({ car }) => {
  const { addToCart } = useCart();

  // Helper function to format prices with commas (e.g. 85000 becomes $85,000)
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="glass-card-interactive flex flex-col h-full rounded-2xl overflow-hidden group">
      
      {/* VEHICLE IMAGE WRAPPER */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-black bg-opacity-25">
        <img
          src={car.imageUrl}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Category Floating Badge */}
        <span className="absolute top-4 left-4 bg-black bg-opacity-70 backdrop-blur-sm border border-white border-opacity-10 text-brand-teal text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
          {car.category}
        </span>

        {/* Stock status indicator */}
        {!car.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <span className="text-red-400 font-bold tracking-widest uppercase border border-red-400 px-4 py-1.5 rounded-md text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* VEHICLE CONTENT CARD */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Brand & Name */}
        <div className="mb-2">
          <span className="text-brand-steel text-xs font-bold uppercase tracking-widest">{car.brand}</span>
          <h3 className="text-white text-lg font-bold group-hover:text-brand-teal transition-colors duration-300 truncate mt-0.5">
            {car.name}
          </h3>
        </div>

        {/* Daily Rental / Purchase Price */}
        <div className="flex items-baseline space-x-1 mb-4">
          <span className="text-[#D4AF37] text-2xl font-extrabold tracking-tight">
            {formatPrice(car.price)}
          </span>
          <span className="text-brand-steel text-xs font-medium">/ purchase</span>
        </div>

        {/* Specification Icons Grid */}
        <div className="grid grid-cols-2 gap-3 border-t border-brand-charcoal pt-4 mb-5 text-sm">
          {/* Seats specification */}
          <div className="flex items-center space-x-2 text-brand-steel text-opacity-80">
            <Users size={16} className="text-brand-teal" />
            <span>{car.seats} Seats</span>
          </div>
          
          {/* Luggage specification */}
          <div className="flex items-center space-x-2 text-brand-steel text-opacity-80">
            <Briefcase size={16} className="text-brand-teal" />
            <span>{car.luggage || 2} Luggage</span>
          </div>
        </div>

        {/* INTERACTION BUTTONS */}
        <div className="flex items-center space-x-3 mt-auto">
          {/* View Details Button */}
          <Link
            to={`/cars/${car._id}`}
            className="flex-grow flex items-center justify-center space-x-1.5 bg-brand-charcoal text-white text-sm font-medium py-2.5 rounded-lg border border-white border-opacity-5 hover:border-brand-teal hover:border-opacity-30 hover:bg-opacity-80 transition-all duration-300 active:scale-95"
          >
            <Eye size={15} />
            <span>Details</span>
          </Link>

          {/* Quick Add to Cart Button */}
          <button
            onClick={() => addToCart(car, 1)}
            disabled={!car.inStock}
            className={`px-3.5 py-2.5 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-95 ${
              car.inStock
                ? 'bg-brand-teal text-black hover:bg-opacity-85 hover:shadow-[0_0_12px_rgba(102,252,241,0.3)]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
            title="Add to Shopping Cart"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
