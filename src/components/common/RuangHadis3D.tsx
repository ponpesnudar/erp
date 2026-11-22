import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  BookOpen,
  Mic,
  MicOff,
  Send,
  Play,
  RotateCcw,
  ScrollText,
  Download,
  X,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Loader2,
} from 'lucide-react';
import {
  KITAB_HADIS_51_CATALOG,
  RUANG_HADIS_PRESET_TOPICS,
  resolveRuangHadisQuestion,
  exportRuangHadisPdf,
  type RuangHadisResult,
} from '../../lib/ruangHadisData.ts';

interface RuangHadis3DProps {
  compact?: boolean;
}

interface HalaqahRoleStation {
  id: 'syaikh' | 'perumus' | 'mushahhih' | 'notulen';
  label: string;
  arab: string;
  kitabBadge: string;
  angleRad: number;
  accent: string;
}

const HALAQAH_ROLES: HalaqahRoleStation[] = [
  { id: 'syaikh', label: 'Syaikh Halaqah', arab: 'شيخ الحلقة', kitabBadge: 'Shahih al-Bukhari & Fathul Bari', angleRad: -Math.PI / 2, accent: '#991B1B' },
  { id: 'perumus', label: 'Perumus Hadis', arab: 'المقرر', kitabBadge: 'Shahih Muslim & Musnad Ahmad', angleRad: 0, accent: '#B45309' },
  { id: 'mushahhih', label: 'Mushahhih Sanad', arab: 'المصحح', kitabBadge: 'Shahih Ibnu Hibban & Al-Mustadrak', angleRad: Math.PI / 2, accent: '#047857' },
  { id: 'notulen', label: 'Notulen & Takhrij', arab: 'الكاتب', kitabBadge: 'At-Targhib & Majma’ az-Zawaid', angleRad: Math.PI, accent: '#1D4ED8' },
];

function createRedCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#7F1D1D';
  ctx.fillRect(0, 0, 512, 512);

  // Outer gold & crimson rings
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(256, 256, 238, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#FCD34D';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 222, 0, Math.PI * 2);
  ctx.stroke();

  // Mandala star spokes
  ctx.strokeStyle = 'rgba(252, 211, 77, 0.35)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(a) * 60, 256 + Math.sin(a) * 60);
    ctx.lineTo(256 + Math.cos(a) * 215, 256 + Math.sin(a) * 215);
    ctx.stroke();
  }

  ctx.fillStyle = '#991B1B';
  ctx.beginPath();
  ctx.arc(256, 256, 72, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 5;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createHadisBoardTexture(question: string, activeKitab: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2A0A0A';
  ctx.fillRect(0, 0, 1024, 512);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 12;
  ctx.strokeRect(14, 14, 996, 484);

  ctx.fillStyle = '#FDE047';
  ctx.textAlign = 'center';
  ctx.font = 'bold 42px "Traditional Arabic", "Amiri", serif';
  ctx.fillText('عِلْمُ الْحَدِيْثِ · حَلْقَةُ ٥١ كِتَابًا', 512, 82);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('MAJLIS RUANG HADIS & TAKHRIJ SANAD (51 KITAB)', 512, 138);

  ctx.fillStyle = 'rgba(255,255,255,0.09)';
  ctx.fillRect(64, 174, 896, 175);
  ctx.fillStyle = '#FCD34D';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText("AS'ILAH HADIS AKTIF:", 512, 212);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px sans-serif';
  const words = question.split(/\s+/);
  let line1 = '';
  let line2 = '';
  for (const w of words) {
    if ((line1 + ' ' + w).length < 44) line1 = (line1 + ' ' + w).trim();
    else if ((line2 + ' ' + w).length < 44) line2 = (line2 + ' ' + w).trim();
  }
  ctx.fillText(line1, 512, 260);
  if (line2) ctx.fillText(line2, 512, 302);

  ctx.fillStyle = '#86EFAC';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`Menelusuri: ${activeKitab}`, 512, 418);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export const RuangHadis3D: React.FC<RuangHadis3DProps> = ({ compact = false }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL] = useState<boolean>(() => detectWebGL());

  const [questionInput, setQuestionInput] = useState<string>(RUANG_HADIS_PRESET_TOPICS[0]);
  const [result, setResult] = useState<RuangHadisResult>(() =>
    resolveRuangHadisQuestion(RUANG_HADIS_PRESET_TOPICS[0])
  );

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [deliberationStep, setDeliberationStep] = useState(0);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [listeningVoice, setListeningVoice] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [focusRoleIdx, setFocusRoleIdx] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const activeKitabName = useMemo(() => {
    return KITAB_HADIS_51_CATALOG[deliberationStep % KITAB_HADIS_51_CATALOG.length];
  }, [deliberationStep]);

  // Trigger simulated 51-kitab deliberation
  const runDeliberation = (q: string) => {
    const cleanQ = q.trim() || RUANG_HADIS_PRESET_TOPICS[0];
    setQuestionInput(cleanQ);
    setShowAskModal(false);
    setIsDeliberating(true);
    setDeliberationStep(0);
    setFocusRoleIdx(0);
    const resolved = resolveRuangHadisQuestion(cleanQ);
    setResult(resolved);
  };

  useEffect(() => {
    if (!isDeliberating) return;
    const interval = setInterval(() => {
      setDeliberationStep((s) => {
        const next = s + 1;
        setFocusRoleIdx(next % 4);
        if (next >= 8) {
          setIsDeliberating(false);
          setFocusRoleIdx(null);
          setShowResultModal(true);
        }
        return next;
      });
    }, 650);
    return () => clearInterval(interval);
  }, [isDeliberating]);

  // Voice Recognition helper
  const toggleVoiceInput = () => {
    if (listeningVoice && recognitionRef.current) {
      recognitionRef.current.stop();
      setListeningVoice(false);
      return;
    }
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceNote('Browser ini belum mendukung dikte suara otomatis. Ketik pertanyaan atau pilih topik cepat di bawah.');
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.lang = 'id-ID';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (evt: any) => {
        const transcript = evt.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setQuestionInput(transcript);
          setVoiceNote(`Suara tertangkap: "${transcript}"`);
        }
        setListeningVoice(false);
      };
      rec.onerror = () => {
        setListeningVoice(false);
        setVoiceNote('Mikrofon tidak diizinkan atau sunyi. Silakan ketik as’ilah.');
      };
      rec.onend = () => setListeningVoice(false);
      recognitionRef.current = rec;
      setVoiceNote('Mendengarkan suara Anda... ucapkan topik hadis.');
      setListeningVoice(true);
      rec.start();
    } catch {
      setListeningVoice(false);
    }
  };

  // Three.js Circular Halaqah Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !hasWebGL) return;

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1B0D0D');
    scene.fog = new THREE.Fog('#1B0D0D', 15, 32);

    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 80);
    camera.position.set(0, 6.4, 9.2);
    camera.lookAt(0, 1.1, -0.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm Majlis Lighting
    const hemi = new THREE.HemisphereLight('#FEF3C7', '#3B1818', 1.1);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight('#FFFBEB', 1.45);
    keyLight.position.set(4, 10, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const warmPoint = new THREE.PointLight('#F59E0B', 2.2, 16);
    warmPoint.position.set(0, 4.2, 0);
    scene.add(warmPoint);

    // Marble Hall Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 26),
      new THREE.MeshStandardMaterial({ color: '#EDE2CC', roughness: 0.75 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Circular Crimson & Gold Carpet
    const carpetTex = createRedCarpetTexture();
    const carpet = new THREE.Mesh(
      new THREE.CylinderGeometry(5.6, 5.6, 0.04, 48),
      new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.85 })
    );
    carpet.position.y = 0.025;
    carpet.receiveShadow = true;
    scene.add(carpet);

    // Circular Conference Desk in the Middle
    const tableMat = new THREE.MeshStandardMaterial({ color: '#5C3317', roughness: 0.45, metalness: 0.1 });
    const deskRing = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.35, 0.14, 40), tableMat);
    deskRing.position.y = 0.78;
    deskRing.castShadow = true;
    deskRing.receiveShadow = true;
    scene.add(deskRing);

    const centerPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.76, 24), tableMat);
    centerPedestal.position.y = 0.38;
    scene.add(centerPedestal);

    // Central Rehal / Golden Quran Stand on table
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.08, 0.55),
      new THREE.MeshStandardMaterial({ color: '#D97706', metalness: 0.4, roughness: 0.3 })
    );
    stand.position.set(0, 0.89, 0);
    scene.add(stand);

    // Back 51-Kitab Wall & Bookshelves
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(18, 6.5, 0.4),
      new THREE.MeshStandardMaterial({ color: '#3F1414', roughness: 0.9 })
    );
    backWall.position.set(0, 3.2, -6.5);
    scene.add(backWall);

    // 3 Tall Kitab Bookshelves holding "51 Kitab"
    const spineColors = ['#B45309', '#065F46', '#991B1B', '#1E3A8A', '#78350F'];
    [-4.8, 0, 4.8].forEach((bx) => {
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 3.6, 0.55),
        new THREE.MeshStandardMaterial({ color: '#451A03', roughness: 0.7 })
      );
      shelf.position.set(bx, 1.85, -6.05);
      scene.add(shelf);
      for (let row = 0; row < 3; row++) {
        for (let b = 0; b < 9; b++) {
          const book = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.42 + (b % 3) * 0.05, 0.3),
            new THREE.MeshStandardMaterial({ color: spineColors[(b + row) % spineColors.length], roughness: 0.6 })
          );
          book.position.set(bx - 1.25 + b * 0.31, 0.9 + row * 0.92, -5.85);
          scene.add(book);
        }
      }
    });

    // Main Hanging Board
    const boardTex = createHadisBoardTexture(result.pertanyaan, activeKitabName);
    const boardMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 2.7),
      new THREE.MeshBasicMaterial({ map: boardTex })
    );
    boardMesh.position.set(0, 3.7, -5.68);
    scene.add(boardMesh);

    // 4 Lead Halaqah Scholars + 4 Outer Researcher Avatars
    const buildScholar = (color: string, x: number, z: number, facingAngle: number, hasGoldRing: boolean) => {
      const g = new THREE.Group();
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.32, 0.68, 16),
        new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
      );
      torso.position.y = 0.85;
      torso.castShadow = true;
      g.add(torso);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshStandardMaterial({ color: '#F3C69F', roughness: 0.55 })
      );
      head.position.y = 1.38;
      g.add(head);

      const peci = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.19, 0.14, 16),
        new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.7 })
      );
      peci.position.y = 1.56;
      g.add(peci);

      if (hasGoldRing) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.45, 0.54, 24),
          new THREE.MeshBasicMaterial({ color: '#FBBF24', side: THREE.DoubleSide })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.06;
        g.add(ring);
      }

      // Open Kitab on circular desk in front of scholar
      const kitab = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.05, 0.34),
        new THREE.MeshStandardMaterial({ color: '#FEF3C7', roughness: 0.5 })
      );
      kitab.position.set(0, 0.89, 0.72);
      g.add(kitab);

      g.position.set(x, 0, z);
      g.rotation.y = facingAngle;
      scene.add(g);
    };

    HALAQAH_ROLES.forEach((r, idx) => {
      const radius = 3.05;
      const x = Math.cos(r.angleRad) * radius;
      const z = Math.sin(r.angleRad) * radius;
      const facing = Math.atan2(-x, -z);
      buildScholar(r.accent, x, z, facing, focusRoleIdx === idx);
    });

    // Outer santri researchers seated in semi-circle
    [-Math.PI * 0.75, -Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.75].forEach((ang) => {
      const x = Math.cos(ang) * 4.55;
      const z = Math.sin(ang) * 4.55;
      buildScholar('#064E3B', x, z, Math.atan2(-x, -z), false);
    });

    let animId = 0;
    let t = 0;
    const animate = () => {
      t += 0.008;
      const radiusCam = isFullscreen ? 8.8 : 9.4;
      const baseAngle = focusRoleIdx !== null ? HALAQAH_ROLES[focusRoleIdx].angleRad + Math.PI * 0.18 : Math.sin(t * 0.45) * 0.32 + Math.PI / 2;
      const desiredX = focusRoleIdx !== null ? Math.cos(baseAngle) * 5.8 : Math.sin(t * 0.45) * 3.0;
      const desiredZ = focusRoleIdx !== null ? Math.sin(baseAngle) * 5.8 : radiusCam;
      camera.position.x += (desiredX - camera.position.x) * 0.06;
      camera.position.z += (desiredZ - camera.position.z) * 0.06;
      camera.position.y += ((isFullscreen ? 5.6 : 6.1) - camera.position.y) * 0.06;
      camera.lookAt(0, 1.35, -0.5);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 800;
      const nh = container.clientHeight || 460;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      boardTex.dispose();
      carpetTex.dispose();
      renderer.dispose();
    };
  }, [hasWebGL, result.pertanyaan, activeKitabName, focusRoleIdx, isFullscreen]);

  const handleDownloadPdf = async () => {
    try {
      setExportingPdf(true);
      await exportRuangHadisPdf(result);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#1B0D0D] flex flex-col text-white'
          : 'rounded-3xl overflow-hidden border border-amber-500/30 bg-[#1B0D0D] text-white shadow-2xl'
      }
    >
      {/* Header Control Bar */}
      <div className="px-4 sm:px-6 py-3.5 bg-linear-to-r from-[#450A0A] via-[#7F1D1D] to-[#450A0A] border-b border-amber-400/30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-arabic text-base text-amber-300">عِلْمُ الْحَدِيْثِ</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              RUANG HADIS · 51 KITAB
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
            Perumusan Hadits &amp; Takhrij Sanad Interaktif 3D
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAskModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ajukan As&apos;ilah Hadis</span>
          </button>
          <button
            type="button"
            onClick={() => runDeliberation(questionInput)}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Putar Halaqah 51 Kitab</span>
          </button>
          <button
            type="button"
            onClick={() => setShowResultModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5"
          >
            <ScrollText className="w-3.5 h-3.5 text-amber-300" />
            <span>Kumpulan Hadis</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-0' : compact ? 'h-[430px]' : 'h-[500px]'}`}>
        {hasWebGL ? (
          <div ref={mountRef} className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-linear-to-b from-[#3B0D0D] to-[#1B0D0D] space-y-4">
            <span className="font-arabic text-3xl text-amber-300">عِلْمُ الْحَدِيْثِ · حَلْقَةُ ٥١ كِتَابًا</span>
            <p className="text-sm font-extrabold">Majlis Halaqah 51 Kitab Hadis Mu&apos;tabarah</p>
            <p className="text-xs text-amber-100/80 max-w-lg">
              As&apos;ilah Aktif: <strong>{result.pertanyaan}</strong>
            </p>
          </div>
        )}

        {/* Active Deliberation Banner */}
        {isDeliberating && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-black/85 border border-amber-400 text-xs font-bold flex items-center gap-2.5 shadow-xl">
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            <span>
              Halaqah sedang membuka <strong className="text-amber-300">{activeKitabName}</strong> ({deliberationStep + 1}/8)...
            </span>
          </div>
        )}

        {/* 4 Station Role Badges Overlay */}
        <div className="absolute bottom-3 inset-x-3 z-10 grid grid-cols-2 lg:grid-cols-4 gap-2 pointer-events-auto">
          {HALAQAH_ROLES.map((role, idx) => {
            const active = focusRoleIdx === idx;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setFocusRoleIdx(active ? null : idx)}
                className={`p-2.5 rounded-2xl border text-left backdrop-blur-md transition ${
                  active
                    ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-lg'
                    : 'bg-black/75 text-white border-white/15 hover:bg-black/90'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-black">{role.label}</span>
                  <span className={`font-arabic text-xs ${active ? 'text-red-900' : 'text-amber-300'}`}>
                    {role.arab}
                  </span>
                </div>
                <p className={`text-[10px] truncate mt-0.5 ${active ? 'text-slate-900 font-bold' : 'text-emerald-300'}`}>
                  {isDeliberating && active ? activeKitabName : role.kitabBadge}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Quick Topic Chips */}
      <div className="px-4 sm:px-6 py-3 bg-[#260B0B] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-amber-300 mr-1">Topik Halaqah Cepat:</span>
          {RUANG_HADIS_PRESET_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => runDeliberation(topic)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                result.pertanyaan === topic
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white/10 text-amber-100 border-white/15 hover:bg-white/20'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={exportingPdf}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 disabled:opacity-60"
        >
          {exportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span>Unduh PDF Rumusan Hadis</span>
        </button>
      </div>

      {/* MODAL 1: AJUKAN AS'ILAH HADIS + VOICE MIC */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#1F0E0E] border border-amber-500/40 text-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-arabic text-2xl text-amber-300">عِلْمُ الْحَدِيْثِ · ٥١ كِتَابًا</p>
                <h4 className="text-base font-extrabold mt-0.5">Ajukan As&apos;ilah Hadis</h4>
                <p className="text-xs text-amber-100/80">
                  Halaqah 51 Kitab menelusuri takhrij sanad, derajat hadis (Shahih/Hasan/Dha&apos;if), syarah, serta hukum yang diambil.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAskModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300">Pertanyaan / Topik Hadis</label>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition ${
                    listeningVoice
                      ? 'bg-red-600 border-red-400 text-white animate-pulse'
                      : 'bg-white/10 border-white/20 text-amber-200 hover:bg-white/20'
                  }`}
                >
                  {listeningVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{listeningVoice ? 'Hentikan Suara' : 'Tanya via Suara (Mic)'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Contoh: Status hadits 'thalabul ilmi faridhah' atau Syarah hadits innamal a'mal..."
                className="w-full rounded-2xl bg-black/40 border border-amber-500/40 p-3 text-xs text-white focus:outline-none focus:border-amber-300"
              />
              {voiceNote && <p className="text-[11px] text-emerald-300">{voiceNote}</p>}
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-amber-200/80 uppercase">Contoh Kajian Populer:</p>
              <div className="flex flex-wrap gap-1.5">
                {RUANG_HADIS_PRESET_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setQuestionInput(t)}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-[11px] font-bold transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAskModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => runDeliberation(questionInput)}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bahas di Halaqah 51 Kitab</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HASIL RUMUSAN RUANG HADIS - KUMPULAN HADIS */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-linear-to-r from-[#7F1D1D] to-[#991B1B] text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
              <div>
                <p className="font-arabic text-base text-amber-300">عِلْمُ الْحَدِيْثِ · Ruang Hadis - Kumpulan Hadis</p>
                <h4 className="font-extrabold text-sm sm:text-base mt-0.5">{result.pertanyaan}</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={exportingPdf}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5"
                >
                  {exportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>Unduh PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50">
              {/* Ringkasan Tema */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-1.5">
                <h5 className="text-xs font-black text-red-900 uppercase">Ringkasan Tema &amp; Takhrij</h5>
                <p className="text-xs text-slate-700 leading-relaxed">{result.ringkasanTema}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.kitabDirujuk.map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-950 text-[10px] font-bold">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Numbered Hadis Cards */}
              <div className="space-y-3">
                {result.hadisList.map((h) => (
                  <div key={h.nomor} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2.5 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-red-900 text-white text-[11px] font-black">
                          Hadis {h.nomor}
                        </span>
                        <h6 className="font-extrabold text-xs sm:text-sm text-slate-900">{h.judul}</h6>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
                        {h.derajat}
                      </span>
                    </div>

                    <p dir="rtl" className="font-arabic text-lg sm:text-xl text-emerald-950 bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-right leading-[2]">
                      {h.matanArab}
                    </p>

                    <p className="text-xs text-slate-800 italic leading-relaxed">&ldquo;{h.terjemah}&rdquo;</p>

                    <div className="text-[11px] text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-1">
                      <p><strong>Perawi:</strong> {h.perawi} · <strong>Takhrij:</strong> {h.kitabTakhrij}</p>
                      <p><strong>Syarah:</strong> {h.syarahRingkas}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Faidah & Hukum yang diambil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2">
                  <h5 className="text-xs font-black text-slate-900 uppercase">Faidah Ilmiah</h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {result.faidah.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-emerald-900 text-white p-4 space-y-2">
                  <h5 className="text-xs font-black text-amber-300 uppercase">Hukum &amp; Kesimpulan Halaqah</h5>
                  <p className="text-xs text-emerald-50 leading-relaxed">{result.hukumDiambil}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
