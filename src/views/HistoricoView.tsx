import React, { useState } from 'react';
import { History, Search, ShieldCheck, User, Banknote, Receipt, MessageSquare, AlertCircle } from 'lucide-react';
import { AuditLog } from '../types';

interface HistoricoViewProps {
  logs: AuditLog[];
}

export const HistoricoView: React.FC<HistoricoViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filtrar histórico por usuário, ação ou código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D084]"
        />
      </div>

      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-3.5 rounded-2xl bg-[#111827] border border-[#1F2937] flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#151D2D] border border-[#1F2937] text-[#00D084] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{log.action}</span>
                <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
              </div>

              <p className="text-xs text-gray-300">{log.details}</p>

              <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500">
                <span>Operador: <strong className="text-gray-300">{log.user}</strong></span>
                <span className="uppercase font-semibold text-[#00D084]">{log.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
