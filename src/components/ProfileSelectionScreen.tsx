import React, { useState, useEffect } from 'react';
import { HelpCircle, Activity, BookOpen, X } from 'lucide-react';
import { ValentinaAvatar, JorgeAvatar, ParentsAvatar } from './Avatars';
import { TaskData } from '../data/tasks';
import OnboardingTutorial from './OnboardingTutorial';
import MinimalAuth from './MinimalAuth';

interface Props {
  onSelectChild: (id: string, mode: 'practical' | 'theoretical' | 'parents') => void;
  tasks: TaskData[];
  isAuthenticated: boolean;
  username: string | null;
  onLogin: (username: string, remember: boolean) => void;
  onLogout: () => void;
}

const ProgressCircle = ({ progress }: { progress: number }) => {
  const radius = 64; // w-32 is 128px, so r=64
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 140 140">
      {/* Background circle */}
      <circle
        cx="70"
        cy="70"
        r={radius}
        className="stroke-gray-200 group-hover:stroke-gray-700 transition-colors duration-300"
        strokeWidth="4"
        fill="transparent"
      />
      {/* Progress circle */}
      <circle
        cx="70"
        cy="70"
        r={radius}
        className="stroke-green-500 transition-all duration-1000 ease-out"
        strokeWidth="6"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function ProfileSelectionScreen({ onSelectChild, tasks, isAuthenticated, username, onLogin, onLogout }: Props) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('psicoguia_tutorial_seen_v2');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
    setIsInitialized(true);
  }, []);

  const handleCloseTutorial = () => {
    localStorage.setItem('psicoguia_tutorial_seen_v2', 'true');
    setShowTutorial(false);
  };

  const getProgress = (childId: string) => {
    // Only show progress if authenticated
    if (!isAuthenticated) return 0;
    
    const childTasks = tasks.filter(t => t.childId === childId);
    if (childTasks.length === 0) return 0;
    const completed = childTasks.filter(t => t.completed).length;
    return (completed / childTasks.length) * 100;
  };

  // Prevent flashing the UI before checking localStorage
  if (!isInitialized) return null;

  const renderChildOptions = (childId: string) => {
    if (expandedChild !== childId) return null;
    return (
      <div className="absolute inset-0 bg-black/90 rounded-3xl flex flex-col items-center justify-center p-6 z-20 animate-fade-in">
        <button 
          onClick={(e) => { e.stopPropagation(); setExpandedChild(null); }}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X size={24} />
        </button>
        <h3 className="text-white text-xl font-bold mb-6">Selecciona un Módulo</h3>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onSelectChild(childId, 'practical'); }}
          className="w-full bg-white text-black p-4 rounded-2xl mb-4 font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
        >
          <Activity size={24} />
          Actividades Prácticas
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onSelectChild(childId, 'theoretical'); }}
          className="w-full bg-gray-800 text-white border-2 border-gray-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors"
        >
          <BookOpen size={24} />
          Módulo Teórico
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full relative overflow-y-auto">
      {/* Minimalist Tutorial Button */}
      <button 
        onClick={() => setShowTutorial(true)}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors duration-300 flex items-center gap-2"
        aria-label="Ver tutorial"
      >
        <HelpCircle size={24} />
      </button>

      <h1 className="text-6xl font-handwriting font-bold mb-2 text-center tracking-tight text-gray-800 drop-shadow-sm">PsicoGuía</h1>
      <p className="text-gray-500 mb-12 text-center text-lg">Programa de Intervención</p>

      <div className="w-full flex flex-col md:flex-row landscape:flex-row gap-8 md:gap-12 mt-8 pb-24 justify-center items-center">
        {/* Valentina */}
        <div
          onClick={() => setExpandedChild(expandedChild === 'valentina' ? null : 'valentina')}
          className="w-full group flex flex-col items-center cursor-pointer relative"
        >
          <div className="relative w-40 h-40 mb-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <ProgressCircle progress={getProgress('valentina')} />
            <div className="w-32 h-32 text-gray-900 transition-colors z-10">
              <ValentinaAvatar />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-black transition-colors">Valentina</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Parálisis Cerebral (PCI)</p>
          
          {getProgress('valentina') === 100 && (
            <span className="absolute top-0 right-10 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full animate-fade-in">
              Completo
            </span>
          )}
          
          {renderChildOptions('valentina')}
        </div>

        {/* Jorge */}
        <div
          onClick={() => setExpandedChild(expandedChild === 'jorge' ? null : 'jorge')}
          className="w-full group flex flex-col items-center cursor-pointer relative"
        >
          <div className="relative w-40 h-40 mb-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <ProgressCircle progress={getProgress('jorge')} />
            <div className="w-32 h-32 text-gray-900 transition-colors z-10">
              <JorgeAvatar />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-black transition-colors">Jorge</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">TDAH</p>
          
          {getProgress('jorge') === 100 && (
            <span className="absolute top-0 right-10 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full animate-fade-in">
              Completo
            </span>
          )}
          
          {renderChildOptions('jorge')}
        </div>

        {/* Parents */}
        <div
          onClick={() => onSelectChild('parents', 'parents')}
          className="w-full group flex flex-col items-center cursor-pointer relative"
        >
          <div className="relative w-40 h-40 mb-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <div className="w-32 h-32 text-gray-900 transition-colors z-10">
              <ParentsAvatar />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-black transition-colors">Padres</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Espacio de Orientación</p>
        </div>
      </div>

      {showTutorial && (
        <OnboardingTutorial onComplete={handleCloseTutorial} />
      )}

      <MinimalAuth 
        isAuthenticated={isAuthenticated}
        username={username}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </div>
  );
}
