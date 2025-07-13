"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '@/../lib/firebase';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    healthStatus: '',
    goals: '',
  });

  const healthStatusOptions = ['Excellent', 'Good', 'Fair', 'Poor', 'Prefer not to say'];
  const fitnessGoalsOptions = ['Build Muscle', 'Lose Weight', 'Improve Endurance', 'Increase Flexibility', 'General Fitness', 'Stress Relief', 'Sports Specific Training', 'Rehabilitation', 'Other'];
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handlePreviousStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(1);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const { password, confirmPassword, ...profileData } = formData;
      await setDoc(doc(db, "users", user.uid), {
        ...profileData
      });

      router.push('/home');
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-white to-white p-8">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <button className="flex items-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </Link>
      </div>

      <div className="flex w-full max-w-lg flex-col items-center rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">Sign Up</h1>

        <div className="mb-6 flex w-full justify-center space-x-4">
          <span className={`text-md font-medium ${currentStep === 1 ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500'}`}>1. Account Info</span>
          <span className={`text-md font-medium ${currentStep === 2 ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500'}`}>2. Profile Details</span>
        </div>

        <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmitForm} className="w-full space-y-6">
          {currentStep === 1 && (
            <>
              {/* Account Info Fields */}
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">Username</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" placeholder="e.g., IronMan24" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" placeholder="••••••••" />
              </div>
              <div className="pt-6">
                <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">Next: Profile Details</button>
              </div>
              <div className="mt-6 text-sm text-center">
                <Link href="/auth/login" className="font-medium text-yellow-600 hover:text-yellow-500 hover:underline">Already have an account? Log In</Link>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Profile Details Fields */}
              <h2 className="mb-4 text-2xl font-bold text-gray-800">Tell us about yourself!</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" placeholder="John" />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" placeholder="Doe" />
                </div>
                <div>
                  <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-700">Age</label>
                  <input type="number" id="age" name="age" min="1" max="120" value={formData.age} onChange={handleInputChange} required className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" placeholder="e.g., 30" />
                </div>
                <div>
                  <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm">
                    <option value="">Select your gender</option>
                    {genderOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="healthStatus" className="mb-2 block text-sm font-medium text-gray-700">Health Status</label>
                  <select id="healthStatus" name="healthStatus" value={formData.healthStatus} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm">
                    <option value="">Select your health status</option>
                    {healthStatusOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="goals" className="mb-2 block text-sm font-medium text-gray-700">Fitness Goals</label>
                  <select id="goals" name="goals" value={formData.goals} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm">
                    <option value="">Select your primary goal</option>
                    {fitnessGoalsOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button type="button" onClick={handlePreviousStep} className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Previous
                </button>
                <button type="submit" className="flex justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">Create Account</button>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}