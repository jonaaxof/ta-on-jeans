import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import FitGuide from '../components/FitGuide';
import { Product, FitType } from '../types';

interface CategoryPageProps {
    products: Product[];
}

import Breadcrumbs from '../components/Breadcrumbs';
import FilterBar from '../components/FilterBar';

const CategoryPage: React.FC<CategoryPageProps> = ({ products }) => {
    const { gender, category } = useParams<{ gender: string; category: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedFit = (searchParams.get('fit') as FitType) || 'Todos';

    const handleSelectFit = (fit: FitType) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('fit', fit);
            return newParams;
        });
    };

    // Product Filtering Logic
    const filterProducts = (p: Product) => {
        // Case insensitive matching
        if (gender && p.gender?.toLowerCase() !== gender.toLowerCase()) return false;
        if (category && p.category?.toLowerCase() !== category.toLowerCase()) return false;
        if (selectedFit && selectedFit !== 'Todos' && p.fit !== selectedFit) return false;
        return true;
    };

    // Quick Count Helper 
    const filteredCount = products.filter(filterProducts).length;

    return (
        <main className="pt-8 pb-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />

                <div className="mb-6">
                    <h1 className="text-2xl font-display font-bold text-denim-900 uppercase">
                        {category}
                        <span className="block text-xs text-gray-500 font-sans font-normal mt-1 lowercase first-letter:uppercase">
                            {gender === 'feminino' ? 'Feminino' : 'Masculino'}
                        </span>
                    </h1>
                </div>

                <FilterBar
                    currentFit={selectedFit}
                    onFitChange={handleSelectFit}
                    resultCount={filteredCount}
                    gender={gender}
                    category={category}
                />

                <ProductGrid
                    products={products}
                    selectedFit={selectedFit}
                    selectedGender={gender}
                    selectedCategory={category}
                />
            </div>
        </main>
    );
};

export default CategoryPage;
