import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import SurveyorModal from '@/Components/Admin/SurveyorModal';

export default function Index({ surveyors, filters }) {
    const { flash } = usePage().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSurveyor, setSelectedSurveyor] = useState(null);

    // Delete confirmation state
    const [deleteSurveyor, setDeleteSurveyor] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.surveyors.index'), { search, status }, { preserveState: true, replace: true });
    };

    const handleStatusFilterChange = (newStatus) => {
        setStatus(newStatus);
        router.get(route('admin.surveyors.index'), { search, status: newStatus }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setSelectedSurveyor(null);
        setIsModalOpen(true);
    };

    const openEditModal = (surveyor) => {
        setSelectedSurveyor(surveyor);
        setIsModalOpen(true);
    };

    const handleToggleStatus = (surveyor) => {
        router.patch(route('admin.surveyors.toggle-status', surveyor.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteSurveyor) return;
        setIsDeleting(true);
        router.delete(route('admin.surveyors.destroy', deleteSurveyor.id), {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteSurveyor(null);
            },
        });
    };

    const formatWhatsAppUrl = (phone) => {
        let cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.substring(1);
        }
        return `https://wa.me/${cleanPhone}`;
    };

    return (
        <AuthDashboardLayout header="Manajemen Surveyor">
            <Head title="Manajemen Surveyor — Admin" />

            <div className="p-4 sm:p-6 space-y-6 theme-admin">
                {/* Flash Message Banner */}
                {flash?.success && (
                    <div className="flex items-center justify-between rounded-xl bg-success-light p-4 text-sm font-semibold text-success-dark shadow-sm border border-success/20 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* Header Action & Info */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-heading">
                            Daftar Surveyor Lapangan
                        </h1>
                        <p className="mt-1 text-sm text-body">
                            Kelola data surveyor eksternal yang bertugas melakukan survey fisik kost di Madiun.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="btn btn-primary self-start sm:self-auto shrink-0 shadow-sm"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tambah Surveyor</span>
                    </button>
                </div>

                {/* Filters & Search Bar */}
                <div className="card p-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, WhatsApp, atau wilayah..."
                                className="input pl-9"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={status}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                className="input w-40 cursor-pointer"
                            >
                                <option value="all">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Non-Aktif</option>
                            </select>

                            <button type="submit" className="btn btn-secondary">
                                Cari
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table List */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="table-header">
                                    <th>Nama Surveyor</th>
                                    <th>WhatsApp</th>
                                    <th>Wilayah Tugas</th>
                                    <th>Status</th>
                                    <th>Catatan</th>
                                    <th className="text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {surveyors.data.length > 0 ? (
                                    surveyors.data.map((surveyor) => (
                                        <tr key={surveyor.id} className="table-row">
                                            <td className="font-semibold text-heading">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary font-bold text-sm">
                                                        {surveyor.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span>{surveyor.name}</span>
                                                        <span className="block text-xs text-muted font-normal md:hidden">
                                                            {surveyor.area}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <a
                                                    href={formatWhatsAppUrl(surveyor.phone)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 font-medium text-success hover:underline"
                                                    title="Hubungi via WhatsApp"
                                                >
                                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                                    </svg>
                                                    <span>{surveyor.phone}</span>
                                                </a>
                                            </td>

                                            <td className="font-medium text-body">
                                                {surveyor.area}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(surveyor)}
                                                    title="Klik untuk mengubah status"
                                                    className="cursor-pointer"
                                                >
                                                    {surveyor.is_active ? (
                                                        <span className="badge badge-success">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-success-dark"></span>
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-neutral">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-muted"></span>
                                                            Non-Aktif
                                                        </span>
                                                    )}
                                                </button>
                                            </td>

                                            <td className="max-w-xs truncate text-xs text-muted" title={surveyor.notes || '-'}>
                                                {surveyor.notes || '-'}
                                            </td>

                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(surveyor)}
                                                        className="btn btn-ghost p-1.5 text-body hover:text-primary"
                                                        title="Edit Surveyor"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteSurveyor(surveyor)}
                                                        className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                                                        title="Hapus Surveyor"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <svg className="h-10 w-10 text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="font-semibold text-heading">Tidak ada data surveyor.</span>
                                                <span className="text-xs">Coba sesuaikan pencarian atau tambahkan surveyor baru.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {surveyors.links && surveyors.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
                            <div className="text-xs text-muted">
                                Menampilkan <span className="font-semibold text-heading">{surveyors.from || 0}</span> - <span className="font-semibold text-heading">{surveyors.to || 0}</span> dari <span className="font-semibold text-heading">{surveyors.total}</span> data
                            </div>
                            <div className="flex items-center gap-1">
                                {surveyors.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${link.active
                                            ? 'bg-primary text-on-primary'
                                            : link.url
                                                ? 'text-body hover:bg-surface-secondary'
                                                : 'text-muted/40 cursor-not-allowed'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create / Edit Modal */}
            <SurveyorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                surveyor={selectedSurveyor}
            />

            {/* Delete Confirmation Modal */}
            {deleteSurveyor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-modal">
                        <div className="flex items-center gap-3 text-danger mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-light">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="font-heading text-lg font-bold text-heading">Konfirmasi Hapus</h3>
                        </div>
                        <p className="text-sm text-body mb-6">
                            Apakah Anda yakin ingin menghapus data surveyor <strong className="text-heading">{deleteSurveyor.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteSurveyor(null)}
                                className="btn btn-secondary"
                                disabled={isDeleting}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                className="btn btn-danger"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Menghapus...' : 'Hapus Data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthDashboardLayout>
    );
}
