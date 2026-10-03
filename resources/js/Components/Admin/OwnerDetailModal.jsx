export default function OwnerDetailModal({ isOpen, onClose, owner }) {
    if (!isOpen || !owner) return null;

    const profile = owner.user_profile;
    const ownerProfile = owner.owner_profile;
    const isCreatedByAdmin = owner.registration_source === 'admin_created';

    const statusConfig = {
        active: { class: 'badge-success', label: 'Aktif' },
        inactive: { class: 'badge-neutral', label: 'Non-Aktif' },
        suspended: { class: 'badge-danger', label: 'Ditangguhkan' },
    };
    const s = statusConfig[owner.status] || statusConfig.active;

    const verificationConfig = {
        verified: { class: 'badge-success', label: 'Terverifikasi' },
        pending: { class: 'badge-warning', label: 'Menunggu Verifikasi' },
        rejected: { class: 'badge-danger', label: 'Ditolak' },
        suspended: { class: 'badge-neutral', label: 'Ditangguhkan' },
    };
    const v = verificationConfig[ownerProfile?.verification_status] || verificationConfig.pending;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-modal my-8">
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
                <div className="flex items-center gap-4 border-b border-border pb-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary-light font-bold text-xl text-primary">
                        {profile?.avatar ? (
                            <img src={profile.avatar} alt={owner.name} className="h-full w-full object-cover" />
                        ) : (
                            owner.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-heading text-xl font-bold text-heading">
                                {owner.name}
                            </h2>
                            <span className="badge badge-primary">Owner</span>
                        </div>
                        <p className="text-xs text-muted mt-0.5">{owner.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className={`badge ${s.class}`}>{s.label}</span>
                            <span className={`badge ${v.class}`}>{v.label}</span>
                        </div>
                    </div>
                </div>

                {/* Detail Information */}
                <div className="mt-5 space-y-4">
                    {/* Sumber Pendaftaran Notice */}
                    <div className={`rounded-xl p-4 border ${isCreatedByAdmin ? 'bg-primary-light/40 border-primary/20' : 'bg-surface-secondary border-border'}`}>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                            Informasi Pendaftaran
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-heading">
                                {isCreatedByAdmin ? 'Sumber Pendaftaran: Dibuat oleh Admin' : 'Sumber Pendaftaran: Registrasi Mandiri'}
                            </span>
                            <span className={`badge ${isCreatedByAdmin ? 'badge-accent' : 'badge-neutral'}`}>
                                {isCreatedByAdmin ? 'Admin Created' : 'Self Registration'}
                            </span>
                        </div>
                        {isCreatedByAdmin && owner.created_by_admin && (
                            <p className="mt-1 text-xs text-muted">
                                Dibuatkan secara manual oleh Administrator: <strong className="text-heading">{owner.created_by_admin.name}</strong>
                            </p>
                        )}
                    </div>

                    {/* Contact & Profile Info */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                        <div className="rounded-lg border border-border p-3">
                            <p className="text-xs font-medium text-muted">Nomor WhatsApp / HP</p>
                            <p className="mt-1 font-semibold text-heading">{owner.phone}</p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                            <p className="text-xs font-medium text-muted">Email Akun</p>
                            <p className="mt-1 font-semibold text-heading truncate">{owner.email}</p>
                        </div>
                        <div className="rounded-lg border border-border p-3 sm:col-span-2">
                            <p className="text-xs font-medium text-muted">Alamat Domisili</p>
                            <p className="mt-1 font-medium text-heading">
                                {profile?.address || 'Belum mengisi alamat'}
                            </p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                            <p className="text-xs font-medium text-muted">Tanggal Akun Dibuat</p>
                            <p className="mt-1 text-xs font-medium text-heading">{formatDate(owner.created_at)}</p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                            <p className="text-xs font-medium text-muted">Status Verifikasi Email</p>
                            <p className="mt-1 text-xs font-semibold text-success-dark">
                                {owner.email_verified_at ? 'Terverifikasi' : 'Belum Diverifikasi'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end border-t border-border pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary text-xs"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
