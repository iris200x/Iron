import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SubTask {
    name: string;
    amount: number;
    unit: string;
    rest?: number;
    completed: boolean;
}

export interface Goal {
    id: string;
    title: string;
    type: 'workout' | 'diet';
    days: string[];
    duration: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    notes?: string;
    subTasks: SubTask[];
    startDate: Timestamp; 
    weeklyProgress: { [weekAndDay: string]: boolean };
}

export function useGoals(userId?: string | null) {
    const { currentUser } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const targetUid = userId || currentUser?.uid;

        if (!targetUid) {
            setLoading(false);
            return;
        };

        const goalsCollectionRef = collection(db, 'users', targetUid, 'goals');
        const q = query(goalsCollectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const goalsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Goal[];
            setGoals(goalsList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser, userId]);

    return { goals, loading };
}