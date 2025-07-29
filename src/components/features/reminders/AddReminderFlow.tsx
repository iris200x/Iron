"use client";

import { useState } from 'react';
import { useGoals, type Goal } from '@/hooks/useGoals';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ViewState = 'options' | 'from_goal' | 'custom';

interface AddReminderFlowProps {
    onAddReminder: (text: string) => void;
    onCancel: () => void;
}

export function AddReminderFlow({ onAddReminder, onCancel }: AddReminderFlowProps) {
    const { goals } = useGoals();
    const [view, setView] = useState<ViewState>('options');
    const [customReminderText, setCustomReminderText] = useState('');

    const handleSubmitCustom = (e: React.FormEvent) => {
        e.preventDefault();
        onAddReminder(customReminderText);
    };

    const renderContent = () => {
        switch (view) {
            case 'from_goal':
                return (
                    <div>
                        <Button variant="ghost" onClick={() => setView('options')} icon="back" className="mb-6">Back</Button>
                        <h3 className="text-xl font-semibold text-center mb-4">Choose a goal to be reminded of:</h3>
                        <div className="space-y-3">
                            {goals.length > 0 ? goals.map((goal) => (
                                <Button key={goal.id} variant="outline" onClick={() => onAddReminder(goal.title)} className="w-full justify-start">
                                    {goal.title} ({goal.type})
                                </Button>
                            )) : <p className="text-center text-gray-500">You have no goals set.</p>}
                        </div>
                    </div>
                );
            case 'custom':
                return (
                    <div>
                        <Button variant="ghost" onClick={() => setView('options')} icon="back" className="mb-6">Back</Button>
                        <h3 className="text-xl font-semibold text-center mb-4">Add a custom reminder:</h3>
                        <form onSubmit={handleSubmitCustom} className="flex gap-4">
                            <Input value={customReminderText} onChange={(e) => setCustomReminderText(e.target.value)} placeholder="e.g., Drink a glass of water" required />
                            <Button type="submit">Add</Button>
                        </form>
                    </div>
                );
            case 'options':
            default:
                return (
                    <div>
                        <Button variant="ghost" onClick={onCancel} icon="back" className="mb-6">Back to List</Button>
                        <h3 className="text-xl font-semibold text-center mb-4">How do you want to add a reminder?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Button onClick={() => setView('from_goal')} className="p-8 text-2xl font-bold">From a Goal</Button>
                            <Button onClick={() => setView('custom')} className="p-8 text-2xl font-bold">Custom</Button>
                        </div>
                    </div>
                );
        }
    };

    return renderContent();
}