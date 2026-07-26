import React from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart as PieChartIcon, Percent, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const monthlyCashFlowData = [
  { month: 'Jan', recebido: 42000, juros: 8400, emprestado: 35000 },
  { month: 'Fev', recebido: 48000, juros: 9600, emprestado: 40000 },
  { month: 'Mar', recebido: 55000, juros: 11000, emprestado: 45000 },
  { month: 'Abr', recebido: 52000, juros: 10400, emprestado: 42000 },
  { month: 'Mai', recebido: 61000, juros: 12200, emprestado: 50000 },
  { month: 'Jun', recebido: 68000, juros: 13600, emprestado: 55000 },
  { month: 'Jul', recebido: 74500, juros: 14900, emprestado: 60000 },
];

export const RelatoriosView: React.FC = () => {
  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            RETORNO MÉDIO (ROI)
          </span>
          <p className="text-2xl font-black text-[#00D084] font-mono mt-1">21.4%</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Ao mês sobre o capital</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            TAXA DE ADIMPLÊNCIA
          </span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">94.2%</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Pagamentos em dia</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] col-span-2 sm:col-span-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            INADIMPLÊNCIA CONTROLADA
          </span>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">5.8%</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Atraso &gt; 5 dias</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00D084]" />
              Evolução do Fluxo de Caixa (2026)
            </h3>
            <p className="text-xs text-gray-400">Comparativo entre Total Recebido vs Juros Lucrados</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#00D084] text-[10px] font-bold border border-emerald-500/20">
            +18.5% este mês
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyCashFlowData}>
              <defs>
                <linearGradient id="colorRecebido" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D084" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00D084" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorJuros" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '12px', fontSize: '12px', color: '#FFF' }} 
                formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
              />
              <Area type="monotone" dataKey="recebido" name="Total Recebido" stroke="#00D084" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecebido)" />
              <Area type="monotone" dataKey="juros" name="Lucro de Juros" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorJuros)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#00D084]" />
          Volume Emprestado por Mês
        </h3>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCashFlowData}>
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '12px', fontSize: '12px', color: '#FFF' }} 
              />
              <Bar dataKey="emprestado" name="Novos Empréstimos" fill="#00D084" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
