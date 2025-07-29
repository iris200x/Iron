import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SubTask {
    text: string;
    completed: boolean;
}

export interface Goal {
    id: string;
    title: string;
    type: 'workout' | 'diet';
    repetitions: string;
    subTasks: SubTask[];
    progress: number;
}

export function useGoals() {
    const { currentUser } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const goalsCollectionRef = collection(db, 'users', currentUser.uid, 'goals');
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
    }, [currentUser]);

    return { goals, loading };
}