import React, { useState, useEffect } from 'react';
import { Package, Clock, Plus, ArrowRight, ArrowLeft, Trash2, X, AlertOctagon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// Type definitions matching DB
type Priority = 'low' | 'normal' | 'high';
type Stage = 'corte' | 'costura' | 'lavanderia' | 'acabamento' | 'quality' | 'concluido';

interface ProductionOrder {
    id: string; // e.g. L-101
    product_name: string;
    quantity: number;
    stage: Stage;
    priority: Priority;
    start_date: string;
    notes?: string;
}

const STAGES: { id: Stage; label: string; color: string }[] = [
    { id: 'corte', label: 'Corte', color: 'border-blue-500' },
    { id: 'costura', label: 'Costura', color: 'border-yellow-500' },
    { id: 'lavanderia', label: 'Lavanderia', color: 'border-indigo-500' },
    { id: 'acabamento', label: 'Acabamento', color: 'border-purple-500' },
    { id: 'quality', label: 'Qualidade', color: 'border-green-500' },
];

const ProductionBoard: React.FC = () => {
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOrder, setNewOrder] = useState<Partial<ProductionOrder>>({
        priority: 'normal',
        stage: 'corte',
        start_date: new Date().toISOString().split('T')[0]
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('production_orders')
            .select('*')
            .neq('stage', 'concluido') // Don't show completed in main board? Or maybe yes. Let's filter out 'concluido' for now or show as last col.
            .order('created_at', { ascending: false });

        if (data) setOrders(data as any);
        setLoading(false);
    };

    const updateStage = async (orderId: string, newStage: Stage) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, stage: newStage } : o));

        const { error } = await supabase
            .from('production_orders')
            .update({ stage: newStage })
            .eq('id', orderId);

        if (error) {
            console.error(error);
            fetchOrders(); // Revert on error
        }
    };

    const moveStage = async (orderId: string, currentStage: Stage, direction: 'next' | 'prev') => {
        const stageOrder: Stage[] = ['corte', 'costura', 'lavanderia', 'acabamento', 'quality', 'concluido'];
        const currentIndex = stageOrder.indexOf(currentStage);

        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex < 0 || newIndex >= stageOrder.length) return;

        updateStage(orderId, stageOrder[newIndex]);
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, orderId: string) => {
        setDraggedOrderId(orderId);
        e.dataTransfer.effectAllowed = 'move';
        // Transparent drag image hack if needed, but default is usually fine
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetStage: Stage) => {
        e.preventDefault();
        if (draggedOrderId) {
            updateStage(draggedOrderId, targetStage);
            setDraggedOrderId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir ordem de produção?')) return;
        setOrders(prev => prev.filter(o => o.id !== id));
        await supabase.from('production_orders').delete().eq('id', id);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Auto generate ID if not present? Or let user type.
            // Let's generate a random L-ID if empty
            const id = newOrder.id || `L-${Math.floor(Math.random() * 9000) + 1000}`;

            const payload = { ...newOrder, id };
            const { error } = await supabase.from('production_orders').insert([payload]);
            if (error) throw error;

            await fetchOrders();
            setIsModalOpen(false);
            setNewOrder({ priority: 'normal', stage: 'corte', start_date: new Date().toISOString().split('T')[0] });
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const getPriorityColor = (p: string) => {
        if (p === 'high') return 'bg-red-100 text-red-700';
        if (p === 'low') return 'bg-gray-100 text-gray-700';
        return 'bg-blue-100 text-blue-700';
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quadro de Produção</h1>
                    <p className="text-slate-500">Arraste os cards para mover entre as etapas</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-denim-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-denim-800"
                >
                    <Plus size={18} /> Nova Ordem
                </button>
            </div>

            {/* Use full height and overflow for horizontal scrolling */}
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 min-w-max pb-4 h-full">
                    {STAGES.map((stage) => {
                        const stageBatches = orders.filter(b => b.stage === stage.id);
                        return (
                            <div
                                key={stage.id}
                                className="w-[300px] flex flex-col bg-slate-100 rounded-lg p-3 h-full max-h-[calc(100vh-200px)] transition-colors hover:bg-slate-200/50"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stage.id)}
                            >
                                {/* Header */}
                                <div className={`flex justify-between items-center mb-3 pl-3 border-l-4 ${stage.color}`}>
                                    <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wide">{stage.label}</h3>
                                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-bold">{stageBatches.length}</span>
                                </div>

                                {/* Cards Container - Scrollable vertically */}
                                <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                                    {stageBatches.map((batch) => (
                                        <div
                                            key={batch.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, batch.id)}
                                            className={`bg-white p-4 rounded shadow-sm border border-slate-200 group cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${draggedOrderId === batch.id ? 'opacity-50' : 'opacity-100'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-mono text-xs text-slate-400 font-bold">{batch.id}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityColor(batch.priority)}`}>
                                                        {batch.priority === 'high' ? 'Urgente' : batch.priority === 'low' ? 'Baixa' : 'Normal'}
                                                    </span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(batch.id); }} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <h4 className="text-sm font-bold text-slate-800 mb-2 leading-tight">{batch.product_name}</h4>

                                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Package size={14} />
                                                    <span>{batch.quantity} un</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    <span>{batch.start_date.split('-').reverse().join('/')}</span>
                                                </div>
                                            </div>

                                            {/* Actions (Fallback) */}
                                            <div className="flex justify-between mt-2 pt-2 border-t border-gray-50">
                                                <button
                                                    onClick={() => moveStage(batch.id, batch.stage, 'prev')}
                                                    disabled={batch.stage === 'corte'}
                                                    className={`p-1 rounded hover:bg-gray-100 text-gray-500 ${batch.stage === 'corte' ? 'invisible' : ''}`}
                                                    title="Voltar etapa"
                                                >
                                                    <ArrowLeft size={16} />
                                                </button>
                                                <button
                                                    onClick={() => moveStage(batch.id, batch.stage, 'next')}
                                                    className="p-1 rounded hover:bg-green-50 text-green-600 transition-colors"
                                                    title="Avançar etapa"
                                                >
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {stageBatches.length === 0 && (
                                        <div className="text-center py-8 text-slate-300 text-xs italic border-2 border-dashed border-slate-200 rounded pointer-events-none">
                                            Arraste aqui
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-denim-900">Nova Ordem de Produção</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">ID do Lote</label>
                                <input
                                    className="w-full p-2 border rounded"
                                    placeholder="Ex: L-1050 (Deixe vazio para automático)"
                                    value={newOrder.id || ''}
                                    onChange={e => setNewOrder({ ...newOrder, id: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Produto</label>
                                <input
                                    required
                                    className="w-full p-2 border rounded"
                                    placeholder="Ex: Calça Jeans Skinny"
                                    value={newOrder.product_name || ''}
                                    onChange={e => setNewOrder({ ...newOrder, product_name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Quantidade</label>
                                    <input
                                        required type="number"
                                        className="w-full p-2 border rounded"
                                        value={newOrder.quantity || ''}
                                        onChange={e => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Prioridade</label>
                                    <select
                                        className="w-full p-2 border rounded bg-white"
                                        value={newOrder.priority}
                                        onChange={e => setNewOrder({ ...newOrder, priority: e.target.value as any })}
                                    >
                                        <option value="low">Baixa</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">Urgente</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-denim-900 text-white font-bold rounded hover:bg-denim-800"
                                >
                                    {saving ? 'Criando...' : 'Criar Ordem'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionBoard;
