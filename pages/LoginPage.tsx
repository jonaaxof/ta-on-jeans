
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { user, signIn } = useAuth();
    const navigate = useNavigate();

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginMessage('');
        try {
            // Using password login if password provided
            const { error } = await signIn(loginEmail, loginPassword);
            if (error) throw error;
            // Native auth change listener will redirect
        } catch (err: any) {
            setLoginMessage(err.message || 'Erro ao entrar.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleMagicLink = async () => {
        if (!loginEmail) {
            setLoginMessage('Digite seu e-mail para receber o código.');
            return;
        }
        setLoginLoading(true);
        setLoginMessage('');
        try {
            const { error } = await signIn(loginEmail); // No password = OTP
            if (error) throw error;
            setLoginMessage('Verifique seu e-mail para o link de acesso!');
        } catch (err: any) {
            setLoginMessage(err.message || 'Erro ao enviar código.');
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb - Mock */}
                <div className="text-xs text-gray-400 mb-8 uppercase tracking-wide">
                    Página Inicial / Login
                </div>

                <div className="max-w-md mx-auto">
                    <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-lg">
                        <h2 className="text-xl font-bold font-display text-gray-900 uppercase mb-6 tracking-wide text-center">
                            Acesse sua Conta
                        </h2>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-gray-500 text-sm mb-2">E-mail</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-gray-500 text-sm mb-2">Senha</label>
                                <input
                                    type={showLoginPassword ? "text" : "password"}
                                    className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                >
                                    {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <div className="text-right">
                                <a href="#" className="text-xs text-gray-500 hover:underline">Esqueci minha senha</a>
                            </div>

                            {loginMessage && (
                                <p className={`text-sm ${loginMessage.includes('Erro') ? 'text-red-500' : 'text-green-600'}`}>
                                    {loginMessage}
                                </p>
                            )}

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={loginLoading}
                                    className="w-full bg-black text-white font-bold text-sm uppercase p-4 hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
                                >
                                    {loginLoading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleMagicLink}
                                    className="w-full bg-white border border-black text-black font-bold text-sm uppercase p-4 hover:bg-gray-50 transition-colors"
                                >
                                    Receber código de acesso
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center border-t border-gray-100 pt-6">
                            <p className="text-sm text-gray-500 mb-4">Ainda não tem conta?</p>
                            <Link
                                to="/cadastro"
                                className="block w-full bg-gray-100 text-gray-800 font-bold text-sm uppercase p-4 hover:bg-gray-200 transition-colors rounded"
                            >
                                Quero Criar Uma Conta
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
