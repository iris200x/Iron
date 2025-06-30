// src/app/(dashboard)/learning/page.tsx
// This page will inherit the DashboardLayout from its parent (dashboard) route group
"use client"; // Using useState for interactivity

import { useState } from 'react';

export default function LearningPage() {
  // Placeholder data for learning resources
  const [learningResources, setLearningResources] = useState([
    {
      id: 'lr1',
      title: 'Strength Training Basics',
      description: 'Understand the fundamentals of building muscle and strength.',
      imageUrl: 'https://placehold.co/300x200/FCD34D/333?text=Strength+Basics',
      fullContent: 'Detailed guide on compound lifts, progressive overload, and recovery.',
    },
    {
      id: 'lr2',
      title: 'Healthy Nutrition Guide',
      description: 'Learn about balanced diets, macros, and healthy eating habits.',
      imageUrl: 'https://placehold.co/300x200/FBBF24/333?text=Nutrition+Guide',
      fullContent: 'Comprehensive information on meal planning, portion control, and nutrient timing.',
    },
    {
      id: 'lr3',
      title: 'Cardio Endurance Workouts',
      description: 'Improve your stamina with effective cardiovascular exercises.',
      imageUrl: 'https://placehold.co/300x200/FDE047/333?text=Cardio+Workouts',
      fullContent: 'Techniques for running, cycling, swimming, and high-intensity interval training.',
    },
    {
      id: 'lr4',
      title: 'Flexibility & Stretching',
      description: 'Enhance your range of motion and prevent injuries with stretching.',
      imageUrl: 'https://placehold.co/300x200/FCD34D/333?text=Flexibility',
      fullContent: 'Static vs. dynamic stretching, foam rolling, and yoga poses for flexibility.',
    },
    {
      id: 'lr5',
      title: 'Mind-Body Connection',
      description: 'Explore the importance of mental well-being in your fitness journey.',
      imageUrl: 'https://placehold.co/300x200/FBBF24/333?text=Mindfulness',
      fullContent: 'Meditation, stress management, and visualization for peak performance.',
    },
    {
      id: 'lr6',
      title: 'Recovery Techniques',
      description: 'Discover methods for faster muscle recovery and reduced soreness.',
      imageUrl: 'https://placehold.co/300x200/FDE047/333?text=Recovery',
      fullContent: 'Sleep optimization, active recovery, cold therapy, and massage techniques.',
    },
  ]);

  const handleResourceClick = (resource: typeof learningResources[0]) => {
    alert(`You clicked on "${resource.title}". \n\nDescription: ${resource.description}\n\nFull Content (simulated): ${resource.fullContent}`);
    // In a real application, this would navigate to a detailed resource page or open a modal
  };

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <h1 className="mb-8 text-5xl font-bold text-gray-800">Learning</h1>

      {/* Learning Resources Gallery */}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Explore Our Resources</h2>
        <p className="mb-6 text-gray-600">
          Click on any topic below to learn more and expand your fitness knowledge.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {learningResources.map((resource) => (
            <button
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="group flex flex-col items-center overflow-hidden rounded-lg bg-yellow-50 p-4 text-left shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
            >
              <div className="mb-4 h-40 w-full overflow-hidden rounded-md">
                <img
                  src={resource.imageUrl}
                  alt={resource.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to a plain placeholder if image fails to load
                    (e.target as HTMLImageElement).src = `https://placehold.co/300x200/ccc/666?text=Image+Error`;
                  }}
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800 group-hover:text-yellow-700">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-600">
                {resource.description}
              </p>
            </button>
          ))}
        </div>

        {/* Optional: Add more resources button if desired */}
        {/*
        <div className="mt-8 text-center">
          <button
            onClick={() => alert('Load more learning resources!')}
            className="rounded-md border border-transparent bg-yellow-500 px-6 py-3 text-base font-medium text-gray-800 shadow-sm transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Load More Resources
          </button>
        </div>
        */}
      </div>
    </div>
  );
}
