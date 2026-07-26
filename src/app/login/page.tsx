"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, LogIn, Zap } from "lucide-react";
import { SharkHero } from "./SharkHero";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Credenciais inválidas");
      }
    } catch {
      setError("Erro ao tentar fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /**
     * ROOT: ocupa exatamente a viewport — sem overflow, sem scroll, sem bordas.
     * bg-[#021812] igual ao conteúdo interno → nenhum "buraco" preto aparece.
     */
    <div
      className="fixed inset-0 bg-[#021812] flex flex-col font-sans select-none overflow-hidden"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* ── GLOW de fundo ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ════════════════════════════════════════
          HERO — descido para ficar próximo do card
          ════════════════════════════════════════ */}
      <div className="flex flex-col items-center justify-end pb-2 px-4 z-10 relative" style={{ paddingTop: "4vh" }}>
        {/* Tubarão — tamanho reduzido para não dominar a tela */}
        <div className="w-full flex items-center justify-center"
          style={{ maxHeight: "42vh" }}
        >
          <SharkHero compact />
        </div>

        {/* Badge SHARK SYSTEM */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#053728] border border-emerald-500/40 shadow-lg mt-1">
          <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
          <span className="text-[10px] font-extrabold text-white tracking-[0.2em] uppercase">
            SHARK SYSTEM
          </span>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-black text-center text-white tracking-tight leading-none mt-2 drop-shadow-md">
          Seja Bem-vindo!
        </h1>

        {/* Subtítulo */}
        <p className="text-[10px] font-semibold text-center mt-1 text-emerald-300/60 max-w-[220px]">
          Acesse o painel para gerenciar suas operações financeiras
        </p>
      </div>

      {/* ════════════════════════════════════════
          CARD DE LOGIN — fixo na parte inferior
          ════════════════════════════════════════ */}
      <div className="w-full bg-white text-slate-900 rounded-t-[32px] px-5 pt-4 pb-6 shadow-2xl relative z-40 shrink-0">

        <form onSubmit={handleLogin} className="space-y-3">

          {/* Header do card */}
          <div className="text-center space-y-0.5 mb-1">
            <p className="text-[9px] text-slate-400 font-medium">
              Você já possui uma conta de acesso?
            </p>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Entre com suas credenciais
            </h2>
          </div>

          {/* Erro */}
          {error && (
            <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[11px] font-semibold text-center">
              {error}
            </div>
          )}

          {/* E-mail */}
          <div className="relative flex items-center bg-slate-100 rounded-xl px-3 py-2.5 border border-slate-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Mail className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail de acesso"
              className="w-full bg-transparent text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
              style={{ fontSize: '16px' }}
              required
              autoComplete="email"
            />
          </div>

          {/* Senha */}
          <div className="relative flex items-center bg-slate-100 rounded-xl px-3 py-2.5 border border-slate-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Lock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full bg-transparent text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
              style={{ fontSize: '16px' }}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors ml-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Lembrar-me + Esqueceu senha */}
          <div className="flex items-center justify-between px-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <span className="text-[11px] font-bold text-slate-500">
                Lembrar-me
              </span>
            </label>

            <button
              type="button"
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#064e3b] hover:bg-[#043e2f] active:scale-[0.98] text-white rounded-2xl font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
                <LogIn className="w-4 h-4 text-emerald-300" />
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-[9px] font-semibold text-slate-400 mt-3">
          Shark System &copy; {new Date().getFullYear()} • Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
