import { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function CreateOwnerModal({ isOpen, onClose }) {
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        address: '',
        avatar: null,
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
            setAvatarPreview(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setData('avatar', null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.owners.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-modal my-8">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-muted hover:bg-surface-secondary hover:text-heading transition"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="flex items-start gap-3 border-b border-border pb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-heading text-xl font-bold text-heading">
                            Tambah Akun Owner Baru
                        </h2>
                        <p className="mt-0.5 text-xs text-muted">
                            Buat akun pemilik kost secara manual. Akun akan langsung aktif dan terverifikasi.
                        </p>
                    </div>
                </div>

                {/* Auto Badge Notice */}
                <div className="my-4 flex flex-wrap items-center gap-2 rounded-xl bg-primary-light/60 p-3 text-xs text-body border border-primary/10">
                    <span className="font-medium text-primary flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Konfigurasi Otomatis:
                    </span>
                    <span className="badge badge-primary">Role: Owner</span>
                    <span className="badge badge-success">Status: Aktif</span>
                    <span className="badge badge-accent">Sumber: Dibuat oleh Admin</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Foto Profil (Opsional) */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                            Foto Profil (Opsional)
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-secondary">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <svg className="h-8 w-8 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="btn btn-secondary text-xs py-1.5 px-3"
                                    >
                                        Pilih Foto
                                    </button>
                                    {avatarPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="text-xs text-danger hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                                <span className="text-[11px] text-muted">Format: JPG, PNG, WEBP. Maks 2MB.</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </div>
                        {errors.avatar && <p className="mt-1 text-xs text-danger">{errors.avatar}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Nama Lengkap * */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Nama Lengkap <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Budi Santoso"
                                className="input text-sm"
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
                        </div>

                        {/* Email * */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Email <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="budi@example.com"
                                className="input text-sm"
                                required
                            />
                            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Nomor HP * */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Nomor HP / WhatsApp <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Contoh: 081234567890"
                                className="input text-sm"
                                required
                            />
                            {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
                        </div>

                        {/* Alamat */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Alamat Domisili
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Contoh: Jl. Pahlawan No. 25, Madiun"
                                className="input text-sm"
                            />
                            {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Password * */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Password <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                                className="input text-sm"
                                required
                            />
                            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
                        </div>

                        {/* Konfirmasi Password * */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Konfirmasi Password <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi password di atas"
                                className="input text-sm"
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-xs text-danger">{errors.password_confirmation}</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={processing}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Membuat Akun...
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Buat Akun Owner
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
