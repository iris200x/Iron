"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { SubTask } from '@/hooks/useGoals';
import { serverTimestamp } from 'firebase/firestore';

interface AddGoalFormProps {
    goalType: 'workout' | 'diet';
    onSave: (goalData: any) => void;
    onBack: () => void;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const workoutOptions = ['Push-ups', 'Planks', 'Squats', 'Bench Press', 'Rows', 'Dumbbell Curls', 'Lunges', 'Deadlifts', 'Overhead Press', 'Pull-ups', 'Crunches', 'Leg Press', 'Calf Raises'];
const dietOptions = ['Drink Water', 'Eat Fruits', 'Eat Vegetables', 'Avoid Sugar', 'High-Protein Meal', 'Low-Carb Meal'];
const unitOptions = {
    workout: ['reps', 'sets', 'seconds', 'minutes'],
    diet: ['servings', 'glasses', 'grams', 'calories']
};
const durationOptions = Array.from({ length: 12 }, (_, i) => `${i + 1} week${i > 0 ? 's' : ''}`);
const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

export function AddGoalForm({ goalType, onSave, onBack }: AddGoalFormProps) {
    const [newGoalName, setNewGoalName] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [duration, setDuration] = useState(4);
    const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
    const [notes, setNotes] = useState('');

    const [currentSubTasks, setCurrentSubTasks] = useState<SubTask[]>([]);
    const [subTaskName, setSubTaskName] = useState('');
    const [subTaskAmount, setSubTaskAmount] = useState(10);
    const [subTaskUnit, setSubTaskUnit] = useState(unitOptions[goalType][0]);
    const [subTaskRest, setSubTaskRest] = useState(60);

    const handleDayToggle = (day: string) => {
        setSelectedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleAddSubTaskToList = () => {
        if (subTaskName.trim() === '') return;
        const newSubTask: SubTask = {
            name: subTaskName,
            amount: subTaskAmount,
            unit: subTaskUnit,
            rest: goalType === 'workout' ? subTaskRest : undefined,
            completed: false
        };
        setCurrentSubTasks(prev => [...prev, newSubTask]);
        setSubTaskName('');
    };

    const handleRemoveSubTaskFromList = (indexToRemove: number) => {
        setCurrentSubTasks(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalName.trim() || selectedDays.length === 0 || currentSubTasks.length === 0) {
            alert("Please provide a goal name, select at least one day, and add at least one sub-task.");
            return;
        }
        onSave({
            title: newGoalName,
            type: goalType,
            days: selectedDays,
            duration: duration,
            difficulty,
            notes,
            subTasks: currentSubTasks,
            startDate: serverTimestamp(),
            weeklyProgress: {},
        });
    };

    const options = goalType === 'workout' ? workoutOptions : dietOptions;
    const units = unitOptions[goalType];

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <Button type="button" onClick={onBack} variant="ghost" icon="back">Back</Button>
            <h3 className="text-2xl font-bold text-center">Create Your Custom {goalType} Goal</h3>

            <fieldset className="space-y-4 rounded-lg border p-4">
                <legend className="px-1 text-sm font-medium text-gray-700">Goal Details</legend>
                <Input id="goalName" value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)} placeholder="e.g., Monday Chest Day" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                        {durationOptions.map((opt, i) => <option key={opt} value={i + 1}>{opt}</option>)}
                    </Select>
                    <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
                        {difficultyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </Select>
                </div>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add personal notes or tips for this goal... (optional)" rows={3} />
            </fieldset>

            <fieldset className="space-y-3 rounded-lg border p-4">
                <legend className="px-1 text-sm font-medium text-gray-700">Build Sub-Tasks</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={subTaskName} onChange={(e) => setSubTaskName(e.target.value)}>
                        <option value="">Select item...</option>
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </Select>
                    <div className="flex gap-2">
                        <Input type="number" value={subTaskAmount} onChange={(e) => setSubTaskAmount(Number(e.target.value))} min="1" className="w-1/2" />
                        <Select value={subTaskUnit} onChange={(e) => setSubTaskUnit(e.target.value)} className="w-1/2">
                            {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </Select>
                    </div>
                </div>
                {goalType === 'workout' && (
                  <Input type="number" value={subTaskRest} onChange={(e) => setSubTaskRest(Number(e.target.value))} min="0" step="15" placeholder="Rest (seconds)" />
                )}
                <Button type="button" onClick={handleAddSubTaskToList} variant="default" size="sm" className="w-full">Add Sub-Task</Button>
            </fieldset>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Sub-Tasks</label>
                <div className="space-y-2 p-3 border rounded-md min-h-[8rem] bg-gray-50">
                    {currentSubTasks.length > 0 ? currentSubTasks.map((task, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                            <p className="text-gray-700">
                                {task.name}: {task.amount} {task.unit}
                                {task.rest && <span className="text-xs text-gray-500 ml-2">({task.rest}s rest)</span>}
                            </p>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => handleRemoveSubTaskFromList(index)} className="text-red-400 hover:text-red-600 font-bold">&#x2715;</button>
                            </div>
                        </div>
                    )) : <p className="text-gray-400 text-center text-sm">No sub-tasks added yet.</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Days to Repeat</label>
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                    {daysOfWeek.map(day => (
                        <button type="button" key={day} onClick={() => handleDayToggle(day)}
                            className={`flex-1 rounded-full p-2 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 ${selectedDays.includes(day) ? 'bg-yellow-500 text-gray-800' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >{day}</button>
                    ))}
                </div>
            </div>

            <Button type="submit" variant="form" size="lg">Save Goal</Button>
        </form>
    );
}