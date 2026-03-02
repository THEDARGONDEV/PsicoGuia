/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ProfileSelectionScreen from './components/ProfileSelectionScreen';
import DashboardScreen from './components/DashboardScreen';
import { INITIAL_TASKS, TaskData } from './data/tasks';

export default function App() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>(INITIAL_TASKS);

  const handleToggleTask = (taskId: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white min-h-[800px] h-[100dvh] sm:h-[800px] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative flex flex-col border-4 border-black">
        {!selectedChildId ? (
          <ProfileSelectionScreen onSelectChild={setSelectedChildId} tasks={tasks} />
        ) : (
          <DashboardScreen 
            childId={selectedChildId} 
            onBack={() => setSelectedChildId(null)} 
            tasks={tasks}
            onToggleTask={handleToggleTask}
          />
        )}
      </div>
    </div>
  );
}
