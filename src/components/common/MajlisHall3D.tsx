import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface MajlisCameraTarget {
  pos: [number, number, number];
  target: [number, number, number];
}

export interface MajlisBoardConfig {
  arabicHeading: string;
  title: string;
  subtitleLabel: string;
  subtitleText: string;
  bodyLabel: string;
  bodyText: string;
}

export interface MajlisBenchStation {
  id: string;
  label: string;
  badgeColor: string;
  position: [number, number, number];
  rotationY: number;
  avatarCount?: number;
  isSantriPeserta?: boolean;
  kitabColor?: string;
  noPersonalKitab?: boolean;
  hasEnvelopeStack?: boolean;
}

export interface MajlisCalloutData {
  benchId: string;
  headerBadge?: string;
  arabLine?: string;
  primaryText: string;
  secondaryText?: string;
  kitabTickerItems?: string[];
  accentHex?: string;
}

interface MajlisHall3DProps {
  mode: 'bahtsul_masail' | 'munaqosyah';
  cameraTarget: MajlisCameraTarget;
  boardConfig: MajlisBoardConfig;
  benches: MajlisBenchStation[];
  activeBenchId?: string | null;
  callouts?: MajlisCalloutData[];
  audienceCount?: number;
  audienceFromZ?: number;
}

function detectWebGLSupport(): { ok: boolean; isSoftware: boolean } {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return { ok: false, isSoftware: true };
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const ren = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftware = /swiftshader|llvmpipe|software/i.test(ren);
    return { ok: true, isSoftware };
  } catch {
    return { ok: false, isSoftware: true };
  }
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = (text || '').split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
      if (lines.length >= maxLines) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines && words.length > 0) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(last).width > maxWidth - 20) {
      lines[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 3))}...`;
    }
  }
  return lines;
}

function createFloorTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#EFE6D1';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = '#DFD2B5';
  ctx.lineWidth = 3;
  const step = 64;
  for (let i = 0; i <= 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0D5E3C';
  ctx.fillRect(0, 0, 512, 1024);

  // Gold & emerald borders
  ctx.strokeStyle = '#D4A843';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, 472, 984);
  ctx.strokeStyle = '#EAB308';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 440, 952);

  // Geometric Islamic diamond medallions
  ctx.strokeStyle = 'rgba(212, 168, 67, 0.35)';
  ctx.lineWidth = 3;
  for (let y = 128; y < 920; y += 155) {
    for (let x = 130; x <= 382; x += 126) {
      ctx.beginPath();
      ctx.moveTo(x, y - 48);
      ctx.lineTo(x + 48, y);
      ctx.lineTo(x, y + 48);
      ctx.lineTo(x - 48, y);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createNameplateTexture(label: string, bgHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = bgHex;
  ctx.fillRect(8, 8, 496, 112);
  ctx.strokeStyle = '#FCD34D';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 492, 108);

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = label.length > 20 ? 28 : label.length > 14 ? 34 : 42;
  ctx.font = `800 ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(label.toUpperCase(), 256, 65, 464);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawBoardToCanvas(canvas: HTMLCanvasElement, cfg: MajlisBoardConfig) {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  // Deep emerald chalkboard
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#073D27');
  grad.addColorStop(1, '#04291A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Inner ornamental gold frame
  ctx.strokeStyle = '#D4A843';
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.strokeStyle = 'rgba(252, 211, 77, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  // Arabic title
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = '700 48px "Amiri", "Traditional Arabic", serif';
  ctx.fillText(cfg.arabicHeading, w / 2, 84);

  // Main English/Indo title
  ctx.fillStyle = '#FCD34D';
  ctx.font = '800 30px system-ui, -apple-system, sans-serif';
  ctx.fillText(cfg.title.toUpperCase(), w / 2, 132);

  // Divider line
  ctx.strokeStyle = 'rgba(212, 168, 67, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(96, 152);
  ctx.lineTo(w - 96, 152);
  ctx.stroke();

  // Subtitle label & text (e.g. MASALAH / PESERTA)
  ctx.fillStyle = '#6EE7B7';
  ctx.font = '800 18px system-ui, sans-serif';
  ctx.fillText(cfg.subtitleLabel.toUpperCase(), w / 2, 184);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 26px system-ui, sans-serif';
  const subLines = wrapTextLines(ctx, cfg.subtitleText, w - 120, 2);
  subLines.forEach((ln, idx) => {
    ctx.fillText(ln, w / 2, 220 + idx * 34);
  });

  // Body label & text (e.g. RUMUSAN SIDANG / MATERI KITAB)
  const bodyTop = subLines.length > 1 ? 298 : 275;
  ctx.fillStyle = '#FDE68A';
  ctx.font = '800 17px system-ui, sans-serif';
  ctx.fillText(cfg.bodyLabel.toUpperCase(), w / 2, bodyTop);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '500 21px system-ui, sans-serif';
  const bodyLines = wrapTextLines(ctx, cfg.bodyText, w - 120, 4);
  bodyLines.forEach((ln, idx) => {
    ctx.fillText(ln, w / 2, bodyTop + 32 + idx * 29);
  });
}

function buildAvatarGroup(isSantriPeserta: boolean, skinTone = 0xe8be9e): THREE.Group {
  const g = new THREE.Group();

  const clothMat = new THREE.MeshStandardMaterial({
    color: isSantriPeserta ? 0xf1f5f9 : 0xf8fafc,
    roughness: 0.72,
    metalness: 0.02,
  });
  const sarungMat = new THREE.MeshStandardMaterial({
    color: isSantriPeserta ? 0x0f5132 : 0x1e293b,
    roughness: 0.85,
    metalness: 0.04,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinTone,
    roughness: 0.62,
    metalness: 0.02,
  });
  const peciMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.7,
    metalness: 0.05,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4a843,
    roughness: 0.3,
    metalness: 0.8,
  });

  // Seated lap / sarung lower body (grounded above chair seat y=0.45)
  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.42), sarungMat);
  lowerBody.position.set(0, 0.56, 0.04);
  lowerBody.castShadow = true;
  g.add(lowerBody);

  // White koko torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.26), clothMat);
  torso.position.set(0, 0.89, -0.02);
  torso.castShadow = true;
  g.add(torso);

  // Collar / front placket accent
  const placket = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.26, 0.02),
    isSantriPeserta ? sarungMat : goldMat
  );
  placket.position.set(0, 0.96, 0.115);
  g.add(placket);

  // Arms resting toward desk
  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.34, 0.12), clothMat);
    arm.position.set(side * 0.26, 0.85, 0.08);
    arm.rotation.x = -Math.PI / 4;
    arm.castShadow = true;
    g.add(arm);
  });

  // Head pivot for natural speaking nod
  const headPivot = new THREE.Group();
  headPivot.name = 'headPivot';
  headPivot.position.set(0, 1.24, 0);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 16), skinMat);
  head.castShadow = true;
  headPivot.add(head);

  // Subtle eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
  [-0.055, 0.055].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), eyeMat);
    eye.position.set(ex, 0.02, 0.155);
    headPivot.add(eye);
  });

  // Indonesian Pesantren Peci / Songkok
  const peci = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.165, 0.14, 18), peciMat);
  peci.position.set(0, 0.125, -0.01);
  peci.castShadow = true;
  headPivot.add(peci);

  g.add(headPivot);
  return g;
}

function buildBenchStation(station: MajlisBenchStation): {
  group: THREE.Group;
  headAnchor: THREE.Object3D;
  avatars: THREE.Group[];
  glowRing: THREE.Mesh;
} {
  const group = new THREE.Group();
  group.position.set(...station.position);
  group.rotation.y = station.rotationY;

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x7c4a26,
    roughness: 0.65,
    metalness: 0.05,
  });
  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x4a2c15,
    roughness: 0.72,
    metalness: 0.06,
  });
  const emeraldTrimMat = new THREE.MeshStandardMaterial({
    color: 0x0f6b43,
    roughness: 0.55,
    metalness: 0.1,
  });

  const count = station.avatarCount ?? 1;
  const deskWidth = count > 1 ? 2.1 : 1.45;
  const deskDepth = 0.72;

  // Front modest desk panel
  const deskBody = new THREE.Mesh(new THREE.BoxGeometry(deskWidth, 0.74, deskDepth), woodMat);
  deskBody.position.set(0, 0.37, 0.32);
  deskBody.castShadow = true;
  deskBody.receiveShadow = true;
  group.add(deskBody);

  // Tabletop overhang
  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(deskWidth + 0.08, 0.06, deskDepth + 0.08),
    darkWoodMat
  );
  deskTop.position.set(0, 0.76, 0.32);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  group.add(deskTop);

  // Front Nameplate Plaque facing outward (+Z local)
  const plateTex = createNameplateTexture(station.label, station.badgeColor);
  const plateMat = new THREE.MeshStandardMaterial({
    map: plateTex,
    roughness: 0.45,
    metalness: 0.05,
  });
  const plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(deskWidth * 0.86, 0.32), plateMat);
  plateMesh.position.set(0, 0.43, 0.32 + deskDepth / 2 + 0.015);
  group.add(plateMesh);

  // Subtle highlight glow strip under bench when active
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(station.badgeColor),
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
  });
  const glowRing = new THREE.Mesh(new THREE.PlaneGeometry(deskWidth + 0.35, 1.55), ringMat);
  glowRing.rotation.x = -Math.PI / 2;
  glowRing.position.set(0, 0.018, 0.05);
  group.add(glowRing);

  // Avatars + Chairs + Open Kitab Kuning on table
  const avatars: THREE.Group[] = [];
  const spacing = count > 1 ? 0.92 : 0;
  const startX = -((count - 1) * spacing) / 2;

  for (let i = 0; i < count; i++) {
    const ax = startX + i * spacing;

    // Wooden chair
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.44), darkWoodMat);
    chairSeat.position.set(ax, 0.44, -0.3);
    chairSeat.castShadow = true;
    group.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.5, 0.06), darkWoodMat);
    chairBack.position.set(ax, 0.7, -0.5);
    chairBack.castShadow = true;
    group.add(chairBack);

    const chairLegGeo = new THREE.BoxGeometry(0.06, 0.44, 0.06);
    [
      [-0.18, -0.14],
      [0.18, -0.14],
      [-0.18, -0.46],
      [0.18, -0.46],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(chairLegGeo, darkWoodMat);
      leg.position.set(ax + lx, 0.22, lz);
      group.add(leg);
    });

    const avatar = buildAvatarGroup(
      Boolean(station.isSantriPeserta),
      i % 2 === 0 ? 0xe7bc98 : 0xdcb08a
    );
    avatar.position.set(ax, 0, -0.26);
    group.add(avatar);
    avatars.push(avatar);

    // Open Kitab Kuning OR Committee Makro' Sheet (if santri enters without personal kitab)
    if (station.noPersonalKitab) {
      const sheetMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.75 });
      const sheetMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 0.22), sheetMat);
      sheetMesh.position.set(ax, 0.798, 0.25);
      const sealMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
      const seal = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.014, 0.04), sealMat);
      seal.position.set(ax, 0.805, 0.25);
      group.add(sheetMesh, seal);
    } else {
      const kitabGroup = new THREE.Group();
      kitabGroup.position.set(ax, 0.8, 0.26);
      const coverColor = station.kitabColor || (i % 2 === 0 ? '#8B1E24' : '#0F5132');
      const coverMat = new THREE.MeshStandardMaterial({ color: coverColor, roughness: 0.65 });
      const pageMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 });
      const leftPage = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.3), pageMat);
      leftPage.position.set(-0.125, 0.015, 0);
      leftPage.rotation.z = 0.08;
      const rightPage = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.3), pageMat);
      rightPage.position.set(0.125, 0.015, 0);
      rightPage.rotation.z = -0.08;
      const cover = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.016, 0.32), coverMat);
      kitabGroup.add(cover, leftPage, rightPage);
      group.add(kitabGroup);
    }

    // Stack of Makro' envelopes on Moderator bench
    if (station.hasEnvelopeStack && i === 0) {
      const envMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.7 });
      const trimMat = new THREE.MeshStandardMaterial({ color: 0x0f6b43, roughness: 0.5 });
      for (let eIdx = 0; eIdx < 4; eIdx++) {
        const env = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.016, 0.16), envMat);
        env.position.set(-0.42, 0.8 + eIdx * 0.018, 0.3);
        env.rotation.y = (eIdx - 1.5) * 0.09;
        group.add(env);
      }
      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.04), trimMat);
      ribbon.position.set(-0.42, 0.875, 0.3);
      group.add(ribbon);
    }

    // Tabletop microphone
    const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.025, 12), emeraldTrimMat);
    micBase.position.set(ax + 0.24, 0.8, 0.42);
    const micStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.22, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 })
    );
    micStem.position.set(ax + 0.24, 0.91, 0.4);
    micStem.rotation.x = -0.35;
    group.add(micBase, micStem);
  }

  const headAnchor = new THREE.Object3D();
  headAnchor.position.set(0, 1.92, 0.05);
  group.add(headAnchor);

  return { group, headAnchor, avatars, glowRing };
}

const _projVec = new THREE.Vector3();

export const MajlisHall3D: React.FC<MajlisHall3DProps> = ({
  mode,
  cameraTarget,
  boardConfig,
  benches,
  activeBenchId,
  callouts = [],
  audienceCount = 24,
  audienceFromZ = 2.8,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const calloutDomRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Live mutable refs read inside RAF without recreating WebGL context
  const cameraTargetRef = useRef(cameraTarget);
  cameraTargetRef.current = cameraTarget;
  const activeBenchIdRef = useRef(activeBenchId);
  activeBenchIdRef.current = activeBenchId;

  const boardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardTexRef = useRef<THREE.CanvasTexture | null>(null);

  const [webglStatus] = useState(() => detectWebGLSupport());
  const [tickerIdx, setTickerIdx] = useState(0);

  // Orbit drag offset & zoom offset
  const orbitOffsetRef = useRef({ yaw: 0, pitch: 0, zoom: 1 });
  const dragStateRef = useRef<{ active: boolean; lastX: number; lastY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
  });

  // Cycle classical kitab titles slowly when kitabTickerItems exist
  useEffect(() => {
    const id = window.setInterval(() => {
      setTickerIdx((prev) => prev + 1);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  // Reset manual orbit drag smoothly when preset target changes
  useEffect(() => {
    orbitOffsetRef.current = { yaw: 0, pitch: 0, zoom: 1 };
  }, [cameraTarget.pos[0], cameraTarget.pos[1], cameraTarget.pos[2]]);

  // Update dynamic green-gold chalkboard texture whenever boardConfig changes
  useEffect(() => {
    if (boardCanvasRef.current && boardTexRef.current) {
      drawBoardToCanvas(boardCanvasRef.current, boardConfig);
      boardTexRef.current.needsUpdate = true;
    }
  }, [boardConfig]);

  // Main Three.js Scene Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webglStatus.ok) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    const renderer = new THREE.WebGLRenderer({
      antialias: !webglStatus.isSoftware,
      powerPreference: webglStatus.isSoftware ? 'low-power' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, webglStatus.isSoftware ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !webglStatus.isSoftware;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#EFE7D6');
    scene.fog = new THREE.Fog('#EFE7D6', 18, 34);

    // RoomEnvironment IBL
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 60);
    camera.position.set(...cameraTargetRef.current.pos);
    const currentCamPos = new THREE.Vector3(...cameraTargetRef.current.pos);
    const currentCamLook = new THREE.Vector3(...cameraTargetRef.current.target);
    camera.lookAt(currentCamLook);

    // Warm Pesantren Lighting
    const hemi = new THREE.HemisphereLight(0xfffbeb, 0x7c5836, 0.65);
    scene.add(hemi);

    const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.35);
    sunLight.position.set(-7.5, 9.5, 3.5);
    sunLight.castShadow = !webglStatus.isSoftware;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 28;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xd1fae5, 0.45);
    fillLight.position.set(7, 6, 4);
    scene.add(fillLight);

    // 1. Hall Floor + Ornate Emerald-Gold Central Carpet
    const floorTex = createFloorTileTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.72,
      metalness: 0.04,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 22), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const carpetTex = createCarpetTexture();
    const carpetMat = new THREE.MeshStandardMaterial({
      map: carpetTex,
      roughness: 0.9,
      metalness: 0.02,
    });
    const carpet = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.024, 11.4), carpetMat);
    carpet.position.set(0, 0.012, 0.2);
    carpet.receiveShadow = true;
    scene.add(carpet);

    // 2. Walls & Timber Wainscoting
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf6efde, roughness: 0.88 });
    const wainscotMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.28, metalness: 0.82 });

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 7.2, 0.3), wallMat);
    backWall.position.set(0, 3.6, -7.8);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const backTrim = new THREE.Mesh(new THREE.BoxGeometry(20, 1.3, 0.34), wainscotMat);
    backTrim.position.set(0, 0.65, -7.75);
    scene.add(backTrim);

    [-1, 1].forEach((side) => {
      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7.2, 22), wallMat);
      sideWall.position.set(side * 9.2, 3.6, 1.5);
      sideWall.receiveShadow = true;
      scene.add(sideWall);

      const sideTrim = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.3, 22), wainscotMat);
      sideTrim.position.set(side * 9.15, 0.65, 1.5);
      scene.add(sideTrim);

      // Tall arched windows + golden sunbeams
      for (let wz = -4; wz <= 6; wz += 4.8) {
        const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.6, 2.2), wainscotMat);
        winFrame.position.set(side * 8.98, 3.7, wz);
        scene.add(winFrame);

        const winGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(2.0, 3.35),
          new THREE.MeshBasicMaterial({ color: 0xfff7d6, side: THREE.DoubleSide })
        );
        winGlass.rotation.y = (side * Math.PI) / 2;
        winGlass.position.set(side * 8.88, 3.7, wz);
        scene.add(winGlass);

        if (side === -1) {
          // Soft sunbeam shaft entering from left windows
          const beamMat = new THREE.MeshBasicMaterial({
            color: 0xfef08a,
            transparent: true,
            opacity: 0.14,
            depthWrite: false,
            side: THREE.DoubleSide,
          });
          const beam = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.1), beamMat);
          beam.rotation.x = -Math.PI / 2;
          beam.rotation.z = -0.12;
          beam.position.set(-5.6, 0.03, wz);
          scene.add(beam);
        }
      }
    });

    // 3. Elevated Front Dais Platform
    const dais = new THREE.Mesh(
      new THREE.BoxGeometry(10.6, 0.24, 3.1),
      new THREE.MeshStandardMaterial({ color: 0x4e301b, roughness: 0.68 })
    );
    dais.position.set(0, 0.12, -5.6);
    dais.receiveShadow = true;
    dais.castShadow = true;
    scene.add(dais);

    const daisTrim = new THREE.Mesh(new THREE.BoxGeometry(10.7, 0.05, 3.2), goldMat);
    daisTrim.position.set(0, 0.23, -5.6);
    scene.add(daisTrim);

    // 4. Grand Dynamic Green & Gold Chalkboard
    const boardCanvas = document.createElement('canvas');
    boardCanvas.width = 1024;
    boardCanvas.height = 512;
    boardCanvasRef.current = boardCanvas;
    drawBoardToCanvas(boardCanvas, boardConfig);
    const boardTex = new THREE.CanvasTexture(boardCanvas);
    boardTex.colorSpace = THREE.SRGBColorSpace;
    boardTexRef.current = boardTex;

    const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(6.9, 3.55, 0.14), goldMat);
    boardFrame.position.set(0, 3.45, -7.52);
    boardFrame.castShadow = true;
    scene.add(boardFrame);

    const boardPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6.62, 3.28),
      new THREE.MeshStandardMaterial({
        map: boardTex,
        roughness: 0.42,
        metalness: 0.04,
      })
    );
    boardPlane.position.set(0, 3.45, -7.43);
    scene.add(boardPlane);

    // 5. Flanking Kitab Racks (Lemari Kitab Kuning)
    [-5.1, 5.1].forEach((rx) => {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.2, 0.52), wainscotMat);
      rack.position.set(rx, 1.6, -7.35);
      rack.castShadow = true;
      scene.add(rack);

      const bookPalette = [0x0f5132, 0x8b1e24, 0x1e3a8a, 0xb45309, 0x115e59];
      for (let row = 0; row < 4; row++) {
        for (let b = 0; b < 7; b++) {
          const book = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.42, 0.28),
            new THREE.MeshStandardMaterial({
              color: bookPalette[(row * 3 + b) % bookPalette.length],
              roughness: 0.65,
            })
          );
          book.position.set(rx - 0.8 + b * 0.26, 0.55 + row * 0.68, -7.2);
          scene.add(book);
        }
      }
    });

    // 6. Hanging Brass Pendant Lamps
    [-3.2, 0, 3.2].forEach((lx) => {
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      cord.position.set(lx, 6.1, -3.5);
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.36, 16), goldMat);
      shade.position.set(lx, 5.05, -3.5);
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xfef3c7,
          emissive: 0xfbbf24,
          emissiveIntensity: 1.4,
        })
      );
      bulb.position.set(lx, 4.92, -3.5);
      scene.add(cord, shade, bulb);
    });

    const centralPoint = new THREE.PointLight(0xffedd5, 2.2, 16, 1.6);
    centralPoint.position.set(0, 4.6, -2.5);
    scene.add(centralPoint);

    // 7. Build Benches / Stations
    const stationEntries = benches.map((st) => {
      const built = buildBenchStation(st);
      scene.add(built.group);
      return { station: st, ...built };
    });

    // 8. Instanced Santri Audience behind center stage (InstancedMesh for crisp 60fps performance)
    const cols = 6;
    const rows = Math.max(1, Math.ceil(audienceCount / cols));
    const totalAudience = cols * rows;
    const deskInst = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.68, 0.44, 0.4),
      wainscotMat,
      totalAudience
    );
    const bodyInst = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.36, 0.44, 0.24),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.72 }),
      totalAudience
    );
    const headInst = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.145, 12, 10),
      new THREE.MeshStandardMaterial({ color: 0xe7bc98, roughness: 0.65 }),
      totalAudience
    );
    const peciInst = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.13, 0.14, 0.11, 12),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.75 }),
      totalAudience
    );
    deskInst.castShadow = !webglStatus.isSoftware;
    bodyInst.castShadow = !webglStatus.isSoftware;

    const dummy = new THREE.Object3D();
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const aisleGap = c >= 3 ? 1.15 : -1.15;
        const x = (c - 2.5) * 1.15 + aisleGap * 0.4;
        const z = audienceFromZ + r * 1.35;

        dummy.position.set(x, 0.22, z - 0.36);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        deskInst.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(x, 0.56, z);
        dummy.updateMatrix();
        bodyInst.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(x, 0.9, z);
        dummy.updateMatrix();
        headInst.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(x, 1.02, z);
        dummy.updateMatrix();
        peciInst.setMatrixAt(idx, dummy.matrix);

        idx++;
      }
    }
    [deskInst, bodyInst, headInst, peciInst].forEach((im) => {
      im.instanceMatrix.needsUpdate = true;
      im.computeBoundingSphere();
      scene.add(im);
    });

    // ResizeObserver
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || 600;
        const h = entry.contentRect.height || 400;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    // Animation Loop (Smooth MathUtils.damp + Screen-Space Callout Anchors)
    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const targetCfg = cameraTargetRef.current;
      const orb = orbitOffsetRef.current;

      // Apply user drag offset gently around look target
      const dx = targetCfg.pos[0] - targetCfg.target[0];
      const dy = targetCfg.pos[1] - targetCfg.target[1];
      const dz = targetCfg.pos[2] - targetCfg.target[2];
      const horizDist = Math.hypot(dx, dz) * orb.zoom;
      const baseYaw = Math.atan2(dx, dz) + orb.yaw;
      const targetX = THREE.MathUtils.clamp(
        targetCfg.target[0] + Math.sin(baseYaw) * horizDist,
        -8.3,
        8.3
      );
      const targetZ = THREE.MathUtils.clamp(
        targetCfg.target[2] + Math.cos(baseYaw) * horizDist,
        -4.5,
        11.2
      );
      const targetY = THREE.MathUtils.clamp(
        targetCfg.target[1] + dy * orb.zoom + orb.pitch,
        1.5,
        9.6
      );

      currentCamPos.x = THREE.MathUtils.damp(currentCamPos.x, targetX, 4.5, dt);
      currentCamPos.y = THREE.MathUtils.damp(currentCamPos.y, targetY, 4.5, dt);
      currentCamPos.z = THREE.MathUtils.damp(currentCamPos.z, targetZ, 4.5, dt);

      currentCamLook.x = THREE.MathUtils.damp(currentCamLook.x, targetCfg.target[0], 5.0, dt);
      currentCamLook.y = THREE.MathUtils.damp(currentCamLook.y, targetCfg.target[1], 5.0, dt);
      currentCamLook.z = THREE.MathUtils.damp(currentCamLook.z, targetCfg.target[2], 5.0, dt);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentCamLook);

      // Avatar subtle breathing / active speaker nod + floor highlight
      const speakingId = activeBenchIdRef.current;
      const cw = container.clientWidth || 800;
      const ch = container.clientHeight || 540;

      for (const entry of stationEntries) {
        const isSpeaking = speakingId === entry.station.id;
        const ringMat = entry.glowRing.material as THREE.MeshBasicMaterial;
        ringMat.opacity = THREE.MathUtils.damp(ringMat.opacity, isSpeaking ? 0.34 : 0.0, 6, dt);

        entry.avatars.forEach((av, avIdx) => {
          const head = av.getObjectByName('headPivot');
          if (head) {
            head.rotation.x = isSpeaking
              ? Math.sin(elapsed * 5.2 + avIdx) * 0.09
              : Math.sin(elapsed * 1.4 + avIdx * 1.3) * 0.025;
            head.rotation.y = isSpeaking ? Math.sin(elapsed * 2.4 + avIdx) * 0.14 : 0;
          }
        });

        // Project callout anchor cleanly into CSS transform
        const domEl = calloutDomRefs.current[entry.station.id];
        if (domEl) {
          entry.headAnchor.getWorldPosition(_projVec);
          _projVec.project(camera);
          if (_projVec.z > 1 || _projVec.z < -1) {
            domEl.style.opacity = '0';
          } else {
            const px = (_projVec.x * 0.5 + 0.5) * cw;
            const py = (-_projVec.y * 0.5 + 0.5) * ch;
            const clampedX = Math.max(84, Math.min(cw - 84, px));
            const clampedY = Math.max(54, Math.min(ch - 88, py));
            domEl.style.opacity = '1';
            domEl.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -100%)`;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material?.dispose();
          }
        }
      });
      floorTex.dispose();
      carpetTex.dispose();
      boardTex.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, [benches, audienceCount, audienceFromZ, webglStatus.ok, webglStatus.isSoftware, mode]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return;
    const dx = e.clientX - dragStateRef.current.lastX;
    const dy = e.clientY - dragStateRef.current.lastY;
    dragStateRef.current.lastX = e.clientX;
    dragStateRef.current.lastY = e.clientY;
    orbitOffsetRef.current.yaw = THREE.MathUtils.clamp(
      orbitOffsetRef.current.yaw - dx * 0.005,
      -0.85,
      0.85
    );
    orbitOffsetRef.current.pitch = THREE.MathUtils.clamp(
      orbitOffsetRef.current.pitch + dy * 0.015,
      -1.8,
      2.6
    );
  };

  const handlePointerUp = () => {
    dragStateRef.current.active = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    orbitOffsetRef.current.zoom = THREE.MathUtils.clamp(
      orbitOffsetRef.current.zoom + e.deltaY * 0.0008,
      0.62,
      1.35
    );
  };

  if (!webglStatus.ok) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#073D27] text-white p-6 text-center rounded-2xl">
        <p className="font-arabic text-2xl text-amber-300 mb-2">{boardConfig.arabicHeading}</p>
        <h3 className="text-base font-extrabold">{boardConfig.title}</h3>
        <p className="text-xs text-emerald-200 max-w-md mt-2">{boardConfig.subtitleText}</p>
        <p className="text-[11px] text-amber-200/80 mt-4">
          Browser saat ini tidak mengaktifkan akselerasi WebGL 3D. Silakan aktifkan hardware acceleration atau lanjutkan membaca rumusan sidang.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Dedicated empty Three.js WebGL Mount Div */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Projected Screen-Space Callout & Live Kitab Overlays (Zero backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {callouts.map((c) => {
          const tickerText =
            c.kitabTickerItems && c.kitabTickerItems.length > 0
              ? c.kitabTickerItems[tickerIdx % c.kitabTickerItems.length]
              : c.arabLine;

          return (
            <div
              key={c.benchId}
              ref={(el) => {
                calloutDomRefs.current[c.benchId] = el;
              }}
              style={{
                left: 0,
                top: 0,
                opacity: 0,
                transition: 'opacity 180ms ease',
              }}
              className="absolute z-10 w-max max-w-[235px]"
            >
              <div className="rounded-xl bg-[#FDFBF5] border border-amber-300 shadow-lg px-2.5 py-2 text-center space-y-1">
                {c.headerBadge && (
                  <div
                    className="inline-block px-2 py-0.5 rounded-md text-[9px] font-extrabold text-white tracking-wide"
                    style={{ backgroundColor: c.accentHex || '#0F6B43' }}
                  >
                    {c.headerBadge}
                  </div>
                )}
                {tickerText && (
                  <p className="font-arabic text-xs sm:text-sm font-bold text-emerald-950 leading-snug" dir="rtl">
                    {tickerText}
                  </p>
                )}
                <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 leading-tight">
                  {c.primaryText}
                </p>
                {c.secondaryText && (
                  <p className="text-[9.5px] text-slate-600 leading-tight line-clamp-2">
                    {c.secondaryText}
                  </p>
                )}
              </div>
              <div className="w-2.5 h-2.5 bg-[#FDFBF5] border-r border-b border-amber-300 rotate-45 mx-auto -mt-1.5" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
