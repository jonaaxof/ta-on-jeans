import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, Upload, X, Save, Eye, EyeOff } from 'lucide-react';

interface Banner {
    id: string;
    title: string;
    image_url: string;
    mobile_image_url?: string;
    link: string;
    position: number;
    active: boolean;
}

const BannerManagement = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .order('position', { ascending: true });

            if (error) throw error;
            if (data) setBanners(data);
        } catch (error) {
            console.error('Erro ao buscar banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            if (isEditing && currentBanner.id) {
                const { error } = await supabase
                    .from('banners')
                    .update(currentBanner)
                    .eq('id', currentBanner.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('banners')
                    .insert([currentBanner]);
                if (error) throw error;
            }

            await fetchBanners();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este banner?')) return;
        try {
            const { error } = await supabase.from('banners').delete().eq('id', id);
            if (error) throw error;
            fetchBanners();
        } catch (error: any) {
            alert(`Erro ao excluir: ${error.message}`);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'mobile_image_url') => {
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `banner_${Math.random()}.${fileExt}`;

        setUploading(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('banners')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('banners')
                .getPublicUrl(fileName);

            setCurrentBanner(prev => ({ ...prev, [field]: publicUrl }));
        } catch (error: any) {
            alert(`Erro no upload: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setCurrentBanner({ active: true, position: 0 });
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-display text-denim-900">Banners do Site</h1>
                    <p className="text-sm text-gray-500">Gerencie os banners da Home</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-denim-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-denim-800 transition-colors"
                >
                    <Plus size={18} /> Novo Banner
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="aspect-[16/9] bg-gray-100 relative">
                            <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${banner.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                    {banner.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-denim-900 mb-1">{banner.title || 'Sem Título'}</h3>
                            <p className="text-xs text-gray-500 mb-4 truncate">{banner.link}</p>

                            <div className="flex justify-between items-center">
                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">Pos: {banner.position}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => { setCurrentBanner(banner); setIsEditing(true); setIsModalOpen(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(banner.id)} className="p-2 hover:bg-red-50 text-red-600 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <form onSubmit={handleSave} className="flex flex-col h-full">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-denim-900">
                                    {isEditing ? 'Editar Banner' : 'Novo Banner'}
                                </h3>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-denim-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Título (Interno)</label>
                                    <input className="w-full p-2 border rounded" value={currentBanner.title || ''} onChange={e => setCurrentBanner({ ...currentBanner, title: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Link de Destino</label>
                                    <input className="w-full p-2 border rounded" value={currentBanner.link || ''} onChange={e => setCurrentBanner({ ...currentBanner, link: e.target.value })} placeholder="/colecao/feminino" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imagem Desktop</label>
                                        <input type="file" onChange={(e) => handleImageUpload(e, 'image_url')} accept="image/*" className="text-xs" />
                                        {currentBanner.image_url && <p className="text-[10px] text-green-600 mt-1">Imagem carregada</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imagem Mobile (Opcional)</label>
                                        <input type="file" onChange={(e) => handleImageUpload(e, 'mobile_image_url')} accept="image/*" className="text-xs" />
                                        {currentBanner.mobile_image_url && <p className="text-[10px] text-green-600 mt-1">Imagem carregada</p>}
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ordem</label>
                                        <input type="number" className="w-20 p-2 border rounded" value={currentBanner.position || 0} onChange={e => setCurrentBanner({ ...currentBanner, position: parseInt(e.target.value) })} />
                                    </div>
                                    <div className="flex items-center mt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={currentBanner.active !== false} onChange={e => setCurrentBanner({ ...currentBanner, active: e.target.checked })} />
                                            <span className="font-bold text-sm">Banner Ativo</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded text-gray-600 font-bold hover:bg-gray-200" disabled={uploading}>Cancelar</button>
                                <button type="submit" className="px-6 py-2 rounded bg-denim-900 text-white font-bold hover:bg-denim-800" disabled={uploading}>
                                    {uploading ? 'Salvando...' : 'Salvar Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManagement;
