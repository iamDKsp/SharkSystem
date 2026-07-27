import React, { useState } from 'react';
import { X, MessageSquare, Send, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  phone: string;
  loanCode: string;
  amount: number;
  dueDate: string;
  daysOverdue?: number;
  templateType?: 'lembrete' | 'atraso' | 'notificacao';
  loanId?: string;
  onMarkCobrado?: (loanId: string) => Promise<void>;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  clientName,
  phone,
  loanCode,
  amount,
  dueDate,
  daysOverdue = 0,
  templateType = 'lembrete',
  loanId,
  onMarkCobrado,
}) => {
  const [copied, setCopied] = useState(false);
  const [sendMethod, setSendMethod] = useState<'app' | 'server'>('app');
  const [currentTemplate, setCurrentTemplate] = useState<'lembrete' | 'atraso' | 'notificacao'>(templateType);
  const [isSendingServer, setIsSendingServer] = useState(false);

  if (!isOpen) return null;

  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const getMessageText = () => {
    const formattedAmount = `R$ ${(Number(amount) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    if (currentTemplate === 'lembrete') {
      return `Olá *${clientName}*, tudo bem?\n\nPassando para lembrar que a sua parcela do contrato *${loanCode}* no valor de *${formattedAmount}* vence em *${dueDate}*.\n\nPara facilitar o pagamento, nossa chave PIX é: *financeira@shark.com.br*.\n\nQualquer dúvida estamos à disposição! 👍🏼`;
    }
    
    if (currentTemplate === 'atraso') {
      return `Atenção *${clientName}*,\n\nIdentificamos que a sua parcela do contrato *${loanCode}* no valor de *${formattedAmount}* encontra-se com *${daysOverdue || 5} dias de atraso*.\n\nPedimos a gentileza de entrar em contato para regularização e evitar a inclusão de encargos diários de mora.\n\nChave PIX Oficial: *financeira@shark.com.br*\n\nShark System - Gestão Financeira`;
    }

    return `NOTIFICAÇÃO EXTRAJUDICIAL DE COBRANÇA\n\nPrezado(a) *${clientName}*,\n\nConsta em nosso sistema o débito em aberto do contrato *${loanCode}*, com vencimento em *${dueDate}*, no valor total de *${formattedAmount}*.\n\nSolicitamos a quitação imediata dentro do prazo de 24 horas para evitar medidas administrativas adicionais.\n\nAtenciosamente,\n*Shark System - Departamento de Cobrança*`;
  };

  const messageText = getMessageText();

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = async () => {
    if (loanId && onMarkCobrado) {
      try {
        await onMarkCobrado(loanId);
      } catch (e) {
        console.error("Erro ao registrar cobrança:", e);
      }
    }

    if (sendMethod === 'server') {
      try {
        setIsSendingServer(true);
        await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formattedPhone, message: messageText }),
        });
        alert(`Cobrança disparada com sucesso via servidor Baileys para ${clientName}!`);
        onClose();
      } catch (err) {
        console.error("Erro no envio pelo servidor, abrindo App:", err);
        const encodedText = encodeURIComponent(messageText);
        window.open(`https://wa.me/${formattedPhone}?text=${encodedText}`, '_blank');
      } finally {
        setIsSendingServer(false);
      }
    } else {
      const encodedText = encodeURIComponent(messageText);
      window.open(`https://wa.me/${formattedPhone}?text=${encodedText}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-[#00D084] flex items-center justify-center border border-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Enviar Mensagem WhatsApp</h3>
              <p className="text-xs text-gray-400">{clientName} • {phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#151D2D] text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 p-1 rounded-xl bg-[#0B0F17] border border-[#1F2937]">
          <button
            onClick={() => setSendMethod('app')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition ${
              sendMethod === 'app' ? 'bg-[#00D084] text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            📱 Abrir Web / App
          </button>
          <button
            onClick={() => setSendMethod('server')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition ${
              sendMethod === 'server' ? 'bg-[#00D084] text-slate-950 shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            🤖 Servidor Baileys
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 my-3">
          <button
            onClick={() => setCurrentTemplate('lembrete')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition ${
              currentTemplate === 'lembrete'
                ? 'bg-emerald-500/20 border-[#00D084] text-[#00D084]'
                : 'bg-[#0B0F17] border-[#1F2937] text-gray-400 hover:text-white'
            }`}
          >
            Lembrete Amigável
          </button>
          <button
            onClick={() => setCurrentTemplate('atraso')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition ${
              currentTemplate === 'atraso'
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : 'bg-[#0B0F17] border-[#1F2937] text-gray-400 hover:text-white'
            }`}
          >
            Aviso de Atraso
          </button>
          <button
            onClick={() => setCurrentTemplate('notificacao')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition ${
              currentTemplate === 'notificacao'
                ? 'bg-red-500/20 border-red-500 text-red-400'
                : 'bg-[#0B0F17] border-[#1F2937] text-gray-400 hover:text-white'
            }`}
          >
            Notificação Extra
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1F2937] text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed relative my-3">
          {messageText}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={handleCopy}
            className="py-2.5 px-3 rounded-xl bg-[#151D2D] text-gray-200 border border-[#1F2937] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1E293B] transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#00D084]" />
                <span className="text-[#00D084]">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-400" />
                <span>Copiar Texto</span>
              </>
            )}
          </button>

          <button
            onClick={handleSendWhatsApp}
            disabled={isSendingServer}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(0,208,132,0.3)] disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSendingServer ? 'Disparando...' : sendMethod === 'server' ? 'Enviar pelo Servidor' : 'Abrir WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
