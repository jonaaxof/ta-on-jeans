import React from 'react';
import { Construction } from 'lucide-react';

interface Props {
    title: string;
}

const AdminPlaceholder: React.FC<Props> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <Construction size={64} className="mb-4 text-slate-300" />
            <h2 className="text-2xl font-bold text-slate-600 mb-2">{title}</h2>
            <p className="text-sm text-slate-400">Esta funcionalidade está em desenvolvimento.</p>
        </div>
    );
};

export default AdminPlaceholder;
