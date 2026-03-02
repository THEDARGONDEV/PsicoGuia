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
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
    if (!auth) {
      // Fallback to local storage if Firebase is not configured
      const savedUser = localStorage.getItem('psicoguia_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setIsAuthenticated(true);
          setUsername(userData.username);
        } catch (e) {
          console.error("Error parsing local user data", e);
        }
      }
      
      // Load tasks from local storage
      const savedTasks = localStorage.getItem('psicoguia_tasks');
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
        } catch (e) {
          console.error("Error parsing local tasks", e);
        }
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUsername(user.displayName || user.email?.split('@')[0] || 'Usuario');
        setUserId(user.uid);
        
        // Load user data from Firestore
        setIsLoadingData(true);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.tasks) {
              setTasks(userData.tasks);
            } else {
              // If user exists but no tasks (migration?), save initial
              await setDoc(userDocRef, { tasks: INITIAL_TASKS }, { merge: true });
            }
          } else {
            // New user, create document with initial tasks
            await setDoc(userDocRef, { 
              email: user.email,
              displayName: user.displayName,
              tasks: INITIAL_TASKS,
              createdAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        } finally {
          setIsLoadingData(false);
        }
      } else {
        setIsAuthenticated(false);
        setUsername(null);
        setUserId(null);
        setTasks(INITIAL_TASKS); // Reset to default for guest/logout
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (newUsername: string, remember: boolean) => {
    // Managed by Firebase listener if auth exists
    if (!auth) {
      setIsAuthenticated(true);
      setUsername(newUsername);
      if (remember) {
        localStorage.setItem('psicoguia_user', JSON.stringify({ username: newUsername }));
      }
    }
  };

  const handleLogout = () => {
    // Managed by Firebase listener if auth exists
    if (!auth) {
      setIsAuthenticated(false);
      setUsername(null);
      localStorage.removeItem('psicoguia_user');
    }
  };

  const handleToggleTask = async (taskId: number) => {
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(newTasks);

    // Sync with Firestore if logged in
    if (userId && auth) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { tasks: newTasks }, { merge: true });
      } catch (error) {
        console.error("Error syncing task:", error);
      }
    } else if (!auth) {
      // Sync with local storage if Firebase is not configured
      localStorage.setItem('psicoguia_tasks', JSON.stringify(newTasks));
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
