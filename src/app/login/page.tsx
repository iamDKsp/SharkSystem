"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, LogIn, Shield, Wifi, Battery, Sparkles, Zap, TrendingUp, CircleDollarSign } from "lucide-react";
import Image from "next/image";
import sharkAvatar from "./shark-avatar.png";

interface OrbitingIcon {
  id: number;
  component: React.ReactNode;
  initialPhase: number;
  period: number; // Período orbital em segundos
  floatPhaseOffset: number; // Offset para a flutuação vertical
  colorTheme: "emerald" | "amber";
}

interface BackgroundParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  depth: number; // Fator de profundidade (0 a 1) para efeito de parallax
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Time state updated via requestAnimationFrame at 60fps for ultra-smooth rendering
  const [time, setTime] = useState(0);

  // Background Particles
  const [particles, setParticles] = useState<BackgroundParticle[]>([]);

  useEffect(() => {
    // Inicializar partículas com diferentes profundidades, tamanhos e opacidades
    const initialParticles = Array.from({ length: 12 }).map((_, i) => {
      const depth = Math.random(); // 0 (distante) a 1 (próximo)
      return {
        id: i,
        x: Math.random() * 340,
        y: Math.random() * 260,
        size: 2 + depth * 5, // Partículas mais próximas são maiores
        speedX: (Math.random() - 0.5) * 0.08 * (0.5 + depth),
        speedY: (Math.random() - 0.5) * 0.08 * (0.5 + depth),
        opacity: 0.05 + depth * 0.25, // Partículas mais próximas são mais visíveis
        depth
      };
    });
    setParticles(initialParticles);

    let animationFrameId: number;
    let startTime = performance.now();

    const updateFrame = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setTime(elapsed);

      // Mover partículas de forma suave com wrapping nos limites do container
      setParticles(prev =>
        prev.map(p => {
          let nextX = p.x + p.speedX * 60 * 0.016;
          let nextY = p.y + p.speedY * 60 * 0.016;
          if (nextX < -20) nextX = 360;
          if (nextX > 360) nextX = -20;
          if (nextY < -20) nextY = 280;
          if (nextY > 280) nextY = -20;
          return { ...p, x: nextX, y: nextY };
        })
      );

      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Configuração dos 4 ícones orbitais com órbitas matemáticas independentes e não-sincronizadas
  const orbitingIcons: OrbitingIcon[] = [
    {
      id: 0,
      component: <Shield className="w-5 h-5 text-emerald-300 fill-emerald-300/10" />,
      initialPhase: 0,
      period: 9.8, // 9.8s para completar a volta
      floatPhaseOffset: 0.0,
      colorTheme: "emerald"
    },
    {
      id: 1,
      component: <CircleDollarSign className="w-5 h-5 text-amber-200 fill-amber-300/20" />,
      initialPhase: Math.PI / 2 + 0.4,
      period: 10.6, // 10.6s
      floatPhaseOffset: 1.2,
      colorTheme: "amber"
    },
    {
      id: 2,
      component: <Zap className="w-5 h-5 text-emerald-300 fill-emerald-300/20" />,
      initialPhase: Math.PI + 0.15,
      period: 10.1, // 10.1s
      floatPhaseOffset: 2.4,
      colorTheme: "emerald"
    },
    {
      id: 3,
      component: <TrendingUp className="w-5 h-5 text-emerald-300" />,
      initialPhase: (3 * Math.PI) / 2 - 0.25,
      period: 11.2, // 11.2s
      floatPhaseOffset: 3.8,
      colorTheme: "emerald"
    }
  ];

  // Geometria da órbita elíptica inclinada 3D
  const rx = 112; // Raio horizontal X (95px-120px)
  const rz = 80;  // Raio de profundidade Z
  const tiltAngle = 25 * (Math.PI / 180); // Inclinação de 25 graus

  // Fórmulas matemáticas do Tubarão (Âncora Visual Estática)
  // Período de respiração: 4s, Amplitude de flutuação: 3px
  const sharkY = Math.sin((2 * Math.PI * time) / 4) * 3;
  
  // Período de rotação do corpo: 8s, Amplitude: ±2°
  const sharkRot = Math.cos((2 * Math.PI * time) / 8) * 2;
  
  // Reflexo do óculos a cada 6s (sweep horizontal suave de 50ms de transição)
  const reflectionCycle = time % 6;
  const showReflection = reflectionCycle < 1.2; // Dura 1.2s a cada 6s
  const reflectionOffset = showReflection ? (reflectionCycle / 1.2) * 200 - 50 : -50;

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
    <div className="min-h-screen w-full bg-[#01140e] flex items-center justify-center p-0 sm:p-4 font-sans select-none overflow-hidden relative">
      {/* Cinematic teal rim lighting & background bloom */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Mobile Frame Container */}
      <div className="w-full max-w-[390px] h-screen sm:h-[790px] bg-[#021f17] sm:rounded-[44px] shadow-2xl shadow-black/95 border-0 sm:border-[8px] sm:border-[#064e3b] flex flex-col justify-between relative overflow-hidden">
        
        {/* Procedural Blurred Particles Background */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-emerald-400/30 pointer-events-none transition-all duration-300"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              filter: `blur(${Math.max(0.5, (1 - p.depth) * 4)}px)`,
              transform: `translateZ(${p.depth * 20}px)`
            }}
          />
        ))}

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

        {/* TOP HERO SECTION: AAA PLATFORM DISPLAY */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-4 pb-2 z-20 relative select-none">
          
          {/* 3D SCENE WRAPPER CENTERED AROUND SHARK'S CHEST */}
          <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
            
            {/* MAIN SHARK MASCOT (HERO ANCHOR - INCREASED SIZE BY 40% & UNINTERRUPTED FACE) */}
            <div 
              className="w-56 h-56 relative flex items-center justify-center z-10 transition-transform duration-75 will-change-transform"
              style={{ 
                transform: `translateY(${sharkY}px) rotate(${sharkRot}deg) translateZ(0px)`
              }}
            >
              {/* Soft teal glow highlight underneath */}
              <div className="absolute inset-4 rounded-full bg-emerald-500/10 blur-[30px] z-0 pointer-events-none" />

              <div className="w-full h-full relative overflow-visible flex items-center justify-center">
                <Image
                  src={sharkAvatar}
                  alt="Shark Mascot"
                  placeholder="blur"
                  className="w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.65)]"
                  priority
                />

                {/* Refined Sunglasses Sweep light reflection */}
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

            {/* HIGH END 3D ORBIT SYSTEM - MATHEMATICAL DEPTH SORTING */}
            {orbitingIcons.map(icon => {
              // Calcular ângulo orbital contínuo a partir do tempo e fase inicial
              const theta = ((2 * Math.PI) / icon.period) * time + icon.initialPhase;
              
              // Coordenadas tridimensionais
              const cx = rx * Math.cos(theta);
              const cz = rz * Math.sin(theta); // Profundidade
              
              // Inclinação 3D de 25 graus no plano X
              const cy = -cz * Math.sin(tiltAngle);
              
              // Flutuação vertical individual (Amplitude: 6px, Período: 3.5s)
              const yFloat = Math.sin((2 * Math.PI * time) / 3.5 + icon.floatPhaseOffset) * 6;
              const finalY = cy + yFloat;

              // Rotação individual da tag (±4° com período de 3.5s)
              const iconRot = Math.cos((2 * Math.PI * time) / 3.5 + icon.floatPhaseOffset) * 4;

              // Z' final para Depth Sorting
              const finalZ = cz * Math.cos(tiltAngle);

              // Depth styling de acordo com o especificado
              const maxZ = rz * Math.cos(tiltAngle);
              const normDepth = finalZ / maxZ; // Escala entre -1 (fundo) e 1 (frente)

              // Mapeamentos exatos de profundidade
              const scale = 0.975 + 0.175 * normDepth; // 115% na frente, 100% no meio, 80% no fundo
              const opacity = 0.825 + 0.175 * normDepth; // 100% na frente, 65% no fundo
              const blur = Math.max(0, (1 - normDepth) * 1.0); // 2px de blur no fundo, 0px na frente
              const shadowOpacity = 0.15 + 0.3 * ((normDepth + 1) / 2); // Sombra adaptativa de acordo com a proximidade

              // Z-Index dinâmico para garantir que os ícones passem na frente ou atrás do Tubarão
              const zIndex = finalZ > 0 ? 30 : 5;

              return (
                <div
                  key={icon.id}
                  className="absolute p-3 rounded-2xl border flex items-center justify-center transition-all duration-75 will-change-transform"
                  style={{
                    transform: `translate3d(${cx}px, ${finalY}px, ${finalZ}px) scale(${scale}) rotate(${iconRot}deg)`,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    boxShadow: `0 ${12 * scale}px ${24 * scale}px rgba(0, 0, 0, ${shadowOpacity})`,
                    backgroundColor: icon.colorTheme === "amber" ? "rgba(245, 158, 11, 0.8)" : "rgba(6, 78, 59, 0.8)",
                    borderColor: icon.colorTheme === "amber" ? "rgba(251, 191, 36, 0.4)" : "rgba(52, 211, 153, 0.4)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    zIndex: zIndex
                  }}
                >
                  {icon.component}
                </div>
              );
            })}

          </div>

          {/* Top Brand Tag (Configurado com exatamente 50px de espaçamento do tubarão) */}
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064e3b] border border-emerald-400/50 shrink-0 shadow-lg z-30"
            style={{ marginTop: "44px" }} // Garante o espaçamento exato de ~50px da base do mascote
          >
            <Zap className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
            <span className="text-[11px] font-extrabold text-white tracking-[0.2em] uppercase">
              SHARK SYSTEM
            </span>
          </div>

          {/* Big Main Title: Seja Bem-vindo! */}
          <h1 className="text-2xl sm:text-3xl font-black text-center text-white tracking-tight leading-none mt-3.5 drop-shadow-md shrink-0 z-30">
            Seja Bem-vindo!
          </h1>
          
          {/* Subtitle */}
          <p className="text-[11px] text-emerald-200/70 font-medium text-center mt-1.5 max-w-[230px] shrink-0 z-30">
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
