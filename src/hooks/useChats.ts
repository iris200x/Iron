import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatParticipant {
	uid: string;
	firstName: string;
	username: string;
	profileIcon: string;
	role: 'user' | 'instructor';
}

export interface Chat {
	id: string;
	otherParticipant: ChatParticipant;
	lastMessage?: string;
	clientStatus: 'none' | 'pending' | 'accepted';
	offerSentBy?: string;
}

export function useChats() {
	const { currentUser } = useAuth();
	const [chats, setChats] = useState<Chat[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!currentUser) return;

		const chatsQuery = query(collection(db, 'chats'), where('participantsUids', 'array-contains', currentUser.uid));

		const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
			const chatsPromises = snapshot.docs.map(async (chatDocument): Promise<Chat | null> => {
				const data = chatDocument.data();
				const otherParticipantUid = data.participantsUids.find((uid: string) => uid !== currentUser.uid);
				if (!otherParticipantUid) return null;

				const userDoc = await getDoc(doc(db, 'users', otherParticipantUid));
				if (userDoc.exists()) {
					const userData = userDoc.data() as Omit<ChatParticipant, 'uid'>;
					return {
						id: chatDocument.id,
						otherParticipant: { ...userData, uid: otherParticipantUid },
						lastMessage: data.lastMessage,
						clientStatus: data.clientStatus || 'none',
						offerSentBy: data.offerSentBy
					};
				}
				return null;
			});

			const chatsData = (await Promise.all(chatsPromises)).filter((chat): chat is Chat => chat !== null);
			setChats(chatsData);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [currentUser]);

	return { chats, loading };
}