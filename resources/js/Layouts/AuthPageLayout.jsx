import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage } from '@inertiajs/react';

const roleConfig = {
    admin: { dashboard: 'admin.dashboard' },
    owner: { dashboard: 'owner.dashboard' },
    user: { dashboard: 'user.dashboard' },
};

export default function AuthPageLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const rawRole = typeof user?.role === 'string'
        ? user.role
        : (user?.role?.name ?? user?.roles?.[0]?.name ?? 'user');
    const role = (rawRole || 'user').toLowerCase();
    const config = roleConfig[role] ?? roleConfig.user;

    return (
        <AuthenticatedLayout>
            {/* FULL WIDTH TOP NAVBAR */}
            <header className="sticky top-0 z-30 h-16 border-b border-border bg-surface/95 backdrop-blur">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* LOGO & NAVIGATION */}
                    <div className="flex items-center gap-8">
                        <Link href={route(config.dashboard)}>
                            <ApplicationLogo className="h-9 w-auto fill-current text-primary" />
                        </Link>

                        {header && (
                            <div className="hidden items-center gap-2 text-sm sm:flex">
                                <span className="text-muted/40">/</span>
                                <span className="font-semibold text-heading">{header}</span>
                            </div>
                        )}
                    </div>

                    {/* USER DROPDOWN */}
                    <div className="flex items-center gap-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-body hover:bg-surface-secondary"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                    <span className="hidden sm:block">{user?.name}</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route(config.dashboard)}>Dashboard</Dropdown.Link>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT CONTAINER */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </AuthenticatedLayout>
    );
}