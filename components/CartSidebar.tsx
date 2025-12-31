import React from 'react';
import { X, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartSidebar: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();

  // Animation state to handle exit animations
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (isCartOpen) {
      setShouldRender(true);
      // Small delay to allow 'mounting' in closed state before animating open
      // This ensures the browser sees the opacity-0 -> opacity-100 transition
      const timer = setTimeout(() => setIsActive(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsActive(false);
      const timer = setTimeout(() => setShouldRender(false), 300); // Wait for transition out (300ms)
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  if (!shouldRender) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Construct WhatsApp Message
    const header = `Olá! Gostaria de cotar/negociar o seguinte pedido:\n\n`;

    const items = cart.map(item =>
      `- ${item.title} - ${item.quantity} unidades`
    ).join('\n');

    const total = `\n\nTotal estimado: ${cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

    const fullMessage = encodeURIComponent(header + items + total);

    // Replace with your actual WhatsApp number
    const phoneNumber = "5511999999999";
    window.open(`https://wa.me/${phoneNumber}?text=${fullMessage}`, '_blank');
  };

  return (
    <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        onClick={toggleCart}
      ></div>

      {/* Sidebar */}
      <div
        className={`relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isActive ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-denim-900 text-white">
          <h2 className="text-xl font-display font-bold uppercase tracking-wide">Seu Carrinho</h2>
          <button onClick={toggleCart} className="hover:text-leather transition-colors hover:rotate-90 duration-300 transform">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>Seu carrinho está vazio.</p>
              <button onClick={toggleCart} className="mt-4 text-leather font-bold underline hover:text-denim-900 transition-colors">
                Continuar Comprando
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-24 bg-gray-100 shrink-0 overflow-hidden relative group">
                  <img src={item.imageFront} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display font-bold text-denim-900 uppercase text-sm leading-tight pr-4">{item.title}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors hover:scale-110 transform">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-2">{item.reference}</p>
                  <p className="text-sm font-bold text-denim-900 mb-3">
                    {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Qtd (Grades):</span>
                    <div className="flex items-center border border-gray-300 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      >-</button>
                      <span className="px-2 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4 text-lg font-bold text-denim-900">
              <span>Total Estimado</span>
              <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">
              *O frete será calculado durante o atendimento no WhatsApp.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] text-white py-4 uppercase font-bold tracking-widest hover:brightness-95 shadow-lg flex items-center justify-center gap-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle size={20} /> Negociar no WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
