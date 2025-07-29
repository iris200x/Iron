"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ClientProfile } from '@/hooks/useClients';
import { useGoals } from '@/hooks/useGoals';

type AssignmentType = 'reminder' | 'exercise';
type ReminderView = 'options' | 'custom' | 'from_goal';

interface AssignmentModalProps {
    client: ClientProfile | null;
    assignmentType: AssignmentType | null;
    onClose: () => void;
}

export function AssignmentModal({ client, assignmentType, onClose }: AssignmentModalProps) {
    const { currentUser, userProfile } = useAuth();

    const { goals: instructorGoals } = useGoals();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [view, setView] = useState<ReminderView>('options');
    const [assignmentText, setAssignmentText] = useState('');

    useEffect(() => {

        setView('options');
        setAssignmentText('');
    }, [client, assignmentType]);

    if (!client || !assignmentType) return null;

    const handleCreateAssignment = async (text: string) => {
        if (!currentUser || !userProfile || !text.trim()) return;

        setIsSubmitting(true);
        const assignmentsRef = collection(db, 'users', client.uid, 'pendingAssignments');

        try {
            await addDoc(assignmentsRef, {
                type: assignmentType,
                payload: { text },
                assignedBy: { uid: currentUser.uid, name: `${userProfile.firstName} ${userProfile.lastName}` },
                assignedAt: serverTimestamp(),
                status: 'pending'
            });
            onClose();
        } catch (error) {
            console.error("Error creating assignment: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'custom':
                return (
                    <>
                        <Button variant="ghost" onClick={() => setView('options')} icon="back" className="mb-4 -ml-4">Back to Options</Button>
                        <h3 className="text-xl font-semibold mb-4 text-center">Write a Custom Reminder</h3>
                        <Textarea
                            value={assignmentText}
                            onChange={(e) => setAssignmentText(e.target.value)}
                            placeholder="e.g., Don't forget your post-workout stretch!"
                            rows={4}
                        />
                        <Button onClick={() => handleCreateAssignment(assignmentText)} disabled={isSubmitting || !assignmentText.trim()} className="mt-4 w-full">
                            {isSubmitting ? 'Sending...' : 'Send for Approval'}
                        </Button>
                    </>
                );
            case 'from_goal':
                return (
                    <>
                        <Button variant="ghost" onClick={() => setView('options')} icon="back" className="mb-4 -ml-4">Back to Options</Button>
                        <h3 className="text-xl font-semibold mb-4 text-center">Select a Goal as a Reminder</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {instructorGoals.length > 0 ? instructorGoals.map((goal) => (
                                <Button key={goal.id} variant="default" onClick={() => handleCreateAssignment(goal.title)} className="w-full justify-start text-left">
                                    {goal.title}
                                </Button>
                            )) : <p className="text-center text-gray-500">You have no goals set to use as templates.</p>}
                        </div>
                    </>
                );
            case 'options':
            default:
                return (
                    <>
                        <h3 className="text-xl font-semibold mb-4 text-center">Set Reminder For {client.firstName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Button onClick={() => setView('custom')} className="p-8 text-2xl font-bold">Custom</Button>
                            <Button onClick={() => setView('from_goal')} className="p-8 text-2xl font-bold">From My Goals</Button>
                        </div>
                    </>
                );
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                {renderContent()}
                <Button onClick={onClose} variant="outline" className="mt-6 w-full">Cancel</Button>
            </div>
        </div>
    );
}