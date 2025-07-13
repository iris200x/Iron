"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/../lib/firebase'; 

interface UserProfile {
  profileIcon: string;
  firstName: string;
  lastName:string;
  username: string;
  age: number;
  gender: string;
  healthStatus: string;
  goals: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          console.error("User document not found in Firestore for UID:", user.uid);
        }
        setLoading(false);
      } else {
        router.push('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleProfileIconClick = () => {
    alert('Profile icon upload functionality using Firebase Storage would go here!');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save Changes button clicked.");

    if (!currentUser) {
      console.error("Save failed: User is not authenticated.");
      setStatus('error');
      return;
    }
    
    if (!profile) {
      console.error("Save failed: No profile data is loaded in the component.");
      setStatus('error');
      return;
    }

    console.log("Attempting to save for user ID:", currentUser.uid);
    setStatus('saving');
    const userDocRef = doc(db, 'users', currentUser.uid);

    try {
      const profileDataToSave = {
        username: profile.username,
        age: Number(profile.age), 
        gender: profile.gender,
        healthStatus: profile.healthStatus,
        goals: profile.goals,
      };

      console.log("Data being sent to Firestore:", profileDataToSave);
      console.log("Document reference path:", userDocRef.path);
      
      await updateDoc(userDocRef, profileDataToSave);
      
      setStatus('success');
      console.log("Success! Profile updated in Firestore.");

    } catch (error) {
      console.error("Firestore Update Error:", error);
      setStatus('error');
    }
  };

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const healthStatusOptions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const fitnessGoalsOptions = ['Build Muscle', 'Lose Weight', 'Improve Endurance', 'Increase Flexibility', 'General Fitness', 'Stress Relief', 'Sports Specific Training', 'Rehabilitation', 'Other'];

  if (loading) {
    return <div className="text-center p-10">Loading Profile...</div>;
  }

  if (!profile) {
    return <div className="text-center p-10">Could not find user profile.</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-800">Edit Profile</h1>
        <Link href="/home">
          <button className="flex items-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
        </Link>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <button type="button" onClick={handleProfileIconClick} className="group relative h-32 w-32 cursor-pointer rounded-full bg-gray-300 ring-4 ring-yellow-500">
              <Image
                src={profile.profileIcon || '/images/no_image.png'}
                alt="Profile Icon"
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-white text-sm font-semibold">Change Photo</span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" value={profile.firstName} readOnly className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 text-gray-500"/>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" value={profile.lastName} readOnly className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 text-gray-500"/>
            </div>
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">Username</label>
              <input type="text" id="username" name="username" value={profile.username} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"/>
            </div>
            <div>
              <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-700">Age</label>
              <input type="number" id="age" name="age" value={profile.age} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"/>
            </div>
            <div>
              <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
              <select id="gender" name="gender" value={profile.gender} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
                {genderOptions.map((option) => (<option key={option} value={option.toLowerCase().replace(/\s/g, '-')}>{option}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="healthStatus" className="mb-2 block text-sm font-medium text-gray-700">Health Status</label>
              <select id="healthStatus" name="healthStatus" value={profile.healthStatus} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
                {healthStatusOptions.map((option) => (<option key={option} value={option.toLowerCase().replace(/\s/g, '-')}>{option}</option>))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="goals" className="mb-2 block text-sm font-medium text-gray-700">Fitness Goals</label>
              <select id="goals" name="goals" value={profile.goals} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
                {fitnessGoalsOptions.map((option) => (<option key={option} value={option.toLowerCase().replace(/\s/g, '-')}>{option}</option>))}
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={status === 'saving'} className="flex w-full justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:bg-yellow-300">
              {status === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
            {status === 'success' && <p className="text-center text-green-600 mt-2">Profile updated successfully!</p>}
            {status === 'error' && <p className="text-center text-red-600 mt-2">Failed to update profile. Check console for details.</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
