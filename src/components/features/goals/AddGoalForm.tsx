"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { SubTask } from '@/hooks/useGoals';

interface AddGoalFormProps {
    goalType: 'workout' | 'diet';
    onSave: (goalData: any) => void;
    onBack: () => void;
}

const workoutOptions = [
    'Push-ups', 'Planks', 'Squats', 'Bench Press', 'Rows', 'Dumbbell Curls', 'Lunges', 'Deadlifts', 'Overhead Press', 'Pull-ups', 'Crunches', 'Leg Press', 'Calf Raises'
];
const dietOptions = ['Drink Water', 'Eat Fruits', 'Eat Vegetables', 'Avoid Sugar', 'High-Protein Meal', 'Low-Carb Meal'];
const unitOptions = {
    workout: ['reps', 'sets', 'seconds', 'minutes'],
    diet: ['servings', 'glasses', 'grams', 'calories']
};

export function AddGoalForm({ goalType, onSave, onBack }: AddGoalFormProps) {
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalRepetitions, setNewGoalRepetitions] = useState('');
    const [currentSubTasks, setCurrentSubTasks] = useState<SubTask[]>([]);


    const [subTaskName, setSubTaskName] = useState('');
    const [subTaskAmount, setSubTaskAmount] = useState(10);
    const [subTaskUnit, setSubTaskUnit] = useState(unitOptions[goalType][0]);

    const handleAddSubTaskToList = () => {
        if (subTaskName.trim() !== '' && subTaskUnit.trim() !== '') {
            const fullText = `${subTaskName}: ${subTaskAmount} ${subTaskUnit}`;
            setCurrentSubTasks(prev => [...prev, { text: fullText, completed: false }]);
       
            setSubTaskName('');
            setSubTaskAmount(10);
        }
    };

    const handleRemoveSubTaskFromList = (indexToRemove: number) => {
        setCurrentSubTasks(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleMoveSubTask = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === currentSubTasks.length - 1)) {
            return;
        }
        const newTasks = [...currentSubTasks];
        const taskToMove = newTasks[index];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        newTasks[index] = newTasks[swapIndex];
        newTasks[swapIndex] = taskToMove;
        setCurrentSubTasks(newTasks);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalName.trim() === '' || currentSubTasks.length === 0 || newGoalRepetitions.trim() === '') {
            alert("Please fill out all fields and add at least one sub-task.");
            return;
        }
 
        onSave({
            title: newGoalName,
            type: goalType,
            repetitions: newGoalRepetitions,
            subTasks: currentSubTasks,
        });
    };

    const options = goalType === 'workout' ? workoutOptions : dietOptions;
    const units = unitOptions[goalType];

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <Button type="button" onClick={onBack} variant="ghost" icon="back">
                Back
            </Button>
            <h3 className="text-xl font-semibold text-center">Create Your Custom {goalType} Goal</h3>

            <div>
                <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <Input
                    id="goalName"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    placeholder={`e.g., Monday ${goalType === 'workout' ? 'Chest Day' : 'Hydration'}`}
                    required
                />
            </div>

            <div className="p-4 border rounded-md bg-gray-50 space-y-3">
                <label className="block text-sm font-medium text-gray-700">Build Your Sub-Task</label>
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
                <Button type="button" onClick={handleAddSubTaskToList} variant="default" size="sm" className="w-full">
                    Add to Goal
                </Button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Sub-Tasks</label>
                <div className="space-y-2 p-3 border rounded-md min-h-[8rem] bg-gray-50">
                    {currentSubTasks.length > 0 ? currentSubTasks.map((task, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                            <p className="text-gray-700">{task.text}</p>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => handleMoveSubTask(index, 'up')} disabled={index === 0} className="disabled:opacity-50 text-gray-500 hover:text-black">&#x25B2;</button>
                                <button type="button" onClick={() => handleMoveSubTask(index, 'down')} disabled={index === currentSubTasks.length - 1} className="disabled:opacity-50 text-gray-500 hover:text-black">&#x25BC;</button>
                                <button type="button" onClick={() => handleRemoveSubTaskFromList(index)} className="text-red-400 hover:text-red-600 font-bold">&#x2715;</button>
                            </div>
                        </div>
                    )) : <p className="text-gray-400 text-center text-sm">No sub-tasks added yet.</p>}
                </div>
            </div>

            <div>
                <label htmlFor="goalRepetitions" className="block text-sm font-medium text-gray-700 mb-1">How often should this goal repeat per week?</label>
                <Select id="goalRepetitions" value={newGoalRepetitions} onChange={(e) => setNewGoalRepetitions(e.target.value)} required>
                    <option value="" disabled>Select frequency...</option>
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <option key={num} value={`${num} time${num > 1 ? 's' : ''} a week`}>
                            {`${num} time${num > 1 ? 's' : ''} a week`}
                        </option>
                    ))}
                </Select>
            </div>

            <Button type="submit" variant="form" size="md">
                Save Goal
            </Button>
        </form>
    );
}