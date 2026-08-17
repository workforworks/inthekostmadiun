import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import { Head, usePage } from '@inertiajs/react';

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
        info: { dot: 'bg-primary' },
        success: { dot: 'bg-success' },
        warning: { dot: 'bg-warning' },
        error: { dot: 'bg-danger' },
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

export default function DashboardAdmin() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AuthDashboardLayout header="Admin Dashboard">
            {/* <Head title="Admin Dashboard" /> */}

            <div className="page-enter p-4 sm:p-6">
                {/* Page Title & Subtitle */}
                {/* <div className="mb-6">
                    <h1 className="text-2xl font-bold text-heading font-heading">
                        Admin Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Sistem manajemen platform Verified Kost
                    </p>
                </div> */}

                {/* Stats Grid */}
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

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* User Table */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-heading font-heading">
                                Pengguna Terbaru
                            </h3>
                            <button className="btn btn-secondary text-xs">
                                Lihat Semua
                            </button>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
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
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* System Activity */}
                    <div>
                        <h3 className="text-lg font-semibold text-heading font-heading">
                            Aktivitas Sistem
                        </h3>
                        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                            <SystemLog
                                action="Kost baru terdaftar"
                                description="Kost Anggrek Premium oleh Ahmad"
                                time="5 menit"
                                type="info"
                            />
                            <SystemLog
                                action="Verifikasi selesai"
                                description="Kost Melati Residence diverifikasi"
                                time="30 menit"
                                type="success"
                            />
                            <SystemLog
                                action="Laporan masuk"
                                description="User melaporkan listing tidak valid"
                                time="1 jam"
                                type="warning"
                            />
                            <SystemLog
                                action="Pembayaran gagal"
                                description="Transaksi #TRX-4521 timeout"
                                time="2 jam"
                                type="error"
                            />
                            <SystemLog
                                action="Owner baru"
                                description="Budi Santoso mendaftar sebagai Owner"
                                time="3 jam"
                                type="info"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthDashboardLayout>
    );
}