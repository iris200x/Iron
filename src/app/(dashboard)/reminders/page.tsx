
"use client"; 

import { useState } from 'react';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([
    { id: 'r1', text: 'Morning Workout (30 min)', completed: false },
    { id: 'r2', text: 'Drink 2 liters of water', completed: false },
    { id: 'r3', text: 'Meal Prep for tomorrow', completed: true },
    { id: 'r4', text: 'Evening Stretch Session', completed: false },
  ]);

  const handleCompleteReminder = (id: string) => {
    setReminders(prevReminders =>
      prevReminders.map(reminder =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    );
  };

  const handleAddNewReminder = () => {
    alert('Add new reminder functionality goes here!');
  };

  return (
    <div className="flex flex-col">
      <h1 className="mb-8 text-5xl font-bold text-gray-800">Reminders</h1>


      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Your Daily Reminders</h2>

        <div className="space-y-4">
          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`flex items-center justify-between rounded-lg p-4 shadow-sm transition-all duration-300 ${
                  reminder.completed ? 'bg-gray-100 opacity-70' : 'bg-yellow-100 hover:shadow-md'
                }`}
              >
                <p className={`text-lg font-medium ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                  {reminder.text}
                </p>
                <button
                  onClick={() => handleCompleteReminder(reminder.id)}
                  className={`rounded-full px-6 py-2 text-sm font-semibold shadow-md transition-colors ${
                    reminder.completed
                      ? 'bg-gray-400 text-white hover:bg-gray-500'
                      : 'bg-yellow-500 text-gray-800 hover:bg-yellow-600'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75`}
                >
                  {reminder.completed ? 'Completed' : 'Complete'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-600">No reminders set. Time to add some!</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleAddNewReminder}
            className="rounded-md border border-transparent bg-yellow-500 px-6 py-3 text-base font-medium text-gray-800 shadow-sm transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Add New Reminder
          </button>
        </div>
      </div>
    </div>
  );
}
