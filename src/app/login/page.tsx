"use client";

import { useState, useRef } from "react";
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

  // 3D Parallax Tilt State
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth 3D rotation limits (max 18 degrees tilt)
    const rx = -(y / (rect.height / 2)) * 16;
    const ry = (x / (rect.width / 2)) * 16;
    const tx = (x / (rect.width / 2)) * 8;
    const ty = (y / (rect.height / 2)) * 8;

    setTilt({ rx, ry, tx, ty });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 });
  };

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

        {/* Top Header Section (INTERACTIVE 3D PARALLAX CAMERA HERO) */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex-1 flex flex-col items-center justify-center px-4 py-1 z-20 relative cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          {/* 3D PARALLAX CONTAINER WRAPPER */}
          <div 
            className="relative w-56 h-56 sm:w-60 sm:h-60 my-1 flex items-center justify-center shrink-0 transition-transform duration-200 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
            }}
          >
            
            {/* LAYER -1 (Fundo): Dashed outer orbit ring */}
            <div 
              className="absolute inset-[-10px] rounded-full border-[2px] border-dashed border-emerald-400/35 animate-spin" 
              style={{ 
                animationDuration: '28s',
                transform: `translateZ(-30px)`
              }} 
            />

            {/* LAYER 0 (Trás): Glowing 3D Laser Ray Ring (Passa por trás do Tubarão) */}
            <div 
              className="absolute w-[240px] h-[75px] rounded-[100%] border-[4px] border-emerald-400/90 shadow-[0_0_30px_rgba(52,211,153,0.8)] transform -rotate-12 animate-pulse"
              style={{ transform: `translateZ(-15px) rotateX(60deg) rotateZ(-12deg)` }}
            />

            {/* LAYER 1 (Meio): TUBARÃO 3D GIGANTE - SEM CORTES NA CABEÇA OU CORPO */}
            <div 
              className="w-48 h-48 sm:w-52 sm:h-52 relative flex items-center justify-center transition-transform duration-300 drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
              style={{ transform: `translateZ(45px)` }}
            >
              <Image
                src={sharkAvatar}
                alt="Shark System Avatar"
                placeholder="blur"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)] transform scale-115"
                priority
              />
            </div>

            {/* LAYER 2 (Frente): Floating 3D Parallax Icons (MAIORES E COM PROFUNDIDADE 3D) */}

            {/* Ícone 1: Escudo 3D (Top Left) */}
            <div 
              className="absolute top-0 -left-3 z-30 p-3 rounded-2xl bg-[#064e3b]/95 backdrop-blur-md border-2 border-emerald-400 shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-emerald-300 transition-transform duration-200"
              style={{ transform: `translateZ(75px) translate(${tilt.tx * 1.5}px, ${tilt.ty * 1.5}px)` }}
            >
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Ícone 2: Cifrão 3D (Top Right) */}
            <div 
              className="absolute top-1 -right-3 z-30 p-3 rounded-2xl bg-[#064e3b]/95 backdrop-blur-md border-2 border-emerald-400 shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-emerald-300 transition-transform duration-200"
              style={{ transform: `translateZ(85px) translate(${tilt.tx * -1.5}px, ${tilt.ty * 1.5}px)` }}
            >
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Ícone 3: Raio Verde 3D (Bottom Left) */}
            <div 
              className="absolute bottom-1 -left-3 z-30 p-3 rounded-2xl bg-[#064e3b]/95 backdrop-blur-md border-2 border-emerald-400 shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-emerald-300 transition-transform duration-200"
              style={{ transform: `translateZ(90px) translate(${tilt.tx * 1.8}px, ${tilt.ty * -1.5}px)` }}
            >
              <Zap className="w-6 h-6 text-emerald-300 fill-emerald-300" />
            </div>

            {/* Ícone 4: Gráfico 3D (Bottom Right) */}
            <div 
              className="absolute bottom-2 -right-3 z-30 p-3 rounded-2xl bg-[#064e3b]/95 backdrop-blur-md border-2 border-emerald-400 shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-emerald-300 transition-transform duration-200"
              style={{ transform: `translateZ(80px) translate(${tilt.tx * -1.8}px, ${tilt.ty * -1.5}px)` }}
            >
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* LAYER 3 (Frente Extrema): Halo Frontal de Brilho do Raio */}
            <div 
              className="absolute w-[240px] h-[75px] rounded-[100%] border-t-[4px] border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.9)] transform -rotate-12 pointer-events-none"
              style={{ transform: `translateZ(60px) rotateX(60deg) rotateZ(-12deg)` }}
            />
          </div>

          {/* Top Brand Tag (Acima do texto grande) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064e3b] border border-emerald-400/50 mb-1 mt-3 shrink-0 shadow-md">
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
