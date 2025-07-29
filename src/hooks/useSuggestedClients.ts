import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from './useClients';
export interface SuggestedClient {
    uid: string;
    firstName: string;
    lastName: string;
    username: string;
    profileIcon?: string;
}

export function useSuggestedClients() {
    const { currentUser } = useAuth();
    const { clients } = useClients();
    const [suggestions, setSuggestions] = useState<SuggestedClient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchSuggestions = async () => {
            const currentClientIds = clients.map(c => c.uid);
            const allUsersQuery = query(collection(db, 'users'), where('role', '==', 'user'));
            const querySnapshot = await getDocs(allUsersQuery);

            const suggestedUsers = querySnapshot.docs
                .map(doc => ({ uid: doc.id, ...doc.data() } as SuggestedClient))
                .filter(user => user.uid !== currentUser.uid && !currentClientIds.includes(user.uid));

            setSuggestions(suggestedUsers);
            setLoading(false);
        };

        fetchSuggestions();
    }, [currentUser, clients]);

    return { suggestions, loading };
}