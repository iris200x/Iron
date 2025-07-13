// app/(dashboard)/goals/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/../lib/firebase';

// --- Data Structures ---
interface SubTask {
  text: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  type: 'workout' | 'diet';
  repetitions: string; // e.g., "3 times a week"
  subTasks: SubTask[];
  progress: number;
}

type ViewState = 'list' | 'add_options' | 'add_custom_goal';

// --- Predefined Sub-Task Options ---
const workoutOptions = ['Push-ups', 'Planks', 'Squats', 'Bench Press', 'Rows', 'Dumbbell Curls', 'Lunges', 'Deadlifts'];
const dietOptions = ['Drink Water', 'Eat Fruits', 'Eat Vegetables', 'Avoid Sugar', 'High-Protein Meal', 'Low-Carb Meal'];
const unitOptions = {
    workout: ['reps', 'sets', 'seconds', 'minutes'],
    diet: ['servings', 'glasses', 'grams', 'calories']
};

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('list');
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  
  // --- State for the new custom goal form ---
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalType, setNewGoalType] = useState<'workout' | 'diet' | null>(null);
  const [newGoalRepetitions, setNewGoalRepetitions] = useState('');
  const [currentSubTasks, setCurrentSubTasks] = useState<SubTask[]>([]);
  
  // State for building a single sub-task
  const [subTaskName, setSubTaskName] = useState('');
  const [subTaskAmount, setSubTaskAmount] = useState(10);
  const [subTaskUnit, setSubTaskUnit] = useState('');

  // --- Firebase User and Data Fetching ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;

    const goalsCollectionRef = collection(db, 'users', currentUser.uid, 'goals');
    const q = query(goalsCollectionRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const goalsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Goal[];
      setGoals(goalsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // --- Goal Management Functions ---
  const handleAddCustomGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newGoalType || newGoalName.trim() === '' || currentSubTasks.length === 0) {
      alert("Please provide a goal name and add at least one sub-task.");
      return;
    }
    
    await addDoc(collection(db, 'users', currentUser.uid, 'goals'), {
      title: newGoalName,
      type: newGoalType,
      repetitions: newGoalRepetitions,
      subTasks: currentSubTasks,
      progress: 0,
      createdAt: serverTimestamp(),
    });
    
    // Reset form and view
    setView('list');
    setNewGoalName('');
    setNewGoalRepetitions('');
    setCurrentSubTasks([]);
    setNewGoalType(null);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!currentUser) return;
    const goalDocRef = doc(db, 'users', currentUser.uid, 'goals', goalId);
    await deleteDoc(goalDocRef);
  };

  const handleToggleSubTask = async (goalId: string, subTaskIndex: number) => {
    if (!currentUser) return;

    const goalToUpdate = goals.find(g => g.id === goalId);
    if (!goalToUpdate) return;

    const currentSubTasks = goalToUpdate.subTasks || [];
    const newSubTasks = currentSubTasks.map((task, index) => 
      index === subTaskIndex ? { ...task, completed: !task.completed } : task
    );

    const completedCount = newSubTasks.filter(task => task.completed).length;
    const newProgress = newSubTasks.length > 0 ? Math.round((completedCount / newSubTasks.length) * 100) : 0;

    const goalDocRef = doc(db, 'users', currentUser.uid, 'goals', goalId);
    await updateDoc(goalDocRef, { 
      subTasks: newSubTasks,
      progress: newProgress 
    });
  };

  const handleAddSubTaskToList = () => {
    if (subTaskName.trim() !== '' && subTaskUnit.trim() !== '') {
        const fullText = `${subTaskName}: ${subTaskAmount} ${subTaskUnit}`;
        setCurrentSubTasks(prev => [...prev, { text: fullText, completed: false }]);
        // Reset sub-task form for the next entry
        setSubTaskName('');
        setSubTaskAmount(10);
        if(newGoalType) setSubTaskUnit(unitOptions[newGoalType][0]);
    }
  };
  
  const handleSelectGoalType = (type: 'workout' | 'diet') => {
    setNewGoalType(type);
    setSubTaskUnit(unitOptions[type][0]); // Set default unit
    setView('add_custom_goal');
  }

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
  };
  
  // --- UI Rendering ---
  const renderBackButton = (targetView: ViewState) => (
    <button type="button" onClick={() => setView(targetView)} className="mb-6 text-yellow-600 hover:text-yellow-800 font-semibold">
      &larr; Back
    </button>
  );

  const renderGoalsList = () => (
    <div className="space-y-6">
      {goals.map((goal) => (
        <div key={goal.id} className="rounded-lg bg-yellow-100 p-6 shadow-md">
          <div className="flex items-start justify-between">
            <button onClick={() => toggleGoalExpansion(goal.id)} className="text-left flex-grow">
                <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{goal.repetitions}</p>
                <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
                    <div className="h-2.5 rounded-full bg-yellow-500" style={{ width: `${goal.progress || 0}%` }}></div>
                </div>
                <p className="mt-1 text-xs text-gray-600">{goal.progress || 0}% Complete</p>
            </button>
            <button
              onClick={() => handleDeleteGoal(goal.id)}
              className="ml-4 text-gray-400 hover:text-red-500 flex-shrink-0"
              title="Delete Goal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {expandedGoals.includes(goal.id) && (
            <div className="mt-4 space-y-2 border-t border-yellow-200 pt-4">
              {(goal.subTasks || []).map((task, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleSubTask(goal.id, index)}
                    className="h-5 w-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
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
        <button onClick={() => setView('add_options')} className="rounded-md bg-yellow-500 px-6 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-yellow-600">
          Add New Goal
        </button>
      </div>
    </div>
  );
  
  const renderAddOptions = () => (
    <div>
      {renderBackButton('list')}
      <h3 className="text-xl font-semibold text-center mb-4">What type of goal do you want to add?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => handleSelectGoalType('workout')} className="p-8 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-2xl font-bold text-gray-800 shadow-md">Workout</button>
        <button onClick={() => handleSelectGoalType('diet')} className="p-8 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-2xl font-bold text-gray-800 shadow-md">Diet</button>
      </div>
    </div>
  );

  const renderAddCustomGoalForm = () => {
    const options = newGoalType === 'workout' ? workoutOptions : dietOptions;
    const units = newGoalType ? unitOptions[newGoalType] : [];
    return (
      <form onSubmit={handleAddCustomGoal}>
        {renderBackButton('add_options')}
        <h3 className="text-xl font-semibold text-center mb-4">Create Your Custom {newGoalType} Goal</h3>
        
        <div className="mb-4">
            <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
            <input
                type="text"
                id="goalName"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                placeholder="e.g., Monday Chest Day"
                className="w-full p-2 border rounded-md"
                required
            />
        </div>

        <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">Build Your Sub-Task</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={subTaskName} onChange={(e) => setSubTaskName(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="">Select {newGoalType} item...</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="flex gap-2">
                    <input type="number" value={subTaskAmount} onChange={(e) => setSubTaskAmount(Number(e.target.value))} min="1" className="w-1/2 p-2 border rounded-md" />
                    <select value={subTaskUnit} onChange={(e) => setSubTaskUnit(e.target.value)} className="w-1/2 p-2 border rounded-md">
                        {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
            </div>
            <button type="button" onClick={handleAddSubTaskToList} className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-md">Add to Goal</button>
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Sub-Tasks</label>
            <div className="space-y-2 p-3 border rounded-md min-h-[8rem] bg-gray-50">
                {currentSubTasks.length > 0 ? currentSubTasks.map((task, index) => (
                    <p key={index} className="text-gray-700">{task.text}</p>
                )) : <p className="text-gray-400">No sub-tasks added yet.</p>}
            </div>
        </div>

        <div className="mb-6">
            <label htmlFor="goalRepetitions" className="block text-sm font-medium text-gray-700 mb-1">How often should this goal repeat?</label>
            <input
                type="text"
                id="goalRepetitions"
                value={newGoalRepetitions}
                onChange={(e) => setNewGoalRepetitions(e.target.value)}
                placeholder="e.g., 3 times a week"
                className="w-full p-2 border rounded-md"
            />
        </div>
        
        <button type="submit" className="w-full rounded-md bg-yellow-500 px-6 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-yellow-600">
            Save Goal
        </button>
      </form>
    );
  };

  if (loading) {
    return <div className="p-10 text-center">Loading goals...</div>
  }

  return (
    <div className="flex flex-col">
      <h1 className="mb-8 text-5xl font-bold text-gray-800">Goals</h1>
      <div className="rounded-lg bg-white p-8 shadow-lg">
        {view === 'list' && (goals.length > 0 ? renderGoalsList() : 
            <div className="text-center py-8">
                <p className="text-lg text-gray-600 mb-4">You haven't set any goals yet.</p>
                <button onClick={() => setView('add_options')} className="rounded-md bg-yellow-500 px-6 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-yellow-600">
                    Add Your First Goal
                </button>
            </div>
        )}
        {view === 'add_options' && renderAddOptions()}
        {view === 'add_custom_goal' && renderAddCustomGoalForm()}
      </div>
    </div>
  );
}
