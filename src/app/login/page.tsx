"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, LogIn, Shield, Wifi, Battery } from "lucide-react";

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
    <div className="min-h-screen bg-[#041f17] flex items-center justify-center p-0 sm:p-6 font-sans select-none overflow-hidden relative">
      {/* Soft background ambient gradient using standard system emerald */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-700/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Mobile Frame Container */}
      <div className="w-full max-w-[400px] h-screen sm:h-[820px] bg-[#032a1f] sm:rounded-[44px] shadow-2xl shadow-black/60 border-0 sm:border-[8px] sm:border-[#064e3b] flex flex-col justify-between relative overflow-hidden">
        
        {/* Subtle Decorative Floating Orbs (System colors) */}
        <div className="absolute top-16 left-6 w-5 h-5 rounded-full bg-emerald-500/20 blur-[1px]" />
        <div className="absolute top-28 right-7 w-6 h-6 rounded-full bg-emerald-400/25 blur-[1px]" />
        <div className="absolute top-48 left-5 w-4 h-4 rounded-full bg-emerald-300/30 blur-[1px]" />
        <div className="absolute top-[320px] right-6 w-4 h-4 rounded-full bg-emerald-400/20 blur-[0.5px]" />

        {/* Top Mobile Bar Header */}
        <div className="pt-3.5 px-7 flex items-center justify-between z-20 text-emerald-100/90 text-xs font-semibold tracking-tight">
          <span>9:41</span>
          {/* Dynamic Island Notch */}
          <div className="w-24 h-5 bg-[#01140e] rounded-full flex items-center justify-end px-2.5 gap-1.5 border border-emerald-900/40 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5 text-emerald-200">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Top Header Section (Avatars & Portugese Title) */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-2 pb-2 z-10 relative">
          
          {/* 3D Avatars Cluster */}
          <div className="relative w-48 h-36 mb-5 flex items-center justify-center">
            
            {/* Avatar Top Left */}
            <div className="absolute top-0 left-3 w-15 h-15 rounded-full bg-[#064e3b] p-[2px] shadow-lg border border-emerald-400/30 transform -rotate-6">
              <div className="w-full h-full rounded-full bg-[#02241b] flex items-center justify-center overflow-hidden">
                <span className="text-xl">👨‍💼</span>
              </div>
            </div>

            {/* Avatar Top Right */}
            <div className="absolute top-2 right-3 w-15 h-15 rounded-full bg-[#064e3b] p-[2px] shadow-lg border border-emerald-400/30 transform rotate-6">
              <div className="w-full h-full rounded-full bg-[#02241b] flex items-center justify-center overflow-hidden">
                <span className="text-xl">👩‍💻</span>
              </div>
            </div>

            {/* Avatar Bottom Center */}
            <div className="absolute bottom-1 w-17 h-17 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 p-[2.5px] shadow-xl z-10">
              <div className="w-full h-full rounded-full bg-[#032a1f] flex items-center justify-center overflow-hidden">
                <Shield className="w-8 h-8 text-emerald-300" />
              </div>
            </div>

            {/* Floating Glass Pill Badge: Shark System */}
            <div className="absolute top-10 z-20 px-4 py-1 rounded-full bg-[#064e3b]/90 backdrop-blur-md border border-emerald-400/40 text-white font-extrabold text-xs shadow-md tracking-wider">
              Shark System
            </div>
          </div>

          {/* Portuguese Main Title */}
          <h1 className="text-3xl font-black text-center text-white tracking-tight leading-tight max-w-[260px]">
            Entre na sua conta!
          </h1>
          <p className="text-xs text-emerald-300/80 font-semibold tracking-wide text-center mt-2 uppercase">
            Shark System
          </p>
        </div>

        {/* Bottom Curved White Form Card */}
        <div className="w-full bg-white text-slate-900 rounded-t-[38px] pt-7 px-7 pb-5 shadow-2xl relative z-20 flex flex-col justify-between">
          
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Subtitle & Prompt */}
            <div className="text-center space-y-1 mb-3">
              <p className="text-xs text-slate-400 font-medium">
                Você já possui uma conta de acesso?
              </p>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Entre com suas credenciais
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Input E-mail */}
            <div className="space-y-1">
              <div className="relative flex items-center bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Mail className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail de acesso"
                  className="w-full bg-transparent text-slate-900 text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <div className="relative flex items-center bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Lock className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full bg-transparent text-slate-900 text-sm font-semibold focus:outline-none placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors ml-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Clean Curved Bottom Action Button */}
            <div className="pt-3 pb-1 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-52 py-3.5 bg-[#064e3b] hover:bg-[#043e2f] active:scale-95 text-white rounded-full font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
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
            </div>

          </form>

          {/* Footer note */}
          <p className="text-center text-[10px] font-semibold text-slate-400 pt-4 pb-1">
            Shark System &copy; {new Date().getFullYear()} • Todos os direitos reservados
          </p>

        </div>

      </div>
    </div>
  );
}
