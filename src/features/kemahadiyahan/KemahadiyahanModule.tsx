import React, { useState } from 'react';
import {
  Users2,
  ZoomIn,
  ZoomOut,
  Printer,
  Search,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Calendar,
  MapPin,
  UserCheck,
  Wallet,
  Clock,
  ClipboardList,
  FileText,
  FileCheck2,
  FolderOpen,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { triggerReliablePrint } from '../../lib/printHelper.ts';
import { PrintOrientationControl } from '../../components/common/PrintOrientationControl.tsx';
import { PrintKopPondok } from '../../components/common/PrintKopPondok.tsx';
import type {
  JabatanOrganisasi,
  AgendaKegiatanItem,
  AgendaPanitiaMember,
  AgendaRabItem,
  AgendaRundownItem,
  AgendaProposalData,
  AgendaLpjData,
} from '../../data/seed/pondokData.ts';

type AgendaDetailTab = 'panitia' | 'rab' | 'rundown' | 'tupoksi' | 'proposal' | 'lpj';

export const KemahadiyahanModule: React.FC = () => {
  const {
    baganOrganisasi,
    addBaganNode,
    updateBaganNode,
    deleteBaganNode,
    agendaKegiatan,
    addAgendaKegiatan,
    updateAgendaKegiatan,
    deleteAgendaKegiatan,
    syncAgendaFromKalender,
    printOrientation,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'bagan' | 'agenda'>('bagan');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showPemangku, setShowPemangku] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState('');

  // Bagan Node Modal
  const [editingNode, setEditingNode] = useState<JabatanOrganisasi | null>(null);
  const [isNewNode, setIsNewNode] = useState(false);

  // Unassigned Panitia pool
  const [unassignedPool, setUnassignedPool] = useState<string[]>([
    'Seksi Perlengkapan PHBI',
    'Seksi Konsumsi Acara',
    'Koordinator Keamanan Malam',
    'Pengawas Ruang Imtihan',
    'Seksi Publikasi & Dokumentasi',
    'Seksi Penerima Tamu Kiai',
  ]);

  // Agenda Form
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [agNama, setAgNama] = useState('');
  const [agTanggal, setAgTanggal] = useState(new Date().toISOString().substring(0, 10));
  const [agLokasi, setAgLokasi] = useState('Halaman Utama PP NU Darussalam');
  const [agKetua, setAgKetua] = useState('Ust. Khoirul Umam');
  const [agAnggaran, setAgAnggaran] = useState(5000000);
  const [agStatus, setAgStatus] = useState<AgendaKegiatanItem['status']>('Persiapan');

  // Detail Agenda Workspace
  const [selectedAgendaId, setSelectedAgendaId] = useState<string | null>(null);
  const [agendaDetailTab, setAgendaDetailTab] = useState<AgendaDetailTab>('panitia');

  // Quick-add states inside Detail Workspace
  const [panJabatan, setPanJabatan] = useState('');
  const [panNama, setPanNama] = useState('');
  const [panTupoksi, setPanTupoksi] = useState('');

  const [rabUraian, setRabUraian] = useState('');
  const [rabQty, setRabQty] = useState(1);
  const [rabSatuan, setRabSatuan] = useState('Paket');
  const [rabHarga, setRabHarga] = useState(100000);

  const [rndWaktu, setRndWaktu] = useState('08.00 - 09.30');
  const [rndSesi, setRndSesi] = useState('');
  const [rndPj, setRndPj] = useState('');
  const [rndLokasi, setRndLokasi] = useState('Halaman Utama');

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const filteredJabatan = baganOrganisasi.filter(
    (j) =>
      j.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.pemangku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.divisi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rootNodes = filteredJabatan.filter((j) => !j.parentId);
  const level2Nodes = filteredJabatan.filter((j) => j.tingkat === 2);
  const level3Nodes = filteredJabatan.filter((j) => j.tingkat >= 3);

  const selectedAgenda = agendaKegiatan.find((a) => a.id === selectedAgendaId) || null;

  const openNewNodeModal = (prefillName = '') => {
    setIsNewNode(true);
    setEditingNode({
      id: '',
      kode: `J-${baganOrganisasi.length + 1}`,
      nama: prefillName,
      tingkat: 3,
      parentId: 'org-1',
      pemangku: 'Belum Ditunjuk',
      divisi: "Kema'hadiyahan",
      status: 'Aktif',
    });
  };

  const handleSaveNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNode || !editingNode.nama.trim()) return;
    if (isNewNode) {
      const { id: _id, ...rest } = editingNode;
      addBaganNode(rest);
      setUnassignedPool((prev) => prev.filter((p) => p !== editingNode.nama));
      notify(`Jabatan "${editingNode.nama}" ditambahkan ke bagan.`);
    } else {
      updateBaganNode(editingNode.id, editingNode);
      notify(`Jabatan "${editingNode.nama}" diperbarui.`);
    }
    setEditingNode(null);
  };

  const handleSyncKalender = () => {
    const addedCount = syncAgendaFromKalender();
    if (addedCount > 0) {
      notify(`${addedCount} agenda baru berhasil disinkronkan dari Kalender Pendidikan Ma'arifan.`);
    } else {
      notify('Semua agenda dari Kalender Pendidikan Ma\'arifan sudah tersinkronisasi.');
    }
  };

  // --- Detail Agenda Mutators ---
  const handleAddPanitia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgenda || !panJabatan.trim() || !panNama.trim()) return;
    const currentList = selectedAgenda.panitiaList || [];
    const newItem: AgendaPanitiaMember = {
      id: `pan-${Date.now()}`,
      jabatan: panJabatan.trim(),
      nama: panNama.trim(),
      tugasTupoksi: panTupoksi.trim() || 'Membantu kelancaran pelaksanaan agenda sesuai arahan Ketua Panitia.',
    };
    updateAgendaKegiatan(selectedAgenda.id, {
      panitiaList: [...currentList, newItem],
    });
    setPanJabatan('');
    setPanNama('');
    setPanTupoksi('');
    notify('Anggota panitia berhasil ditambahkan.');
  };

  const handleUpdatePanitiaTupoksi = (panId: string, tugasTupoksi: string) => {
    if (!selectedAgenda) return;
    const updated = (selectedAgenda.panitiaList || []).map((p) =>
      p.id === panId ? { ...p, tugasTupoksi } : p
    );
    updateAgendaKegiatan(selectedAgenda.id, { panitiaList: updated });
  };

  const handleDeletePanitia = (panId: string) => {
    if (!selectedAgenda) return;
    updateAgendaKegiatan(selectedAgenda.id, {
      panitiaList: (selectedAgenda.panitiaList || []).filter((p) => p.id !== panId),
    });
    notify('Anggota panitia dihapus.');
  };

  const handleAddRabItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgenda || !rabUraian.trim()) return;
    const currentRab = selectedAgenda.rabItems || [];
    const newItem: AgendaRabItem = {
      id: `arab-${Date.now()}`,
      uraian: rabUraian.trim(),
      qty: Math.max(1, rabQty),
      satuan: rabSatuan.trim() || 'Unit',
      hargaSatuan: Math.max(0, rabHarga),
    };
    const nextRab = [...currentRab, newItem];
    const totalAnggaran = nextRab.reduce((acc, r) => acc + r.qty * r.hargaSatuan, 0);
    updateAgendaKegiatan(selectedAgenda.id, {
      rabItems: nextRab,
      anggaran: totalAnggaran,
    });
    setRabUraian('');
    setRabQty(1);
    setRabSatuan('Paket');
    setRabHarga(100000);
    notify('Item RAB ditambahkan dan total anggaran diperbarui.');
  };

  const handleDeleteRabItem = (rabId: string) => {
    if (!selectedAgenda) return;
    const nextRab = (selectedAgenda.rabItems || []).filter((r) => r.id !== rabId);
    const totalAnggaran = nextRab.reduce((acc, r) => acc + r.qty * r.hargaSatuan, 0);
    updateAgendaKegiatan(selectedAgenda.id, {
      rabItems: nextRab,
      anggaran: totalAnggaran,
    });
    notify('Item RAB dihapus.');
  };

  const handleAddRundown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgenda || !rndSesi.trim()) return;
    const currentRundown = selectedAgenda.rundownList || [];
    const newItem: AgendaRundownItem = {
      id: `rnd-${Date.now()}`,
      waktu: rndWaktu.trim() || '-',
      sesi: rndSesi.trim(),
      penanggungJawab: rndPj.trim() || selectedAgenda.ketuaPanitia,
      lokasi: rndLokasi.trim() || selectedAgenda.lokasi,
    };
    updateAgendaKegiatan(selectedAgenda.id, {
      rundownList: [...currentRundown, newItem],
    });
    setRndSesi('');
    setRndPj('');
    notify('Sesi rundown acara ditambahkan.');
  };

  const handleDeleteRundown = (rndId: string) => {
    if (!selectedAgenda) return;
    updateAgendaKegiatan(selectedAgenda.id, {
      rundownList: (selectedAgenda.rundownList || []).filter((r) => r.id !== rndId),
    });
    notify('Sesi rundown dihapus.');
  };

  const handleSaveProposal = (patch: Partial<AgendaProposalData>) => {
    if (!selectedAgenda) return;
    const prev: AgendaProposalData = selectedAgenda.proposal || {
      latarBelakang: '',
      tujuan: '',
      status: 'Draf',
    };
    updateAgendaKegiatan(selectedAgenda.id, {
      proposal: { ...prev, ...patch },
    });
  };

  const handleSaveLpj = (patch: Partial<AgendaLpjData>) => {
    if (!selectedAgenda) return;
    const prev: AgendaLpjData = selectedAgenda.lpj || {
      ringkasanHasil: '',
      totalRealisasi: selectedAgenda.anggaran,
      kendala: '',
      status: 'Belum Disusun',
    };
    updateAgendaKegiatan(selectedAgenda.id, {
      lpj: { ...prev, ...patch },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-emerald-700" />
            <span>Kema'hadiyahan & Bagan Kepanitiaan Pesantren</span>
          </h2>
          <p className="text-xs text-slate-500">
            Struktur organisasi bertingkat interaktif (klik kartu jabatan untuk edit) dan manajemen detail agenda PHBI/PHBN.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setActiveTab('bagan');
              setSelectedAgendaId(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'bagan'
                ? 'bg-emerald-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Bagan Jabatan Bertingkat
          </button>
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'agenda'
                ? 'bg-emerald-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Agenda Acara PHBI / PHBN ({agendaKegiatan.length})
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* TAB 1: BAGAN JABATAN */}
      {activeTab === 'bagan' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 flex-1 max-w-sm border border-slate-200 rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari jabatan atau nama pemangku..."
                className="w-full bg-transparent border-none text-xs focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                  className="p-1 hover:text-emerald-800"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold tabular-nums px-1.5">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1 hover:text-emerald-800"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer px-2">
                <input
                  type="checkbox"
                  checked={showPemangku}
                  onChange={(e) => setShowPemangku(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span>Pemangku</span>
              </label>

              <button
                type="button"
                onClick={() => openNewNodeModal()}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jabatan</span>
              </button>

              <PrintOrientationControl recommended="landscape" compact />

              <button
                type="button"
                onClick={() =>
                  triggerReliablePrint({
                    title: 'Struktur Organisasi & Bagan Kepanitiaan',
                    orientation: printOrientation,
                    paperSize: 'F4',
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 shadow-xs overflow-x-auto min-h-[480px] printable-area">
            <PrintKopPondok
              judulDokumen="STRUKTUR ORGANISASI & KEPANITIAAN RESMI"
              subJudul="Bidang Kema'hadiyahan, PHBI & Kepengurusan Pondok Pesantren"
            />
            <div
              className="flex flex-col items-center space-y-10 transition-transform origin-top print-no-scale"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* Level 1 */}
              {rootNodes.map((root) => (
                <div key={root.id} className="flex flex-col items-center">
                  <div
                    onClick={() => {
                      setIsNewNode(false);
                      setEditingNode(root);
                    }}
                    className="w-64 p-4 rounded-2xl bg-emerald-900 text-white shadow-lg border-2 border-emerald-700 text-center space-y-1 cursor-pointer hover:ring-2 hover:ring-amber-400 transition"
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                      {root.divisi}
                    </span>
                    <h4 className="font-extrabold text-sm">{root.nama}</h4>
                    {showPemangku && (
                      <p className="text-xs font-semibold text-emerald-200 pt-1 border-t border-emerald-800">
                        {root.pemangku}
                      </p>
                    )}
                  </div>
                  <div className="w-0.5 h-8 bg-emerald-700" />
                </div>
              ))}

              {/* Level 2 */}
              <div className="w-full max-w-5xl border-t-2 border-emerald-700 flex flex-wrap justify-center gap-4 relative pt-6">
                {level2Nodes.map((l2) => (
                  <div
                    key={l2.id}
                    onClick={() => {
                      setIsNewNode(false);
                      setEditingNode(l2);
                    }}
                    className="w-44 p-3.5 rounded-2xl bg-white border-2 border-emerald-800/80 shadow-md text-center space-y-1 cursor-pointer hover:border-emerald-600 transition"
                  >
                    <span className="text-[9px] uppercase font-bold text-slate-500">
                      {l2.divisi}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">{l2.nama}</h4>
                    {showPemangku && (
                      <p className="text-[11px] font-bold text-emerald-800 pt-1 border-t border-slate-100">
                        {l2.pemangku}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Level 3+ */}
              <div className="w-full max-w-5xl border-t-2 border-slate-300 flex flex-wrap justify-center gap-4 pt-6">
                {level3Nodes.map((l3) => (
                  <div
                    key={l3.id}
                    onClick={() => {
                      setIsNewNode(false);
                      setEditingNode(l3);
                    }}
                    className="w-44 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1 cursor-pointer hover:border-emerald-600 transition"
                  >
                    <span className="text-[9px] font-bold text-slate-400">{l3.divisi}</span>
                    <h5 className="font-bold text-xs text-slate-800 leading-tight">{l3.nama}</h5>
                    {showPemangku && (
                      <p className="text-[11px] font-semibold text-emerald-800 pt-1 border-t border-slate-100">
                        {l3.pemangku}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Drawer: "Belum Tersusun" */}
          {unassignedPool.length > 0 && (
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-2 no-print">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800">
                  Belum Tersusun ({unassignedPool.length} Jabatan Panitia)
                </h4>
                <span className="text-[10px] text-slate-400">
                  Klik kartu untuk menetapkan pemangku & memasukkan ke bagan resmi
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {unassignedPool.map((pos, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => openNewNodeModal(pos)}
                    className="px-3 py-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-[11px] font-semibold text-slate-700 shrink-0 hover:border-emerald-600 hover:bg-emerald-50"
                  >
                    + {pos}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2A: LIST AGENDA PHBI & PHBN */}
      {activeTab === 'agenda' && !selectedAgenda && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Agenda Kegiatan PHBI & PHBN Pondok Pesantren
              </h3>
              <p className="text-xs text-slate-500">
                Klik agenda untuk mengelola Struktur Panitia, RAB, Rundown, Tupoksi, Pengajuan Proposal, dan LPJ.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSyncKalender}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                <span>Sinkron dari Kalender Pendidikan</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAgendaModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Agenda</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {agendaKegiatan.map((ag) => (
              <div
                key={ag.id}
                onClick={() => {
                  setSelectedAgendaId(ag.id);
                  setAgendaDetailTab('panitia');
                }}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={ag.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateAgendaKegiatan(ag.id, {
                          status: e.target.value as AgendaKegiatanItem['status'],
                        })
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        ag.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : ag.status === 'Berjalan'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      <option value="Persiapan">Persiapan</option>
                      <option value="Berjalan">Berjalan</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {ag.lokasi}
                    </span>
                    {ag.sumberKalenderKode && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Kalender: {ag.sumberKalenderKode}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{ag.nama}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <strong>{ag.tanggal}</strong>
                    </span>
                    <span>Ketua Panitia: {ag.ketuaPanitia}</span>
                    <span>
                      {(ag.panitiaList || []).length} Panitia · {(ag.rabItems || []).length} Pos RAB ·{' '}
                      {(ag.rundownList || []).length} Sesi
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Rencana Anggaran:</span>
                    <p className="font-extrabold text-sm text-emerald-800 tabular-nums">
                      Rp {ag.anggaran.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAgendaId(ag.id);
                      setAgendaDetailTab('panitia');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Kelola Detail</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAgendaKegiatan(ag.id);
                      notify(`Agenda "${ag.nama}" dihapus.`);
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    title="Hapus Agenda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2B: WORKSPACE DETAIL AGENDA */}
      {activeTab === 'agenda' && selectedAgenda && (
        <div className="space-y-4">
          {/* Toolbar Detail Agenda */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
            <button
              type="button"
              onClick={() => setSelectedAgendaId(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Daftar Agenda</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <PrintOrientationControl recommended="portrait" compact />
              <button
                type="button"
                onClick={() =>
                  triggerReliablePrint({
                    title: `Dokumen Agenda - ${selectedAgenda.nama}`,
                    orientation: printOrientation,
                    paperSize: 'F4',
                  })
                }
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Detail Agenda</span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5 printable-area">
            <PrintKopPondok
              judulDokumen={`DOKUMEN PERENCANAAN & KEPANITIAAN — ${selectedAgenda.nama}`}
              subJudul={`Tanggal: ${selectedAgenda.tanggal} · Lokasi: ${selectedAgenda.lokasi} · Ketua: ${selectedAgenda.ketuaPanitia}`}
            />
            {/* Kop & Identitas Agenda */}
            <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Dokumen Perencanaan & Kepanitiaan Event Pondok Pesantren NU Darussalam
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedAgenda.nama}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span>
                    Tanggal: <strong>{selectedAgenda.tanggal}</strong>
                  </span>
                  <span>
                    Lokasi: <strong>{selectedAgenda.lokasi}</strong>
                  </span>
                  <span>
                    Ketua Panitia: <strong>{selectedAgenda.ketuaPanitia}</strong>
                  </span>
                </div>
              </div>
              <div className="sm:text-right shrink-0 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Total Anggaran RAB
                </span>
                <p className="text-lg font-extrabold text-emerald-800 tabular-nums">
                  Rp {selectedAgenda.anggaran.toLocaleString('id-ID')}
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Status: {selectedAgenda.status}
                </span>
              </div>
            </div>

            {/* 6 Sub-Menu Navigasi Workspace */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3 no-print">
              {(
                [
                  { id: 'panitia', label: 'Struktur Panitia', icon: UserCheck },
                  { id: 'rab', label: 'Anggaran (RAB)', icon: Wallet },
                  { id: 'rundown', label: 'Rundown Acara', icon: Clock },
                  { id: 'tupoksi', label: 'Tupoksi Panitia', icon: ClipboardList },
                  { id: 'proposal', label: 'Pengajuan Proposal', icon: FileText },
                  { id: 'lpj', label: 'LPJ Kegiatan', icon: FileCheck2 },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAgendaDetailTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      agendaDetailTab === tab.id
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB-TAB 1: STRUKTUR PANITIA */}
            {agendaDetailTab === 'panitia' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleAddPanitia}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 no-print"
                >
                  <input
                    type="text"
                    required
                    placeholder="Jabatan (mis: Seksi Konsumsi)"
                    value={panJabatan}
                    onChange={(e) => setPanJabatan(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nama Pengurus / Ustadz"
                    value={panNama}
                    onChange={(e) => setPanNama(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Ringkasan Tugas / Tupoksi"
                    value={panTupoksi}
                    onChange={(e) => setPanTupoksi(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Panitia</span>
                  </button>
                </form>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5 w-10">No</th>
                        <th className="px-4 py-2.5">Jabatan Kepanitiaan</th>
                        <th className="px-4 py-2.5">Nama Penanggung Jawab</th>
                        <th className="px-4 py-2.5">Ringkasan Tugas</th>
                        <th className="px-4 py-2.5 w-14 text-center no-print">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedAgenda.panitiaList || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                            Belum ada susunan panitia. Silakan tambahkan anggota panitia di atas.
                          </td>
                        </tr>
                      ) : (
                        (selectedAgenda.panitiaList || []).map((p, idx) => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-bold text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-2.5 font-bold text-emerald-900">{p.jabatan}</td>
                            <td className="px-4 py-2.5 font-semibold text-slate-800">{p.nama}</td>
                            <td className="px-4 py-2.5 text-slate-600">{p.tugasTupoksi}</td>
                            <td className="px-4 py-2.5 text-center no-print">
                              <button
                                type="button"
                                onClick={() => handleDeletePanitia(p.id)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: ANGGARAN / RAB */}
            {agendaDetailTab === 'rab' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleAddRabItem}
                  className="grid grid-cols-1 md:grid-cols-6 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 no-print"
                >
                  <input
                    type="text"
                    required
                    placeholder="Uraian Kebutuhan / Belanja"
                    value={rabUraian}
                    onChange={(e) => setRabUraian(e.target.value)}
                    className="md:col-span-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="Qty"
                    value={rabQty}
                    onChange={(e) => setRabQty(parseInt(e.target.value) || 1)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Satuan"
                    value={rabSatuan}
                    onChange={(e) => setRabSatuan(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <input
                    type="number"
                    min={0}
                    required
                    placeholder="Harga Satuan (Rp)"
                    value={rabHarga}
                    onChange={(e) => setRabHarga(parseInt(e.target.value) || 0)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Pos</span>
                  </button>
                </form>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5 w-10">No</th>
                        <th className="px-4 py-2.5">Uraian Anggaran (RAB)</th>
                        <th className="px-4 py-2.5 text-center">Volume</th>
                        <th className="px-4 py-2.5 text-right">Harga Satuan</th>
                        <th className="px-4 py-2.5 text-right">Subtotal</th>
                        <th className="px-4 py-2.5 w-14 text-center no-print">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedAgenda.rabItems || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                            Belum ada rincian item RAB. Tambahkan pos biaya untuk menghitung total anggaran otomatis.
                          </td>
                        </tr>
                      ) : (
                        (selectedAgenda.rabItems || []).map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-bold text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-2.5 font-semibold text-slate-800">{item.uraian}</td>
                            <td className="px-4 py-2.5 text-center tabular-nums">
                              {item.qty} {item.satuan}
                            </td>
                            <td className="px-4 py-2.5 text-right tabular-nums">
                              Rp {item.hargaSatuan.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-2.5 text-right font-bold text-emerald-800 tabular-nums">
                              Rp {(item.qty * item.hargaSatuan).toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-2.5 text-center no-print">
                              <button
                                type="button"
                                onClick={() => handleDeleteRabItem(item.id)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="bg-emerald-50 border-t-2 border-emerald-200 font-extrabold text-emerald-950">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right">
                          TOTAL RENCANA ANGGARAN BIAYA (RAB):
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          Rp {selectedAgenda.anggaran.toLocaleString('id-ID')}
                        </td>
                        <td className="no-print" />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: RUNDOWN ACARA */}
            {agendaDetailTab === 'rundown' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleAddRundown}
                  className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 no-print"
                >
                  <input
                    type="text"
                    required
                    placeholder="Waktu (mis: 08.00 - 09.30)"
                    value={rndWaktu}
                    onChange={(e) => setRndWaktu(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nama Sesi / Mata Acara"
                    value={rndSesi}
                    onChange={(e) => setRndSesi(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Penanggung Jawab"
                    value={rndPj}
                    onChange={(e) => setRndPj(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Lokasi"
                    value={rndLokasi}
                    onChange={(e) => setRndLokasi(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Sesi</span>
                  </button>
                </form>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5 w-10">No</th>
                        <th className="px-4 py-2.5">Waktu / Jam</th>
                        <th className="px-4 py-2.5">Susunan Acara / Sesi</th>
                        <th className="px-4 py-2.5">Penanggung Jawab</th>
                        <th className="px-4 py-2.5">Lokasi</th>
                        <th className="px-4 py-2.5 w-14 text-center no-print">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedAgenda.rundownList || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                            Belum ada susunan rundown acara. Silakan tambahkan sesi kegiatan di atas.
                          </td>
                        </tr>
                      ) : (
                        (selectedAgenda.rundownList || []).map((r, idx) => (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-bold text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-2.5 font-bold text-emerald-800 whitespace-nowrap">
                              {r.waktu}
                            </td>
                            <td className="px-4 py-2.5 font-semibold text-slate-900">{r.sesi}</td>
                            <td className="px-4 py-2.5 text-slate-700">{r.penanggungJawab}</td>
                            <td className="px-4 py-2.5 text-slate-500">{r.lokasi}</td>
                            <td className="px-4 py-2.5 text-center no-print">
                              <button
                                type="button"
                                onClick={() => handleDeleteRundown(r.id)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: TUPOKSI PANITIA */}
            {agendaDetailTab === 'tupoksi' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Uraian Tugas Pokok & Fungsi (Tupoksi) masing-masing bidang kepanitiaan untuk koordinasi pelaksanaan acara.
                </p>
                {(selectedAgenda.panitiaList || []).length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                    Tambahkan anggota di tab <strong>Struktur Panitia</strong> terlebih dahulu untuk mengatur tupoksi per bidang.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(selectedAgenda.panitiaList || []).map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-800 text-white text-[11px] font-bold">
                            {p.jabatan}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{p.nama}</span>
                        </div>
                        <textarea
                          rows={3}
                          value={p.tugasTupoksi}
                          onChange={(e) => handleUpdatePanitiaTupoksi(p.id, e.target.value)}
                          placeholder="Tulis rincian tugas pokok dan fungsi..."
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 5: PENGAJUAN PROPOSAL */}
            {agendaDetailTab === 'proposal' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Status Pengajuan Proposal ke Pengasuh / Yayasan</h4>
                    <p className="text-[11px] text-slate-500">
                      Tentukan status persetujuan proposal resmi kegiatan ini.
                    </p>
                  </div>
                  <select
                    value={selectedAgenda.proposal?.status || 'Draf'}
                    onChange={(e) =>
                      handleSaveProposal({
                        status: e.target.value as AgendaProposalData['status'],
                      })
                    }
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-emerald-900"
                  >
                    <option value="Draf">Draf Penyusunan</option>
                    <option value="Diajukan">Diajukan ke Pengasuh</option>
                    <option value="Disetujui">Disetujui Pengasuh</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Latar Belakang & Dasar Pemikiran
                    </label>
                    <textarea
                      rows={5}
                      value={selectedAgenda.proposal?.latarBelakang || ''}
                      onChange={(e) => handleSaveProposal({ latarBelakang: e.target.value })}
                      placeholder="Tuliskan latar belakang pelaksanaan kegiatan..."
                      className="w-full rounded-2xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Tujuan & Target Capaian Kegiatan
                    </label>
                    <textarea
                      rows={5}
                      value={selectedAgenda.proposal?.tujuan || ''}
                      onChange={(e) => handleSaveProposal({ tujuan: e.target.value })}
                      placeholder="Tuliskan tujuan dan target manfaat bagi santri/pondok..."
                      className="w-full rounded-2xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end no-print">
                  <button
                    type="button"
                    onClick={() => notify('Data proposal kegiatan tersimpan.')}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
                  >
                    Simpan Pengajuan Proposal
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 6: LPJ KEGIATAN */}
            {agendaDetailTab === 'lpj' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Status Pengesahan LPJ
                    </label>
                    <select
                      value={selectedAgenda.lpj?.status || 'Belum Disusun'}
                      onChange={(e) =>
                        handleSaveLpj({
                          status: e.target.value as AgendaLpjData['status'],
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-emerald-900"
                    >
                      <option value="Belum Disusun">Belum Disusun</option>
                      <option value="Draf">Draf LPJ</option>
                      <option value="Disahkan">Disahkan Pengasuh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Total Realisasi Belanja (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedAgenda.lpj?.totalRealisasi ?? selectedAgenda.anggaran}
                      onChange={(e) =>
                        handleSaveLpj({
                          totalRealisasi: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-extrabold text-emerald-800 tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Ringkasan Hasil Pelaksanaan Acara
                    </label>
                    <textarea
                      rows={5}
                      value={selectedAgenda.lpj?.ringkasanHasil || ''}
                      onChange={(e) => handleSaveLpj({ ringkasanHasil: e.target.value })}
                      placeholder="Laporan jalannya acara, jumlah peserta, dan ketercapaian target..."
                      className="w-full rounded-2xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Kendala Lapangan & Evaluasi Perbaikan
                    </label>
                    <textarea
                      rows={5}
                      value={selectedAgenda.lpj?.kendala || ''}
                      onChange={(e) => handleSaveLpj({ kendala: e.target.value })}
                      placeholder="Catatan kendala teknis/non-teknis dan rekomendasi untuk kepanitiaan mendatang..."
                      className="w-full rounded-2xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end no-print">
                  <button
                    type="button"
                    onClick={() => notify('Laporan Pertanggungjawaban (LPJ) tersimpan.')}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
                  >
                    Simpan LPJ Kegiatan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Edit/Tambah Bagan Node */}
      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <form
            onSubmit={handleSaveNode}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                {isNewNode ? 'Tambah Jabatan Baru' : `Edit Jabatan: ${editingNode.nama}`}
              </h3>
              <button type="button" onClick={() => setEditingNode(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-bold mb-1">Nama Jabatan</label>
              <input
                type="text"
                required
                value={editingNode.nama}
                onChange={(e) => setEditingNode({ ...editingNode, nama: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Nama Pemangku</label>
              <input
                type="text"
                required
                value={editingNode.pemangku}
                onChange={(e) => setEditingNode({ ...editingNode, pemangku: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Divisi / Bagian</label>
                <input
                  type="text"
                  value={editingNode.divisi}
                  onChange={(e) => setEditingNode({ ...editingNode, divisi: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Tingkat Hirarki</label>
                <select
                  value={editingNode.tingkat}
                  onChange={(e) =>
                    setEditingNode({ ...editingNode, tingkat: parseInt(e.target.value) || 3 })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2"
                >
                  <option value={1}>Tingkat 1 (Pengasuh)</option>
                  <option value={2}>Tingkat 2 (Pimpinan Divisi)</option>
                  <option value={3}>Tingkat 3 (Seksi / Koordinator)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              {!isNewNode && editingNode.tingkat > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    deleteBaganNode(editingNode.id);
                    setEditingNode(null);
                    notify('Jabatan dihapus dari bagan.');
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold"
                >
                  Hapus Jabatan
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingNode(null)}
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
            </div>
          </form>
        </div>
      )}

      {/* Modal Tambah Agenda */}
      {showAgendaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!agNama.trim()) return;
              addAgendaKegiatan({
                nama: agNama,
                tanggal: agTanggal,
                lokasi: agLokasi,
                ketuaPanitia: agKetua,
                anggaran: agAnggaran,
                status: agStatus,
              });
              setShowAgendaModal(false);
              setAgNama('');
              notify('Agenda kegiatan baru ditambahkan.');
            }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900">Tambah Agenda PHBI / PHBN</h3>
            <div>
              <label className="block font-bold mb-1">Nama Kegiatan</label>
              <input
                type="text"
                required
                value={agNama}
                onChange={(e) => setAgNama(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Tanggal</label>
                <input
                  type="date"
                  value={agTanggal}
                  onChange={(e) => setAgTanggal(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Anggaran (Rp)</label>
                <input
                  type="number"
                  value={agAnggaran}
                  onChange={(e) => setAgAnggaran(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Ketua Panitia</label>
                <input
                  type="text"
                  value={agKetua}
                  onChange={(e) => setAgKetua(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Status</label>
                <select
                  value={agStatus}
                  onChange={(e) => setAgStatus(e.target.value as AgendaKegiatanItem['status'])}
                  className="w-full rounded-xl border border-slate-300 p-2"
                >
                  <option value="Persiapan">Persiapan</option>
                  <option value="Berjalan">Berjalan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1">Lokasi</label>
              <input
                type="text"
                value={agLokasi}
                onChange={(e) => setAgLokasi(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAgendaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Simpan Agenda
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
