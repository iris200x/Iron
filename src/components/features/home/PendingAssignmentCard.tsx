"use client";
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { doc, deleteDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { PendingAssignment } from '@/hooks/usePendingAssignments';

export function PendingAssignmentCard({ assignment }: { assignment: PendingAssignment }) {
    const { currentUser } = useAuth();
    const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleResponse = async (accepted: boolean) => {
        if (!currentUser) return;
        setIsProcessing(true);

        const assignmentRef = doc(db, 'users', currentUser.uid, 'pendingAssignments', assignment.id);

        if (accepted) {
            if (assignment.type === 'client-offer') {
                const instructorClientRef = doc(db, 'users', assignment.assignedBy.uid, 'clients', currentUser.uid);
                await updateDoc(instructorClientRef, { status: 'accepted' });
            } else if ((assignment.type === 'reminder' || assignment.type === 'goal') && assignment.payload) {
                const destinationCollection = assignment.type === 'reminder' ? 'reminders' : 'goals';
                const newDocRef = collection(db, 'users', currentUser.uid, destinationCollection);

                const docData = 'title' in assignment.payload
                    ? { ...assignment.payload, progress: 0 }
                    : { text: assignment.payload.text, completed: false };

                await addDoc(newDocRef, {
                    ...docData,
                    createdBy: assignment.assignedBy,
                    createdAt: serverTimestamp()
                });
            }
            setStatus('accepted');
        } else {
            if (assignment.type === 'client-offer') {
                const instructorClientRef = doc(db, 'users', assignment.assignedBy.uid, 'clients', currentUser.uid);
                await deleteDoc(instructorClientRef);
            }
            setStatus('declined');
        }

        setTimeout(async () => {
            await deleteDoc(assignmentRef);
        }, 2000);
    };

    const offerContent = {
        title: `${assignment.assignedBy.name}`,
        description: assignment.type === 'client-offer'
            ? "has offered to be your instructor."
            : `sent you a new ${assignment.type}:`,
        payloadText: assignment.payload ? ('title' in assignment.payload ? assignment.payload.title : assignment.payload.text) : null
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-opacity duration-500">
            <div className="flex items-center gap-4">
                <Image src={assignment.assignedBy.profileIcon || '/images/no_image.png'} alt="Instructor" width={40} height={40} className="rounded-full flex-shrink-0" />

                <div className="flex-grow">
                    <p className="text-sm text-gray-800">
                        <span className="font-semibold">{offerContent.title}</span> {offerContent.description}
                    </p>
                    {offerContent.payloadText && (
                        <p className="text-md font-medium text-yellow-700 mt-1 italic">"{offerContent.payloadText}"</p>
                    )}
                </div>

                {status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                        <Button onClick={() => handleResponse(true)} size="sm" disabled={isProcessing}>Accept</Button>
                        <Button onClick={() => handleResponse(false)} variant="destructive" size="sm" disabled={isProcessing}>Decline</Button>
                    </div>
                )}
            </div>
            {status === 'accepted' && <p className="mt-2 text-center font-bold text-green-600">Accepted!</p>}
            {status === 'declined' && <p className="mt-2 text-center font-bold text-red-600">Declined.</p>}
        </div>
    );
}