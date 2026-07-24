"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, LogIn, Shield, Wifi, Battery, Sparkles, DollarSign, Zap, TrendingUp, CircleDollarSign } from "lucide-react";
import Image from "next/image";
import sharkAvatar from "./shark-avatar.png";

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
    <div className="min-h-screen w-full bg-[#01140e] flex items-center justify-center p-0 sm:p-4 font-sans select-none overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* CSS para Animações Suaves e Contínuas com Aceleração de Hardware */}
      <style jsx global>{`
        @keyframes float-shield {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(6px, -10px) scale(1.03); }
          66% { transform: translate(-6px, 4px) scale(0.97); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-dollar {
          0% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(-8px, 6px) scale(0.96); }
          75% { transform: translate(8px, -8px) scale(1.04); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-zap {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(10px, -6px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-trend {
          0% { transform: translate(0px, 0px) scale(1); }
          40% { transform: translate(-5px, -8px) scale(1.03); }
          80% { transform: translate(6px, 6px) scale(0.97); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shark-breathe {
          0%, 100% { transform: scale(1.15) translateY(0px); }
          50% { transform: scale(1.17) translateY(-3px); }
        }
        .anim-shield { animation: float-shield 7s ease-in-out infinite; will-change: transform; }
        .anim-dollar { animation: float-dollar 8s ease-in-out infinite; will-change: transform; }
        .anim-zap { animation: float-zap 6s ease-in-out infinite; will-change: transform; }
        .anim-trend { animation: float-trend 9s ease-in-out infinite; will-change: transform; }
        .anim-shark { animation: shark-breathe 5s ease-in-out infinite; will-change: transform; }
      `}</style>

      {/* Main Mobile Frame Container */}
      <div className="w-full max-w-[390px] h-screen sm:h-[790px] bg-[#021f17] sm:rounded-[44px] shadow-2xl shadow-black/90 border-0 sm:border-[8px] sm:border-[#064e3b] flex flex-col justify-between relative overflow-hidden">
        
        {/* Ambient Decorative Orbs */}
        <div className="absolute top-14 left-6 w-4 h-4 rounded-full bg-emerald-500/10 blur-[2px] animate-pulse" />
        <div className="absolute top-24 right-7 w-5 h-5 rounded-full bg-emerald-400/15 blur-[2px]" />

        {/* Top Mobile Bar Header */}
        <div className="pt-3.5 px-6 flex items-center justify-between z-40 text-emerald-100/90 text-xs font-semibold tracking-tight shrink-0">
          <span>9:41</span>
          {/* Dynamic Island Notch */}
          <div className="w-24 h-4.5 bg-[#01140e] rounded-full flex items-center justify-end px-2.5 gap-1.5 border border-emerald-900/40 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5 text-emerald-200">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* TOP HERO SECTION: CLEAN CONSTANT SMOOTH ANIMATION */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-1 z-20 relative">
          
          {/* AVATAR HERO WINDOW */}
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 my-1 flex items-center justify-center shrink-0">
            
            {/* TUBARÃO GIGANTE - SEM CORTES - ANIMAÇÃO SUAVE DE RESPIRAÇÃO */}
            <div className="w-44 h-44 sm:w-48 sm:h-48 relative flex items-center justify-center z-10 anim-shark">
              <Image
                src={sharkAvatar}
                alt="Shark System 3D Hero"
                placeholder="blur"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(16,185,129,0.25)]"
                priority
              />
            </div>

            {/* FLOATING 3D ICONS - MAIORES, COM BACKDROP BLUR E MOVIMENTOS INDEPENDENTES */}

            {/* Ícone 1: Escudo (Top Left) */}
            <div className="absolute top-0 left-0 z-20 p-2.5 rounded-2xl bg-[#064e3b]/80 backdrop-blur-md border border-emerald-400/40 shadow-lg text-emerald-300 anim-shield">
              <Shield className="w-5 h-5 text-emerald-300 fill-emerald-300/10" />
            </div>

            {/* Ícone 2: Moeda de Ouro (Top Right) */}
            <div className="absolute top-1 right-0 z-20 p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/80 to-amber-700/80 backdrop-blur-md border border-amber-400/40 shadow-lg text-white anim-dollar">
              <CircleDollarSign className="w-5 h-5 text-amber-200 fill-amber-300/20" />
            </div>

            {/* Ícone 3: Raio Verde (Bottom Left) */}
            <div className="absolute bottom-2 left-0 z-20 p-2.5 rounded-2xl bg-[#064e3b]/80 backdrop-blur-md border border-emerald-400/40 shadow-lg text-emerald-300 anim-zap">
              <Zap className="w-5 h-5 text-emerald-300 fill-emerald-300/20" />
            </div>

            {/* Ícone 4: Cifrão / Tendência (Bottom Right) */}
            <div className="absolute bottom-3 right-0 z-20 p-2.5 rounded-2xl bg-[#064e3b]/80 backdrop-blur-md border border-emerald-400/40 shadow-lg text-emerald-300 anim-trend">
              <TrendingUp className="w-5 h-5 text-emerald-300" />
            </div>

          </div>

          {/* Top Brand Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064e3b] border border-emerald-400/50 mb-1.5 mt-2 shrink-0 shadow-lg z-30">
            <Zap className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
            <span className="text-[11px] font-extrabold text-white tracking-[0.2em] uppercase">
              SHARK SYSTEM
            </span>
          </div>

          {/* Big Main Title: Seja Bem-vindo! */}
          <h1 className="text-2xl sm:text-3xl font-black text-center text-white tracking-tight leading-tight drop-shadow-md shrink-0 z-30">
            Seja Bem-vindo!
          </h1>
          
          {/* Subtitle */}
          <p className="text-[11px] text-emerald-200/70 font-medium text-center mt-0.5 max-w-[230px] shrink-0 z-30">
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
