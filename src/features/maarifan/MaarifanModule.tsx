import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Users,
  Calendar,
  History,
  Check,
  Printer,
  Plus,
  Trash2,
  Edit3,
  UserCheck,
  X,
  GraduationCap,
  FileText,
  Clock,
  CalendarDays,
  Download,
  Eye,
  RotateCcw,
  Upload,
  AlertTriangle,
  LayoutGrid,
  Lock,
  Camera,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { PrintOrientationControl } from '../../components/common/PrintOrientationControl.tsx';
import { PrintKopPondok } from '../../components/common/PrintKopPondok.tsx';
import {
  DAFTAR_KELAS_DINIYAH,
  MAPEL_PER_TINGKAT,
  type KurikulumKitabItem,
  type JadwalMaarifanItem,
  type UstadzRecord,
  type KitabPdfItem,
  type JadwalMengajarSlot,
  type ProgramAbsensiType,
  type AbsensiGuruRecord,
} from '../../data/seed/pondokData.ts';

const PROGRAM_ABSENSI_OPTIONS: ProgramAbsensiType[] = [
  'Madrasah Diniyah',
  "Ngaji Al-Qur'an Pagi (Ba'da Subuh)",
  'Ngaji Takhasus',
];

interface MaarifanModuleProps {
  onOpenSdmAbsensi?: () => void;
}

export const MaarifanModule: React.FC<MaarifanModuleProps> = ({ onOpenSdmAbsensi }) => {
  const {
    currentUser,
    santriList,
    ustadzList,
    addUstadz,
    updateUstadz,
    deleteUstadz,
    absensiSessions,
    saveAbsensi,
    absensiGuruList,
    saveAbsensiGuru,
    kurikulumKitabList,
    addKurikulumKitab,
    deleteKurikulumKitab,
    jadwalMaarifan,
    updateJadwalMaarifan,
    kurikulumMatrix,
    updateKurikulumMatrixCell,
    kitabPdfList,
    addKitabPdf,
    deleteKitabPdf,
    kalenderPendidikan,
    setKalenderDayCode,
    updateKalenderMeta,
    resetKalenderPendidikan,
    guruAvailability,
    updateGuruAvailability,
    jadwalMengajar,
    addJadwalMengajarSlot,
    deleteJadwalMengajarSlot,
    auditLogs,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'absensi' | 'rekap' | 'kurikulum' | 'kitab_pdf' | 'jadwal' | 'setting_guru' | 'kalender' | 'ustadz'
  >('absensi');
  const [absensiMode, setAbsensiMode] = useState<'santri' | 'guru'>('santri');

  // Absensi Santri state
  const uniqueClasses = useMemo(
    () =>
      Array.from(new Set(santriList.map((s) => s.kelas))).sort((a, b) => {
        const ia = DAFTAR_KELAS_DINIYAH.indexOf(a as (typeof DAFTAR_KELAS_DINIYAH)[number]);
        const ib = DAFTAR_KELAS_DINIYAH.indexOf(b as (typeof DAFTAR_KELAS_DINIYAH)[number]);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b);
      }),
    [santriList]
  );
  const [selectedKelas, setSelectedKelas] = useState<string>(uniqueClasses[0] || '2 A PUTRA');
  const [selectedMapel, setSelectedMapel] = useState<string>('Fiqih (Matan Taqrib)');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [catatan, setCatatan] = useState<string>('');
  const [kehadiran, setKehadiran] = useState<Record<string, 'H' | 'I' | 'S' | 'A'>>({});
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string>('');

  // Kumpulan Kitab PDF state
  const [pdfFilterTingkat, setPdfFilterTingkat] = useState<number | 'Semua'>('Semua');
  const [pdfFilterMakna, setPdfFilterMakna] = useState<'Semua' | 'Sudah Bermakna Pegon' | 'Kosongan'>('Semua');
  const [showAddPdf, setShowAddPdf] = useState(false);
  const [pdfNama, setPdfNama] = useState('');
  const [pdfArab, setPdfArab] = useState('');
  const [pdfPengarang, setPdfPengarang] = useState('');
  const [pdfTingkat, setPdfTingkat] = useState(1);
  const [pdfFan, setPdfFan] = useState('Fiqih');
  const [pdfStatusMakna, setPdfStatusMakna] = useState<'Sudah Bermakna Pegon' | 'Kosongan'>('Sudah Bermakna Pegon');
  const [pdfCatatan, setPdfCatatan] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfUkuran, setPdfUkuran] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined);
  const [previewPdf, setPreviewPdf] = useState<KitabPdfItem | null>(null);

  // Setting Guru & Jadwal Mengajar state
  const [mengajarSubTab, setMengajarSubTab] = useState<'dashboard' | 'request_jam' | 'riwayat'>('dashboard');
  const [globalPreviewView, setGlobalPreviewView] = useState<'matriks_kelas' | 'beban_ustadz'>('matriks_kelas');
  const [slotHariList, setSlotHariList] = useState<JadwalMengajarSlot['hari'][]>(['Sabtu']);
  const [slotJamKe, setSlotJamKe] = useState<1 | 2 | 3>(2);
  const [slotKelas, setSlotKelas] = useState<string>(DAFTAR_KELAS_DINIYAH[0]);
  const [slotMapel, setSlotMapel] = useState<string>(MAPEL_PER_TINGKAT[1][0]?.nama || 'Fiqih');
  const [slotUstadz, setSlotUstadz] = useState<string>(ustadzList[3]?.nama || 'Ust. Nidhomul Muna Lana');
  const [slotError, setSlotError] = useState<string>('');
  const [filterGuruJadwal, setFilterGuruJadwal] = useState<string>('Semua');
  const [riwayatStatusFilter, setRiwayatStatusFilter] = useState<string>('Semua');

  // Kalender Pendidikan interactive state
  const [activeKalenderCode, setActiveKalenderCode] = useState<string>('IMT 1');

  // Program & Selfie Timestamp Guru states
  const [selectedProgram, setSelectedProgram] = useState<ProgramAbsensiType>('Madrasah Diniyah');
  const [guruStatusMap, setGuruStatusMap] = useState<
    Record<string, { status: 'Hadir' | 'Izin' | 'Sakit' | 'Badal'; pengganti: string }>
  >({});
  const [selfieTargetUstadz, setSelfieTargetUstadz] = useState<UstadzRecord | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; fallback: boolean }>({
    lat: -6.9765,
    lng: 109.6832,
    fallback: true,
  });
  const [capturedSelfieUrl, setCapturedSelfieUrl] = useState<string>('');
  const [capturedTimestampText, setCapturedTimestampText] = useState<string>('');
  const [lightboxRecord, setLightboxRecord] = useState<AbsensiGuruRecord | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopSelfieCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const openSelfieModal = async (ustadz: UstadzRecord) => {
    setSelfieTargetUstadz(ustadz);
    setCapturedSelfieUrl('');
    setCameraError('');
    setCapturedTimestampText('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            fallback: false,
          });
        },
        () => {
          setGpsCoords({ lat: -6.9765, lng: 109.6832, fallback: true });
        },
        { timeout: 4000 }
      );
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        setCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 80);
      } catch {
        setCameraError(
          'Kamera langsung tidak tersedia atau izin ditolak browser. Gunakan tombol Unggah / Kamera HP di bawah.'
        );
      }
    } else {
      setCameraError('Perangkat tidak mendukung kamera browser. Gunakan tombol Unggah / Kamera HP.');
    }
  };

  const compositeTimestampPhoto = (source: HTMLVideoElement | HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const srcW = source instanceof HTMLVideoElement ? source.videoWidth || 640 : source.width || 640;
    const srcH = source instanceof HTMLVideoElement ? source.videoHeight || 480 : source.height || 480;
    const scale = Math.max(canvas.width / srcW, canvas.height / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const dx = (canvas.width - drawW) / 2;
    const dy = (canvas.height - drawH) / 2;
    ctx.drawImage(source, dx, dy, drawW, drawH);

    // Google Timestamp style dark translucent banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fillRect(0, canvas.height - 118, canvas.width, 118);

    // Accent strip
    ctx.fillStyle = '#10B981';
    ctx.fillRect(0, canvas.height - 118, 6, 118);

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toTimeString().substring(0, 8) + ' WIB';
    const stampLine = `${dateStr} · ${timeStr}`;
    const coordStr = `GPS: ${gpsCoords.lat.toFixed(5)}, ${gpsCoords.lng.toFixed(5)}${gpsCoords.fallback ? ' (Lokasi Pondok)' : ''}`;
    const locLabel = 'PP NU Darussalam Karangdadap, Kab. Pekalongan';

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(stampLine, 20, canvas.height - 88);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`${selfieTargetUstadz?.nama || 'Asatidz'} · ${selectedProgram}`, 20, canvas.height - 62);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = '13px monospace';
    ctx.fillText(coordStr, 20, canvas.height - 38);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '12px sans-serif';
    ctx.fillText(locLabel, 20, canvas.height - 16);

    setCapturedSelfieUrl(canvas.toDataURL('image/jpeg', 0.86));
    setCapturedTimestampText(stampLine);
  };

  const handleCaptureFromVideo = () => {
    if (!videoRef.current) return;
    compositeTimestampPhoto(videoRef.current);
  };

  const handleUploadSelfieFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => compositeTimestampPhoto(img);
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSelfieAttendance = () => {
    if (!selfieTargetUstadz || !capturedSelfieUrl) return;
    saveAbsensiGuru({
      tanggal: attendanceDate,
      ustadzId: selfieTargetUstadz.id,
      ustadzNama: selfieTargetUstadz.nama,
      kelas: selfieTargetUstadz.jabatanUtama,
      mapel:
        selectedProgram === 'Madrasah Diniyah'
          ? selfieTargetUstadz.fanIlmu.join(', ') || 'Madrasah Diniyah'
          : selectedProgram,
      program: selectedProgram,
      status: 'Hadir',
      waktuInput: new Date().toTimeString().substring(0, 5),
      fotoSelfieUrl: capturedSelfieUrl,
      koordinat: `${gpsCoords.lat.toFixed(5)}, ${gpsCoords.lng.toFixed(5)}`,
      lokasiLabel: 'PP NU Darussalam Karangdadap, Pekalongan',
      waktuTimestamp: capturedTimestampText || new Date().toLocaleString('id-ID'),
    });
    stopSelfieCamera();
    setSuccessToast(
      `Presensi Selfie + GPS ${selfieTargetUstadz.nama} (${selectedProgram}) berhasil tersimpan.`
    );
    setSelfieTargetUstadz(null);
    setCapturedSelfieUrl('');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Rekap filter
  const [rekapSubTab, setRekapSubTab] = useState<'santri' | 'guru'>('santri');
  const [rekapFilterMode, setRekapFilterMode] = useState<'per_kelas' | 'per_santri' | 'gender'>(
    'per_kelas'
  );
  const [rekapGender, setRekapGender] = useState<'Semua' | 'L' | 'P'>('Semua');
  const [rekapKelas, setRekapKelas] = useState<string>('Semua');
  const [rekapProgram, setRekapProgram] = useState<'Semua' | ProgramAbsensiType>('Semua');
  const [rekapGuruBulan, setRekapGuruBulan] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );

  // Kurikulum add state
  const [showAddKitab, setShowAddKitab] = useState(false);
  const [newTingkat, setNewTingkat] = useState(1);
  const [newMapel, setNewMapel] = useState('');
  const [newMapelArab, setNewMapelArab] = useState('');
  const [newKitab, setNewKitab] = useState('');
  const [newKkm, setNewKkm] = useState(65);
  const [newTargetHafalan, setNewTargetHafalan] = useState('');
  const [newMaknaJawa, setNewMaknaJawa] = useState('');

  // Jadwal edit modal
  const [editingJadwal, setEditingJadwal] = useState<JadwalMaarifanItem | null>(null);

  // Ustadz filter & detail modal (5-tab EMIS Ustadz)
  const [ustadzStatusFilter, setUstadzStatusFilter] = useState<'Semua' | 'Aktif' | 'Nonaktif'>(
    'Aktif'
  );
  const [detailUstadz, setDetailUstadz] = useState<UstadzRecord | null>(null);
  const [ustadzModalTab, setUstadzModalTab] = useState<
    'data' | 'utama' | 'tambahan' | 'kepegawaian' | 'pendidikan'
  >('data');
  const [isCreatingUstadz, setIsCreatingUstadz] = useState(false);

  const kelasSantri = santriList.filter((s) => s.kelas === selectedKelas);

  const handleHadirSemua = () => {
    const updated: Record<string, 'H' | 'I' | 'S' | 'A'> = {};
    kelasSantri.forEach((s) => {
      updated[s.id] = 'H';
    });
    setKehadiran(updated);
  };

  const setStatus = (santriId: string, status: 'H' | 'I' | 'S' | 'A') => {
    setKehadiran((prev) => ({ ...prev, [santriId]: status }));
  };

  const handleSimpanAbsensi = () => {
    if (saving) return;
    setSaving(true);
    setTimeout(() => {
      const normalized: Record<string, 'H' | 'I' | 'S' | 'A'> = {};
      kelasSantri.forEach((s) => {
        normalized[s.id] = kehadiran[s.id] || 'H';
      });
      saveAbsensi({
        tanggal: attendanceDate,
        kelas: selectedKelas,
        guruNama: currentUser.nama,
        mapel: selectedProgram === 'Madrasah Diniyah' ? selectedMapel : selectedProgram,
        program: selectedProgram,
        tersimpanOleh: currentUser.nama,
        kehadiran: normalized,
        catatan,
      });
      setSaving(false);
      setSuccessToast(
        `Presensi santri ${selectedKelas} [${selectedProgram}] (${attendanceDate}) tersimpan.`
      );
      setTimeout(() => setSuccessToast(''), 4000);
    }, 300);
  };

  const handleSimpanAbsensiGuru = (ustadz: UstadzRecord) => {
    const entry = guruStatusMap[ustadz.id] || { status: 'Hadir', pengganti: '' };
    saveAbsensiGuru({
      tanggal: attendanceDate,
      ustadzId: ustadz.id,
      ustadzNama: ustadz.nama,
      kelas: ustadz.jabatanUtama,
      mapel:
        selectedProgram === 'Madrasah Diniyah'
          ? ustadz.fanIlmu.join(', ') || 'Madrasah Diniyah'
          : selectedProgram,
      program: selectedProgram,
      status: entry.status,
      pengganti: entry.status === 'Badal' ? entry.pengganti : undefined,
      waktuInput: new Date().toTimeString().substring(0, 5),
    });
    setSuccessToast(
      `Presensi ${ustadz.nama} (${entry.status} · ${selectedProgram}) berhasil dicatat.`
    );
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleAddKitabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapel.trim() || !newKitab.trim()) return;
    addKurikulumKitab({
      tingkat: newTingkat,
      mapel: newMapel,
      mapelArab: newMapelArab || newMapel,
      kitab: newKitab,
      kkm: newKkm,
      targetHafalan: newTargetHafalan,
      maknaJawaContoh: newMaknaJawa,
    });
    setShowAddKitab(false);
    setNewMapel('');
    setNewKitab('');
    setSuccessToast(`Kitab ${newKitab} (Tingkat ${newTingkat} MDS) berhasil ditambahkan.`);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleSaveUstadzModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailUstadz) return;
    if (isCreatingUstadz) {
      const { id: _ignore, ...rest } = detailUstadz;
      addUstadz(rest);
      setSuccessToast(`Data asatidz baru ${detailUstadz.nama} berhasil ditambahkan.`);
    } else {
      updateUstadz(detailUstadz.id, detailUstadz);
      setSuccessToast(`Data kepegawaian ${detailUstadz.nama} berhasil diperbarui.`);
    }
    setDetailUstadz(null);
    setIsCreatingUstadz(false);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Rekap computation from absensiSessions (supports Program filter)
  const rekapPerSantri = useMemo(() => {
    return santriList
      .filter((s) => {
        if (rekapGender !== 'Semua' && s.gender !== rekapGender) return false;
        if (rekapKelas !== 'Semua' && s.kelas !== rekapKelas) return false;
        return true;
      })
      .map((s) => {
        let h = 0;
        let i = 0;
        let sk = 0;
        let a = 0;
        absensiSessions.forEach((ses) => {
          const sesProg = ses.program || 'Madrasah Diniyah';
          if (rekapProgram !== 'Semua' && sesProg !== rekapProgram) return;
          const st = ses.kehadiran[s.id];
          if (st === 'H') h++;
          else if (st === 'I') i++;
          else if (st === 'S') sk++;
          else if (st === 'A') a++;
        });
        return { santri: s, h, i, s: sk, a, total: h + i + sk + a };
      });
  }, [santriList, absensiSessions, rekapGender, rekapKelas, rekapProgram]);

  // Rekap Absensi Guru per ustadz
  const rekapGuruFilteredLogs = useMemo(() => {
    return absensiGuruList.filter((ag) => {
      const prog = ag.program || 'Madrasah Diniyah';
      if (rekapProgram !== 'Semua' && prog !== rekapProgram) return false;
      if (rekapGuruBulan && !ag.tanggal.startsWith(rekapGuruBulan)) return false;
      return true;
    });
  }, [absensiGuruList, rekapProgram, rekapGuruBulan]);

  const rekapGuruSummary = useMemo(() => {
    return ustadzList
      .filter((u) => u.statusAktif === 'Aktif')
      .map((u) => {
        const logs = rekapGuruFilteredLogs.filter((ag) => ag.ustadzId === u.id || ag.ustadzNama === u.nama);
        const hadir = logs.filter((l) => l.status === 'Hadir').length;
        const izin = logs.filter((l) => l.status === 'Izin').length;
        const sakit = logs.filter((l) => l.status === 'Sakit').length;
        const badal = logs.filter((l) => l.status === 'Badal').length;
        const selfieCount = logs.filter((l) => Boolean(l.fotoSelfieUrl)).length;
        return { ustadz: u, hadir, izin, sakit, badal, selfieCount, total: logs.length };
      });
  }, [ustadzList, rekapGuruFilteredLogs]);

  return (
    <div className="space-y-6">
      {/* Tier 1: Title Header */}
      <div className="no-print space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Madrasah Diniyah Salafiyah (Ma'arifan)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Absensi santri & asatidz, kurikulum 22 fan, kumpulan kitab PDF Pegon, jadwal mengajar sesuai request guru, kalender pendidikan, dan data asatidz.
            </p>
          </div>
        </div>

        {/* Tier 2: 4 Compact KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Santri Aktif Diniyah</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {santriList.length} <span className="text-[11px] font-normal text-slate-500">· {DAFTAR_KELAS_DINIYAH.length} Kelas</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Dewan Asatidz</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {ustadzList.length} <span className="text-[11px] font-normal text-slate-500">Ustadz/ah</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Perpustakaan Kitab PDF</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {kitabPdfList.length} <span className="text-[11px] font-normal text-slate-500">Kitab ({kurikulumMatrix.length} Fan)</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Hari Aktif KBM</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {kalenderPendidikan.jmlHariImtihan1 + kalenderPendidikan.jmlHariImtihan2}{' '}
                <span className="text-[11px] font-normal text-slate-500">Hari / T.A.</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tier 3: Horizontal Scrollable Sub-Menu Bar Below Title & KPI */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'absensi', label: 'Absensi Santri & Guru' },
            { id: 'rekap', label: 'Rekapitulasi Absensi' },
            { id: 'kurikulum', label: 'Kurikulum 22 Fan & Pegon' },
            { id: 'kitab_pdf', label: `Kumpulan Kitab PDF (${kitabPdfList.length})` },
            { id: 'jadwal', label: 'Jadwal Kelas 1–6' },
            { id: 'setting_guru', label: 'Manajemen Mengajar Guru' },
            { id: 'kalender', label: 'Kalender Pendidikan' },
            { id: 'ustadz', label: `Dewan Asatidz (${ustadzList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* TAB 1: ABSENSI HARIAN SANTRI & GURU */}
      {activeTab === 'absensi' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAbsensiMode('santri')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  absensiMode === 'santri'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Presensi Harian Santri
              </button>
              <button
                type="button"
                onClick={() => setAbsensiMode('guru')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  absensiMode === 'guru'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Presensi Guru &amp; Selfie Timestamp ({absensiGuruList.length})
              </button>
            </div>

            {/* Program Absensi Selector (Madrasah Diniyah, Ngaji Al-Qur'an Pagi, Takhasus) */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-600 px-2">Program:</span>
              {PROGRAM_ABSENSI_OPTIONS.map((prog) => (
                <button
                  key={prog}
                  type="button"
                  onClick={() => setSelectedProgram(prog)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    selectedProgram === prog
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {prog === "Ngaji Al-Qur'an Pagi (Ba'da Subuh)" ? "Al-Qur'an Pagi" : prog}
                </button>
              ))}
            </div>
          </div>

          {absensiMode === 'santri' ? (
            <>
              <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kelas</label>
                    <select
                      value={selectedKelas}
                      onChange={(e) => {
                        setSelectedKelas(e.target.value);
                        setKehadiran({});
                      }}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold"
                    >
                      {uniqueClasses.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mata Pelajaran & Kitab
                    </label>
                    <input
                      type="text"
                      value={selectedMapel}
                      onChange={(e) => setSelectedMapel(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal Pertemuan
                    </label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Catatan KBM</label>
                    <input
                      type="text"
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Misal: Bab Thaharah selesai..."
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold">
                    Total Santri Kelas {selectedKelas}: <strong>{kelasSantri.length} Santri</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleHadirSemua}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Hadir Semua</span>
                    </button>
                    <button
                      type="button"
                      disabled={saving || kelasSantri.length === 0}
                      onClick={handleSimpanAbsensi}
                      className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{saving ? 'Menyimpan...' : 'Simpan Presensi'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {kelasSantri.map((santri) => {
                  const currentStatus = kehadiran[santri.id] || 'H';
                  return (
                    <div
                      key={santri.id}
                      className="rounded-2xl bg-white p-3.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-slate-900 truncate">{santri.nama}</p>
                        <p className="text-[10px] text-slate-500">
                          NIS: {santri.nis} · Kamar: {santri.kamar}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {(
                          [
                            { code: 'H', active: 'bg-emerald-700 text-white ring-2 ring-emerald-500/30', title: 'Hadir' },
                            { code: 'I', active: 'bg-blue-600 text-white', title: 'Izin' },
                            { code: 'S', active: 'bg-amber-600 text-white', title: 'Sakit' },
                            { code: 'A', active: 'bg-rose-600 text-white', title: 'Alpa' },
                          ] as const
                        ).map((btn) => (
                          <button
                            key={btn.code}
                            type="button"
                            onClick={() => setStatus(santri.id, btn.code)}
                            title={btn.title}
                            className={`w-9 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                              currentStatus === btn.code
                                ? btn.active
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {btn.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Absensi Guru + Selfie Timestamp + GPS */
            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Presensi Kehadiran Dewan Asatidz — Program: {selectedProgram}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Gunakan tombol <strong>Selfie Timestamp</strong> untuk bukti foto kamera lengkap dengan waktu WIB &amp; koordinat GPS, atau catat manual Hadir/Izin/Sakit/Badal.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {onOpenSdmAbsensi && (
                      <button
                        type="button"
                        onClick={onOpenSdmAbsensi}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Buka Aplikasi Absensi Mobile Guru (Swafoto GPS)</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('rekap');
                        setRekapSubTab('guru');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                    >
                      <History className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Lihat Rekap &amp; Cetak Guru</span>
                    </button>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {ustadzList
                    .filter((u) => u.statusAktif === 'Aktif')
                    .map((ust) => {
                      const entry = guruStatusMap[ust.id] || { status: 'Hadir', pengganti: '' };
                      return (
                        <div
                          key={ust.id}
                          className="py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-900">
                              {ust.nama}{' '}
                              <span className="font-arabic text-emerald-800 ml-1">
                                ({ust.namaArab})
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {ust.jabatanUtama} · Fan: {ust.fanIlmu.join(', ')}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openSelfieModal(ust)}
                              className="px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold flex items-center gap-1.5 shadow-2xs"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Selfie Timestamp</span>
                            </button>

                            {(['Hadir', 'Izin', 'Sakit', 'Badal'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() =>
                                  setGuruStatusMap((prev) => ({
                                    ...prev,
                                    [ust.id]: { ...entry, status: st },
                                  }))
                                }
                                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                  entry.status === st
                                    ? st === 'Hadir'
                                      ? 'bg-emerald-700 text-white'
                                      : st === 'Badal'
                                      ? 'bg-purple-700 text-white'
                                      : 'bg-amber-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {st}
                              </button>
                            ))}

                            {entry.status === 'Badal' && (
                              <input
                                type="text"
                                placeholder="Nama Ustadz Badal..."
                                value={entry.pengganti}
                                onChange={(e) =>
                                  setGuruStatusMap((prev) => ({
                                    ...prev,
                                    [ust.id]: { ...entry, pengganti: e.target.value },
                                  }))
                                }
                                className="rounded-lg border border-purple-300 px-2.5 py-1 text-xs"
                              />
                            )}

                            <button
                              type="button"
                              onClick={() => handleSimpanAbsensiGuru(ust)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                            >
                              Catat
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Log Presensi Guru */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Riwayat Presensi Guru Terbaru (Selfie GPS &amp; Manual)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-left">
                        <th className="py-2">Tanggal &amp; Jam</th>
                        <th className="py-2">Program</th>
                        <th className="py-2">Nama Ustadz</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Foto Selfie &amp; Koordinat</th>
                        <th className="py-2">Pengganti (Badal)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {absensiGuruList.map((ag) => (
                        <tr key={ag.id}>
                          <td className="py-2 tabular-nums text-slate-500">
                            {ag.tanggal} ({ag.waktuInput})
                          </td>
                          <td className="py-2 font-semibold text-emerald-900">
                            {ag.program || 'Madrasah Diniyah'}
                          </td>
                          <td className="py-2 font-bold text-slate-900">{ag.ustadzNama}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ag.status === 'Hadir'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ag.status === 'Badal'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ag.status}
                            </span>
                          </td>
                          <td className="py-2">
                            {ag.fotoSelfieUrl ? (
                              <button
                                type="button"
                                onClick={() => setLightboxRecord(ag)}
                                className="flex items-center gap-2 text-left hover:opacity-80"
                              >
                                <img
                                  src={ag.fotoSelfieUrl}
                                  alt={ag.ustadzNama}
                                  className="w-10 h-8 object-cover rounded border border-slate-300"
                                />
                                <span className="text-[10px] text-sky-700 font-semibold">
                                  {ag.koordinat || 'Lihat Foto'}
                                </span>
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Input manual</span>
                            )}
                          </td>
                          <td className="py-2 text-slate-600">{ag.pengganti || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REKAPITULASI ABSENSI (SANTRI + MANAJEMEN ABSENSI GURU & CETAK) */}
      {activeTab === 'rekap' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 no-print">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRekapSubTab('santri')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  rekapSubTab === 'santri'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Rekapitulasi Absensi Santri
              </button>
              <button
                type="button"
                onClick={() => setRekapSubTab('guru')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  rekapSubTab === 'guru'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Manajemen &amp; Rekapitulasi Absensi Guru ({absensiGuruList.length})
              </button>
            </div>
          </div>

          {rekapSubTab === 'santri' ? (
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5 printable-area">
              <PrintKopPondok
                variant="maarif"
                judulDokumen={`REKAPITULASI KEHADIRAN SANTRI (${rekapProgram === 'Semua' ? 'SEMUA PROGRAM' : rekapProgram.toUpperCase()})`}
                subJudul={`Kelas: ${rekapKelas} · Gender: ${rekapGender === 'Semua' ? 'Putra & Putri' : rekapGender === 'L' ? 'Putra (Banin)' : 'Putri (Banat)'}`}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 no-print">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-700" />
                    <span>Rekapitulasi Kehadiran Santri ({rekapProgram === 'Semua' ? 'Semua Program' : rekapProgram})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total sesi tercatat: {absensiSessions.length} pertemuan · Filter program, kelas, atau Putra/Putri.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 no-print">
                  <select
                    value={rekapProgram}
                    onChange={(e) => setRekapProgram(e.target.value as 'Semua' | ProgramAbsensiType)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-emerald-900"
                  >
                    <option value="Semua">Semua Program</option>
                    {PROGRAM_ABSENSI_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <select
                    value={rekapFilterMode}
                    onChange={(e) => setRekapFilterMode(e.target.value as any)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold"
                  >
                    <option value="per_kelas">Tampilan Per Kelas</option>
                    <option value="per_santri">Tampilan Per Santri</option>
                    <option value="gender">Filter Putra / Putri</option>
                  </select>

                  <select
                    value={rekapGender}
                    onChange={(e) => setRekapGender(e.target.value as any)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs"
                  >
                    <option value="Semua">Semua Gender</option>
                    <option value="L">Putra (Banin)</option>
                    <option value="P">Putri (Banat)</option>
                  </select>

                  <select
                    value={rekapKelas}
                    onChange={(e) => setRekapKelas(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs"
                  >
                    <option value="Semua">Semua Kelas</option>
                    {uniqueClasses.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>

                  <PrintOrientationControl recommended="landscape" />

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Rekap</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[500px] print:max-h-none print:overflow-visible">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3 text-left">NIS</th>
                      <th className="py-2.5 px-3 text-left">Nama Santri</th>
                      <th className="py-2.5 px-3 text-left">Kelas</th>
                      <th className="py-2.5 px-3 text-center">Gender</th>
                      <th className="py-2.5 px-3 text-center text-emerald-700">Hadir</th>
                      <th className="py-2.5 px-3 text-center text-blue-700">Izin</th>
                      <th className="py-2.5 px-3 text-center text-amber-700">Sakit</th>
                      <th className="py-2.5 px-3 text-center text-rose-700">Alpa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    {rekapPerSantri.slice(0, 60).map((row) => (
                      <tr key={row.santri.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 tabular-nums text-emerald-800">{row.santri.nis}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{row.santri.nama}</td>
                        <td className="py-2 px-3 text-slate-600">{row.santri.kelas}</td>
                        <td className="py-2 px-3 text-center">
                          {row.santri.gender === 'L' ? 'Putra' : 'Putri'}
                        </td>
                        <td className="py-2 px-3 text-center tabular-nums text-emerald-800">{row.h}</td>
                        <td className="py-2 px-3 text-center tabular-nums text-blue-700">{row.i}</td>
                        <td className="py-2 px-3 text-center tabular-nums text-amber-700">{row.s}</td>
                        <td className="py-2 px-3 text-center tabular-nums text-rose-700">{row.a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* MANAJEMEN & REKAPITULASI ABSENSI GURU */
            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5 printable-area">
                <PrintKopPondok
                  variant="maarif"
                  judulDokumen="REKAPITULASI ABSENSI DEWAN ASATIDZ"
                  subJudul={`Program: ${rekapProgram} · Periode: ${rekapGuruBulan || 'Semua Tanggal'}`}
                />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 no-print">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      <span>Manajemen &amp; Rekapitulasi Kehadiran Dewan Asatidz</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bulan: <strong>{rekapGuruBulan || 'Semua'}</strong> · Program:{' '}
                      <strong>{rekapProgram}</strong> · Menampilkan jumlah Hadir, Izin, Sakit, Badal, dan Bukti Foto Selfie GPS.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 no-print">
                    {onOpenSdmAbsensi && (
                      <button
                        type="button"
                        onClick={onOpenSdmAbsensi}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Aplikasi Absensi Guru</span>
                      </button>
                    )}
                    <input
                      type="month"
                      value={rekapGuruBulan}
                      onChange={(e) => setRekapGuruBulan(e.target.value)}
                      className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold"
                    />
                    <select
                      value={rekapProgram}
                      onChange={(e) => setRekapProgram(e.target.value as 'Semua' | ProgramAbsensiType)}
                      className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-emerald-900"
                    >
                      <option value="Semua">Semua Program</option>
                      {PROGRAM_ABSENSI_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <PrintOrientationControl recommended="landscape" />
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Rekap Guru</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-200 border-collapse">
                    <thead>
                      <tr className="bg-emerald-900 text-white font-bold">
                        <th className="py-2 px-2.5 border border-emerald-800 text-center w-9">No</th>
                        <th className="py-2 px-3 border border-emerald-800 text-left">Nama Ustadz / Ustadzah</th>
                        <th className="py-2 px-3 border border-emerald-800 text-left">Jabatan / Amanah</th>
                        <th className="py-2 px-2.5 border border-emerald-800 text-center">Hadir</th>
                        <th className="py-2 px-2.5 border border-emerald-800 text-center">Izin</th>
                        <th className="py-2 px-2.5 border border-emerald-800 text-center">Sakit</th>
                        <th className="py-2 px-2.5 border border-emerald-800 text-center">Badal</th>
                        <th className="py-2 px-2.5 border border-emerald-800 text-center">Bukti Selfie</th>
                        <th className="py-2 px-2.5 border border-emerald-800 text-center">Total Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-semibold">
                      {rekapGuruSummary.map((row, idx) => (
                        <tr key={row.ustadz.id} className="hover:bg-slate-50">
                          <td className="py-2 px-2 border border-slate-200 text-center">{idx + 1}</td>
                          <td className="py-2 px-3 border border-slate-200 font-bold text-slate-900">
                            {row.ustadz.nama}
                            <span className="block text-[10px] font-arabic text-emerald-800">
                              {row.ustadz.namaArab}
                            </span>
                          </td>
                          <td className="py-2 px-3 border border-slate-200 text-slate-600">
                            {row.ustadz.jabatanUtama}
                          </td>
                          <td className="py-2 px-2.5 border border-slate-200 text-center text-emerald-800 font-bold tabular-nums">
                            {row.hadir}
                          </td>
                          <td className="py-2 px-2.5 border border-slate-200 text-center text-blue-700 tabular-nums">
                            {row.izin}
                          </td>
                          <td className="py-2 px-2.5 border border-slate-200 text-center text-amber-700 tabular-nums">
                            {row.sakit}
                          </td>
                          <td className="py-2 px-2.5 border border-slate-200 text-center text-purple-700 tabular-nums">
                            {row.badal}
                          </td>
                          <td className="py-2 px-2.5 border border-slate-200 text-center text-sky-700 tabular-nums">
                            {row.selfieCount} foto
                          </td>
                          <td className="py-2 px-2.5 border border-slate-200 text-center font-black tabular-nums">
                            {row.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Log Foto Selfie & Koordinat Bukti Kehadiran */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Bukti Foto Selfie Timestamp &amp; Log Presensi Guru ({rekapGuruFilteredLogs.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rekapGuruFilteredLogs.slice(0, 12).map((ag) => (
                      <div
                        key={ag.id}
                        className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center gap-3 text-xs"
                      >
                        {ag.fotoSelfieUrl ? (
                          <button
                            type="button"
                            onClick={() => setLightboxRecord(ag)}
                            className="shrink-0"
                          >
                            <img
                              src={ag.fotoSelfieUrl}
                              alt={ag.ustadzNama}
                              className="w-16 h-12 object-cover rounded-lg border border-slate-300"
                            />
                          </button>
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 text-[10px] font-bold shrink-0">
                            Manual
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">{ag.ustadzNama}</p>
                          <p className="text-[10px] text-emerald-800 font-semibold truncate">
                            {ag.program || 'Madrasah Diniyah'} · {ag.status}
                          </p>
                          <p className="text-[10px] text-slate-500 tabular-nums">
                            {ag.tanggal} {ag.waktuInput} {ag.koordinat ? `· ${ag.koordinat}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: KURIKULUM KITAB & RUMUS PEGON MAKNA JAWA */}
      {activeTab === 'kurikulum' && (
        <div className="space-y-5">
          {/* Rumus Pegon Makna Jawa Card (no-print agar tidak ikut tercetak) */}
          <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-200 space-y-2 no-print">
            <h4 className="font-bold text-xs text-amber-950">
              Panduan Rumus Makna Kitab Pegon Jawa (Utawi Iki Iku)
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { code: 'م', arti: 'Mubtada\' ("Utawi")' },
                { code: 'خ', arti: 'Khobar ("Iku")' },
                { code: 'ف', arti: 'Fa\'il ("Sopo / Opo")' },
                { code: 'مف', arti: 'Maf\'ul Bih ("Ing")' },
                { code: 'ج', arti: 'Jawab ("Mongko")' },
                { code: 'غ', arti: 'Ghoyah ("Senajan")' },
                { code: 'ش', arti: 'Syarth ("Lamun")' },
              ].map((r) => (
                <div
                  key={r.code}
                  className="px-3 py-1 rounded-xl bg-white border border-amber-300 flex items-center gap-2"
                >
                  <span className="font-arabic text-base font-bold text-emerald-900">{r.code}</span>
                  <span className="text-slate-700 font-semibold">{r.arti}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matriks Kurikulum 22 Fan Resmi (Lampiran 3. KURIKULUM 2026-2027) */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
            <PrintKopPondok
              variant="maarif"
              judulDokumen="KURIKULUM MADRASAH DINIYAH SALAFIYAH (22 FAN ILMU)"
              subJudul="Tahun Ajaran 2026 / 2027 M · 1447 / 1448 H"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 no-print">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Matriks Kurikulum Resmi 22 Fan Madrasah Diniyah (T.A. 2026-2027)
                </h3>
                <p className="text-xs text-slate-500">
                  Klik kitab atau jam tatap muka (JTM) pada tiap kelas untuk menyesuaikan beban ajar (Total standar: 18 JTM/minggu per tingkat).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 no-print">
                <PrintOrientationControl recommended="landscape" />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kurikulum F4</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto print:overflow-visible border border-slate-200 rounded-2xl">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-emerald-900 text-white font-bold text-center">
                    <th className="p-2 border border-emerald-800 w-8">No</th>
                    <th className="p-2 border border-emerald-800 text-left min-w-[130px]">Fan Ilmu</th>
                    {[1, 2, 3, 4, 5, 6].map((k) => (
                      <th key={k} colSpan={2} className="p-1.5 border border-emerald-800">
                        Kelas {k} MDS
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-emerald-800 text-emerald-50 text-[10px] font-semibold text-center">
                    <th className="p-1 border border-emerald-700" colSpan={2}>
                      Nama Kitab &amp; Jam / Minggu
                    </th>
                    {[1, 2, 3, 4, 5, 6].map((k) => (
                      <React.Fragment key={k}>
                        <th className="p-1 border border-emerald-700 min-w-[100px]">Kitab</th>
                        <th className="p-1 border border-emerald-700 w-9">JTM</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {kurikulumMatrix.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="p-1.5 border border-slate-200 text-center font-bold text-slate-600">
                        {row.no}
                      </td>
                      <td className="p-1.5 border border-slate-200">
                        <span className="font-bold text-slate-900 block">{row.fan}</span>
                        <span className="font-arabic text-xs text-emerald-800">{row.fanArab}</span>
                      </td>
                      {(['kelas1', 'kelas2', 'kelas3', 'kelas4', 'kelas5', 'kelas6'] as const).map(
                        (kelasKey) => {
                          const cell = row[kelasKey];
                          return (
                            <React.Fragment key={kelasKey}>
                              <td className="p-1 border border-slate-200">
                                <input
                                  type="text"
                                  dir="rtl"
                                  value={cell.kitab}
                                  placeholder="-"
                                  onChange={(e) =>
                                    updateKurikulumMatrixCell(
                                      row.id,
                                      kelasKey,
                                      e.target.value,
                                      cell.jtm
                                    )
                                  }
                                  className="w-full text-right font-arabic text-xs bg-transparent px-1 py-0.5 rounded focus:bg-white focus:ring-1 focus:ring-emerald-600 outline-none"
                                />
                              </td>
                              <td className="p-1 border border-slate-200 text-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  value={cell.jtm || ''}
                                  placeholder="0"
                                  onChange={(e) =>
                                    updateKurikulumMatrixCell(
                                      row.id,
                                      kelasKey,
                                      cell.kitab,
                                      Math.max(0, parseInt(e.target.value, 10) || 0)
                                    )
                                  }
                                  className={`w-9 text-center tabular-nums font-bold rounded py-0.5 outline-none focus:ring-1 focus:ring-emerald-600 ${
                                    cell.jtm > 0
                                      ? 'bg-emerald-50 text-emerald-900'
                                      : 'bg-transparent text-slate-300'
                                  }`}
                                />
                              </td>
                            </React.Fragment>
                          );
                        }
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-amber-50 font-bold text-slate-900 border-t-2 border-slate-300 text-center">
                    <td colSpan={2} className="p-2 border border-slate-200 text-right">
                      TOTAL JTM PER MINGGU
                    </td>
                    {(['kelas1', 'kelas2', 'kelas3', 'kelas4', 'kelas5', 'kelas6'] as const).map(
                      (kelasKey) => {
                        const sum = kurikulumMatrix.reduce(
                          (acc, r) => acc + (r[kelasKey]?.jtm || 0),
                          0
                        );
                        return (
                          <React.Fragment key={kelasKey}>
                            <td className="p-2 border border-slate-200 text-[10px] text-slate-500">
                              Target: 18 JTM
                            </td>
                            <td
                              className={`p-2 border border-slate-200 tabular-nums ${
                                sum === 18 ? 'text-emerald-800 bg-emerald-100' : 'text-amber-800'
                              }`}
                            >
                              {sum}
                            </td>
                          </React.Fragment>
                        );
                      }
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 no-print">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Kurikulum Kitab Kuning Salafiyah (Kelas 1 – 6 MDS)
                </h3>
                <p className="text-xs text-slate-500">
                  Lengkap dengan KKM standar (65), target hafalan nadhom/matan, dan contoh makna Jawa.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddKitab((v) => !v)}
                className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kitab Kurikulum</span>
              </button>
            </div>

            {showAddKitab && (
              <form
                onSubmit={handleAddKitabSubmit}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
              >
                <div>
                  <label className="block font-bold mb-1">Tingkat Kelas (1-6)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newTingkat}
                    onChange={(e) => setNewTingkat(parseInt(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Mata Pelajaran (Latin)</label>
                  <input
                    type="text"
                    required
                    value={newMapel}
                    onChange={(e) => setNewMapel(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nama Arab</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={newMapelArab}
                    onChange={(e) => setNewMapelArab(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 font-arabic text-base text-right"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Kitab Rujukan</label>
                  <input
                    type="text"
                    required
                    value={newKitab}
                    onChange={(e) => setNewKitab(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">KKM</label>
                  <input
                    type="number"
                    value={newKkm}
                    onChange={(e) => setNewKkm(parseInt(e.target.value) || 65)}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Target Hafalan</label>
                  <input
                    type="text"
                    value={newTargetHafalan}
                    onChange={(e) => setNewTargetHafalan(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Contoh Makna Jawa (Pegon)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={newMaknaJawa}
                    onChange={(e) => setNewMaknaJawa(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 font-arabic text-base text-right"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-emerald-800 text-white font-bold"
                  >
                    Simpan Kitab
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">Fan / Mapel</th>
                    <th className="py-2.5 px-3">Kitab Kuning</th>
                    <th className="py-2.5 px-3 text-center">KKM</th>
                    <th className="py-2.5 px-3">Target Hafalan</th>
                    <th className="py-2.5 px-3 text-right">Makna Pegon Jawa</th>
                    <th className="py-2.5 px-3 text-right">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kurikulumKitabList.map((k: KurikulumKitabItem) => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-emerald-900">
                        Tingkat {k.tingkat} MDS
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {k.mapel}{' '}
                        <span className="font-arabic text-emerald-700 font-normal">
                          ({k.mapelArab})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{k.kitab}</td>
                      <td className="py-2.5 px-3 text-center font-bold tabular-nums">{k.kkm}</td>
                      <td className="py-2.5 px-3 text-slate-600">{k.targetHafalan}</td>
                      <td className="py-2.5 px-3 text-right font-arabic text-base text-slate-800" dir="rtl">
                        {k.maknaJawaContoh}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteKurikulumKitab(k.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3B: KUMPULAN KITAB PDF MADRASAH DINIYAH */}
      {activeTab === 'kitab_pdf' && (() => {
        const filteredPdf = kitabPdfList.filter((item) => {
          if (pdfFilterTingkat !== 'Semua' && item.tingkat !== pdfFilterTingkat) return false;
          if (pdfFilterMakna !== 'Semua' && item.statusMakna !== pdfFilterMakna) return false;
          return true;
        });

        const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setPdfFileName(file.name);
          setPdfUkuran(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              setPdfDataUrl(reader.result);
            }
          };
          reader.readAsDataURL(file);
        };

        const handleAddPdfSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!pdfNama.trim()) return;
          addKitabPdf({
            namaKitab: pdfNama.trim(),
            namaArab: pdfArab.trim() || pdfNama.trim(),
            pengarang: pdfPengarang.trim() || 'Ulama Salaf',
            tingkat: pdfTingkat,
            fan: pdfFan.trim() || 'Fiqih',
            statusMakna: pdfStatusMakna,
            ukuranFile: pdfUkuran || '2.0 MB',
            fileName: pdfFileName || `${pdfNama.trim().replace(/\s+/g, '_')}.pdf`,
            pdfDataUrl,
            catatan: pdfCatatan.trim() || 'Arsip kitab Madrasah Diniyah PP NU Darussalam',
            tanggalUpload: new Date().toISOString().substring(0, 10),
          });
          setShowAddPdf(false);
          setPdfNama('');
          setPdfArab('');
          setPdfPengarang('');
          setPdfCatatan('');
          setPdfFileName('');
          setPdfUkuran('');
          setPdfDataUrl(undefined);
          setSuccessToast(`Kitab PDF "${pdfNama}" berhasil ditambahkan ke perpustakaan digital.`);
          setTimeout(() => setSuccessToast(''), 3500);
        };

        const handleDownloadSampleNote = (item: KitabPdfItem) => {
          if (item.pdfDataUrl) {
            const a = document.createElement('a');
            a.href = item.pdfDataUrl;
            a.download = item.fileName;
            a.click();
            return;
          }
          const infoText = [
            `PERPUSTAKAAN DIGITAL KITAB MADRASAH DINIYAH SALAFIYAH`,
            `PP. NU DARUSSALAM KARANGDADAP, PEKALONGAN`,
            `======================================================`,
            `Nama Kitab  : ${item.namaKitab}`,
            `Judul Arab  : ${item.namaArab}`,
            `Pengarang   : ${item.pengarang}`,
            `Tingkat     : Kelas ${item.tingkat} MDS`,
            `Fan Ilmu    : ${item.fan}`,
            `Status Makna: ${item.statusMakna}`,
            `Nama File   : ${item.fileName} (${item.ukuranFile})`,
            `Catatan     : ${item.catatan || '-'}`,
            ``,
            `Silakan unggah salinan PDF asli kitab melalui tombol "Unggah Kitab PDF" untuk pratinjau langsung di browser.`,
          ].join('\n');
          const blob = new Blob([infoText], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = item.fileName.replace(/\.pdf$/i, '_Katalog.txt');
          a.click();
          URL.revokeObjectURL(url);
        };

        return (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Kumpulan Kitab Madrasah Diniyah (PDF Bermakna Pegon & Kosongan)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Arsip kitab digital untuk pegangan guru & santri kelas 1–6 MDS lengkap dengan makna Pegon Jawa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPdf((v) => !v)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Kitab PDF</span>
                </button>
              </div>

              {showAddPdf && (
                <form
                  onSubmit={handleAddPdfSubmit}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                >
                  <div>
                    <label className="block font-bold mb-1">Nama Kitab (Latin)</label>
                    <input
                      type="text"
                      required
                      value={pdfNama}
                      onChange={(e) => setPdfNama(e.target.value)}
                      placeholder="Contoh: Fathul Qorib Pegon"
                      className="w-full rounded-xl border border-slate-300 p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Judul Arab</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={pdfArab}
                      onChange={(e) => setPdfArab(e.target.value)}
                      placeholder="فتح القريب المجيب"
                      className="w-full rounded-xl border border-slate-300 p-2 font-arabic text-base text-right bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Muallif / Pengarang</label>
                    <input
                      type="text"
                      value={pdfPengarang}
                      onChange={(e) => setPdfPengarang(e.target.value)}
                      placeholder="Syaikh Ibnu Qosim Al-Ghozi"
                      className="w-full rounded-xl border border-slate-300 p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Tingkat Kelas</label>
                    <select
                      value={pdfTingkat}
                      onChange={(e) => setPdfTingkat(parseInt(e.target.value, 10))}
                      className="w-full rounded-xl border border-slate-300 p-2 bg-white font-semibold"
                    >
                      {[1, 2, 3, 4, 5, 6].map((t) => (
                        <option key={t} value={t}>
                          Tingkat {t} MDS
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Fan Ilmu</label>
                    <input
                      type="text"
                      value={pdfFan}
                      onChange={(e) => setPdfFan(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Status Makna</label>
                    <select
                      value={pdfStatusMakna}
                      onChange={(e) =>
                        setPdfStatusMakna(e.target.value as 'Sudah Bermakna Pegon' | 'Kosongan')
                      }
                      className="w-full rounded-xl border border-slate-300 p-2 bg-white font-semibold"
                    >
                      <option value="Sudah Bermakna Pegon">Sudah Bermakna Pegon</option>
                      <option value="Kosongan">Kosongan (Gundul / Maktabah)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">Pilih File PDF Kitab</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfFileChange}
                      className="w-full rounded-xl border border-slate-300 p-1.5 bg-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-800 file:text-white file:text-xs file:font-bold"
                    />
                    {pdfFileName && (
                      <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                        Terpilih: {pdfFileName} ({pdfUkuran})
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Catatan Edisi</label>
                    <input
                      type="text"
                      value={pdfCatatan}
                      onChange={(e) => setPdfCatatan(e.target.value)}
                      placeholder="Cetakan / makna pesantren..."
                      className="w-full rounded-xl border border-slate-300 p-2 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPdf(false)}
                      className="px-4 py-2 rounded-xl bg-slate-200 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                    >
                      Simpan Kitab ke Katalog
                    </button>
                  </div>
                </form>
              )}

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-600">Filter Tingkat:</span>
                {(['Semua', 1, 2, 3, 4, 5, 6] as const).map((t) => (
                  <button
                    key={String(t)}
                    type="button"
                    onClick={() => setPdfFilterTingkat(t)}
                    className={`px-3 py-1 rounded-xl font-bold border transition ${
                      pdfFilterTingkat === t
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t === 'Semua' ? 'Semua Tingkat' : `Kelas ${t}`}
                  </button>
                ))}
                <span className="font-bold text-slate-600 ml-2">Status Makna:</span>
                {(['Semua', 'Sudah Bermakna Pegon', 'Kosongan'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPdfFilterMakna(st)}
                    className={`px-3 py-1 rounded-xl font-bold border transition ${
                      pdfFilterMakna === st
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* PDF Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredPdf.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60 hover:bg-white transition flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                            Tingkat {item.tingkat} MDS · {item.fan}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              item.statusMakna === 'Sudah Bermakna Pegon'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {item.statusMakna}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{item.namaKitab}</h4>
                        <p className="font-arabic text-base text-emerald-900" dir="rtl">
                          {item.namaArab}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          Pengarang: <strong>{item.pengarang}</strong> · {item.ukuranFile}
                        </p>
                        {item.catatan && (
                          <p className="text-[11px] text-slate-500 italic">{item.catatan}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteKitabPdf(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Hapus Kitab"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {item.fileName}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewPdf(item)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Pratinjau</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadSampleNote(item)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {previewPdf && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 no-print">
                <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{previewPdf.namaKitab}</h3>
                      <p className="text-xs text-slate-500">
                        {previewPdf.pengarang} · Tingkat {previewPdf.tingkat} MDS · {previewPdf.statusMakna}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewPdf(null)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {previewPdf.pdfDataUrl ? (
                    <iframe
                      src={previewPdf.pdfDataUrl}
                      title={previewPdf.namaKitab}
                      className="w-full h-[65vh] rounded-xl border border-slate-200"
                    />
                  ) : (
                    <div className="p-8 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-3">
                      <p className="font-arabic text-2xl text-emerald-900" dir="rtl">
                        {previewPdf.namaArab}
                      </p>
                      <p className="text-xs text-slate-700 max-w-md mx-auto">
                        File katalog bawaan <strong>{previewPdf.fileName}</strong> ({previewPdf.ukuranFile}). Untuk membaca halaman PDF secara utuh di layar ini, unggah berkas PDF resmi kitab melalui tombol <strong>Unggah Kitab PDF</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDownloadSampleNote(previewPdf)}
                        className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Ringkasan Katalog</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* TAB 4: JADWAL PELAJARAN KELAS 1-6 (SYNCED WITH IMTIHAN & KARTU) */}
      {activeTab === 'jadwal' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
          <PrintKopPondok
            variant="maarif"
            judulDokumen="JADWAL PELAJARAN MADRASAH DINIYAH KELAS 1–6"
            subJudul="Sinkronisasi Jadwal Pelajaran Ma'arifan, Imtihan & Kartu Ujian"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 no-print">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Jadwal Madrasah Diniyah Kelas 1–6 (Sinkron Imtihan & Kartu)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Setiap perubahan jadwal otomatis memperbarui tabel jadwal di Modul Imtihan & sisi belakang Kartu Imtihan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 no-print">
              <PrintOrientationControl recommended="landscape" />
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Jadwal</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200 text-center">
              <thead>
                <tr className="bg-emerald-900 text-white font-bold">
                  <th className="p-2 border border-emerald-800">Hari & Jam</th>
                  <th className="p-2 border border-emerald-800">Kelas 1</th>
                  <th className="p-2 border border-emerald-800">Kelas 2</th>
                  <th className="p-2 border border-emerald-800">Kelas 3</th>
                  <th className="p-2 border border-emerald-800">Kelas 4</th>
                  <th className="p-2 border border-emerald-800">Kelas 5</th>
                  <th className="p-2 border border-emerald-800">Kelas 6</th>
                  <th className="p-2 border border-emerald-800 no-print">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-semibold">
                {jadwalMaarifan.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 bg-emerald-50 font-bold text-emerald-950">
                      {j.hari} (Jam {j.jamKe})
                      <span className="block text-[10px] font-normal text-slate-500">
                        {j.waktu}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-200">{j.kelas1}</td>
                    <td className="p-2 border border-slate-200">{j.kelas2}</td>
                    <td className="p-2 border border-slate-200">{j.kelas3}</td>
                    <td className="p-2 border border-slate-200">{j.kelas4}</td>
                    <td className="p-2 border border-slate-200">{j.kelas5}</td>
                    <td className="p-2 border border-slate-200">{j.kelas6}</td>
                    <td className="p-2 border border-slate-200 no-print">
                      <button
                        type="button"
                        onClick={() => setEditingJadwal(j)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-800"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingJadwal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateJadwalMaarifan(editingJadwal.id, editingJadwal);
                  setEditingJadwal(null);
                  setSuccessToast("Jadwal Ma'arifan & Imtihan berhasil diperbarui.");
                }}
                className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
              >
                <h3 className="font-bold text-sm text-slate-900">
                  Edit Jadwal {editingJadwal.hari} Jam {editingJadwal.jamKe}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['kelas1', 'kelas2', 'kelas3', 'kelas4', 'kelas5', 'kelas6'] as const).map(
                    (k) => (
                      <div key={k}>
                        <label className="block font-bold mb-1 uppercase">{k}</label>
                        <input
                          type="text"
                          value={editingJadwal[k]}
                          onChange={(e) =>
                            setEditingJadwal({ ...editingJadwal, [k]: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-300 p-2"
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingJadwal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4B: MANAJEMEN MENGAJAR GURU (DASHBOARD GLOBAL, ANTI-BENTROK KETAT, & RIWAYAT) */}
      {activeTab === 'setting_guru' && (() => {
        const slotTingkat = parseInt(slotKelas.charAt(0), 10) || 1;
        const mapelsUntukTingkat = MAPEL_PER_TINGKAT[slotTingkat] || MAPEL_PER_TINGKAT[1];
        const hariList: JadwalMengajarSlot['hari'][] = ['Sabtu', 'Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis'];

        const toggleHariChip = (h: JadwalMengajarSlot['hari']) => {
          setSlotHariList((prev) =>
            prev.includes(h) ? (prev.length > 1 ? prev.filter((x) => x !== h) : prev) : [...prev, h]
          );
        };

        const handleAddSlot = (e: React.FormEvent) => {
          e.preventDefault();
          setSlotError('');

          if (slotHariList.length === 0) {
            setSlotError('Pilih minimal satu hari untuk penugasan jadwal.');
            return;
          }

          // 1. Cek ketersediaan jam guru
          const rule = guruAvailability.find((g) => g.ustadzNama === slotUstadz);
          if (rule) {
            const avail =
              slotJamKe === 1
                ? rule.jam1Tersedia
                : slotJamKe === 2
                ? rule.jam2Tersedia
                : rule.jam3Tersedia;
            if (!avail) {
              setSlotError(
                `${slotUstadz} menandai TIDAK BISA mengajar di Jam ${slotJamKe} (${rule.alasanRequest || 'berhalangan'}). Pilih jam lain atau ubah pengaturan request guru.`
              );
              return;
            }
          }

          // 2. Aturan ketat: jika Mapel di Kelas tersebut sudah diampu guru lain, tidak bisa ditugaskan ke guru berbeda
          const existingMapelOwner = jadwalMengajar.find(
            (s) => s.kelas === slotKelas && s.mapel === slotMapel && s.ustadzNama !== slotUstadz
          );
          if (existingMapelOwner) {
            setSlotError(
              `Terkunci: Mapel ${slotMapel} di kelas ${slotKelas} sudah terisi oleh ${existingMapelOwner.ustadzNama} (${existingMapelOwner.hari} Jam ${existingMapelOwner.jamKe}). Tidak dapat ditugaskan lagi ke guru lain sebelum slot lama dihapus.`
            );
            return;
          }

          // 3. Cek seluruh hari terpilih terhadap bentrok jam/kelas/guru
          for (const h of slotHariList) {
            const bentrokJamMapelKelas = jadwalMengajar.find(
              (s) => s.hari === h && s.jamKe === slotJamKe && s.kelas === slotKelas
            );
            if (bentrokJamMapelKelas) {
              setSlotError(
                `Terkunci: Hari ${h} Jam ${slotJamKe} di kelas ${slotKelas} sudah terisi ${bentrokJamMapelKelas.mapel} oleh ${bentrokJamMapelKelas.ustadzNama}. Tidak dapat ditimpa guru lain.`
              );
              return;
            }

            const bentrokGuru = jadwalMengajar.find(
              (s) => s.hari === h && s.jamKe === slotJamKe && s.ustadzNama === slotUstadz
            );
            if (bentrokGuru) {
              setSlotError(
                `Bentrok Jam Guru: ${slotUstadz} sudah bertugas mengajar ${bentrokGuru.mapel} di ${bentrokGuru.kelas} pada hari ${h} Jam ${slotJamKe}.`
              );
              return;
            }
          }

          slotHariList.forEach((h) => {
            addJadwalMengajarSlot({
              hari: h,
              jamKe: slotJamKe,
              kelas: slotKelas,
              mapel: slotMapel,
              ustadzNama: slotUstadz,
            });
          });

          setSuccessToast(
            `Berhasil menjadwalkan ${slotUstadz} (${slotMapel} · ${slotKelas}) untuk ${slotHariList.join(', ')} Jam ${slotJamKe}.`
          );
          setTimeout(() => setSuccessToast(''), 4000);
        };

        const displayedSlots = jadwalMengajar.filter(
          (s) => filterGuruJadwal === 'Semua' || s.ustadzNama === filterGuruJadwal
        );

        const activeClassesCovered = new Set(jadwalMengajar.map((j) => j.kelas)).size;
        const activeTeachersScheduled = new Set(jadwalMengajar.map((j) => j.ustadzNama)).size;
        const teachingLogs = auditLogs.filter(
          (l) =>
            l.aksi.includes('Jadwal Guru') ||
            l.aksi.includes('Absensi Guru') ||
            l.modul === "Ma'arifan"
        );
        const filteredGuruAbsensi = absensiGuruList.filter((a) => {
          if (filterGuruJadwal !== 'Semua' && a.ustadzNama !== filterGuruJadwal) return false;
          if (riwayatStatusFilter !== 'Semua' && a.status !== riwayatStatusFilter) return false;
          return true;
        });

        return (
          <div className="space-y-5">
            {/* Header + 3 Sub-Menu + 4 Global KPI */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 no-print">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-emerald-700" />
                    <span>Manajemen Mengajar Dewan Asatidz (Matriks Global &amp; Anti-Bentrok)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pantau seluruh jadwal kelas dan beban ustadz dalam satu preview global. Jam &amp; mapel yang sudah terisi otomatis terkunci dari penugasan guru lain.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <PrintOrientationControl recommended="landscape" />
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Jadwal F4</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setMengajarSubTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    mengajarSubTab === 'dashboard'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Dashboard &amp; Matriks Global</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMengajarSubTab('request_jam')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    mengajarSubTab === 'request_jam'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Setting Request Jam Guru</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMengajarSubTab('riwayat')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    mengajarSubTab === 'riwayat'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Riwayat Penugasan &amp; Mengajar ({teachingLogs.length + absensiGuruList.length})</span>
                </button>
              </div>

              {/* 4 Global Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-[11px] font-semibold text-slate-500">Total Slot Terjadwal</p>
                  <p className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                    {jadwalMengajar.length} <span className="text-[11px] font-normal text-slate-500">Jam Pelajaran</span>
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-[11px] font-semibold text-emerald-700">Ustadz Sudah Terplot</p>
                  <p className="text-base font-bold text-emerald-900 tabular-nums mt-0.5">
                    {activeTeachersScheduled} / {ustadzList.length}{' '}
                    <span className="text-[11px] font-normal text-emerald-700">Ustadz</span>
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-[11px] font-semibold text-amber-800">Cakupan Kelas Terisi</p>
                  <p className="text-base font-bold text-amber-900 tabular-nums mt-0.5">
                    {activeClassesCovered} / {DAFTAR_KELAS_DINIYAH.length}{' '}
                    <span className="text-[11px] font-normal text-amber-800">Kelas</span>
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-[11px] font-semibold text-slate-500">Catatan Absensi Guru</p>
                  <p className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                    {absensiGuruList.length}{' '}
                    <span className="text-[11px] font-normal text-slate-500">Sesi Tercatat</span>
                  </p>
                </div>
              </div>
            </div>

            {/* SUB-VIEW 1: DASHBOARD & MATRIKS GLOBAL + QUICK PLOT */}
            {mengajarSubTab === 'dashboard' && (
              <div className="space-y-5">
                {/* Multi-Day Quick Plot Form with Live Lock Labels */}
                <form
                  onSubmit={handleAddSlot}
                  className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3 text-xs no-print"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Penugasan Mengajar Cepat (Bisa Pilih Banyak Hari Sekaligus)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Klik sel kosong pada Matriks Global di bawah untuk langsung memilih Hari, Jam &amp; Kelas, atau pilih hari secara massal di sini.
                      </p>
                    </div>
                  </div>

                  {/* Multi-day selector chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-slate-600 mr-1">Hari Aktif:</span>
                    {hariList.map((h) => {
                      const active = slotHariList.includes(h);
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => toggleHariChip(h)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                            active
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {h}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                    <div>
                      <label className="block font-bold mb-1">Jam Ke-</label>
                      <select
                        value={slotJamKe}
                        onChange={(e) => setSlotJamKe(parseInt(e.target.value, 10) as 1 | 2 | 3)}
                        className="w-full rounded-xl border border-slate-300 p-2 bg-white font-semibold"
                      >
                        <option value={1}>Jam 1 (16.00 Ashar)</option>
                        <option value={2}>Jam 2 (18.30 Maghrib)</option>
                        <option value={3}>Jam 3 (20.00 Isya)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Kelas Diniyah</label>
                      <select
                        value={slotKelas}
                        onChange={(e) => {
                          const nextK = e.target.value;
                          setSlotKelas(nextK);
                          const t = parseInt(nextK.charAt(0), 10) || 1;
                          const firstM = MAPEL_PER_TINGKAT[t]?.[0]?.nama;
                          if (firstM) setSlotMapel(firstM);
                        }}
                        className="w-full rounded-xl border border-slate-300 p-2 bg-white font-semibold"
                      >
                        {DAFTAR_KELAS_DINIYAH.map((k) => {
                          const filledSameSlot = jadwalMengajar.find(
                            (j) =>
                              slotHariList.includes(j.hari) &&
                              j.jamKe === slotJamKe &&
                              j.kelas === k
                          );
                          return (
                            <option key={k} value={k}>
                              {k} {filledSameSlot ? `[Terisi: ${filledSameSlot.ustadzNama}]` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Mapel (Tingkat {slotTingkat})</label>
                      <select
                        value={slotMapel}
                        onChange={(e) => setSlotMapel(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2 bg-white font-semibold"
                      >
                        {mapelsUntukTingkat.map((m) => {
                          const owner = jadwalMengajar.find(
                            (j) => j.kelas === slotKelas && j.mapel === m.nama
                          );
                          return (
                            <option key={m.nama} value={m.nama}>
                              {m.nama} ({m.kitab}){owner ? ` — [Diampu: ${owner.ustadzNama}]` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Ustadz Pengampu</label>
                      <select
                        value={slotUstadz}
                        onChange={(e) => setSlotUstadz(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2 bg-white font-semibold"
                      >
                        {ustadzList.map((u) => {
                          const rule = guruAvailability.find((g) => g.ustadzNama === u.nama);
                          const avail = rule
                            ? slotJamKe === 1
                              ? rule.jam1Tersedia
                              : slotJamKe === 2
                              ? rule.jam2Tersedia
                              : rule.jam3Tersedia
                            : true;
                          const bentrokJam = jadwalMengajar.find(
                            (j) =>
                              slotHariList.includes(j.hari) &&
                              j.jamKe === slotJamKe &&
                              j.ustadzNama === u.nama
                          );
                          const lockedOtherMapel = jadwalMengajar.find(
                            (j) =>
                              j.kelas === slotKelas &&
                              j.mapel === slotMapel &&
                              j.ustadzNama !== u.nama
                          );
                          const statusNote = !avail
                            ? '[Req: Tidak Bisa]'
                            : bentrokJam
                            ? `[Mengajar ${bentrokJam.kelas}]`
                            : lockedOtherMapel
                            ? `[Terkunci: ${lockedOtherMapel.ustadzNama}]`
                            : '';
                          return (
                            <option
                              key={u.id}
                              value={u.nama}
                              disabled={Boolean(!avail || bentrokJam || lockedOtherMapel)}
                            >
                              {u.nama} {statusNote}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-1 whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Plot ({slotHariList.length} Hari)</span>
                    </button>
                  </div>

                  {slotError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{slotError}</span>
                    </div>
                  )}
                </form>

                {/* Global Matrix Container (Printable F4) */}
                <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
                  <PrintKopPondok
                    variant="maarif"
                    judulDokumen="MATRIKS JADWAL MENGAJAR & BEBAN JTM DEWAN ASATIDZ"
                    subJudul={`Total Slot Terjadwal: ${jadwalMengajar.length} Jam Tatap Muka · Tahun Ajaran 2026/2027`}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 no-print">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl no-print">
                      <button
                        type="button"
                        onClick={() => setGlobalPreviewView('matriks_kelas')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          globalPreviewView === 'matriks_kelas'
                            ? 'bg-white text-emerald-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Matriks Global Kelas × Hari
                      </button>
                      <button
                        type="button"
                        onClick={() => setGlobalPreviewView('beban_ustadz')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          globalPreviewView === 'beban_ustadz'
                            ? 'bg-white text-emerald-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Preview Beban per Ustadz ({ustadzList.length})
                      </button>
                    </div>

                    <select
                      value={filterGuruJadwal}
                      onChange={(e) => setFilterGuruJadwal(e.target.value)}
                      className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold no-print"
                    >
                      <option value="Semua">Sorot Semua Ustadz ({jadwalMengajar.length} Slot)</option>
                      {ustadzList.map((u) => (
                        <option key={u.id} value={u.nama}>
                          Filter: {u.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {globalPreviewView === 'matriks_kelas' ? (
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                      <table className="w-full text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-emerald-900 text-white font-bold">
                            <th className="py-2.5 px-3 text-left min-w-[140px]">Kelas Diniyah</th>
                            {hariList.map((h) => (
                              <th key={h} className="py-2.5 px-2 text-center min-w-[145px]">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {DAFTAR_KELAS_DINIYAH.map((kls) => (
                            <tr key={kls} className="hover:bg-slate-50/70 align-top">
                              <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200 whitespace-nowrap">
                                {kls}
                              </td>
                              {hariList.map((h) => {
                                const daySlots = displayedSlots
                                  .filter((s) => s.kelas === kls && s.hari === h)
                                  .sort((a, b) => a.jamKe - b.jamKe);
                                return (
                                  <td key={h} className="p-1.5 border-r border-slate-100 space-y-1">
                                    {([1, 2, 3] as const).map((jk) => {
                                      const slot = daySlots.find((s) => s.jamKe === jk);
                                      if (slot) {
                                        return (
                                          <div
                                            key={jk}
                                            className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-1 group"
                                          >
                                            <div className="min-w-0">
                                              <p className="text-[10px] font-bold text-emerald-900 flex items-center gap-1">
                                                <Lock className="w-2.5 h-2.5 shrink-0 text-emerald-700" />
                                                <span>J{jk}: {slot.mapel}</span>
                                              </p>
                                              <p className="text-[10px] text-slate-700 truncate">
                                                {slot.ustadzNama}
                                              </p>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => deleteJadwalMengajarSlot(slot.id)}
                                              className="text-rose-500 hover:text-rose-700 text-[11px] font-bold px-1 no-print shrink-0"
                                              title="Hapus & buka kunci slot"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        );
                                      }
                                      return (
                                        <button
                                          key={jk}
                                          type="button"
                                          onClick={() => {
                                            setSlotHariList([h]);
                                            setSlotJamKe(jk);
                                            setSlotKelas(kls);
                                            const t = parseInt(kls.charAt(0), 10) || 1;
                                            const firstM = MAPEL_PER_TINGKAT[t]?.[0]?.nama;
                                            if (firstM) setSlotMapel(firstM);
                                            setSlotError('');
                                          }}
                                          className="w-full text-left px-1.5 py-0.5 rounded border border-dashed border-slate-200 text-[10px] text-slate-400 hover:border-emerald-400 hover:text-emerald-800 hover:bg-emerald-50/40 transition no-print"
                                        >
                                          + Jam {jk}
                                        </button>
                                      );
                                    })}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-emerald-900 text-white font-bold text-left">
                            <th className="py-2.5 px-3">Nama Ustadz</th>
                            <th className="py-2.5 px-3 text-center">Ketersediaan Jam 1/2/3</th>
                            <th className="py-2.5 px-3 text-center">Beban JTM</th>
                            <th className="py-2.5 px-3">Daftar Penugasan Kelas &amp; Mapel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {ustadzList.map((u) => {
                            const rule = guruAvailability.find((g) => g.ustadzNama === u.nama);
                            const slots = jadwalMengajar.filter((j) => j.ustadzNama === u.nama);
                            return (
                              <tr key={u.id} className="hover:bg-slate-50 align-top">
                                <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                                  {u.nama}
                                  <span className="block text-[10px] font-normal text-slate-500">
                                    {u.jabatanUtama}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center text-[11px] font-semibold">
                                  {rule ? (
                                    <span className="text-slate-700">
                                      J1: {rule.jam1Tersedia ? 'Ya' : 'Tidak'} · J2: {rule.jam2Tersedia ? 'Ya' : 'Tidak'} · J3: {rule.jam3Tersedia ? 'Ya' : 'Tidak'}
                                    </span>
                                  ) : (
                                    'Semua Jam'
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold tabular-nums text-emerald-900">
                                  {slots.length} JTM
                                </td>
                                <td className="py-2.5 px-3">
                                  {slots.length === 0 ? (
                                    <span className="text-slate-400 italic">Belum ada jadwal terplot</span>
                                  ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                      {slots.map((s) => (
                                        <span
                                          key={s.id}
                                          className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                                        >
                                          <strong>{s.hari} J{s.jamKe}</strong> · {s.kelas} ({s.mapel})
                                          <button
                                            type="button"
                                            onClick={() => deleteJadwalMengajarSlot(s.id)}
                                            className="text-rose-500 hover:text-rose-700 font-bold ml-0.5 no-print"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: SETTING REQUEST JAM GURU */}
            {mengajarSubTab === 'request_jam' && (
              <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 no-print">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>Pengaturan Ketersediaan &amp; Request Jam Mengajar Ustadz</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Centang jam yang bisa diisi masing-masing ustadz. Sistem otomatis menolak plotting pada jam yang ditandai Tidak Bisa.
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-left">
                        <th className="py-2.5 px-3">Nama Ustadz / Ustadzah</th>
                        <th className="py-2.5 px-3 text-center">JTM Terplot</th>
                        <th className="py-2.5 px-3 text-center">Jam 1 (16.00 Ashar)</th>
                        <th className="py-2.5 px-3 text-center">Jam 2 (18.30 Maghrib)</th>
                        <th className="py-2.5 px-3 text-center">Jam 3 (20.00 Isya)</th>
                        <th className="py-2.5 px-3">Keterangan / Request Guru</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {guruAvailability.map((rule) => {
                        const jtmCount = jadwalMengajar.filter(
                          (j) => j.ustadzNama === rule.ustadzNama
                        ).length;
                        return (
                          <tr key={rule.ustadzId} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {rule.ustadzNama}
                            </td>
                            <td className="py-2.5 px-3 text-center tabular-nums font-bold text-emerald-900">
                              {jtmCount} JTM
                            </td>
                            {(
                              [
                                { key: 'jam1Tersedia', label: 'Jam 1' },
                                { key: 'jam2Tersedia', label: 'Jam 2' },
                                { key: 'jam3Tersedia', label: 'Jam 3' },
                              ] as const
                            ).map((jam) => {
                              const ok = rule[jam.key];
                              return (
                                <td key={jam.key} className="py-2 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateGuruAvailability(rule.ustadzId, { [jam.key]: !ok })
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                                      ok
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : 'bg-rose-50 text-rose-700 border-rose-300'
                                    }`}
                                  >
                                    {ok ? 'Bisa Mengajar' : 'Tidak Bisa'}
                                  </button>
                                </td>
                              );
                            })}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={rule.alasanRequest || ''}
                                onChange={(e) =>
                                  updateGuruAvailability(rule.ustadzId, {
                                    alasanRequest: e.target.value,
                                  })
                                }
                                placeholder="Catatan jam kerja / request guru..."
                                className="w-full rounded-lg border border-slate-200 px-2.5 py-1 text-xs"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: RIWAYAT PENUGASAN & ABSENSI MENGAJAR */}
            {mengajarSubTab === 'riwayat' && (
              <div className="space-y-5">
                <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <History className="w-4 h-4 text-emerald-700" />
                        <span>Riwayat Absensi &amp; Kehadiran Mengajar Dewan Asatidz</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Pantau seluruh catatan hadir, izin, sakit, dan badal guru diniyah.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 no-print">
                      <select
                        value={filterGuruJadwal}
                        onChange={(e) => setFilterGuruJadwal(e.target.value)}
                        className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold"
                      >
                        <option value="Semua">Semua Ustadz</option>
                        {ustadzList.map((u) => (
                          <option key={u.id} value={u.nama}>
                            {u.nama}
                          </option>
                        ))}
                      </select>
                      <select
                        value={riwayatStatusFilter}
                        onChange={(e) => setRiwayatStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold"
                      >
                        <option value="Semua">Semua Status</option>
                        <option value="Hadir">Hadir</option>
                        <option value="Izin">Izin</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Badal">Badal</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-left font-bold">
                          <th className="py-2.5 px-3">Tanggal &amp; Jam</th>
                          <th className="py-2.5 px-3">Nama Ustadz</th>
                          <th className="py-2.5 px-3">Kelas / Tugas</th>
                          <th className="py-2.5 px-3">Mapel / Kitab</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Keterangan / Pengganti</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredGuruAbsensi.map((ag) => (
                          <tr key={ag.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 tabular-nums text-slate-600">
                              {ag.tanggal} · {ag.waktuInput}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">{ag.ustadzNama}</td>
                            <td className="py-2.5 px-3 text-slate-700">{ag.kelas}</td>
                            <td className="py-2.5 px-3 text-slate-700">{ag.mapel}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`font-bold ${
                                  ag.status === 'Hadir'
                                    ? 'text-emerald-700'
                                    : ag.status === 'Badal'
                                    ? 'text-amber-700'
                                    : 'text-rose-700'
                                }`}
                              >
                                {ag.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {ag.pengganti ? `Digantikan oleh ${ag.pengganti}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audit Log Perubahan Jadwal Mengajar */}
                <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">
                    Riwayat Perubahan &amp; Penugasan Jadwal Mengajar
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-left font-bold">
                          <th className="py-2.5 px-3">Waktu</th>
                          <th className="py-2.5 px-3">Aksi</th>
                          <th className="py-2.5 px-3">Petugas</th>
                          <th className="py-2.5 px-3">Keterangan Penugasan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {teachingLogs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-slate-400">
                              Belum ada log perubahan jadwal.
                            </td>
                          </tr>
                        ) : (
                          teachingLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 tabular-nums text-slate-500">{log.waktu}</td>
                              <td className="py-2 px-3 font-bold text-emerald-900">{log.aksi}</td>
                              <td className="py-2 px-3 text-slate-700">{log.userName}</td>
                              <td className="py-2 px-3 text-slate-800">{log.keterangan}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* TAB 4C: KALENDER PENDIDIKAN (T.A. 1447-1448 H / 2026-2027 M) */}
      {activeTab === 'kalender' && (() => {
        const legendMap = new Map(kalenderPendidikan.legend.map((l) => [l.code, l]));
        const totalHariAktif =
          kalenderPendidikan.jmlHariImtihan1 + kalenderPendidikan.jmlHariImtihan2;

        return (
          <div className="space-y-4">
            {/* Interactive Toolbar (No Print) */}
            <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3 no-print">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-700" />
                    <span>Editor Kalender Pendidikan PP NU Darussalam</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih kode kegiatan di bawah, lalu klik sel tanggal pada kalender untuk mengisi atau menghapus agenda.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PrintOrientationControl recommended="landscape" />
                  <button
                    type="button"
                    onClick={() => {
                      resetKalenderPendidikan();
                      setSuccessToast('Kalender pendidikan dikembalikan ke jadwal resmi awal.');
                      setTimeout(() => setSuccessToast(''), 3000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Standar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Kalender F4</span>
                  </button>
                </div>
              </div>

              {/* Quick Meta Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={kalenderPendidikan.tahunAjaran}
                    onChange={(e) => updateKalenderMeta({ tahunAjaran: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Tempat &amp; Tanggal</label>
                  <input
                    type="text"
                    value={kalenderPendidikan.ditetapkanDi}
                    onChange={(e) => updateKalenderMeta({ ditetapkanDi: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Hari Aktif Imtihan I</label>
                  <input
                    type="number"
                    value={kalenderPendidikan.jmlHariImtihan1}
                    onChange={(e) =>
                      updateKalenderMeta({
                        jmlHariImtihan1: Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Hari Aktif Imtihan II</label>
                  <input
                    type="number"
                    value={kalenderPendidikan.jmlHariImtihan2}
                    onChange={(e) =>
                      updateKalenderMeta({
                        jmlHariImtihan2: Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 font-bold tabular-nums"
                  />
                </div>
              </div>

              {/* Code Brush Palette */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveKalenderCode('')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    activeKalenderCode === ''
                      ? 'ring-2 ring-slate-900 bg-white text-slate-900 border-slate-900'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  HAPUS / KOSONGKAN SEL
                </button>
                {kalenderPendidikan.legend.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setActiveKalenderCode(item.code)}
                    style={{ backgroundColor: item.bgColor, color: item.textColor }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      activeKalenderCode === item.code
                        ? 'ring-2 ring-offset-1 ring-slate-900 scale-105'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                    title={item.label}
                  >
                    {item.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Official Printable Kalender Sheet Matching User Reference Photo */}
            <div className="rounded-3xl bg-white p-5 print:p-1 print:border-0 border border-slate-200 shadow-2xs space-y-3 printable-area">
              {/* Header with Official Logo */}
              <div className="flex items-center gap-4 border-b-2 border-slate-800 pb-2.5">
                <img
                  src="/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png"
                  alt="Logo PP NU Darussalam"
                  className="w-16 h-16 object-contain shrink-0"
                />
                <div className="space-y-0.5">
                  <h2 className="text-lg font-black tracking-wide text-slate-900 uppercase">
                    KALENDER PENDIDIKAN
                  </h2>
                  <p className="text-xs font-extrabold uppercase text-slate-900">
                    PONDOK PESANTREN NU DARUSSALAM KARANGDADAP - PEKALONGAN
                  </p>
                  <p className="text-xs font-bold italic text-slate-800">
                    {kalenderPendidikan.tahunAjaran}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700">
                    Jl. Raya Karangdadap KM 1, Karangdadap, Kec. Karangdadap, Kab. Pekalongan, Jawa Tengah, Kode Pos 51174
                  </p>
                </div>
              </div>

              {/* 14-Month Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-800 text-[10px]">
                  <thead>
                    <tr className="bg-[#A3B84C] text-slate-950 font-bold">
                      <th rowSpan={2} className="border border-slate-800 px-1.5 py-1 w-7 text-center">
                        NO
                      </th>
                      <th rowSpan={2} className="border border-slate-800 px-2 py-1 min-w-[92px] text-center">
                        BULAN
                      </th>
                      <th colSpan={31} className="border border-slate-800 py-0.5 text-center uppercase">
                        TANGGAL
                      </th>
                    </tr>
                    <tr className="bg-[#A3B84C] text-slate-950 font-bold">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <th
                          key={d}
                          className="border border-slate-800 w-[22px] min-w-[20px] py-0.5 text-center tabular-nums"
                        >
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kalenderPendidikan.rows.map((row) => (
                      <tr key={row.bulan}>
                        <td className="border border-slate-800 bg-[#A3B84C] text-center font-bold text-slate-950">
                          {row.no}
                        </td>
                        <td className="border border-slate-800 bg-[#A3B84C] px-1.5 py-1 font-bold text-slate-950 whitespace-nowrap">
                          {row.bulan}
                        </td>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                          const isBlocked = row.blockedDays.includes(day);
                          const code = row.days[day] || '';
                          const meta = code ? legendMap.get(code) : undefined;
                          if (isBlocked) {
                            return (
                              <td
                                key={day}
                                className="border border-slate-800 bg-slate-900"
                                title={`${row.bulan} tgl ${day} (Tidak aktif)`}
                              />
                            );
                          }
                          return (
                            <td
                              key={day}
                              onClick={() => setKalenderDayCode(row.bulan, day, activeKalenderCode)}
                              style={
                                meta
                                  ? { backgroundColor: meta.bgColor, color: meta.textColor }
                                  : undefined
                              }
                              title={`${row.bulan} tgl ${day}${meta ? `: ${meta.label}` : ' (Klik untuk isi)'}`}
                              className="border border-slate-800 text-center font-bold text-[8px] leading-tight cursor-pointer select-none px-0.5 py-1 hover:ring-1 hover:ring-inset hover:ring-slate-950"
                            >
                              {code}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Legend + Hari Aktif + Pengasuh Signature */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2 text-[10px]">
                <div className="lg:col-span-9 space-y-1">
                  <p className="font-bold text-slate-900">Keterangan:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-0.5">
                    {kalenderPendidikan.legend.map((item) => (
                      <div key={item.code} className="flex items-center gap-1.5">
                        <span
                          style={{ backgroundColor: item.bgColor, color: item.textColor }}
                          className="inline-block w-10 text-center font-bold text-[9px] py-0.5 border border-slate-400 shrink-0"
                        >
                          {item.code}
                        </span>
                        <span className="text-slate-800 truncate">: {item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-3 flex flex-col justify-between space-y-3 text-[10px]">
                  <div className="space-y-0.5 font-semibold text-slate-900">
                    <div className="flex justify-between">
                      <span>Jml Hari Aktif di Imtihan I</span>
                      <span className="tabular-nums">: {kalenderPendidikan.jmlHariImtihan1} HARI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jml Hari Aktif di Imtihan II</span>
                      <span className="tabular-nums">: {kalenderPendidikan.jmlHariImtihan2} HARI</span>
                    </div>
                    <div className="flex justify-end font-bold border-t border-slate-400 pt-0.5 tabular-nums">
                      {totalHariAktif} HARI
                    </div>
                  </div>

                  <div className="pt-1 text-slate-900 space-y-6">
                    <div>
                      <p>Ditetapkan di :</p>
                      <p className="font-semibold">{kalenderPendidikan.ditetapkanDi}</p>
                    </div>
                    <div>
                      <p className="font-bold underline uppercase">
                        {kalenderPendidikan.pengasuhNama}
                      </p>
                      <p>Pengasuh PP NU Darussalam</p>
                    </div>
                    <p className="italic text-[9px] text-slate-700">
                      {kalenderPendidikan.catatanKaki}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 5: MASTER DATA DEWAN ASATIDZ (EMIS STYLE MULTI-TAB MODAL) */}
      {activeTab === 'ustadz' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Master Data Dewan Asatidz / Ustadzah (Format EMIS)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Kelola biodata ustadz, nama Arab (untuk Kop Soal), tugas utama/tambahan, dan status kepegawaian.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
                {(['Aktif', 'Nonaktif', 'Semua'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setUstadzStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      ustadzStatusFilter === st
                        ? 'bg-emerald-800 text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCreatingUstadz(true);
                  setUstadzModalTab('data');
                  setDetailUstadz({
                    id: '',
                    nip: `2026.01.0${ustadzList.length + 1}`,
                    nik: '',
                    nama: '',
                    namaArab: '',
                    gender: 'L',
                    tempatLahir: 'Pekalongan',
                    tanggalLahir: '1995-01-01',
                    statusAktif: 'Aktif',
                    jabatanUtama: 'Guru Madrasah Diniyah',
                    statusKepegawaian: 'Tetap Yayasan',
                    tmtMulai: new Date().toISOString().substring(0, 10),
                    pendidikanFormal: 'S1 Pendidikan Agama Islam',
                    pendidikanPesantren: 'PP. NU Darussalam',
                    fanIlmu: ['Fiqih'],
                    noHP: '',
                    alamat: 'Karangdadap, Pekalongan',
                    honorPokok: 2000000,
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Ustadz</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                  <th className="py-2.5 px-3">NIP</th>
                  <th className="py-2.5 px-3">Nama Ustadz & Nama Arab</th>
                  <th className="py-2.5 px-3">Jabatan Utama</th>
                  <th className="py-2.5 px-3">Kepegawaian</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ustadzList
                  .filter(
                    (u) => ustadzStatusFilter === 'Semua' || u.statusAktif === ustadzStatusFilter
                  )
                  .map((ust) => (
                    <tr key={ust.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold tabular-nums text-emerald-800">
                        {ust.nip}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900">{ust.nama}</span>
                        <span className="block font-arabic text-sm text-emerald-800">
                          {ust.namaArab}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{ust.jabatanUtama}</td>
                      <td className="py-2.5 px-3 text-slate-600">{ust.statusKepegawaian}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ust.statusAktif === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {ust.statusAktif}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingUstadz(false);
                              setUstadzModalTab('data');
                              setDetailUstadz(ust);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 font-bold transition"
                          >
                            Detail / Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteUstadz(ust.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Multi-Tab Detail Ustadz Modal (EMIS Format) */}
      {detailUstadz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleSaveUstadzModal}
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {isCreatingUstadz ? 'Tambah Data Ustadz Baru' : `Detail Ustadz: ${detailUstadz.nama}`}
                </h3>
                <p className="text-xs text-slate-500">Format Profil GTK / EMIS Pesantren</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailUstadz(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
              {[
                { id: 'data', label: 'DATA USTADZ' },
                { id: 'utama', label: 'TUGAS UTAMA' },
                { id: 'tambahan', label: 'TUGAS TAMBAHAN' },
                { id: 'kepegawaian', label: 'KEPEGAWAIAN' },
                { id: 'pendidikan', label: 'PENDIDIKAN' },
              ].map((tb) => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setUstadzModalTab(tb.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                    ustadzModalTab === tb.id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {ustadzModalTab === 'data' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Nama Lengkap (Latin)</label>
                  <input
                    type="text"
                    required
                    value={detailUstadz.nama}
                    onChange={(e) => setDetailUstadz({ ...detailUstadz, nama: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nama dalam Tulisan Arab (Kop Soal)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailUstadz.namaArab}
                    onChange={(e) => setDetailUstadz({ ...detailUstadz, namaArab: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-arabic text-base text-right"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    value={detailUstadz.nik}
                    onChange={(e) => setDetailUstadz({ ...detailUstadz, nik: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">NIP Pondok</label>
                  <input
                    type="text"
                    value={detailUstadz.nip}
                    onChange={(e) => setDetailUstadz({ ...detailUstadz, nip: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tempat & Tanggal Lahir</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={detailUstadz.tempatLahir}
                      onChange={(e) =>
                        setDetailUstadz({ ...detailUstadz, tempatLahir: e.target.value })
                      }
                      className="w-1/2 rounded-xl border border-slate-300 p-2"
                    />
                    <input
                      type="date"
                      value={detailUstadz.tanggalLahir}
                      onChange={(e) =>
                        setDetailUstadz({ ...detailUstadz, tanggalLahir: e.target.value })
                      }
                      className="w-1/2 rounded-xl border border-slate-300 p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={detailUstadz.noHP}
                    onChange={(e) => setDetailUstadz({ ...detailUstadz, noHP: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Alamat Domisili</label>
                  <input
                    type="text"
                    value={detailUstadz.alamat}
                    onChange={(e) => setDetailUstadz({ ...detailUstadz, alamat: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
              </div>
            )}

            {ustadzModalTab === 'utama' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Jabatan / Tugas Mengajar Utama</label>
                  <input
                    type="text"
                    value={detailUstadz.jabatanUtama}
                    onChange={(e) =>
                      setDetailUstadz({ ...detailUstadz, jabatanUtama: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Fan Ilmu / Kitab Diampu (pisahkan koma)</label>
                  <input
                    type="text"
                    value={detailUstadz.fanIlmu.join(', ')}
                    onChange={(e) =>
                      setDetailUstadz({
                        ...detailUstadz,
                        fanIlmu: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
              </div>
            )}

            {ustadzModalTab === 'tambahan' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Tugas Tambahan Satminkal (Internal Pondok)</label>
                  <input
                    type="text"
                    value={detailUstadz.tugasTambahanSatminkal || ''}
                    onChange={(e) =>
                      setDetailUstadz({
                        ...detailUstadz,
                        tugasTambahanSatminkal: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tugas Tambahan Non-Satminkal</label>
                  <input
                    type="text"
                    value={detailUstadz.tugasTambahanNonSatminkal || ''}
                    onChange={(e) =>
                      setDetailUstadz({
                        ...detailUstadz,
                        tugasTambahanNonSatminkal: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
              </div>
            )}

            {ustadzModalTab === 'kepegawaian' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Status Kepegawaian</label>
                  <select
                    value={detailUstadz.statusKepegawaian}
                    onChange={(e) =>
                      setDetailUstadz({
                        ...detailUstadz,
                        statusKepegawaian: e.target.value as UstadzRecord['statusKepegawaian'],
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  >
                    <option value="Tetap Yayasan">Tetap Yayasan</option>
                    <option value="Khidmah">Khidmah</option>
                    <option value="Honorer">Honorer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Status Aktif</label>
                  <select
                    value={detailUstadz.statusAktif}
                    onChange={(e) =>
                      setDetailUstadz({
                        ...detailUstadz,
                        statusAktif: e.target.value as 'Aktif' | 'Nonaktif',
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">TMT Mulai Mengabdi</label>
                  <input
                    type="date"
                    value={detailUstadz.tmtMulai}
                    onChange={(e) =>
                      setDetailUstadz({ ...detailUstadz, tmtMulai: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Bisyaroh / Honor Pokok (Rp)</label>
                  <input
                    type="number"
                    value={detailUstadz.honorPokok}
                    onChange={(e) =>
                      setDetailUstadz({
                        ...detailUstadz,
                        honorPokok: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
              </div>
            )}

            {ustadzModalTab === 'pendidikan' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Pendidikan Formal Terakhir</label>
                  <input
                    type="text"
                    value={detailUstadz.pendidikanFormal}
                    onChange={(e) =>
                      setDetailUstadz({ ...detailUstadz, pendidikanFormal: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Sanad Pendidikan Pesantren</label>
                  <input
                    type="text"
                    value={detailUstadz.pendidikanPesantren}
                    onChange={(e) =>
                      setDetailUstadz({ ...detailUstadz, pendidikanPesantren: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDetailUstadz(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs"
              >
                Simpan Data Asatidz
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Modal Kamera Selfie + Google Timestamp & GPS */}
      {selfieTargetUstadz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 no-print">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-700" />
                  <span>Absensi Selfie Timestamp — {selfieTargetUstadz.nama}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Program: <strong>{selectedProgram}</strong> · Foto otomatis ditempeli waktu &amp; koordinat GPS pondok.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopSelfieCamera();
                  setSelfieTargetUstadz(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center">
              {capturedSelfieUrl ? (
                <img
                  src={capturedSelfieUrl}
                  alt="Preview Selfie Timestamp"
                  className="w-full h-full object-cover"
                />
              ) : cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Live Timestamp Overlay Preview */}
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 text-white p-3 border-l-4 border-emerald-500 text-[11px] space-y-0.5">
                    <p className="font-bold text-amber-300">
                      {new Date().toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      · {new Date().toTimeString().substring(0, 5)} WIB
                    </p>
                    <p className="font-bold">
                      {selfieTargetUstadz.nama} · {selectedProgram}
                    </p>
                    <p className="font-mono text-emerald-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>
                        GPS: {gpsCoords.lat.toFixed(5)}, {gpsCoords.lng.toFixed(5)}
                        {gpsCoords.fallback ? ' (PP NU Darussalam)' : ''}
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-slate-300 text-xs space-y-2">
                  <Camera className="w-10 h-10 mx-auto text-slate-500" />
                  <p>{cameraError || 'Menghubungkan kamera depan...'}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unggah / Kamera HP</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleUploadSelfieFile}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2">
                {!capturedSelfieUrl ? (
                  cameraActive && (
                    <button
                      type="button"
                      onClick={handleCaptureFromVideo}
                      className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Ambil Foto &amp; Stamp GPS</span>
                    </button>
                  )
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setCapturedSelfieUrl('')}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ulangi Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmSelfieAttendance}
                      className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simpan Presensi Hadir</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lightbox Bukti Foto Selfie */}
      {lightboxRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 no-print"
          onClick={() => setLightboxRecord(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{lightboxRecord.ustadzNama}</h4>
                <p className="text-[11px] text-emerald-800 font-semibold">
                  {lightboxRecord.program || 'Madrasah Diniyah'} · {lightboxRecord.tanggal} (
                  {lightboxRecord.waktuInput})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {lightboxRecord.fotoSelfieUrl && (
              <img
                src={lightboxRecord.fotoSelfieUrl}
                alt={lightboxRecord.ustadzNama}
                className="w-full rounded-2xl border border-slate-200 object-cover"
              />
            )}
            <div className="text-[11px] text-slate-600 flex items-center justify-between">
              <span>{lightboxRecord.lokasiLabel || 'PP NU Darussalam Karangdadap'}</span>
              <span className="font-mono font-bold text-slate-800">{lightboxRecord.koordinat}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
