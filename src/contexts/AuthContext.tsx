"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface UserProfile {
    role: string;
    firstName: string;
    lastName: string;
    username: string;
    age: number;
    gender: string;
    healthStatus: string;
    goals: string;
    profileIcon?: string;
    biography?: string; 
    
}


interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                setCurrentUser(user);

                setUserProfile(userDoc.exists() ? (userDoc.data() as UserProfile) : null);
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                router.push('/auth/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const logout = async () => {
        await signOut(auth);
        router.push('/');
    };

    const value = { currentUser, userProfile, loading, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};