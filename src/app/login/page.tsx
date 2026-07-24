"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, LogIn, Wifi, Battery, Zap } from "lucide-react";
import { SharkHero } from "./SharkHero";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    } catch (err) {
      setError("Erro ao tentar fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#01100b] flex items-center justify-center p-0 sm:p-4 font-sans select-none overflow-hidden relative">
      {/* Background Teal bloom glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#10b981]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Mobile Frame Container */}
      <div className="w-full max-w-[390px] h-screen sm:h-[790px] bg-[#021812] sm:rounded-[44px] shadow-2xl shadow-black/95 border-0 sm:border-[8px] sm:border-[#064e3b]/80 flex flex-col justify-between relative overflow-hidden">
        
        {/* Top Mobile Bar Header */}
        <div className="pt-3.5 px-6 flex items-center justify-between z-40 text-emerald-100/90 text-xs font-semibold tracking-tight shrink-0">
          <span>9:41</span>
          {/* Dynamic Island Notch */}
          <div className="w-24 h-4.5 bg-black/40 rounded-full flex items-center justify-end px-2.5 gap-1.5 border border-emerald-950/20 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300/80">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* HERO SECTION - REPRODUCING LUX-ORBIT-ZEN SHARKHERO */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-2 pb-1 z-20 relative select-none">
          
          {/* SHARK HERO COMPONENT */}
          <SharkHero />

          {/* Top Brand Tag (Espaçamento ideal de 50px do tubarão) */}
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#053728] border border-emerald-500/40 shrink-0 shadow-lg z-30"
            style={{ marginTop: "10px" }}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span className="text-[11px] font-extrabold text-white tracking-[0.2em] uppercase">
              SHARK SYSTEM
            </span>
          </div>

          {/* Title: Seja Bem-vindo! */}
          <h1 className="text-2xl sm:text-3xl font-black text-center text-white tracking-tight leading-none mt-3.5 drop-shadow-md shrink-0 z-30">
            Seja Bem-vindo!
          </h1>
          
          {/* Subtitle */}
          <p className="text-[11px] text-emerald-300/60 font-semibold text-center mt-1.5 max-w-[230px] shrink-0 z-30">
            Acesse o painel para gerenciar suas operações financeiras
          </p>
        </div>

        {/* Bottom Curved White Form Card */}
        <div className="w-full bg-white text-slate-900 rounded-t-[34px] pt-4 px-6 pb-4 shadow-2xl relative z-40 shrink-0 flex flex-col justify-between">
          
          <form onSubmit={handleLogin} className="space-y-2.5">
            
            {/* Subtitle & Prompt */}
            <div className="text-center space-y-0.5 mb-1">
              <p className="text-[10px] text-slate-400 font-medium">
                Você já possui uma conta de acesso?
              </p>
              <h2 className="text-xs font-extrabold text-slate-900 tracking-tight">
                Entre com suas credenciais
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Input E-mail */}
            <div className="space-y-1">
              <div className="relative flex items-center bg-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Mail className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail de acesso"
                  className="w-full bg-transparent text-slate-900 text-xs font-semibold focus:outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <div className="relative flex items-center bg-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Lock className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full bg-transparent text-slate-900 text-xs font-semibold focus:outline-none placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors ml-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                className="text-[11px] font-bold text-slate-700 hover:text-emerald-700 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Clean Curved Bottom Action Button */}
            <div className="pt-1.5 pb-0.5 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-48 py-3 bg-[#064e3b] hover:bg-[#043e2f] active:scale-95 text-white rounded-full font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <LogIn className="w-3.5 h-3.5 text-emerald-300" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footer note */}
          <p className="text-center text-[9px] font-semibold text-slate-400 pt-2 pb-0.5">
            Shark System &copy; {new Date().getFullYear()} • Todos os direitos reservados
          </p>

        </div>

      </div>
    </div>
  );
}
