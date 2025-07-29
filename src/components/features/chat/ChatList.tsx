import Image from 'next/image';
import type { Chat } from '@/hooks/useChats';

interface ChatListProps {
    chats: Chat[];
    onSelectChat: (chat: Chat) => void;
    loading: boolean;
}

export function ChatList({ chats, onSelectChat, loading }: ChatListProps) {
    return (
        <div className="flex-1 overflow-y-auto pr-2">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Your Contacts</h2>
            {loading ? (
                <p>Loading chats...</p>
            ) : chats.length > 0 ? (
                <div className="space-y-4">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => onSelectChat(chat)}
                            className="flex w-full items-center rounded-lg bg-yellow-100 p-4 shadow-sm transition-transform hover:scale-[1.02] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <Image src={chat.otherParticipant.profileIcon || '/images/no_image.jpg'} alt="p" width={48} height={48} className="mr-4 h-12 w-12 flex-shrink-0 rounded-full bg-yellow-500 object-cover" />
                            <div className="text-left w-full overflow-hidden">
                                <p className="text-lg font-semibold text-gray-800">{chat.otherParticipant.firstName}</p>
                                <p className="text-sm text-gray-600 truncate">{chat.lastMessage || 'No messages yet'}</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10">No chat history. Add a contact to start messaging!</p>
            )}
        </div>
    );
}