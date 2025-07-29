"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useReminders, type Reminder } from '@/hooks/useReminders';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReminderList } from '@/components/features/reminders/ReminderList';

export default function RemindersPage() {
    const { currentUser, userProfile } = useAuth();
    const userRole = userProfile?.role;
    const { reminders, loading } = useReminders();

    const handleToggleComplete = async (reminder: Reminder) => {
        if (!currentUser) return;
        const reminderDocRef = doc(db, 'users', currentUser.uid, 'reminders', reminder.id);
        await updateDoc(reminderDocRef, { completed: !reminder.completed });
    };

    const handleDeleteReminder = async (id: string) => {
        if (!currentUser || userRole !== 'instructor') return;
        const reminderDocRef = doc(db, 'users', currentUser.uid, 'reminders', id);
        await deleteDoc(reminderDocRef);
    };
    
    if (loading) {
        return <div className="p-10 text-center">Loading reminders...</div>;
    }

    return (
        <div className="flex flex-col">
            <h1 className="mb-8 text-5xl font-bold text-gray-800">Reminders</h1>
            <div className="rounded-lg bg-white p-8 shadow-lg">
                <ReminderList
                    reminders={reminders}
                    userRole={userRole ?? null}
                    currentUserId={currentUser?.uid ?? null}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteReminder}
                />
            </div>
        </div>
    );
}