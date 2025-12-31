import React from 'react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BestSellersSectionProps {
    products: Product[];
}

const BestSellersSection: React.FC<BestSellersSectionProps> = ({ products }) => {
    const navigate = useNavigate();
    // Filter for best sellers... for now just take 4 items that are NOT new, or reverse order, or random.
    // Let's just take the last 4 items to simulate "Best Sellers".
    const bestSellers = [...products].reverse().slice(0, 4);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-denim-900 uppercase tracking-widest">
                            Mais Vendidos
                        </h2>
                        <p className="mt-2 text-gray-600">Os favoritos das nossas clientes</p>
                    </div>
                    <button
                        onClick={() => navigate('/colecao/feminino')}
                        className="hidden md:flex items-center gap-2 text-denim-900 border-b border-denim-900 pb-1 hover:text-leather hover:border-leather transition-colors font-medium uppercase tracking-wider text-sm"
                    >
                        Ver Coleção <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bestSellers.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white group cursor-pointer"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden mb-4">
                                <img
                                    src={product.imageFront}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-2 left-2 bg-leather text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                                    Best Seller
                                </div>
                            </div>
                            <div className="px-2 pb-4">
                                <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">{product.title}</h3>
                                <p className="text-gray-500 text-xs mb-2 mt-1">{product.fit} • {product.wash}</p>
                                <p className="font-medium text-denim-900">R$ {product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/colecao/feminino')}
                    className="w-full md:hidden mt-8 flex justify-center items-center gap-2 text-denim-900 border border-denim-900 py-3 font-medium uppercase tracking-wider text-sm hover:bg-denim-900 hover:text-white transition-colors"
                >
                    Ver Coleção
                </button>

            </div>
        </section>
    );
};

export default BestSellersSection;
