"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/hooks/useMessages';
import type { Chat } from '@/hooks/useChats';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// --- UPDATED: Import deleteDoc for cleaning up notifications ---
import { doc, updateDoc, addDoc, collection, serverTimestamp, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

interface ChatWindowProps {
    chat: Chat;
}

export function ChatWindow({ chat }: ChatWindowProps) {
    const { currentUser, userProfile } = useAuth();
    const userRole = userProfile?.role;
    const { messages } = useMessages(chat.id);
    const [newMessageText, setNewMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessageText.trim() === '' || !currentUser) return;
        const messagesRef = collection(db, 'chats', chat.id, 'messages');
        await addDoc(messagesRef, { text: newMessageText, senderId: currentUser.uid, createdAt: serverTimestamp() });
        await updateDoc(doc(db, 'chats', chat.id), { lastMessage: newMessageText });
        setNewMessageText('');
    };

    // --- UPDATED: 'handleOffer' now also creates the home page notification ---
    const handleOffer = async () => {
        if (!currentUser || !userProfile) return;

        // Action 1: Create the pending assignment for the client's home page
        const assignmentRef = doc(db, 'users', chat.otherParticipant.uid, 'pendingAssignments', `offer_${currentUser.uid}`);
        await setDoc(assignmentRef, {
            type: 'client-offer',
            assignedBy: { uid: currentUser.uid, name: `${userProfile.firstName} ${userProfile.lastName}`, profileIcon: userProfile.profileIcon || null },
            assignedAt: serverTimestamp(),
            status: 'pending'
        });

        // Action 2: Update the chat status
        const chatDocRef = doc(db, 'chats', chat.id);
        await updateDoc(chatDocRef, {
            clientStatus: 'pending',
            offerSentBy: currentUser.uid
        });
    };

    // --- UPDATED: 'handleAcceptOffer' now also cleans up the notification ---
    const handleAcceptOffer = async () => {
        if (!currentUser) return;
        const instructorId = chat.otherParticipant.uid;

        // Action 1: Update the chat status
        const chatDocRef = doc(db, 'chats', chat.id);
        await updateDoc(chatDocRef, { clientStatus: 'accepted' });

        // Action 2: Add the user to the instructor's client list
        const clientRef = doc(db, 'users', instructorId, 'clients', currentUser.uid);
        await setDoc(clientRef, {
            status: 'accepted',
            addedAt: serverTimestamp()
        });

        // Action 3: Delete the pending assignment from the client's home page
        const assignmentRef = doc(db, 'users', currentUser.uid, 'pendingAssignments', `offer_${instructorId}`);
        await deleteDoc(assignmentRef);
    };

    // --- UPDATED: 'handleDeclineOffer' now also cleans up the notification ---
    const handleDeclineOffer = async () => {
        if (!currentUser) return;
        const instructorId = chat.otherParticipant.uid;

        // Action 1: Update the chat status
        const chatDocRef = doc(db, 'chats', chat.id);
        await updateDoc(chatDocRef, { clientStatus: 'none', offerSentBy: null });

        // Action 2: Delete the pending assignment from the client's home page
        const assignmentRef = doc(db, 'users', currentUser.uid, 'pendingAssignments', `offer_${instructorId}`);
        await deleteDoc(assignmentRef);
    };

    const renderInteractionBar = () => {
        if (!currentUser || !userRole) return null;
        const isInstructor = userRole === 'instructor';

        if (isInstructor && chat.otherParticipant.role === 'user') {
            switch (chat.clientStatus) {
                case 'none':
                    return <Button onClick={handleOffer} variant="form" size="sm" className="mb-4">Offer to be Trainer</Button>;
                case 'pending':
                    // --- UPDATED: Shows "Offered" when pending ---
                    return <Button variant="form" size="sm" className="mb-4" disabled>Offered</Button>;
                case 'accepted':
                    return null;
            }
        }

        if (!isInstructor && chat.otherParticipant.role === 'instructor') {
            if (chat.clientStatus === 'pending' && chat.offerSentBy === chat.otherParticipant.uid) {
                return (
                    <div className="w-full p-3 bg-blue-100 text-blue-800 rounded-md mb-4 text-center">
                        <p className="font-semibold">{chat.otherParticipant.firstName} has offered to be your trainer.</p>
                        <div className="mt-2 space-x-4">
                            <Button onClick={handleAcceptOffer} size="sm">Accept</Button>
                            <Button onClick={handleDeclineOffer} variant="destructive" size="sm">Decline</Button>
                        </div>
                    </div>
                );
            }
            if (chat.clientStatus === 'accepted') {
                return null;
            }
        }
        return null;
    };

    return (
        <div className="flex h-full flex-col">
            <div className="mb-4 flex items-center border-b border-gray-200 pb-4">
                <Image src={chat.otherParticipant.profileIcon || '/images/no_image.jpg'} alt="p" width={40} height={40} className="mr-4 h-10 w-10 flex-shrink-0 rounded-full object-cover" />
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {chat.otherParticipant.firstName}
                        {chat.clientStatus === 'accepted' && (
                            <span className="text-xs font-semibold bg-green-500 text-white px-2 py-1 rounded-full">
                                {userRole === 'instructor' ? 'Client' : 'Instructor'}
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-600">@{chat.otherParticipant.username}</p>
                </div>
            </div>
            {renderInteractionBar()}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-xl p-3 ${message.senderId === currentUser?.uid ? 'bg-yellow-500 text-gray-800' : 'bg-gray-200 text-gray-800'}`}>
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 flex items-center border-t border-gray-200 pt-4">
                <Input value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." className="flex-1" />
                <Button onClick={handleSendMessage} className="ml-4" size="lg" disabled={!newMessageText.trim()}>Send</Button>
            </div>
        </div>
    );
}