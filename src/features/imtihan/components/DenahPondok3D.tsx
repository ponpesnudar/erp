import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Box,
  Layers,
  Eye,
  EyeOff,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
} from 'lucide-react';
import type { RuangUjian, Kursi as KursiUjian } from '../../../lib/rules.ts';
import type { ImtihanRoomConfig } from '../../../data/seed/pondokData.ts';

export interface DenahPondok3DProps {
  ruangUjianList: RuangUjian[];
  roomConfigs: ImtihanRoomConfig[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

interface RoomSpatialSpec {
  roomId: string;
  kode: string;
  buildingName: string;
  floor: 1 | 2;
  center: [number, number, number];
  size: [number, number, number];
  accentColor: number;
}

const TINGKAT_COLORS: Record<number, number> = {
  1: 0x10b981, // emerald
  2: 0x3b82f6, // blue
  3: 0xf59e0b, // amber
  4: 0x8b5cf6, // violet
  5: 0xf43f5e, // rose
  6: 0x14b8a6, // teal
};

function createSignTexture(
  title: string,
  subtitle: string,
  bgHex = '#064e3b',
  textHex = '#ffffff',
  borderHex = '#fbbf24'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  ctx.fillStyle = textHex;
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, canvas.width / 2, 58, canvas.width - 40);
  ctx.fillStyle = '#d1fae5';
  ctx.font = '600 22px sans-serif';
  ctx.fillText(subtitle, canvas.width / 2, 112, canvas.width - 40);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function getSpatialSpecs(
  ruangUjianList: RuangUjian[],
  roomConfigs: ImtihanRoomConfig[]
): RoomSpatialSpec[] {
  const specs: RoomSpatialSpec[] = [];
  // Default placements across Campus Buildings:
  // GD-A (Madrasah Diniyah Utama Putra - West/Center-Left): R1 (Lt1), R2 (Lt1), R3 (Lt2)
  // Masjid Darussalam (Center-Top): R4 (Serambi Timur Lt1)
  // GD-C (Gedung Madrasah & Asrama Putri - East): R5 (Lt1), R6 (Lt1), R7 (Lt2)
  const slots: Array<{
    buildingName: string;
    floor: 1 | 2;
    center: [number, number, number];
    size: [number, number, number];
    accentColor: number;
  }> = [
    {
      buildingName: 'Gedung Madrasah Utama (GD-A)',
      floor: 1,
      center: [-14, 0, -4],
      size: [9.5, 3.6, 8.5],
      accentColor: 0x0284c7,
    },
    {
      buildingName: 'Gedung Madrasah Utama (GD-A)',
      floor: 1,
      center: [-14, 0, 5.5],
      size: [9.5, 3.6, 8.5],
      accentColor: 0x2563eb,
    },
    {
      buildingName: 'Gedung Madrasah Utama (GD-A) Lt. 2',
      floor: 2,
      center: [-14, 3.8, 0.75],
      size: [9.5, 3.6, 17.5],
      accentColor: 0x0ea5e9,
    },
    {
      buildingName: 'Serambi Masjid Darussalam',
      floor: 1,
      center: [0, 0, -11.5],
      size: [11, 3.6, 8],
      accentColor: 0x059669,
    },
    {
      buildingName: 'Gedung Madrasah & Asrama Putri (GD-C)',
      floor: 1,
      center: [14, 0, -4],
      size: [9.5, 3.6, 9],
      accentColor: 0x10b981,
    },
    {
      buildingName: 'Gedung Madrasah & Asrama Putri (GD-C)',
      floor: 1,
      center: [14, 0, 5.8],
      size: [9.5, 3.6, 9],
      accentColor: 0x14b8a6,
    },
    {
      buildingName: 'Gedung Madrasah & Asrama Putri (GD-C) Lt. 2',
      floor: 2,
      center: [14, 3.8, 0.9],
      size: [9.5, 3.6, 18.2],
      accentColor: 0x0d9488,
    },
  ];

  ruangUjianList.forEach((room, idx) => {
    const cfg = roomConfigs.find((c) => c.id === room.id);
    const lokasi = (cfg?.lokasi || room.nama || '').toLowerCase();
    const isLt2 = lokasi.includes('lt. 2') || lokasi.includes('lt 2') || idx === 2 || idx === 6;
    const preset = slots[idx] || {
      buildingName: room.gender === 'P' ? 'Komplek Putri (GD-C)' : 'Komplek Putra (GD-A)',
      floor: (isLt2 ? 2 : 1) as 1 | 2,
      center: [
        room.gender === 'P' ? 14 : -14,
        isLt2 ? 3.8 : 0,
        ((idx - 3) % 3) * 10,
      ] as [number, number, number],
      size: [9.5, 3.6, 8.5] as [number, number, number],
      accentColor: room.gender === 'P' ? 0x10b981 : 0x0284c7,
    };

    specs.push({
      roomId: room.id,
      kode: room.kode,
      buildingName: preset.buildingName,
      floor: lokasi.includes('lt. 1') || lokasi.includes('lt 1') ? 1 : preset.floor,
      center: preset.center,
      size: preset.size,
      accentColor: preset.accentColor,
    });
  });

  return specs;
}

export const DenahPondok3D: React.FC<DenahPondok3DProps> = ({
  ruangUjianList,
  roomConfigs,
  activeRoomId,
  onSelectRoom,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [floorFilter, setFloorFilter] = useState<'all' | 1 | 2>('all');
  const [roofOpen, setRoofOpen] = useState<boolean>(true);
  const [hudMinimized, setHudMinimized] = useState<boolean>(false);
  const [selectedDeskInfo, setSelectedDeskInfo] = useState<{
    roomKode: string;
    roomNama: string;
    kursi: KursiUjian;
  } | null>(null);
  const [webglError, setWebglError] = useState<string>('');

  const specs = useMemo(
    () => getSpatialSpecs(ruangUjianList, roomConfigs),
    [ruangUjianList, roomConfigs]
  );

  // Refs synced inside animation loop & click handlers
  const activeRoomIdRef = useRef(activeRoomId);
  activeRoomIdRef.current = activeRoomId;
  const floorFilterRef = useRef(floorFilter);
  floorFilterRef.current = floorFilter;
  const roofOpenRef = useRef(roofOpen);
  roofOpenRef.current = roofOpen;
  const onSelectRoomRef = useRef(onSelectRoom);
  onSelectRoomRef.current = onSelectRoom;

  // Camera target lerp goal
  const cameraGoalRef = useRef<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
    active: boolean;
  }>({
    pos: new THREE.Vector3(0, 26, 33),
    target: new THREE.Vector3(0, 1.5, 0),
    active: false,
  });

  const focusRoom = (roomId: string) => {
    const sp = specs.find((s) => s.roomId === roomId);
    if (!sp) return;
    const [cx, cy, cz] = sp.center;
    const dirSign = cx < 0 ? 1 : cx > 0 ? -1 : 0;
    cameraGoalRef.current = {
      pos: new THREE.Vector3(cx + dirSign * 6.5, cy + 10.5, cz + 11.5),
      target: new THREE.Vector3(cx, cy + 1.2, cz),
      active: true,
    };
  };

  const resetOverviewCamera = () => {
    cameraGoalRef.current = {
      pos: new THREE.Vector3(0, 26, 33),
      target: new THREE.Vector3(0, 1.5, 0),
      active: true,
    };
    setSelectedDeskInfo(null);
  };

  const focusElevationPreset = (preset: 'gate' | 'masjid' | 'madrasah') => {
    setSelectedDeskInfo(null);
    if (preset === 'gate') {
      cameraGoalRef.current = {
        pos: new THREE.Vector3(0, 4.6, 29.5),
        target: new THREE.Vector3(0, 2.8, 17.5),
        active: true,
      };
    } else if (preset === 'masjid') {
      cameraGoalRef.current = {
        pos: new THREE.Vector3(2.5, 5.2, -3.5),
        target: new THREE.Vector3(0, 2.8, -17.5),
        active: true,
      };
    } else {
      cameraGoalRef.current = {
        pos: new THREE.Vector3(-1.5, 5.8, 7.5),
        target: new THREE.Vector3(-14, 3.2, 0.75),
        active: true,
      };
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Probe WebGL & software fallback detection
    let isSoftwareGl = false;
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) {
        setWebglError('WebGL tidak tersedia di browser ini.');
        return;
      }
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const rendererName = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      isSoftwareGl = /SwiftShader|llvmpipe|Software/i.test(rendererName);
    } catch {
      setWebglError('Gagal menginisialisasi konteks 3D WebGL.');
      return;
    }

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 460;

    // 2. Renderer & Scene
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe);
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.0082);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.25, 220);
    camera.position.set(0, 26, 33);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2.12;
    controls.minDistance = 7;
    controls.maxDistance = 68;
    controls.target.set(0, 1.5, 0);

    // Stop camera auto-glide if user grabs orbit controls manually
    const onControlStart = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('start', onControlStart);

    // 3. 3-Point Lighting
    const hemi = new THREE.HemisphereLight(0xf0f9ff, 0x3b4d38, 0.85);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff4d6, 2.1);
    sun.position.set(22, 34, 24);
    if (!isSoftwareGl) {
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.near = 2;
      sun.shadow.camera.far = 95;
      sun.shadow.camera.left = -30;
      sun.shadow.camera.right = 30;
      sun.shadow.camera.top = 28;
      sun.shadow.camera.bottom = -28;
      sun.shadow.bias = -0.0005;
    }
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x9ec5fe, 0.65);
    rim.position.set(-24, 16, -22);
    scene.add(rim);

    // Track disposable resources
    const disposables: Array<{ dispose: () => void }> = [envTarget, pmremGenerator];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      disposables.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      disposables.push(m);
      return m;
    };
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      disposables.push(t);
      return t;
    };

    // 4. Campus Ground, Courtyard & Pathways
    const campusGroup = new THREE.Group();
    scene.add(campusGroup);

    const grassMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x65a35d, roughness: 0.92, metalness: 0.0 })
    );
    const groundMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(62, 0.6, 46)), grassMat);
    groundMesh.position.set(0, -0.35, 0);
    groundMesh.receiveShadow = true;
    campusGroup.add(groundMesh);

    const stoneMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.78, metalness: 0.05 })
    );
    // Central courtyard paving
    const courtyard = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(17, 0.14, 28)), stoneMat);
    courtyard.position.set(0, 0.02, 2);
    courtyard.receiveShadow = true;
    campusGroup.add(courtyard);

    // Cross walkway to Putra (West) & Putri (East) buildings
    const crossWalk = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(28, 0.12, 4.2)), stoneMat);
    crossWalk.position.set(0, 0.03, 0.8);
    crossWalk.receiveShadow = true;
    campusGroup.add(crossWalk);

    // Architectural palette inspired directly by Pondpes real buildings (Images 5, 6, 7)
    const creamFacadeMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xe9e6dc, roughness: 0.68, metalness: 0.04 })
    );
    const taupeTrimMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x857b65, roughness: 0.55, metalness: 0.08 })
    );
    const silverSteelMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.3, metalness: 0.78 })
    );
    const darkGlassMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.35 })
    );
    const redRailMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.45, metalness: 0.25 })
    );

    // Pondok Main Gate / Gapura Utama at Front South (Matching Image 5 facade)
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 17.5);
    const pillarMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5, metalness: 0.1 })
    );
    const goldMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.65 })
    );

    // Twin tiered side towers + relief bases
    [-4.6, 4.6].forEach((gx) => {
      const basePedestal = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(2.6, 1.3, 1.5)),
        creamFacadeMat
      );
      basePedestal.position.set(gx, 0.65, 0);
      basePedestal.castShadow = true;
      gateGroup.add(basePedestal);

      const lowerHood = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(3.0, 0.22, 1.85)),
        taupeTrimMat
      );
      lowerHood.position.set(gx, 3.05, 0);
      gateGroup.add(lowerHood);

      // Four slender corner columns on tier 1
      [-0.95, 0.95].forEach((ox) => {
        [-0.48, 0.48].forEach((oz) => {
          const post = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 1.75, 0.24)), taupeTrimMat);
          post.position.set(gx + ox, 2.1, oz);
          gateGroup.add(post);
        });
      });

      const reliefTower = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(1.55, 1.8, 1.15)),
        creamFacadeMat
      );
      reliefTower.position.set(gx, 4.05, 0);
      reliefTower.castShadow = true;
      gateGroup.add(reliefTower);

      const upperHood = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(2.05, 0.22, 1.55)),
        taupeTrimMat
      );
      upperHood.position.set(gx, 4.95, 0);
      gateGroup.add(upperHood);
    });

    // Tall Monumental Top Span & Cornice Crown
    const gateBeam = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(9.6, 2.25, 1.25)), creamFacadeMat);
    gateBeam.position.set(0, 5.75, 0);
    gateBeam.castShadow = true;
    const gateCornice = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.5, 0.38, 1.7)), taupeTrimMat);
    gateCornice.position.set(0, 7.0, 0);
    gateGroup.add(gateBeam, gateCornice);

    // Ornate Stainless Steel Gate Panels with vertical bars & lantern diamond medallions
    const gateLowerPlate = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(6.6, 1.25, 0.14)), silverSteelMat);
    gateLowerPlate.position.set(0, 0.72, 0);
    gateGroup.add(gateLowerPlate);
    for (let i = -3; i <= 3; i++) {
      const bar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 2.75, 0.12)), silverSteelMat);
      bar.position.set(i * 0.9, 1.55, 0);
      gateGroup.add(bar);
    }
    [-2.0, -0.7, 0.7, 2.0].forEach((mx) => {
      const crest = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.36, 0)), goldMat);
      crest.scale.set(0.85, 1.25, 0.25);
      crest.position.set(mx, 2.15, 0);
      gateGroup.add(crest);
    });

    const gateTex = trackTex(
      createSignTexture('PP NU DARUSSALAM', 'KARANGDADAP · GERBANG UTAMA IMTIHAN', '#064e3b', '#ffffff', '#fbbf24')
    );
    const gateSign = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(8.4, 1.45, 0.18)),
      trackMat(new THREE.MeshStandardMaterial({ map: gateTex, roughness: 0.4 }))
    );
    gateSign.position.set(0, 5.75, 0.65);
    gateGroup.add(gateSign);
    campusGroup.add(gateGroup);

    // Composite Trees around courtyard
    const trunkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9 }));
    const leafMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 }));
    const treePositions: Array<[number, number]> = [
      [-6.8, 12],
      [6.8, 12],
      [-6.8, -4.5],
      [6.8, -4.5],
      [-21.5, -12],
      [21.5, -12],
      [-21.5, 13],
      [21.5, 13],
    ];
    treePositions.forEach(([tx, tz]) => {
      const tg = new THREE.Group();
      tg.position.set(tx, 0, tz);
      const trunk = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.22, 0.34, 2.1, 8)), trunkMat);
      trunk.position.y = 1.05;
      trunk.castShadow = true;
      const crown1 = new THREE.Mesh(trackGeo(new THREE.DodecahedronGeometry(1.45, 0)), leafMat);
      crown1.position.y = 2.9;
      crown1.castShadow = true;
      const crown2 = new THREE.Mesh(trackGeo(new THREE.DodecahedronGeometry(1.05, 0)), leafMat);
      crown2.position.set(0.35, 3.85, -0.2);
      crown2.castShadow = true;
      tg.add(trunk, crown1, crown2);
      campusGroup.add(tg);
    });

    // Shared building materials
    const wallMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.72, metalness: 0.04 })
    );
    const floorSlabMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.82 })
    );
    const roofTileMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x0f5132, roughness: 0.58, metalness: 0.12 })
    );
    const woodDeskMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.62, metalness: 0.05 })
    );
    const boardMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );

    // Mosque Front Elevation Behind R4 (Matching Image 6 facade: cream body, arched windows, curved portico + steps)
    const masjidGroup = new THREE.Group();
    masjidGroup.position.set(0, 0, -17.8);
    const masjidBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(12.2, 4.9, 6.4)), creamFacadeMat);
    masjidBody.position.y = 2.45;
    masjidBody.castShadow = true;
    const masjidPlinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(12.6, 0.45, 6.8)), taupeTrimMat);
    masjidPlinth.position.y = 0.22;
    const masjidCanopyUpper = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(13.2, 0.28, 7.6)), taupeTrimMat);
    masjidCanopyUpper.position.y = 4.95;

    // Semicircular front portico canopy + 3 curved white front stairs
    const porticoCanopy = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(2.6, 2.6, 0.24, 18, 1, false, -Math.PI / 2, Math.PI)),
      taupeTrimMat
    );
    porticoCanopy.position.set(-1.6, 3.8, 3.25);
    [0, 1, 2].forEach((stepIdx) => {
      const r = 2.9 - stepIdx * 0.34;
      const step = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(r, r, 0.18, 18, 1, false, -Math.PI / 2, Math.PI)),
        stoneMat
      );
      step.position.set(-1.6, 0.1 + stepIdx * 0.16, 3.25);
      masjidGroup.add(step);
    });

    // Arched Gothic/Islamic windows across Masjid front wall
    [-4.3, -1.6, 1.5, 4.3].forEach((wx) => {
      const winFrame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.75, 2.55, 0.16)), taupeTrimMat);
      winFrame.position.set(wx, 2.25, 3.22);
      const winGlass = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.4, 2.2, 0.2)), darkGlassMat);
      winGlass.position.set(wx, 2.2, 3.24);
      const winArch = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.95, 0.95, 4)), taupeTrimMat);
      winArch.rotation.y = Math.PI / 4;
      winArch.scale.set(1, 0.8, 0.2);
      winArch.position.set(wx, 3.72, 3.23);
      masjidGroup.add(winFrame, winGlass, winArch);
    });

    const masjidRoof = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(7.6, 2.5, 4)), roofTileMat);
    masjidRoof.rotation.y = Math.PI / 4;
    masjidRoof.position.y = 6.2;
    const dome = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(2.0, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58)),
      goldMat
    );
    dome.position.y = 7.2;
    const masjidSignTex = trackTex(
      createSignTexture('MASJID DARUSSALAM', 'SERAMBI TIMUR · RUANG UJIAN SENTRAL', '#065f46', '#ffffff', '#f59e0b')
    );
    const masjidSign = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(6.8, 0.95, 0.25)),
      trackMat(new THREE.MeshStandardMaterial({ map: masjidSignTex, roughness: 0.4 }))
    );
    masjidSign.position.set(0, 5.25, 3.4);
    masjidGroup.add(masjidBody, masjidPlinth, masjidCanopyUpper, porticoCanopy, masjidRoof, dome, masjidSign);
    campusGroup.add(masjidGroup);

    // 5. Build Interactive Floor-Aware Exam Rooms + Desks
    const interactiveMeshes: THREE.Object3D[] = [];
    const roofGroups: Array<{ floor: 1 | 2; mesh: THREE.Object3D; baseY: number }> = [];
    const floorContainers: Record<1 | 2, THREE.Group> = {
      1: new THREE.Group(),
      2: new THREE.Group(),
    };
    scene.add(floorContainers[1], floorContainers[2]);

    const roomHighlightRings: Record<string, THREE.Mesh> = {};

    // Signature Courtyard Colonnade Arches + Red 2nd Floor Railings on GD-A (facing East +X) & GD-C (facing West -X) matching Image 7!
    const buildMadrasahFacadeColonnade = (buildingX: number, facingRight: boolean) => {
      const arcade = new THREE.Group();
      const faceX = facingRight ? buildingX + 5.0 : buildingX - 5.0;
      const pilCount = 7;
      for (let i = 0; i < pilCount; i++) {
        const pz = -8.2 + i * 3.0;
        // Full 2-story olive-taupe column
        const col = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.45, 7.4, 0.45)), taupeTrimMat);
        col.position.set(faceX, 3.7, pz);
        col.castShadow = true;
        arcade.add(col);

        if (i < pilCount - 1) {
          const bayZ = pz + 1.5;
          // 1st floor beam & 2nd floor red balcony railing
          const beam1 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 0.42, 2.7)), taupeTrimMat);
          beam1.position.set(faceX, 3.65, bayZ);
          const rail = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.95, 2.55)), redRailMat);
          rail.position.set(faceX, 4.35, bayZ);
          const archHeader = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.36, 0.65, 2.7)), creamFacadeMat);
          archHeader.position.set(faceX, 7.1, bayZ);
          arcade.add(beam1, rail, archHeader);
        }
      }
      // Front South Wing Wall with GRC lattice decorative trim matching Image 7 right gable
      const frontWingZ = 10.1;
      const wingSlab = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(9.6, 7.4, 0.32)), creamFacadeMat);
      wingSlab.position.set(buildingX, 3.7, frontWingZ);
      const grc1 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(6.8, 1.4, 0.42)), taupeTrimMat);
      grc1.position.set(buildingX, 2.1, frontWingZ);
      const grc2 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(6.8, 1.4, 0.42)), taupeTrimMat);
      grc2.position.set(buildingX, 5.7, frontWingZ);
      arcade.add(wingSlab, grc1, grc2);
      campusGroup.add(arcade);
    };
    buildMadrasahFacadeColonnade(-14, true);
    buildMadrasahFacadeColonnade(14, false);

    // Roof caps for GD-A (West) and GD-C (East) that lift/hide when roofOpen is true
    const buildCampusRoof = (x: number, z: number, label: string, sub: string) => {
      const rg = new THREE.Group();
      const roof = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(11.8, 3.2, 4)), roofTileMat);
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(0.75, 1, 1.55);
      roof.position.set(x, 8.9, z);
      const signTex = trackTex(createSignTexture(label, sub));
      const sign = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(8.2, 1.3, 0.3)),
        trackMat(new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.45 }))
      );
      sign.position.set(x, 7.6, z + 9.2);
      rg.add(roof, sign);
      scene.add(rg);
      roofGroups.push({ floor: 2, mesh: rg, baseY: 0 });
    };
    buildCampusRoof(-14, 0.75, 'GEDUNG MADRASAH PUTRA (GD-A)', 'Lantai 1 & 2 · Ruang R1–R3');
    buildCampusRoof(14, 0.9, 'GEDUNG MADRASAH PUTRI (GD-C)', 'Lantai 1 & 2 · Ruang R5–R7');

    specs.forEach((sp) => {
      const roomData = ruangUjianList.find((r) => r.id === sp.roomId);
      if (!roomData) return;

      const rg = new THREE.Group();
      const [cx, cy, cz] = sp.center;
      const [sx, sy, sz] = sp.size;
      rg.position.set(cx, cy, cz);

      // Floor slab
      const floorSlab = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(sx, 0.24, sz)), floorSlabMat);
      floorSlab.position.y = 0.12;
      floorSlab.receiveShadow = true;
      rg.add(floorSlab);

      // Open-cutaway low-cut walls (1.8m perimeter walls so interior stays clearly visible!)
      const wallH = 1.9;
      const wallThick = 0.22;
      const backWall = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(sx, wallH, wallThick)),
        wallMat
      );
      backWall.position.set(0, wallH / 2 + 0.12, -sz / 2 + wallThick / 2);
      backWall.castShadow = true;

      const leftWall = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(wallThick, wallH, sz)),
        wallMat
      );
      leftWall.position.set(-sx / 2 + wallThick / 2, wallH / 2 + 0.12, 0);
      leftWall.castShadow = true;

      const rightWall = leftWall.clone();
      rightWall.position.x = sx / 2 - wallThick / 2;

      // Front door frame pillars (leaving middle doorway open)
      const frontSideW = sx * 0.34;
      const frontLeft = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(frontSideW, wallH, wallThick)),
        wallMat
      );
      frontLeft.position.set(-sx / 2 + frontSideW / 2, wallH / 2 + 0.12, sz / 2 - wallThick / 2);
      const frontRight = frontLeft.clone();
      frontRight.position.x = sx / 2 - frontSideW / 2;

      rg.add(backWall, leftWall, rightWall, frontLeft, frontRight);

      // Corner structural columns up to full story height
      const colGeo = trackGeo(new THREE.BoxGeometry(0.32, sy, 0.32));
      const colPositions: Array<[number, number]> = [
        [-sx / 2 + 0.18, -sz / 2 + 0.18],
        [sx / 2 - 0.18, -sz / 2 + 0.18],
        [-sx / 2 + 0.18, sz / 2 - 0.18],
        [sx / 2 - 0.18, sz / 2 - 0.18],
      ];
      colPositions.forEach(([px, pz]) => {
        const col = new THREE.Mesh(colGeo, pillarMat);
        col.position.set(px, sy / 2, pz);
        rg.add(col);
      });

      // Selection perimeter glow ring on floor
      const ringMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: sp.accentColor,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
        })
      );
      const ringMesh = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(sx + 0.4, sz + 0.4)),
        ringMat
      );
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.25;
      ringMesh.userData = { kind: 'room', roomId: roomData.id };
      rg.add(ringMesh);
      interactiveMeshes.push(ringMesh);
      roomHighlightRings[roomData.id] = ringMesh;

      // Room Plaque above Front Doorway
      const plaqueTex = trackTex(
        createSignTexture(
          `${roomData.kode} · ${roomData.gender === 'L' ? 'PUTRA' : 'PUTRI'} (Lt.${sp.floor})`,
          roomData.nama.slice(0, 32),
          roomData.gender === 'L' ? '#0c4a6e' : '#065f46',
          '#ffffff',
          '#fbbf24'
        )
      );
      const plaque = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(4.4, 0.9, 0.18)),
        trackMat(new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.45 }))
      );
      plaque.position.set(0, sy - 0.45, sz / 2 + 0.05);
      plaque.userData = { kind: 'room', roomId: roomData.id };
      rg.add(plaque);
      interactiveMeshes.push(plaque);

      // Whiteboard + Pengawas Desk inside Room (North/Back wall)
      const board = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(sx * 0.48, 1.0, 0.08)), boardMat);
      board.position.set(0, 1.35, -sz / 2 + 0.3);
      rg.add(board);

      const pengawasDesk = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(1.6, 0.55, 0.7)),
        woodDeskMat
      );
      pengawasDesk.position.set(-sx * 0.26, 0.52, -sz / 2 + 1.1);
      rg.add(pengawasDesk);

      // 3D Student Desks Grid (`baris × kolom`)
      const innerW = sx - 1.8;
      const innerD = sz - 2.6;
      const stepX = innerW / Math.max(1, roomData.kolom);
      const stepZ = innerD / Math.max(1, roomData.baris);
      const startX = -innerW / 2 + stepX / 2;
      const startZ = -sz / 2 + 2.0 + stepZ / 2;

      roomData.kursiList.forEach((kursi) => {
        const dx = startX + kursi.kolom * stepX;
        const dz = startZ + kursi.baris * stepZ;

        const deskGroup = new THREE.Group();
        deskGroup.position.set(dx, 0.24, dz);

        const topColor = kursi.santri
          ? kursi.bentrok
            ? 0xef4444
            : TINGKAT_COLORS[kursi.santri.tingkat] || 0x10b981
          : 0x94a3b8;

        const topMat = trackMat(
          new THREE.MeshStandardMaterial({
            color: topColor,
            roughness: 0.48,
            metalness: 0.08,
          })
        );

        // Desk tabletop + legs + seat stool
        const tabletop = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(Math.min(1.05, stepX * 0.68), 0.12, Math.min(0.68, stepZ * 0.55))),
          topMat
        );
        tabletop.position.y = 0.56;
        tabletop.castShadow = true;
        tabletop.userData = {
          kind: 'desk',
          roomId: roomData.id,
          roomKode: roomData.kode,
          roomNama: roomData.nama,
          kursi,
        };

        const deskBase = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(Math.min(0.9, stepX * 0.55), 0.5, Math.min(0.5, stepZ * 0.4))),
          woodDeskMat
        );
        deskBase.position.y = 0.25;
        deskBase.userData = tabletop.userData;

        const chair = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.42, 0.34, 0.42)),
          woodDeskMat
        );
        chair.position.set(0, 0.17, 0.42);
        chair.userData = tabletop.userData;

        deskGroup.add(deskBase, tabletop, chair);
        rg.add(deskGroup);
        interactiveMeshes.push(tabletop, deskBase);
      });

      floorContainers[sp.floor].add(rg);
    });

    // 6. Raycaster Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPt = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      downPt = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y);
      if (dist > 6) return; // Ignore orbit drag

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      if (hits.length > 0) {
        const hit = hits[0].object;
        const data = hit.userData;
        if (data?.roomId) {
          onSelectRoomRef.current(data.roomId);
          focusRoom(data.roomId);
          if (data.kind === 'desk' && data.kursi) {
            setSelectedDeskInfo({
              roomKode: data.roomKode,
              roomNama: data.roomNama,
              kursi: data.kursi,
            });
          } else {
            setSelectedDeskInfo(null);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // 7. ResizeObserver
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    // 8. Animation Loop (damped camera + dynamic floor/roof cutaway)
    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      // Floor visibility
      const ff = floorFilterRef.current;
      floorContainers[1].visible = ff === 'all' || ff === 1;
      floorContainers[2].visible = ff === 'all' || ff === 2;

      // Roof cutaway visibility & smooth lift
      const showRoof = !roofOpenRef.current && ff !== 1;
      roofGroups.forEach((rg) => {
        rg.mesh.visible = showRoof;
      });

      // Active room floor highlight pulse-free clarity
      const actId = activeRoomIdRef.current;
      Object.entries(roomHighlightRings).forEach(([rId, ring]) => {
        const mat = ring.material as THREE.MeshBasicMaterial;
        const targetOpacity = rId === actId ? 0.42 : 0.1;
        mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 8, dt);
      });

      // Damped camera focus transition
      if (cameraGoalRef.current.active) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraGoalRef.current.pos.x, 5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraGoalRef.current.pos.y, 5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraGoalRef.current.pos.z, 5, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, cameraGoalRef.current.target.x, 5, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, cameraGoalRef.current.target.y, 5, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, cameraGoalRef.current.target.z, 5, dt);
        if (camera.position.distanceTo(cameraGoalRef.current.pos) < 0.08) {
          cameraGoalRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.removeEventListener('start', onControlStart);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [ruangUjianList, specs]);

  const activeRoom = ruangUjianList.find((r) => r.id === activeRoomId) || ruangUjianList[0];

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-2xs overflow-hidden no-print">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-950 to-emerald-800 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
            <Box className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold tracking-tight">
              Visualisasi Denah Kampus &amp; Ruang Imtihan 3D Real-Time
            </h4>
            <p className="text-[11px] text-emerald-200">
              Putar, zoom, buka atap untuk cek dalam ruangan (Lt. 1 &amp; Lt. 2), dan klik meja santri untuk detail. Mode cetak tetap 2D rapi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 font-semibold whitespace-nowrap">
            {ruangUjianList.length} Ruang · {specs.filter((s) => s.floor === 2).length} Lt. 2
          </span>
        </div>
      </div>

      {/* 3D Canvas Stage */}
      <div className="relative w-full h-[430px] sm:h-[490px] bg-sky-100">
        {webglError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-100 text-slate-700">
            <Box className="w-10 h-10 text-slate-400 mb-2" />
            <p className="text-sm font-bold">{webglError}</p>
            <p className="text-xs text-slate-500 mt-1">Gunakan Denah 2D Resmi di bawah untuk pengaturan dan pencetakan.</p>
          </div>
        ) : (
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        )}

        {/* Top-Right Compact Inspector Card (Only shown when desk or room active) */}
        {selectedDeskInfo ? (
          <div className="absolute top-3 right-3 z-10 w-64 rounded-2xl bg-white/95 backdrop-blur-xs border border-emerald-200 shadow-lg p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span className="font-extrabold text-emerald-900">
                {selectedDeskInfo.roomKode} · Kursi B{selectedDeskInfo.kursi.baris + 1}-K{selectedDeskInfo.kursi.kolom + 1}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDeskInfo(null)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-700"
              >
                Tutup
              </button>
            </div>
            {selectedDeskInfo.kursi.santri ? (
              <>
                <p className="font-black text-slate-900 leading-snug">
                  {selectedDeskInfo.kursi.santri.nama}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-600 tabular-nums">
                  <span>No. IMT: <strong>{selectedDeskInfo.kursi.santri.nomorUjian}</strong></span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                    {selectedDeskInfo.kursi.santri.kelas}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-slate-400 italic">Kursi cadangan / kosong</p>
            )}
          </div>
        ) : activeRoom ? (
          <div className="hidden sm:block absolute top-3 right-3 z-10 rounded-2xl bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm px-3.5 py-2 text-xs">
            <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{activeRoom.kode} — {activeRoom.nama}</span>
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 tabular-nums">
              <Users className="w-3 h-3" />
              <span>
                {activeRoom.kursiList.filter((k) => k.santri).length} / {activeRoom.kapasitas} Terisi
              </span>
            </p>
          </div>
        ) : null}

        {/* Bottom Collapsible HUD Dock */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col items-center pointer-events-none">
          <div className="pointer-events-auto max-w-full rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-lg px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setHudMinimized((v) => !v)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 whitespace-nowrap"
              title="Lipat/Buka Panel Kontrol 3D"
            >
              {hudMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>Kontrol 3D</span>
            </button>

            {!hudMinimized && (
              <>
                {/* Floor Selector */}
                <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFloorFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                      floorFilter === 'all' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                    }`}
                  >
                    Semua Lt.
                  </button>
                  <button
                    type="button"
                    onClick={() => setFloorFilter(1)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap flex items-center gap-1 ${
                      floorFilter === 1 ? 'bg-emerald-800 text-white' : 'text-slate-600'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Lt. 1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFloorFilter(2)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap flex items-center gap-1 ${
                      floorFilter === 2 ? 'bg-emerald-800 text-white' : 'text-slate-600'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Lt. 2</span>
                  </button>
                </div>

                {/* Cutaway Roof Toggle */}
                <button
                  type="button"
                  onClick={() => setRoofOpen((v) => !v)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition whitespace-nowrap ${
                    roofOpen
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-slate-800 text-white border-slate-800'
                  }`}
                >
                  {roofOpen ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{roofOpen ? 'Dalam Ruang Terbuka' : 'Tampilkan Atap'}</span>
                </button>

                {/* Quick Jump Room Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[360px] scrollbar-none">
                  {ruangUjianList.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        onSelectRoom(r.id);
                        focusRoom(r.id);
                      }}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                        activeRoomId === r.id
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      {r.kode}
                    </button>
                  ))}
                </div>

                {/* Front Building View Presets */}
                <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                  <button
                    type="button"
                    onClick={() => focusElevationPreset('gate')}
                    className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10.5px] font-bold whitespace-nowrap"
                  >
                    Tampak Gerbang
                  </button>
                  <button
                    type="button"
                    onClick={() => focusElevationPreset('masjid')}
                    className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10.5px] font-bold whitespace-nowrap"
                  >
                    Tampak Masjid
                  </button>
                  <button
                    type="button"
                    onClick={() => focusElevationPreset('madrasah')}
                    className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-[10.5px] font-bold whitespace-nowrap"
                  >
                    Tampak Madrasah
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetOverviewCamera}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 whitespace-nowrap"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Kamera</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
