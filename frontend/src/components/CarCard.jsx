import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Check, ExternalLink } from 'lucide-react';

const CarCard = ({ car }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  // Intersection Observer for lazy loading if browser doesn't support native loading="lazy"
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (imageRef.current && imageRef.current.dataset.src) {
            imageRef.current.src = imageRef.current.dataset.src;
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="glass-card-interactive rounded-xl overflow-hidden flex flex-col h-full relative group">
      {/* High-Performance Lazy Loaded Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-charcoal">
        {/* Skeleton Loader shown while image is loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-800"></div>
        )}
        <img
          ref={imageRef}
          data-src={car.imageUrl}
          alt={car.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
          }`}
        />
        
        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
          {car.category}
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        {/* Title and Price */}
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-white leading-tight font-sans tracking-tight line-clamp-1">
              {car.name}
            </h3>
            <span className="text-brand-red font-bold text-lg whitespace-nowrap ml-3">
              ${car.price ? car.price.toLocaleString() : 'N/A'}
            </span>
          </div>
          <p className="text-brand-steel text-xs line-clamp-1">{car.brand} {car.model && `• ${car.model}`}</p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-2">
          {car.year && (
            <div className="flex items-center space-x-1.5 bg-black/30 p-2 rounded-md border border-white/5">
              <Calendar size={13} className="text-brand-red" />
              <span>{car.year}</span>
            </div>
          )}
          {car.location && (
            <div className="flex items-center space-x-1.5 bg-black/30 p-2 rounded-md border border-white/5 line-clamp-1">
              <MapPin size={13} className="text-brand-red" />
              <span className="truncate">{car.location}</span>
            </div>
          )}
        </div>

        {/* Call to action */}
        <div className="pt-3 border-t border-white/5 mt-auto flex items-center justify-between">
          <span className="text-[11px] text-brand-emerald flex items-center">
            {car.inStock ? (
              <><Check size={12} className="mr-1" /> Available</>
            ) : (
              <span className="text-gray-500">Out of Stock</span>
            )}
          </span>
          <Link
            to={`/cars/${car._id}`}
            className="flex items-center space-x-1 text-xs font-semibold text-white bg-brand-charcoal hover:bg-brand-red border border-white/10 px-4 py-2 rounded transition-colors duration-300"
          >
            <span>Details</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
