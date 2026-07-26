import React, { useState } from 'react';
import { Search, UserPlus, Phone, MapPin, ShieldAlert, CheckCircle, MessageSquare, ChevronRight, X, CreditCard, Banknote } from 'lucide-react';
import { Client, Loan } from '../types';

interface ClientesViewProps {
  clients: Client[];
  loans: Loan[];
  onOpenQuickAction: () => void;
  onOpenWhatsApp: (clientName: string, phone: string, loanCode: string, amount: number, dueDate: string) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  clients,
  loans,
  onOpenQuickAction,
  onOpenWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inadimplente'>('todos');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.document.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#00D084]"
          />
        </div>

        <button
          onClick={onOpenQuickAction}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.2)]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Cliente</span>
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
          Todos ({clients.length})
        </button>
        <button
          onClick={() => setStatusFilter('ativo')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            statusFilter === 'ativo'
              ? 'bg-emerald-500/20 text-[#00D084] border border-[#00D084]'
              : 'bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white'
          }`}
        >
          Ativos ({clients.filter(c => c.status === 'ativo').length})
        </button>
        <button
          onClick={() => setStatusFilter('inadimplente')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            statusFilter === 'inadimplente'
              ? 'bg-red-500/20 text-red-400 border border-red-500'
              : 'bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white'
          }`}
        >
          Inadimplentes ({clients.filter(c => c.status === 'inadimplente').length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredClients.map((client) => {
          const clientLoans = loans.filter(l => l.clientId === client.id);
          const activeLoan = clientLoans.find(l => l.status === 'em_dia' || l.status === 'atrasado');

          return (
            <div
              key={client.id}
              className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#00D084]/50 transition space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {client.avatarUrl ? (
                    <img
                      src={client.avatarUrl}
                      alt={client.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#00D084]/30 shadow-md shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#151D2D] border border-[#00D084]/30 flex items-center justify-center font-black text-base text-[#00D084] shrink-0">
                      {client.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#00D084] transition">
                      {client.name}
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00D084]" />
                      {client.city}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  client.status === 'ativo' 
                    ? 'bg-emerald-500/10 text-[#00D084] border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {client.status === 'ativo' ? 'Ativo' : 'Inadimplente'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Limite Aprovado:</span>
                  <span className="font-bold text-white font-mono">
                    R$ {(Number(client?.creditLimit) || 0).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#151D2D] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00D084] to-[#10B981] rounded-full" 
                    style={{ width: `${Math.min(100, ((Number(client?.totalBorrowed) || 0) / (Number(client?.creditLimit) || 1)) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Tomado: <strong className="text-[#00D084]">R$ {(Number(client?.totalBorrowed) || 0).toLocaleString('pt-BR')}</strong></span>
                  <span>Empréstimos Ativos: <strong className="text-white">{client?.activeLoansCount || 0}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onOpenWhatsApp(client.name, client.phone, activeLoan?.code || 'CONTRATO', activeLoan?.remainingAmount || 1000, activeLoan?.nextDueDate || '2026-07-25')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-[#00D084] hover:bg-[#00D084] hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition border border-emerald-500/20"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => setSelectedClient(client)}
                  className="px-3 py-1.5 rounded-xl bg-[#151D2D] text-gray-300 hover:text-white font-bold text-xs flex items-center gap-1 transition border border-[#1F2937]"
                >
                  <span>Detalhes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0" onClick={() => setSelectedClient(null)} />
          <div className="relative w-full max-w-lg bg-[#111827] border border-[#1F2937] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <div>
                <h3 className="text-base font-bold text-white">{selectedClient.name}</h3>
                <p className="text-xs text-gray-400">{selectedClient.document} • {selectedClient.city}</p>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-1.5 rounded-xl bg-[#151D2D] text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1F2937] space-y-2">
                <p className="text-xs font-bold text-[#00D084] uppercase">Informações do Cliente</p>
                <div className="text-xs space-y-1 text-gray-300">
                  <p><strong>Telefone:</strong> {selectedClient.phone}</p>
                  <p><strong>Email:</strong> {selectedClient.email}</p>
                  <p><strong>Status:</strong> {selectedClient.status}</p>
                  {selectedClient.notes && <p className="text-amber-300 pt-1"><strong>Observação:</strong> {selectedClient.notes}</p>}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Histórico de Empréstimos</h4>
                {loans.filter(l => l.clientId === selectedClient.id).map(l => (
                  <div key={l.id} className="p-3 rounded-xl bg-[#151D2D] border border-[#1F2937] flex items-center justify-between text-xs my-1">
                    <div>
                      <p className="font-bold text-white">{l.code}</p>
                      <p className="text-gray-400">R$ {(Number(l?.amount) || 0).toLocaleString('pt-BR')} ({l.interestRate}% a.m.)</p>
                    </div>
                    <span className="font-mono font-bold text-[#00D084]">
                      R$ {(Number(l?.remainingAmount) || 0).toLocaleString('pt-BR')} restantes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
