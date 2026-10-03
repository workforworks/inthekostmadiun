import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function SurveyChecklistModal({ isOpen, onClose, checklist = null, categories = [] }) {
    const isEdit = Boolean(checklist);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        category: 'room',
        description: '',
        order: 0,
        is_active: true,
    });

    useEffect(() => {
        if (checklist) {
            setData({
                name: checklist.name || '',
                category: checklist.category || 'room',
                description: checklist.description || '',
                order: checklist.order ?? 0,
                is_active: checklist.is_active ?? true,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [checklist, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.survey-checklists.update', checklist.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('admin.survey-checklists.store'), {
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
                        {isEdit ? 'Edit Poin Checklist' : 'Tambah Poin Checklist Baru'}
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
                    {/* Kategori Checklist */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Kategori Area Checklist <span className="text-danger">*</span>
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className={`input cursor-pointer ${errors.category ? 'border-danger focus:border-danger' : ''}`}
                        >
                            {categories.map((cat) => (
                                <option key={cat.key} value={cat.key}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-xs text-danger">{errors.category}</p>
                        )}
                    </div>

                    {/* Nama Poin Checklist */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Nama Poin Checklist <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Kondisi Air & Kloset"
                            className={`input ${errors.name ? 'border-danger focus:border-danger' : ''}`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-danger">{errors.name}</p>
                        )}
                    </div>

                    {/* Urutan Tampil (Order) */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Urutan Tampil (Urutan Posisi)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.order}
                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className={`input ${errors.order ? 'border-danger focus:border-danger' : ''}`}
                        />
                        <p className="mt-1 text-xs text-muted">Makin kecil nilainya, makin atas posisinya pada laporan survey.</p>
                        {errors.order && (
                            <p className="mt-1 text-xs text-danger">{errors.order}</p>
                        )}
                    </div>

                    {/* Status Aktif */}
                    <div className="flex items-center gap-3 py-1">
                        <input
                            type="checkbox"
                            id="checklist_is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="checklist_is_active" className="text-sm font-medium text-heading select-none cursor-pointer">
                            Poin Checklist Aktif (Digunakan dalam laporan survey)
                        </label>
                    </div>

                    {/* Deskripsi / Petunjuk Survey */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Deskripsi / Petunjuk Pemeriksaan (Opsional)
                        </label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Petunjuk detail untuk surveyor saat memeriksa poin ini..."
                            className="input resize-none"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-danger">{errors.description}</p>
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
                            ) : isEdit ? 'Simpan Perubahan' : 'Tambah Poin Checklist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
