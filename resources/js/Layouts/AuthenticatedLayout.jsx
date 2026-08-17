import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Ekstraksi nama role secara aman
    const rawRole = typeof user?.role === 'string'
        ? user.role
        : (user?.role?.name ?? user?.roles?.[0]?.name ?? 'user');

    const role = (rawRole || 'user').toLowerCase();

    const themeClass = {
        admin: 'theme-admin',
        owner: 'theme-owner',
        user: 'theme-user',
    }[role] ?? 'theme-user';

    return (
        <div 
            className={`${themeClass} min-h-screen bg-background text-body transition-colors duration-200`}
            data-theme={role}
        >
            {children}
        </div>
    );
}