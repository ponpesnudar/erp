import React, { useState } from 'react';
import {
  Users2,
  ZoomIn,
  ZoomOut,
  Printer,
  Search,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import type { JabatanOrganisasi, AgendaKegiatanItem } from '../../data/seed/pondokData.ts';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-emerald-700" />
            <span>Kema'hadiyahan & Bagan Kepanitiaan Pesantren</span>
          </h2>
          <p className="text-xs text-slate-500">
            Struktur organisasi bertingkat interaktif (klik kartu jabatan untuk edit) dan agenda acara PHBI/PHBN.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('bagan')}
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
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
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

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 shadow-xs overflow-x-auto min-h-[480px] printable-area">
            <div
              className="flex flex-col items-center space-y-10 transition-transform origin-top"
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

      {/* TAB 2: AGENDA PHBI & PHBN (CRUD STORE) */}
      {activeTab === 'agenda' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Agenda Kegiatan PHBI & PHBN Pondok Pesantren
              </h3>
              <p className="text-xs text-slate-500">
                Jadwal kegiatan kepanitiaan asrama putra dan putri.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAgendaModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Agenda</span>
            </button>
          </div>

          <div className="space-y-3">
            {agendaKegiatan.map((ag) => (
              <div
                key={ag.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <select
                      value={ag.status}
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
                    <span className="text-[11px] text-slate-500">{ag.lokasi}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{ag.nama}</h4>
                  <p className="text-xs text-slate-500">
                    Pelaksanaan: <strong>{ag.tanggal}</strong> · Ketua Panitia: {ag.ketuaPanitia}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Rencana Anggaran:</span>
                    <p className="font-extrabold text-sm text-emerald-800 tabular-nums">
                      Rp {ag.anggaran.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAgendaKegiatan(ag.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
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
