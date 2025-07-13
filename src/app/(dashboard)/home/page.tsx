'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/../lib/firebase'; 

interface UserProfile {
  firstName: string;
  username: string;
}

export default function DashboardHomePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); 

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-800">Home</h1>
        <Link href="/profile">
          <button className="flex items-center space-x-4 rounded-full p-2 transition-colors hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-800">{userProfile?.firstName || 'User'}</p>
              <p className="text-sm text-yellow-600">@{userProfile?.username || 'user'}</p>
            </div>

            <div className="h-16 w-16 rounded-full bg-gray-300 ring-2 ring-yellow-500 flex items-center justify-center text-gray-600 font-bold text-xl">
              {userProfile?.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="col-span-1 flex h-32 items-center justify-center rounded-lg bg-yellow-500 p-4 text-center shadow-lg">
          <p className="text-xl font-bold text-gray-800">{formattedDate}</p>
        </div>

        <div className="col-span-1 rounded-lg bg-white p-4 shadow-lg md:col-span-2">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">Welcome!</h2>
          <p className="text-gray-600">This is your personalized dashboard. You can add widgets or important information here.</p>
        </div>

        <div className="col-span-1 rounded-lg bg-white p-4 shadow-lg md:col-span-3">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">Quick Actions</h2>
          <p className="text-gray-600">You can add quick links or buttons to frequently used features here.</p>
        </div>
      </div>
    </div>
  );
}