import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const ResalePage: React.FC = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        tax_id: '',
        state: '',
        city: '',
        found_via: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('resale_leads')
                .insert([formData]);

            if (error) throw error;
            setSubmitted(true);
        } catch (error: any) {
            alert('Erro ao enviar cadastro: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-denim-black flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-500 mb-4">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white uppercase italic">Cadastro Recebido!</h2>
                    <p className="text-gray-400">Excelente escolha. Nossa equipe de expansão entrará em contato com você via WhatsApp em breve para apresentar nossas condições exclusivas de atacado.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-[#B39359] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#967B4A] transition-colors"
                    >
                        Voltar para a Loja
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-denim-black pb-20">
            {/* Hero Section */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                    alt="B2B background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-denim-black/0 via-denim-black/60 to-denim-black" />

                <div className="relative text-center px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white uppercase italic tracking-tighter mb-4 animate-in slide-in-from-bottom-4 duration-700">
                        Seja um Revendedor <br />
                        <span className="text-[#B39359]">Tá On Jeans</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl font-light">Leve a melhor modelagem do Brasil para sua cidade com margens de lucro acima de 100%.</p>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4 -mt-10 relative z-10">
                <div className="bg-[#111111] p-8 md:p-12 rounded-xl shadow-2xl border border-white/5 shadow-[#B39359]/5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white mb-2 tracking-widest">Seu Nome <span className="text-red-500">*</span></label>
                            <input
                                required
                                className="w-full bg-[#1A1A1A] border border-white/10 text-white p-4 focus:border-[#B39359] outline-none transition-colors"
                                placeholder="Nome completo"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white mb-2 tracking-widest">Seu E-mail <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="email"
                                className="w-full bg-[#1A1A1A] border border-white/10 text-white p-4 focus:border-[#B39359] outline-none transition-colors"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white mb-2 tracking-widest">Seu Celular <span className="text-red-500">*</span></label>
                            <input
                                required
                                className="w-full bg-[#1A1A1A] border border-white/10 text-white p-4 focus:border-[#B39359] outline-none transition-colors"
                                placeholder="(00) 0 0000-0000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {/* CPF/CNPJ */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white mb-2 tracking-widest">Seu CPF/CNPJ <span className="text-red-500">*</span></label>
                            <input
                                required
                                className="w-full bg-[#1A1A1A] border border-white/10 text-white p-4 focus:border-[#B39359] outline-none transition-colors"
                                placeholder="000.000.000-00"
                                value={formData.tax_id}
                                onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
                            />
                        </div>

                        {/* State & City */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-white mb-2 tracking-widest">Seu Estado <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    className="w-full bg-[#1A1A1A] border border-white/10 text-white p-4 focus:border-[#B39359] outline-none transition-colors appearance-none"
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                >
                                    <option value="">Escolha...</option>
                                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-white mb-2 tracking-widest">Sua Cidade <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    className="w-full bg-[#1A1A1A] border border-white/10 text-white p-4 focus:border-[#B39359] outline-none transition-colors"
                                    placeholder="Ex: Goiânia"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* How they found us */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white mb-2 tracking-widest">Como nos conheceu? <span className="text-red-500">*</span></label>
                            <select
                                required
                                className="w-full bg-[#1A1A1A] border border-white/10 text-white p-4 focus:border-[#B39359] outline-none transition-colors appearance-none"
                                value={formData.found_via}
                                onChange={e => setFormData({ ...formData, found_via: e.target.value })}
                            >
                                <option value="">Escolha uma opção...</option>
                                <option value="instagram">Instagram</option>
                                <option value="facebook">Facebook</option>
                                <option value="google">Google</option>
                                <option value="indicacao">Indicação</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#B39359] text-white py-5 font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#967B4A] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 mt-8 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>ENVIAR CADASTRO <ArrowRight size={20} /></>}
                        </button>

                        <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">Ao enviar, você autoriza o contato de nossa equipe comercial.</p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResalePage;
