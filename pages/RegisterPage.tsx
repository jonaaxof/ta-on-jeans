import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const { user, signUp } = useAuth();
    const navigate = useNavigate();

    // Person Type State
    const [personType, setPersonType] = useState<'PF' | 'PJ'>('PF');

    // Common State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // PF State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cpf, setCpf] = useState('');

    // PJ State
    const [razaoSocial, setRazaoSocial] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [inscricaoEstadual, setInscricaoEstadual] = useState('');

    // Check if already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let fullName = '';
            let additionalData = {};

            if (personType === 'PF') {
                fullName = `${firstName} ${lastName}`.trim();
                additionalData = {
                    person_type: 'PF',
                    cpf,
                    first_name: firstName,
                    last_name: lastName
                };
            } else {
                fullName = razaoSocial; // Maps to standard 'name' for compatibility
                additionalData = {
                    person_type: 'PJ',
                    razao_social: razaoSocial,
                    nome_fantasia: nomeFantasia,
                    cnpj,
                    inscricao_estadual: inscricaoEstadual
                };
            }

            const { error } = await signUp(email, password, fullName, whatsapp, additionalData);
            if (error) throw error;
            setMessage('Cadastro realizado! Verifique seu e-mail.');
            // Optionally redirect after delay
            setTimeout(() => navigate('/login'), 3000);

        } catch (err: any) {
            setMessage(err.message || 'Erro ao cadastrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link to="/login" className="flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar para Login
                </Link>

                <h2 className="text-2xl font-bold font-display text-gray-900 uppercase mb-2 tracking-wide text-center">
                    Criar Nova Conta
                </h2>
                <p className="text-center text-gray-500 mb-10 text-sm">
                    Preencha seus dados abaixo para se cadastrar.
                </p>

                {/* Person Type Selector */}
                <div className="flex justify-center gap-4 mb-10">
                    <button
                        type="button"
                        onClick={() => setPersonType('PF')}
                        className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${personType === 'PF'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-black'
                            }`}
                    >
                        Pessoa Física
                    </button>
                    <button
                        type="button"
                        onClick={() => setPersonType('PJ')}
                        className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${personType === 'PJ'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-black'
                            }`}
                    >
                        Pessoa Jurídica
                    </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-6 bg-gray-50 p-8 rounded-lg border border-gray-100">

                    {/* PF FIELDS */}
                    {personType === 'PF' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-gray-700 text-xs font-bold uppercase mb-2">Nome*</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-xs font-bold uppercase mb-2">Sobrenome*</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-xs font-bold uppercase mb-2">CPF*</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={e => setCpf(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* PJ FIELDS */}
                    {personType === 'PJ' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-xs font-bold uppercase mb-2">Razão Social*</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    value={razaoSocial}
                                    onChange={e => setRazaoSocial(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-xs font-bold uppercase mb-2">Nome Fantasia*</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    value={nomeFantasia}
                                    onChange={e => setNomeFantasia(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-xs font-bold uppercase mb-2">CNPJ*</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    placeholder="00.000.000/0000-00"
                                    value={cnpj}
                                    onChange={e => setCnpj(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-xs font-bold uppercase mb-2">Inscrição Estadual</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                    value={inscricaoEstadual}
                                    onChange={e => setInscricaoEstadual(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* COMMON FIELDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-xs font-bold uppercase mb-2">E-mail*</label>
                            <input
                                type="email"
                                className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-xs font-bold uppercase mb-2">Senha*</label>
                            <input
                                type="password"
                                className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-xs font-bold uppercase mb-2">WhatsApp / Telefone*</label>
                            <input
                                type="tel"
                                className="w-full bg-white border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-black transition-colors"
                                value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded text-sm text-center ${message.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold text-sm uppercase p-4 hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Finalizar Cadastro'}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center leading-relaxed mt-4">
                        Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
