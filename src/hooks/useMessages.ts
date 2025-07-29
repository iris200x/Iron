// This hook will fetch the messages for a specific chat
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: any;
}

export function useMessages(chatId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            return;
        };

        const messagesQuery = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, [chatId]);

    return { messages };
}