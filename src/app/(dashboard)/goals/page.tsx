"use client"; 

import { useState } from 'react';

export default function GoalsPage() {

  const [goals, setGoals] = useState([
    {
      id: 'g1',
      title: 'Workout Uno',
      assignee: 'Juan Dela Cruz',
      progress: 70,
      description: 'Complete 3 strength training sessions per week.',
    },
    {
      id: 'g2',
      title: 'Meal Plan',
      assignee: 'Tu Dela Cruz',
      progress: 30, 
      description: 'Follow personalized meal plan for 4 weeks.',
    },
 
  ]);

  const handleMoreClick = (goalId: string) => {
    alert(`Showing more details for Goal ID: ${goalId}`);
  };

  return (
    <div className="flex flex-col">

      <h1 className="mb-8 text-5xl font-bold text-gray-800">Goals</h1>

      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Your Current Goals</h2>

        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="rounded-lg bg-yellow-100 p-6 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.assignee}</p>
                </div>
                <button
                  onClick={() => handleMoreClick(goal.id)}
                  className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
                >
                  more
                </button>
              </div>


              <div className="h-4 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-500 transition-all duration-500 ease-out"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-700 text-right">{goal.progress}% Complete</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="rounded-md border border-transparent bg-yellow-500 px-6 py-3 text-base font-medium text-gray-800 shadow-sm transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
            Add New Goal
          </button>
        </div>
      </div>
    </div>
  );
}
