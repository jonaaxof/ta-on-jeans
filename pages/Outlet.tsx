
import React from 'react';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types';

interface OutletProps {
    products: Product[];
}

const Outlet: React.FC<OutletProps> = ({ products }) => {
    const displayedProducts = products.filter(p => p.isOutlet === true);

    return (
        <main className="pt-10">
            <div className="bg-red-600 py-12 text-center text-white mb-8">
                <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter">
                    Outlet de Fábrica
                </h1>
                <p className="mt-4 text-lg font-light max-w-2xl mx-auto px-4">
                    Oportunidades únicas com preços abaixo do custo. Peças selecionadas para liquidação imediata.
                </p>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProductGrid
                    products={displayedProducts}
                    selectedFit={'Todos'}
                />
            </div>
        </main>
    );
};

export default Outlet;
