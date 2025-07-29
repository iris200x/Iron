import { Button } from '@/components/ui/Button';
import type { Reminder } from '@/hooks/useReminders';

const CheckCircleIcon = ({ completed }: { completed: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const EmptyStateIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const InstructorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0118 21h-3.268a8.966 8.966 0 01-3.468 0H6a8.966 8.966 0 013.468-2.275L12 18.75l2.532.725z" />
    </svg>
);


interface ReminderListProps {
    reminders: Reminder[];
    userRole: string | null;
    currentUserId: string | null;
    onToggleComplete: (reminder: Reminder) => void;
    onDelete: (id: string) => void;
}

export function ReminderList({ reminders, userRole, currentUserId, onToggleComplete, onDelete }: ReminderListProps) {
    const pendingReminders = reminders.filter(r => !r.completed);
    const completedReminders = reminders.filter(r => r.completed);

    if (reminders.length === 0) {
        return (
            <div className="text-center py-16">
                <EmptyStateIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold text-gray-800">No Reminders Yet</h3>
                <p className="mt-1 text-gray-500">
                    {userRole === 'instructor' ? 'You can set reminders for your clients on the Clients page.' : 'Your instructor can set reminders for you.'}
                </p>
            </div>
        );
    }

    const renderReminderItem = (reminder: Reminder) => {
        const isFromInstructor = reminder.createdBy && reminder.createdBy.uid !== currentUserId;
        return (
            <div key={reminder.id} className={`flex items-center justify-between rounded-lg p-4 shadow-sm ${reminder.completed ? 'bg-gray-100 opacity-70' : 'bg-yellow-100'}`}>
                <div className="flex-grow">
                    <p className={`text-lg font-medium ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{reminder.text}</p>
                    {isFromInstructor && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <InstructorIcon className="h-4 w-4" />
                            <span>Set by {reminder.createdBy?.name}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4 pl-4 flex-shrink-0">
                    <button onClick={() => onToggleComplete(reminder)} title="Toggle Complete"><CheckCircleIcon completed={reminder.completed} /></button>
                    {userRole === 'instructor' && (
                        <button onClick={() => onDelete(reminder.id)} title="Delete Reminder" className="text-gray-400 hover:text-red-500">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {pendingReminders.length > 0 && (
                <div>
                    <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3">Pending</h2>
                    <div className="space-y-3">{pendingReminders.map(renderReminderItem)}</div>
                </div>
            )}
            {completedReminders.length > 0 && (
                <div>
                    <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3">Completed</h2>
                    <div className="space-y-3">{completedReminders.map(renderReminderItem)}</div>
                </div>
            )}
        </div>
    );
}