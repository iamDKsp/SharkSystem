import React, { useState } from 'react';
import { Banknote, Search, Filter, Plus, Calendar, Percent, CheckCircle2, AlertCircle, MessageSquare, ChevronRight, Calculator, RefreshCw } from 'lucide-react';
import { Loan, LoanStatus } from '../types';

interface EmprestimosViewProps {
  loans: Loan[];
  onOpenQuickAction: () => void;
  onOpenWhatsApp: (clientName: string, phone: string, loanCode: string, amount: number, dueDate: string) => void;
}

export const EmprestimosView: React.FC<EmprestimosViewProps> = ({
  loans,
  onOpenQuickAction,
  onOpenWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | LoanStatus>('todos');

  const filteredLoans = loans.filter(l => {
    const matchesSearch = l.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código (ex: EMP-2026-001) ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#00D084]"
          />
        </div>

        <button
          onClick={onOpenQuickAction}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.2)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Novo Empréstimo</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('todos')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            statusFilter === 'todos'
              ? 'bg-[#00D084] text-slate-950'
              : 'bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white'
          }`}
        >
          Todos ({loans.length})
        </button>
        <button
          onClick={() => setStatusFilter('em_dia')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            statusFilter === 'em_dia'
              ? 'bg-emerald-500/20 text-[#00D084] border border-[#00D084]'
              : 'bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white'
          }`}
        >
          Em Dia ({loans.filter(l => l.status === 'em_dia').length})
        </button>
        <button
          onClick={() => setStatusFilter('atrasado')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            statusFilter === 'atrasado'
              ? 'bg-red-500/20 text-red-400 border border-red-500'
              : 'bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white'
          }`}
        >
          Atrasados ({loans.filter(l => l.status === 'atrasado').length})
        </button>
      </div>

      <div className="space-y-3">
        {filteredLoans.map((loan) => {
          const totalToRec = loan.totalToReceive || 1;
          const rawPaid = loan.totalPaid || 0;
          const progressPercent = Math.min(100, Math.max(0, Math.round((rawPaid / totalToRec) * 100)));

          return (
            <div
              key={loan.id}
              className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#00D084]/40 transition space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#00D084]">{loan.code}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-400 uppercase font-semibold">{loan.periodicity}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5 group-hover:text-[#00D084] transition">
                    {loan.clientName}
                  </h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  loan.status === 'em_dia' 
                    ? 'bg-emerald-500/10 text-[#00D084] border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {loan.status === 'em_dia' ? 'Em Dia' : 'Atrasado'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#0B0F17] border border-[#1F2937] text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Principal</span>
                  <span className="font-mono font-bold text-white">R$ {(Number(loan?.amount) || 0).toLocaleString('pt-BR')}</span>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Juros (%)</span>
                  <span className="font-mono font-bold text-[#00D084]">{loan?.interestRate || 0}%</span>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Total Contrato</span>
                  <span className="font-mono font-bold text-white">R$ {(Number(loan?.totalToReceive) || 0).toLocaleString('pt-BR')}</span>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Saldo Restante</span>
                  <span className="font-mono font-bold text-amber-400">R$ {(Number(loan?.remainingAmount) || 0).toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">
                    Pago: <strong className="text-white">R$ {(Number(loan?.totalPaid) || 0).toLocaleString('pt-BR')}</strong> ({loan?.paidInstallmentsCount || 0}/{loan?.installmentsCount || 0} parcelas)
                  </span>
                  <span className="font-bold text-[#00D084]">{progressPercent}% Quitado</span>
                </div>

                <div className="w-full h-2 bg-[#151D2D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D084] to-[#10B981] rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1F2937]">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#00D084]" />
                  Próximo Vencimento: <strong className="text-white">{loan.nextDueDate}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenWhatsApp(loan.clientName, loan.clientPhone, loan.code, loan.remainingAmount, loan.nextDueDate)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-[#00D084] hover:bg-[#00D084] hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition border border-emerald-500/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Cobrar</span>
                  </button>

                  <button
                    onClick={onOpenQuickAction}
                    className="px-3 py-1.5 rounded-xl bg-[#00D084] text-slate-950 font-bold text-xs hover:brightness-110 transition"
                  >
                    <span>Receber Parcela</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
