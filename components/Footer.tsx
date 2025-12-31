import React from 'react';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-concrete p-10 md:p-16 text-center">
            <h3 className="text-3xl font-display font-bold uppercase text-denim-900 mb-4">
                Lista VIP de Revendedores
            </h3>
            <p className="text-gray-600 mb-8">Receba catálogo atualizado e ofertas exclusivas de atacado no seu e-mail.</p>
            <div className="max-w-md mx-auto flex">
                <input 
                    type="email" 
                    placeholder="E-mail da sua loja" 
                    className="flex-1 bg-white border border-gray-300 px-4 py-3 focus:outline-none focus:border-denim-900 text-sm"
                />
                <button className="bg-denim-black text-white px-6 py-3 hover:bg-leather transition-colors">
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
            <div className="text-2xl font-display font-bold uppercase tracking-tighter text-denim-900 mb-6 italic">TÁ ON JEANS</div>
            <p className="text-sm text-gray-500 leading-relaxed">
                Somos parceiros do seu negócio. Jeans direto da fábrica com modelagem premium e preço competitivo para você lucrar mais.
            </p>
        </div>
        <div>
            <h4 className="font-display font-bold uppercase text-sm mb-6 tracking-widest">Catálogo</h4>
            <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-denim-900">Lançamentos</a></li>
                <li><a href="#" className="hover:text-denim-900">Kits Promocionais</a></li>
                <li><a href="#" className="hover:text-denim-900">Grade Fechada</a></li>
                <li><a href="#" className="hover:text-denim-900">Mais Vendidos</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-display font-bold uppercase text-sm mb-6 tracking-widest">Atendimento</h4>
            <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-denim-900">Rastrear Pedido</a></li>
                <li><a href="#" className="hover:text-denim-900">Política de Atacado</a></li>
                <li><a href="#" className="hover:text-denim-900">Tabela de Medidas</a></li>
                <li><a href="#" className="hover:text-denim-900">Fale no WhatsApp</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-display font-bold uppercase text-sm mb-6 tracking-widest">Redes</h4>
            <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-concrete flex items-center justify-center rounded-full hover:bg-denim-black hover:text-white transition-colors">
                    <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-concrete flex items-center justify-center rounded-full hover:bg-denim-black hover:text-white transition-colors">
                    <Facebook size={18} />
                </a>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <p>&copy; 2025 Tá On Jeans. CNPJ 11.565.499/0001-09</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Política de Privacidade</span>
            <span>Termos de Compra</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;