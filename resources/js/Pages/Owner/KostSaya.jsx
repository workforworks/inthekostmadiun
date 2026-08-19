import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import { Head } from '@inertiajs/react';

export default function KostSaya() {
    return (
        <AuthDashboardLayout header="Kos Saya">
            <Head title="Kos Saya" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-surface p-6 shadow-sm border border-border">
                    <h1 className="text-xl font-bold text-heading">Daftar Kos Saya</h1>
                    <p className="text-sm text-muted mt-1">Halaman manajemen kos.</p>
                </div>
            </div>
        </AuthDashboardLayout>
    );
}