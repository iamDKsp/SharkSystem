import React, { useState } from 'react';
import { MessageSquareWarning, AlertCircle, Phone, Calendar, Send, Copy, ShieldAlert, CheckCircle2, Search, Zap } from 'lucide-react';
import { CollectionItem } from '../types';

interface CobrancasViewProps {
  collections: CollectionItem[];
  onOpenWhatsApp: (clientName: string, phone: string, loanCode: string, amount: number, dueDate: string, daysOverdue?: number) => void;
}

export const CobrancasView: React.FC<CobrancasViewProps> = ({
  collections,
  onOpenWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = collections.filter(c => 
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.clientPhone.includes(searchTerm)
  );

  const totalOverdueAmount = collections.reduce((acc, c) => acc + (Number(c?.amountOverdue) || 0), 0);

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#111827] to-[#151D2D] border border-red-500/30 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black text-red-400 uppercase tracking-wider">
              TOTAL EM INADIMPLÊNCIA
            </span>
          </div>
          <p className="text-2xl font-black text-red-500 font-mono">
            R$ {(Number(totalOverdueAmount) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400">
            {collections.length} clientes com parcelas vencidas aguardando contato
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar cliente em atraso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#111827] border border-red-500/30 hover:border-red-500/60 transition space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center font-black text-sm border border-red-500/20">
                  {item.daysOverdue}d
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.clientName}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-red-400" />
                    {item.clientPhone}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/40">
                {item.daysOverdue} DIAS ATRASADO
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0B0F17] border border-[#1F2937] text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Valor em Atraso</span>
                <span className="font-mono font-black text-red-400">
                  R$ {(Number(item?.amountOverdue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Juros/Multa Acumulada</span>
                <span className="font-mono font-bold text-amber-400">
                  + R$ {(Number(item?.interestAndFines) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400">
                Último contato: {item.lastContactDate || 'Não registrado'}
              </span>

              <button
                onClick={() => onOpenWhatsApp(item.clientName, item.clientPhone, 'CONTRATO-ATRASO', item.amountOverdue + item.interestAndFines, 'VENCIDO', item.daysOverdue)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-black text-xs flex items-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.25)]"
              >
                <Send className="w-4 h-4" />
                <span>Cobrar no WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
