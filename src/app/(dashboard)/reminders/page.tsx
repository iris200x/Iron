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
  serverTimestamp,
  orderBy
} from 'firebase/firestore';

import { auth, db } from '@/../lib/firebase';

interface Reminder {
  id: string;
  text: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  type: 'workout' | 'diet';
}

type ViewState = 'list' | 'add_options' | 'add_from_goal' | 'add_custom';

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('list');
  const [customReminderText, setCustomReminderText] = useState('');

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

    const remindersRef = collection(db, 'users', currentUser.uid, 'reminders');
    const remindersQuery = query(remindersRef, orderBy('createdAt', 'desc'));
    const unsubscribeReminders = onSnapshot(remindersQuery, (snapshot) => {
      const remindersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reminder));
      setReminders(remindersList);
      setLoading(false);
    });

    const goalsRef = collection(db, 'users', currentUser.uid, 'goals');
    const unsubscribeGoals = onSnapshot(goalsRef, (snapshot) => {
      const goalsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      setGoals(goalsList);
    });

    return () => {
      unsubscribeReminders();
      unsubscribeGoals();
    };
  }, [currentUser]);

  const handleAddReminder = async (text: string) => {
    if (text.trim() === '' || !currentUser) return;
    const remindersCollectionRef = collection(db, 'users', currentUser.uid, 'reminders');
    await addDoc(remindersCollectionRef, {
      text,
      completed: false,
      createdAt: serverTimestamp(),
    });
    setView('list');
    setCustomReminderText('');
  };

  const handleToggleComplete = async (reminder: Reminder) => {
    if (!currentUser) return;
    const reminderDocRef = doc(db, 'users', currentUser.uid, 'reminders', reminder.id);
    await updateDoc(reminderDocRef, { completed: !reminder.completed });
  };
  
  const handleDeleteReminder = async (id: string) => {
    if (!currentUser) return;
    const reminderDocRef = doc(db, 'users', currentUser.uid, 'reminders', id);
    await deleteDoc(reminderDocRef);
  };

  const renderBackButton = (targetView: ViewState) => (
    <button onClick={() => setView(targetView)} className="mb-6 text-yellow-600 hover:text-yellow-800 font-semibold">
      &larr; Back
    </button>
  );

  const renderRemindersList = () => (
    <>
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className={`flex items-center justify-between rounded-lg p-4 shadow-sm transition-all duration-300 ${reminder.completed ? 'bg-gray-100 opacity-70' : 'bg-yellow-100 hover:shadow-md'}`}>
            <p className={`flex-grow text-lg font-medium ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{reminder.text}</p>
            <div className="flex items-center gap-4 pl-4">
              <button onClick={() => handleToggleComplete(reminder)} className={`w-28 rounded-full px-4 py-2 text-sm font-semibold shadow-md transition-colors ${reminder.completed ? 'bg-gray-400 text-white hover:bg-gray-500' : 'bg-yellow-500 text-gray-800 hover:bg-yellow-600'}`}>{reminder.completed ? 'Completed' : 'Complete'}</button>
              <button onClick={() => handleDeleteReminder(reminder.id)} className="text-gray-400 hover:text-red-500" title="Delete Reminder"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t-2 border-yellow-200 text-center">
        <button onClick={() => setView('add_options')} className="rounded-md bg-yellow-500 px-6 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-yellow-600">Add Reminder</button>
      </div>
    </>
  );

  const renderAddOptions = () => (
    <div>
      {renderBackButton('list')}
      <h3 className="text-xl font-semibold text-center mb-4">How do you want to add a reminder?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => setView('add_from_goal')} className="p-8 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-2xl font-bold text-gray-800 shadow-md">From a Goal</button>
        <button onClick={() => setView('add_custom')} className="p-8 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-2xl font-bold text-gray-800 shadow-md">Custom</button>
      </div>
    </div>
  );

  const renderAddFromGoal = () => (
    <div>
      {renderBackButton('add_options')}
      <h3 className="text-xl font-semibold text-center mb-4">Choose a goal to be reminded of:</h3>
      <div className="space-y-3">
        {goals.length > 0 ? goals.map((goal) => (
          <button key={goal.id} onClick={() => handleAddReminder(goal.title)} className="w-full text-left p-4 rounded-lg bg-yellow-100 hover:bg-yellow-200 font-medium text-gray-800 shadow-sm">
            {goal.title} ({goal.type})
          </button>
        )) : <p className="text-center text-gray-500">You have no goals set to create reminders from.</p>}
      </div>
    </div>
  );

  const renderAddCustom = () => (
    <div>
      {renderBackButton('add_options')}
      <h3 className="text-xl font-semibold text-center mb-4">Add a custom reminder:</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleAddReminder(customReminderText); }} className="flex gap-4">
        <input type="text" value={customReminderText} onChange={(e) => setCustomReminderText(e.target.value)} placeholder="e.g., Drink a glass of water" className="flex-grow p-3 border rounded-md" />
        <button type="submit" className="bg-yellow-500 text-gray-800 font-semibold px-6 py-3 rounded-md hover:bg-yellow-600">Add</button>
      </form>
    </div>
  );

  if (loading) {
    return <div className="p-10 text-center">Loading reminders...</div>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="mb-8 text-5xl font-bold text-gray-800">Reminders</h1>
      <div className="rounded-lg bg-white p-8 shadow-lg">
        {view === 'list' && (reminders.length > 0 ? renderRemindersList() : 
            <div className="text-center py-8">
                <p className="text-lg text-gray-600 mb-4">You have no reminders set.</p>
                <button onClick={() => setView('add_options')} className="rounded-md bg-yellow-500 px-6 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-yellow-600">Add Your First Reminder</button>
            </div>
        )}
        {view === 'add_options' && renderAddOptions()}
        {view === 'add_from_goal' && renderAddFromGoal()}
        {view === 'add_custom' && renderAddCustom()}
      </div>
    </div>
  );
}
