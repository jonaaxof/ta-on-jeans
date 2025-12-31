import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Mail, Shield, User } from 'lucide-react';

interface TeamMember {
    id: string;
    email: string;
    name: string;
    role: 'moderator' | 'admin' | 'owner';
}

const TeamManagement = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMember, setNewMember] = useState<Partial<TeamMember>>({ role: 'moderator' });

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setMembers(data as any);
        } catch (error) {
            console.error('Erro ao buscar equipe:', error);
        } finally {
            setLoading(false);
        }
    };

    const inviteMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!newMember.email) return;

            const { error } = await supabase
                .from('team_members')
                .insert([{
                    email: newMember.email.toLowerCase(),
                    name: newMember.name,
                    role: newMember.role
                }]);

            if (error) throw error;

            await fetchTeam();
            setIsModalOpen(false);
            setNewMember({ role: 'moderator' });
            alert('Membro adicionado! Quando este usuário fizer login, ele terá o acesso liberado.');
        } catch (error: any) {
            alert(`Erro ao adicionar: ${error.message}`);
        }
    };

    const removeMember = async (id: string) => {
        if (!confirm('Remover acesso deste usuário?')) return;
        try {
            const { error } = await supabase.from('team_members').delete().eq('id', id);
            if (error) throw error;
            fetchTeam();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-display text-denim-900">Gestão de Equipe</h1>
                    <p className="text-sm text-gray-500">Controle de acesso ao sistema</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-denim-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-denim-800 transition-colors"
                >
                    <Plus size={18} /> Novo Membro
                </button>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Usuário</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Permissão</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-denim-100 flex items-center justify-center text-denim-600">
                                        <User size={16} />
                                    </div>
                                    <span className="font-bold text-denim-900">{member.name || 'Sem nome'}</span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{member.email}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase
                                ${member.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                                            member.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                        <Shield size={12} /> {member.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {member.role !== 'owner' && (
                                        <button onClick={() => removeMember(member.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-denim-900 mb-4">Convidar Membro</h3>
                        <form onSubmit={inviteMember} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome</label>
                                <input className="w-full p-2 border rounded" value={newMember.name || ''} onChange={e => setNewMember({ ...newMember, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                                <input type="email" className="w-full p-2 border rounded" value={newMember.email || ''} onChange={e => setNewMember({ ...newMember, email: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Permissão</label>
                                <select className="w-full p-2 border rounded bg-white" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value as any })}>
                                    <option value="moderator">Moderador (Acesso Limitado)</option>
                                    <option value="admin">Administrador (Acesso Total)</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-denim-900 text-white font-bold rounded">Adicionar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
