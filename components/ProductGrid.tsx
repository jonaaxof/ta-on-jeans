import React from 'react';
import { Product, FitType } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  selectedFit?: string;
  selectedGender?: string;
  selectedCategory?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, selectedFit, selectedGender, selectedCategory }) => {
  const filteredProducts = products.filter(p => {
    // 1. Filter by Gender (if specified)
    if (selectedGender && p.gender?.toLowerCase() !== selectedGender.toLowerCase()) return false;

    // 2. Filter by Category (if specified)
    if (selectedCategory && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;

    // 3. Filter by Fit (if specified and not 'Todos')
    if (selectedFit && selectedFit !== 'Todos' && p.fit !== selectedFit) return false;

    return true;
  });

  const getTitle = () => {
    let title = 'Catálogo Disponível';
    if (selectedGender) {
      title = selectedGender === 'feminino' ? 'Feminino' : 'Masculino';
      if (selectedCategory) {
        title += ` | ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`;
      }
      if (selectedFit && selectedFit !== 'Todos') {
        title += ` | ${selectedFit}`;
      }
    } else if (selectedFit && selectedFit !== 'Todos') {
      title = `Modelagem: ${selectedFit}`;
    }
    return title;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-display font-bold text-denim-900 uppercase">
            {getTitle()}
          </h2>
          <span className="text-gray-500 text-sm">{filteredProducts.length} Modelos</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Nenhum modelo encontrado com estes filtros.</p>
            <button className="mt-4 text-leather underline font-bold" onClick={() => window.location.href = '/'}>Limpar Filtros</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;