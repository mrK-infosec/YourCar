/**
 * LOADING SPINNER COMPONENT
 * Renders a premium, glowing loading spinner.
 * Can be displayed full-screen or centered inside a smaller container.
 * Features neon glowing effects, rotating tracks, and branding indicators.
 */

import React from 'react';
import { Car } from 'lucide-react';

const LoadingSpinner = ({ fullPage = true }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 animate-fade-in ${
        fullPage ? 'fixed inset-0 z-50 bg-[#0B0C10] bg-opacity-95' : 'w-full py-12'
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/* Neon Outer Glowing Ring */}
        <div className="w-16 h-16 rounded-full border-2 border-brand-teal border-opacity-10 border-t-brand-teal animate-spin shadow-[0_0_15px_rgba(102,252,241,0.2)]"></div>
        
        {/* Opposite Inner Ring */}
        <div className="absolute w-12 h-12 rounded-full border-2 border-brand-emerald border-opacity-10 border-b-brand-emerald animate-spin [animation-duration:1.2s] [animation-direction:reverse]"></div>
        
        {/* Floating brand icon inside the rings */}
        <div className="absolute text-brand-teal animate-pulse-subtle">
          <Car size={20} className="stroke-[2.5]" />
        </div>
      </div>
      
      {/* Sleek loading text */}
      <span className="text-xs font-bold text-brand-steel uppercase tracking-widest text-opacity-80 animate-pulse-subtle">
        Loading Assets...
      </span>
    </div>
  );
};

export default LoadingSpinner;
