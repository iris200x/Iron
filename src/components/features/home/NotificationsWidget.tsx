"use client";

import { PendingAssignmentCard } from '@/components/features/home/PendingAssignmentCard';
import type { PendingAssignment } from '@/hooks/usePendingAssignments';



const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);


interface NotificationsWidgetProps {
    userRole: string | null;
    pendingAssignments: PendingAssignment[];
}

export function NotificationsWidget({ userRole, pendingAssignments }: NotificationsWidgetProps) {
    const hasNotifications = userRole === 'user' && pendingAssignments.length > 0;

    return (
        <div className="col-span-1 rounded-lg bg-white p-6 shadow-lg md:col-span-3">

            <div className="flex items-center justify-between mb-4 border-b pb-3">
                <div className="flex items-center gap-3">
                    <BellIcon className="h-6 w-6 text-gray-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                </div>
                {hasNotifications && (
                    <span className="flex h-6 w-6 items-center justify-center bg-yellow-500 text-sm font-bold text-gray-800 rounded-full">
                        {pendingAssignments.length}
                    </span>
                )}
            </div>

            <div className="min-h-[12rem] flex flex-col justify-center">
                {hasNotifications ? (
                    <div className="space-y-4">
                        {pendingAssignments.map(assignment => (
                            <PendingAssignmentCard key={assignment.id} assignment={assignment} />
                        ))}
                    </div>
                ) : (

                    <div className="flex flex-col items-center justify-center text-center">
                        <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-700">All Caught Up!</h3>
                        <p className="text-sm text-gray-500">There are no new notifications for you right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}