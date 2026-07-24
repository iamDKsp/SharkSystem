"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff, LogIn, Shield, Wifi, Battery, Sparkles, DollarSign, Zap, TrendingUp, CircleDollarSign } from "lucide-react";
import Image from "next/image";
import sharkAvatar from "./shark-avatar.png";

interface OrbitingIcon {
  id: number;
  component: React.ReactNode;
  phase: number; // Radianos iniciais
  speedMult: number; // Multiplicador de velocidade ligeiramente diferente
  zOffset: number; // Altura Z individual (parallax 3D)
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados de animação controlados via JS para suavidade AAA 60FPS
  const [time, setTime] = useState(0);

  // Background Particles
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number; speedX: number; speedY: number; opacity: number }[]>([]);

  useEffect(() => {
    // Inicializar partículas com posições aleatórias
    const initialParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 320,
      y: Math.random() * 320,
      scale: 0.6 + Math.random() * 1.4,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: 0.1 + Math.random() * 0.2,
    }));
    setParticles(initialParticles);

    // Loop de renderização 60FPS
    let animationFrameId: number;
    let startTime = performance.now();

    const updateFrame = (now: number) => {
      const elapsed = (now - startTime) / 1000; // Segundos
      setTime(elapsed);

      // Atualizar partículas com wrapping de borda
      setParticles(prev =>
        prev.map(p => {
          let nextX = p.x + p.speedX * 60 * 0.016;
          let nextY = p.y + p.speedY * 60 * 0.016;
          if (nextX < -50) nextX = 350;
          if (nextX > 350) nextX = -50;
          if (nextY < -50) nextY = 350;
          if (nextY > 350) nextY = -50;
          return { ...p, x: nextX, y: nextY };
        })
      );

      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Definição dos ícones com fases (offsets) não-sincronizados para evitar alinhamento plano
  const icons: OrbitingIcon[] = [
    {
      id: 0,
      component: <Shield className="w-5 h-5 text-emerald-300 fill-emerald-300/10" />,
      phase: 0,
      speedMult: 1.0,
      zOffset: 12
    },
    {
      id: 1,
      component: <CircleDollarSign className="w-5 h-5 text-amber-200 fill-amber-300/20" />,
      phase: Math.PI / 2 + 0.35,
      speedMult: 0.95,
      zOffset: -8
    },
    {
      id: 2,
      component: <Zap className="w-5 h-5 text-emerald-300 fill-emerald-300/25" />,
      phase: Math.PI + 0.15,
      speedMult: 1.05,
      zOffset: 5
    },
    {
      id: 3,
      component: <TrendingUp className="w-5 h-5 text-emerald-300" />,
      phase: (3 * Math.PI) / 2 - 0.25,
      speedMult: 1.0,
      zOffset: -12
    }
  ];

  // Configuração da Órbita Elíptica Inclinada em 3D
  const orbitPeriod = 14; // Uma volta completa a cada 14 segundos
  const orbitSpeed = (2 * Math.PI) / orbitPeriod;
  const rx = 100; // Raio X (largura)
  const rz = 75; // Raio Z (profundidade)
  const tiltAngle = 25 * (Math.PI / 180); // Inclinação de 25 graus da órbita

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

  // Cálculo da Animação do Tubarão (Quase Estático, Respiração AAA)
  const sharkY = Math.sin(time * 2.2) * 1.8; // Respiração vertical sutil (±1.8px)
  const sharkRot = Math.cos(time * 1.5) * 1.5; // Rotação sutil (±1.5°)
  const catchPos = ((time * 60) % 360) * 1.8 - 180; // Movimento do brilho do óculos a cada 6s

  return (
    <div className="min-h-screen w-full bg-[#01140e] flex items-center justify-center p-0 sm:p-4 font-sans select-none overflow-hidden relative">
      {/* Background radial lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Mobile Frame Container */}
      <div className="w-full max-w-[390px] h-screen sm:h-[790px] bg-[#021f17] sm:rounded-[44px] shadow-2xl shadow-black/95 border-0 sm:border-[8px] sm:border-[#064e3b] flex flex-col justify-between relative overflow-hidden">
        
        {/* Renderização de Partículas de Fundo Flutuantes com Profundidade (Parallax) */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-emerald-400/40 pointer-events-none transition-all duration-300"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${4 * p.scale}px`,
              height: `${4 * p.scale}px`,
              opacity: p.opacity,
              filter: `blur(${Math.max(0.5, (3 - p.scale) * 1.5)}px)`,
              transform: `translateZ(${p.scale * 10}px)`
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

        {/* TOP HERO SECTION: AAA VISION OS ENVIRONMENT */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-1 z-20 relative select-none">
          
          {/* 3D SCENE WRAPPER */}
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 my-2 flex items-center justify-center shrink-0">
            
            {/* TUBARÃO GIGANTE - VISUAL ANCHOR - ESTÁTICO COM ANIMAÇÃO DE RESPIRAÇÃO */}
            <div 
              className="w-40 h-40 sm:w-44 sm:h-44 relative flex items-center justify-center z-10 transition-transform duration-75 will-change-transform"
              style={{ 
                transform: `translateY(${sharkY}px) rotate(${sharkRot}deg) translateZ(0px)`
              }}
            >
              {/* Brilho Suave de Borda (Teal Rim Light) */}
              <div className="absolute inset-2 rounded-full bg-emerald-500/10 blur-[25px] z-0 pointer-events-none" />

              <div className="w-full h-full relative overflow-visible flex items-center justify-center">
                <Image
                  src={sharkAvatar}
                  alt="Shark System 3D Hero"
                  placeholder="blur"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                  priority
                />

                {/* Efeito de Reflexo / Brilho nos Óculos (Sunglasses Catch Reflection) */}
                <div className="absolute top-[41px] left-[55px] w-[95px] h-[32px] overflow-hidden rounded-md pointer-events-none z-20 opacity-40 mix-blend-overlay">
                  <div 
                    className="w-8 h-[60px] bg-white blur-[2px] transform rotate-30 absolute transition-all duration-75"
                    style={{
                      left: `${((time * 80) % 400) - 100}px`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* FLOATING 3D ORBITING ICONS WITH DEPTH SORTING */}
            {icons.map(icon => {
              // Calcular ângulo de fase com base no tempo
              const theta = orbitSpeed * time * icon.speedMult + icon.phase;
              
              // 3D Coords em órbita horizontal
              const cx = rx * Math.cos(theta);
              const cz = rz * Math.sin(theta); // Profundidade (Z)
              
              // Aplicar rotação de inclinação de 25 graus no eixo X
              // cy' = cy * cos(tilt) - cz * sin(tilt) = -cz * sin(tilt) (já que cy original é 0)
              const cy = -cz * Math.sin(tiltAngle) + icon.zOffset;
              
              // Z' final para Depth Sorting
              const finalZ = cz * Math.cos(tiltAngle);

              // Fatores baseados na profundidade para efeitos realistas (Depth Scaling & Styling)
              const maxZ = rz * Math.cos(tiltAngle);
              const normDepth = finalZ / maxZ; // Escala de -1 (fundo) a 1 (frente)

              // Mapeamentos precisos do Spec
              const scale = 0.96 + 0.14 * normDepth; // Front 110%, Middle 100%, Back 82%
              const opacity = 0.875 + 0.125 * normDepth; // Leve atenuação no fundo
              const blur = Math.max(0, (1 - normDepth) * 1.5); // Fundo desfoca até 3px
              const shadowOpacity = 0.15 + 0.25 * ((normDepth + 1) / 2); // Sombra mais suave no fundo
              
              // Z-Index dinâmico para sobreposição correta do Tubarão (Tubarão é z-index 10)
              const zIndex = finalZ > 0 ? 30 : 5;

              return (
                <div
                  key={icon.id}
                  className="absolute z-20 p-2.5 rounded-2xl border border-emerald-400/40 shadow-lg flex items-center justify-center transition-all duration-75 will-change-transform"
                  style={{
                    transform: `translate3d(${cx}px, ${cy}px, ${finalZ}px) scale(${scale})`,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    boxShadow: `0 ${10 * scale}px ${20 * scale}px rgba(0, 0, 0, ${shadowOpacity})`,
                    backgroundColor: icon.id === 1 ? "rgba(245, 158, 11, 0.8)" : "rgba(6, 78, 59, 0.8)",
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
