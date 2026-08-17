import AuthPageLayout from '@/Layouts/AuthPageLayout';
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

function QuickAction({ icon, title, description }) {
    return (
        <button className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left transition hover:border-primary/30 hover:shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-heading">{title}</p>
                <p className="mt-0.5 text-xs text-muted">{description}</p>
            </div>
        </button>
    );
}

function PropertyCard({ title, location, price, status }) {
    const statusConfig = {
        verified: { class: 'badge-primary', label: 'Verified' },
        new: { class: 'badge-success', label: 'Baru' },
        pending: { class: 'badge-neutral', label: 'Pending' },
    };
    const s = statusConfig[status] || statusConfig.pending;

    return (
        <div className="card overflow-hidden">
            <div className="relative aspect-[4/3] bg-surface-secondary">
                <div className="flex h-full items-center justify-center text-muted">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6" />
                    </svg>
                </div>
                <div className="absolute right-2 top-2">
                    <span className={`badge ${s.class}`}>
                        {status === 'verified' && (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                        {s.label}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <p className="text-lg font-bold text-primary">{price}</p>
                <p className="mt-1 text-sm font-semibold text-heading">{title}</p>
                <p className="mt-0.5 text-xs text-muted">{location}</p>
            </div>
        </div>
    );
}

export default function DashboardUser() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AuthPageLayout
        >
            <Head title="Dashboard" />

            <div>
                <h2 className="text-xl font-bold text-heading font-heading">
                    Selamat datang, {user?.name} 👋
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                    Temukan kost impianmu hari ini
                </p>
            </div>

            <div className="page-enter p-4 sm:p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4-4m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                        label="Pencarian Terakhir"
                        value="24"
                        change="12%"
                        changeType="positive"
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0112 6.2a4.7 4.7 0 018.8 2.5z" /></svg>}
                        label="Kost Favorit"
                        value="8"
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="17" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" /></svg>}
                        label="Booking Aktif"
                        value="1"
                    />
                    <StatCard
                        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6" /></svg>}
                        label="Kost Tersedia"
                        value="156"
                        change="5%"
                        changeType="positive"
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recommended Properties */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-heading font-heading">
                                Rekomendasi Untukmu
                            </h3>
                            <button className="text-sm font-medium text-primary hover:text-primary-hover transition">
                                Lihat Semua →
                            </button>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <PropertyCard
                                title="Kost Eksklusif Pusat Kota"
                                location="Jl. Raya Madiun No. 45"
                                price="Rp 1.200.000/bln"
                                status="verified"
                            />
                            <PropertyCard
                                title="Kost Nyaman Dekat Kampus"
                                location="Jl. Serayu No. 12"
                                price="Rp 850.000/bln"
                                status="new"
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-lg font-semibold text-heading font-heading">
                            Aksi Cepat
                        </h3>
                        <div className="mt-4 space-y-3">
                            <QuickAction
                                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4-4m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                                title="Cari Kost"
                                description="Temukan kost di Madiun"
                            />
                            <QuickAction
                                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0112 6.2a4.7 4.7 0 018.8 2.5z" /></svg>}
                                title="Kost Favorit"
                                description="Lihat daftar favoritmu"
                            />
                            <QuickAction
                                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="3" /><path d="M5 21a7 7 0 0114 0" /></svg>}
                                title="Edit Profil"
                                description="Perbarui data dirimu"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthPageLayout>
    );
}
