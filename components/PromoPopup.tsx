import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface PromoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PopupConfig {
  isActive: boolean;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  couponCode: string;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<PopupConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'promo_popup')
          .single();

        if (error) {
          console.warn('Popup config not found, using fallback or hiding.');
          return;
        }

        if (data) setConfig(data.value);
      } catch (err) {
        console.error('Error fetching popup config:', err);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (isOpen && config?.isActive) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, config]);

  if (!isOpen || !config || !config.isActive) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(config.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-denim-900/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative bg-white w-full max-w-3xl overflow-hidden shadow-2xl transform transition-all duration-700 ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-denim-900 transition-colors bg-white/50 rounded-full p-1"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image Side */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-200">
            <img
              src={config.imageUrl}
              alt="Promoção"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Mobile Overlay Title */}
            <div className="absolute inset-0 bg-gradient-to-t from-denim-900/90 to-transparent flex flex-col justify-end p-8 text-white md:hidden">
              <p className="font-display font-bold text-2xl uppercase" dangerouslySetInnerHTML={{ __html: config.title }} />
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left bg-white relative">
            <div className="mb-2 text-leather font-bold tracking-widest text-xs uppercase">{config.subtitle}</div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-denim-900 uppercase leading-none mb-4" dangerouslySetInnerHTML={{ __html: config.title }} />

            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              {config.description}
            </p>

            <div className="bg-concrete border border-gray-200 p-4 rounded-sm mb-6 relative group">
              <p className="text-xs text-gray-500 uppercase mb-1 text-center">Cupom de Desconto</p>
              <div
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 font-mono text-xl font-bold text-denim-900 cursor-pointer hover:text-leather transition-colors"
              >
                {config.couponCode}
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </div>
              {copied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-denim-900 text-white px-2 py-1 rounded">Copiado!</span>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-denim-black text-white py-4 font-bold uppercase tracking-widest hover:bg-leather transition-colors text-sm shadow-lg"
            >
              Resgatar Desconto Agora
            </button>

            <button
              onClick={onClose}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Não, obrigado. Prefiro pagar preço cheio.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;