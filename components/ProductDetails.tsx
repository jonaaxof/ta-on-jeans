
import React from 'react';
import { Product } from '../types';
import { ArrowLeft, Check, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-white pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-denim-900 transition-colors mb-6 text-sm font-medium uppercase tracking-wide"
        >
          <ArrowLeft size={16} className="mr-2" /> Voltar para o Catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Column */}
          <div className="space-y-4">
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
              <img 
                src={product.imageFront} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square w-full overflow-hidden bg-gray-100">
                <img 
                  src={product.imageBack} 
                  alt="Detail" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square w-full bg-gray-50 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
                 Detalhe do tecido (Zoom)
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div>
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 font-mono text-sm">{product.reference}</span>
                <span className="bg-leather text-white text-xs font-bold px-2 py-1 uppercase">Pronta Entrega</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-denim-900 uppercase mb-4">{product.title}</h1>
              
              <div className="flex items-end gap-4">
                <div className="text-3xl font-bold text-denim-900">
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  <span className="text-base font-normal text-gray-500 ml-1">/unidade</span>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  (Preço sugerido de revenda: {(product.price * 2.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>
              
              <div className="bg-concrete p-6 rounded-sm space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-denim-900 uppercase">Tecido:</span>
                  <span className="text-gray-700">{product.material}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-denim-900 uppercase">Modelagem:</span>
                  <span className="text-gray-700">{product.fit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-denim-900 uppercase">Lavagem:</span>
                  <span className="text-gray-700">{product.wash}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-display font-bold uppercase text-denim-900 mb-3">Grade Disponível</h3>
                <div className="border-2 border-denim-900 p-4 text-center">
                  <span className="block text-2xl font-bold text-denim-900 mb-1">{product.grade}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">Grade Padrão de Fábrica</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-denim-black text-white py-4 font-display font-bold uppercase text-lg hover:bg-leather transition-colors shadow-lg flex items-center justify-center gap-3"
              >
                <ShoppingBag size={20} /> Adicionar Grade ao Carrinho
              </button>
              <button 
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                className="w-full bg-[#25D366] text-white py-4 font-display font-bold uppercase text-lg hover:brightness-95 transition-colors shadow-lg"
              >
                Dúvidas no WhatsApp
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-denim-900 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm uppercase">Garantia de Qualidade</h4>
                  <p className="text-xs text-gray-500">Troca grátis para defeitos de fabricação.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="text-denim-900 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm uppercase">Envio Ágil</h4>
                  <p className="text-xs text-gray-500">Despacho em até 24h após pagamento.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
