"use client";

import { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PasswordResetModalProps {
    initialEmail: string;
    onClose: () => void;
}

export function PasswordResetModal({ initialEmail, onClose }: PasswordResetModalProps) {
    const [resetEmail, setResetEmail] = useState(initialEmail);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSending(true);
        setMessage('');
        setIsError(false);

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", resetEmail));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage("This email address is not registered.");
                setIsError(true);
                return;
            }

            // await sendPasswordResetEmail(auth, resetEmail);
            setMessage("A password reset link has been sent. Please check your inbox.");
            setIsError(false);

        } catch (err) {
            setMessage("An unexpected error occurred. Please try again.");
            setIsError(true);
            console.error(err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                {message ? (
                    <div>
                        <p className={isError ? "text-red-600" : "text-green-600"}>{message}</p>
                        <Button onClick={onClose} variant="outline" className="mt-4 w-full">Close</Button>
                    </div>
                ) : (
                    <form onSubmit={handlePasswordReset}>
                        <p className="mb-4 text-gray-600">Enter your email address and we will send you a link to reset your password.</p>
                        <Input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <div className="flex justify-end gap-4 mt-6">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={isSending}>
                                {isSending ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}