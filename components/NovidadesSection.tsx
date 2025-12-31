import React from 'react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface NovidadesSectionProps {
    products: Product[];
}

const NovidadesSection: React.FC<NovidadesSectionProps> = ({ products }) => {
    const navigate = useNavigate();
    // Filter new products and take the first 4
    const newProducts = products.filter(p => p.isNew).slice(0, 4);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-denim-900 uppercase tracking-widest">
                            Novidades
                        </h2>
                        <p className="mt-2 text-gray-600">Confira os últimos lançamentos</p>
                    </div>
                    <button
                        onClick={() => navigate('/novidades')}
                        className="hidden md:flex items-center gap-2 text-denim-900 border-b border-denim-900 pb-1 hover:text-leather hover:border-leather transition-colors font-medium uppercase tracking-wider text-sm"
                    >
                        Ver Tudo <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {newProducts.map((product) => (
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
                                <div className="absolute top-2 left-2 bg-denim-900 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                                    Novo
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
                    onClick={() => navigate('/novidades')}
                    className="w-full md:hidden mt-8 flex justify-center items-center gap-2 text-denim-900 border border-denim-900 py-3 font-medium uppercase tracking-wider text-sm hover:bg-denim-900 hover:text-white transition-colors"
                >
                    Ver Tudo
                </button>

            </div>
        </section>
    );
};

export default NovidadesSection;
