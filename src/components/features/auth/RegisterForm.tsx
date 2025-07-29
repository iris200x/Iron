"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '@/lib/firebase';

import { RegisterStepOne } from './RegisterStepOne';
import { RegisterStepTwo } from './RegisterStepTwo';

export function RegisterForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: '',
        firstName: '', lastName: '', age: '', gender: '',
        healthStatus: '', goals: '', role: 'user',
    });

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
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            const { password, confirmPassword, ...profileData } = formData;
            await setDoc(doc(db, "users", user.uid), { ...profileData });
            router.push('/home');
        } catch (err: any) {
            setError("Failed to create account. The email might already be in use.");
            console.error(err);
        }
    };

    return (
        <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">Sign Up</h1>
            <div className="mb-6 flex w-full justify-center space-x-4">
                <span className={`text-md font-medium ${currentStep === 1 ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500'}`}>1. Account Info</span>
                <span className={`text-md font-medium ${currentStep === 2 ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500'}`}>2. Profile Details</span>
            </div>

            <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmitForm} className="w-full space-y-6">
                {currentStep === 1 && (
                    <RegisterStepOne formData={formData} handleInputChange={handleInputChange} />
                )}
                {currentStep === 2 && (
                    <RegisterStepTwo formData={formData} handleInputChange={handleInputChange} handlePreviousStep={handlePreviousStep} />
                )}
                {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
            </form>

            {currentStep === 1 && (
                <div className="mt-6 text-sm text-center">
                    <Link href="/auth/login" className="font-medium text-yellow-600 hover:text-yellow-500 hover:underline">Already have an account? Log In</Link>
                </div>
            )}
        </div>
    );
}