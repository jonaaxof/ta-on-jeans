
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Only used for register in this simplified flow if using password, but we use OTP for login usually. 
  // For this demo, let's assume simple password registration to avoid email confirmation complexities blocking the user immediately, 
  // although Supabase defaults to email confirmation.
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        const { error } = await signIn(email);
        if (error) throw error;
        setMessage('Verifique seu e-mail para o link de acesso (Magic Link)!');
      } else {
        const { error } = await signUp(email, password, name, phone);
        if (error) throw error;
        setMessage('Cadastro realizado! Verifique seu e-mail para confirmar.');
      }
    } catch (err: any) {
      setMessage(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAuthModal}></div>
      
      <div className="relative bg-white w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-400 hover:text-denim-900">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-display font-bold text-denim-900 mb-6 text-center uppercase">
          {mode === 'login' ? 'Acessar Conta' : 'Criar Cadastro'}
        </h2>

        {message && (
          <div className={`p-3 mb-4 text-sm font-medium ${message.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome da Loja / Responsável</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-gray-300 p-3 focus:outline-none focus:border-denim-900"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp</label>
                <input 
                  type="tel" 
                  required 
                  className="w-full border border-gray-300 p-3 focus:outline-none focus:border-denim-900"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">E-mail</label>
            <input 
              type="email" 
              required 
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-denim-900"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Senha</label>
              <input 
                type="password" 
                required 
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-denim-900"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-denim-900 text-white py-3 uppercase font-bold tracking-widest hover:bg-leather transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Enviar Link de Acesso' : 'Cadastrar Agora'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <p>
              Ainda não tem cadastro?{' '}
              <button onClick={() => { setMode('register'); setMessage(''); }} className="text-leather font-bold underline">
                Criar conta atacado
              </button>
            </p>
          ) : (
            <p>
              Já possui conta?{' '}
              <button onClick={() => { setMode('login'); setMessage(''); }} className="text-leather font-bold underline">
                Fazer login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
