import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface ClientProfile {
    uid: string;
    status: 'pending' | 'accepted';
    firstName: string;
    lastName: string;
    username: string;
    profileIcon?: string;
    goals?: string; 
}

export function useClients() {
    const { currentUser } = useAuth();
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const clientsRef = collection(db, 'users', currentUser.uid, 'clients');
        const q = query(clientsRef);

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const clientPromises = snapshot.docs.map(async (clientDoc) => {
                const clientStatus = clientDoc.data().status || 'accepted';
                const clientUid = clientDoc.id;

                const userDocRef = doc(db, 'users', clientUid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    return {
                        uid: userDoc.id,
                        status: clientStatus,
                        ...userDoc.data()
                    } as ClientProfile;
                }
                return null;
            });

            const clientsData = (await Promise.all(clientPromises)).filter((c): c is ClientProfile => c !== null);
            setClients(clientsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return { clients, loading };
}