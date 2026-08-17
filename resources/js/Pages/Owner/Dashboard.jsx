import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import { Head, usePage } from '@inertiajs/react';

function StatCard({ icon, label, value, change, changeType = 'positive' }) {
    return (
        <div className="stat-card group">
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
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

function PropertyMiniCard({ name, address, occupancy, status }) {
    const statusConfig = {
        active: { class: 'badge-success', label: 'Aktif' },
        pending: { class: 'badge-neutral', label: 'Pending' },
        maintenance: { class: 'badge-warning', label: 'Perbaikan' },
    };
    const s = statusConfig[status] || statusConfig.active;

    return (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition hover:border-primary/30 hover:shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-semibold text-heading">{name}</p>
                    <p className="text-xs text-muted">{address}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-bold text-heading">{occupancy}%</p>
                    <p className="text-xs text-muted">Terisi</p>
                </div>
                <span className={`badge ${s.class}`}>{s.label}</span>
            </div>
        </div>
    );
}

function RecentPayment({ tenant, property, amount, date, status }) {
    const statusConfig = {
        paid: { class: 'badge-success', label: 'Lunas' },
        pending: { class: 'badge-warning', label: 'Pending' },
        overdue: { class: 'badge-danger', label: 'Jatuh Tempo' },
    };
    const s = statusConfig[status] || statusConfig.pending;

    return (
        <div className="flex items-center justify-between border-b border-surface-secondary py-3 last:border-0">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-secondary font-semibold text-heading text-xs">
                    {tenant.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-sm font-medium text-heading">{tenant}</p>
                    <p className="text-xs text-muted">{property} · {date}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-heading">{amount}</p>
                <span className={`badge ${s.class}`}>{s.label}</span>
            </div>
        </div>
    );
}

export default function DashboardOwner() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AuthDashboardLayout
        >
            <Head title="Dashboard Owner" />
            
            <div className="page-enter p-4 sm:p-6">
                <h2 className="text-xl font-bold text-heading font-heading">
                    Dashboard Owner 🏠
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                    Kelola properti kost Anda dengan mudah
                </p>
            </div>

            <div className="page-enter p-4 sm:p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3" /></svg>}
                        label="Total Properti"
                        value="3"
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6" /></svg>}
                        label="Kamar Tersedia"
                        value="12"
                        change="3"
                        changeType="positive"
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>}
                        label="Penghuni Aktif"
                        value="42"
                        change="5"
                        changeType="positive"
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        label="Pendapatan Bulan Ini"
                        value="Rp 28.5jt"
                        change="8%"
                        changeType="positive"
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Property List */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-heading font-heading">
                                Properti Anda
                            </h3>
                            <button className="btn btn-secondary text-xs">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 4v16m8-8H4" /></svg>
                                Tambah Properti
                            </button>
                        </div>
                        <div className="mt-4 space-y-3">
                            <PropertyMiniCard
                                name="Kost Mawar Indah"
                                address="Jl. Raya Madiun No. 45"
                                occupancy={85}
                                status="active"
                            />
                            <PropertyMiniCard
                                name="Kost Melati Residence"
                                address="Jl. Serayu No. 12"
                                occupancy={92}
                                status="active"
                            />
                            <PropertyMiniCard
                                name="Kost Anggrek Premium"
                                address="Jl. Pahlawan No. 8"
                                occupancy={45}
                                status="maintenance"
                            />
                        </div>
                    </div>

                    {/* Recent Payments */}
                    <div>
                        <h3 className="text-lg font-semibold text-heading font-heading">
                            Pembayaran Terbaru
                        </h3>
                        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                            <RecentPayment
                                tenant="Budi Santoso"
                                property="Kost Mawar"
                                amount="Rp 1.2jt"
                                date="Hari ini"
                                status="paid"
                            />
                            <RecentPayment
                                tenant="Siti Rahayu"
                                property="Kost Melati"
                                amount="Rp 950rb"
                                date="Kemarin"
                                status="paid"
                            />
                            <RecentPayment
                                tenant="Ahmad Fauzi"
                                property="Kost Mawar"
                                amount="Rp 1.2jt"
                                date="3 hari lalu"
                                status="pending"
                            />
                            <RecentPayment
                                tenant="Dewi Lestari"
                                property="Kost Anggrek"
                                amount="Rp 1.5jt"
                                date="5 hari lalu"
                                status="overdue"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthDashboardLayout>
    );
}
