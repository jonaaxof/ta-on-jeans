import React, { useState } from 'react';
import { FITS } from '../constants';
import { FitType } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ModernFitGuideProps {
    selectedFit: FitType;
    onSelectFit: (fit: FitType) => void;
}

type TabType = 'FEMININO' | 'MASCULINO';

// Helper to filter fits by gender tab
// Note: In constants.ts, fits don't strictly have 'gender' property visible in the snippet I saw earlier of FitGuide usage, 
// but I know the structure. If FITS doesn't have gender, I'll have to infer or hardcode lists.
// Re-checking constants would be ideal, but for now I'll use text matching or IDs.
// Actually, I should use the known IDs from FITS.
// FEMININO: 'Skinny', 'Mom', 'Wide Leg', 'Shorts', 'Saia', 'Jaqueta'
// MASCULINO: 'Masculino' (The current mock only has one "Masculino" fit type covering everything? Or did I add more?)
// Let's assume standard lists for now and fallback to all if needed.

const FEMININO_IDS = ['Skinny', 'Mom', 'Wide Leg', 'Shorts', 'Saia', 'Jaqueta'];
const MASCULINO_IDS = ['Masculino', 'Bermuda', 'Camiseta'];
// Note: 'Bermuda' and 'Camiseta' might not be in FITS yet if I didn't add them. 
// I'll stick to what's in FITS or filtering FITS. 
// Let's filter FITS based on known keys.

const ModernFitGuide: React.FC<ModernFitGuideProps> = ({ selectedFit, onSelectFit }) => {
    const [activeTab, setActiveTab] = useState<TabType>('FEMININO');

    // Filter logic
    const filteredFits = FITS.filter(fit => {
        if (activeTab === 'FEMININO') {
            // Exclude explicit male items
            return !['Masculino', 'Bermuda', 'Camiseta'].includes(fit.id);
        } else if (activeTab === 'MASCULINO') {
            // Include only male
            return ['Masculino', 'Bermuda', 'Camiseta', 'Jaqueta'].includes(fit.id);
        } else {
            // Default to FEMININO if something breaks, but strictly we only have 2 tabs now.
            return true;
        }
    });

    const scrollLeft = () => {
        const container = document.getElementById('fit-scroll-container');
        if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        const container = document.getElementById('fit-scroll-container');
        if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                {/* Header */}
                <h2 className="text-2xl md:text-3xl font-display font-bold text-denim-900 uppercase tracking-widest mb-8">
                    Compre Por Modelagem
                </h2>

                {/* Tabs */}
                <div className="flex justify-center mb-10 border-b border-gray-200">
                    {(['FEMININO', 'MASCULINO'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-6 md:px-10 text-sm md:text-base font-bold uppercase tracking-widest transition-all relative
                        ${activeTab === tab ? 'text-leather' : 'text-gray-400 hover:text-gray-600'}
                    `}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-leather"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Carousel */}
                <div className="relative group px-8 md:px-12">

                    {/* Arrows */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 text-denim-900 hover:text-leather transition-colors hidden md:block"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 text-denim-900 hover:text-leather transition-colors hidden md:block"
                    >
                        <ChevronRight size={32} />
                    </button>


                    {/* Items Window */}
                    <div
                        id="fit-scroll-container"
                        className="overflow-x-auto pb-8 no-scrollbar scroll-smooth text-center px-12"
                    >
                        {/* Centering Wrapper */}
                        <div className="inline-flex gap-8 text-left">
                            {filteredFits.map((fit) => (
                                <div
                                    key={fit.id}
                                    className="flex-shrink-0 flex flex-col items-center cursor-pointer group w-32 md:w-40 snap-center"
                                    onClick={() => onSelectFit(fit.id)}
                                >
                                    {/* Circular Image */}
                                    <div
                                        className={`w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 mb-4 transition-all duration-300
                                ${selectedFit === fit.id ? 'border-leather ring-2 ring-leather/20' : 'border-transparent group-hover:border-gray-200'}
                            `}
                                    >
                                        <img
                                            src={fit.image}
                                            alt={fit.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-sm font-bold uppercase tracking-wide transition-colors ${selectedFit === fit.id ? 'text-leather' : 'text-gray-600 group-hover:text-denim-900'}`}>
                                        {fit.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ModernFitGuide;
