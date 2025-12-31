import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalPopupManager from './components/GlobalPopupManager';
import AuthModal from './components/AuthModal';
import CartSidebar from './components/CartSidebar';
import { PRODUCTS as MOCK_PRODUCTS } from './constants';
import { Product } from './types';
import { supabase } from './lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import Home from './pages/Home';
import Outlet from './pages/Outlet';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import Novidades from './pages/Novidades';
import ResalePage from './pages/ResalePage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import ProductionBoard from './pages/admin/ProductionBoard';
import SalesCRM from './pages/admin/SalesCRM';
import FinancialDashboard from './pages/admin/FinancialDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import BannerManagement from './pages/admin/BannerManagement';
import TeamManagement from './pages/admin/TeamManagement';
import PopupManagement from './pages/admin/PopupManagement';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          const formattedData: Product[] = data.map((item: any) => ({
            id: item.id,
            reference: item.reference,
            title: item.title,
            price: Number(item.price),
            fit: item.fit,
            wash: item.wash,
            imageFront: item.image_front || item.imageFront,
            imageBack: item.image_back || item.imageBack,
            isNew: item.is_new || item.isNew,
            isOutlet: item.is_outlet || item.isOutlet,
            description: item.description,
            material: item.material,
            grade: item.grade,
            gender: item.gender || (item.fit === 'Masculino' ? 'masculino' : 'feminino'),
            category: item.category || (() => {
              const fit = item.fit;
              const title = item.title?.toLowerCase() || '';
              if (fit === 'Shorts') return 'shorts';
              if (fit === 'Saia') return 'saia';
              if (fit === 'Jaqueta') return 'jaqueta';
              if (['Skinny', 'Mom', 'Wide Leg'].includes(fit)) return 'calca';
              if (title.includes('bermuda')) return 'bermuda';
              if (title.includes('camiseta')) return 'camiseta';
              return 'calca';
            })()
          }));
          setProducts(formattedData);
        }
      } catch (err: any) {
        console.error("Erro na conexão com Supabase:", err.message || err);
        // Only use mock data if specifically desired for dev, but let's disable for now
        // setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-denim-900" size={48} />
          <p className="font-display uppercase tracking-widest text-sm text-gray-500">Carregando Coleção...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />


          <Routes>
            {/* Public Routes - Wrapped in standard layout elements handled inside pages if needed or adding a Layout wrapper */}
            {/* Ideally we should have a MainLayout, but keeping it simple for now as requested */}
            <Route path="/" element={<><Header /><Home products={products} loading={loading} /><Footer /></>} />
            <Route path="/colecao/:gender/:category?" element={<><Header /><CategoryPage products={products} /><Footer /></>} />
            <Route path="/outlet" element={<><Header /><Outlet products={products} /><Footer /></>} />
            <Route path="/novidades" element={<><Header /><Novidades products={products} /><Footer /></>} />
            <Route path="/product/:id" element={<><Header /><ProductPage products={products} /><Footer /></>} />
            <Route path="/login" element={<><Header /><LoginPage /><Footer /></>} />
            <Route path="/cadastro" element={<><Header /><RegisterPage /><Footer /></>} />
            <Route path="/revenda" element={<ResalePage />} />

            {/* Admin Routes - Wrapped in AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<SalesCRM />} /> {/* Default to Sales */}
              <Route path="production" element={<ProductionBoard />} />
              <Route path="sales" element={<SalesCRM />} />
              <Route path="financial" element={<FinancialDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="banners" element={<BannerManagement />} />
              <Route path="team" element={<TeamManagement />} />
              <Route path="popup" element={<PopupManagement />} />
            </Route>
          </Routes>

          {/* Global Elements */}
          <GlobalPopupManager />
          <AuthModal />
          <CartSidebar />

        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
