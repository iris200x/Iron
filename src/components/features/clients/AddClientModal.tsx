"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSuggestedClients, type SuggestedClient } from '@/hooks/useSuggestedClients';


interface DetailedClientProfile extends SuggestedClient {
    goals?: string;
    biography?: string;
}

export function AddClientModal({ onClose }: { onClose: () => void }) {
  
    const { currentUser, userProfile } = useAuth();

    const { suggestions, loading: suggestionsLoading } = useSuggestedClients();
    const [offeredClients, setOfferedClients] = useState<string[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [foundUser, setFoundUser] = useState<DetailedClientProfile | null>(null);
    const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found' | 'not_found'>('idle');

    const [view, setView] = useState<'main' | 'detail'>('main');
    const [selectedUser, setSelectedUser] = useState<DetailedClientProfile | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim() || !currentUser) return;
        setSearchStatus('searching');
        setFoundUser(null);

        const q = query(collection(db, 'users'), where("username", "==", searchQuery.trim()), where("role", "==", "user"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty || querySnapshot.docs[0].id === currentUser.uid) {
            setSearchStatus('not_found');
        } else {
            const userDoc = querySnapshot.docs[0];
            setFoundUser({ uid: userDoc.id, ...userDoc.data() } as DetailedClientProfile);
            setSearchStatus('found');
        }
    };

    const handleViewProfile = async (user: SuggestedClient) => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            setSelectedUser({ uid: userDoc.id, ...userDoc.data() } as DetailedClientProfile);
            setView('detail');
        }
    };

    const handleOfferClient = async (targetUser: SuggestedClient) => {
        if (!currentUser || !userProfile) return;
        setOfferedClients(prev => [...prev, targetUser.uid]);

       
        const assignmentRef = doc(db, 'users', targetUser.uid, 'pendingAssignments', `offer_${currentUser.uid}`);
        await setDoc(assignmentRef, {
            type: 'client-offer',
            assignedBy: { uid: currentUser.uid, name: `${userProfile.firstName} ${userProfile.lastName}`, profileIcon: userProfile.profileIcon || null },
            assignedAt: serverTimestamp(),
            status: 'pending'
        });

        
        const clientRef = doc(db, 'users', currentUser.uid, 'clients', targetUser.uid);
        await setDoc(clientRef, {
            status: 'pending',
            addedAt: serverTimestamp()
        });
    };

 
    const renderMainView = () => (
        <>
            <h2 className="text-2xl font-bold mb-4">Find a New Client</h2>
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
                <Input placeholder="Search by exact username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button type="submit" disabled={searchStatus === 'searching'}>{searchStatus === 'searching' ? '...' : 'Search'}</Button>
            </form>

            <div className="h-20 pt-2">
                {searchStatus === 'found' && foundUser && (
                    <div className="p-3 rounded-md bg-green-100 flex justify-between items-center">
                        <p className="font-semibold">{foundUser.username}</p>
                        <Button size="sm" variant="outline" onClick={() => handleViewProfile(foundUser)}>View Profile</Button>
                    </div>
                )}
                {searchStatus === 'not_found' && <p className="text-red-500">User not found.</p>}
            </div>

            <hr className="my-4" />
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Suggested Users</h3>
            <div className="space-y-4">
                {suggestionsLoading ? <p>Loading...</p> : suggestions.map(user => (
                    <div key={user.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Image src={user.profileIcon || '/images/no_image.jpg'} alt={user.firstName} width={40} height={40} className="rounded-full" />
                            <div>
                                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleViewProfile(user)}>View Profile</Button>
                    </div>
                ))}
            </div>
            <Button onClick={onClose} variant="outline" className="mt-6 w-full">Close</Button>
        </>
    );

    const renderDetailView = () => {
        if (!selectedUser) return null;
        return (
            <>
                <Button onClick={() => setView('main')} variant="ghost" icon="back" className="mb-4 -ml-4">Back to List</Button>
                <div className="flex flex-col items-center text-center">
                    <Image src={selectedUser.profileIcon || '/images/no_image.jpg'} alt={selectedUser.firstName} width={80} height={80} className="rounded-full mb-4 ring-4 ring-yellow-500 p-1" />
                    <h2 className="text-2xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                    <p className="text-md text-gray-500 mb-4">@{selectedUser.username}</p>
                    <div className="w-full text-left bg-gray-50 p-4 rounded-lg">
                        <p><strong className="text-gray-800">Goal:</strong> {selectedUser.goals || 'Not specified'}</p>
                        <p className="mt-2"><strong className="text-gray-800">Bio:</strong> {selectedUser.biography || 'Not specified'}</p>
                    </div>
                    <Button
                        onClick={() => handleOfferClient(selectedUser)}
                        disabled={offeredClients.includes(selectedUser.uid)}
                        className="mt-6 w-full"
                        size="lg"
                    >
                        {offeredClients.includes(selectedUser.uid) ? 'Offer Sent' : 'Offer to be Trainer'}
                    </Button>
                </div>
            </>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                {view === 'main' ? renderMainView() : renderDetailView()}
            </div>
        </div>
    );
}