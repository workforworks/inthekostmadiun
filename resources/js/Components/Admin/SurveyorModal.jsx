import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function SurveyorModal({ isOpen, onClose, surveyor = null }) {
    const isEdit = Boolean(surveyor);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        phone: '',
        area: '',
        is_active: true,
        notes: '',
    });

    useEffect(() => {
        if (surveyor) {
            setData({
                name: surveyor.name || '',
                phone: surveyor.phone || '',
                area: surveyor.area || '',
                is_active: surveyor.is_active ?? true,
                notes: surveyor.notes || '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [surveyor, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.surveyors.update', surveyor.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('admin.surveyors.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-modal transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h3 className="font-heading text-lg font-bold text-heading">
                        {isEdit ? 'Edit Data Surveyor' : 'Tambah Surveyor Baru'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-muted transition hover:bg-surface-secondary hover:text-heading"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nama */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Nama Lengkap <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Budi Santoso"
                            className={`input ${errors.name ? 'border-danger focus:border-danger' : ''}`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-danger">{errors.name}</p>
                        )}
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Nomor WhatsApp <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Contoh: 081234567890"
                            className={`input ${errors.phone ? 'border-danger focus:border-danger' : ''}`}
                        />
                        <p className="mt-1 text-xs text-muted">Format: 08xxx atau 628xxx</p>
                        {errors.phone && (
                            <p className="mt-1 text-xs text-danger">{errors.phone}</p>
                        )}
                    </div>

                    {/* Wilayah Tugas */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Wilayah Tugas / Operasional <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.area}
                            onChange={(e) => setData('area', e.target.value)}
                            placeholder="Contoh: Madiun Kota, Taman, Kartoharjo"
                            className={`input ${errors.area ? 'border-danger focus:border-danger' : ''}`}
                        />
                        {errors.area && (
                            <p className="mt-1 text-xs text-danger">{errors.area}</p>
                        )}
                    </div>

                    {/* Status Aktif */}
                    <div className="flex items-center gap-3 py-1">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-heading select-none cursor-pointer">
                            Surveyor Aktif (Tersedia untuk penugasan)
                        </label>
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Catatan Tambahan (Opsional)
                        </label>
                        <textarea
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Keterangan jadwal/ketersediaan/wilayah prioritas..."
                            className="input resize-none"
                        />
                        {errors.notes && (
                            <p className="mt-1 text-xs text-danger">{errors.notes}</p>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : isEdit ? 'Simpan Perubahan' : 'Tambah Surveyor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
