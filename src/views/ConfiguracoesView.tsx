import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, MessageSquare, Key, Percent, ShieldCheck, Bell } from 'lucide-react';
import { SystemSettings } from '../types';

interface ConfiguracoesViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [form, setForm] = useState<SystemSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      
      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-[#00D084] text-[#00D084] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Configurações do Shark System atualizadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
          <h3 className="text-xs font-black text-[#00D084] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Dados da Financeira
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Nome da Marca / Empresa
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Subtítulo do Header
              </label>
              <input
                type="text"
                value={form.companySubtext}
                onChange={(e) => setForm({ ...form, companySubtext: e.target.value })}
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
          <h3 className="text-xs font-black text-[#00D084] uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Parâmetros Padrão de Empréstimo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Taxa de Juros Padrão (%)
              </label>
              <input
                type="number"
                value={form.defaultInterestRate}
                onChange={(e) => setForm({ ...form, defaultInterestRate: Number(e.target.value) })}
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00D084] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Multa por Dia de Atraso (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.defaultLateFeeRate}
                onChange={(e) => setForm({ ...form, defaultLateFeeRate: Number(e.target.value) })}
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00D084] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Chave PIX Principal
              </label>
              <input
                type="text"
                value={form.pixKey}
                onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
                className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
          <h3 className="text-xs font-black text-[#00D084] uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Modelos de Mensagem WhatsApp
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Mensagem de Lembrete de Vencimento
            </label>
            <textarea
              rows={3}
              value={form.whatsappGreetingTemplate}
              onChange={(e) => setForm({ ...form, whatsappGreetingTemplate: e.target.value })}
              className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00D084] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Mensagem de Cobrança para Parcela Atrasada
            </label>
            <textarea
              rows={3}
              value={form.whatsappOverdueTemplate}
              onChange={(e) => setForm({ ...form, whatsappOverdueTemplate: e.target.value })}
              className="w-full bg-[#0B0F17] border border-[#1F2937] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00D084] font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00D084] to-[#10B981] text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_20px_rgba(0,208,132,0.3)]"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Alterações</span>
        </button>
      </form>

    </div>
  );
};
