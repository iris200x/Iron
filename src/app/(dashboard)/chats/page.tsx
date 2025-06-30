"use client";

import { useState } from 'react';

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<{ id: string; name: string; profession: string } | null>(null);

  const contacts = [
    { id: '1', name: 'John Doe', profession: 'Fitness Coach' },
    { id: '2', name: 'Jane Smith', profession: 'Nutritionist' },
    { id: '3', name: 'Alice Brown', profession: 'Yoga Instructor' },
    { id: '4', name: 'Bob White', profession: 'Personal Trainer' },
  ];

  const messages = [
    { id: 'm1', sender: 'John Doe', text: 'Hey there! How was your workout today?', time: '10:00 AM' },
    { id: 'm2', sender: 'You', text: 'It was great, thanks! Feeling strong.', time: '10:05 AM' },
    { id: 'm3', sender: 'John Doe', text: 'Awesome! Remember to stay hydrated.', time: '10:10 AM' },
    { id: 'm4', sender: 'You', text: 'Will do! What are your tips for recovery?', time: '10:15 AM' },
    { id: 'm5', sender: 'John Doe', text: 'Focus on stretching and getting enough sleep.', time: '10:20 AM' },
    { id: 'm6', sender: 'You', text: 'Got it. Thanks!', time: '10:25 AM' },
    { id: 'm7', sender: 'John Doe', text: 'No problem! Let me know if you need anything else.', time: '10:30 AM' },
    { id: 'm8', sender: 'You', text: 'Will do! What are your tips for recovery?', time: '10:15 AM' },
    { id: 'm9', sender: 'John Doe', text: 'Focus on stretching and getting enough sleep.', time: '10:20 AM' },
    { id: 'm10', sender: 'You', text: 'Got it. Thanks!', time: '10:25 AM' },
  ];

  const handleOpenChat = (contact: typeof contacts[0]) => {
    setSelectedChat(contact);
  };

  const handleBackToContacts = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col"> 
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-800">Chats</h1>
        {selectedChat ? (
          <button
            onClick={handleBackToContacts}
            className="flex items-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Contacts
          </button>
        ) : (
          <button
            onClick={() => alert('Add New Contact functionality goes here!')}
            className="rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
          >
            Add Contact
          </button>
        )}
      </div>

      <div className="mx-auto w-full max-w-8xl h-[85vh] rounded-lg bg-white p-8 shadow-lg flex flex-col overflow-hidden">
        {selectedChat ? (
          <div className="flex h-full flex-col">
            <div className="mb-4 border-b border-gray-200 pb-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedChat.name}</h2>
              <p className="text-md text-gray-600">{selectedChat.profession}</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100% - 120px)' }}> {/* Adjusted height for input */}
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === selectedChat.name ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-xl p-3 ${
                        message.sender === selectedChat.name
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-yellow-500 text-gray-800'
                      }`}
                    >
                      <p className="font-semibold">{message.sender}</p>
                      <p>{message.text}</p>
                      <p className="mt-1 text-right text-xs text-gray-500">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center border-t border-gray-200 pt-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
              <button className="ml-4 flex items-center rounded-full bg-yellow-500 px-6 py-2 font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
                Send
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Your Contacts</h2>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleOpenChat(contact)}
                  className="flex w-full items-center rounded-lg bg-yellow-100 p-4 shadow-sm transition-transform hover:scale-[1.02] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
                >
                  <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-gray-800">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-semibold text-gray-800">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.profession}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
