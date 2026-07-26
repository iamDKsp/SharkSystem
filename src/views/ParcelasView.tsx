import React, { useState } from 'react';
import { CalendarCheck, Search, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { Installment } from '../types';

interface ParcelasViewProps {
  installments: Installment[];
  onMarkInstallmentPaid: (installmentId: string) => void;
  onOpenWhatsApp: (clientName: string, phone: string, loanCode: string, amount: number, dueDate: string) => void;
}

export const ParcelasView: React.FC<ParcelasViewProps> = ({
  installments,
  onMarkInstallmentPaid,
  onOpenWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  const filtered = installments.filter(i => {
    const matchesSearch = i.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          i.loanCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || i.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar parcela por cliente ou código do empréstimo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D084]"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['todos', 'vencendo_hoje', 'atrasada', 'paga'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap capitalize ${
              filterStatus === st
                ? 'bg-[#00D084] text-slate-950'
                : 'bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map((inst) => (
          <div
            key={inst.id}
            className={`p-3.5 rounded-2xl bg-[#111827] border transition flex items-center justify-between gap-3 ${
              inst.status === 'atrasada' 
                ? 'border-red-500/40' 
                : inst.status === 'vencendo_hoje'
                ? 'border-amber-500/40'
                : 'border-[#1F2937]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border shrink-0 ${
                inst.status === 'paga' 
                  ? 'bg-emerald-500/10 text-[#00D084] border-emerald-500/20' 
                  : inst.status === 'atrasada'
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {inst.number}/{inst.totalNumber}
              </div>

              <div>
                <p className="text-sm font-bold text-white leading-tight">{inst.clientName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                  <span className="font-mono text-[#00D084] font-semibold">{inst.loanCode}</span>
                  <span>•</span>
                  <span>Vencimento: {inst.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="text-right flex items-center gap-3">
              <div>
                <p className="text-sm font-black text-[#00D084] font-mono">
                  R$ {(Number(inst?.amount) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className={`text-[10px] font-bold ${
                  inst.status === 'paga' 
                    ? 'text-emerald-400' 
                    : inst.status === 'atrasada'
                    ? 'text-red-400'
                    : 'text-amber-400'
                }`}>
                  {inst.status === 'paga' ? `Pago (${inst.paymentMethod || 'PIX'})` : inst.status === 'atrasada' ? 'Atrasado' : 'Vence Hoje'}
                </span>
              </div>

              {inst.status !== 'paga' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenWhatsApp(inst.clientName, '(11) 98765-4321', inst.loanCode, inst.amount, inst.dueDate)}
                    className="p-2 rounded-xl bg-emerald-500/10 text-[#00D084] hover:bg-[#00D084] hover:text-slate-950 transition border border-emerald-500/20"
                    title="Cobrar via WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onMarkInstallmentPaid(inst.id)}
                    className="p-2 rounded-xl bg-[#00D084] text-slate-950 font-bold hover:brightness-110 transition"
                    title="Dar Baixa"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
