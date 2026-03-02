/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ProfileSelectionScreen from './components/ProfileSelectionScreen';
import DashboardScreen from './components/DashboardScreen';
import PsychoeducationScreen from './components/PsychoeducationScreen';
import ParentsDashboard from './components/ParentsDashboard';
import NotificationManager from './components/NotificationManager';
import { INITIAL_TASKS, TaskData } from './data/tasks';

export default function App() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'practical' | 'theoretical' | 'parents' | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>(INITIAL_TASKS);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const savedUser = localStorage.getItem('psicoguia_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setIsAuthenticated(true);
      setUsername(userData.username);
    }
  };

  const handleLogin = (newUsername: string, remember: boolean) => {
    setIsAuthenticated(true);
    setUsername(newUsername);
    if (remember) {
      localStorage.setItem('psicoguia_user', JSON.stringify({ username: newUsername }));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('psicoguia_user');
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleSelectChild = (childId: string, mode: 'practical' | 'theoretical' | 'parents') => {
    setSelectedChildId(childId);
    setSelectedMode(mode);
  };

  const handleBack = () => {
    setSelectedChildId(null);
    setSelectedMode(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-900">
      <NotificationManager />
      {/* Responsive Container */}
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl landscape:max-w-5xl landscape:md:max-w-5xl bg-white min-h-[100dvh] sm:min-h-[800px] sm:h-[800px] landscape:h-auto landscape:min-h-screen sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative flex flex-col border-0 sm:border-4 border-black transition-all duration-300">
        {!selectedChildId && !selectedMode ? (
          <ProfileSelectionScreen 
            onSelectChild={handleSelectChild} 
            tasks={tasks}
            isAuthenticated={isAuthenticated}
            username={username}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        ) : selectedMode === 'parents' ? (
          <ParentsDashboard onBack={handleBack} username={username} />
        ) : selectedMode === 'practical' && selectedChildId ? (
          <DashboardScreen 
            childId={selectedChildId} 
            onBack={handleBack} 
            tasks={tasks}
            onToggleTask={handleToggleTask}
          />
        ) : selectedMode === 'theoretical' && selectedChildId ? (
          <PsychoeducationScreen 
            childId={selectedChildId} 
            onBack={handleBack} 
          />
        ) : null}
      </div>
    </div>
  );
}
