"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ClientProfile } from '@/hooks/useClients';
import { useGoals } from '@/hooks/useGoals';
import { AddGoalForm } from '@/components/features/goals/AddGoalForm';
import type { Goal } from '@/hooks/useGoals';

type AssignmentType = 'reminder' | 'goal';
type ReminderView = 'options' | 'custom' | 'from_my_goals' | 'from_client_goals';

interface AssignmentModalProps {
    client: ClientProfile | null;
    assignmentType: AssignmentType | null;
    onClose: () => void;
}

export function AssignmentModal({ client, assignmentType, onClose }: AssignmentModalProps) {
    const { currentUser, userProfile } = useAuth();
    const { goals: instructorGoals, loading: instructorGoalsLoading } = useGoals();

    const { goals: clientGoals, loading: clientGoalsLoading } = useGoals(client?.uid);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reminderView, setReminderView] = useState<ReminderView>('options');
    const [reminderText, setReminderText] = useState('');

    const [goalView, setGoalView] = useState<'type_selection' | 'form'>('type_selection');
    const [selectedGoalType, setSelectedGoalType] = useState<'workout' | 'diet' | null>(null);

    useEffect(() => {
        setReminderView('options');
        setGoalView('type_selection');
        setSelectedGoalType(null);
        setReminderText('');
    }, [client, assignmentType]);

    if (!client || !assignmentType) return null;

    const handleCreateAssignment = async (payload: { text: string } | Goal) => {
        if (!currentUser || !userProfile) return;
        setIsSubmitting(true);
        const assignmentsRef = collection(db, 'users', client.uid, 'pendingAssignments');
        try {
            await addDoc(assignmentsRef, {
                type: assignmentType,
                payload,
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

    const renderReminderContent = () => {
        switch (reminderView) {
            case 'custom':
                return (
                    <>
                        <Button variant="ghost" onClick={() => setReminderView('options')} icon="back" className="mb-4 -ml-4">Back to Options</Button>
                        <h3 className="text-xl font-semibold mb-4 text-center">Write a Custom Reminder</h3>
                        <Textarea value={reminderText} onChange={(e) => setReminderText(e.target.value)} placeholder="e.g., Don't forget your post-workout stretch!" rows={4} />
                        <Button onClick={() => handleCreateAssignment({ text: reminderText })} disabled={isSubmitting || !reminderText.trim()} className="mt-4 w-full">Send Reminder</Button>
                    </>
                );
            case 'from_my_goals':
                return (
                    <>
                        <Button variant="ghost" onClick={() => setReminderView('options')} icon="back" className="mb-4 -ml-4">Back to Options</Button>
                        <h3 className="text-xl font-semibold mb-4 text-center">Select Your Goal as a Reminder Template</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {instructorGoalsLoading && <p className="text-center text-gray-500">Loading your goals...</p>}
                            {!instructorGoalsLoading && instructorGoals.length > 0 ? instructorGoals.map((goal) => (
                                <Button key={goal.id} variant="secondary" onClick={() => handleCreateAssignment({ text: `Remember your goal: "${goal.title}"` })} className="w-full justify-start text-left">{goal.title}</Button>
                            )) : !instructorGoalsLoading && <p className="text-center text-gray-500">You have no goals to use as templates.</p>}
                        </div>
                    </>
                );
            case 'from_client_goals':
                return (
                    <>
                        <Button variant="ghost" onClick={() => setReminderView('options')} icon="back" className="mb-4 -ml-4">Back to Options</Button>
                        <h3 className="text-xl font-semibold mb-4 text-center">Select a Client Goal to Remind Them Of</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {clientGoalsLoading && <p className="text-center text-gray-500">Loading client's goals...</p>}
                            {!clientGoalsLoading && clientGoals.length > 0 ? clientGoals.map((goal) => (
                                <Button key={goal.id} variant="secondary" onClick={() => handleCreateAssignment({ text: `Remember your goal: "${goal.title}"` })} className="w-full justify-start text-left">{goal.title}</Button>
                            )) : !clientGoalsLoading && <p className="text-center text-gray-500">This client has no goals set.</p>}
                        </div>
                    </>
                );
            case 'options':
            default:
                return (
                    <>
                        <h3 className="text-xl font-semibold mb-4 text-center">Set Reminder For {client.firstName}</h3>
                        <div className="flex flex-col gap-4">
                            <Button onClick={() => setReminderView('custom')} size="lg" className="w-full">Custom Reminder</Button>
                            <Button onClick={() => setReminderView('from_my_goals')} variant="outline" size="lg" className="w-full">From My Goal Templates</Button>
                            <Button onClick={() => setReminderView('from_client_goals')} variant="outline" size="lg" className="w-full">From Client's Assigned Goals</Button>
                        </div>
                    </>
                );
        }
    }

    const renderSetGoalContent = () => {
        if (goalView === 'type_selection') {
            return (
                <>
                    <h3 className="text-xl font-semibold mb-4 text-center">Set Goal For {client.firstName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Button onClick={() => { setSelectedGoalType('workout'); setGoalView('form'); }}  className="p-8 text-2xl font-bold">Workout</Button>
                        <Button onClick={() => { setSelectedGoalType('diet'); setGoalView('form'); }}  className="p-8 text-2xl font-bold">Diet</Button>
                    </div>
                </>
            );
        }
        if (goalView === 'form' && selectedGoalType) {
            return (
                <AddGoalForm
                    goalType={selectedGoalType}
                    onSave={(goalData) => handleCreateAssignment(goalData)}
                    onBack={() => setGoalView('type_selection')}
                />
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                {assignmentType === 'reminder' ? renderReminderContent() : renderSetGoalContent()}
                <Button onClick={onClose} variant="outline" className="mt-6 w-full">Cancel</Button>
            </div>
        </div>
    );
}