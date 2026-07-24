"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, LogIn, Shield, Wifi, Battery, Sparkles, DollarSign, Zap, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen w-full bg-[#021812] flex items-center justify-center p-0 sm:p-4 font-sans select-none overflow-hidden">
      {/* Dynamic Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Mobile Frame Container */}
      <div className="w-full max-w-[390px] h-screen sm:h-[790px] bg-[#03241b] sm:rounded-[44px] shadow-2xl shadow-black/80 border-0 sm:border-[8px] sm:border-[#064e3b] flex flex-col justify-between relative overflow-hidden">
        
        {/* Ambient Decorative Orbs */}
        <div className="absolute top-14 left-6 w-4 h-4 rounded-full bg-emerald-500/20 blur-[1px] animate-pulse" />
        <div className="absolute top-24 right-7 w-5 h-5 rounded-full bg-emerald-400/25 blur-[1px]" />
        <div className="absolute top-44 left-5 w-3.5 h-3.5 rounded-full bg-emerald-300/20 blur-[1px]" />
        <div className="absolute top-[280px] right-6 w-4 h-4 rounded-full bg-emerald-400/20 blur-[0.5px]" />

        {/* Top Mobile Bar Header */}
        <div className="pt-3.5 px-6 flex items-center justify-between z-30 text-emerald-100/90 text-xs font-semibold tracking-tight shrink-0">
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

        {/* Top Header Section (Large Shark Avatar & 3D Orbital Parallax) */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-1 z-10 relative">
          
          {/* 3D PARALLAX SHARK AVATAR CONTAINER */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 my-1 flex items-center justify-center shrink-0">
            
            {/* Dashed outer orbit ring */}
            <div className="absolute inset-[-8px] rounded-full border-[2px] border-dashed border-emerald-400/30 animate-spin z-0" style={{ animationDuration: '24s' }} />

            {/* Glowing 3D Laser Ray Ring (Behind Avatar) */}
            <div className="absolute w-[200px] h-[65px] rounded-[100%] border-[3px] border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.7)] transform -rotate-12 z-0 animate-pulse" />
            
            {/* Floating Parallax Icon 1: Shield (Top Left) */}
            <div className="absolute top-0 left-0 z-20 p-2 rounded-2xl bg-[#064e3b] border border-emerald-400/50 shadow-lg text-emerald-300 animate-bounce" style={{ animationDuration: '3.5s' }}>
              <Shield className="w-4 h-4" />
            </div>

            {/* Floating Parallax Icon 2: Dollar (Top Right) */}
            <div className="absolute top-1 right-0 z-20 p-2 rounded-2xl bg-[#064e3b] border border-emerald-400/50 shadow-lg text-emerald-300 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
              <DollarSign className="w-4 h-4" />
            </div>

            {/* Floating Parallax Icon 3: Lightning (Bottom Left) */}
            <div className="absolute bottom-1 left-0 z-20 p-2 rounded-2xl bg-[#064e3b] border border-emerald-400/50 shadow-lg text-emerald-300 animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '1s' }}>
              <Zap className="w-4 h-4 text-emerald-300 fill-emerald-300" />
            </div>

            {/* Floating Parallax Icon 4: Trending Up (Bottom Right) */}
            <div className="absolute bottom-2 right-0 z-20 p-2 rounded-2xl bg-[#064e3b] border border-emerald-400/50 shadow-lg text-emerald-300 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>
              <TrendingUp className="w-4 h-4" />
            </div>

            {/* MAIN SHARK AVATAR (GIGANTE E 100% GARANTIDO DE CARREGAR) */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full p-[3px] bg-gradient-to-tr from-emerald-400 via-emerald-300 to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.6)] z-10 overflow-hidden relative flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#021f17] overflow-hidden flex items-center justify-center relative">
                <Image
                  src={sharkAvatar}
                  alt="Shark System Avatar"
                  placeholder="blur"
                  className="w-full h-full object-cover object-center transform scale-110"
                  priority
                />
              </div>
            </div>

            {/* Front Glowing Ring Arc (In front of Avatar) */}
            <div className="absolute w-[200px] h-[65px] rounded-[100%] border-t-[3px] border-r-[3px] border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.9)] transform -rotate-12 z-20 pointer-events-none" />
          </div>

          {/* Top Brand Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064e3b] border border-emerald-400/50 mb-1.5 mt-2 shrink-0 shadow-md">
            <Zap className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
            <span className="text-[11px] font-extrabold text-white tracking-[0.2em] uppercase">
              SHARK SYSTEM
            </span>
          </div>

          {/* Big Main Title: Seja Bem-vindo! */}
          <h1 className="text-2xl sm:text-3xl font-black text-center text-white tracking-tight leading-tight drop-shadow-md shrink-0">
            Seja Bem-vindo!
          </h1>
          
          {/* Subtitle */}
          <p className="text-[11px] text-emerald-200/70 font-medium text-center mt-0.5 max-w-[230px] shrink-0">
            Acesse o painel para gerenciar suas operações financeiras
          </p>
        </div>

        {/* Bottom Curved White Form Card */}
        <div className="w-full bg-white text-slate-900 rounded-t-[34px] pt-4 px-6 pb-4 shadow-2xl relative z-30 shrink-0 flex flex-col justify-between">
          
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
