"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

import { Textarea } from '@/components/ui/Textarea';


interface UserProfile {
    profileIcon: string;
    firstName: string;
    lastName: string;
    username: string;
    age: number;
    gender: string;
    healthStatus: string;
    goals: string;
    biography?: string;
}

interface ProfileFormProps {
    initialProfile: UserProfile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(initialProfile);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    useEffect(() => {
        setProfile(initialProfile);
    }, [initialProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            setStatus('error');
            return;
        }

        setStatus('saving');
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
            
            const profileDataToSave = {
                username: profile.username,
                age: Number(profile.age),
                gender: profile.gender,
                healthStatus: profile.healthStatus,
                goals: profile.goals,
                biography: profile.biography || "", 
            };
            await updateDoc(userDocRef, profileDataToSave);
            setStatus('success');
        } catch (error) {
            console.error("Firestore Update Error:", error);
            setStatus('error');
        }
    };

    const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
    const healthStatusOptions = ['Excellent', 'Good', 'Fair', 'Poor'];
    const fitnessGoalsOptions = ['Build Muscle', 'Lose Weight', 'Improve Endurance', 'General Fitness', 'Other'];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                <button type="button" className="group relative h-32 w-32 cursor-pointer rounded-full bg-gray-300 ring-4 ring-yellow-500">
                    <Image src={profile.profileIcon || '/images/no_image.png'} alt="Profile Icon" width={128} height={128} className="rounded-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-white text-sm font-semibold">Change Photo</span>
                    </div>
                </button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                    <Input type="text" value={profile.firstName} readOnly className="bg-gray-100 text-gray-500" />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                    <Input type="text" value={profile.lastName} readOnly className="bg-gray-100 text-gray-500" />
                </div>
                <div>
                    <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">Username</label>
                    <Input type="text" id="username" name="username" value={profile.username} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-700">Age</label>
                    <Input type="number" id="age" name="age" value={profile.age} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
                    <Select id="gender" name="gender" value={profile.gender} onChange={handleInputChange}>
                        {genderOptions.map((option) => (<option key={option} value={option.toLowerCase().replace(/\s/g, '-')}>{option}</option>))}
                    </Select>
                </div>
                <div>
                    <label htmlFor="healthStatus" className="mb-2 block text-sm font-medium text-gray-700">Health Status</label>
                    <Select id="healthStatus" name="healthStatus" value={profile.healthStatus} onChange={handleInputChange}>
                        {healthStatusOptions.map((option) => (<option key={option} value={option.toLowerCase()}>{option}</option>))}
                    </Select>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="goals" className="mb-2 block text-sm font-medium text-gray-700">Fitness Goals</label>
                    <Select id="goals" name="goals" value={profile.goals} onChange={handleInputChange}>
                        {fitnessGoalsOptions.map((option) => (<option key={option} value={option.toLowerCase().replace(/\s/g, '-')}>{option}</option>))}
                    </Select>
                </div>
               
                <div className="sm:col-span-2">
                    <label htmlFor="biography" className="mb-2 block text-sm font-medium text-gray-700">Biography</label>
                    <Textarea
                        id="biography"
                        name="biography"
                        rows={4}
                        value={profile.biography || ''}
                        onChange={handleInputChange}
                        placeholder="Tell us a little about yourself and your fitness journey..."
                    />
                </div>
            </div>
            <div className="pt-6">
                <Button type="submit" variant="form" size="md" disabled={status === 'saving'}>
                    {status === 'saving' ? 'Saving...' : 'Save Changes'}
                </Button>
                {status === 'success' && <p className="text-center text-green-600 mt-2">Profile updated successfully!</p>}
                {status === 'error' && <p className="text-center text-red-600 mt-2">Failed to update profile.</p>}
            </div>
        </form>
    );
}