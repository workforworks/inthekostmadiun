import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function StatCard({ icon, label, value, change, changeType = 'positive', accent = false }) {
    return (
        <div className="stat-card group">
            <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent ? 'bg-accent-light text-accent' : 'bg-primary-light text-primary'}`}>
                    {icon}
                </div>
                {change && (
                    <span className={`badge ${changeType === 'positive' ? 'badge-success' : 'badge-danger'}`}>
                        {changeType === 'positive' ? '↑' : '↓'} {change}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-heading font-heading">{value}</p>
                <p className="mt-0.5 text-sm text-muted">{label}</p>
            </div>
        </div>
    );
}

function RecentUserRow({ name, email, role, date, status }) {
    const statusConfig = {
        active: { class: 'badge-success', label: 'Aktif' },
        pending: { class: 'badge-neutral', label: 'Pending' },
        suspended: { class: 'badge-danger', label: 'Ditangguhkan' },
        verified: { class: 'badge-accent', label: 'Verified' },
    };
    const s = statusConfig[status] || statusConfig.active;

    const roleConfig = {
        admin: { class: 'badge-primary', label: 'Admin' },
        owner: { class: 'badge-success', label: 'Owner' },
        user: { class: 'badge-neutral', label: 'User' },
    };
    const r = roleConfig[role] || roleConfig.user;

    return (
        <tr className="table-row">
            <td>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-heading">{name}</p>
                        <p className="text-xs text-muted">{email}</p>
                    </div>
                </div>
            </td>
            <td>
                <span className={`badge ${r.class}`}>{r.label}</span>
            </td>
            <td className="text-sm text-muted">{date}</td>
            <td>
                <span className={`badge ${s.class}`}>{s.label}</span>
            </td>
        </tr>
    );
}

function SystemLog({ action, description, time, type = 'info' }) {
    const typeConfig = {
        info: { dot: 'bg-primary', bg: 'bg-primary-light text-primary' },
        success: { dot: 'bg-success', bg: 'bg-success-light text-success-dark' },
        warning: { dot: 'bg-warning', bg: 'bg-warning-light text-amber-800' },
        error: { dot: 'bg-danger', bg: 'bg-danger-light text-danger-dark' },
    };
    const t = typeConfig[type] || typeConfig.info;

    return (
        <div className="flex items-start gap-3 border-b border-surface-secondary py-3 last:border-0">
            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${t.dot}`} />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-heading">{action}</p>
                <p className="text-xs text-muted">{description}</p>
            </div>
            <p className="shrink-0 text-xs text-muted">{time}</p>
        </div>
    );
}

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Pengajuan Verifikasi Kost Baru',
        message: 'Kost Melati Residence mengajukan survey verifikasi lapangan di Jl. Serayu No. 12.',
        time: '10 menit lalu',
        type: 'warning',
        badge: 'Perlu Survey',
        unread: true,
        actionUrl: route().has('admin.surveyors.index') ? route('admin.surveyors.index') : '#',
        actionLabel: 'Tugaskan Surveyor',
    },
    {
        id: 2,
        title: 'Pendaftaran Surveyor Baru',
        message: 'Surveyor Doni Pratama mendaftar dan membutuhkan peninjauan berkas.',
        time: '45 menit lalu',
        type: 'info',
        badge: 'Verifikasi',
        unread: true,
        actionUrl: route().has('admin.surveyors.index') ? route('admin.surveyors.index') : '#',
        actionLabel: 'Lihat Surveyor',
    },
    {
        id: 3,
        title: 'Laporan Listing Masuk',
        message: 'Pengguna melaporkan ketidaksesuaian fasilitas pada listing Kost Anggrek.',
        time: '2 jam lalu',
        type: 'danger',
        badge: 'Laporan',
        unread: true,
        actionUrl: '#',
        actionLabel: 'Tinjau Laporan',
    },
    {
        id: 4,
        title: 'Survey Selesai Diverifikasi',
        message: 'Surveyor Budi telah menyelesaikan checklist survey untuk Kost Dahlia Madiun.',
        time: '5 jam lalu',
        type: 'success',
        badge: 'Selesai',
        unread: false,
        actionUrl: route().has('admin.survey-checklists.index') ? route('admin.survey-checklists.index') : '#',
        actionLabel: 'Cek Checklist',
    },
    {
        id: 5,
        title: 'Pembaruan Keamanan Sistem',
        message: 'Checklist survey dan modul otentikasi telah diperbarui secara otomatis.',
        time: '1 hari lalu',
        type: 'info',
        badge: 'Sistem',
        unread: false,
        actionUrl: '#',
        actionLabel: 'Detail',
    },
];

export default function DashboardAdmin() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [activityTab, setActivityTab] = useState('system'); // 'system' | 'users'
    const [notifFilter, setNotifFilter] = useState('all'); // 'all' | 'unread'
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const filteredNotifications = notifications.filter((item) => {
        if (notifFilter === 'unread') return item.unread;
        return true;
    });

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    };

    const toggleReadStatus = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
        );
    };

    return (
        <AuthDashboardLayout header="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="page-enter p-4 sm:p-6 space-y-6">
                {/* Header Welcome Bar */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-heading font-heading">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-muted">
                            Pantau ringkasan statistik, aktivitas terbaru, dan notifikasi sistem Verified Kost Madiun.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
                            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            Sistem Online
                        </span>
                    </div>
                </div>

                {/* 1. RINGKASAN STATISTIK */}
                <section aria-labelledby="section-stats">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 id="section-stats" className="text-lg font-semibold text-heading font-heading flex items-center gap-2">
                                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Ringkasan Statistik
                            </h2>
                            <p className="text-xs text-muted">Perkembangan metrik utama platform</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>}
                            label="Total Pengguna"
                            value="1,284"
                            change="12%"
                            changeType="positive"
                        />
                        <StatCard
                            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3" /></svg>}
                            label="Total Kost"
                            value="348"
                            change="24"
                            changeType="positive"
                        />
                        <StatCard
                            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            label="Kost Terverifikasi"
                            value="289"
                            accent={true}
                        />
                        <StatCard
                            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            label="Revenue Platform"
                            value="Rp 142jt"
                            change="8%"
                            changeType="positive"
                        />
                    </div>
                </section>

                {/* 2 & 3. AKTIVITAS TERBARU & NOTIFIKASI */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* 2. AKTIVITAS TERBARU (8 COLS ON LG) */}
                    <section aria-labelledby="section-activity" className="lg:col-span-7 xl:col-span-8 flex flex-col">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                            <div>
                                <h2 id="section-activity" className="text-lg font-semibold text-heading font-heading flex items-center gap-2">
                                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Aktivitas Terbaru
                                </h2>
                                <p className="text-xs text-muted">Aktivitas sistem dan pendaftaran pengguna baru</p>
                            </div>

                            {/* Activity Tab Switcher */}
                            <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 self-start sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => setActivityTab('system')}
                                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                                        activityTab === 'system'
                                            ? 'bg-primary-light text-primary font-semibold'
                                            : 'text-muted hover:text-heading'
                                    }`}
                                >
                                    Log Sistem
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActivityTab('users')}
                                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                                        activityTab === 'users'
                                            ? 'bg-primary-light text-primary font-semibold'
                                            : 'text-muted hover:text-heading'
                                    }`}
                                >
                                    Pengguna Terbaru
                                </button>
                            </div>
                        </div>

                        {activityTab === 'system' ? (
                            <div className="rounded-xl border border-border bg-surface p-4 flex-1">
                                <div className="space-y-1">
                                    <SystemLog
                                        action="Kost baru terdaftar"
                                        description="Kost Anggrek Premium oleh Ahmad"
                                        time="5 menit lalu"
                                        type="info"
                                    />
                                    <SystemLog
                                        action="Verifikasi survey selesai"
                                        description="Kost Melati Residence diverifikasi oleh Surveyor Doni"
                                        time="30 menit lalu"
                                        type="success"
                                    />
                                    <SystemLog
                                        action="Laporan listing masuk"
                                        description="User melaporkan fasilitas tidak akurat"
                                        time="1 jam lalu"
                                        type="warning"
                                    />
                                    <SystemLog
                                        action="Pembayaran platform gagal"
                                        description="Transaksi #TRX-4521 timeout"
                                        time="2 jam lalu"
                                        type="error"
                                    />
                                    <SystemLog
                                        action="Owner baru mendaftar"
                                        description="Budi Santoso mendaftar akun sebagai Owner"
                                        time="3 jam lalu"
                                        type="info"
                                    />
                                    <SystemLog
                                        action="Checklist survey diperbarui"
                                        description="Admin menambahkan indikator kebersihan kamar mandi"
                                        time="5 jam lalu"
                                        type="success"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-border bg-surface flex-1">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="table-header">
                                                <th className="text-left">Pengguna</th>
                                                <th className="text-left">Role</th>
                                                <th className="text-left">Bergabung</th>
                                                <th className="text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <RecentUserRow
                                                name="Budi Santoso"
                                                email="budi@email.com"
                                                role="owner"
                                                date="Hari ini"
                                                status="active"
                                            />
                                            <RecentUserRow
                                                name="Siti Rahayu"
                                                email="siti@email.com"
                                                role="user"
                                                date="Kemarin"
                                                status="active"
                                            />
                                            <RecentUserRow
                                                name="Ahmad Fauzi"
                                                email="ahmad@email.com"
                                                role="owner"
                                                date="2 hari lalu"
                                                status="pending"
                                            />
                                            <RecentUserRow
                                                name="Dewi Lestari"
                                                email="dewi@email.com"
                                                role="user"
                                                date="3 hari lalu"
                                                status="verified"
                                            />
                                            <RecentUserRow
                                                name="Rian Pratama"
                                                email="rian@email.com"
                                                role="user"
                                                date="4 hari lalu"
                                                status="active"
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 3. NOTIFIKASI (5 COLS ON LG) */}
                    <section aria-labelledby="section-notifications" className="lg:col-span-5 xl:col-span-4 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h2 id="section-notifications" className="text-lg font-semibold text-heading font-heading flex items-center gap-2">
                                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    Notifikasi
                                </h2>
                                {unreadCount > 0 && (
                                    <span className="badge badge-accent">
                                        {unreadCount} Baru
                                    </span>
                                )}
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="text-xs font-medium text-primary hover:text-primary-hover transition"
                                >
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>

                        <div className="rounded-xl border border-border bg-surface flex flex-col flex-1">
                            {/* Filter Bar */}
                            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-surface-secondary/40 rounded-t-xl">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNotifFilter('all')}
                                        className={`text-xs font-semibold px-2.5 py-1 rounded transition ${
                                            notifFilter === 'all'
                                                ? 'bg-surface text-heading shadow-xs'
                                                : 'text-muted hover:text-heading'
                                        }`}
                                    >
                                        Semua ({notifications.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNotifFilter('unread')}
                                        className={`text-xs font-semibold px-2.5 py-1 rounded transition ${
                                            notifFilter === 'unread'
                                                ? 'bg-surface text-heading shadow-xs'
                                                : 'text-muted hover:text-heading'
                                        }`}
                                    >
                                        Belum Dibaca ({unreadCount})
                                    </button>
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="divide-y divide-surface-secondary p-3 space-y-2 flex-1 overflow-y-auto max-h-[460px]">
                                {filteredNotifications.length === 0 ? (
                                    <div className="py-10 text-center text-muted">
                                        <svg className="mx-auto h-8 w-8 text-muted/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-sm font-medium">Tidak ada notifikasi</p>
                                        <p className="text-xs">Semua pemberitahuan telah Anda baca.</p>
                                    </div>
                                ) : (
                                    filteredNotifications.map((notif) => {
                                        const typeStyles = {
                                            warning: { border: 'border-l-amber-500', badgeClass: 'badge-warning', iconBg: 'bg-warning-light text-amber-700' },
                                            danger: { border: 'border-l-rose-500', badgeClass: 'badge-danger', iconBg: 'bg-danger-light text-danger-dark' },
                                            success: { border: 'border-l-emerald-500', badgeClass: 'badge-success', iconBg: 'bg-success-light text-success-dark' },
                                            info: { border: 'border-l-blue-500', badgeClass: 'badge-primary', iconBg: 'bg-primary-light text-primary' },
                                        };
                                        const style = typeStyles[notif.type] || typeStyles.info;

                                        return (
                                            <div
                                                key={notif.id}
                                                className={`rounded-lg border border-border p-3 transition border-l-4 ${style.border} ${
                                                    notif.unread ? 'bg-surface shadow-xs' : 'bg-surface-secondary/30 opacity-80'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className={`badge ${style.badgeClass}`}>
                                                            {notif.badge}
                                                        </span>
                                                        {notif.unread && (
                                                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-muted shrink-0">
                                                        {notif.time}
                                                    </span>
                                                </div>

                                                <p className="mt-1.5 text-sm font-semibold text-heading">
                                                    {notif.title}
                                                </p>
                                                <p className="mt-0.5 text-xs text-body leading-relaxed">
                                                    {notif.message}
                                                </p>

                                                <div className="mt-3 flex items-center justify-between pt-2 border-t border-surface-secondary">
                                                    {notif.actionUrl && notif.actionUrl !== '#' ? (
                                                        <Link
                                                            href={notif.actionUrl}
                                                            className="text-xs font-semibold text-primary hover:text-primary-hover transition flex items-center gap-1"
                                                        >
                                                            {notif.actionLabel}
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleReadStatus(notif.id)}
                                                            className="text-xs font-medium text-muted hover:text-heading transition"
                                                        >
                                                            {notif.actionLabel}
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => toggleReadStatus(notif.id)}
                                                        className="text-[11px] text-muted hover:text-heading transition"
                                                        title={notif.unread ? 'Tandai sudah dibaca' : 'Tandai belum dibaca'}
                                                    >
                                                        {notif.unread ? 'Tandai dibaca' : 'Belum dibaca'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthDashboardLayout>
    );
}