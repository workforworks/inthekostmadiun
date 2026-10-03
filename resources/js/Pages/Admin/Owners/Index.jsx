import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import CreateOwnerModal from '@/Components/Admin/CreateOwnerModal';
import OwnerDetailModal from '@/Components/Admin/OwnerDetailModal';

const VERIFICATION_CONFIG = {
    verified: { cls: 'badge-success', label: 'Terverifikasi' },
    pending: { cls: 'badge-warning', label: 'Menunggu Verifikasi' },
    rejected: { cls: 'badge-danger', label: 'Ditolak' },
    suspended: { cls: 'badge-neutral', label: 'Ditangguhkan' },
};

const ACCOUNT_STATUS_CONFIG = {
    active: { cls: 'badge-success', dot: 'bg-success-dark', label: 'Aktif' },
    inactive: { cls: 'badge-neutral', dot: 'bg-muted', label: 'Non-Aktif' },
    suspended: { cls: 'badge-danger', dot: 'bg-danger', label: 'Ditangguhkan' },
};

/**
 * `confirm` -> aksi berdampak besar, minta konfirmasi dulu.
 */
const VERIF_ACTIONS = [
    { key: 'verified', label: 'Verifikasi', cls: 'text-success', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { key: 'pending', label: 'Set Menunggu', cls: 'text-warning', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'rejected', label: 'Tolak', cls: 'text-danger', confirm: true, d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'suspended', label: 'Tangguhkan Verifikasi', cls: 'text-muted', confirm: true, d: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
];

const ACCT_ACTIONS = [
    { key: 'active', label: 'Aktifkan', cls: 'text-success', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'inactive', label: 'Non-Aktifkan', cls: 'text-body', confirm: true, d: 'M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'suspended', label: 'Tangguhkan Akun', cls: 'text-danger', confirm: true, d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
];

function Icon({ d, className = 'h-4 w-4 shrink-0' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
}

/* -------------------------------------------------------------------------- */
/*  Konfirmasi                                                                */
/* -------------------------------------------------------------------------- */

function ConfirmDialog({ pending, onCancel, onConfirm }) {
    useEffect(() => {
        if (!pending) return;
        const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [pending, onCancel]);

    if (!pending) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 animate-fade-in" onMouseDown={onCancel}>
            <div
                className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-modal"
                onMouseDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <h3 className="font-heading text-base font-bold text-heading">{pending.title}</h3>
                <p className="mt-2 text-sm text-body">{pending.message}</p>
                <div className="mt-5 flex justify-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
                    <button type="button" className="btn btn-primary" onClick={onConfirm} autoFocus>
                        {pending.confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* -------------------------------------------------------------------------- */
/*  Kolom Status Verifikasi: badge + tombol cepat kalau masih pending          */
/* -------------------------------------------------------------------------- */

function VerificationCell({ owner, onAction, busy }) {
    const key = owner.owner_profile?.verification_status || 'pending';
    const verif = VERIFICATION_CONFIG[key] || VERIFICATION_CONFIG.pending;

    return (
        <div className="flex flex-col items-start gap-1.5">
            <span className={`badge ${verif.cls}`}>{verif.label}</span>

            {key === 'pending' && (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => onAction(owner, 'verification', 'verified')}
                        className="inline-flex items-center gap-1 rounded-md bg-success-light px-2 py-1 text-xs font-semibold text-success-dark transition hover:brightness-95 disabled:opacity-50"
                    >
                        <Icon d="M5 13l4 4L19 7" className="h-3 w-3" />
                        Verifikasi
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => onAction(owner, 'verification', 'rejected')}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-danger transition hover:bg-surface-secondary disabled:opacity-50"
                    >
                        <Icon d="M6 18L18 6M6 6l12 12" className="h-3 w-3" />
                        Tolak
                    </button>
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Kolom Aksi: tombol Detail + menu "lainnya"                                */
/* -------------------------------------------------------------------------- */

const MENU_WIDTH = 224;

function RowActions({ owner, onDetail, onAction, busy }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(null);
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    const currentVerif = owner.owner_profile?.verification_status || 'pending';
    const currentAcct = owner.status || 'inactive';

    const toggle = () => {
        if (open) return setOpen(false);
        const r = btnRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - r.bottom;
        const openUp = spaceBelow < 320 && r.top > spaceBelow;
        setPos({
            left: Math.max(8, Math.min(r.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
            ...(openUp
                ? { bottom: window.innerHeight - r.top + 4, maxHeight: r.top - 12 }
                : { top: r.bottom + 4, maxHeight: spaceBelow - 12 }),
        });
        setOpen(true);
    };

    useEffect(() => {
        if (!open) return;
        const close = () => setOpen(false);
        const onDown = (e) => {
            if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
            close();
        };
        const onKey = (e) => { if (e.key === 'Escape') close(); };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [open]);

    const run = (type, action) => {
        setOpen(false);
        onAction(owner, type, action.key);
    };

    const verifOptions = VERIF_ACTIONS.filter((a) => a.key !== currentVerif);
    const acctOptions = ACCT_ACTIONS.filter((a) => a.key !== currentAcct);

    const Item = ({ action, type }) => (
        <button
            type="button"
            onClick={() => run(type, action)}
            className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-surface-secondary ${action.cls}`}
        >
            <Icon d={action.d} />
            {action.label}
        </button>
    );

    return (
        <div className="flex items-center justify-end gap-1">
            <button
                type="button"
                onClick={() => onDetail(owner)}
                className="btn btn-ghost inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-primary"
                title="Lihat detail owner"
            >
                <Icon d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </button>

            <button
                ref={btnRef}
                type="button"
                onClick={toggle}
                disabled={busy}
                aria-haspopup="menu"
                aria-expanded={open}
                className="btn btn-ghost p-1.5 text-body hover:text-primary disabled:opacity-50"
                title="Ubah status"
            >
                {busy ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                )}
            </button>

            {open && pos && createPortal(
                <div
                    ref={menuRef}
                    role="menu"
                    style={{ position: 'fixed', width: MENU_WIDTH, ...pos }}
                    className="z-[90] overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-modal animate-fade-in"
                >
                    {verifOptions.length > 0 && (
                        <>
                            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                                Ubah Verifikasi
                            </p>
                            {verifOptions.map((a) => <Item key={a.key} action={a} type="verification" />)}
                        </>
                    )}

                    {acctOptions.length > 0 && (
                        <>
                            <div className="my-1 border-t border-border" />
                            <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                                Ubah Status Akun
                            </p>
                            {acctOptions.map((a) => <Item key={a.key} action={a} type="account" />)}
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}

function StatCard({ icon, label, value, change, accent = false }) {
    return (
        <div className="stat-card group">
            <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent ? 'bg-accent-light text-accent' : 'bg-primary-light text-primary'}`}>
                    {icon}
                </div>
                {change && (
                    <span className="badge badge-success">
                        {change}
                    </span>
                )}
            </div>
            <div className="mt-3">
                <p className="text-2xl font-bold text-heading font-heading">{value}</p>
                <p className="mt-0.5 text-xs text-muted">{label}</p>
            </div>
        </div>
    );
}

export default function Index({ owners, stats, filters }) {
    const { flash } = usePage().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [regSource, setRegSource] = useState(filters.registration_source || 'all');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [processingId, setProcessingId] = useState(null);
    const [pendingAction, setPendingAction] = useState(null);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(
            route('admin.owners.index'),
            { search, status, registration_source: regSource },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (newStatus, newRegSource) => {
        router.get(
            route('admin.owners.index'),
            {
                search,
                status: newStatus !== undefined ? newStatus : status,
                registration_source: newRegSource !== undefined ? newRegSource : regSource,
            },
            { preserveState: true, replace: true }
        );
    };

    const openDetailModal = (owner) => {
        setSelectedOwner(owner);
        setIsDetailModalOpen(true);
    };

    /* ----- aksi status (verifikasi & akun) ----- */

    const execute = (owner, type, key) => {
        const isVerif = type === 'verification';
        router.patch(
            route(isVerif ? 'admin.owners.update-verification' : 'admin.owners.update-account-status', owner.id),
            isVerif ? { verification_status: key } : { status: key },
            {
                preserveScroll: true,
                onStart: () => setProcessingId(owner.id),
                onFinish: () => setProcessingId(null),
            }
        );
    };

    const requestAction = (owner, type, key) => {
        const list = type === 'verification' ? VERIF_ACTIONS : ACCT_ACTIONS;
        const action = list.find((a) => a.key === key);

        if (!action?.confirm) {
            execute(owner, type, key);
            return;
        }

        setPendingAction({
            title: `${action.label}?`,
            message: `Status ${type === 'verification' ? 'verifikasi' : 'akun'} milik ${owner.name} akan diubah. Kamu bisa mengubahnya lagi nanti.`,
            confirmLabel: action.label,
            run: () => execute(owner, type, key),
        });
    };

    const formatWhatsAppUrl = (phone) => {
        let cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.substring(1);
        }
        return `https://wa.me/${cleanPhone}`;
    };

    const ownerStats = stats || {
        total: owners.total || 0,
        admin_created: 0,
        self_registration: 0,
        active: 0,
    };

    return (
        <AuthDashboardLayout header="Owner Management">
            <Head title="Owner Management — Admin" />

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
                            Owner Management
                        </h1>
                        <p className="mt-1 text-sm text-body">
                            Kelola data pemilik kost, tinjau sumber registrasi akun, dan buat akun owner baru.
                        </p>
                    </div>

                    {/* Tombol + Tambah Owner */}
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn btn-primary self-start sm:self-auto shrink-0 shadow-sm"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tambah Owner</span>
                    </button>
                </div>

                {/* Stat Cards Overview */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                        label="Total Akun Owner"
                        value={ownerStats.total}
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                        label="Dibuat oleh Admin"
                        value={ownerStats.admin_created}
                        accent={true}
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        label="Registrasi Mandiri"
                        value={ownerStats.self_registration}
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        label="Akun Status Aktif"
                        value={ownerStats.active}
                    />
                </div>

                {/* Filters & Search Bar */}
                <div className="card p-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama owner, email, nomor HP, atau alamat..."
                                className="input pl-9"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Filter Status */}
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    handleFilterChange(e.target.value, undefined);
                                }}
                                className="input w-36 cursor-pointer"
                            >
                                <option value="all">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Non-Aktif</option>
                                <option value="suspended">Ditangguhkan</option>
                            </select>

                            {/* Filter Sumber Pendaftaran */}
                            <select
                                value={regSource}
                                onChange={(e) => {
                                    setRegSource(e.target.value);
                                    handleFilterChange(undefined, e.target.value);
                                }}
                                className="input w-48 cursor-pointer"
                            >
                                <option value="all">Semua Sumber</option>
                                <option value="admin_created">Dibuat oleh Admin</option>
                                <option value="self_registration">Registrasi Mandiri</option>
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
                                    <th>Pemilik (Owner)</th>
                                    <th>Kontak / WhatsApp</th>
                                    <th>Sumber</th>
                                    <th>Status Verifikasi</th>
                                    <th>Status Akun</th>
                                    <th>Bergabung</th>
                                    <th className="text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {owners.data && owners.data.length > 0 ? (
                                    owners.data.map((owner) => {
                                        const profile = owner.user_profile;
                                        const isAdminMade = owner.registration_source === 'admin_created';
                                        const acctKey = owner.status || 'inactive';
                                        const acct = ACCOUNT_STATUS_CONFIG[acctKey] || ACCOUNT_STATUS_CONFIG.inactive;
                                        const busy = processingId === owner.id;

                                        return (
                                            <tr key={owner.id} className="table-row">
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light text-primary font-bold text-sm border border-primary/20">
                                                            {profile?.avatar
                                                                ? <img src={profile.avatar} alt={owner.name} className="h-full w-full object-cover" />
                                                                : owner.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="block font-bold text-heading">{owner.name}</span>
                                                            <span className="block text-xs text-muted font-normal">{owner.email}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <a
                                                        href={formatWhatsAppUrl(owner.phone)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 font-medium text-success hover:underline"
                                                        title="Hubungi via WhatsApp"
                                                    >
                                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                                        </svg>
                                                        <span>{owner.phone}</span>
                                                    </a>
                                                </td>

                                                <td>
                                                    {isAdminMade ? (
                                                        <span className="badge badge-accent" title="Dibuatkan manual oleh Admin">
                                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                            </svg>
                                                            Oleh Admin
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-neutral" title="Mendaftar secara mandiri">
                                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            Mandiri
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <VerificationCell owner={owner} onAction={requestAction} busy={busy} />
                                                </td>

                                                <td>
                                                    <span className={`badge ${acct.cls}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${acct.dot}`} />
                                                        {acct.label}
                                                    </span>
                                                </td>

                                                <td className="text-xs text-muted">
                                                    {new Date(owner.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                    })}
                                                </td>

                                                <td>
                                                    <RowActions
                                                        owner={owner}
                                                        onDetail={openDetailModal}
                                                        onAction={requestAction}
                                                        busy={busy}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <svg className="h-10 w-10 text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="font-semibold text-heading">Tidak ada data owner.</span>
                                                <span className="text-xs">Coba sesuaikan kata kunci pencarian atau klik "Tambah Owner" untuk membuat akun baru.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {owners.links && owners.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
                            <div className="text-xs text-muted">
                                Menampilkan <span className="font-semibold text-heading">{owners.from || 0}</span> - <span className="font-semibold text-heading">{owners.to || 0}</span> dari <span className="font-semibold text-heading">{owners.total}</span> data
                            </div>
                            <div className="flex items-center gap-1">
                                {owners.links.map((link, idx) => (
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

            {/* Create Owner Modal */}
            <CreateOwnerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Owner Detail Modal */}
            <OwnerDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                owner={selectedOwner}
            />

            {/* Konfirmasi aksi berdampak besar */}
            <ConfirmDialog
                pending={pendingAction}
                onCancel={() => setPendingAction(null)}
                onConfirm={() => {
                    pendingAction?.run();
                    setPendingAction(null);
                }}
            />
        </AuthDashboardLayout>
    );
}