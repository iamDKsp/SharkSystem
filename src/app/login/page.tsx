"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, Wifi, Battery } from "lucide-react";
import Image from "next/image";

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
    <div className="min-h-screen bg-[#070b09] flex items-center justify-center p-0 sm:p-6 font-sans select-none overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Mobile Frame Container */}
      <div className="w-full max-w-[410px] h-screen sm:h-[840px] bg-[#0c120e] sm:rounded-[48px] shadow-2xl shadow-emerald-950/50 border-0 sm:border-[8px] sm:border-[#1a261f] flex flex-col justify-between relative overflow-hidden">
        
        {/* Floating Decorative Orbs (Like reference image) */}
        <div className="absolute top-14 left-5 w-5 h-5 rounded-full bg-emerald-300/40 blur-[1px] animate-pulse" />
        <div className="absolute top-28 right-6 w-7 h-7 rounded-full bg-emerald-400/30 blur-[1px]" />
        <div className="absolute top-44 left-4 w-4 h-4 rounded-full bg-teal-200/50 blur-[1px]" />
        <div className="absolute top-[340px] right-4 w-3.5 h-3.5 rounded-full bg-emerald-200/60 blur-[0.5px]" />
        <div className="absolute top-[370px] left-3 w-6 h-6 rounded-full bg-cyan-300/30 blur-[1px]" />

        {/* Top Mobile Bar Header */}
        <div className="pt-3 px-7 flex items-center justify-between z-20 text-white/80 text-xs font-semibold tracking-tight">
          <span>9:41</span>
          {/* Dynamic Island Notch */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1 border border-white/10 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Top Header Section (Avatars & Big Title) */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-2 z-10 relative">
          
          {/* Floating 3D Avatars Cluster */}
          <div className="relative w-48 h-36 mb-4 flex items-center justify-center">
            
            {/* Avatar Top Left */}
            <div className="absolute top-0 left-2 w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2.5px] shadow-lg shadow-emerald-500/20 transform -rotate-6 transition-transform hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#131f17] flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-b from-emerald-400/30 to-emerald-900/60 flex items-center justify-center text-white font-bold text-lg">
                  👨‍💼
                </div>
              </div>
            </div>

            {/* Avatar Top Right */}
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-300 p-[2.5px] shadow-lg shadow-teal-500/20 transform rotate-6 transition-transform hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#131f17] flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-b from-teal-400/30 to-teal-900/60 flex items-center justify-center text-white font-bold text-lg">
                  👩‍💻
                </div>
              </div>
            </div>

            {/* Avatar Bottom Center (Main) */}
            <div className="absolute bottom-1 w-18 h-18 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-300 to-teal-200 p-[3px] shadow-xl shadow-emerald-500/30 z-10 transition-transform hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#0e1812] flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-b from-emerald-300/40 to-emerald-950/80 flex items-center justify-center text-white font-bold text-xl">
                  🚀
                </div>
              </div>
            </div>

            {/* Floating Glass Pill Badge (Dei -> Shark) */}
            <div className="absolute top-10 z-20 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs shadow-lg tracking-wide animate-bounce" style={{ animationDuration: '3s' }}>
              SharkSystem
            </div>
          </div>

          {/* Main Title (Identical to "Let's get you signed in!") */}
          <h1 className="text-3xl font-black text-center text-white tracking-tight leading-[1.15] max-w-[260px]">
            Let&apos;s get you signed in!
          </h1>
          <p className="text-xs text-emerald-400/80 font-medium text-center mt-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Soluções Financeiras Inteligentes
          </p>
        </div>

        {/* Bottom Curved White Form Card */}
        <div className="w-full bg-white dark:bg-[#ffffff] text-slate-900 rounded-t-[38px] pt-7 px-7 pb-4 shadow-2xl relative z-20 flex flex-col justify-between">
          
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Top Subtitle & Signup Prompt */}
            <div className="text-center space-y-1 mb-2">
              <p className="text-xs text-slate-400 font-medium">
                Você já possui uma conta de acesso?
              </p>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Entre com suas credenciais
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center animate-shake">
                {error}
              </div>
            )}

            {/* Input E-mail */}
            <div className="space-y-1">
              <div className="relative flex items-center bg-slate-100/90 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 transition-all border border-slate-200/60">
                <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl shadow-xs border border-slate-200/80 text-slate-700 font-bold text-xs">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>E-mail</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-transparent px-3 py-2 text-slate-900 text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <div className="relative flex items-center bg-slate-100/90 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 transition-all border border-slate-200/60">
                <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl shadow-xs border border-slate-200/80 text-slate-700 font-bold text-xs">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Senha</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-2 text-slate-900 text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                className="text-xs font-bold text-slate-800 hover:text-emerald-600 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Curved Bottom Action Button Notch (Replicating exact design) */}
            <div className="pt-2 pb-1 flex justify-center relative">
              
              {/* Bottom Arch SVG Notch */}
              <div className="w-full flex justify-center items-center relative">
                
                {/* Embedded Pill Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-48 py-3.5 bg-[#0c120e] hover:bg-[#141e18] text-white rounded-full font-extrabold text-sm tracking-wide shadow-xl shadow-slate-900/30 active:scale-95 transition-all flex items-center justify-center gap-2 border border-emerald-900/50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </>
                  )}
                </button>

              </div>
            </div>

          </form>

          {/* Footer note */}
          <p className="text-center text-[10px] font-semibold text-slate-400 pt-3 pb-1">
            SharkSystem &copy; {new Date().getFullYear()} • Todos os direitos reservados
          </p>

        </div>

      </div>
    </div>
  );
}
