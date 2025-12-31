
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';
import { Product } from '../types';

interface ProductPageProps {
    products: Product[];
}

const ProductPage: React.FC<ProductPageProps> = ({ products }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Produto não encontrado.</p>
                <button onClick={() => navigate('/')} className="ml-4 text-denim-900 underline">Voltar para Home</button>
            </div>
        );
    }

    return (
        <ProductDetails
            product={product}
            onBack={() => navigate(-1)}
        />
    );
};

export default ProductPage;
