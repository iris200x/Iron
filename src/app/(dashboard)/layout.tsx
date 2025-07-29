"use client";

import { Sidebar } from '@/components/shared/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-yellow-300 via-white to-white">
            <Sidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}