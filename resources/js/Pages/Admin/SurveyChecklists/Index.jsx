import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import SurveyChecklistModal from '@/Components/Admin/SurveyChecklistModal';

export default function Index({ checklists, filters, categories }) {
    const { flash } = usePage().props;

    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChecklist, setSelectedChecklist] = useState(null);

    // Delete confirmation state
    const [deleteChecklist, setDeleteChecklist] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.survey-checklists.index'), { search, category, status }, { preserveState: true, replace: true });
    };

    const handleCategoryChange = (newCat) => {
        setCategory(newCat);
        router.get(route('admin.survey-checklists.index'), { search, category: newCat, status }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        router.get(route('admin.survey-checklists.index'), { search, category, status: newStatus }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setSelectedChecklist(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setSelectedChecklist(item);
        setIsModalOpen(true);
    };

    const handleToggleStatus = (item) => {
        router.patch(route('admin.survey-checklists.toggle-status', item.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteChecklist) return;
        setIsDeleting(true);
        router.delete(route('admin.survey-checklists.destroy', deleteChecklist.id), {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteChecklist(null);
            },
        });
    };

    const getCategoryBadgeClass = (catKey) => {
        switch (catKey) {
            case 'room':
                return 'badge-primary';
            case 'bathroom':
                return 'badge-accent';
            case 'facility':
                return 'badge-success';
            case 'environment':
                return 'badge-warning';
            default:
                return 'badge-neutral';
        }
    };

    const getCategoryLabel = (catKey) => {
        const cat = categories.find((c) => c.key === catKey);
        return cat ? cat.label : catKey;
    };

    return (
        <AuthDashboardLayout header="Checklist Survey">
            <Head title="Master Checklist Survey — Admin" />

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
                            Master Checklist Survey Kost
                        </h1>
                        <p className="mt-1 text-sm text-body">
                            Kelola template poin checklist pemeriksaan fisik kost (Kamar, Kamar Mandi, Fasilitas Umum, & Lingkungan).
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
                        <span>Tambah Poin Checklist</span>
                    </button>
                </div>

                {/* Category Quick Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => handleCategoryChange('all')}
                        className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${category === 'all'
                                ? 'bg-primary text-on-primary shadow-xs'
                                : 'bg-surface text-body hover:bg-surface-secondary hover:text-heading border border-border'
                            }`}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            type="button"
                            onClick={() => handleCategoryChange(cat.key)}
                            className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${category === cat.key
                                    ? 'bg-primary text-on-primary shadow-xs'
                                    : 'bg-surface text-body hover:bg-surface-secondary hover:text-heading border border-border'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Search & Status Filter Bar */}
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
                                placeholder="Cari nama poin atau petunjuk survey..."
                                className="input pl-9"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
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
                                    <th>Urutan</th>
                                    <th>Kategori</th>
                                    <th>Nama Poin Checklist</th>
                                    <th>Petunjuk / Deskripsi</th>
                                    <th>Status</th>
                                    <th className="text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {checklists.data.length > 0 ? (
                                    checklists.data.map((item) => (
                                        <tr key={item.id} className="table-row">
                                            <td className="font-semibold text-muted text-xs">
                                                #{item.order}
                                            </td>

                                            <td>
                                                <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
                                                    {getCategoryLabel(item.category)}
                                                </span>
                                            </td>

                                            <td className="font-semibold text-heading">
                                                {item.name}
                                            </td>

                                            <td className="max-w-xs truncate text-xs text-muted" title={item.description || '-'}>
                                                {item.description || '-'}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(item)}
                                                    title="Klik untuk mengubah status"
                                                    className="cursor-pointer"
                                                >
                                                    {item.is_active ? (
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

                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(item)}
                                                        className="btn btn-ghost p-1.5 text-body hover:text-primary"
                                                        title="Edit Poin Checklist"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteChecklist(item)}
                                                        className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                                                        title="Hapus Poin Checklist"
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <span className="font-semibold text-heading">Tidak ada poin checklist.</span>
                                                <span className="text-xs">Coba sesuaikan filter atau tambahkan poin checklist baru.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {checklists.links && checklists.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
                            <div className="text-xs text-muted">
                                Menampilkan <span className="font-semibold text-heading">{checklists.from || 0}</span> - <span className="font-semibold text-heading">{checklists.to || 0}</span> dari <span className="font-semibold text-heading">{checklists.total}</span> data
                            </div>
                            <div className="flex items-center gap-1">
                                {checklists.links.map((link, idx) => (
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
            <SurveyChecklistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                checklist={selectedChecklist}
                categories={categories}
            />

            {/* Delete Confirmation Modal */}
            {deleteChecklist && (
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
                            Apakah Anda yakin ingin menghapus poin checklist <strong className="text-heading">{deleteChecklist.name}</strong>?
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteChecklist(null)}
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
