import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, AlertCircle, CheckCircle2, Clock, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: (clientName: string, phone: string, loanCode: string, amount: number, dueDate: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenWhatsApp,
}) => {
  const notifications = [
    {
      id: 'n1',
      title: 'Empréstimo Vencido com Atraso (12 dias)',
      desc: 'Roberto Mendes Ribeiro possui 2 parcelas em atraso no valor de R$ 2.000,00.',
      time: 'Há 15 min',
      type: 'urgent',
      clientName: 'Roberto Mendes Ribeiro',
      phone: '(11) 99887-1122',
      amount: 2000,
    },
    {
      id: 'n2',
      title: '3 Parcelas Vencendo Hoje',
      desc: 'Carlos Eduardo, Amanda Souza e Juliana Ferreira possuem vencimentos hoje.',
      time: 'Há 1 hora',
      type: 'warning',
    },
    {
      id: 'n3',
      title: 'Baixa de Pagamento Efetuada',
      desc: 'Recebimento de R$ 1.200,00 confirmado via PIX para o contrato EMP-2026-001.',
      time: 'Há 3 horas',
      type: 'success',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-md bg-[#0F172A] border-t sm:border border-[#1E293B] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 flex flex-col justify-between max-h-[85vh] overflow-hidden"
          >
            <div className="w-12 h-1.5 bg-gray-600/50 rounded-full mx-auto mb-3 sm:hidden" />

            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#1E293B] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#00D084]/15 border border-[#00D084]/30 text-[#00D084]">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Notificações</h3>
                    <p className="text-[11px] text-gray-400">3 alertas pendentes para celular</p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-[#1E293B] text-gray-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[55vh] pr-1">
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-all ${
                      n.type === 'urgent'
                        ? 'bg-rose-500/10 border-rose-500/30 text-gray-200'
                        : n.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-gray-200'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        {n.type === 'urgent' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        {n.type === 'warning' && <Clock className="w-4 h-4 text-amber-400 shrink-0" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#00D084] shrink-0" />}
                        <span className="leading-snug">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono shrink-0">{n.time}</span>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-[11px]">{n.desc}</p>

                    {n.type === 'urgent' && n.clientName && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onClose();
                          onOpenWhatsApp(n.clientName!, n.phone!, 'EMP-2026-003', n.amount!, '2026-07-13');
                        }}
                        className="mt-2 py-2 px-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 w-full shadow-lg shadow-rose-500/20 active:scale-95 transition"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Cobrar no WhatsApp Agora</span>
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#1E293B] hover:bg-[#2A384C] text-gray-200 font-bold text-xs mt-4 border border-[#334155] transition"
            >
              Marcar Todas como Lidas
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
