import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Shield, DollarSign, Zap, TrendingUp } from "lucide-react";
import Image from "next/image";
import sharkAvatar from "./shark-avatar.png";

type OrbitIcon = {
  id: string;
  node: ReactNode;
  hue: "emerald" | "gold";
  period: number; // seconds per revolution
  phase: number; // 0..1 offset
  floatPeriod: number;
  floatPhase: number;
};

const ORBIT_PERIOD = 11; // 11 seconds per revolution

const ICONS: OrbitIcon[] = [
  {
    id: "shield",
    node: <Shield strokeWidth={1.6} className="h-6 w-6" />,
    hue: "emerald",
    period: ORBIT_PERIOD,
    phase: 0,
    floatPeriod: 2.6,
    floatPhase: 0.1,
  },
  {
    id: "money",
    node: <DollarSign strokeWidth={1.8} className="h-6 w-6" />,
    hue: "gold",
    period: ORBIT_PERIOD,
    phase: 0.25,
    floatPeriod: 3.1,
    floatPhase: 0.6,
  },
  {
    id: "lightning",
    node: <Zap strokeWidth={1.6} className="h-6 w-6 animate-pulse" />,
    hue: "emerald",
    period: ORBIT_PERIOD,
    phase: 0.5,
    floatPeriod: 2.4,
    floatPhase: 0.3,
  },
  {
    id: "growth",
    node: <TrendingUp strokeWidth={1.6} className="h-6 w-6" />,
    hue: "emerald",
    period: ORBIT_PERIOD,
    phase: 0.75,
    floatPeriod: 2.9,
    floatPhase: 0.85,
  },
];

// Orbit geometry — wider spread so icons never overlap
const RX = 135;
const RY = 65;
const TILT_SIN = Math.sin((25 * Math.PI) / 180);
const ORBIT_Y = -15;

export function SharkHero({ compact = false }: { compact?: boolean }) {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      setT((now - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rand = seed / 233280;
        const rand2 = ((i * 7919) % 100) / 100;
        return {
          left: `${(rand * 100).toFixed(2)}%`,
          top: `${(rand2 * 100).toFixed(2)}%`,
          size: 1.5 + rand * 2.5,
          opacity: 0.2 + rand2 * 0.4,
          duration: 9 + rand * 10,
          delay: -rand2 * 12,
          dx: (rand - 0.5) * 60,
          dy: -20 - rand2 * 60,
        };
      }),
    [],
  );

  return (
    <div className={`relative mx-auto flex w-full max-w-[380px] items-center justify-center [perspective:1000px] select-none pointer-events-none origin-center ${compact ? "h-[160px] scale-[0.72]" : "h-[190px] sm:h-[270px] scale-[0.78] sm:scale-100"}`}>
      {/* CSS das animações e keyframes originais de lux-orbit-zen */}
      <style jsx global>{`
        @keyframes shark-breathe-zen {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-1deg) scale(1.18);
          }
          50% {
            transform: translate3d(0, -4px, 0) rotate(1.5deg) scale(1.2);
          }
        }
        @keyframes glasses-reflection-zen {
          0%, 90%, 100% {
            opacity: 0;
            transform: translateX(-120%) skewX(-20deg);
          }
          93% {
            opacity: 0.45;
          }
          97% {
            transform: translateX(120%) skewX(-20deg);
            opacity: 0;
          }
        }
        @keyframes icon-spin-zen {
          0%, 100% {
            transform: rotateY(-6deg) rotateX(-3deg);
          }
          50% {
            transform: rotateY(6deg) rotateX(3deg);
          }
        }
        @keyframes particle-drift-zen {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: var(--p-opacity, 0.5);
          }
          80% {
            opacity: var(--p-opacity, 0.5);
          }
          100% {
            transform: translate3d(var(--p-dx, 20px), var(--p-dy, -40px), 0);
            opacity: 0;
          }
        }
        @keyframes bloom-pulse-zen {
          0%, 100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.06);
          }
        }
        .anim-shark-zen {
          animation: shark-breathe-zen 6s ease-in-out infinite;
          will-change: transform;
        }
        .anim-glasses-zen {
          animation: glasses-reflection-zen 6s ease-in-out infinite;
        }
        .anim-bloom-zen {
          animation: bloom-pulse-zen 8s ease-in-out infinite;
        }
      `}</style>

      {/* Volumetric bloom behind shark */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl anim-bloom-zen"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 65%)",
        }}
      />

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#10b981]/50 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              // @ts-ignore custom prop
              "--p-opacity": p.opacity,
              // @ts-ignore custom prop
              "--p-dx": `${p.dx}px`,
              // @ts-ignore custom prop
              "--p-dy": `${p.dy}px`,
              animation: `particle-drift-zen ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Subtle orbit halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          width: `${RX * 2.1}px`,
          height: `${RY * 2.3}px`,
          top: `calc(50% + ${ORBIT_Y}px)`,
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(16,185,129,0.06) 70%, transparent 78%)",
          filter: "blur(6px)",
        }}
      />

      {/* Orbiting icons */}
      {ICONS.map((icon) => {
        const angle = ((t / icon.period + icon.phase) % 1) * Math.PI * 2;
        const x = Math.cos(angle) * RX;
        const zRaw = Math.sin(angle); // -1..1
        const y = ORBIT_Y + zRaw * RY * TILT_SIN * -1;

        const depth = (zRaw + 1) / 2; // 0 back .. 1 front
        const scale = 0.82 + depth * 0.33; // 0.82..1.15
        const opacity = 0.65 + depth * 0.35;
        const blur = (1 - depth) * 1.8;
        const floatY = Math.sin((t / icon.floatPeriod + icon.floatPhase) * Math.PI * 2) * 4;
        const behind = zRaw < 0;
        const goldTint = icon.hue === "gold";

        return (
          <div
            key={icon.id}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate3d(${x}px, ${y + floatY}px, 0) translate(-50%, -50%) scale(${scale})`,
              opacity,
              filter: `blur(${blur.toFixed(2)}px)`,
              zIndex: behind ? 5 : 30,
              transition: "z-index 0s",
            }}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-[22px] border backdrop-blur-xl transition-all shadow-xl"
              style={{
                background: goldTint
                  ? "linear-gradient(135deg, rgba(167, 112, 19, 0.85), rgba(70, 46, 3, 0.6))"
                  : "linear-gradient(135deg, rgba(13, 56, 39, 0.85), rgba(3, 23, 16, 0.6))",
                borderColor: goldTint
                  ? "rgba(251, 191, 36, 0.45)"
                  : "rgba(52, 211, 153, 0.35)",
                boxShadow: goldTint
                  ? "0 10px 20px rgba(0,0,0,0.4), 0 0 16px rgba(245,158,11,0.25)"
                  : "0 10px 20px rgba(0,0,0,0.4), 0 0 16px rgba(16,185,129,0.25)",
                color: goldTint ? "#fffbeb" : "#ecfdf5",
                animation: `icon-spin-zen 3.5s ease-in-out infinite`,
                animationDelay: `${icon.floatPhase * -3}s`,
              }}
            >
              {icon.node}
            </div>
          </div>
        );
      })}

      {/* SHARK MASCOT */}
      <div className="relative z-20 flex items-center justify-center w-52 h-52">
        <div className="anim-shark-zen relative w-full h-full flex items-center justify-center">
          <Image
            src={sharkAvatar}
            alt="Shark Mascot"
            placeholder="blur"
            className="w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
            priority
          />
          {/* sunglasses reflection sweep */}
          <div
            aria-hidden
            className="pointer-events-none absolute overflow-hidden"
            style={{
              top: "22%",
              left: "29%",
              width: "42%",
              height: "10%",
              borderRadius: "9999px",
              mixBlendMode: "screen",
            }}
          >
            <div
              className="anim-glasses-zen h-full w-1/2"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.8), transparent)",
                filter: "blur(1px)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
