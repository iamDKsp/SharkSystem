import React from 'react';
import { 
  Settings, 
  Bell, 
  Smartphone, 
  Monitor, 
  Calendar,
  ShieldCheck,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  isMobileFrame?: boolean;
  setIsMobileFrame?: (val: boolean) => void;
  todayDateStr?: string;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onOpenQuickAction?: () => void;
  userName: string;
  avatarUrl: string | null;
  qrConnected?: boolean;
  onOpenProfilePopup: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  isMobileFrame = false,
  setIsMobileFrame,
  todayDateStr,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenQuickAction,
  userName,
  avatarUrl,
  qrConnected = true,
  onOpenProfilePopup,
  theme = 'dark',
  onToggleTheme,
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Painel Geral';
      case 'clientes': return 'Gestão de Clientes';
      case 'emprestimos': return 'Empréstimos Ativos';
      case 'cobrancas': return 'Régua de Cobrança';
      case 'recebimentos': return 'Caixa & Recebimentos';
      case 'parcelas': return 'Cronograma de Parcelas';
      case 'historico': return 'Trilha de Auditoria';
      case 'relatorios': return 'Relatórios Financeiros';
      case 'configuracoes': return 'Configurações do Sistema';
      case 'parceiros': return 'Parceiros & Promotores';
      case 'cheques': return 'Gestão de Cheques';
      default: return 'Painel Geral';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F17]/95 backdrop-blur-md border-b border-[#1E293B]">
      {setIsMobileFrame && (
        <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-[#080B11] border-b border-[#151D2D] text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[#00D084] font-bold border border-emerald-500/20 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse"></span>
              SHARK SYSTEM • MOBILE FIRST
            </span>
            <span className="text-gray-400">Sistema de Gestão de Empréstimos & Crédito</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFrame(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111827] text-gray-300 hover:text-white hover:bg-[#151D2D] transition border border-[#1F2937]"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#00D084]" />
              <span>Ver no Frame Mobile</span>
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-[#00D084] font-medium border border-emerald-500/30"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Modo Desktop</span>
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-3 md:px-5">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#00D084]/40 overflow-hidden p-0.5 shadow-[0_0_15px_rgba(0,208,132,0.4)] group-hover:scale-105 transition flex items-center justify-center">
              <img 
                src="/shark-avatar.png" 
                alt="Shark Logo" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div>
              <span className="text-lg font-black text-white tracking-wider uppercase font-mono leading-none flex items-center gap-1">
                SHARK <span className="text-[#00D084]">SYSTEM</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-[#111827] text-amber-400 hover:text-amber-300 transition border border-[#1F2937]"
                title={theme === 'dark' ? "Alternar para Modo Claro (Fundo Branco)" : "Alternar para Modo Escuro"}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl bg-[#111827] text-gray-300 hover:text-white transition border border-[#1F2937]"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00D084] text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setCurrentView('configuracoes')}
              className={`p-2 rounded-xl bg-[#111827] text-gray-300 hover:text-white transition border border-[#1F2937] ${
                currentView === 'configuracoes' ? 'text-[#00D084] border-[#00D084]/50' : ''
              }`}
              title="Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenProfilePopup}
              className="relative ml-1 group focus:outline-none"
              title="Ver Perfil do Operador"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00D084]/60 group-hover:ring-[#00D084] group-hover:scale-105 transition shadow-[0_0_12px_rgba(0,208,132,0.3)]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#1E293B] border-2 border-[#00D084] text-[#00D084] font-black text-sm flex items-center justify-center group-hover:scale-105 transition">
                  {userName.charAt(0)}
                </div>
              )}
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0B0F17] ${qrConnected ? 'bg-[#00D084]' : 'bg-rose-500'}`}></span>
            </button>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#151D2D] flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">
              Bem-vindo, <span className="text-white font-bold">{userName}</span>
            </p>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
              {getViewTitle()}
            </h1>
          </div>

          {currentView === 'dashboard' && onOpenQuickAction && (
            <button
              onClick={onOpenQuickAction}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-black text-xs hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.3)] active:scale-95"
            >
              <span className="text-sm font-extrabold">+</span>
              <span>Criar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
