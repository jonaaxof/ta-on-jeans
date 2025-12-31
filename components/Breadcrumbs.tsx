import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Map to friendly names
    const friendlyNames: Record<string, string> = {
        'colecao': 'Coleção',
        'feminino': 'Feminino',
        'masculino': 'Masculino',
        'calca': 'Calças',
        'shorts': 'Shorts',
        'bermuda': 'Bermudas',
        'saia': 'Saias',
        'jaqueta': 'Jaquetas',
        'camiseta': 'Camisetas'
    };

    return (
        <nav className="flex text-xs text-gray-500 uppercase tracking-wide mb-6">
            <Link to="/" className="hover:text-denim-900 transition-colors">Página Inicial</Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const name = friendlyNames[value.toLowerCase()] || value;

                return (
                    <div key={to} className="flex items-center">
                        <ChevronRight size={14} className="mx-2" />
                        {isLast ? (
                            <span className="font-bold text-denim-900">{name}</span>
                        ) : (
                            <Link to={to} className="hover:text-denim-900 transition-colors">{name}</Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
