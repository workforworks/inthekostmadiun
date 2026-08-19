import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import { Head } from '@inertiajs/react';

export default function Profil() {
    return (
        <AuthDashboardLayout header="Profil">
            <Head title="Kos Saya" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-surface p-6 shadow-sm border border-border">
                    <h1 className="text-xl font-bold text-heading">Profil Anda</h1>
                    <p className="text-sm text-muted mt-1">hdghdihch.</p>
                </div>
            </div>
        </AuthDashboardLayout>
    );
}
