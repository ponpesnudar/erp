import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  UserCheck,
  Upload,
  FileText,
  X,
} from 'lucide-react';
import { useAppStore, PSBApplicant } from '../../lib/store.ts';

export const PSBModule: React.FC = () => {
  const { psbList, addPSBApplicant, verifyPSB, convertPSBToSantri, currentTahunAjaran } =
    useAppStore();

  const [activeTab, setActiveTab] = useState<'verifikasi' | 'form_baru'>('verifikasi');

  // Form New Applicant State (Basic + EMIS)
  const [formNama, setFormNama] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formNoKK, setFormNoKK] = useState('');
  const [formKepalaKeluarga, setFormKepalaKeluarga] = useState('');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formTempatLahir, setFormTempatLahir] = useState('Pekalongan');
  const [formTanggalLahir, setFormTanggalLahir] = useState('2012-05-10');
  const [formAnakKe, setFormAnakKe] = useState(1);
  const [formJumlahSaudara, setFormJumlahSaudara] = useState(2);
  const [formCitaCita, setFormCitaCita] = useState('Ulama / Pendidik');
  const [formHobi, setFormHobi] = useState('Membaca Kitab');
  const [formNomorKIP, setFormNomorKIP] = useState('');
  const [formNamaWali, setFormNamaWali] = useState('');
  const [formHpWali, setFormHpWali] = useState('');
  const [formAlamat, setFormAlamat] = useState('');
  const [formAsalSekolah, setFormAsalSekolah] = useState('');
  const [formPilihanJenjang, setFormPilihanJenjang] = useState(
    'Madrasah Diniyah Salafiyah (Tingkat 1)'
  );
  const [formNominal, setFormNominal] = useState(150000);
  const [dokumenKKUrl, setDokumenKKUrl] = useState('');
  const [dokumenKKName, setDokumenKKName] = useState('');
  const [dokumenKIPUrl, setDokumenKIPUrl] = useState('');
  const [dokumenKIPName, setDokumenKIPName] = useState('');

  // Convert to Santri Modal & Document Preview Modal
  const [convertingApp, setConvertingApp] = useState<PSBApplicant | null>(null);
  const [previewApp, setPreviewApp] = useState<PSBApplicant | null>(null);
  const [assignKelas, setAssignKelas] = useState('1 A PUTRA');
  const [assignKamar, setAssignKamar] = useState('Al-Falah 1');
  const [createdNisToast, setCreatedNisToast] = useState<string>('');

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formNamaWali.trim()) return;

    addPSBApplicant({
      nama: formNama,
      nik: formNik,
      nisn: formNisn,
      noKK: formNoKK,
      namaKepalaKeluarga: formKepalaKeluarga,
      anakKe: formAnakKe,
      jumlahSaudara: formJumlahSaudara,
      citaCita: formCitaCita,
      hobi: formHobi,
      nomorKIP: formNomorKIP,
      dokumenKKUrl,
      dokumenKKName,
      dokumenKIPUrl,
      dokumenKIPName,
      gender: formGender,
      tempatLahir: formTempatLahir,
      tanggalLahir: formTanggalLahir,
      namaWali: formNamaWali,
      hpWali: formHpWali,
      alamat: formAlamat,
      asalSekolah: formAsalSekolah,
      pilihanJenjang: formPilihanJenjang,
      nominalTransfer: formNominal,
      berkasLengkap: Boolean(dokumenKKUrl || formNik),
    });

    setCreatedNisToast(`Formulir EMIS pendaftaran atas nama ${formNama} berhasil didaftarkan.`);
    setTimeout(() => setCreatedNisToast(''), 4000);
    setActiveTab('verifikasi');
    setFormNama('');
    setFormNik('');
    setFormNamaWali('');
    setDokumenKKUrl('');
    setDokumenKKName('');
    setDokumenKIPUrl('');
    setDokumenKIPName('');
  };

  const handleConfirmConvert = () => {
    if (!convertingApp) return;
    const newNis = convertPSBToSantri(convertingApp.id, assignKelas, assignKamar);
    setCreatedNisToast(
      `Alhamdulillah! ${convertingApp.nama} resmi menjadi santri aktif dengan NIS: ${newNis} di kamar ${assignKamar}.`
    );
    setTimeout(() => setCreatedNisToast(''), 6000);
    setConvertingApp(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-700" />
            <span>Penerimaan Santri Baru (PSB Online · Format EMIS)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Pendaftaran biodata EMIS + unggah KK/KIP, verifikasi berkas, penetapan kamar, dan penerbitan NIS otomatis.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('verifikasi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'verifikasi'
                ? 'bg-emerald-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Antrean Verifikasi ({psbList.filter((p) => p.status === 'Menunggu Verifikasi').length})
          </button>
          <button
            onClick={() => setActiveTab('form_baru')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'form_baru'
                ? 'bg-emerald-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Formulir Pendaftar Baru
          </button>
        </div>
      </div>

      {createdNisToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{createdNisToast}</span>
        </div>
      )}

      {/* TAB: VERIFIKASI ANTREAN PSB */}
      {activeTab === 'verifikasi' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Daftar Calon Santri Baru T.A. {currentTahunAjaran}
            </h3>
            <span className="text-xs text-slate-500">Total: {psbList.length} Pendaftar</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-left">
                  <th className="py-2.5">Nama Calon Santri</th>
                  <th className="py-2.5">Gender / Asal</th>
                  <th className="py-2.5">Nama Wali & No. HP</th>
                  <th className="py-2.5">Berkas KK/KIP</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {psbList.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">
                      {app.nama}
                      <span className="block text-[10px] text-slate-400 font-normal tabular-nums">
                        NIK: {app.nik || '-'} {app.nisn ? `· NISN: ${app.nisn}` : ''}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">
                      {app.gender === 'L' ? 'Putra' : 'Putri'} · {app.tempatLahir}
                    </td>
                    <td className="py-3 text-slate-700">
                      {app.namaWali}
                      <span className="block text-[10px] text-slate-400">{app.hpWali}</span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => setPreviewApp(app)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Lihat Berkas</span>
                      </button>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Resmi Santri'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Diterima'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {app.status !== 'Resmi Santri' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => verifyPSB(app.id, 'Diterima')}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold"
                          >
                            Terima
                          </button>
                          <button
                            onClick={() => {
                              setConvertingApp(app);
                              setAssignKelas(app.gender === 'L' ? '1 A PUTRA' : '1 A PUTRI');
                              setAssignKamar(app.gender === 'L' ? 'Al-Falah 1' : 'Fatimah 1');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Jadikan Santri</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-800 font-bold">
                          ✓ Terdaftar di Master Data
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: FORM PENDAFTAR BARU (EMIS + UPLOAD KK/KIP) */}
      {activeTab === 'form_baru' && (
        <form
          onSubmit={handleFormSubmit}
          className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5 max-w-4xl mx-auto"
        >
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Formulir Pendaftaran Calon Santri Baru (PSB Online · Standar EMIS)
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              NIK: {formNik.length}/16 Digit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Santri *</label>
              <input
                type="text"
                required
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Sesuai Akta / KK"
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
              <input
                type="text"
                maxLength={16}
                value={formNik}
                onChange={(e) => setFormNik(e.target.value.replace(/\D/g, ''))}
                placeholder="16 Digit NIK di KK"
                className="w-full rounded-xl border border-slate-300 p-2 tabular-nums"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NISN (Jika Ada)</label>
              <input
                type="text"
                value={formNisn}
                onChange={(e) => setFormNisn(e.target.value)}
                placeholder="10 Digit NISN"
                className="w-full rounded-xl border border-slate-300 p-2 tabular-nums"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={formGender}
                onChange={(e) => setFormGender(e.target.value as 'L' | 'P')}
                className="w-full rounded-xl border border-slate-300 p-2"
              >
                <option value="L">Putra (Laki-laki)</option>
                <option value="P">Putri (Perempuan)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={formTempatLahir}
                onChange={(e) => setFormTempatLahir(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={formTanggalLahir}
                onChange={(e) => setFormTanggalLahir(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">No. Kartu Keluarga (KK)</label>
              <input
                type="text"
                value={formNoKK}
                onChange={(e) => setFormNoKK(e.target.value)}
                placeholder="16 Digit Nomor KK"
                className="w-full rounded-xl border border-slate-300 p-2 tabular-nums"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Keluarga</label>
              <input
                type="text"
                value={formKepalaKeluarga}
                onChange={(e) => setFormKepalaKeluarga(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Asal Sekolah Sebelumnya</label>
              <input
                type="text"
                value={formAsalSekolah}
                onChange={(e) => setFormAsalSekolah(e.target.value)}
                placeholder="MI / SD / MTs Asal"
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Anak Ke / Jml Saudara</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={formAnakKe}
                  onChange={(e) => setFormAnakKe(parseInt(e.target.value) || 1)}
                  className="w-1/2 rounded-xl border border-slate-300 p-2 text-center"
                />
                <span className="text-slate-400">dari</span>
                <input
                  type="number"
                  min={1}
                  value={formJumlahSaudara}
                  onChange={(e) => setFormJumlahSaudara(parseInt(e.target.value) || 1)}
                  className="w-1/2 rounded-xl border border-slate-300 p-2 text-center"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cita-cita & Hobi</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formCitaCita}
                  onChange={(e) => setFormCitaCita(e.target.value)}
                  placeholder="Cita-cita"
                  className="w-1/2 rounded-xl border border-slate-300 p-2"
                />
                <input
                  type="text"
                  value={formHobi}
                  onChange={(e) => setFormHobi(e.target.value)}
                  placeholder="Hobi"
                  className="w-1/2 rounded-xl border border-slate-300 p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor KIP (Opsional)</label>
              <input
                type="text"
                value={formNomorKIP}
                onChange={(e) => setFormNomorKIP(e.target.value)}
                placeholder="Jika penerima KIP"
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua / Wali *</label>
              <input
                type="text"
                required
                value={formNamaWali}
                onChange={(e) => setFormNamaWali(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Wali *</label>
              <input
                type="text"
                required
                value={formHpWali}
                onChange={(e) => setFormHpWali(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nominal Infaq Pendaftaran</label>
              <input
                type="number"
                value={formNominal}
                onChange={(e) => setFormNominal(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">Alamat Asal Lengkap</label>
            <textarea
              rows={2}
              value={formAlamat}
              onChange={(e) => setFormAlamat(e.target.value)}
              placeholder="Desa, Kecamatan, Kabupaten..."
              className="w-full rounded-xl border border-slate-300 p-2"
            />
          </div>

          {/* Upload Berkas KK & KIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-700" />
                <span>Unggah Foto / Scan Kartu Keluarga (KK)</span>
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileUpload(e, 'kk')}
                className="block w-full text-xs text-slate-600"
              />
              {dokumenKKName && (
                <p className="text-[11px] font-bold text-emerald-700">✓ Terunggah: {dokumenKKName}</p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-700" />
                <span>Unggah Foto KIP / KKS (Jika Ada)</span>
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileUpload(e, 'kip')}
                className="block w-full text-xs text-slate-600"
              />
              {dokumenKIPName && (
                <p className="text-[11px] font-bold text-emerald-700">✓ Terunggah: {dokumenKIPName}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition"
          >
            Kirim Pendaftaran Calon Santri (EMIS)
          </button>
        </form>
      )}

      {/* Modal Preview Berkas */}
      {previewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                Berkas Pendaftaran: {previewApp.nama}
              </h3>
              <button onClick={() => setPreviewApp(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl">
              <p>NIK: <strong>{previewApp.nik || '-'}</strong> | NISN: <strong>{previewApp.nisn || '-'}</strong></p>
              <p>No. KK: <strong>{previewApp.noKK || '-'}</strong> | Kepala Keluarga: <strong>{previewApp.namaKepalaKeluarga || '-'}</strong></p>
              <p>Asal Sekolah: <strong>{previewApp.asalSekolah || '-'}</strong> | Nomor KIP: <strong>{previewApp.nomorKIP || '-'}</strong></p>
            </div>
            {previewApp.dokumenKKUrl ? (
              <div>
                <p className="font-bold mb-1">Lampiran KK ({previewApp.dokumenKKName}):</p>
                <img
                  src={previewApp.dokumenKKUrl}
                  alt="Lampiran KK"
                  className="max-h-60 rounded-xl border border-slate-200 object-contain"
                />
              </div>
            ) : (
              <p className="text-slate-500 italic">Belum ada lampiran gambar KK yang diunggah.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal: Jadikan Santri Resmi */}
      {convertingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-700" />
              <span>Pengesahan Menjadi Santri Aktif</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem akan membuat <strong>Nomor Induk Santri (NIS)</strong> secara otomatis dan memindahkan seluruh biodata EMIS ke Master Data Santri.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <p>Nama: <strong>{convertingApp.nama}</strong></p>
              <p>Gender: <strong>{convertingApp.gender === 'L' ? 'Putra' : 'Putri'}</strong></p>
              <p>Wali: <strong>{convertingApp.namaWali}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tetapkan Kelas Diniyah (MDS)
              </label>
              <select
                value={assignKelas}
                onChange={(e) => setAssignKelas(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold text-emerald-900"
              >
                {convertingApp.gender === 'L' ? (
                  <>
                    <option value="1 A PUTRA">1 A PUTRA</option>
                    <option value="1 B PUTRA">1 B PUTRA</option>
                    <option value="2 A PUTRA">2 A PUTRA</option>
                    <option value="2 B PUTRA">2 B PUTRA</option>
                    <option value="3 A PUTRA">3 A PUTRA</option>
                    <option value="3 B PUTRA">3 B PUTRA</option>
                    <option value="4 A PUTRA">4 A PUTRA</option>
                    <option value="5 A PUTRA & PUTRI">5 A PUTRA &amp; PUTRI</option>
                    <option value="6 A PUTRA & PUTRI">6 A PUTRA &amp; PUTRI</option>
                  </>
                ) : (
                  <>
                    <option value="1 A PUTRI">1 A PUTRI</option>
                    <option value="1 B PUTRI">1 B PUTRI</option>
                    <option value="2 A PUTRI">2 A PUTRI</option>
                    <option value="2 B PUTRI">2 B PUTRI</option>
                    <option value="2 C PUTRI">2 C PUTRI</option>
                    <option value="3 A PUTRI">3 A PUTRI</option>
                    <option value="4 A PUTRI">4 A PUTRI</option>
                    <option value="5 A PUTRA & PUTRI">5 A PUTRA &amp; PUTRI</option>
                    <option value="6 A PUTRA & PUTRI">6 A PUTRA &amp; PUTRI</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tetapkan Kamar Asrama Santri
              </label>
              <select
                value={assignKamar}
                onChange={(e) => setAssignKamar(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold text-emerald-900"
              >
                {convertingApp.gender === 'L' ? (
                  <>
                    <option value="Al-Falah 1">Asrama Putra: Al-Falah 1</option>
                    <option value="An-Nur 1">Asrama Putra: An-Nur 1</option>
                    <option value="Al-Ikhlas 1">Asrama Putra: Al-Ikhlas 1</option>
                  </>
                ) : (
                  <>
                    <option value="Fatimah 1">Asrama Putri: Fatimah 1</option>
                    <option value="Aisyah 1">Asrama Putri: Aisyah 1</option>
                    <option value="Khadijah 1">Asrama Putri: Khadijah 1</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setConvertingApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmConvert}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
              >
                Sahkan & Terbitkan NIS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
