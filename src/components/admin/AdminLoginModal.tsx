import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useChurchContent, DEFAULT_ADMIN_PASSWORD } from '../../context/ChurchContentContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin } = useChurchContent();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Silakan masukkan kata sandi admin.');
      return;
    }

    setIsSubmitting(true);
    const success = loginAdmin(password.trim());
    setIsSubmitting(false);

    if (success) {
      setPassword('');
      setError('');
      onClose();
      onSuccess();
    } else {
      setError('Kata sandi admin tidak sesuai. Silakan periksa kembali.');
    }
  };

  const handleUseDefault = () => {
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-gray-100 shadow-2xl relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
      >
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h2 id="admin-login-title" className="text-xl font-bold text-gray-900 tracking-tight">
            Portal Admin & Pengurus
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Halaman ini khusus untuk pengurus gereja guna mengelola konten, warta, jadwal ibadah, dan agenda.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
              <span>Kata Sandi Admin</span>
              <button
                type="button"
                onClick={handleUseDefault}
                className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
              >
                Gunakan default ({DEFAULT_ADMIN_PASSWORD})
              </button>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Masukkan kata sandi..."
                className="pl-9 pr-10 py-2 text-sm rounded-xl border-gray-300 focus:ring-primary focus:border-primary w-full"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Masuk & Buka Editor Konten
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              Batal / Kembali ke Halaman Utama
            </Button>
          </div>
        </form>

        {/* Security Note */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kata sandi dapat diganti sewaktu-waktu di menu pengaturan admin.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
