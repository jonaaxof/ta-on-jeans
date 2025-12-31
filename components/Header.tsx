
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FitType } from '../types';

import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'feminino' | 'masculino' | null>(null);

  const { toggleCart, cartCount } = useCart();
  const { user, userRole, openAuthModal, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();

  const handleNavClick = (view: 'home' | 'outlet' | 'category' | 'novidades', params?: { gender?: string; category?: string; fit?: string }) => {
    if (view === 'outlet') {
      navigate('/outlet');
    } else if (view === 'novidades') {
      navigate('/novidades');
    } else if (view === 'category' && params?.gender) {
      let url = `/colecao/${params.gender}`;
      if (params.category) {
        url += `/${params.category}`;
      }
      if (params.fit && params.fit !== 'Todos') {
        url += `?fit=${params.fit}`;
      }
      navigate(url);
    } else {
      // Home or fallback
      if (params?.fit && params.fit !== 'Todos') {
        navigate(`/?fit=${params.fit}`);
      } else {
        navigate('/');
      }
    }
    setActiveMenu(null);
    setMobileMenuOpen(false);
  };

  const FEMININO_ITEMS = [
    { label: 'Calças', category: 'calca' },
    { label: 'Calças Premium', category: 'calca', fit: 'Wide Leg' },
    { label: 'Calças Básicas', category: 'calca', fit: 'Skinny' },
    { label: 'Calças Comfort', category: 'calca', fit: 'Mom' },
    { label: 'Shorts e Bermudas', category: 'shorts' },
    { label: 'Saias e Minissaias', category: 'saia' },
    { label: 'Jaquetas / Coletes', category: 'jaqueta' },
  ];

  const MASCULINO_ITEMS = [
    { label: 'Calças Jeans', category: 'calca' },
    { label: 'Bermudas', category: 'bermuda' },
    { label: 'Jaquetas', category: 'jaqueta' },
    { label: 'Camisetas', category: 'camiseta' },
  ];

  return (
    <>
      <div className="bg-denim-black text-white text-xs font-medium tracking-wide text-center py-2 px-4 uppercase font-display">
        Atacado de Fábrica | Pedido Mínimo: 12 peças | Enviamos para todo o Brasil
      </div>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 py-5'
          }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-denim-900">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="text-2xl md:text-3xl font-bold font-display tracking-tighter text-denim-900 cursor-pointer italic z-50 relative"
            >
              TÁ ON JEANS
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 text-sm font-semibold tracking-wide text-gray-700 uppercase h-full items-center">

              {/* FEMININO DROPDOWN */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveMenu('feminino')}
              >
                <button
                  onClick={() => handleNavClick('category', { gender: 'feminino' })}
                  className={`hover:text-denim-900 transition-colors py-2 flex items-center gap-1 ${activeMenu === 'feminino' ? 'text-denim-900' : ''}`}
                >
                  Feminino
                </button>

                {/* Mega Menu Dropdown */}
                {activeMenu === 'feminino' && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-xl border-t-2 border-denim-900 pt-2 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="flex flex-col">
                      {FEMININO_ITEMS.map((item, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => handleNavClick('category', { gender: 'feminino', category: item.category, fit: item.fit })}
                            className="w-full text-left px-6 py-2 text-xs font-bold text-gray-600 hover:text-denim-900 hover:bg-gray-50 transition-colors uppercase"
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* MASCULINO DROPDOWN */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveMenu('masculino')}
              >
                <button
                  onClick={() => handleNavClick('category', { gender: 'masculino' })}
                  className={`hover:text-denim-900 transition-colors py-2 flex items-center gap-1 ${activeMenu === 'masculino' ? 'text-denim-900' : ''}`}
                >
                  Masculino
                </button>

                {activeMenu === 'masculino' && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-xl border-t-2 border-denim-900 pt-2 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="flex flex-col">
                      {MASCULINO_ITEMS.map((item, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => handleNavClick('category', { gender: 'masculino', category: item.category })}
                            className="w-full text-left px-6 py-2 text-xs font-bold text-gray-600 hover:text-denim-900 hover:bg-gray-50 transition-colors uppercase"
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick('novidades')}
                className="hover:text-denim-900 transition-colors uppercase font-bold"
              >
                Novidades
              </button>

              <button
                onClick={() => handleNavClick('outlet')}
                className="text-red-600 font-bold uppercase hover:text-red-800 transition-colors"
              >
                Outlet
              </button>

              <Link to="/revenda" className="hover:text-denim-900 transition-colors uppercase font-bold">Revender</Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-5 text-denim-900">
              <Search size={20} className="cursor-pointer hover:text-leather transition-colors hidden sm:block" />

              {['moderator', 'admin', 'owner'].includes(userRole) && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-1 font-bold uppercase text-xs hover:text-leather transition-colors text-denim-900"
                  title="Painel Administrativo"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">CRM</span>
                </button>
              )}

              {user ? (
                <button
                  className="flex items-center gap-2 cursor-pointer hover:text-leather transition-colors hidden sm:flex group"
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                >
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-gray-500 leading-none group-hover:text-leather transition-colors">Olá, {user.name?.split(' ')[0] || 'Cliente'}</p>
                    <p className="text-xs font-bold uppercase leading-none">Sair</p>
                  </div>
                  <LogOut size={18} />
                </button>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-leather transition-colors hidden sm:flex"
                  onClick={() => navigate('/login')}
                >
                  <User size={20} />
                  <span className="text-xs font-bold uppercase">Entrar</span>
                </div>
              )}

              <div
                className="relative cursor-pointer hover:text-leather transition-colors"
                onClick={toggleCart}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-leather text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 px-4 flex flex-col space-y-4 max-h-[80vh] overflow-y-auto">

            {/* Mobile Feminino Section */}
            <div className="border-b border-gray-100 pb-2">
              <p className="text-sm font-bold text-denim-900 uppercase mb-2">Feminino</p>
              <div className="pl-4 space-y-2 flex flex-col">
                {FEMININO_ITEMS.map((item, idx) => (
                  <button key={idx} onClick={() => handleNavClick('category', { gender: 'feminino', category: item.category, fit: item.fit })} className="text-left text-sm text-gray-600">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Masculino Section */}
            <div className="border-b border-gray-100 pb-2">
              <p className="text-sm font-bold text-denim-900 uppercase mb-2">Masculino</p>
              <div className="pl-4 space-y-2 flex flex-col">
                {MASCULINO_ITEMS.map((item, idx) => (
                  <button key={idx} onClick={() => handleNavClick('category', { gender: 'masculino', category: item.category })} className="text-left text-sm text-gray-600">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="text-lg font-display font-medium text-red-600 text-left uppercase"
              onClick={() => handleNavClick('outlet')}
            >
              Outlet (Promoção)
            </button>

            <div className="border-t pt-4">
              {user ? (
                <button onClick={async () => { await signOut(); navigate('/'); setMobileMenuOpen(false); }} className="text-lg font-display font-medium text-red-500 w-full text-left">Sair</button>
              ) : (
                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-lg font-display font-medium text-denim-900 w-full text-left">Minha Conta / Entrar</button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
