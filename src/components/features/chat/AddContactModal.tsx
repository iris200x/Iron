"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Chat } from '@/hooks/useChats';

interface UserResult {
    uid: string;
    firstName: string;
    username: string;
    profileIcon?: string;
}

interface AddContactModalProps {
    onClose: () => void;
    existingChats: Chat[];
}

export function AddContactModal({ onClose, existingChats }: AddContactModalProps) {
    const { currentUser } = useAuth();

    // State for search functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [foundUser, setFoundUser] = useState<UserResult | null>(null);
    const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found' | 'not_found'>('idle');

    // State for user suggestions
    const [suggestedUsers, setSuggestedUsers] = useState<UserResult[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchSuggestions = async () => {
            setSuggestionsLoading(true);
            const existingContactIds = new Set(existingChats.map(chat => chat.otherParticipant.uid));
            existingContactIds.add(currentUser.uid);

            // --- FIX: This query now fetches ALL users from the database ---
            const allUsersQuery = query(collection(db, 'users'));
            const querySnapshot = await getDocs(allUsersQuery);

            // Filter out users who are already contacts or the current user
            const users = querySnapshot.docs
                .map(doc => ({ uid: doc.id, ...doc.data() }) as UserResult)
                .filter(user => !existingContactIds.has(user.uid));

            setSuggestedUsers(users);
            setSuggestionsLoading(false);
        };

        fetchSuggestions();
    }, [currentUser, existingChats]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim() || !currentUser) return;
        setSearchStatus('searching');
        setFoundUser(null);

        const q = query(collection(db, 'users'), where('username', '==', searchQuery.trim()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty || querySnapshot.docs[0].id === currentUser.uid) {
            setSearchStatus('not_found');
        } else {
            const userDoc = querySnapshot.docs[0];
            setFoundUser({ uid: userDoc.id, ...userDoc.data() } as UserResult);
            setSearchStatus('found');
        }
    };

    const handleStartNewChat = async (targetUser: UserResult) => {
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
                    <Input placeholder="Search by exact username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <Button type="submit" disabled={searchStatus === 'searching'}>{searchStatus === 'searching' ? '...' : 'Search'}</Button>
                </form>

                <div className="h-20 pt-2">
                    {searchStatus === 'found' && foundUser && (
                        <div className="p-3 rounded-md bg-green-100 flex justify-between items-center">
                            <p className="font-semibold">{foundUser.username}</p>
                            <Button size="sm" onClick={() => handleStartNewChat(foundUser)}>Chat</Button>
                        </div>
                    )}
                    {searchStatus === 'not_found' && <p className="text-red-500">User not found.</p>}
                </div>

                <hr className="my-4" />
                <h3 className="text-lg font-semibold mb-4 text-gray-700">All Users</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {suggestionsLoading ? <p className="text-gray-500">Loading...</p> : suggestedUsers.length > 0 ? (
                        suggestedUsers.map(user => (
                            <div key={user.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Image src={user.profileIcon || '/images/no_image.jpg'} alt={user.firstName} width={40} height={40} className="rounded-full" />
                                    <div>
                                        <p className="font-semibold">{user.firstName}</p>
                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => handleStartNewChat(user)}>Chat</Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No new users to suggest.</p>
                    )}
                </div>

                <Button onClick={onClose} variant="outline" className="mt-6 w-full">
                    Close
                </Button>
            </div>
        </div>
    );
}