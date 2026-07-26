import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Banknote, 
  MessageSquareWarning, 
  Plus, 
  Grid,
  TrendingUp,
  Receipt,
  CalendarCheck,
  History,
  BarChart3,
  Handshake,
  Settings,
  CreditCard,
  X
} from 'lucide-react';
import { ViewMode } from '../types';

interface BottomNavProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  onOpenQuickAction: () => void;
  isMobileFrame?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  setCurrentView,
  onOpenQuickAction,
  isMobileFrame = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'dashboard' as ViewMode, label: 'Início', icon: LayoutDashboard },
    { id: 'clientes' as ViewMode, label: 'Clientes', icon: Users },
  ];

  const rightNavItems = [
    { id: 'emprestimos' as ViewMode, label: 'Empréstimos', icon: Banknote },
  ];

  const secondaryMenu = [
    { id: 'cobrancas' as ViewMode, label: 'Cobranças & Atrasados', icon: MessageSquareWarning, desc: 'Inadimplência e réguas de cobrança' },
    { id: 'recebimentos' as ViewMode, label: 'Recebimentos & Caixa', icon: Receipt, desc: 'Histórico de entradas' },
    { id: 'parcelas' as ViewMode, label: 'Cronograma de Parcelas', icon: CalendarCheck, desc: 'Gestão de vencimentos' },
    { id: 'cheques' as ViewMode, label: 'Gestão de Cheques', icon: CreditCard, desc: 'Controle de cheques de terceiros' },
    { id: 'relatorios' as ViewMode, label: 'Relatórios & Gráficos', icon: BarChart3, desc: 'Métricas de desempenho' },
    { id: 'parceiros' as ViewMode, label: 'Parceiros & Promotores', icon: Handshake, desc: 'Comissões de indicação' },
    { id: 'historico' as ViewMode, label: 'Trilha de Auditoria', icon: History, desc: 'Registros do sistema' },
    { id: 'configuracoes' as ViewMode, label: 'Configurações', icon: Settings, desc: 'Parâmetros e WhatsApp' },
  ];

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <div className={`${isMobileFrame ? 'absolute' : 'fixed'} inset-0 z-50 flex flex-col justify-end`}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${isMobileFrame ? 'absolute' : 'fixed'} inset-0 bg-black/80 backdrop-blur-md`}
              onClick={() => setIsMenuOpen(false)} 
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-[#0F172A] border-t border-[#1E293B] rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto z-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-600/50 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center justify-between mb-5 pb-2 border-b border-[#1E293B]">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Grid className="w-5 h-5 text-[#00D084]" />
                    Menu de Módulos
                  </h3>
                  <p className="text-xs text-gray-400">Shark System • Módulos Operacionais</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl bg-[#1E293B] text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {secondaryMenu.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-start gap-3.5 p-3.5 rounded-2xl border text-left transition ${
                        isActive 
                          ? 'bg-[#1E293B] border-[#00D084] text-white shadow-[0_0_15px_rgba(0,208,132,0.15)]' 
                          : 'bg-[#0B0F17]/80 border-[#1E293B] text-gray-300 hover:border-gray-600 hover:bg-[#1E293B]'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-[#00D084] text-slate-950' : 'bg-[#1E293B] text-[#00D084]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{item.label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="sticky bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-[#1F2937] px-1 sm:px-2 py-1.5 w-full overflow-visible">
        <div className="max-w-lg mx-auto grid grid-cols-5 items-center text-center relative px-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition ${
                  isActive ? 'text-[#00D084]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className={`relative p-1 rounded-lg ${isActive ? 'bg-[#00D084]/10' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${isActive ? 'text-[#00D084]' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="flex flex-col items-center justify-center relative -top-3 z-50">
            <button
              onClick={onOpenQuickAction}
              className="group relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#00D084] via-[#10B981] to-[#34D399] text-slate-950 flex items-center justify-center font-black shadow-[0_0_22px_rgba(0,208,132,0.6)] border-[4px] border-[#0B0F17] hover:scale-105 active:scale-95 transition-all duration-200"
              title="Nova Ação Rápida"
            >
              <span className="absolute inset-[2px] rounded-full border border-white/30 pointer-events-none" />
              <Plus className="w-6 h-6 stroke-[3] transition-transform duration-200 group-hover:rotate-90" />
            </button>
            <span className="text-[10px] font-bold tracking-tight text-[#00D084] mt-0.5">
              Novo
            </span>
          </div>

          {rightNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition ${
                  isActive ? 'text-[#00D084]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className={`relative p-1 rounded-lg ${isActive ? 'bg-[#00D084]/10' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${isActive ? 'text-[#00D084]' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition ${
              isMenuOpen || secondaryMenu.some(m => m.id === currentView) 
                ? 'text-[#00D084]' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`relative p-1 rounded-lg ${isMenuOpen || secondaryMenu.some(m => m.id === currentView) ? 'bg-[#00D084]/10' : ''}`}>
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
};
