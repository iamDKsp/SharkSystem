import React, { useState } from 'react';
import { CreditCard, Plus, Search, Building2, Calendar, CheckCircle2, Clock, XCircle, Trash2, X, AlertCircle } from 'lucide-react';
import { ChequeItem } from '../types';

interface ChequesViewProps {
  cheques: ChequeItem[];
  onAddCheque?: (cheque: Omit<ChequeItem, 'id'>) => void;
  onUpdateChequeStatus?: (id: string, status: string) => void;
  onDeleteCheque?: (id: string) => void;
}

export const ChequesView: React.FC<ChequesViewProps> = ({
  cheques,
  onAddCheque,
  onUpdateChequeStatus,
  onDeleteCheque,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [numero, setNumero] = useState('');
  const [banco, setBanco] = useState('');
  const [emitente, setEmitente] = useState('');
  const [valor, setValor] = useState<number>(1000);
  const [dataDeposito, setDataDeposito] = useState(new Date().toISOString().split('T')[0]);
  const [observacao, setObservacao] = useState('');

  const filteredCheques = cheques.filter(c => {
    const matchesSearch = c.numero.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.emitente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.banco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEmCustodia = cheques.filter(c => c.status === 'EM_CUSTODIA').reduce((acc, c) => acc + (Number(c?.valor) || 0), 0);
  const totalDepositados = cheques.filter(c => c.status === 'DEPOSITADO' || c.status === 'COMPENSADO').reduce((acc, c) => acc + (Number(c?.valor) || 0), 0);

  const handleCreateCheque = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim() || !emitente.trim()) return;

    if (onAddCheque) {
      onAddCheque({
        numero: numero.trim(),
        banco: banco.trim() || 'Banco do Brasil',
        emitente: emitente.trim(),
        valor: Number(valor) || 0,
        dataDeposito,
        status: 'EM_CUSTODIA',
        observacao: observacao.trim() || undefined,
      });
    }

    setNumero('');
    setEmitente('');
    setBanco('');
    setObservacao('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            TOTAL EM CUSTÓDIA
          </span>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">
            R$ {(Number(totalEmCustodia) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Cheques a compensar</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            COMPENSADOS / DEPOSITADOS
          </span>
          <p className="text-xl font-black text-[#00D084] font-mono mt-1">
            R$ {(Number(totalDepositados) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Valores liquidados</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número, emitente ou banco..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D084]"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.2)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Cheque</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['todos', 'EM_CUSTODIA', 'DEPOSITADO', 'DEVOLVIDO', 'COMPENSADO'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              statusFilter === st
                ? 'bg-[#00D084] text-slate-950'
                : 'bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white'
            }`}
          >
            {st === 'todos' ? 'Todos' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredCheques.map((cheque) => (
          <div
            key={cheque.id}
            className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#00D084]/40 transition space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#151D2D] text-[#00D084] border border-[#00D084]/30 flex items-center justify-center font-bold text-sm">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#00D084]">Nº {cheque.numero}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-300 font-semibold">{cheque.banco}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{cheque.emitente}</h3>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                cheque.status === 'COMPENSADO' || cheque.status === 'DEPOSITADO'
                  ? 'bg-emerald-500/10 text-[#00D084] border-emerald-500/20'
                  : cheque.status === 'DEVOLVIDO'
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {cheque.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0B0F17] border border-[#1F2937] text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Valor do Cheque</span>
                <span className="font-mono font-black text-[#00D084]">
                  R$ {(Number(cheque?.valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] block uppercase">Data de Depósito</span>
                <span className="font-mono font-bold text-white flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-[#00D084]" />
                  {cheque.dataDeposito}
                </span>
              </div>
            </div>

            {cheque.observacao && (
              <p className="text-xs text-gray-400 italic">Obs: {cheque.observacao}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#1F2937]">
              <div className="flex items-center gap-2">
                {onUpdateChequeStatus && cheque.status !== 'DEPOSITADO' && (
                  <button
                    onClick={() => onUpdateChequeStatus(cheque.id, 'DEPOSITADO')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-[#00D084] border border-emerald-500/20 hover:bg-[#00D084] hover:text-slate-950 font-bold text-xs transition"
                  >
                    Marcar Depositado
                  </button>
                )}
                {onUpdateChequeStatus && cheque.status !== 'DEVOLVIDO' && (
                  <button
                    onClick={() => onUpdateChequeStatus(cheque.id, 'DEVOLVIDO')}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white font-bold text-xs transition"
                  >
                    Marcar Devolvido
                  </button>
                )}
              </div>

              {onDeleteCheque && (
                <button
                  onClick={() => onDeleteCheque(cheque.id)}
                  className="p-2 rounded-xl bg-[#151D2D] text-gray-400 hover:text-red-400 transition"
                  title="Excluir Cheque"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <h3 className="text-base font-bold text-white">Cadastrar Cheque em Custódia</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg bg-[#151D2D] text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCheque} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Número do Cheque *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 000123"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Banco / Instituição</label>
                  <input
                    type="text"
                    placeholder="Ex: Banco do Brasil"
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Nome do Emitente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={emitente}
                  onChange={(e) => setEmitente(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Data para Depósito</label>
                  <input
                    type="date"
                    value={dataDeposito}
                    onChange={(e) => setDataDeposito(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Observações</label>
                <textarea
                  rows={2}
                  placeholder="Notas adicionais sobre o cheque..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#00D084] text-slate-950 font-bold text-xs hover:brightness-110 transition mt-2"
              >
                Cadastrar Cheque
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
