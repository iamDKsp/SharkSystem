import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, X, ShieldCheck, Smartphone, KeyRound, Sparkles } from 'lucide-react';

interface ProfileAvatarPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  avatarUrl: string | null;
  qrConnected: boolean;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const ProfileAvatarPopup: React.FC<ProfileAvatarPopupProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  avatarUrl,
  qrConnected,
  onOpenProfile,
  onLogout,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="relative w-full max-w-sm bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 shadow-2xl z-10 text-center overflow-hidden"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#1E293B] text-gray-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </motion.button>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#00D084]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 mb-4">
              <div className="w-full h-full rounded-3xl overflow-hidden ring-4 ring-[#00D084]/50 shadow-[0_0_25px_rgba(0,208,132,0.35)] bg-[#1E293B] flex items-center justify-center p-0.5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-[#1E293B] text-[#00D084] font-black text-3xl flex items-center justify-center">
                    {userName.charAt(0)}
                  </div>
                )}
              </div>

              <div 
                className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border border-[#0B0F17] shadow-lg ${
                  qrConnected ? 'bg-[#00D084] text-slate-950' : 'bg-rose-500 text-white'
                }`}
                title={qrConnected ? 'Celular Conectado via QR Code' : 'Celular Desconectado'}
              >
                <Smartphone className="w-3 h-3" />
                <span>{qrConnected ? 'QR ON' : 'OFF'}</span>
              </div>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">{userName}</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{userEmail}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D084]/10 border border-[#00D084]/30 text-[#00D084] text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acesso Master Administrador</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  onClose();
                  onOpenProfile();
                }}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,208,132,0.25)] transition"
              >
                <User className="w-4 h-4 stroke-[2.5]" />
                <span>Meu Perfil</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="py-3 px-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
