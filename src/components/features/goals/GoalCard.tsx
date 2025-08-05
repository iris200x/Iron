"use client";
import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Goal } from '@/hooks/useGoals';
import { Button } from '@/components/ui/Button';

const getWeekNumber = (startDate: Date) => {
    const now = new Date();
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface GoalCardProps {
    goal: Goal;
    onDeleteGoal: (goalId: string) => void;
}

export function GoalCard({ goal, onDeleteGoal }: GoalCardProps) {
    const { currentUser } = useAuth();
    const [subTaskStatus, setSubTaskStatus] = useState<boolean[]>(Array(goal.subTasks.length).fill(false));
    // --- NEW: State to manage expand/collapse ---
    const [isExpanded, setIsExpanded] = useState(false);

    const startDate = goal.startDate?.toDate();
    const currentWeek = startDate ? getWeekNumber(startDate) : 1;
    const totalWorkoutDays = goal.days.length * goal.duration;
    const completedDaysCount = Object.keys(goal.weeklyProgress || {}).length;
    const progressPercentage = totalWorkoutDays > 0 ? Math.round((completedDaysCount / totalWorkoutDays) * 100) : 0;
    
    const todayStr = daysOfWeek[new Date().getDay()];
    const isScheduledToday = goal.days.includes(todayStr);
    const isCompletedForToday = goal.weeklyProgress?.[`week${currentWeek}-${todayStr}`] === true;

    const handleToggleSubTask = (index: number) => {
        const newStatus = [...subTaskStatus];
        newStatus[index] = !newStatus[index];
        setSubTaskStatus(newStatus);
    };

    useEffect(() => {
        if (!currentUser || !isScheduledToday || isCompletedForToday || subTaskStatus.length === 0) return;
        
        const allTasksCompleted = subTaskStatus.every(status => status === true);
        if (allTasksCompleted) {
            const goalRef = doc(db, 'users', currentUser.uid, 'goals', goal.id);
            updateDoc(goalRef, {
                [`weeklyProgress.week${currentWeek}-${todayStr}`]: true
            });
        }
    }, [subTaskStatus, currentUser, goal, currentWeek, todayStr, isScheduledToday, isCompletedForToday]);

    return (
        <div className="rounded-lg bg-yellow-100 p-6 shadow-md">
            <div className="flex items-start justify-between">
                <div onClick={() => setIsExpanded(!isExpanded)} className="text-left flex-grow cursor-pointer">
                    <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                    <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
                        <div className="h-2.5 rounded-full bg-yellow-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{progressPercentage}% Complete ({completedDaysCount} of {totalWorkoutDays} days)</p>
                </div>
                <Button variant="ghost" onClick={() => onDeleteGoal(goal.id)} title="Delete Goal">
                  🗑️
                </Button>
            </div>

            <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700">Week {currentWeek} Progress:</p>
                <div className="flex items-center gap-2 mt-2">
                    {goal.days.map(day => {
                        const isCompleted = goal.weeklyProgress?.[`week${currentWeek}-${day}`] === true;
                        return (
                            <span key={day} title={day} className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold ${
                                isCompleted ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-800'
                            }`}>
                                {isCompleted ? '✓' : day.charAt(0)}
                            </span>
                        );
                    })}
                </div>
            </div>

            {isExpanded && (
                 <div className="mt-4 space-y-2 border-t border-yellow-200 pt-4">
                    <h4 className="font-semibold text-gray-800">Checklist:</h4>
                    {goal.subTasks.map((task, index) => (
                        <div key={index} className="flex items-center">
                            <input 
                                type="checkbox"
                                checked={isCompletedForToday || subTaskStatus[index]}
                                onChange={() => handleToggleSubTask(index)}
                                
                                disabled={!isScheduledToday || isCompletedForToday}
                                className="h-5 w-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <label className={`ml-3 text-gray-700 ${isCompletedForToday ? 'line-through text-gray-500' : ''}`}>
                                {task.name}: {task.amount} {task.unit}
                            </label>
                        </div>
                    ))}
                 </div>
            )}
        </div>
    );
}