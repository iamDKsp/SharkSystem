import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, DollarSign, Percent, Clock, Zap } from 'lucide-react';
import { Loan } from '../types';

interface ReprogramacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onConfirm: (
    loanId: string, 
    novaDataVencimento: string, 
    principalExtra: number, 
    taxaJuros: number, 
    frequencia: string
  ) => Promise<void>;
  isMobileFrame?: boolean;
}

export const ReprogramacaoModal: React.FC<ReprogramacaoModalProps> = ({
  isOpen,
  onClose,
  loan,
  onConfirm,
  isMobileFrame = false,
}) => {
  const [novaData, setNovaData] = useState<string>(new Date().toISOString().split('T')[0]);
  const [principalExtra, setPrincipalExtra] = useState<number>(0);
  const [taxaJuros, setTaxaJuros] = useState<number>(loan?.interestRate || 20);
  const [frequencia, setFrequencia] = useState<string>(loan?.periodicity || 'mensal');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !loan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaData) return;

    try {
      setIsSubmitting(true);
      await onConfirm(loan.id, novaData, Number(principalExtra), Number(taxaJuros), frequencia);
      onClose();
    } catch (err) {
      console.error("Erro ao reprogramar empréstimo:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className={`${isMobileFrame ? 'absolute' : 'fixed'} inset-0 z-50 flex flex-col justify-end`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${isMobileFrame ? 'absolute' : 'fixed'} inset-0 bg-black/80 backdrop-blur-md`}
          onClick={onClose}
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#0F172A] border-t border-[#1E293B] rounded-t-3xl p-5 w-full max-w-lg mx-auto z-10 shadow-2xl space-y-4"
        >
          <div className="w-12 h-1.5 bg-gray-600/50 rounded-full mx-auto" />

          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#00D084]" />
                Reprogramar / Aditivo
              </h3>
              <p className="text-xs text-gray-400">
                {loan.code} • {loan.clientName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1E293B] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#00D084]" />
                <span>Capital Extra a Injetar (R$)</span>
              </label>
              <input
                type="number"
                step="50"
                min="0"
                value={principalExtra}
                onChange={(e) => setPrincipalExtra(Number(e.target.value))}
                placeholder="0.00 (Opcional)"
                className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#00D084]" />
                  <span>Taxa de Juros (%)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={taxaJuros}
                  onChange={(e) => setTaxaJuros(Number(e.target.value))}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00D084]" />
                  <span>Periodicidade</span>
                </label>
                <select
                  value={frequencia}
                  onChange={(e) => setFrequencia(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00D084]"
                >
                  <option value="diario">Diário</option>
                  <option value="semanal">Semanal</option>
                  <option value="quinzenal">Quinzenal</option>
                  <option value="mensal">Mensal</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00D084]" />
                <span>Nova Data Inicial do 1º Vencimento</span>
              </label>
              <input
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                required
                className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !novaData}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.25)] disabled:opacity-50"
              >
                <Zap className="w-4 h-4 stroke-[3]" />
                <span>{isSubmitting ? 'Salvando...' : 'Aplicar Reprogramação'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
