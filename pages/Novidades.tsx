import React from 'react';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types';

interface NovidadesProps {
    products: Product[];
}

const Novidades: React.FC<NovidadesProps> = ({ products }) => {
    // Filter products marked as new
    const displayedProducts = products.filter(p => p.isNew === true);

    return (
        <main className="pt-10">
            <div className="bg-denim-900 py-12 text-center text-white mb-8">
                <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter">
                    Novidades
                </h1>
                <p className="mt-4 text-lg font-light max-w-2xl mx-auto px-4">
                    Confira as últimas tendências e lançamentos exclusivos da coleção.
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

export default Novidades;
