import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  Edit3,
  Trash2,
  Building2,
  Users,
  X,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { formatNIS } from '../../lib/rules.ts';
import { DetailSantriForm } from '../../components/common/DetailSantriForm.tsx';
import type { SantriRecord } from '../../data/seed/pondokData.ts';

export const SekretarisModule: React.FC = () => {
  const {
    santriList,
    addSantri,
    updateSantri,
    deleteSantri,
    suratList,
    addSurat,
    nisConfig,
    updateNISConfig,
    pengurusStruktur,
    addPengurus,
    deletePengurus,
    sarprasLahan,
    addSarprasLahan,
    deleteSarprasLahan,
    sarprasGedung,
    addSarprasGedung,
    deleteSarprasGedung,
    sarprasRuangan,
    addSarprasRuangan,
    deleteSarprasRuangan,
    sarprasPerlengkapan,
    addSarprasPerlengkapan,
    deleteSarprasPerlengkapan,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'santri' | 'surat' | 'pengurus' | 'sarpras' | 'pengaturan_nis'
  >('santri');
  const [searchSantri, setSearchSantri] = useState<string>('');
  const [filterGender, setFilterGender] = useState<string>('Semua');

  // DetailSantriForm Modal State
  const [santriFormMode, setSantriFormMode] = useState<'create' | 'edit' | null>(null);
  const [editingSantri, setEditingSantri] = useState<SantriRecord | undefined>(undefined);

  // Surat Form State
  const [showSuratModal, setShowSuratModal] = useState<boolean>(false);
  const [suratPerihal, setSuratPerihal] = useState<string>('');
  const [suratTujuan, setSuratTujuan] = useState<string>('');
  const [suratIsi, setSuratIsi] = useState<string>('');
  const [suratTipe, setSuratTipe] = useState<'Surat Keluar' | 'Surat Masuk'>('Surat Keluar');

  // Pengurus Putra/Putri state
  const [pengurusKomplek, setPengurusKomplek] = useState<'Putra' | 'Putri'>('Putra');
  const [pngJabatan, setPngJabatan] = useState('');
  const [pngNama, setPngNama] = useState('');
  const [pngKamar, setPngKamar] = useState('');
  const [pngHP, setPngHP] = useState('');

  // Sarpras sub-tab & quick forms
  const [sarprasTab, setSarprasTab] = useState<'lahan' | 'gedung' | 'ruangan' | 'perlengkapan'>(
    'lahan'
  );
  const [lhnNama, setLhnNama] = useState('');
  const [lhnLuas, setLhnLuas] = useState(500);
  const [lhnSertifikat, setLhnSertifikat] = useState('');

  const [gdgKode, setGdgKode] = useState('GD-D');
  const [gdgNama, setGdgNama] = useState('');
  const [gdgLantai, setGdgLantai] = useState(2);
  const [gdgLuas, setGdgLuas] = useState(400);

  const [rngGedung, setRngGedung] = useState(sarprasGedung[0]?.namaGedung || 'Gedung Utama');
  const [rngNama, setRngNama] = useState('');
  const [rngJenis, setRngJenis] = useState<'Kelas' | 'Asrama Putra' | 'Asrama Putri' | 'Kantor' | 'Aula' | 'Masjid'>('Kelas');
  const [rngKapasitas, setRngKapasitas] = useState(30);

  const [prlKode, setPrlKode] = useState('INV-005');
  const [prlNama, setPrlNama] = useState('');
  const [prlJumlah, setPrlJumlah] = useState(10);
  const [prlLokasi, setPrlLokasi] = useState('Aula Utama Lt. 1');

  // NIS Config State
  const [nisPrefix, setNisPrefix] = useState<string>(nisConfig.prefix);
  const [nisUseYear, setNisUseYear] = useState<boolean>(nisConfig.useYear);
  const [nisNomorAwal, setNisNomorAwal] = useState<number>(nisConfig.nomorAwal);
  const [nisDigits, setNisDigits] = useState<number>(nisConfig.digitCount);
  const [toastMsg, setToastMsg] = useState<string>('');

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const filteredSantri = santriList.filter((s) => {
    if (filterGender !== 'Semua' && s.gender !== filterGender) return false;
    if (
      searchSantri &&
      !s.nama.toLowerCase().includes(searchSantri.toLowerCase()) &&
      !s.nis.includes(searchSantri)
    ) {
      return false;
    }
    return true;
  });

  const handleSaveNISConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateNISConfig({
      prefix: nisPrefix,
      useYear: nisUseYear,
      nomorAwal: nisNomorAwal,
      digitCount: nisDigits,
    });
    notify('Pengaturan format nomor NIS berhasil diperbarui.');
  };

  const handleCreateSurat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suratPerihal.trim() || !suratTujuan.trim()) return;

    addSurat({
      perihal: suratPerihal,
      tujuan: suratTujuan,
      tanggal: new Date().toISOString().substring(0, 10),
      tipe: suratTipe,
      status: 'Ditandatangani',
      isiRingkas: suratIsi,
      penandatangan: 'KH. Amin Maizun (Pengasuh)',
    });

    setShowSuratModal(false);
    setSuratPerihal('');
    setSuratTujuan('');
    setSuratIsi('');
    notify('Surat resmi berhasil diterbitkan dengan nomor otomatis.');
  };

  const sampleNis1 = formatNIS(1, {
    prefix: nisPrefix,
    useYear: nisUseYear,
    nomorAwal: nisNomorAwal,
    digitCount: nisDigits,
  });
  const sampleNis2 = formatNIS(2, {
    prefix: nisPrefix,
    useYear: nisUseYear,
    nomorAwal: nisNomorAwal,
    digitCount: nisDigits,
  });

  return (
    <div className="space-y-6">
      {/* Tier 1: Title Header */}
      <div className="no-print space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-700" />
              <span>Sekretariat, Master EMIS Santri & Sarpras</span>
            </h2>
            <p className="text-xs text-slate-500">
              Biodata EMIS lengkap 4-tab, persuratan dinamis, kepengurusan Putra/Putri, dan inventaris sarana prasarana.
            </p>
          </div>
        </div>

        {/* Tier 2: 4 Compact KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Total Santri Terdaftar</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {santriList.length} <span className="text-[11px] font-normal text-slate-500">Santri</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Surat Tercatat</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {suratList.length} <span className="text-[11px] font-normal text-slate-500">Arsip</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Pengurus Putra/Putri</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {pengurusStruktur.length} <span className="text-[11px] font-normal text-slate-500">Personel</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Aset Sarpras Terdata</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {sarprasLahan.length + sarprasGedung.length + sarprasRuangan.length + sarprasPerlengkapan.length}{' '}
                <span className="text-[11px] font-normal text-slate-500">Unit</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tier 3: Horizontal Scrollable Sub-Menu Bar Below */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'santri', label: `Master Santri (${santriList.length})` },
            { id: 'surat', label: `Persuratan (${suratList.length})` },
            { id: 'pengurus', label: 'Kepengurusan Putra/Putri' },
            { id: 'sarpras', label: 'Sarana & Prasarana' },
            { id: 'pengaturan_nis', label: 'Pengaturan NIS' },
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tb.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TAB 1: MASTER DATA SANTRI + EMIS FORM */}
      {activeTab === 'santri' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 flex-1 max-w-md border border-slate-200 rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchSantri}
                onChange={(e) => setSearchSantri(e.target.value)}
                placeholder="Cari nama santri atau NIS..."
                className="w-full text-xs focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
              >
                <option value="Semua">Semua Santri ({santriList.length})</option>
                <option value="L">
                  Putra ({santriList.filter((s) => s.gender === 'L').length})
                </option>
                <option value="P">
                  Putri ({santriList.filter((s) => s.gender === 'P').length})
                </option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setEditingSantri(undefined);
                  setSantriFormMode('create');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Santri (EMIS)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Buku Induk</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                <tr className="text-slate-500 text-left">
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Santri & NIK</th>
                  <th className="py-2.5 px-3">Kelas & Kamar</th>
                  <th className="py-2.5 px-3">Nama Wali & No. HP</th>
                  <th className="py-2.5 px-3">Asal Daerah</th>
                  <th className="py-2.5 px-3 text-right no-print">Aksi EMIS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {filteredSantri.map((santri) => (
                  <tr key={santri.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-emerald-800 tabular-nums">
                      {santri.nis}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {santri.nama}
                      {santri.nik && (
                        <span className="block text-[10px] font-normal text-slate-400 tabular-nums">
                          NIK: {santri.nik}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold mr-1">
                        {santri.kelas}
                      </span>
                      <span>{santri.kamar}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {santri.namaWali}
                      <span className="block text-[10px] text-slate-400">{santri.hpWali}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{santri.alamatAsal}</td>
                    <td className="py-2.5 px-3 text-right no-print">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSantri(santri);
                            setSantriFormMode('edit');
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit EMIS</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteSantri(santri.id);
                            notify(`Data santri ${santri.nama} dihapus.`);
                          }}
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

      {/* TAB 2: PERSURATAN RESMI */}
      {activeTab === 'surat' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Buku Agenda Surat Keluar & Masuk</h3>
              <p className="text-xs text-slate-500">
                Penomoran otomatis dengan format standar pesantren
              </p>
            </div>
            <button
              onClick={() => setShowSuratModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 no-print"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Surat Resmi Baru</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {suratList.map((srt) => (
              <div
                key={srt.id}
                className="py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {srt.tipe}
                    </span>
                    <span className="font-bold text-emerald-800">{srt.nomorSurat}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{srt.tanggal}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{srt.perihal}</h4>
                  <p className="text-slate-500 text-[11px]">
                    Tujuan: <strong>{srt.tujuan}</strong>
                  </p>
                  <p className="text-slate-600 text-[11px] italic">"{srt.isiRingkas}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 no-print">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {srt.status}
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                    title="Cetak Surat"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STRUKTUR KEPENGURUSAN PUTRA & PUTRI */}
      {activeTab === 'pengurus' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Struktur Kepengurusan Asrama Putra & Putri</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pengurus harian komplek putra & komplek putri periode aktif.
              </p>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPengurusKomplek('Putra')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  pengurusKomplek === 'Putra' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                }`}
              >
                Komplek Putra
              </button>
              <button
                type="button"
                onClick={() => setPengurusKomplek('Putri')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  pengurusKomplek === 'Putri' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                }`}
              >
                Komplek Putri
              </button>
            </div>
          </div>

          {/* Quick Add Pengurus */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!pngJabatan.trim() || !pngNama.trim()) return;
              addPengurus({
                komplek: pengurusKomplek,
                jabatan: pngJabatan,
                nama: pngNama,
                kamarAtauDivisi: pngKamar || '-',
                noHP: pngHP || '-',
                periode: '2026/2027',
              });
              setPngJabatan('');
              setPngNama('');
              setPngKamar('');
              setPngHP('');
              notify('Pengurus baru berhasil ditambahkan.');
            }}
            className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs"
          >
            <input
              type="text"
              required
              placeholder="Jabatan (mis: Wali Kamar)"
              value={pngJabatan}
              onChange={(e) => setPngJabatan(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <input
              type="text"
              required
              placeholder="Nama Pengurus"
              value={pngNama}
              onChange={(e) => setPngNama(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <input
              type="text"
              placeholder="Kamar / Divisi"
              value={pngKamar}
              onChange={(e) => setPngKamar(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <input
              type="text"
              placeholder="No. HP"
              value={pngHP}
              onChange={(e) => setPngHP(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2"
            >
              + Tambah Pengurus {pengurusKomplek}
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                  <th className="py-2.5 px-3">Jabatan</th>
                  <th className="py-2.5 px-3">Nama Lengkap</th>
                  <th className="py-2.5 px-3">Kamar / Divisi</th>
                  <th className="py-2.5 px-3">No. HP</th>
                  <th className="py-2.5 px-3">Periode</th>
                  <th className="py-2.5 px-3 text-right">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pengurusStruktur
                  .filter((p) => p.komplek === pengurusKomplek)
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-emerald-900">{p.jabatan}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{p.nama}</td>
                      <td className="py-2.5 px-3 text-slate-700">{p.kamarAtauDivisi}</td>
                      <td className="py-2.5 px-3 tabular-nums text-slate-600">{p.noHP}</td>
                      <td className="py-2.5 px-3 text-slate-500">{p.periode}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => deletePengurus(p.id)}
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
      )}

      {/* TAB 4: SARANA & PRASARANA (EMIS: LAHAN, GEDUNG, RUANGAN, PERLENGKAPAN) */}
      {activeTab === 'sarpras' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Sarana & Prasarana Pesantren (Format EMIS)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Inventarisasi aset lahan wakaf, gedung, ruangan kelas/kamar, dan perlengkapan alat.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'lahan', label: `Lahan (${sarprasLahan.length})` },
                { id: 'gedung', label: `Gedung (${sarprasGedung.length})` },
                { id: 'ruangan', label: `Ruangan (${sarprasRuangan.length})` },
                { id: 'perlengkapan', label: `Perlengkapan & Alat (${sarprasPerlengkapan.length})` },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSarprasTab(st.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    sarprasTab === st.id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {sarprasTab === 'lahan' && (
            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!lhnNama.trim()) return;
                  addSarprasLahan({
                    namaLahan: lhnNama,
                    luasM2: lhnLuas,
                    statusKepemilikan: 'Wakaf NU',
                    noSertifikat: lhnSertifikat || '-',
                    lokasi: 'Karangdadap',
                  });
                  setLhnNama('');
                  notify('Data lahan wakaf ditambahkan.');
                }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Nama / Bidang Lahan"
                  value={lhnNama}
                  onChange={(e) => setLhnNama(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Luas (m²)"
                  value={lhnLuas}
                  onChange={(e) => setLhnLuas(parseInt(e.target.value) || 0)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="No. Sertifikat / Akta Wakaf"
                  value={lhnSertifikat}
                  onChange={(e) => setLhnSertifikat(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <button type="submit" className="rounded-xl bg-emerald-800 text-white font-bold py-2">
                  + Tambah Lahan
                </button>
              </form>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                    <th className="py-2 px-3">Nama Bidang Lahan</th>
                    <th className="py-2 px-3 text-right">Luas (m²)</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">No. Sertifikat</th>
                    <th className="py-2 px-3">Lokasi</th>
                    <th className="py-2 px-3 text-right">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sarprasLahan.map((l) => (
                    <tr key={l.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{l.namaLahan}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{l.luasM2.toLocaleString('id-ID')} m²</td>
                      <td className="py-2.5 px-3">{l.statusKepemilikan}</td>
                      <td className="py-2.5 px-3 tabular-nums">{l.noSertifikat}</td>
                      <td className="py-2.5 px-3 text-slate-500">{l.lokasi}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteSarprasLahan(l.id)}
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

          {sarprasTab === 'gedung' && (
            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!gdgNama.trim()) return;
                  addSarprasGedung({
                    kode: gdgKode,
                    namaGedung: gdgNama,
                    jumlahLantai: gdgLantai,
                    luasBangunanM2: gdgLuas,
                    tahunBangun: 2024,
                    kondisi: 'Baik',
                  });
                  setGdgNama('');
                  notify('Data gedung baru ditambahkan.');
                }}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs"
              >
                <input
                  type="text"
                  placeholder="Kode"
                  value={gdgKode}
                  onChange={(e) => setGdgKode(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="text"
                  required
                  placeholder="Nama Gedung"
                  value={gdgNama}
                  onChange={(e) => setGdgNama(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Lantai"
                  value={gdgLantai}
                  onChange={(e) => setGdgLantai(parseInt(e.target.value) || 1)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Luas (m²)"
                  value={gdgLuas}
                  onChange={(e) => setGdgLuas(parseInt(e.target.value) || 0)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <button type="submit" className="rounded-xl bg-emerald-800 text-white font-bold py-2">
                  + Tambah Gedung
                </button>
              </form>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                    <th className="py-2 px-3">Kode</th>
                    <th className="py-2 px-3">Nama Gedung</th>
                    <th className="py-2 px-3 text-center">Lantai</th>
                    <th className="py-2 px-3 text-right">Luas</th>
                    <th className="py-2 px-3">Kondisi</th>
                    <th className="py-2 px-3 text-right">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sarprasGedung.map((g) => (
                    <tr key={g.id}>
                      <td className="py-2.5 px-3 font-bold text-emerald-800">{g.kode}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{g.namaGedung}</td>
                      <td className="py-2.5 px-3 text-center">{g.jumlahLantai} Lt</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{g.luasBangunanM2} m²</td>
                      <td className="py-2.5 px-3">{g.kondisi}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteSarprasGedung(g.id)}
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

          {sarprasTab === 'ruangan' && (
            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!rngNama.trim()) return;
                  addSarprasRuangan({
                    gedungId: sarprasGedung[0]?.id || 'gdg-1',
                    namaGedung: rngGedung,
                    namaRuang: rngNama,
                    jenis: rngJenis,
                    kapasitas: rngKapasitas,
                    kondisi: 'Baik',
                  });
                  setRngNama('');
                  notify('Data ruangan baru ditambahkan.');
                }}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Nama Ruang / Kamar"
                  value={rngNama}
                  onChange={(e) => setRngNama(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Gedung"
                  value={rngGedung}
                  onChange={(e) => setRngGedung(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <select
                  value={rngJenis}
                  onChange={(e) => setRngJenis(e.target.value as any)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                >
                  <option value="Kelas">Kelas</option>
                  <option value="Asrama Putra">Asrama Putra</option>
                  <option value="Asrama Putri">Asrama Putri</option>
                  <option value="Aula">Aula</option>
                  <option value="Kantor">Kantor</option>
                  <option value="Masjid">Masjid</option>
                </select>
                <input
                  type="number"
                  placeholder="Kapasitas"
                  value={rngKapasitas}
                  onChange={(e) => setRngKapasitas(parseInt(e.target.value) || 20)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <button type="submit" className="rounded-xl bg-emerald-800 text-white font-bold py-2">
                  + Tambah Ruang
                </button>
              </form>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                    <th className="py-2 px-3">Nama Ruangan</th>
                    <th className="py-2 px-3">Gedung</th>
                    <th className="py-2 px-3">Jenis</th>
                    <th className="py-2 px-3 text-center">Kapasitas</th>
                    <th className="py-2 px-3">Kondisi</th>
                    <th className="py-2 px-3 text-right">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sarprasRuangan.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{r.namaRuang}</td>
                      <td className="py-2.5 px-3 text-slate-600">{r.namaGedung}</td>
                      <td className="py-2.5 px-3">{r.jenis}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{r.kapasitas} org</td>
                      <td className="py-2.5 px-3">{r.kondisi}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteSarprasRuangan(r.id)}
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

          {sarprasTab === 'perlengkapan' && (
            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!prlNama.trim()) return;
                  addSarprasPerlengkapan({
                    kodeBarang: prlKode,
                    namaBarang: prlNama,
                    kategori: 'Mebel',
                    jumlah: prlJumlah,
                    satuan: 'Unit',
                    lokasiRuang: prlLokasi,
                    kondisi: 'Layak',
                  });
                  setPrlNama('');
                  notify('Perlengkapan inventaris ditambahkan.');
                }}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs"
              >
                <input
                  type="text"
                  placeholder="Kode Inventaris"
                  value={prlKode}
                  onChange={(e) => setPrlKode(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="text"
                  required
                  placeholder="Nama Barang / Alat"
                  value={prlNama}
                  onChange={(e) => setPrlNama(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Jumlah"
                  value={prlJumlah}
                  onChange={(e) => setPrlJumlah(parseInt(e.target.value) || 1)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Lokasi Ruang"
                  value={prlLokasi}
                  onChange={(e) => setPrlLokasi(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <button type="submit" className="rounded-xl bg-emerald-800 text-white font-bold py-2">
                  + Tambah Alat
                </button>
              </form>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                    <th className="py-2 px-3">Kode</th>
                    <th className="py-2 px-3">Nama Perlengkapan / Alat</th>
                    <th className="py-2 px-3">Kategori</th>
                    <th className="py-2 px-3 text-center">Jumlah</th>
                    <th className="py-2 px-3">Lokasi</th>
                    <th className="py-2 px-3">Kondisi</th>
                    <th className="py-2 px-3 text-right">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sarprasPerlengkapan.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-bold text-emerald-800">{p.kodeBarang}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{p.namaBarang}</td>
                      <td className="py-2.5 px-3">{p.kategori}</td>
                      <td className="py-2.5 px-3 text-center font-bold">
                        {p.jumlah} {p.satuan}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{p.lokasiRuang}</td>
                      <td className="py-2.5 px-3">{p.kondisi}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteSarprasPerlengkapan(p.id)}
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
        </div>
      )}

      {/* TAB 5: PENGATURAN PENOMORAN NIS */}
      {activeTab === 'pengaturan_nis' && (
        <form
          onSubmit={handleSaveNISConfig}
          className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-6 max-w-2xl mx-auto"
        >
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Konfigurasi Format Penomoran Induk Santri (NIS)
            </h3>
            <p className="text-xs text-slate-500">
              Konfigurasikan format penomoran otomatis untuk santri baru PSB.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prefix / Awalan NIS
              </label>
              <input
                type="text"
                value={nisPrefix}
                onChange={(e) => setNisPrefix(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Awal (Counter Start)
              </label>
              <input
                type="number"
                min={1}
                value={nisNomorAwal}
                onChange={(e) => setNisNomorAwal(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jumlah Digit Nomor Urut
              </label>
              <input
                type="number"
                min={3}
                max={6}
                value={nisDigits}
                onChange={(e) => setNisDigits(parseInt(e.target.value) || 4)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold tabular-nums"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={nisUseYear}
                  onChange={(e) => setNisUseYear(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span>Sertakan 2 Digit Tahun (26)</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
            <p className="font-bold text-emerald-950">Pratinjau Hasil NIS Baru:</p>
            <p className="text-slate-600">
              Santri berikutnya #1: <strong className="text-emerald-900 font-mono text-sm">{sampleNis1}</strong>
            </p>
            <p className="text-slate-600">
              Santri berikutnya #2: <strong className="text-emerald-900 font-mono text-sm">{sampleNis2}</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition"
          >
            Simpan Konfigurasi Format NIS
          </button>
        </form>
      )}

      {/* Modal EMIS DetailSantriForm */}
      {santriFormMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {santriFormMode === 'create'
                  ? 'Tambah Santri Baru (Biodata EMIS Lengkap)'
                  : `Edit Biodata EMIS: ${editingSantri?.nama}`}
              </h3>
              <button
                type="button"
                onClick={() => setSantriFormMode(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DetailSantriForm
              mode={santriFormMode}
              initialData={editingSantri}
              onCancel={() => setSantriFormMode(null)}
              onSave={(data) => {
                if (santriFormMode === 'create') {
                  addSantri(data);
                  notify(`Santri baru ${data.nama} berhasil ditambahkan.`);
                } else if (editingSantri) {
                  updateSantri(editingSantri.id, data);
                  notify(`Biodata EMIS ${data.nama} berhasil diperbarui.`);
                }
                setSantriFormMode(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Buat Surat */}
      {showSuratModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <form
            onSubmit={handleCreateSurat}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-sm text-slate-900">Penerbitan Surat Resmi Yayasan</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Surat</label>
              <select
                value={suratTipe}
                onChange={(e) => setSuratTipe(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              >
                <option value="Surat Keluar">Surat Keluar</option>
                <option value="Surat Masuk">Surat Masuk</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Perihal Surat</label>
              <input
                type="text"
                required
                value={suratPerihal}
                onChange={(e) => setSuratPerihal(e.target.value)}
                placeholder="Contoh: Undangan Rapat Wali Santri Semester Gasal"
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan Surat</label>
              <input
                type="text"
                required
                value={suratTujuan}
                onChange={(e) => setSuratTujuan(e.target.value)}
                placeholder="Contoh: Seluruh Wali Santri Kelas 2 MDS"
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Isi Ringkas Surat</label>
              <textarea
                rows={3}
                value={suratIsi}
                onChange={(e) => setSuratIsi(e.target.value)}
                placeholder="Tuliskan ringkasan pokok surat..."
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowSuratModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 shadow-xs"
              >
                Terbitkan & Beri Nomor Otomatis
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
