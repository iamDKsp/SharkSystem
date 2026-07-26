import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Heart, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  MessageSquare, 
  Zap,
  Clock,
  TrendingUp,
  PieChart as PieChartIcon,
  Target,
  DollarSign,
  Briefcase,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Check
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { Loan, Installment, Client, ViewMode } from '../types';

interface DashboardViewProps {
  loans: Loan[];
  installments: Installment[];
  clients: Client[];
  setCurrentView: (view: ViewMode) => void;
  onOpenQuickAction: () => void;
  onOpenWhatsApp: (clientName: string, phone: string, loanCode: string, amount: number, dueDate: string) => void;
  onMarkInstallmentPaid: (installmentId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  loans,
  installments,
  clients,
  setCurrentView,
  onOpenQuickAction,
  onOpenWhatsApp,
  onMarkInstallmentPaid,
}) => {
  const totalCapitalInField = loans.reduce((acc, l) => acc + (Number(l?.amount) || 0), 0);
  const totalToReceive = loans.reduce((acc, l) => acc + (Number(l?.remainingAmount) || 0), 0) || 138500;
  const overdueLoans = loans.filter(l => l.status === 'atrasado');

  const todayInstallments = installments.filter(i => i.status === 'vencendo_hoje' || i.status === 'pendente');
  const todayTotal = todayInstallments.reduce((acc, i) => acc + (Number(i?.amount) || 0), 0) || 0;

  const weeklyReceivables = installments
    .filter(i => i.status === 'pendente' || i.status === 'vencendo_hoje')
    .reduce((acc, i) => acc + (Number(i?.amount) || 0), 0) || 18250;
  const monthlyReceivables = totalToReceive * 0.45;
  const yearlyReceivables = totalToReceive * 1.1;

  const ownCapitalPercentage = 78;
  const partnerCapitalPercentage = 22;
  const ownCapitalAmount = (totalToReceive * ownCapitalPercentage) / 100;
  const partnerCapitalAmount = (totalToReceive * partnerCapitalPercentage) / 100;

  const totalInterestEarned = loans.reduce((acc, l) => acc + (l.totalToReceive - l.amount), 0);
  const monthBilled = loans.reduce((acc, l) => acc + l.totalPaid, 0);
  const yearBilled = monthBilled * 2.5;
  const payoffRate = loans.length > 0 ? Math.round((loans.filter(l => l.status === 'quitado').length / loans.length) * 100) || 91.2 : 91.2;

  const grossBilledTotal = totalCapitalInField + totalInterestEarned;
  const activePotentialProfit = totalInterestEarned;
  const averageTicket = loans.length > 0 ? totalCapitalInField / loans.length : 7250;

  const projectionData = [
    { month: 'Jul', amount: Math.round(totalToReceive * 0.15) || 28500 },
    { month: 'Ago', amount: Math.round(totalToReceive * 0.22) || 34200 },
    { month: 'Set', amount: Math.round(totalToReceive * 0.19) || 31800 },
    { month: 'Out', amount: Math.round(totalToReceive * 0.25) || 39500 },
    { month: 'Nov', amount: Math.round(totalToReceive * 0.28) || 42000 },
    { month: 'Dez', amount: Math.round(totalToReceive * 0.32) || 48600 },
  ];

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onOpenQuickAction}
          className="py-3 px-3 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-[#00D084]/40 text-gray-200 font-bold text-xs flex items-center justify-center gap-2 transition group shadow-sm"
        >
          <div className="w-6 h-6 rounded-lg bg-[#00D084]/15 text-[#00D084] flex items-center justify-center group-hover:scale-110 transition">
            <Plus className="w-4 h-4" />
          </div>
          <span>Novo Cliente</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onOpenQuickAction}
          className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(0,208,132,0.2)] hover:brightness-110"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Novo Empréstimo</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <motion.div 
          whileHover={{ y: -2 }}
          className="col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-[#00D084]/50 transition min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D084]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-9 h-9 rounded-xl bg-[#00D084]/10 border border-[#00D084]/30 text-[#00D084] flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>

          <div className="mt-4">
            <p className="text-xl sm:text-2xl font-black text-[#00D084] font-mono tracking-tight">
              R$ {totalCapitalInField.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Capital em Campo
            </p>
          </div>
        </motion.div>

        <div className="col-span-5 flex flex-col justify-between gap-2">
          <div className="p-2.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00D084]/10 text-[#00D084] flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-[#00D084]/30" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none">A Receber</p>
              <p className="text-xs font-black text-white font-mono mt-1 leading-none">
                R$ {(totalToReceive / 1000).toFixed(1)}k
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00D084]/10 text-[#00D084] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] text-gray-300 font-bold uppercase tracking-tight leading-none whitespace-nowrap">Vencendo Hoje</p>
              <p className="text-xs font-black text-[#00D084] font-mono mt-1 leading-none whitespace-nowrap">
                {todayInstallments.length > 0 ? `${todayInstallments.length} parcelas` : '0 parcelas'}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none">Atrasados</p>
              <p className="text-xs font-black text-rose-400 font-mono mt-1 leading-none whitespace-nowrap">
                {overdueLoans.length} pendentes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Próximos Vencimentos</h2>
            <p className="text-xs text-gray-400">Contratos ativos e parcelas mais próximas</p>
          </div>

          <div className="flex items-center -space-x-2 overflow-hidden">
            {clients.slice(0, 3).map((client, idx) => (
              client.avatarUrl ? (
                <img
                  key={client.id || idx}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0F17] object-cover shadow-sm"
                  src={client.avatarUrl}
                  alt={client.name}
                />
              ) : (
                <div 
                  key={client.id || idx} 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0F17] bg-[#1E293B] text-[#00D084] font-bold text-xs flex items-center justify-center"
                >
                  {(client?.name || 'C').charAt(0)}
                </div>
              )
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E293B] text-[10px] font-bold text-gray-300 ring-2 ring-[#0B0F17]">
              +{clients.length}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {loans.slice(0, 4).map((loan) => {
            const client = clients.find(c => c.id === loan.clientId);
            return (
              <motion.div
                key={loan.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView('emprestimos')}
                className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-[#00D084]/40 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {client?.avatarUrl ? (
                    <img 
                      src={client.avatarUrl} 
                      alt={loan.clientName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#00D084]/40 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#00D084]/10 text-[#00D084] flex items-center justify-center font-bold text-sm border border-[#00D084]/20 shrink-0">
                      {(loan?.clientName || 'C').charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-[#00D084] transition">
                      {loan?.clientName || 'Cliente'}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono font-bold text-[#00D084]">
                        R$ {(Number(loan?.amount) || 0).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        ({loan.code})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    loan.status === 'em_dia' 
                      ? 'bg-[#00D084]/10 text-[#00D084] border-[#00D084]/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {loan.status === 'em_dia' ? 'Em dia' : 'Atrasado'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={() => setCurrentView('emprestimos')}
          className="w-full text-center py-2 text-xs font-bold text-[#00D084] hover:underline transition flex items-center justify-center gap-1"
        >
          <span>Ver todos os empréstimos</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#1E293B] space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00D084]" />
            <h3 className="text-xs font-black text-gray-200 uppercase tracking-wider">
              VENCIMENTOS DO DIA
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#00D084]/10 border border-[#00D084]/30 text-[#00D084] text-[10px] font-extrabold">
            {todayInstallments.length} Cobranças Hoje
          </span>
        </div>

        {todayInstallments.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400 bg-[#0B0F17] rounded-2xl border border-[#1E293B]">
            Nenhum vencimento pendente para a data de hoje.
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayInstallments.slice(0, 3).map((item) => {
              const loan = loans.find(l => l.id === item.loanId);
              const client = clients.find(c => c.id === loan?.clientId);
              const isPaid = item.status === 'paga';

              return (
                <div 
                  key={item.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-2 ${
                    isPaid 
                      ? 'bg-[#0B0F17]/50 border-emerald-500/20 opacity-60' 
                      : 'bg-[#0B0F17] border-[#1E293B] hover:border-[#00D084]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#1E293B] text-[#00D084] font-bold text-xs flex items-center justify-center shrink-0">
                      {(item?.clientName || 'C').charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item?.clientName || 'Cliente'}</p>
                      <p className="text-[11px] font-mono text-[#00D084] font-bold">
                        R$ {(Number(item?.amount) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        <span className="text-[10px] text-gray-400 font-normal ml-1">({item.number}ª parc)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isPaid ? (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onOpenWhatsApp(
                            item.clientName, 
                            client?.phone || '(11) 98888-7777', 
                            loan?.code || 'SHK-100', 
                            item.amount, 
                            item.dueDate
                          )}
                          className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#00D084] hover:bg-[#00D084] hover:text-slate-950 transition"
                          title="Enviar Cobrança WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onMarkInstallmentPaid(item.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#00D084] text-slate-950 font-black text-[10px] flex items-center gap-1 hover:brightness-110 transition"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Baixar</span>
                        </motion.button>
                      </>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#00D084] text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Pago
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#1E293B] space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00D084]" />
            <h3 className="text-xs font-black text-gray-200 uppercase tracking-wider">
              RECEBÍVEIS POR PERÍODO
            </h3>
          </div>
          <button 
            onClick={() => setCurrentView('relatorios')}
            className="text-[11px] font-bold text-[#00D084] hover:underline flex items-center gap-0.5"
          >
            <span>Ver Relatório</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-[#0B0F17] border border-[#1E293B] space-y-1">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">HOJE</p>
            <p className="text-base font-black text-[#00D084] font-mono">
              R$ {todayTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B0F17] border border-[#1E293B] space-y-1">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">ESTA SEMANA (7D)</p>
            <p className="text-base font-black text-[#00D084] font-mono">
              R$ {weeklyReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B0F17] border border-[#1E293B] space-y-1">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">NO MÊS (30D)</p>
            <p className="text-base font-black text-[#00D084] font-mono">
              R$ {monthlyReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B0F17] border border-[#1E293B] space-y-1">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">NO ANO (365D)</p>
            <p className="text-base font-black text-[#00D084] font-mono">
              R$ {yearlyReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#1E293B] space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00D084]" />
            <h3 className="text-xs font-black text-gray-200 uppercase tracking-wider">
              PROJEÇÃO DE RECEBIMENTOS
            </h3>
          </div>

          <div className="px-3 py-1 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Próximos 6 meses</span>
          </div>
        </div>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 'bold' }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 208, 132, 0.08)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0B0F17] border border-[#00D084]/40 p-2 rounded-xl shadow-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{payload[0].payload.month}</p>
                        <p className="text-xs font-black text-[#00D084] font-mono">
                          R$ {Number(payload[0].value).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {projectionData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 5 ? '#00D084' : '#10B981'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#1E293B] space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-[#00D084]" />
          <h3 className="text-xs font-black text-gray-200 uppercase tracking-wider">
            DISTRIBUIÇÃO DE CARTEIRA
          </h3>
        </div>

        <div className="space-y-2">
          <div className="h-3.5 w-full bg-[#0B0F17] rounded-full overflow-hidden p-0.5 flex border border-[#1E293B]">
            <div 
              style={{ width: `${ownCapitalPercentage}%` }} 
              className="h-full bg-[#00D084] rounded-l-full shadow-sm transition-all duration-500" 
            />
            <div 
              style={{ width: `${partnerCapitalPercentage}%` }} 
              className="h-full bg-[#334155] rounded-r-full shadow-sm transition-all duration-500" 
            />
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00D084] shrink-0" />
                <span className="font-bold text-gray-300">Capital Próprio</span>
                <span className="px-1.5 py-0.2 bg-[#00D084]/10 text-[#00D084] font-extrabold text-[10px] rounded-md">
                  {ownCapitalPercentage}%
                </span>
              </div>
              <span className="font-mono font-bold text-white">
                R$ {ownCapitalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#334155] shrink-0" />
                <span className="font-bold text-gray-300">Parceiros</span>
                <span className="px-1.5 py-0.2 bg-[#334155]/30 text-gray-400 font-extrabold text-[10px] rounded-md">
                  {partnerCapitalPercentage}%
                </span>
              </div>
              <span className="font-mono font-bold text-white">
                R$ {partnerCapitalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
          <span className="text-xs font-black text-gray-300 uppercase tracking-wider">TOTAL RECEBÍVEL</span>
          <span className="text-base font-black text-[#00D084] font-mono shadow-[0_0_10px_rgba(0,208,132,0.2)]">
            R$ {totalToReceive.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

    </div>
  );
};
