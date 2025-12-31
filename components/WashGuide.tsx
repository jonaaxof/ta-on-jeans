import React from 'react';
import { WASHES } from '../constants';

const WashGuide: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1582418702059-97ebafb35d50?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  return (
    <section className="py-20 bg-concrete">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-denim-900 uppercase mb-12">
          Shop Por Lavagem
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {WASHES.map((wash) => (
            <div key={wash.id} className="group cursor-pointer flex flex-col items-center">
              <div className="w-full aspect-square overflow-hidden rounded-full md:rounded-none md:aspect-[4/5] relative mb-4 bg-gray-200 shadow-md">
                <img 
                  src={wash.image} 
                  alt={wash.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <h3 className="text-lg font-display font-bold uppercase text-denim-900 group-hover:text-leather transition-colors">
                {wash.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WashGuide;