import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';


export interface Reminder {
    id: string;
    text: string;
    completed: boolean;
    createdBy?: {
        uid: string;
        name: string;
    };
}

export function useReminders() {
    const { currentUser } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const remindersRef = collection(db, 'users', currentUser.uid, 'reminders');
        const q = query(remindersRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const remindersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reminder));
            setReminders(remindersList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return { reminders, loading };
}