
"use client"; 

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    profileIcon: '/images/default-profile.png', 
    firstName: 'Iris', 
    lastName: 'Watson',
    username: 'Iris_Fit', 
    age: 28,
    gender: 'female',
    healthStatus: 'good',
    goals: 'lose-weight',
  });

  const genderOptions = [
    'Male',
    'Female',
    'Non-binary',
    'Prefer not to say',
  ];

  const healthStatusOptions = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'Prefer not to say',
  ];

  const fitnessGoalsOptions = [
    'Build Muscle',
    'Lose Weight',
    'Improve Endurance',
    'Increase Flexibility',
    'General Fitness',
    'Stress Relief',
    'Sports Specific Training',
    'Rehabilitation',
    'Other',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleProfileIconClick = () => {
    alert('Profile icon upload functionality goes here!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile Updated:', profile);
    alert('Profile updated successfully!');
  };

  return (
    <div className="flex flex-col">
     
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-800">Edit Profile</h1>

        <Link href="/home">
          <button className="flex items-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
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
            Back to Home
          </button>
        </Link>
      </div>


      <div className="rounded-lg bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <button
              type="button" 
              onClick={handleProfileIconClick}
              className="group relative h-32 w-32 cursor-pointer rounded-full bg-gray-300 ring-4 ring-yellow-500 transition-transform hover:scale-105 focus:outline-none focus:ring-offset-2"
            >
              <Image
                src={profile.profileIcon}
                alt="Profile Icon"
                width={128}
                height={128}
                className="rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/128x128/ccc/666?text=Profile'; 
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-white text-sm font-semibold">Change Photo</span>
              </div>
            </button>
            <p className="text-sm text-gray-500">Click to change profile picture</p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* First Name (Locked) */}
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                readOnly // Make it locked
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 shadow-sm sm:text-sm"
              />
            </div>

            {/* Last Name (Locked) */}
            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profile.lastName}
                readOnly // Make it locked
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 shadow-sm sm:text-sm"
              />
            </div>

            {/* Username (Editable) */}
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
              />
            </div>

            {/* Age (Editable) */}
            <div>
              <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={profile.age}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
              />
            </div>

            {/* Gender (Editable) */}
            <div>
              <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
              >
                {genderOptions.map((option) => (
                  <option key={option} value={option.toLowerCase().replace(/\s/g, '-')}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Health Status (Editable) */}
            <div>
              <label htmlFor="healthStatus" className="mb-2 block text-sm font-medium text-gray-700">
                Health Status
              </label>
              <select
                id="healthStatus"
                name="healthStatus"
                value={profile.healthStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
              >
                {healthStatusOptions.map((option) => (
                  <option key={option} value={option.toLowerCase().replace(/\s/g, '-')}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Fitness Goals (Editable) */}
            <div>
              <label htmlFor="goals" className="mb-2 block text-sm font-medium text-gray-700">
                Fitness Goals
              </label>
              <select
                id="goals"
                name="goals"
                value={profile.goals}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
              >
                {fitnessGoalsOptions.map((option) => (
                  <option key={option} value={option.toLowerCase().replace(/\s/g, '-')}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
