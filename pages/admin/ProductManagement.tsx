import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Product } from '../../types';
import { Plus, Edit, Trash2, Search, Upload, X, Save, AlertCircle } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                const formattedData: Product[] = data.map((item: any) => ({
                    id: item.id,
                    reference: item.reference,
                    title: item.title,
                    price: Number(item.price),
                    fit: item.fit,
                    wash: item.wash,
                    imageFront: item.image_front,
                    imageBack: item.image_back,
                    isNew: item.is_new,
                    isOutlet: item.is_outlet,
                    description: item.description,
                    material: item.material,
                    grade: item.grade,
                    gender: item.gender,
                    // Inference
                    category: item.category || (() => {
                        const fit = item.fit;
                        const title = item.title?.toLowerCase() || '';
                        if (fit === 'Shorts') return 'shorts';
                        if (fit === 'Saia') return 'saia';
                        if (fit === 'Jaqueta') return 'jaqueta';
                        if (['Skinny', 'Mom', 'Wide Leg'].includes(fit)) return 'calca';
                        if (title.includes('bermuda')) return 'bermuda';
                        if (title.includes('camiseta')) return 'camiseta';
                        return 'calca';
                    })()
                }));
                setProducts(formattedData);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const cleanProductData = (data: Partial<Product>) => {
        // Ensure numeric values are numbers
        const clean: any = { ...data };
        if (clean.price) clean.price = Number(clean.price);

        // Map camelCase to snake_case for DB
        const dbPayload: any = {
            reference: clean.reference,
            title: clean.title,
            price: clean.price,
            fit: clean.fit,
            wash: clean.wash,
            description: clean.description,
            material: clean.material,
            grade: clean.grade,
            gender: clean.gender,
            image_front: clean.imageFront,
            image_back: clean.imageBack,
            is_new: clean.isNew,
            is_outlet: clean.isOutlet,
        };

        // Remove undefined fields and the 'category' which is calculated on the fly
        Object.keys(dbPayload).forEach(key => {
            if (dbPayload[key] === undefined) {
                delete dbPayload[key];
            }
        });

        return dbPayload;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const productData = cleanProductData(currentProduct);

            if (isEditing && currentProduct.id) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', currentProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            await fetchProducts();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchProducts();
        } catch (error: any) {
            alert(`Erro ao excluir: ${error.message}`);
        }
    };

    const resetForm = () => {
        setCurrentProduct({});
        setIsEditing(false);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'imageFront' | 'imageBack') => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);
        try {
            // 1. Upload to 'products' bucket
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            // 3. Update state
            setCurrentProduct(prev => ({ ...prev, [field]: publicUrl }));

        } catch (error: any) {
            alert(`Erro no upload: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-display text-denim-900">Gestão de Produtos</h1>
                    <p className="text-sm text-gray-500">Gerencie o catálogo da loja</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-denim-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-denim-800 transition-colors"
                >
                    <Plus size={18} /> Novo Produto
                </button>
            </div>

            {/* Filters/Search */}
            <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou referência..."
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
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Imagem</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Ref / Nome</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Preço</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Grade / Fit</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Categoria</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Carregando...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum produto encontrado.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden">
                                                <img
                                                    src={product.imageFront || 'https://placehold.co/100x150?text=No+Img'}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-gray-500 font-mono mb-1">{product.reference}</p>
                                            <p className="font-bold text-denim-900 text-sm line-clamp-1">{product.title}</p>
                                        </td>
                                        <td className="p-4 font-mono text-sm">
                                            R$ {product.price?.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {product.grade} <br />
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{product.fit}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs uppercase font-bold text-gray-500">{product.gender} / {product.category}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setCurrentProduct(product); setIsEditing(true); setIsModalOpen(true); }}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSave} className="flex flex-col h-full">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-denim-900">
                                    {isEditing ? 'Editar Produto' : 'Novo Produto'}
                                </h3>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-denim-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Left Column: Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Referência</label>
                                        <input required className="w-full p-2 border rounded" value={currentProduct.reference || ''} onChange={e => setCurrentProduct({ ...currentProduct, reference: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Título</label>
                                        <input required className="w-full p-2 border rounded" value={currentProduct.title || ''} onChange={e => setCurrentProduct({ ...currentProduct, title: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Preço (R$)</label>
                                            <input required type="number" step="0.01" className="w-full p-2 border rounded" value={currentProduct.price || ''} onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Grade</label>
                                            <input required placeholder="ex: 36 ao 44" className="w-full p-2 border rounded" value={currentProduct.grade || ''} onChange={e => setCurrentProduct({ ...currentProduct, grade: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Gênero</label>
                                            <select className="w-full p-2 border rounded bg-white" value={currentProduct.gender || 'feminino'} onChange={e => setCurrentProduct({ ...currentProduct, gender: e.target.value as any })}>
                                                <option value="feminino">Feminino</option>
                                                <option value="masculino">Masculino</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Categoria</label>
                                            <select className="w-full p-2 border rounded bg-white" value={currentProduct.category || 'calca'} onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value as any })}>
                                                <option value="calca">Calça</option>
                                                <option value="shorts">Shorts</option>
                                                <option value="saia">Saia</option>
                                                <option value="jaqueta">Jaqueta</option>
                                                <option value="camiseta">Camiseta</option>
                                                <option value="bermuda">Bermuda</option>
                                                <option value="vestido">Vestido</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Fit (Modelo)</label>
                                            <select className="w-full p-2 border rounded bg-white" value={currentProduct.fit || 'Skinny'} onChange={e => setCurrentProduct({ ...currentProduct, fit: e.target.value as any })}>
                                                <option value="Skinny">Skinny</option>
                                                <option value="Mom">Mom</option>
                                                <option value="Wide Leg">Wide Leg</option>
                                                <option value="Shorts">Shorts</option>
                                                <option value="Saia">Saia</option>
                                                <option value="Jaqueta">Jaqueta</option>
                                                <option value="Reto">Reto</option>
                                                <option value="Masculino">Masculino (Geral)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Lavagem</label>
                                            <select className="w-full p-2 border rounded bg-white" value={currentProduct.wash || 'Clara'} onChange={e => setCurrentProduct({ ...currentProduct, wash: e.target.value as any })}>
                                                <option value="Clara">Clara</option>
                                                <option value="Média">Média</option>
                                                <option value="Escura">Escura</option>
                                                <option value="Preta">Preta</option>
                                                <option value="Distressed">Distressed</option>
                                                <option value="Color">Color</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Material / Composição</label>
                                        <input className="w-full p-2 border rounded" value={currentProduct.material || '100% Algodão'} onChange={e => setCurrentProduct({ ...currentProduct, material: e.target.value })} />
                                    </div>
                                </div>

                                {/* Right Column: Images & Desc */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Frente ({uploading ? '...' : ''})</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative h-40 flex items-center justify-center overflow-hidden">
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'imageFront')} accept="image/*" />
                                                {currentProduct.imageFront ? (
                                                    <img src={currentProduct.imageFront} className="w-full h-full object-contain" alt="Front Preview" />
                                                ) : (
                                                    <div className="text-gray-400 flex flex-col items-center">
                                                        <Upload size={24} />
                                                        <span className="text-xs mt-1">Upload</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Costas ({uploading ? '...' : ''})</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative h-40 flex items-center justify-center overflow-hidden">
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'imageBack')} accept="image/*" />
                                                {currentProduct.imageBack ? (
                                                    <img src={currentProduct.imageBack} className="w-full h-full object-contain" alt="Back Preview" />
                                                ) : (
                                                    <div className="text-gray-400 flex flex-col items-center">
                                                        <Upload size={24} />
                                                        <span className="text-xs mt-1">Upload</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrição</label>
                                        <textarea className="w-full p-2 border rounded h-32" value={currentProduct.description || ''} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} />
                                    </div>

                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={currentProduct.isNew || false} onChange={e => setCurrentProduct({ ...currentProduct, isNew: e.target.checked })} />
                                            <span className="text-sm font-medium">Novidade</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={currentProduct.isOutlet || false} onChange={e => setCurrentProduct({ ...currentProduct, isOutlet: e.target.checked })} />
                                            <span className="text-sm font-medium">Outlet</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-lg mt-auto">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 rounded text-gray-600 font-bold hover:bg-gray-200 transition"
                                    disabled={uploading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded bg-denim-900 text-white font-bold hover:bg-denim-800 transition shadow-lg flex items-center gap-2"
                                    disabled={uploading}
                                >
                                    {uploading ? <span className="animate-spin">⌛</span> : <Save size={18} />}
                                    Salvar Produto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
