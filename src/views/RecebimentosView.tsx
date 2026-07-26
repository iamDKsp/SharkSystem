import React, { useState } from 'react';
import { Receipt, Plus, Search, Filter, Calendar, CheckCircle2, DollarSign, Download, ArrowUpRight } from 'lucide-react';
import { PaymentReceipt } from '../types';

interface RecebimentosViewProps {
  receipts: PaymentReceipt[];
  onOpenQuickAction: () => void;
}

export const RecebimentosView: React.FC<RecebimentosViewProps> = ({
  receipts,
  onOpenQuickAction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('todos');

  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = selectedMethod === 'todos' || r.method === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = receipts.reduce((acc, r) => acc + (Number(r?.amount) || 0), 0);
  const totalInterestCollected = receipts.reduce((acc, r) => acc + (Number(r?.interestPortion) || 0), 0);

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            TOTAL RECEBIDO
          </span>
          <p className="text-xl font-black text-[#00D084] font-mono mt-1">
            R$ {(Number(totalCollected) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">{receipts.length} baixas efetuadas</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            LUCRO DE JUROS
          </span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">
            R$ {(Number(totalInterestCollected) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Rendimento líquido</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código do recibo ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D084]"
          />
        </div>

        <button
          onClick={onOpenQuickAction}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.2)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Registrar Recebimento</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {filteredReceipts.map((receipt) => (
          <div
            key={receipt.id}
            className="p-3.5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#00D084]/40 transition flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#00D084] flex items-center justify-center font-bold text-xs border border-emerald-500/20 shrink-0">
                <Receipt className="w-5 h-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-white group-hover:text-[#00D084] transition leading-tight">
                  {receipt.clientName}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span className="font-mono text-[11px] text-[#00D084] font-semibold">{receipt.code}</span>
                  <span>•</span>
                  <span>{receipt.date} às {receipt.time}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#151D2D] text-gray-300 text-[10px] border border-[#1F2937]">
                    {receipt.method}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-black text-[#00D084] font-mono">
                + R$ {(Number(receipt?.amount) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-gray-400">
                Principal: R$ {(Number(receipt?.principalPortion) || 0).toLocaleString('pt-BR')} | Juros: R$ {(Number(receipt?.interestPortion) || 0).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
