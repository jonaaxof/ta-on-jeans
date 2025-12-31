import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { FitType } from '../types';

interface FilterBarProps {
    currentFit: FitType;
    onFitChange: (fit: FitType) => void;
    resultCount: number;
    gender?: string;
    category?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFit, onFitChange, resultCount, gender, category }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    const getAvailableFits = (): FitType[] => {
        const allFits: FitType[] = ['Todos', 'Skinny', 'Mom', 'Wide Leg', 'Shorts', 'Saia', 'Jaqueta', 'Masculino'];

        // If specific category is selected, filter relevant fits
        if (category) {
            const cat = category.toLowerCase();
            if (cat === 'calca') {
                if (gender?.toLowerCase() === 'masculino') {
                    return ['Todos']; // Add specific male fits if/when available e.g. 'Slim', 'Regular'
                }
                return ['Todos', 'Skinny', 'Mom', 'Wide Leg'];
            }
            if (cat === 'shorts' || cat === 'bermuda') {
                return ['Todos']; // 'Shorts' fit is redundant if category is shorts
            }
            if (cat === 'saia') {
                return ['Todos'];
            }
            if (cat === 'jaqueta') {
                return ['Todos'];
            }
        }

        // Default filter based on gender if no category or unknown category
        if (gender?.toLowerCase() === 'feminino') {
            return allFits.filter(f => f !== 'Masculino');
        }

        if (gender?.toLowerCase() === 'masculino') {
            return ['Todos', 'Masculino'];
        }

        return allFits;
    };

    const FITS = getAvailableFits();

    return (
        <div className="border-t border-b border-gray-200 py-3 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Filters Group */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4">

                    {/* MODELO / FIT FILTER - FUNCTIONAL */}
                    {FITS.length > 1 && (
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('modelo')}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border ${openDropdown === 'modelo' ? 'border-denim-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'} transition-colors`}
                            >
                                <span>Modelo: {currentFit === 'Todos' ? 'Todos' : currentFit}</span>
                                <ChevronDown size={14} className={`transition-transform ${openDropdown === 'modelo' ? 'rotate-180' : ''}`} />
                            </button>

                            {openDropdown === 'modelo' && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-xl z-50 py-2">
                                    {FITS.map(fit => (
                                        <button
                                            key={fit}
                                            onClick={() => { onFitChange(fit); setOpenDropdown(null); }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentFit === fit ? 'font-bold text-denim-900' : 'text-gray-600'}`}
                                        >
                                            {fit === 'Todos' ? 'Ver Todos' : fit}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PREÇO - MOCK */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 uppercase border border-gray-100 cursor-not-allowed" title="Em breve">
                            <span>Preço</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* CORES - MOCK */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 uppercase border border-gray-100 cursor-not-allowed" title="Em breve">
                            <span>Cores</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* TAMANHOS - MOCK */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 uppercase border border-gray-100 cursor-not-allowed" title="Em breve">
                            <span>Tamanhos</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Right Side: Results & Label */}
                <div className="flex items-center justify-between md:justify-end gap-6 text-xs text-gray-500 uppercase font-medium">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-denim-900">
                        <span>Ordenação Padrão</span>
                        <ChevronDown size={14} />
                    </div>
                    <span>{resultCount} Produtos</span>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
