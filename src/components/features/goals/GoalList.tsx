"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Goal } from '@/hooks/useGoals';

interface GoalListProps {
    goals: Goal[];
    onDeleteGoal: (goalId: string) => void;
    onToggleSubTask: (goalId: string, subTaskIndex: number) => void;
    onAddNewGoal: () => void;
}

export function GoalList({ goals, onDeleteGoal, onToggleSubTask, onAddNewGoal }: GoalListProps) {
    const [expandedGoals, setExpandedGoals] = useState<string[]>([]);

    const toggleGoalExpansion = (goalId: string) => {
        setExpandedGoals(prev => prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]);
    };

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
                <div key={goal.id} className="rounded-lg bg-yellow-100 p-6 shadow-md">
                    <div className="flex items-start justify-between">
                        <button onClick={() => toggleGoalExpansion(goal.id)} className="text-left flex-grow">
                            <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                            <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
                                <div className="h-2.5 rounded-full bg-yellow-500" style={{ width: `${goal.progress || 0}%` }}></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-600">{goal.progress || 0}% Complete</p>
                        </button>
                        <button onClick={() => onDeleteGoal(goal.id)} className="ml-4 text-gray-400 hover:text-red-500 flex-shrink-0" title="Delete Goal">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    {expandedGoals.includes(goal.id) && (
                        <div className="mt-4 space-y-2 border-t border-yellow-200 pt-4">
                            {(goal.subTasks || []).map((task, index) => (
                                <div key={index} className="flex items-center">
                                    <input type="checkbox" checked={task.completed} onChange={() => onToggleSubTask(goal.id, index)} className="h-5 w-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                                    <label className={`ml-3 text-gray-700 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                        {task.text}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <div className="mt-8 pt-6 border-t-2 border-yellow-200 text-center">
                <Button onClick={onAddNewGoal}>Add New Goal</Button>
            </div>
        </div>
    );
}