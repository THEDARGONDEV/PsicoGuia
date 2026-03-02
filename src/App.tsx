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
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'practical' | 'theoretical' | 'parents' | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>(INITIAL_TASKS);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUsername(user.displayName || user.email?.split('@')[0] || 'Usuario');
        setUserId(user.uid);
        
        // Load user data from Firestore using onSnapshot for real-time and offline support
        setIsLoadingData(true);
        const userDocRef = doc(db, 'users', user.uid);
        
        const unsubscribeSnapshot = onSnapshot(userDocRef, {
          next: async (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.data();
              if (userData.tasks) {
                setTasks(userData.tasks);
              } else {
                // Migration: User exists but no tasks
                await setDoc(userDocRef, { tasks: INITIAL_TASKS }, { merge: true });
              }
            } else {
              // New user
              await setDoc(userDocRef, { 
                email: user.email,
                displayName: user.displayName,
                tasks: INITIAL_TASKS,
                createdAt: new Date().toISOString()
              });
            }
            setIsLoadingData(false);
          },
          error: (error) => {
            console.error("Error loading user data:", error);
            // If offline, we might get an error or just cached data. 
            // If it's a permission error or similar, stop loading.
            setIsLoadingData(false);
          }
        });

        return () => unsubscribeSnapshot();

      } else {
        setIsAuthenticated(false);
        setUsername(null);
        setUserId(null);
        setTasks(INITIAL_TASKS); // Reset to default for guest/logout
        setIsLoadingData(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogin = (newUsername: string, remember: boolean) => {
    // Managed by Firebase listener
  };

  const handleLogout = () => {
    // Managed by Firebase listener
  };

  const handleToggleTask = async (taskId: number) => {
    // Prevent toggling if data is still loading to avoid overwrites
    if (isLoadingData) return;

    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(newTasks);

    // Sync with Firestore if logged in
    if (userId) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { tasks: newTasks }, { merge: true });
      } catch (error) {
        console.error("Error syncing task:", error);
      }
    }
  };

  const handleSelectChild = (childId: string, mode: 'practical' | 'theoretical' | 'parents') => {
    setSelectedChildId(childId);
    setSelectedMode(mode);
  };

  const handleBack = () => {
    setSelectedChildId(null);
    setSelectedMode(null);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-900">
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Sincronizando tu progreso...</p>
        </div>
      </div>
    );
  }

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
            userId={userId}
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
