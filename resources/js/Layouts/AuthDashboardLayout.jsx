import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const roleConfig = {
    admin: {
        label: 'Administrator',
        dashboard: 'admin.dashboard',
        menu: [
            { label: 'Dashboard', route: 'admin.dashboard', icon: 'dashboard' },
        ],
    },
    owner: {
        label: 'Owner',
        dashboard: 'owner.dashboard',
        menu: [
            { label: 'Dashboard', route: 'owner.dashboard', icon: 'dashboard' },
        ],
    },
    user: {
        label: 'User',
        dashboard: 'user.dashboard',
        menu: [
            { label: 'Dashboard', route: 'user.dashboard', icon: 'dashboard' },
        ],
    },
};

function Icon({ name, className = 'h-5 w-5' }) {
    const icons = {
        dashboard: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-12h8V3h-8v6z" />
            </svg>
        ),
        users: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
    };
    return icons[name] ?? icons.dashboard;
}

export default function AuthDashboardLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const rawRole = typeof user?.role === 'string'
        ? user.role
        : (user?.role?.name ?? user?.roles?.[0]?.name ?? 'user');
    const role = (rawRole || 'user').toLowerCase();
    const config = roleConfig[role] ?? roleConfig.user;

    // State Sidebar Mobile & Desktop Collapsed
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const activeMenuItem = config.menu.find((item) => {
        const routePattern = item.route.replace('.index', '*');
        return route().current(routePattern) || route().current(item.route);
    });

    const activeRouteName = activeMenuItem?.route ?? config.dashboard;

    return (
        <AuthenticatedLayout>
            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex flex-col
                    border-r border-border bg-surface transition-all duration-300 ease-in-out
                    lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${isCollapsed ? 'lg:w-20' : 'lg:w-64 w-64'}
                `}
            >
                {/* LOGO & DESKTOP TOGGLE BUTTON */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                    <Link 
                        href={route(config.dashboard)}
                        className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}
                    >
                        <ApplicationLogo className="h-9 w-auto shrink-0 fill-current text-primary" />
                    </Link>
                </div>

                {/* USER INFO */}
                <div className="border-b border-border p-4">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light font-semibold text-primary">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        {!isCollapsed && (
                            <div className="min-w-0 transition-opacity duration-200">
                                <p className="truncate text-sm font-semibold text-heading">{user?.name}</p>
                                <p className="truncate text-xs text-muted">{config.label}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MENU */}
                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    {!isCollapsed && (
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                            Menu
                        </p>
                    )}
                    <div className="space-y-1">
                        {config.menu.map((item) => {
                            const active = route().current(item.route.replace('.index', '*')) || route().current(item.route);

                            return (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    onClick={() => setSidebarOpen(false)}
                                    title={isCollapsed ? item.label : undefined}
                                    className={`
                                        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
                                        ${isCollapsed ? 'justify-center' : ''}
                                        ${active ? 'bg-primary-light text-primary' : 'text-body hover:bg-surface-secondary hover:text-heading'}
                                    `}
                                >
                                    <Icon name={item.icon} className="h-5 w-5 shrink-0" />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* BOTTOM MENU */}
                <div className="border-t border-border p-3 space-y-1">
                    <Link
                        href={route('profile.edit')}
                        title={isCollapsed ? 'Profile' : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-body transition hover:bg-surface-secondary hover:text-heading ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="8" r="3" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 21a7 7 0 0114 0" />
                        </svg>
                        {!isCollapsed && <span>Profile</span>}
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        title={isCollapsed ? 'Log Out' : undefined}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger-light ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5M15 12H3" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 19V5a2 2 0 00-2-2h-6" />
                        </svg>
                        {!isCollapsed && <span>Log Out</span>}
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                <header className="sticky top-0 z-30 h-16 border-b border-border bg-surface/95 backdrop-blur">
                    <div className="flex h-full items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                            {/* MOBILE MENU BUTTON */}
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg p-2 text-body hover:bg-surface-secondary lg:hidden"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* DESKTOP SIDEBAR TOGGLE BUTTON (IN TOPBAR) */}
                            <button
                                type="button"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden rounded-lg p-2 text-body hover:bg-surface-secondary lg:block"
                                title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </button>

                            {/* BREADCRUMB */}
                            <div className="hidden items-center gap-2 text-sm text-muted lg:flex">
                                <Link 
                                    href={route(config.dashboard)} 
                                    className="font-medium text-body transition hover:text-heading"
                                >
                                    {role === 'admin' ? 'Dashboard' : 'Beranda'}
                                </Link>

                                {header && (
                                    <>
                                        <svg 
                                            className="h-3.5 w-3.5 text-muted/40" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                        
                                        <span className="font-semibold text-heading">
                                            {header}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* USER DROPDOWN */}
                        <div className="ml-auto flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-body hover:bg-surface-secondary">
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
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {header && (
                    <div className="border-b border-border bg-surface px-4 py-4 lg:hidden">
                        <Link href={route(activeRouteName)} className="text-xs transition hover:text-primary">
                            {header}
                        </Link>
                    </div>
                )}

                <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            </div>
        </AuthenticatedLayout>
    );
}