import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Fallback image in case the main URL fails
  const fallbackImage = "https://images.unsplash.com/photo-1542272617-08f08637533d?auto=format&fit=crop&q=80&w=800";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  return (
    <div
      className="group flex flex-col"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div
        className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100 mb-4 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.imageFront}
          alt={product.title}
          onError={handleImageError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src={product.imageBack}
          alt={`${product.title} Back`}
          onError={handleImageError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />

        {product.isNew && (
          <span className="absolute top-2 left-2 bg-leather text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">
            Lançamento
          </span>
        )}

        {/* Quick Add Button */}
        <button className="absolute bottom-0 left-0 w-full bg-white/95 text-denim-900 py-3 font-bold uppercase text-xs tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 hover:bg-denim-black hover:text-white z-10 shadow-lg">
          <Plus size={14} /> Ver Detalhes
        </button>
      </div>

      <div className="flex flex-col cursor-pointer">
        <div className="flex justify-between items-start">
          <span className="text-xs text-gray-400 font-mono mb-1">{product.reference}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-1 rounded">Atacado</span>
        </div>
        <h3 className="text-base font-medium text-denim-900 font-display uppercase tracking-tight group-hover:text-leather transition-colors">{product.title}</h3>
        <span className="text-denim-900 font-bold text-lg mt-1">
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <span className="text-xs font-normal text-gray-500">/peça</span>
        </span>
      </div>
    </div>
  );
};

export default ProductCard;