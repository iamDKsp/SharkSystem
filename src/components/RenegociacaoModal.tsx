import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw, DollarSign, Percent, ArrowRight, ShieldCheck } from 'lucide-react';
import { Loan } from '../types';

interface RenegociacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onConfirm: (loanId: string, valorAbater: number, aplicarNovosJuros: boolean, novaTaxa: number) => Promise<void>;
  isMobileFrame?: boolean;
}

export const RenegociacaoModal: React.FC<RenegociacaoModalProps> = ({
  isOpen,
  onClose,
  loan,
  onConfirm,
  isMobileFrame = false,
}) => {
  const [valorAbater, setValorAbater] = useState<number>(500);
  const [aplicarNovosJuros, setAplicarNovosJuros] = useState<boolean>(true);
  const [novaTaxa, setNovaTaxa] = useState<number>(loan?.interestRate || 20);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !loan) return null;

  const remaining = loan.remainingAmount;
  const novoSaldoBase = Math.max(0, remaining - (Number(valorAbater) || 0));
  const jurosAdicionais = aplicarNovosJuros ? novoSaldoBase * (Number(novaTaxa) / 100) : 0;
  const novoSaldoTotal = novoSaldoBase + jurosAdicionais;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valorAbater <= 0) return;

    try {
      setIsSubmitting(true);
      await onConfirm(loan.id, Number(valorAbater), aplicarNovosJuros, Number(novaTaxa));
      onClose();
    } catch (err) {
      console.error("Erro na renegociação:", err);
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
                <RefreshCw className="w-5 h-5 text-[#00D084]" />
                Renegociar / Abatimento
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
            <div className="p-3.5 rounded-2xl bg-[#0B0F17] border border-[#1E293B] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase">Saldo Devedor Atual</span>
                <p className="text-lg font-black text-rose-400 font-mono">
                  R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600" />
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase">Novo Saldo Devedor</span>
                <p className="text-lg font-black text-[#00D084] font-mono">
                  R$ {novoSaldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#00D084]" />
                <span>Valor a Abater Hoje (R$)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={remaining}
                value={valorAbater}
                onChange={(e) => setValorAbater(Number(e.target.value))}
                required
                className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
              <input
                type="checkbox"
                id="aplicarNovosJuros"
                checked={aplicarNovosJuros}
                onChange={(e) => setAplicarNovosJuros(e.target.checked)}
                className="w-4 h-4 accent-[#00D084] rounded"
              />
              <label htmlFor="aplicarNovosJuros" className="text-xs font-bold text-gray-300 cursor-pointer">
                Recalcular taxa de juros sobre o saldo restante
              </label>
            </div>

            {aplicarNovosJuros && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#00D084]" />
                  <span>Nova Taxa de Juros (%)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={novaTaxa}
                  onChange={(e) => setNovaTaxa(Number(e.target.value))}
                  className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || valorAbater <= 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.25)] disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 stroke-[3]" />
                <span>{isSubmitting ? 'Processando...' : 'Confirmar Renegociação'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
