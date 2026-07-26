import React, { useState } from 'react';
import { Handshake, UserPlus, Search, Phone, Percent, DollarSign, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { Partner } from '../types';

interface ParceirosViewProps {
  partners: Partner[];
  onAddPartner: (newPartner: Omit<Partner, 'id' | 'totalIndicatedLoans' | 'totalCommissionEarned'>) => void;
}

export const ParceirosView: React.FC<ParceirosViewProps> = ({
  partners,
  onAddPartner,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionRate, setCommissionRate] = useState<number>(2.5);

  const filtered = partners.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddPartner({
      name: name.trim(),
      phone: phone.trim() || '(11) 90000-0000',
      commissionRate: Number(commissionRate) || 2.5,
      status: 'ativo',
    });

    setName('');
    setPhone('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar parceiro ou promotor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D084]"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.2)]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Parceiro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((partner) => (
          <div
            key={partner.id}
            className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#00D084]/40 transition space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#151D2D] text-[#00D084] border border-[#00D084]/30 flex items-center justify-center font-bold text-sm">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{partner.name}</h3>
                  <p className="text-xs text-gray-400">{partner.phone}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#00D084] text-[10px] font-bold border border-emerald-500/20">
                {partner.commissionRate}% Comissão
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0B0F17] border border-[#1F2937] text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Empréstimos Indicados</span>
                <span className="font-bold text-white">{partner.totalIndicatedLoans} contratos</span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Comissão Acumulada</span>
                <span className="font-mono font-bold text-[#00D084]">
                  R$ {(Number(partner?.totalCommissionEarned) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <h3 className="text-base font-bold text-white">Cadastrar Novo Parceiro / Promotor</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg bg-[#151D2D] text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Nome do Parceiro *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Taxa de Comissão (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084] font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#00D084] text-slate-950 font-bold text-xs hover:brightness-110 transition mt-2"
              >
                Salvar Parceiro
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
