"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';


interface SearchResultUser {
    uid: string;
    firstName: string;
    username: string;
    role: string;
}

interface AddContactModalProps {
    onClose: () => void;
}

export function AddContactModal({ onClose }: AddContactModalProps) {
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [foundUser, setFoundUser] = useState<SearchResultUser | null>(null);
    const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found' | 'not_found'>('idle');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() === '' || !currentUser) return;

        setSearchStatus('searching');
        setFoundUser(null);

        const q = query(collection(db, 'users'), where('username', '==', searchQuery.trim()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty || querySnapshot.docs[0].id === currentUser.uid) {
            setSearchStatus('not_found');
        } else {
            const userDoc = querySnapshot.docs[0];
            setFoundUser({ uid: userDoc.id, ...userDoc.data() } as SearchResultUser);
            setSearchStatus('found');
        }
    };

    const handleStartNewChat = async (targetUser: SearchResultUser) => {
        if (!currentUser) return;

        const chatID = [currentUser.uid, targetUser.uid].sort().join('_');
        const chatDocRef = doc(db, 'chats', chatID);

        const chatDoc = await getDoc(chatDocRef);
        if (!chatDoc.exists()) {
            await setDoc(chatDocRef, {
                participantsUids: [currentUser.uid, targetUser.uid],
                lastMessage: '',
                clientStatus: 'none',
                createdAt: serverTimestamp()
            });
        }
        onClose(); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Add New Contact</h2>
                <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
                    <Input
                        type="text"
                        placeholder="Search by exact username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" disabled={searchStatus === 'searching'}>
                        {searchStatus === 'searching' ? '...' : 'Search'}
                    </Button>
                </form>
                <div className="h-20 pt-2">
                    {searchStatus === 'found' && foundUser && (
                        <div className="p-3 rounded-md bg-green-100 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{foundUser.username}</p>
                            </div>
                            <Button size="sm" onClick={() => handleStartNewChat(foundUser)}>
                                Chat
                            </Button>
                        </div>
                    )}
                    {searchStatus === 'not_found' && (
                        <div className="p-3 rounded-md bg-red-100 text-red-700">
                            <p>User not found or you cannot add yourself.</p>
                        </div>
                    )}
                </div>
                <Button onClick={onClose} variant="outline" className="mt-4 w-full">
                    Close
                </Button>
            </div>
        </div>
    );
}