import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Layers, Sparkles } from 'lucide-react';

export interface ImtihanNeuralNode {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  countLabel: string;
  accentHex: string;
  glowRgba: string;
  statusText: string;
}

interface ImtihanNeuralDashboardProps {
  tahunAjaran: string;
  cawu: number | string;
  ketuaImtihan: string;
  nodes: ImtihanNeuralNode[];
  onSelectStage: (subTabId: string) => void;
}

interface StarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  tint: string;
}

export const ImtihanNeuralDashboard: React.FC<ImtihanNeuralDashboardProps> = ({
  tahunAjaran,
  cawu,
  ketuaImtihan,
  nodes,
  onSelectStage,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 1080, h: 520 });

  // Measure container cleanly
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setSize({
          w: Math.round(rect.width),
          h: Math.round(rect.width < 640 ? 440 : 540),
        });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Radial orbital coordinates inside SVG viewBox (1000 x 560)
  const layout = useMemo(() => {
    const cx = 500;
    const cy = 268;
    const total = nodes.length;
    // Arrange nodes cleanly across an upper+side cosmic constellation ring
    const rx = 385;
    const ry = 188;
    const startAngle = Math.PI * 0.92;
    const endAngle = Math.PI * 2.08;
    return nodes.map((node, idx) => {
      const t = total > 1 ? idx / (total - 1) : 0.5;
      const angle = startAngle + t * (endAngle - startAngle);
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      // Curve control point arching gently toward center
      const ctrlX = (cx + x) / 2;
      const ctrlY = (cy + y) / 2 - 26;
      return {
        node,
        x,
        y,
        path: `M ${cx} ${cy} Q ${ctrlX} ${ctrlY} ${x} ${y}`,
        delaySec: (idx * 0.45).toFixed(2),
      };
    });
  }, [nodes]);

  // Background Cosmic Web Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = size.w;
    const height = size.h;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const palette = ['#38bdf8', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'];
    const particleCount = width < 640 ? 48 : 88;
    const particles: StarParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.24,
      radius: 1.1 + Math.random() * 1.8,
      alpha: 0.35 + Math.random() * 0.55,
      tint: palette[i % palette.length],
    }));

    let rafId = 0;
    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint cosmic nebula glows
      const g1 = ctx.createRadialGradient(width * 0.5, height * 0.46, 10, width * 0.5, height * 0.46, width * 0.42);
      g1.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
      g1.addColorStop(0.55, 'rgba(14, 116, 144, 0.08)');
      g1.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.5, height * 0.88, 10, width * 0.5, height * 0.88, width * 0.48);
      g2.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      g2.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Update positions & draw connecting neural filaments
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      const maxDist = width < 640 ? 95 : 125;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(94, 234, 212, ${opacity.toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing micro-nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.tint;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [size.w, size.h]);

  const activeNode =
    nodes.find((n) => n.id === hoveredId) || nodes[0] || null;

  return (
    <div className="rounded-3xl overflow-hidden bg-[#030712] border border-emerald-900/60 shadow-2xl text-white">
      {/* Top Bar */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-[#050c1a]/90">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-white">
              Neural Command Center Imtihan · Pondok Pesantren NU Darussalam
            </h3>
            <p className="text-[11px] text-slate-400">
              Klik simpul tahapan di bawah untuk langsung membuka modul kerja Panitia &amp; Wali Kelas
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-300 font-medium">
          <span className="text-emerald-300 font-bold">Cawu {cawu}</span>
          <span className="mx-1.5 text-slate-600">·</span>
          <span>T.A. {tahunAjaran}</span>
          <span className="mx-1.5 text-slate-600">·</span>
          <span className="text-amber-300">{ketuaImtihan}</span>
        </div>
      </div>

      {/* Main Cosmic Neural Hub Canvas + SVG Orbital Nodes */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none"
        style={{ height: `${size.h}px` }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Desktop & Tablet Orbital Constellation Graph */}
        <svg
          viewBox="0 0 1000 560"
          className="relative z-10 w-full h-full hidden sm:block"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="hubCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="45%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#064e3b" />
            </radialGradient>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Orbital Guide Rings */}
          <ellipse
            cx="500"
            cy="268"
            rx="385"
            ry="188"
            fill="none"
            stroke="rgba(52, 211, 153, 0.14)"
            strokeDasharray="4 6"
            strokeWidth="1.2"
          />
          <circle
            cx="500"
            cy="268"
            r="96"
            fill="none"
            stroke="rgba(251, 191, 36, 0.22)"
            strokeWidth="1.2"
          />

          {/* Curved Synaptic Connections + Animated Energy Pulses */}
          {layout.map(({ node, path, delaySec }) => {
            const isHovered = hoveredId === node.id;
            return (
              <g key={`edge-${node.id}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={isHovered ? node.accentHex : 'rgba(148, 163, 184, 0.28)'}
                  strokeWidth={isHovered ? 2.6 : 1.4}
                  filter={isHovered ? 'url(#softGlow)' : undefined}
                />
                <circle r={isHovered ? 4.5 : 3} fill={node.accentHex} filter="url(#softGlow)">
                  <animateMotion dur="3.4s" begin={`${delaySec}s`} repeatCount="indefinite" path={path} />
                </circle>
              </g>
            );
          })}

          {/* Central Hub Orb: PANITIA IMTIHAN */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectStage('review_panitia')}
          >
            <circle cx="500" cy="268" r="64" fill="rgba(16, 185, 129, 0.14)">
              <animate attributeName="r" values="60;70;60" dur="3.2s" repeatCount="indefinite" />
            </circle>
            <circle
              cx="500"
              cy="268"
              r="52"
              fill="url(#hubCoreGrad)"
              stroke="#fbbf24"
              strokeWidth="2.5"
              filter="url(#softGlow)"
            />
            <text
              x="500"
              y="261"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="13"
              fontWeight="800"
              letterSpacing="1"
            >
              PANITIA
            </text>
            <text
              x="500"
              y="279"
              textAnchor="middle"
              fill="#fef3c7"
              fontSize="13"
              fontWeight="900"
              letterSpacing="1"
            >
              IMTIHAN
            </text>
            <text
              x="500"
              y="296"
              textAnchor="middle"
              fill="#d1fae5"
              fontSize="9.5"
              fontWeight="700"
            >
              CAWU {cawu} · AKTIF
            </text>
          </g>

          {/* Outer Specialist Nodes */}
          {layout.map(({ node, x, y }) => {
            const isHovered = hoveredId === node.id;
            const r = isHovered ? 34 : 30;
            return (
              <g
                key={node.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectStage(node.id)}
              >
                {/* Halo */}
                <circle
                  r={r + 8}
                  fill={node.glowRgba}
                  opacity={isHovered ? 0.95 : 0.45}
                />
                {/* Node Circle */}
                <circle
                  r={r}
                  fill="#0b1324"
                  stroke={node.accentHex}
                  strokeWidth={isHovered ? 3 : 2}
                  filter={isHovered ? 'url(#softGlow)' : undefined}
                />
                {/* Monogram */}
                <text
                  y="-2"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="900"
                >
                  {node.code}
                </text>
                {/* Metric inside circle bottom */}
                <text
                  y="14"
                  textAnchor="middle"
                  fill={node.accentHex}
                  fontSize="10"
                  fontWeight="800"
                >
                  {node.countLabel}
                </text>

                {/* Crisp Label Under Node */}
                <text
                  y={r + 17}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : '#e2e8f0'}
                  fontSize="11.5"
                  fontWeight="800"
                >
                  {node.title}
                </text>
                <text
                  y={r + 31}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontWeight="500"
                >
                  {node.statusText}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Mobile Grid Fallback on < 640px screens */}
        <div className="relative z-10 p-4 h-full overflow-y-auto sm:hidden space-y-3">
          <div className="text-center py-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>PUSAT KENDALI IMTIHAN CAWU {cawu}</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectStage(node.id)}
                className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-left space-y-1 hover:border-emerald-400 transition"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-black"
                    style={{ color: node.accentHex }}
                  >
                    {node.code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 tabular-nums">
                    {node.countLabel}
                  </span>
                </div>
                <p className="text-xs font-extrabold text-white truncate">{node.title}</p>
                <p className="text-[10px] text-slate-400 truncate">{node.statusText}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Inspector Strip */}
        {activeNode && (
          <div className="hidden sm:flex absolute bottom-3 left-4 right-4 z-20 rounded-2xl bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 border"
                style={{ borderColor: activeNode.accentHex, backgroundColor: '#0b1324' }}
              >
                {activeNode.code}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">
                  {activeNode.title} <span className="text-slate-400 font-normal">· {activeNode.subtitle}</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Status: <span className="text-emerald-300 font-semibold">{activeNode.statusText}</span> · {activeNode.countLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectStage(activeNode.id)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold inline-flex items-center gap-1 shrink-0 transition"
            >
              <span>Buka Tahapan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
