import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Goal } from './useGoals';

export interface PendingAssignment {
    id: string;
    type: 'client-offer' | 'reminder' | 'goal';
    assignedBy: {
        uid: string;
        name: string;
        profileIcon?: string;
    };
    payload?: { text: string } | Goal;
}

export function usePendingAssignments() {
    const { currentUser } = useAuth();
    const [assignments, setAssignments] = useState<PendingAssignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        };

        const q = query(collection(db, 'users', currentUser.uid, 'pendingAssignments'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const assignmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PendingAssignment));
            setAssignments(assignmentsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return { assignments, loading };
}