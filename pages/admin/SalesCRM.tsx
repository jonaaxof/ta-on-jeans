import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, Filter, Plus, Edit, Trash2, Eye, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

type CRMStatus = 'novo_lead' | 'em_negociacao' | 'aguardando_pagto' | 'pago' | 'enviado';

interface CRMOrder {
    id: number;
    customer_name: string;
    customer_phone: string;
    items_summary: string;
    total_amount: number;
    status: CRMStatus;
    created_at: string;
}

const STATUS_MAP: Record<CRMStatus, { label: string, color: string }> = {
    novo_lead: { label: 'Novo Lead', color: 'bg-blue-100 text-blue-700' },
    em_negociacao: { label: 'Em Negociação', color: 'bg-yellow-100 text-yellow-700' },
    aguardando_pagto: { label: 'Aguardando Pagto', color: 'bg-orange-100 text-orange-700' },
    pago: { label: 'Pago', color: 'bg-green-100 text-green-700' },
    enviado: { label: 'Enviado', color: 'bg-purple-100 text-purple-700' },
};

const SalesCRM: React.FC = () => {
    const [orders, setOrders] = useState<CRMOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Partial<CRMOrder>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('crm_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                customer_name: currentOrder.customer_name,
                customer_phone: currentOrder.customer_phone,
                items_summary: currentOrder.items_summary,
                total_amount: Number(currentOrder.total_amount),
                status: currentOrder.status || 'novo_lead'
            };

            if (currentOrder.id) {
                const { error } = await supabase.from('crm_orders').update(payload).eq('id', currentOrder.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('crm_orders').insert([payload]);
                if (error) throw error;
            }

            await fetchOrders();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir este pedido?')) return;
        const { error } = await supabase.from('crm_orders').delete().eq('id', id);
        if (!error) fetchOrders();
    };

    const resetForm = () => {
        setCurrentOrder({ status: 'novo_lead' });
    };

    const openWhatsApp = (phone: string) => {
        if (!phone) {
            alert('Cliente sem telefone cadastrado.');
            return;
        }
        // Clean number
        let clean = phone.replace(/\D/g, ''); // remove non-digits

        // Basic Check: if it doesn't start with 55 and seems to be mobile (10-11 digits), prepend 55
        if (clean.length >= 10 && clean.length <= 11) {
            clean = '55' + clean;
        }

        window.open(`https://wa.me/${clean}`, '_blank');
    };

    const filteredOrders = orders.filter(o =>
        o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toString().includes(searchTerm)
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">CRM de Vendas</h1>
                    <p className="text-slate-500">Gestão de leads e pedidos via WhatsApp.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Novo Pedido Manual
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar cliente ou pedido (#ID)..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pedido</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Itens</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum pedido encontrado.</td></tr>
                        ) : (
                            filteredOrders.map((order) => {
                                const status = STATUS_MAP[order.status] || STATUS_MAP.novo_lead;
                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-bold text-slate-700">#{order.id}</span>
                                            <p className="text-xs text-slate-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {order.customer_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-slate-800 block">{order.customer_name}</span>
                                                    <span className="text-xs text-gray-400">{order.customer_phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 truncate max-w-[200px]" title={order.items_summary}>{order.items_summary}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-800">
                                            R$ {Number(order.total_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openWhatsApp(order.customer_phone)}
                                                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    title="Conversar no WhatsApp"
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { setCurrentOrder(order); setIsModalOpen(true); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">{currentOrder.id ? 'Editar Pedido' : 'Novo Pedido Manual'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome do Cliente</label>
                                <input required className="w-full p-2 border rounded" value={currentOrder.customer_name || ''} onChange={e => setCurrentOrder({ ...currentOrder, customer_name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp / Telefone</label>
                                <input required className="w-full p-2 border rounded" placeholder="11999999999" value={currentOrder.customer_phone || ''} onChange={e => setCurrentOrder({ ...currentOrder, customer_phone: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Total (R$)</label>
                                    <input required type="number" step="0.01" className="w-full p-2 border rounded" value={currentOrder.total_amount || ''} onChange={e => setCurrentOrder({ ...currentOrder, total_amount: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                                    <select className="w-full p-2 border rounded bg-white" value={currentOrder.status || 'novo_lead'} onChange={e => setCurrentOrder({ ...currentOrder, status: e.target.value as CRMStatus })}>
                                        <option value="novo_lead">Novo Lead</option>
                                        <option value="em_negociacao">Em Negociação</option>
                                        <option value="aguardando_pagto">Aguardando Pagamento</option>
                                        <option value="pago">Pago</option>
                                        <option value="enviado">Enviado</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Resumo dos Itens</label>
                                <textarea className="w-full p-2 border rounded" rows={3} value={currentOrder.items_summary || ''} onChange={e => setCurrentOrder({ ...currentOrder, items_summary: e.target.value })} placeholder="Ex: 2x Calça Jeans, 1x Jaqueta..." />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 shadow-sm flex items-center gap-2">
                                    <Save size={18} /> Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesCRM;
