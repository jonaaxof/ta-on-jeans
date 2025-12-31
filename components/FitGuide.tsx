import React from 'react';
import { FITS } from '../constants';
import { FitType } from '../types';

interface FitGuideProps {
  selectedFit: FitType;
  onSelectFit: (fit: FitType) => void;
}

const FitGuide: React.FC<FitGuideProps> = ({ selectedFit, onSelectFit }) => {
  // Fallback image if fit image fails
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1542272617-08f08637533d?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  return (
    <section id="fit-guide" className="py-16 bg-concrete">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-denim-900 uppercase">
              Encontre sua Modelagem
            </h2>
            <p className="text-gray-500 mt-2">Selecione um estilo para filtrar a coleção.</p>
          </div>
          <button 
            onClick={() => onSelectFit('Todos')}
            className={`hidden sm:block text-sm font-bold uppercase tracking-wider underline-offset-4 ${selectedFit === 'Todos' ? 'underline text-leather' : 'text-gray-500 hover:text-denim-900'}`}
          >
            Ver Todos
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto space-x-6 pb-8 no-scrollbar snap-x snap-mandatory">
          {FITS.map((fit) => (
            <div 
              key={fit.id}
              onClick={() => onSelectFit(fit.id)}
              className={`flex-shrink-0 w-64 md:w-72 cursor-pointer group snap-center transition-transform duration-300 ${selectedFit === fit.id ? 'scale-105' : 'scale-100'}`}
            >
              <div className={`relative aspect-[3/4] overflow-hidden mb-4 border-2 bg-gray-200 ${selectedFit === fit.id ? 'border-leather' : 'border-transparent'}`}>
                <img 
                  src={fit.image} 
                  alt={fit.title} 
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute bottom-4 left-4 text-white z-10">
                  <h3 className="text-2xl font-display font-bold uppercase tracking-wide drop-shadow-md">{fit.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">{fit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="sm:hidden mt-4 text-center">
            <button 
                onClick={() => onSelectFit('Todos')}
                className={`text-sm font-bold uppercase tracking-wider ${selectedFit === 'Todos' ? 'text-leather' : 'text-gray-500'}`}
            >
                Ver Todos
            </button>
        </div>
      </div>
    </section>
  );
};

export default FitGuide;