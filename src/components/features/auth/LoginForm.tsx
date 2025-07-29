"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordResetModal } from './PasswordResetModal';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const [showResetModal, setShowResetModal] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/home');
        } catch (err: any) {
            setError("Invalid email or password. Please try again.");
            console.error(err);
        }
    };

    return (
        <>
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="mb-6 text-4xl font-bold text-gray-800">Sign In</h1>
                </div>

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                        <Input
                            type="email"
                            id="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                        <Input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => setShowResetModal(true)}
                                className="font-medium text-yellow-600 hover:text-yellow-500 hover:underline"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                    <div className="pt-6">
                        <Button type="submit" variant="form" size="md">
                            Sign In
                        </Button>
                    </div>

                    <div className="mt-6 text-sm text-center">
                        <Link href="/auth/register" className="font-medium text-yellow-600 hover:text-yellow-500 hover:underline">
                            Don't have an account? Sign Up
                        </Link>
                    </div>
                </form>
            </div>

            {showResetModal && (
                <PasswordResetModal
                    initialEmail={email}
                    onClose={() => setShowResetModal(false)}
                />
            )}
        </>
    );
}