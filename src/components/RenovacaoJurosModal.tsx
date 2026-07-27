import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Loan } from '../types';

interface RenovacaoJurosModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onConfirm: (loanId: string) => Promise<void>;
  isMobileFrame?: boolean;
}

export const RenovacaoJurosModal: React.FC<RenovacaoJurosModalProps> = ({
  isOpen,
  onClose,
  loan,
  onConfirm,
  isMobileFrame = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !loan) return null;

  const valorJuros = (loan.amount * loan.interestRate) / 100;
  const nextDate = new Date(loan.nextDueDate || new Date());
  nextDate.setMonth(nextDate.getMonth() + 1);
  const nextDateStr = nextDate.toLocaleDateString('pt-BR');

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(loan.id);
      onClose();
    } catch (err) {
      console.error("Erro ao renovar juros:", err);
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
                Receber Só Juros (Renovar +30d)
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

          <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">Valor dos Juros a Receber:</span>
              <span className="text-xl font-black text-[#00D084] font-mono">
                R$ {valorJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/50">
              <span className="text-xs text-gray-400 font-medium">Novo Vencimento do Principal:</span>
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#00D084]" />
                {nextDateStr} (+30 dias)
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            💡 <b>Como funciona:</b> O cliente paga apenas R$ {valorJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de juros referente ao período. A parcela atual é baixada como paga pelo valor do juro e o saldo principal do contrato é renovado por mais 30 dias.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-[#1E293B] text-gray-300 font-bold text-xs hover:text-white transition"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.25)] disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'Confirmando...' : 'Confirmar e Dar Baixa'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
