import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Package,
    Scissors,
    ShoppingBag,
    Users,
    BarChart3,
    LogOut,
    Home,
    MessageSquare,
    Image as ImageIcon,
    Tag
} from 'lucide-react';

const AdminLayout: React.FC = () => {
    const { user, userRole, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Protect Route
    React.useEffect(() => {
        if (!loading && userRole === 'customer') {
            navigate('/');
        }
    }, [userRole, loading, navigate]);

    // Define Menu Items with Role Permissions
    const menuItems = [
        // Moderator Features (Produção)
        {
            title: 'Fábrica',
            items: [
                { label: 'Produção (Kanban)', icon: Scissors, path: '/admin/production', roles: ['moderator', 'admin', 'owner'] },
                { label: 'Matéria-Prima', icon: Package, path: '/admin/inventory', roles: ['moderator', 'admin', 'owner'] },
            ]
        },
        // Admin Features (Loja e Vendas)
        {
            title: 'Loja',
            items: [
                { label: 'CRM de Vendas', icon: MessageSquare, path: '/admin/sales', roles: ['admin', 'owner'] },
                { label: 'Produtos', icon: ShoppingBag, path: '/admin/products', roles: ['admin', 'owner'] },
                { label: 'Banners Site', icon: ImageIcon, path: '/admin/banners', roles: ['admin', 'owner'] },
                { label: 'Popup Promocional', icon: Tag, path: '/admin/popup', roles: ['admin', 'owner'] },
            ]
        },
        // Owner Features (Gestão)
        {
            title: 'Gestão',
            items: [
                { label: 'Financeiro', icon: BarChart3, path: '/admin/financial', roles: ['owner'] },
                { label: 'Equipe', icon: Users, path: '/admin/team', roles: ['owner'] },
            ]
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10 transition-all duration-300">
                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                    <span className="text-xl font-bold text-white tracking-tight">DENIM<span className="text-blue-500">ADMIN</span></span>
                </div>

                {/* User Snippet */}
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{user?.name || 'Usuario'}</p>
                            <p className="text-xs text-blue-400 capitalize">{userRole}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                    {menuItems.map((section, idx) => {
                        // Filter items based on role
                        const visibleItems = section.items.filter(item => item.roles.includes(userRole));

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={idx}>
                                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{section.title}</h3>
                                <div className="space-y-1">
                                    {visibleItems.map((item) => {
                                        const isActive = location.pathname === item.path;
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${isActive
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'hover:bg-slate-800 hover:text-white'
                                                    }`}
                                            >
                                                <Icon size={18} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <Home size={18} />
                        <span className="text-sm">Ir para Loja</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:text-white hover:bg-red-500/20 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
