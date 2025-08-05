"use client";

import { Button } from '@/components/ui/Button';
import type { Goal } from '@/hooks/useGoals';
import { GoalCard } from './GoalCard';

interface GoalListProps {
    goals: Goal[];
    onDeleteGoal: (goalId: string) => void;
    onAddNewGoal: () => void;
}

export function GoalList({ goals, onDeleteGoal, onAddNewGoal }: GoalListProps) {
    if (goals.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-lg text-gray-600 mb-4">You haven't set any goals yet.</p>
                <Button onClick={onAddNewGoal}>Add Your First Goal</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDeleteGoal={onDeleteGoal} />
            ))}
            <div className="mt-8 pt-6 border-t-2 border-yellow-200 text-center">
                <Button onClick={onAddNewGoal}>Add New Goal</Button>
            </div>
        </div>
    );
}