// app/(dashboard)/chats/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  getDoc,
  setDoc,
  getDocs,
  limit
} from 'firebase/firestore';
import { auth, db } from '@/../lib/firebase';
import Image from 'next/image';

// Define data structures for type safety
interface ChatParticipant {
  uid: string;
  firstName: string;
  username: string;
  profileIcon: string;
}

interface Chat {
  id: string;
  otherParticipant: ChatParticipant;
  lastMessage?: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

interface SearchResultUser {
    uid: string;
    firstName: string;
    username: string;
    role: string;
}


export default function ChatsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [foundUser, setFoundUser] = useState<SearchResultUser | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found' | 'not_found'>('idle');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participantsUids', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatsPromises = snapshot.docs.map(async (chatDocument): Promise<Chat | null> => {
        const data = chatDocument.data();
        const otherParticipantUid = data.participantsUids.find((uid: string) => uid !== currentUser.uid);
        
        if (!otherParticipantUid) {
            return null;
        }

        const userDocRef = doc(db, 'users', otherParticipantUid); 
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as ChatParticipant;
          const chatObject: Chat = {
            id: chatDocument.id,
            otherParticipant: { ...userData, uid: otherParticipantUid },
            lastMessage: data.lastMessage,
          };
          return chatObject;
        }
        return null;
      });

      const chatsData = (await Promise.all(chatsPromises)).filter((chat): chat is Chat => chat !== null);
      
      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedChat) return;

    const messagesQuery = query(
      collection(db, 'chats', selectedChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessageText.trim() === '' || !currentUser || !selectedChat) return;

    const messagesRef = collection(db, 'chats', selectedChat.id, 'messages');
    await addDoc(messagesRef, {
      text: newMessageText,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'chats', selectedChat.id), { lastMessage: newMessageText }, { merge: true });

    setNewMessageText('');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '' || !currentUser) return;

    setSearchStatus('searching');
    setFoundUser(null);

    const q = query(
        collection(db, 'users'),
        where('username', '==', searchQuery.trim()),
        limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        setSearchStatus('not_found');
    } else {
        const userDoc = querySnapshot.docs[0];
        if (userDoc.id === currentUser.uid) {
            setSearchStatus('not_found');
        } else {
            setFoundUser({ uid: userDoc.id, ...userDoc.data() } as SearchResultUser);
            setSearchStatus('found');
        }
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
        });
    }

    setShowAddContactModal(false);
    setSearchQuery('');
    setFoundUser(null);
    setSearchStatus('idle');
    
    const userDoc = await getDoc(doc(db, 'users', targetUser.uid));
    const userData = userDoc.data() as ChatParticipant;

    const newChat: Chat = {
        id: chatID,
        otherParticipant: {
            ...userData,
            uid: targetUser.uid,
        }
    };
    setSelectedChat(newChat);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchStatus('idle');
    setFoundUser(null);
  }

  const renderChatList = () => (
    <div className="flex-1 overflow-y-auto pr-2">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Your Contacts</h2>
      {loading ? (
          <p>Loading chats...</p>
      ) : chats.length > 0 ? (
        <div className="space-y-4">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className="flex w-full items-center rounded-lg bg-yellow-100 p-4 shadow-sm transition-transform hover:scale-[1.02] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <Image src={chat.otherParticipant.profileIcon || '/images/no_image.png'} alt="p" width={48} height={48} className="mr-4 h-12 w-12 flex-shrink-0 rounded-full bg-yellow-500 object-cover"/>
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

  const renderChatView = () => (
    <div className="flex h-full flex-col">
      <div className="mb-4 border-b border-gray-200 pb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{selectedChat?.otherParticipant.firstName}</h2>
        <p className="text-md text-gray-600">@{selectedChat?.otherParticipant.username}</p>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-xl p-3 ${message.senderId === currentUser?.uid ? 'bg-yellow-500 text-gray-800' : 'bg-gray-200 text-gray-800'}`}>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="mt-4 flex items-center border-t border-gray-200 pt-4">
        <input value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} type="text" placeholder="Type your message..." className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500" />
        <button onClick={handleSendMessage} className="ml-4 flex items-center rounded-full bg-yellow-500 px-6 py-2 font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600">Send</button>
      </div>
    </div>
  );

  const renderAddContactModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Contact</h2>
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
                <input 
                    type="text"
                    placeholder="Search by exact username..."
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    className="w-full p-2 border rounded-md"
                />
                <button type="submit" className="bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-yellow-600" disabled={searchStatus === 'searching'}>
                    {searchStatus === 'searching' ? '...' : 'Search'}
                </button>
            </form>
            <div className="h-20 pt-2">
                {searchStatus === 'found' && foundUser && (
                    <div className="p-3 rounded-md bg-green-100 flex justify-between items-center animate-fade-in">
                        <div>
                            <p className="font-semibold">{foundUser.username} <span className="text-gray-600">({foundUser.firstName})</span></p>
                            {foundUser.role === 'instructor' && <span className="text-xs bg-yellow-400 text-gray-800 font-bold px-2 py-1 rounded-full">INSTRUCTOR</span>}
                        </div>
                        <button 
                            onClick={() => handleStartNewChat(foundUser)} 
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md"
                        >
                            Chat
                        </button>
                    </div>
                )}
                {searchStatus === 'not_found' && (
                    <div className="p-3 rounded-md bg-red-100 text-red-700 animate-fade-in">
                        <p>Invalid user or user not found.</p>
                    </div>
                )}
            </div>
            <button onClick={() => setShowAddContactModal(false)} className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                Close
            </button>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-800">Chats</h1>
        {selectedChat ? (
          <button onClick={() => setSelectedChat(null)} className="rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md">Back</button>
        ) : (
          <button onClick={() => setShowAddContactModal(true)} className="rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md">Add Contact</button>
        )}
      </div>
      <div className="mx-auto w-full max-w-8xl h-[85vh] rounded-lg bg-white p-8 shadow-lg flex flex-col overflow-hidden">
        {selectedChat ? renderChatView() : renderChatList()}
      </div>
      {showAddContactModal && renderAddContactModal()}
    </div>
  );
}
