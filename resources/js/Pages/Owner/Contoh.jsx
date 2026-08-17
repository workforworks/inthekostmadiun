import AuthDashboardLayout from '@/Layouts/AuthDashboardLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Contoh() {
    return (
        <AuthDashboardLayout>
            <Head title="Dashboard Owner" />
            
            <div className="page-enter p-4 sm:p-6">
              taruh sini kode e
            </div>
        </AuthDashboardLayout>
    );
}
