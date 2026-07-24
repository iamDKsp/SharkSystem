"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, LogIn, Shield, Wifi, Battery, Sparkles, Zap, TrendingUp, DollarSign } from "lucide-react";
import Image from "next/image";
import sharkAvatar from "./shark-avatar.png";

interface OrbitingIcon {
  id: number;
  icon: React.ReactNode;
  initialPhase: number;
  period: number;
  floatPhaseOffset: number;
  isGold: boolean;
  tiltRotation: string; // Inclinação 3D estática para dar o aspecto de bloco 3D
}

interface OrbitingDot {
  id: number;
  phaseOffset: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Time state for 60fps animations
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const updateFrame = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setTime(elapsed);
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Definição dos blocos 3D de alta fidelidade baseados na imagem
  const orbitingIcons: OrbitingIcon[] = [
    {
      id: 0,
      icon: <Shield className="w-6 h-6 text-[#5af0b9] drop-shadow-[0_0_8px_rgba(90,240,185,0.6)]" strokeWidth={2.2} />,
      initialPhase: 0,
      period: 11.5,
      floatPhaseOffset: 0.0,
      isGold: false,
      tiltRotation: "rotateX(12deg) rotateY(-15deg)"
    },
    {
      id: 1,
      icon: <DollarSign className="w-6 h-6 text-[#ffd56b] drop-shadow-[0_0_8px_rgba(255,213,107,0.6)]" strokeWidth={2.5} />,
      initialPhase: Math.PI / 2 + 0.4,
      period: 12.5,
      floatPhaseOffset: 1.5,
      isGold: true,
      tiltRotation: "rotateX(10deg) rotateY(15deg)"
    },
    {
      id: 2,
      icon: <Zap className="w-6 h-6 text-[#5af0b9] fill-[#5af0b9]/25 drop-shadow-[0_0_8px_rgba(90,240,185,0.6)]" strokeWidth={2.2} />,
      initialPhase: Math.PI + 0.15,
      period: 11.8,
      floatPhaseOffset: 3.0,
      isGold: false,
      tiltRotation: "rotateX(-12deg) rotateY(-10deg)"
    },
    {
      id: 3,
      icon: <TrendingUp className="w-6 h-6 text-[#5af0b9] drop-shadow-[0_0_8px_rgba(90,240,185,0.6)]" strokeWidth={2.2} />,
      initialPhase: (3 * Math.PI) / 2 - 0.25,
      period: 12.2,
      floatPhaseOffset: 4.5,
      isGold: false,
      tiltRotation: "rotateX(-10deg) rotateY(12deg)"
    }
  ];

  // Pequenos pontos de neon brilhantes que correm no trilho da órbita
  const orbitDots: OrbitingDot[] = [
    { id: 0, phaseOffset: 0 },
    { id: 1, phaseOffset: Math.PI / 4 },
    { id: 2, phaseOffset: Math.PI / 2 },
    { id: 3, phaseOffset: Math.PI },
    { id: 4, phaseOffset: (5 * Math.PI) / 4 },
    { id: 5, phaseOffset: (3 * Math.PI) / 2 }
  ];

  // Geometria da órbita elíptica inclinada 3D para encaixar exatamente na imagem
  const rx = 120; // Raio horizontal
  const rz = 90;  // Raio de profundidade
  const tiltAngle = 22 * (Math.PI / 180); // Inclinação de 22 graus para o efeito de anel

  // Animações do Tubarão
  const sharkY = Math.sin((2 * Math.PI * time) / 4.5) * 3; // Flutuação vertical de 3px
  const sharkRot = Math.cos((2 * Math.PI * time) / 9) * 1.5; // Balanço de 1.5°
  const reflectionCycle = time % 6.5;
  const showReflection = reflectionCycle < 1.2;
  const reflectionOffset = showReflection ? (reflectionCycle / 1.2) * 220 - 60 : -60;

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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

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

        {/* HERO SECTION: ALTA FIDELIDADE DE ACORDO COM A IMAGEM */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-4 pb-2 z-20 relative select-none">
          
          {/* 3D SCENE ROOT CONTAINER */}
          <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
            
            {/* GLOW DE FUNDO REALÍSTICO (Luz rim teal de trás do mascote) */}
            <div className="absolute w-44 h-44 rounded-full bg-[#10b981]/15 blur-[35px] z-0 pointer-events-none" />

            {/* TRILHO DA ÓRBITA: Fina linha verde neon brilhante com sombra */}
            <svg className="absolute w-[270px] h-[100px] pointer-events-none z-0 overflow-visible" style={{ transform: `rotateX(65deg) rotateZ(-15deg)` }}>
              <ellipse 
                cx="135" 
                cy="50" 
                rx="120" 
                ry="45" 
                fill="none" 
                stroke="rgba(16, 185, 129, 0.25)" 
                strokeWidth="1.5"
                className="filter drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]"
              />
            </svg>

            {/* PONTOS DE NEON ORBITAIS (Correndo ao longo da linha) */}
            {orbitDots.map(dot => {
              // Calcular a posição baseada no tempo
              const theta = 0.5 * time + dot.phaseOffset;
              const cx = 120 * Math.cos(theta);
              const cz = 45 * Math.sin(theta);
              
              // Inclinação de rotação 3D correspondente à linha do anel
              const cy = -cz * Math.sin(tiltAngle);
              const finalZ = cz * Math.cos(tiltAngle);
              
              const zIndex = finalZ > 0 ? 25 : 4;

              return (
                <div
                  key={dot.id}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#5af0b9] shadow-[0_0_8px_#10b981,0_0_12px_#10b981] z-20 transition-all duration-75 will-change-transform"
                  style={{
                    transform: `translate3d(${cx}px, ${cy}px, ${finalZ}px)`,
                    zIndex: zIndex,
                    opacity: finalZ > 0 ? 1 : 0.4
                  }}
                />
              );
            })}

            {/* MASCOTE DO TUBARÃO GIGANTE (VISUAL ANCHOR - ESTÁTICO COM RESPIRAÇÃO) */}
            <div 
              className="w-56 h-56 relative flex items-center justify-center z-10 transition-transform duration-75 will-change-transform"
              style={{ 
                transform: `translateY(${sharkY}px) rotate(${sharkRot}deg) translateZ(0px)`
              }}
            >
              <div className="w-full h-full relative overflow-visible flex items-center justify-center">
                <Image
                  src={sharkAvatar}
                  alt="Shark Mascot"
                  placeholder="blur"
                  className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.8)]"
                  priority
                />

                {/* Brilho Linear nos Óculos de Sol */}
                <div className="absolute top-[48px] left-[65px] w-[105px] h-[34px] overflow-hidden rounded-md pointer-events-none z-20 opacity-30 mix-blend-overlay">
                  <div 
                    className="w-7 h-[70px] bg-white blur-[2px] transform rotate-30 absolute transition-all duration-75"
                    style={{
                      left: `${reflectionOffset}px`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* BLOCOS 3D EM ÓRBITA REALISTA COM DEPTH SORTING (IDÊNTICO À IMAGEM) */}
            {orbitingIcons.map(icon => {
              // Calcular ângulo orbital
              const theta = ((2 * Math.PI) / icon.period) * time + icon.initialPhase;
              
              // Coordenadas 3D
              const cx = rx * Math.cos(theta);
              const cz = rz * Math.sin(theta); 
              
              // Inclinação
              const cy = -cz * Math.sin(tiltAngle);
              
              // Flutuação vertical individual
              const yFloat = Math.sin((2 * Math.PI * time) / 3.5 + icon.floatPhaseOffset) * 5;
              const finalY = cy + yFloat;

              // Z' final para Depth Sorting
              const finalZ = cz * Math.cos(tiltAngle);

              // Depth styling adaptativo
              const maxZ = rz * Math.cos(tiltAngle);
              const normDepth = finalZ / maxZ; // -1 a 1

              // Escala, Opacidade e Desfoque baseados na profundidade
              const scale = 0.95 + 0.2 * normDepth; // 115% na frente, 75% atrás
              const opacity = 0.8 + 0.2 * normDepth; // 100% frente, 60% atrás
              const blur = Math.max(0, (1 - normDepth) * 1.5);
              const shadowOpacity = 0.2 + 0.45 * ((normDepth + 1) / 2);

              const zIndex = finalZ > 0 ? 30 : 5;

              return (
                <div
                  key={icon.id}
                  className="absolute w-15 h-15 rounded-[22px] border flex items-center justify-center transition-all duration-75 will-change-transform shadow-2xl"
                  style={{
                    transform: `translate3d(${cx}px, ${finalY}px, ${finalZ}px) scale(${scale}) ${icon.tiltRotation}`,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    zIndex: zIndex,
                    boxShadow: `
                      0 ${12 * scale}px ${24 * scale}px rgba(0, 0, 0, ${shadowOpacity}),
                      inset 0 2px 4px rgba(255, 255, 255, ${icon.isGold ? 0.25 : 0.12})
                    `,
                    // Cores idênticas à imagem (Verde Escuro Metálico ou Ouro Metálico)
                    background: icon.isGold 
                      ? "linear-gradient(135deg, #a77013 0%, #462e03 100%)"
                      : "linear-gradient(135deg, #0d3827 0%, #031710 100%)",
                    borderColor: icon.isGold
                      ? "rgba(251, 191, 36, 0.55)"
                      : "rgba(52, 211, 153, 0.45)"
                  }}
                >
                  {icon.icon}
                </div>
              );
            })}

          </div>

          {/* Top Brand Tag (Espaçamento ideal de 50px do tubarão) */}
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#053728] border border-emerald-500/40 shrink-0 shadow-lg z-30"
            style={{ marginTop: "48px" }}
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
