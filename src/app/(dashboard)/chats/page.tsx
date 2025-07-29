"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChats, type Chat } from '@/hooks/useChats';
import { ChatList } from '@/components/features/chat/ChatList';
import { ChatWindow } from '@/components/features/chat/ChatWindow';
import { Button } from '@/components/ui/Button';
import { AddContactModal } from '@/components/features/chat/AddContactModal';

export default function ChatsPage() {
    useAuth();
    const { chats, loading } = useChats();
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [showAddContactModal, setShowAddContactModal] = useState(false);

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-5xl font-bold text-gray-800">Chats</h1>
                {selectedChat ? (
                    <Button onClick={() => setSelectedChat(null)}>Back to Contacts</Button>
                ) : (
                    <Button onClick={() => setShowAddContactModal(true)}>Add Contact</Button>
                )}
            </div>
            <div className="mx-auto w-full max-w-8xl h-[85vh] rounded-lg bg-white p-8 shadow-lg flex flex-col overflow-hidden">
                {selectedChat ? (
                    <ChatWindow chat={selectedChat} />
                ) : (
                    <ChatList chats={chats} onSelectChat={setSelectedChat} loading={loading} />
                )}
            </div>


            {showAddContactModal && <AddContactModal onClose={() => setShowAddContactModal(false)} />}
        </div>
    );
}