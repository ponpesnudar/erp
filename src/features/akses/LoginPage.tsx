import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  X,
  UserCheck,
} from 'lucide-react';
import type { UserAccount } from '../../data/seed/pondokData.ts';
import { useAppStore } from '../../lib/store.ts';

interface LoginPageProps {
  onLoginSuccess: (targetTab?: string) => void;
  onBackToLanding: () => void;
}

function normalizeWaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62')) return '0' + digits.slice(2);
  return digits;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const { loginAs, userAccounts, isDemoMode, resetPasswordByWa } = useAppStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Rate Limiting (5 failed attempts -> lockout 60s)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Akun Demo drawer (visible only when isDemoMode === true)
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);
  const [demoSearch, setDemoSearch] = useState('');

  // WhatsApp OTP Reset Password Modal (NO window.alert!)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpStep, setOtpStep] = useState<'phone' | 'verify' | 'newpass' | 'done'>('phone');
  const [waNumber, setWaNumber] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTargetName, setOtpTargetName] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const performLogin = (targetTab?: string) => {
    setErrorMessage('');

    if (lockoutRemaining > 0) {
      setErrorMessage(`Terlalu banyak percobaan gagal. Silakan tunggu ${lockoutRemaining} detik.`);
      return;
    }

    if (!identifier.trim()) {
      setErrorMessage('Harap masukkan username, email, atau nomor WhatsApp Anda.');
      return;
    }

    if (!password) {
      setErrorMessage('Harap masukkan kata sandi Anda.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const cleanId = identifier.trim().toLowerCase();
      const normalizedWaInput = normalizeWaPhone(identifier.trim());

      const matched = userAccounts.find(
        (u) =>
          u.username.toLowerCase() === cleanId ||
          u.email.toLowerCase() === cleanId ||
          (normalizedWaInput.length >= 9 && normalizeWaPhone(u.noWa || '') === normalizedWaInput)
      );

      const expectedPass = matched?.password || 'darussalam2026';
      const validPass =
        password === expectedPass ||
        (isDemoMode && (password === 'darussalam2026' || password === '123456' || password === 'admin123'));

      if (matched && validPass) {
        loginAs(matched.id);
        setLoading(false);
        onLoginSuccess(targetTab);
      } else {
        const newFails = failedAttempts + 1;
        setFailedAttempts(newFails);
        setLoading(false);

        if (newFails >= 5) {
          setLockoutRemaining(60);
          setErrorMessage('Akun terkunci sementara karena 5 kali percobaan gagal. Tunggu 60 detik.');
        } else {
          setErrorMessage(
            `Kredensial tidak cocok (${newFails}/5). Periksa kembali username/email/WA & kata sandi Anda.`
          );
        }
      }
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin();
  };

  const handleFillDemo = (user: UserAccount) => {
    setIdentifier(user.username);
    setPassword(user.password || 'darussalam2026');
    setErrorMessage('');
  };

  const openForgotPasswordModal = () => {
    setShowOtpModal(true);
    setOtpStep('phone');
    setWaNumber('');
    setOtpInput('');
    setNewPassword('');
    setConfirmNewPassword('');
    setOtpError('');
    setGeneratedOtp('');
    setOtpTargetName('');
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    const norm = normalizeWaPhone(waNumber);
    if (norm.length < 9) {
      setOtpError('Masukkan nomor WhatsApp terdaftar yang valid (minimal 10 digit).');
      return;
    }
    const found = userAccounts.find((u) => normalizeWaPhone(u.noWa || '') === norm);
    if (!found) {
      setOtpError('Nomor WhatsApp tersebut belum terdaftar pada akun guru atau pengurus mana pun.');
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpTargetName(`${found.nama} (@${found.username})`);
    setOtpStep('verify');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otpInput.trim() !== generatedOtp) {
      setOtpError('Kode OTP tidak sesuai. Periksa kembali 6 digit kode OTP WhatsApp.');
      return;
    }
    setOtpStep('newpass');
  };

  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (newPassword.length < 6) {
      setOtpError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setOtpError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }
    const res = resetPasswordByWa(waNumber, newPassword);
    if (!res.success) {
      setOtpError(res.message);
      return;
    }
    if (res.user) {
      setIdentifier(res.user.username);
    }
    setOtpStep('done');
  };

  const filteredDemoUsers = userAccounts.filter((usr) => {
    if (!demoSearch.trim()) return true;
    const q = demoSearch.toLowerCase();
    return (
      usr.nama.toLowerCase().includes(q) ||
      usr.peranLabel.toLowerCase().includes(q) ||
      usr.username.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Panel: Islamic Green with Pattern (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#07432A] text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 hover:text-white transition bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Publik</span>
          </button>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/10 p-3 border border-white/20 backdrop-blur-xs flex items-center justify-center">
            <img
              src="/assets/aistudio/preview__14__3b7f388f.webp"
              alt="Logo Pondok"
              className="w-16 h-16 object-contain"
            />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              Sistem Informasi Terpadu ERP
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Pondok Pesantren NU Darussalam Karangdadap
            </h1>
            <p className="font-arabic text-lg text-emerald-200 pt-1 leading-relaxed">
              بالمعهد الإسلامي النهضي دار السلام كاراغداداف فكالوغان
            </p>
          </div>

          <p className="text-xs text-emerald-100 leading-relaxed">
            Portal ERP terpadu untuk dewan asatidz, panitia imtihan, bendahara, staf administrasi, serta wali santri dalam memantau nilai, absensi, dan transaksi santri secara real-time.
          </p>

          <div className="pt-4 border-t border-emerald-700/60 flex items-center gap-6 text-xs text-emerald-200">
            <div>
              <p className="text-lg font-bold text-amber-300 tabular-nums">100%</p>
              <p className="text-[10px] text-emerald-300">Aman &amp; Terenkripsi</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-300 tabular-nums">PWA</p>
              <p className="text-[10px] text-emerald-300">Siap Pasang di HP</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-300 tabular-nums">24 Jam</p>
              <p className="text-[10px] text-emerald-300">Server Pondok</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-emerald-300/80">
          © {new Date().getFullYear()} PP NU Darussalam Karangdadap Pekalongan. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Login Form & Demo Selector */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="flex lg:hidden items-center justify-between">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <img
              src="/assets/aistudio/preview__14__3b7f388f.webp"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk ke Portal ERP</h2>
            <p className="text-xs text-slate-500 mt-1">
              {isDemoMode
                ? 'Gunakan akun resmi pesantren, nomor WA terdaftar, atau pilih akun simulasi di bawah.'
                : 'Masukkan username, email, atau nomor WhatsApp terdaftar Anda untuk masuk.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username, Email, atau No. WhatsApp
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: pengasuh, 0812..., atau nama@darussalam.id"
                  disabled={loading || lockoutRemaining > 0}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pl-10 text-xs text-slate-800 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
                <button
                  type="button"
                  onClick={openForgotPasswordModal}
                  className="text-[11px] font-semibold text-emerald-800 hover:underline"
                >
                  Lupa kata sandi (OTP WhatsApp)?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  disabled={loading || lockoutRemaining > 0}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pl-10 pr-10 text-xs text-slate-800 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 w-4 h-4"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={loading || lockoutRemaining > 0}
                className="w-full rounded-xl bg-emerald-800 hover:bg-emerald-900 py-3 text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : lockoutRemaining > 0 ? (
                  <span>Terkunci ({lockoutRemaining}s)</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={loading || lockoutRemaining > 0}
                onClick={() => performLogin('sdm_absensi')}
                className="w-full rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 py-2.5 text-xs font-bold text-emerald-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Masuk Langsung ke Aplikasi Absensi Guru (HP)</span>
              </button>
            </div>
          </form>

          {/* Collapsible Akun Demo Box (Hidden automatically in Go-Live Mode) */}
          {isDemoMode && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-800"
              >
                <div className="flex items-center gap-2 text-emerald-900">
                  <KeyRound className="w-4 h-4 text-emerald-700" />
                  <span>Pilih Akun Demo &amp; Guru ({userAccounts.length} Akun)</span>
                </div>
                {showDemoAccounts ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showDemoAccounts && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <input
                    type="text"
                    value={demoSearch}
                    onChange={(e) => setDemoSearch(e.target.value)}
                    placeholder="Cari nama ustadz/ustadzah atau peran..."
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] focus:outline-hidden"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {filteredDemoUsers.map((usr) => (
                      <button
                        key={usr.id}
                        type="button"
                        onClick={() => handleFillDemo(usr)}
                        className="p-2 rounded-xl text-left border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 transition group flex items-start gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {usr.nama.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-slate-900 truncate group-hover:text-emerald-800">
                            {usr.nama}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{usr.peranLabel}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center text-xs text-slate-500 pt-2">
            Peran diatur secara otomatis dari kredensial akun. Pengguna dengan multi-peran dapat berganti peran di header setelah masuk.
          </div>
        </div>
      </div>

      {/* Modal Lupa Kata Sandi — 3-Step OTP WhatsApp Verification */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Reset Kata Sandi via OTP WhatsApp
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{otpError}</span>
              </div>
            )}

            {otpStep === 'phone' && (
              <form onSubmit={handleRequestOtp} className="space-y-3">
                <p className="text-slate-600">
                  Masukkan nomor WhatsApp yang terdaftar di profil akun guru atau staf pondok untuk menerima kode verifikasi OTP.
                </p>
                <div>
                  <label className="block font-bold mb-1">Nomor WhatsApp Terdaftar</label>
                  <input
                    type="text"
                    required
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                  >
                    Kirim Kode OTP
                  </button>
                </div>
              </form>
            )}

            {otpStep === 'verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <p className="font-bold">Akun Ditemukan: {otpTargetName}</p>
                  <p>
                    Kode OTP terkirim ke WhatsApp <strong>{waNumber}</strong> (Simulasi Kode OTP:{' '}
                    <span className="font-mono font-black bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                      {generatedOtp}
                    </span>
                    ).
                  </p>
                </div>
                <div>
                  <label className="block font-bold mb-1">Masukkan 6 Digit Kode OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="6 digit kode OTP"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-center font-mono text-base tracking-widest font-bold"
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpStep('phone')}
                    className="px-3 py-2 rounded-xl bg-slate-100 font-bold"
                  >
                    Ganti Nomor WA
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                  >
                    Verifikasi OTP
                  </button>
                </div>
              </form>
            )}

            {otpStep === 'newpass' && (
              <form onSubmit={handleSaveResetPassword} className="space-y-3">
                <p className="text-slate-600">
                  Verifikasi berhasil! Silakan buat kata sandi baru untuk <strong>{otpTargetName}</strong>.
                </p>
                <div>
                  <label className="block font-bold mb-1">Kata Sandi Baru</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full rounded-xl border border-slate-300 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Ulangi Kata Sandi Baru</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    className="w-full rounded-xl border border-slate-300 p-2.5"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                  >
                    Simpan Kata Sandi Baru
                  </button>
                </div>
              </form>
            )}

            {otpStep === 'done' && (
              <div className="space-y-3 text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm text-slate-900">Kata Sandi Berhasil Diperbarui!</p>
                <p className="text-slate-600">
                  Silakan masuk kembali menggunakan username <strong>{identifier}</strong> dan kata sandi baru Anda.
                </p>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                >
                  Tutup &amp; Masuk
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
