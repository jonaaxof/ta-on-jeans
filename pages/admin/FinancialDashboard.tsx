import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Plus, ArrowUpRight, ArrowDownRight, X, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
}

const FinancialDashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTx, setNewTx] = useState<Partial<Transaction>>({
        type: 'income',
        date: new Date().toISOString().split('T')[0]
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('financial_transactions')
            .select('*')
            .order('date', { ascending: false })
            .order('created_at', { ascending: false });

        if (data) setTransactions(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (!newTx.amount || isNaN(newTx.amount)) {
                throw new Error('Por favor, insira um valor válido.');
            }
            const { error } = await supabase.from('financial_transactions').insert([newTx]);
            if (error) throw error;

            await fetchTransactions();
            setIsModalOpen(false);
            setNewTx({ type: 'income', date: new Date().toISOString().split('T')[0] });
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir transação?')) return;
        const { error } = await supabase.from('financial_transactions').delete().eq('id', id);
        if (!error) fetchTransactions();
    };

    // Calculations
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const margin = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Financeiro</h1>
                    <p className="text-slate-500">Gestão completa de entradas e saídas.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-denim-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-denim-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Nova Transação
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            Entradas
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Receita Total</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">
                        R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <CreditCard size={24} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            Saídas
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Despesas Total</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">
                        R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                            {balance >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                        </div>
                        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${balance >= 0 ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50'}`}>
                            Margem {margin}%
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Saldo Líquido</p>
                    <h3 className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                        R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Transações Recentes</h3>
                <div className="space-y-4">
                    {transactions.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Nenhuma transação registrada.</p>
                    ) : (
                        transactions.map((t) => (
                            <div key={t.id} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0 hover:bg-slate-50 transition-colors p-2 rounded">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{t.description}</p>
                                        <div className="flex gap-2 text-xs text-slate-400">
                                            <span>{t.date.split('-').reverse().join('/')}</span>
                                            <span>•</span>
                                            <span className="capitalize">{t.category}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`font-mono font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                    <button onClick={() => handleDelete(t.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Nova Transação</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="flex gap-4">
                                <label className={`flex-1 cursor-pointer border rounded p-3 text-center font-bold transition-all ${newTx.type === 'income' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500'}`}>
                                    <input type="radio" className="hidden" name="type" onClick={() => setNewTx({ ...newTx, type: 'income' })} />
                                    Entrada
                                </label>
                                <label className={`flex-1 cursor-pointer border rounded p-3 text-center font-bold transition-all ${newTx.type === 'expense' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500'}`}>
                                    <input type="radio" className="hidden" name="type" onClick={() => setNewTx({ ...newTx, type: 'expense' })} />
                                    Saída
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrição</label>
                                <input required className="w-full p-2 border rounded" value={newTx.description || ''} onChange={e => setNewTx({ ...newTx, description: e.target.value })} placeholder="Ex: Venda, Pagamento Luz..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Valor (R$)</label>
                                    <input required type="number" step="0.01" className="w-full p-2 border rounded" value={newTx.amount || ''} onChange={e => {
                                        const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                        setNewTx({ ...newTx, amount: val });
                                    }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Data</label>
                                    <input type="date" className="w-full p-2 border rounded" value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Categoria</label>
                                <input className="w-full p-2 border rounded" value={newTx.category || ''} onChange={e => setNewTx({ ...newTx, category: e.target.value })} placeholder="Ex: Vendas, Marketing, Impostos..." />
                            </div>

                            <button type="submit" disabled={saving} className="w-full bg-denim-900 text-white font-bold py-3 rounded hover:bg-denim-800">
                                {saving ? 'Salvando...' : 'Registrar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialDashboard;
