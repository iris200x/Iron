'use client';

import { useAuth } from '@/contexts/AuthContext';
import { DateWidget } from '@/components/features/home/DateWidget';
import { WelcomeWidget } from '@/components/features/home/WelcomeWidget';
import { usePendingAssignments } from '@/hooks/usePendingAssignments';

import { NotificationsWidget } from '@/components/features/home/NotificationsWidget';

export default function DashboardHomePage() {
    const { userProfile, loading } = useAuth();
    const { assignments: pendingAssignments } = usePendingAssignments();

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-5xl font-bold text-gray-800">Home</h1>
            </div>



            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <DateWidget />
                <WelcomeWidget userProfile={userProfile} />

                <NotificationsWidget userRole={userProfile?.role ?? null} pendingAssignments={pendingAssignments} />
            </div>
        </div>
    );
}