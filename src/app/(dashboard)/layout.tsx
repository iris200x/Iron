// src/app/(dashboard)/layout.tsx
"use client"; // This layout will be a client component because it has interactive elements (sidebar navigation)

import Link from 'next/link';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'Goals', href: '/goals' },
    { name: 'Learning', href: '/learning' },
    { name: 'Chats', href: '/chats' },
    { name: 'Reminders', href: '/reminders' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-300 via-white to-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-8 flex items-center justify-center">
          {/* Logo Placeholder */}
          <Image
            src="/images/logo/logo_transparent.png" // Reusing the same logo from home page
            alt="Iron Logo"
            width={60}
            height={60}
            className="h-auto w-14"
          />
        </div>

        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href}>
                  <button className="flex w-full items-center rounded-md px-4 py-2 text-left text-lg font-medium text-gray-700 transition-colors hover:bg-yellow-100 hover:text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
                    {item.name}
                  </button>
                </Link>
              </li>
            ))}
            {/* Logout Button */}
            <li>
              <Link href="/"> {/* Link back to the public home page for logout */}
                <button className="flex w-full items-center rounded-md px-4 py-2 text-left text-lg font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75">
                  Logout
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children} {/* This is where the content of nested pages like home/page.tsx will be rendered */}
      </main>
    </div>
  );
}
