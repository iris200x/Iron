"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function Sidebar() {

    const { userProfile, logout } = useAuth();
    const userRole = userProfile?.role;

    const navItems = [
        { name: 'Home', href: '/home' },

        ...(userRole === 'instructor' ? [{ name: 'Clients', href: '/clients' }] : []),
        { name: 'Goals', href: '/goals' },
        { name: 'Learning', href: '/learning' },
        { name: 'Chats', href: '/chats' },
        { name: 'Reminders', href: '/reminders' },
    ];

    return (
        <aside className="w-64 border-r border-gray-200 bg-white p-6 shadow-md">
            <div className="mb-8 flex items-center justify-center">
                <Link href="/home">
                    <Image
                        src="/images/logo/logo_transparent.png"
                        alt="Iron Logo"
                        width={60}
                        height={60}
                        className="h-auto w-14"
                    />
                </Link>
            </div>
            <nav>
                <ul className="space-y-4">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Button variant="ghost" className="w-full justify-start text-lg font-medium">
                                <Link href={item.href} className="w-full block text-left">{item.name}</Link>
                            </Button>
                        </li>
                    ))}
                    <li>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="w-full justify-start text-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            Logout
                        </Button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}