import React, { useState } from 'react';
import {
  User,
  Users,
  MapPin,
  GraduationCap,
  Upload,
  CheckCircle2,
  FileText,
  X,
  Save,
} from 'lucide-react';
import { DAFTAR_KELAS_DINIYAH, type SantriRecord } from '../../data/seed/pondokData.ts';

export interface DetailSantriFormProps {
  initialData?: Partial<SantriRecord>;
  mode: 'create' | 'edit';
  onSave: (data: Omit<SantriRecord, 'id'>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const DetailSantriForm: React.FC<DetailSantriFormProps> = ({
  initialData = {},
  mode,
  onSave,
  onCancel,
  submitLabel = 'Simpan Data Santri',
}) => {
  const [activeTab, setActiveTab] = useState<'santri' | 'ortu' | 'alamat' | 'aktivitas'>('santri');

  const [nis, setNis] = useState(initialData.nis || '');
  const [nisn, setNisn] = useState(initialData.nisn || '');
  const [nism, setNism] = useState(initialData.nism || '510033260042');
  const [nik, setNik] = useState(initialData.nik || '');
  const [nama, setNama] = useState(initialData.nama || '');
  const [gender, setGender] = useState<'L' | 'P'>(initialData.gender || 'L');
  const [tempatLahir, setTempatLahir] = useState(initialData.tempatLahir || 'Pekalongan');
  const [tanggalLahir, setTanggalLahir] = useState(initialData.tanggalLahir || '2011-05-14');
  const [anakKe, setAnakKe] = useState<number>(initialData.anakKe || 1);
  const [jumlahSaudara, setJumlahSaudara] = useState<number>(initialData.jumlahSaudara || 2);
  const [citaCita, setCitaCita] = useState(initialData.citaCita || 'Ulama / Kyai / Pendidik');
  const [hobi, setHobi] = useState(initialData.hobi || 'Membaca Kitab & Hadroh');
  const [noHP, setNoHP] = useState(initialData.noHP || '');
  const [emailSantri, setEmailSantri] = useState(initialData.emailSantri || '');
  const [kebutuhanKhusus, setKebutuhanKhusus] = useState(initialData.kebutuhanKhusus || 'Tidak Ada');
  const [kebutuhanDisabilitas, setKebutuhanDisabilitas] = useState(initialData.kebutuhanDisabilitas || 'Tidak Ada');
  const [pembiayaSekolah, setPembiayaSekolah] = useState(initialData.pembiayaSekolah || 'Orang Tua / Wali');
  const [nomorKIP, setNomorKIP] = useState(initialData.nomorKIP || '');
  const [tahunKIP, setTahunKIP] = useState(initialData.tahunKIP || '2026');

  // Orang Tua & KK
  const [noKK, setNoKK] = useState(initialData.noKK || '');
  const [namaKepalaKeluarga, setNamaKepalaKeluarga] = useState(initialData.namaKepalaKeluarga || initialData.namaWali || '');
  const [namaWali, setNamaWali] = useState(initialData.namaWali || '');
  const [hpWali, setHpWali] = useState(initialData.hpWali || '');
  const [dokumenKKUrl, setDokumenKKUrl] = useState(initialData.dokumenKKUrl || '');
  const [dokumenKKName, setDokumenKKName] = useState(initialData.dokumenKKName || '');
  const [dokumenKIPUrl, setDokumenKIPUrl] = useState(initialData.dokumenKIPUrl || '');
  const [dokumenKIPName, setDokumenKIPName] = useState(initialData.dokumenKIPName || '');

  // Alamat
  const [alamatAsal, setAlamatAsal] = useState(initialData.alamatAsal || '');
  const [alamatDetail, setAlamatDetail] = useState(initialData.alamatDetail || '');

  // Aktivitas Belajar
  const [kelas, setKelas] = useState(initialData.kelas || '1 A PUTRA');
  const [kamar, setKamar] = useState(initialData.kamar || 'Al-Falah 1');
  const [aktivitasPendidikan, setAktivitasPendidikan] = useState(
    initialData.aktivitasPendidikan || 'Madrasah Diniyah Salafiyah (MDS) & Formal MTs/MA'
  );
  const [waliKelas, setWaliKelas] = useState(initialData.waliKelas || 'Ust. Abdurrohman');
  const [isSantriNdalem, setIsSantriNdalem] = useState(Boolean(initialData.isSantriNdalem));

  const nikValid = /^\d{16}$/.test(nik.trim());

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'kk' | 'kip'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (target === 'kk') {
        setDokumenKKUrl(result);
        setDokumenKKName(file.name);
      } else {
        setDokumenKIPUrl(result);
        setDokumenKIPName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !namaWali.trim()) return;
    const tingkatParsed = parseInt(kelas.charAt(0)) || 1;
    onSave({
      nis: nis.trim() || `26.${Math.floor(1000 + Math.random() * 9000)}`,
      nama: nama.toUpperCase(),
      gender,
      kelas,
      tingkat: tingkatParsed,
      kamar,
      namaWali,
      hpWali,
      alamatAsal,
      saldoKartu: initialData.saldoKartu ?? 50000,
      limitHarian: initialData.limitHarian ?? 25000,
      statusKartu: initialData.statusKartu ?? 'Aktif',
      isSantriNdalem,
      nisn,
      nism,
      nik,
      tempatLahir,
      tanggalLahir,
      anakKe,
      jumlahSaudara,
      citaCita,
      hobi,
      noHP,
      emailSantri,
      aktivitasPendidikan,
      pembiayaSekolah,
      kebutuhanKhusus,
      kebutuhanDisabilitas,
      nomorKIP,
      tahunKIP,
      noKK,
      namaKepalaKeluarga: namaKepalaKeluarga || namaWali,
      dokumenKKUrl,
      dokumenKKName,
      dokumenKIPUrl,
      dokumenKIPName,
      alamatDetail,
      waliKelas,
    });
  };

  const tabs = [
    { id: 'santri', label: 'DATA SANTRI', icon: User },
    { id: 'ortu', label: 'DATA ORANG TUA & KK', icon: Users },
    { id: 'alamat', label: 'DATA ALAMAT', icon: MapPin },
    { id: 'aktivitas', label: 'AKTIVITAS BELAJAR', icon: GraduationCap },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      {/* EMIS-style Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
                active
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DATA SANTRI */}
      {activeTab === 'santri' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIS Pondok</label>
              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="Otomatis / 24.1001"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NISN</label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="10 Digit NISN"
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NISM Lembaga</label>
              <input
                type="text"
                value={nism}
                onChange={(e) => setNism(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Santri *</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Sesuai Akta Kelahiran / KK"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold uppercase"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">NIK (16 Digit)</label>
                {nik && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                      nikValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {nikValid ? 'Terverifikasi Dukcapil (16 Digit)' : 'Format harus 16 digit'}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="3326xxxxxxxxxxxx"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
              >
                <option value="L">Laki-laki (Putra)</option>
                <option value="P">Perempuan (Putri)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Anak Ke-</label>
              <input
                type="number"
                min={1}
                value={anakKe}
                onChange={(e) => setAnakKe(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jumlah Saudara</label>
              <input
                type="number"
                min={0}
                value={jumlahSaudara}
                onChange={(e) => setJumlahSaudara(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cita-cita</label>
              <input
                type="text"
                value={citaCita}
                onChange={(e) => setCitaCita(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hobi</label>
              <input
                type="text"
                value={hobi}
                onChange={(e) => setHobi(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pembiaya Sekolah</label>
              <select
                value={pembiayaSekolah}
                onChange={(e) => setPembiayaSekolah(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              >
                <option value="Orang Tua / Wali">Orang Tua / Wali</option>
                <option value="Beasiswa Yayasan / Ndalem">Beasiswa Yayasan / Ndalem</option>
                <option value="Bantuan PIP / KIP">Bantuan PIP / KIP</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kebutuhan Khusus</label>
              <input
                type="text"
                value={kebutuhanKhusus}
                onChange={(e) => setKebutuhanKhusus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kebutuhan Disabilitas</label>
              <input
                type="text"
                value={kebutuhanDisabilitas}
                onChange={(e) => setKebutuhanDisabilitas(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">No. HP / Email Santri (Opsional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={noHP}
                  onChange={(e) => setNoHP(e.target.value)}
                  placeholder="No. HP"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  type="email"
                  value={emailSantri}
                  onChange={(e) => setEmailSantri(e.target.value)}
                  placeholder="Email"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor KIP & Tahun (Jika Ada)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={nomorKIP}
                  onChange={(e) => setNomorKIP(e.target.value)}
                  placeholder="Nomor KIP"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  type="text"
                  value={tahunKIP}
                  onChange={(e) => setTahunKIP(e.target.value)}
                  placeholder="Tahun"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA ORANG TUA & DOKUMEN KK/KIP */}
      {activeTab === 'ortu' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
              <input
                type="text"
                value={noKK}
                onChange={(e) => setNoKK(e.target.value)}
                placeholder="16 Digit No. KK"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Keluarga (di KK)</label>
              <input
                type="text"
                value={namaKepalaKeluarga}
                onChange={(e) => setNamaKepalaKeluarga(e.target.value)}
                placeholder="Nama Ayah / Kepala Keluarga"
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Ayah / Wali Santri *</label>
              <input
                type="text"
                required
                value={namaWali}
                onChange={(e) => setNamaWali(e.target.value)}
                placeholder="Contoh: Bpk. H. Mustofa"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Wali *</label>
              <input
                type="text"
                required
                value={hpWali}
                onChange={(e) => setHpWali(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          {/* Upload Dokumen KK & KIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Unggah Scan Kartu Keluarga (PDF / JPG / PNG)</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, 'kk')}
                className="block w-full text-[11px] text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-800 file:text-white file:font-bold cursor-pointer"
              />
              {dokumenKKName && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-[11px] text-emerald-900 font-semibold">
                  <span className="truncate">✓ {dokumenKKName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDokumenKKUrl('');
                      setDokumenKKName('');
                    }}
                    className="text-rose-600 ml-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {dokumenKKUrl && dokumenKKUrl.startsWith('data:image') && (
                <img src={dokumenKKUrl} alt="Preview KK" className="h-24 w-auto rounded-lg border border-slate-200 object-cover" />
              )}
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-700" />
                <span>Unggah Scan Kartu KIP / PKH (Opsional)</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, 'kip')}
                className="block w-full text-[11px] text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-800 file:text-white file:font-bold cursor-pointer"
              />
              {dokumenKIPName && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-[11px] text-emerald-900 font-semibold">
                  <span className="truncate">✓ {dokumenKIPName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDokumenKIPUrl('');
                      setDokumenKIPName('');
                    }}
                    className="text-rose-600 ml-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA ALAMAT */}
      {activeTab === 'alamat' && (
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kecamatan / Kabupaten Asal *</label>
            <input
              type="text"
              required
              value={alamatAsal}
              onChange={(e) => setAlamatAsal(e.target.value)}
              placeholder="Contoh: Wonopringgo, Pekalongan"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap (Jalan / Dukuh / RT-RW / Desa)</label>
            <textarea
              rows={3}
              value={alamatDetail}
              onChange={(e) => setAlamatDetail(e.target.value)}
              placeholder="Dukuh, RT/RW, Desa, Kode Pos..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>
        </div>
      )}

      {/* TAB 4: AKTIVITAS BELAJAR */}
      {activeTab === 'aktivitas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kelas Madrasah Diniyah</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-emerald-900"
              >
                {DAFTAR_KELAS_DINIYAH.map((kls) => (
                  <option key={kls} value={kls}>
                    {kls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kamar Asrama</label>
              <input
                type="text"
                value={kamar}
                onChange={(e) => setKamar(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Wali Kelas Diniyah</label>
              <input
                type="text"
                value={waliKelas}
                onChange={(e) => setWaliKelas(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Aktivitas Pendidikan & Sekolah Formal</label>
            <input
              type="text"
              value={aktivitasPendidikan}
              onChange={(e) => setAktivitasPendidikan(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer font-semibold text-amber-900">
            <input
              type="checkbox"
              checked={isSantriNdalem}
              onChange={(e) => setIsSantriNdalem(e.target.checked)}
              className="rounded text-emerald-800"
            />
            <span>Santri Ndalem (Khidmah & Bebas Iuran Imtihan)</span>
          </label>
        </div>
      )}

      {/* Footer Submit Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <span className="text-[11px] text-slate-400">
          {mode === 'create' ? 'Menambahkan santri baru ke Buku Induk' : 'Memperbarui biodata EMIS santri'}
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitLabel}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
