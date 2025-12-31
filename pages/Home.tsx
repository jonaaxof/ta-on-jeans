import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import ModernFitGuide from '../components/ModernFitGuide';
import ProductGrid from '../components/ProductGrid';
import QualitySection from '../components/QualitySection';
import BestSellersSection from '../components/BestSellersSection';
import { Product, FitType } from '../types';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface HomeProps {
  products: Product[];
  loading: boolean;
}

const Home: React.FC<HomeProps> = ({ products, loading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedFit = (searchParams.get('fit') as FitType) || 'Todos';

  const handleSelectFit = (fit: FitType) => {
    // Map fit to category
    let category = 'calca'; // default
    const fitLower = fit.toLowerCase();

    if (fitLower.includes('short')) category = 'shorts';
    else if (fitLower.includes('saia')) category = 'saia';
    else if (fitLower.includes('jaqueta')) category = 'jaqueta';
    else if (fitLower.includes('bermuda')) category = 'bermuda';
    else if (fitLower.includes('camiseta')) category = 'camiseta';
    else if (['skinny', 'mom', 'wide leg'].includes(fitLower)) category = 'calca';

    // Assume feminine for now as per tabs, or check if fit is strictly masculine
    // But since the current fit guide is mostly feminine/tab based, 
    // and "Masculino" tab fits are "Masculino", "Bermuda", "Camiseta"...
    let gender = 'feminino';
    if (['Masculino', 'Bermuda', 'Camiseta'].includes(fit)) {
      gender = 'masculino';
    }

    // Navigate
    navigate(`/colecao/${gender}/${category}?fit=${fit}`);
  };

  return (
    <main>
      <Hero />
      <ModernFitGuide selectedFit={selectedFit as FitType} onSelectFit={handleSelectFit} />
      <div id="product-grid-anchor">
        <ProductGrid
          products={products}
          selectedFit={selectedFit}
        />
      </div>
      {/* Banner / Quality Section */}
      <QualitySection />

      {/* Best Sellers Section */}
      <BestSellersSection products={products} />

      <div className="pb-12"></div>
    </main>
  );
};

export default Home;
