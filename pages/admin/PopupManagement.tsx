import React, { useState, useEffect } from 'react';
import { Save, Upload, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface PopupConfig {
    isActive: boolean;
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
    couponCode: string;
}

const PopupManagement: React.FC = () => {
    const [config, setConfig] = useState<PopupConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'promo_popup')
            .single();

        if (data) {
            setConfig(data.value);
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('system_settings')
                .upsert({
                    key: 'promo_popup',
                    value: config,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            alert('Configurações salvas com sucesso!');
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `popup_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('banners') // Reusing banners bucket
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('banners')
                .getPublicUrl(filePath);

            setConfig(prev => prev ? { ...prev, imageUrl: publicUrl } : null);
        } catch (error: any) {
            alert('Erro no upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-8">Carregando...</div>;
    if (!config) return <div className="p-8">Erro ao carregar configurações.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Popup Promocional</h1>
                    <p className="text-slate-500">Configure o popup de primeira compra exibido na loja.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <form onSubmit={handleSave} className="space-y-6">

                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={config.isActive}
                                onChange={e => setConfig({ ...config, isActive: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <label htmlFor="isActive" className="font-bold text-slate-700">Ativar Popup no Site</label>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Título (HTML permitido)</label>
                            <input
                                className="w-full p-2 border rounded font-mono text-sm"
                                value={config.title}
                                onChange={e => setConfig({ ...config, title: e.target.value })}
                            />
                            <p className="text-xs text-gray-400 mt-1">Use &lt;br/&gt; para quebrar linha.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtítulo</label>
                            <input
                                className="w-full p-2 border rounded"
                                value={config.subtitle}
                                onChange={e => setConfig({ ...config, subtitle: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrição</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                rows={3}
                                value={config.description}
                                onChange={e => setConfig({ ...config, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Código do Cupom</label>
                            <input
                                className="w-full p-2 border rounded font-bold text-denim-900"
                                value={config.couponCode}
                                onChange={e => setConfig({ ...config, couponCode: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imagem</label>
                            <div className="flex gap-2">
                                <input
                                    className="w-full p-2 border rounded text-xs"
                                    value={config.imageUrl}
                                    readOnly
                                />
                                <label className="cursor-pointer bg-slate-100 border border-slate-300 px-3 py-2 rounded hover:bg-slate-200 transition-colors">
                                    <Upload size={18} className={`text-slate-600 ${uploading ? 'animate-bounce' : ''}`} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 flex justify-center items-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </form>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-500 uppercase text-xs flex items-center gap-2">
                        <Eye size={14} /> Pré-visualização
                    </h3>
                    <div className="bg-gray-800 p-8 rounded-xl flex justify-center items-center h-[500px]">
                        {/* Mini Popup */}
                        <div className="bg-white w-full max-w-sm rounded overflow-hidden shadow-2xl relative">
                            <div className="h-32 bg-gray-200 relative">
                                <img src={config.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                            </div>
                            <div className="p-6 text-center">
                                <h4 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">{config.subtitle}</h4>
                                <h2 className="text-xl font-bold text-denim-900 leading-tight mb-2" dangerouslySetInnerHTML={{ __html: config.title }} />
                                <p className="text-xs text-gray-500 mb-4">{config.description}</p>
                                <div className="bg-gray-100 p-2 rounded border border-dashed border-gray-300 font-mono font-bold text-denim-900 mb-4">
                                    {config.couponCode}
                                </div>
                                <button className="w-full bg-black text-white py-2 text-xs font-bold uppercase">Resgatar</button>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">A visualização pode variar ligeiramente do resultado final.</p>
                </div>
            </div>
        </div>
    );
};

export default PopupManagement;
