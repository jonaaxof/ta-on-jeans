import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, Search, AlertTriangle, CheckCircle, Save, X } from 'lucide-react';

interface Material {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    min_threshold: number;
    updated_at?: string;
}

const InventoryManagement = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('materials')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            if (data) setMaterials(data);
        } catch (error) {
            console.error('Erro ao buscar materiais:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const materialData = {
                name: currentMaterial.name,
                quantity: Number(currentMaterial.quantity),
                min_threshold: Number(currentMaterial.min_threshold),
                unit: currentMaterial.unit || 'un'
            };

            if (isEditing && currentMaterial.id) {
                const { error } = await supabase
                    .from('materials')
                    .update(materialData)
                    .eq('id', currentMaterial.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('materials')
                    .insert([materialData]);
                if (error) throw error;
            }

            await fetchMaterials();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        try {
            const { error } = await supabase
                .from('materials')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchMaterials();
        } catch (error: any) {
            alert(`Erro ao excluir: ${error.message}`);
        }
    };

    const resetForm = () => {
        setCurrentMaterial({ unit: 'metros' }); // default
        setIsEditing(false);
    };

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-display text-denim-900">Estoque de Matéria-Prima</h1>
                    <p className="text-sm text-gray-500">Controle de tecidos e aviamentos</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-denim-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-denim-800 transition-colors"
                >
                    <Plus size={18} /> Novo Item
                </button>
            </div>

            {/* Filters/Search */}
            <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar material..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:border-denim-900 focus:ring-1 focus:ring-denim-900 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Item</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Quantidade</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Carregando...</td></tr>
                            ) : filteredMaterials.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nenhum item encontrado.</td></tr>
                            ) : (
                                filteredMaterials.map((item) => {
                                    const isCritical = item.quantity <= item.min_threshold;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <span className="font-bold text-denim-900 text-sm">{item.name}</span>
                                            </td>
                                            <td className="p-4 text-sm font-mono">
                                                {item.quantity} <span className="text-gray-500 text-xs">{item.unit}</span>
                                            </td>
                                            <td className="p-4">
                                                {isCritical ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                        <AlertTriangle size={12} /> Crítico
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                                        <CheckCircle size={12} /> Ok
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => { setCurrentMaterial(item); setIsEditing(true); setIsModalOpen(true); }}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Editar"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={16} />
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
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <form onSubmit={handleSave} className="flex flex-col h-full">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-denim-900">
                                    {isEditing ? 'Editar Item' : 'Novo Item'}
                                </h3>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-denim-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome do Material</label>
                                    <input required className="w-full p-2 border rounded" value={currentMaterial.name || ''} onChange={e => setCurrentMaterial({ ...currentMaterial, name: e.target.value })} placeholder="Ex: Jeans Indigo 10oz" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Quantidade</label>
                                        <input required type="number" step="0.01" className="w-full p-2 border rounded" value={currentMaterial.quantity || ''} onChange={e => setCurrentMaterial({ ...currentMaterial, quantity: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Unidade</label>
                                        <select className="w-full p-2 border rounded bg-white" value={currentMaterial.unit || 'metros'} onChange={e => setCurrentMaterial({ ...currentMaterial, unit: e.target.value })}>
                                            <option value="metros">Metros</option>
                                            <option value="kg">Kg</option>
                                            <option value="un">Unidades</option>
                                            <option value="rolos">Rolos</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Alerta Mínimo</label>
                                    <p className="text-[10px] text-gray-400 mb-1">Quantidade limite para alerta crítico</p>
                                    <input required type="number" className="w-full p-2 border rounded" value={currentMaterial.min_threshold || 10} onChange={e => setCurrentMaterial({ ...currentMaterial, min_threshold: parseFloat(e.target.value) })} />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 rounded text-gray-600 font-bold hover:bg-gray-200 transition"
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded bg-denim-900 text-white font-bold hover:bg-denim-800 transition shadow-lg flex items-center gap-2"
                                    disabled={saving}
                                >
                                    {saving ? <span className="animate-spin">⌛</span> : <Save size={18} />}
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
