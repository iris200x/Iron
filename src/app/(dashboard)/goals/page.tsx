"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals, type Goal } from '@/hooks/useGoals';
import { addDoc, collection, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { GoalList } from '@/components/features/goals/GoalList';
import { AddGoalForm } from '@/components/features/goals/AddGoalForm';
import { Button } from '@/components/ui/Button';

type ViewState = 'list' | 'add_options' | 'add_form';

export default function GoalsPage() {
    const { currentUser } = useAuth();
    const { goals, loading } = useGoals();
    const [view, setView] = useState<ViewState>('list');
    const [goalType, setGoalType] = useState<'workout' | 'diet'>('workout');

    const handleSaveGoal = async (goalData: Omit<Goal, 'id'>) => {
        if (!currentUser) return;
        await addDoc(collection(db, 'users', currentUser.uid, 'goals'), {
            ...goalData,
        });
        setView('list');
};

    const handleDeleteGoal = async (goalId: string) => {
        if (!currentUser) return;
        const goalDocRef = doc(db, 'users', currentUser.uid, 'goals', goalId);
        try {
            await deleteDoc(goalDocRef);
        } catch (error) {
            console.error("Error deleting goal: ", error);
        }
    };


    const handleSelectGoalType = (type: 'workout' | 'diet') => {
        setGoalType(type);
        setView('add_form');
    };

    const renderContent = () => {
        switch (view) {
            case 'add_options':
                return (
                    <div>
                        <Button type="button" onClick={() => setView('list')} variant="ghost" icon="back" className="mb-6">Back</Button>
                        <h3 className="text-xl font-semibold text-center mb-4">What type of goal do you want to add?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Button onClick={() => handleSelectGoalType('workout')} size="lg" className="p-8 text-2xl font-bold">Workout</Button>
                            <Button onClick={() => handleSelectGoalType('diet')} size="lg" className="p-8 text-2xl font-bold">Diet</Button>
                        </div>
                    </div>
                );
            case 'add_form':
                return <AddGoalForm goalType={goalType} onSave={handleSaveGoal} onBack={() => setView('add_options')} />;
            case 'list':
            default:
                return <GoalList goals={goals} onDeleteGoal={handleDeleteGoal} onAddNewGoal={() => setView('add_options')} />;
        }
    };

    if (loading) return <div className="p-10 text-center">Loading goals...</div>;

    return (
        <div className="flex flex-col">
            <h1 className="mb-8 text-5xl font-bold text-gray-800">Goals</h1>
            <div className="rounded-lg bg-white p-8 shadow-lg">
                {renderContent()}
            </div>
        </div>
    );
}