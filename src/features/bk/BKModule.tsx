import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  Plus,
  BookOpen,
  Clock,
  Package,
  Upload,
  Trash2,
  Printer,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import type { JadwalKeamananItem, TitipanWaliRecord } from '../../data/seed/pondokData.ts';

export const BKModule: React.FC = () => {
  const {
    pelanggaranList,
    addPelanggaran,
    selesaikanPelanggaran,
    santriList,
    jadwalKeamanan,
    addJadwalKeamanan,
    deleteJadwalKeamanan,
    bukuTamu,
    addBukuTamu,
    titipanWali,
    addTitipanWali,
    updateStatusTitipanWali,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'pelanggaran' | 'buku_tamu' | 'jadwal_keamanan' | 'titipan_wali' | 'peraturan'
  >('pelanggaran');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showTamuModal, setShowTamuModal] = useState<boolean>(false);
  const [showTitipanModal, setShowTitipanModal] = useState<boolean>(false);

  // Pelanggaran Form
  const [selectedSantriId, setSelectedSantriId] = useState(santriList[0]?.id || 's-003');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState<'Ringan' | 'Sedang' | 'Berat'>('Ringan');
  const [poin, setPoin] = useState(5);
  const [takzir, setTakzir] = useState('');
  const [saksi] = useState('Ust. Bahrul Ulum');
  const [toast, setToast] = useState('');

  // Tamu Form
  const [tamuNama, setTamuNama] = useState('');
  const [tamuAsal, setTamuAsal] = useState('');
  const [tamuSantri, setTamuSantri] = useState('');
  const [tamuPerlu, setTamuPerlu] = useState('');
  const [tamuPetugas, setTamuPetugas] = useState('Pak Slamet');

  // Jadwal Keamanan Form
  const [jkHari, setJkHari] = useState('Jum\'at');
  const [jkShift, setJkShift] = useState<JadwalKeamananItem['shift']>('Malam (22.00 - 04.00)');
  const [jkPos, setJkPos] = useState('Pos Gerbang Utama');
  const [jkPetugas, setJkPetugas] = useState('');
  const [jkKoord, setJkKoord] = useState('Ust. Bahrul Ulum');

  // Titipan Wali Form
  const [twSantriId, setTwSantriId] = useState(santriList[0]?.id || 's-001');
  const [twPengirim, setTwPengirim] = useState('');
  const [twJenis, setTwJenis] = useState('');
  const [twNominal, setTwNominal] = useState(0);
  const [twFotoUrl, setTwFotoUrl] = useState('');
  const [twPetugas, setTwPetugas] = useState('Pak Slamet');

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const targetSantri = santriList.find((s) => s.id === selectedSantriId) || santriList[0];
  const titipanSantri = santriList.find((s) => s.id === twSantriId) || santriList[0];

  const handleCreatePelanggaran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskripsi.trim() || !takzir.trim()) return;
    addPelanggaran({
      santriId: targetSantri.id,
      santriNama: targetSantri.nama,
      kelas: targetSantri.kelas,
      tanggal: new Date().toISOString().substring(0, 10),
      pelanggaran: deskripsi,
      kategori,
      poin,
      takzir,
      saksi,
    });
    setShowAddModal(false);
    setDeskripsi('');
    setTakzir('');
    notify(`Pelanggaran dan takzir atas nama ${targetSantri.nama} berhasil dicatat.`);
  };

  const handleCreateTamu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tamuNama.trim() || !tamuPerlu.trim()) return;
    addBukuTamu({
      waktu: new Date().toISOString().replace('T', ' ').substring(0, 16),
      namaTamu: tamuNama,
      asalInstansi: tamuAsal || '-',
      santriTujuan: tamuSantri || undefined,
      keperluan: tamuPerlu,
      petugasJaga: tamuPetugas,
    });
    setShowTamuModal(false);
    setTamuNama('');
    setTamuAsal('');
    setTamuPerlu('');
    notify('Kunjungan tamu berhasil dicatat ke buku keamanan.');
  };

  const handleFotoTitipan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setTwFotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTitipan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twPengirim.trim() || !twJenis.trim()) return;
    addTitipanWali({
      tanggal: new Date().toISOString().replace('T', ' ').substring(0, 16),
      santriId: titipanSantri.id,
      santriNama: titipanSantri.nama,
      kelas: titipanSantri.kelas,
      kamar: titipanSantri.kamar,
      pengirimWali: twPengirim,
      jenisTitipan: twJenis,
      nominalUang: twNominal > 0 ? twNominal : undefined,
      fotoUrl: twFotoUrl || undefined,
      status: 'Diterima Pos Keamanan',
      petugasPos: twPetugas,
    });
    setShowTitipanModal(false);
    setTwPengirim('');
    setTwJenis('');
    setTwNominal(0);
    setTwFotoUrl('');
    notify(`Titipan wali untuk ${titipanSantri.nama} dicatat & tampil di Portal Wali.`);
  };

  const totalDalamPembinaan = pelanggaranList.filter((p) => p.status === 'Dalam Pembinaan').length;
  const totalSelesai = pelanggaranList.filter((p) => p.status === 'Selesai').length;
  const totalTitipanPending = titipanWali.filter((t) => t.status !== 'Diterima Santri').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-700" />
            <span>Ketertiban, Keamanan, Titipan Wali & BK</span>
          </h2>
          <p className="text-xs text-slate-500">
            Catatan pelanggaran & takzir, buku tamu 24 jam, jadwal jaga keamanan, serta bukti foto titipan wali santri.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'pelanggaran', label: `Pelanggaran (${pelanggaranList.length})` },
            { id: 'buku_tamu', label: `Buku Tamu (${bukuTamu.length})` },
            { id: 'jadwal_keamanan', label: 'Jadwal Keamanan' },
            { id: 'titipan_wali', label: `Titipan Wali (${titipanWali.length})` },
            { id: 'peraturan', label: 'Tata Tertib' },
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tb.id
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 no-print">
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Catatan Pelanggaran</span>
          <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {pelanggaranList.length} Kasus
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Dalam Pembinaan Takzir</span>
          <p className="text-2xl font-black text-amber-700 mt-1 tabular-nums">
            {totalDalamPembinaan} Santri
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Takzir Diselesaikan</span>
          <p className="text-2xl font-black text-emerald-800 mt-1 tabular-nums">
            {totalSelesai} Kasus
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Titipan Wali Belum Diambil</span>
          <p className="text-2xl font-black text-blue-800 mt-1 tabular-nums">
            {totalTitipanPending} Paket
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{toast}</span>
        </div>
      )}

      {/* TAB 1: PELANGGARAN */}
      {activeTab === 'pelanggaran' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Catatan Pelanggaran Kedisiplinan</h3>
              <p className="text-xs text-slate-500">
                Pencatatan berjenjang mendidik akhlaqul karimah santri
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Pelanggaran Baru</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {pelanggaranList.map((item) => (
              <div
                key={item.id}
                className="py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.kategori === 'Ringan'
                          ? 'bg-blue-100 text-blue-800'
                          : item.kategori === 'Sedang'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.kategori} · {item.poin} Poin
                    </span>
                    <span className="font-bold text-slate-900">{item.santriNama}</span>
                    <span className="text-slate-400">({item.kelas})</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 tabular-nums">{item.tanggal}</span>
                  </div>
                  <p className="text-slate-800 font-medium">{item.pelanggaran}</p>
                  <p className="text-emerald-800 text-[11px]">
                    <strong>Tindakan Takzir:</strong> {item.takzir} (Saksi: {item.saksi})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.status !== 'Selesai' && (
                    <button
                      onClick={() => selesaikanPelanggaran(item.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900"
                    >
                      Selesaikan Takzir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BUKU TAMU */}
      {activeTab === 'buku_tamu' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Buku Tamu Pos Keamanan Pesantren 24 Jam
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan kunjungan wali santri, tamu kiai, dan dinas
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTamuModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Tamu Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-left">
                  <th className="py-2.5">Waktu Kunjungan</th>
                  <th className="py-2.5">Nama Tamu</th>
                  <th className="py-2.5">Asal / Instansi</th>
                  <th className="py-2.5">Keperluan & Santri Tujuan</th>
                  <th className="py-2.5">Petugas Jaga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {bukuTamu.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="py-2.5 tabular-nums text-slate-400">{row.waktu}</td>
                    <td className="py-2.5 font-bold text-slate-900">{row.namaTamu}</td>
                    <td className="py-2.5 text-slate-600">{row.asalInstansi}</td>
                    <td className="py-2.5 text-slate-700">
                      {row.keperluan}
                      {row.santriTujuan && (
                        <span className="block text-[10px] text-emerald-700">
                          Santri: {row.santriTujuan}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-emerald-800 font-bold">{row.petugasJaga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: JADWAL KEAMANAN */}
      {activeTab === 'jadwal_keamanan' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5 printable-area">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Jadwal Piket Keamanan & Ronda Asrama</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pengaturan regu jaga gerbang utama, patroli malam, dan pos penjengukan.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold no-print flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Jadwal</span>
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!jkPetugas.trim()) return;
              addJadwalKeamanan({
                hari: jkHari,
                shift: jkShift,
                pos: jkPos,
                petugas: jkPetugas,
                koordinator: jkKoord,
              });
              setJkPetugas('');
              notify('Regu jaga keamanan baru ditambahkan.');
            }}
            className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs no-print"
          >
            <input
              type="text"
              placeholder="Hari (mis: Jum'at)"
              value={jkHari}
              onChange={(e) => setJkHari(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <select
              value={jkShift}
              onChange={(e) => setJkShift(e.target.value as any)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            >
              <option value="Malam (22.00 - 04.00)">Malam (22.00 - 04.00)</option>
              <option value="Pagi (07.00 - 14.00)">Pagi (07.00 - 14.00)</option>
              <option value="Sore (14.00 - 21.00)">Sore (14.00 - 21.00)</option>
            </select>
            <input
              type="text"
              placeholder="Pos Jaga"
              value={jkPos}
              onChange={(e) => setJkPos(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <input
              type="text"
              required
              placeholder="Nama Petugas Jaga"
              value={jkPetugas}
              onChange={(e) => setJkPetugas(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <button type="submit" className="rounded-xl bg-emerald-800 text-white font-bold py-2">
              + Tambah Jadwal
            </button>
          </form>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                <th className="py-2.5 px-3">Hari</th>
                <th className="py-2.5 px-3">Shift</th>
                <th className="py-2.5 px-3">Pos / Area</th>
                <th className="py-2.5 px-3">Petugas Jaga</th>
                <th className="py-2.5 px-3">Koordinator</th>
                <th className="py-2.5 px-3 text-right no-print">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jadwalKeamanan.map((jk) => (
                <tr key={jk.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{jk.hari}</td>
                  <td className="py-2.5 px-3 text-emerald-800 font-semibold">{jk.shift}</td>
                  <td className="py-2.5 px-3 text-slate-700">{jk.pos}</td>
                  <td className="py-2.5 px-3 font-bold">{jk.petugas}</td>
                  <td className="py-2.5 px-3 text-slate-500">{jk.koordinator}</td>
                  <td className="py-2.5 px-3 text-right no-print">
                    <button
                      type="button"
                      onClick={() => deleteJadwalKeamanan(jk.id)}
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
      )}

      {/* TAB 4: TITIPAN WALI SANTRI + UPLOAD FOTO */}
      {activeTab === 'titipan_wali' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>Layanan Titipan Barang & Kiriman Wali Santri (Pos Keamanan)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Upload bukti foto paket kiriman agar wali santri dapat memantau penerimaan secara real-time di Portal Wali.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTitipanModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Titipan Wali</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {titipanWali.map((tw) => (
              <div
                key={tw.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex gap-3.5 items-start"
              >
                {tw.fotoUrl ? (
                  <img
                    src={tw.fotoUrl}
                    alt="Foto Titipan"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-300 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Package className="w-7 h-7" />
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 truncate">{tw.santriNama}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                      {tw.tanggal}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {tw.kelas} · Kamar {tw.kamar} · Dari: <strong>{tw.pengirimWali}</strong>
                  </p>
                  <p className="text-slate-800 font-medium">{tw.jenisTitipan}</p>
                  {tw.nominalUang && (
                    <p className="text-emerald-800 font-bold">
                      + Titipan Uang Tunai: Rp {tw.nominalUang.toLocaleString('id-ID')}
                    </p>
                  )}

                  <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2">
                    <select
                      value={tw.status}
                      onChange={(e) =>
                        updateStatusTitipanWali(tw.id, e.target.value as TitipanWaliRecord['status'])
                      }
                      className={`rounded-lg px-2 py-1 text-[10px] font-bold border ${
                        tw.status === 'Diterima Santri'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : tw.status === 'Diserahkan ke Wali Kamar'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="Diterima Pos Keamanan">Diterima Pos Keamanan</option>
                      <option value="Diserahkan ke Wali Kamar">Diserahkan ke Wali Kamar</option>
                      <option value="Diterima Santri">Diterima Santri</option>
                    </select>
                    <span className="text-[10px] text-slate-400">Pos: {tw.petugasPos}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: KITAB TATA TERTIB PONDOK */}
      {activeTab === 'peraturan' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Qonun / Kitab Tata Tertib Santri PP NU Darussalam
              </h3>
              <p className="text-xs text-slate-500">
                Pedoman poin kedisiplinan dan takzir edukatif syar'i
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
              <h4 className="font-bold text-blue-950">Pelanggaran Ringan (5–10 Poin)</h4>
              <ul className="space-y-1 text-blue-900 list-disc pl-4">
                <li>Terlambat shalat berjamaah di masjid</li>
                <li>Tidak memakai peci/seragam saat ngaji diniyah</li>
                <li>Kamar kurang rapi saat inspeksi kebersihan</li>
              </ul>
              <p className="text-[11px] font-bold pt-1">
                Takzir: Membaca Yasin/Nadhom & membersihkan serambi masjid.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-950">Pelanggaran Sedang (15–25 Poin)</h4>
              <ul className="space-y-1 text-amber-900 list-disc pl-4">
                <li>Keluar komplek pondok tanpa surat izin keamanan</li>
                <li>Tidak mengikuti kegiatan madrasah diniyah tanpa uzur</li>
                <li>Ghosob barang milik santri lain</li>
              </ul>
              <p className="text-[11px] font-bold pt-1">
                Takzir: Menghafal 25 bait nadhom, piket kebersihan 3 hari & panggilan pembinaan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-950">Pelanggaran Berat (30–100 Poin)</h4>
              <ul className="space-y-1 text-rose-900 list-disc pl-4">
                <li>Membawa / menyembunyikan HP tanpa izin resmi</li>
                <li>Merokok atau perkelahian antar santri</li>
                <li>Kabur dari pondok pesantren</li>
              </ul>
              <p className="text-[11px] font-bold pt-1">
                Takzir: Pemanggilan Wali Santri, surat perjanjian bermeterai di hadapan Pengasuh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pelanggaran */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleCreatePelanggaran}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900">Catat Pelanggaran Disiplin Santri</h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Santri</label>
              <select
                value={selectedSantriId}
                onChange={(e) => setSelectedSantriId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold"
              >
                {santriList.slice(0, 40).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.kelas} - {s.kamar})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={kategori}
                onChange={(e) => {
                  const k = e.target.value as any;
                  setKategori(k);
                  setPoin(k === 'Ringan' ? 5 : k === 'Sedang' ? 15 : 30);
                }}
                className="rounded-xl border border-slate-300 p-2"
              >
                <option value="Ringan">Ringan (5 Poin)</option>
                <option value="Sedang">Sedang (15 Poin)</option>
                <option value="Berat">Berat (30 Poin)</option>
              </select>
              <input
                type="number"
                value={poin}
                onChange={(e) => setPoin(parseInt(e.target.value) || 0)}
                className="rounded-xl border border-slate-300 p-2 text-center font-bold"
              />
            </div>

            <input
              type="text"
              required
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jenis pelanggaran..."
              className="w-full rounded-xl border border-slate-300 p-2"
            />
            <input
              type="text"
              required
              value={takzir}
              onChange={(e) => setTakzir(e.target.value)}
              placeholder="Tindakan takzir mendidik..."
              className="w-full rounded-xl border border-slate-300 p-2"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Simpan Takzir
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Catat Tamu */}
      {showTamuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleCreateTamu}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900">Catat Kunjungan Tamu</h3>
            <input
              type="text"
              required
              placeholder="Nama Lengkap Tamu *"
              value={tamuNama}
              onChange={(e) => setTamuNama(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2"
            />
            <input
              type="text"
              placeholder="Asal Daerah / Instansi"
              value={tamuAsal}
              onChange={(e) => setTamuAsal(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2"
            />
            <input
              type="text"
              placeholder="Santri yang Dituju (Opsional)"
              value={tamuSantri}
              onChange={(e) => setTamuSantri(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2"
            />
            <input
              type="text"
              required
              placeholder="Keperluan Kunjungan *"
              value={tamuPerlu}
              onChange={(e) => setTamuPerlu(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2"
            />
            <input
              type="text"
              placeholder="Petugas Jaga Pos"
              value={tamuPetugas}
              onChange={(e) => setTamuPetugas(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTamuModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Simpan Buku Tamu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Titipan Wali + Upload Foto */}
      {showTitipanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleCreateTitipan}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900">
              Catat Titipan Paket / Uang Wali Santri
            </h3>
            <div>
              <label className="block font-bold mb-1">Santri Penerima</label>
              <select
                value={twSantriId}
                onChange={(e) => setTwSantriId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold"
              >
                {santriList.slice(0, 40).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.kelas} - {s.kamar})
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              required
              placeholder="Nama Wali Pengirim *"
              value={twPengirim}
              onChange={(e) => setTwPengirim(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2"
            />
            <input
              type="text"
              required
              placeholder="Isi Paket / Jenis Titipan *"
              value={twJenis}
              onChange={(e) => setTwJenis(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2"
            />
            <div>
              <label className="block font-bold mb-1">Titipan Uang Tunai (Opsional, Rp)</label>
              <input
                type="number"
                min={0}
                step={5000}
                value={twNominal}
                onChange={(e) => setTwNominal(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold"
              />
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 space-y-1.5">
              <label className="font-bold flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unggah Foto Bukti Paket Titipan</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoTitipan}
                className="block w-full text-xs"
              />
              {twFotoUrl && (
                <img src={twFotoUrl} alt="Preview" className="h-20 rounded-lg object-cover mt-1" />
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTitipanModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Simpan Titipan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
