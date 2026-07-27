import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  KeyRound, 
  Smartphone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  ShieldCheck, 
  Camera, 
  Image as ImageIcon, 
  Trash2, 
  Lock, 
  RefreshCw,
  Mail,
  Check
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  userPassword: string;
  setUserPassword: (pwd: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  qrConnected: boolean;
  setQrConnected: (connected: boolean) => void;
  qrPhoneDevice: string;
  setQrPhoneDevice: (device: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  setUserName,
  userEmail,
  userPassword,
  setUserPassword,
  avatarUrl,
  setAvatarUrl,
  qrConnected,
  setQrConnected,
  qrPhoneDevice,
  setQrPhoneDevice,
}) => {
  const [activeTab, setActiveTab] = useState<'dados' | 'senha' | 'qrcode'>('dados');
  const [nameInput, setNameInput] = useState(userName);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileData = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(nameInput);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem. Digite novamente.');
      return;
    }

    setUserPassword(newPassword);
    setPasswordSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const [liveQr, setLiveQr] = useState<string | null>(null);
  const [waStatus, setWaStatus] = useState<string>('disconnected');
  const [loadingStatus, setLoadingStatus] = useState(false);

  React.useEffect(() => {
    if (!isOpen || activeTab !== 'qrcode') return;

    let isMounted = true;
    const fetchStatus = async () => {
      try {
        setLoadingStatus(true);
        const res = await fetch('/api/whatsapp/status');
        const data = await res.json();
        if (isMounted) {
          setWaStatus(data.status || 'disconnected');
          setLiveQr(data.qr || null);
          if (data.status === 'connected') {
            setQrConnected(true);
            setQrPhoneDevice('WhatsApp Web (Baileys Connected)');
          } else {
            setQrConnected(false);
            setQrPhoneDevice('Aparelho Desconectado');
          }
        }
      } catch (e) {
        console.error("Erro ao buscar status do WhatsApp:", e);
      } finally {
        if (isMounted) setLoadingStatus(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, activeTab, setQrConnected, setQrPhoneDevice]);

  const handleToggleQrConnection = async () => {
    if (qrConnected || waStatus === 'connected') {
      try {
        setIsScanning(true);
        await fetch('/api/whatsapp/logout', { method: 'POST' });
        setQrConnected(false);
        setWaStatus('disconnected');
        setLiveQr(null);
        setQrPhoneDevice('Nenhum aparelho conectado');
      } catch (e) {
        console.error("Erro ao desconectar:", e);
      } finally {
        setIsScanning(false);
      }
    } else {
      setIsScanning(true);
      try {
        const res = await fetch('/api/whatsapp/status');
        const data = await res.json();
        setWaStatus(data.status || 'disconnected');
        setLiveQr(data.qr || null);
      } catch (e) {
        console.error("Erro ao atualizar QR:", e);
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative w-full max-w-xl bg-[#0F172A] border border-[#1E293B] rounded-3xl p-5 sm:p-6 shadow-2xl z-10 flex flex-col justify-between my-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#00D084]/10 border border-[#00D084]/30 text-[#00D084]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Meu Perfil do Operador</h2>
                  <p className="text-xs text-gray-400">Gerencie sua foto, dados, senha e conexão do celular</p>
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

            <div className="flex items-center gap-1.5 p-1 bg-[#0B0F17] rounded-2xl border border-[#1E293B] mb-5">
              <button
                onClick={() => setActiveTab('dados')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'dados'
                    ? 'bg-[#00D084] text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Dados e Foto</span>
              </button>

              <button
                onClick={() => setActiveTab('senha')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'senha'
                    ? 'bg-[#00D084] text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Senha e Acesso</span>
              </button>

              <button
                onClick={() => setActiveTab('qrcode')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 relative ${
                  activeTab === 'qrcode'
                    ? 'bg-[#00D084] text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>QR Code Celular</span>
                <span className={`w-2 h-2 rounded-full ${qrConnected ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              </button>
            </div>

            {activeTab === 'dados' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#1E293B] space-y-3">
                  <label className="text-xs font-bold text-gray-300 block">Foto de Perfil do Operador</label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-[#00D084]/50 bg-[#1E293B] shrink-0 flex items-center justify-center shadow-lg">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1E293B] text-[#00D084] font-black text-2xl flex items-center justify-center">
                          {userName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.25)]">
                          <Camera className="w-4 h-4 stroke-[2.5]" />
                          <span>{avatarUrl ? 'Subir Nova Foto' : 'Escolher Foto (Celular/PC)'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>

                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setAvatarUrl(null)}
                            className="py-2.5 px-3 rounded-xl bg-[#1E293B] border border-gray-700 text-gray-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
                            title="Remover foto (exibir inicial)"
                          >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                            <span>Sem Foto</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-400">
                        Selecione uma foto da sua galeria no celular ou do computador (JPG, PNG).
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfileData} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 mb-1 block">Nome do Operador</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      className="w-full bg-[#0B0F17] border border-[#1E293B] focus:border-[#00D084] rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none transition font-semibold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#00D084]" />
                        <span>E-mail do Operador</span>
                      </label>
                      <span className="text-[10px] text-amber-400 font-mono font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Não pode ser alterado por segurança
                      </span>
                    </div>

                    <div className="w-full bg-[#111827]/80 border border-[#1E293B] rounded-2xl px-4 py-2.5 text-sm text-gray-400 font-mono flex items-center justify-between cursor-not-allowed select-none">
                      <span>{userEmail}</span>
                      <ShieldCheck className="w-4 h-4 text-[#00D084]" />
                    </div>
                  </div>

                  {profileSavedMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#00D084] text-xs font-bold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Nome e perfil atualizados com sucesso!</span>
                    </motion.div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-extrabold text-xs shadow-lg shadow-[#00D084]/20 transition"
                  >
                    Salvar Alterações de Perfil
                  </motion.button>
                </form>
              </div>
            )}

            {activeTab === 'senha' && (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#0B0F17] border border-[#1E293B]">
                  <label className="text-xs font-bold text-gray-400 mb-1 block">Sua Senha Atual Registrada</label>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white tracking-widest">
                      {showPassword ? userPassword : '••••••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-lg bg-[#1E293B] text-gray-400 hover:text-white transition"
                      title={showPassword ? 'Ocultar Senha' : 'Ver Senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 mb-1 block">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    className="w-full bg-[#0B0F17] border border-[#1E293B] focus:border-[#00D084] rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 mb-1 block">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    required
                    className="w-full bg-[#0B0F17] border border-[#1E293B] focus:border-[#00D084] rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                  />
                </div>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#00D084] text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Senha alterada com sucesso! Utilize a nova senha na próxima sessão.</span>
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-extrabold text-xs shadow-lg shadow-[#00D084]/20 transition"
                >
                  Atualizar Senha Agora
                </motion.button>
              </form>
            )}

            {activeTab === 'qrcode' && (
              <div className="space-y-4 text-center">
                <div className={`p-4 rounded-2xl border text-left flex items-center justify-between ${
                  qrConnected 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${qrConnected ? 'bg-[#00D084] text-slate-950' : 'bg-rose-500 text-white'}`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        Status: {qrConnected ? 'CONECTADO COM O CELULAR' : 'DESCONECTADO'}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{qrPhoneDevice}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    qrConnected ? 'bg-[#00D084] text-slate-950' : 'bg-rose-500 text-white'
                  }`}>
                    {qrConnected ? 'Ativo' : 'Offline'}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0B0F17] border border-[#1E293B] flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]">
                  {isScanning ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <RefreshCw className="w-10 h-10 text-[#00D084] animate-spin" />
                      <p className="text-xs font-bold text-white">Sincronizando com WhatsApp Web...</p>
                      <p className="text-[11px] text-gray-400">Aguarde a validação do token do celular</p>
                    </div>
                  ) : qrConnected ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="w-16 h-16 rounded-full bg-[#00D084]/15 border-2 border-[#00D084] flex items-center justify-center text-[#00D084] shadow-[0_0_20px_rgba(0,208,132,0.3)]">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h4 className="text-sm font-black text-white">WhatsApp & Notificações Ativas</h4>
                      <p className="text-xs text-gray-400 max-w-xs">
                        Mensagens automáticas de cobrança e lembretes de vencimento enviadas direto pelo seu celular.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      {liveQr ? (
                        <div className="p-3 bg-white rounded-2xl shadow-xl relative group">
                          <img src={liveQr} alt="QR Code WhatsApp Baileys" className="w-44 h-44 object-contain rounded-xl" />
                          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none rounded-xl" />
                        </div>
                      ) : (
                        <div className="p-3 bg-white rounded-2xl shadow-xl relative group">
                          <div className="w-36 h-36 border-4 border-slate-900 bg-slate-950 rounded-xl p-2 flex flex-col items-center justify-center relative">
                            <QrCode className="w-28 h-28 text-white" />
                            <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse rounded-xl" />
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-300 font-bold">Abra o WhatsApp no celular &gt; Aparelhos Conectados &gt; Conectar um Aparelho</p>
                    </div>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleToggleQrConnection}
                  disabled={isScanning}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition ${
                    qrConnected
                      ? 'bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white'
                      : 'bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 shadow-lg shadow-[#00D084]/25'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {qrConnected ? 'Desconectar Aparelho do Celular' : 'Escanear QR Code & Conectar'}
                  </span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
