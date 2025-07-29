"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ProfileForm } from '@/components/features/profile/ProfileForm';

export default function ProfilePage() {
	const { userProfile, loading } = useAuth();

	if (loading) {
		return <div className="text-center p-10">Loading Profile...</div>;
	}

	if (!userProfile) {
		return <div className="text-center p-10">Could not find user profile.</div>;
	}

	return (
		<div className="flex flex-col">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-5xl font-bold text-gray-800">Edit Profile</h1>
				<Button variant="outline" size="sm" icon="back">
		  <Link href="/home">Back to Home</Link>
		</Button>
			</div>

			<div className="rounded-lg bg-white p-8 shadow-lg">
				<ProfileForm initialProfile={{ ...userProfile, profileIcon: userProfile.profileIcon ?? "" }} />
			</div>
		</div>
	);
}