import React, { useState, useEffect } from 'react';
import { HelpCircle, Activity, BookOpen, X } from 'lucide-react';
import { ValentinaAvatar, JorgeAvatar } from './Avatars';
import { TaskData } from '../data/tasks';
import OnboardingTutorial from './OnboardingTutorial';

interface Props {
  onSelectChild: (id: string, mode: 'practical' | 'theoretical') => void;
  tasks: TaskData[];
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

export default function ProfileSelectionScreen({ onSelectChild, tasks }: Props) {
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full relative">
      {/* Minimalist Tutorial Button */}
      <button 
        onClick={() => setShowTutorial(true)}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors duration-300 flex items-center gap-2"
        aria-label="Ver tutorial"
      >
        <HelpCircle size={24} />
      </button>

      <h1 className="text-4xl font-bold mb-2 text-center tracking-tight">PsicoGuía</h1>
      <p className="text-gray-500 mb-12 text-center text-lg">Programa de Intervención</p>

      <div className="w-full space-y-6">
        <button
          onClick={() => setExpandedChild(expandedChild === 'valentina' ? null : 'valentina')}
          className="w-full group flex flex-col items-center p-8 rounded-3xl border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 relative overflow-hidden"
        >
          <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
            <ProgressCircle progress={getProgress('valentina')} />
            <div className="w-28 h-28 text-black group-hover:text-white transition-colors z-10">
              <ValentinaAvatar />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Valentina</h2>
          <p className="text-sm opacity-70 mt-1">Parálisis Cerebral (PCI)</p>
          {getProgress('valentina') === 100 && (
            <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
              ¡Semana Completa!
            </span>
          )}
          {renderChildOptions('valentina')}
        </button>

        <button
          onClick={() => setExpandedChild(expandedChild === 'jorge' ? null : 'jorge')}
          className="w-full group flex flex-col items-center p-8 rounded-3xl border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 relative overflow-hidden"
        >
          <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
            <ProgressCircle progress={getProgress('jorge')} />
            <div className="w-28 h-28 text-black group-hover:text-white transition-colors z-10">
              <JorgeAvatar />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Jorge</h2>
          <p className="text-sm opacity-70 mt-1">TDAH</p>
          {getProgress('jorge') === 100 && (
            <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
              ¡Semana Completa!
            </span>
          )}
          {renderChildOptions('jorge')}
        </button>
      </div>

      {showTutorial && (
        <OnboardingTutorial onComplete={handleCloseTutorial} />
      )}
    </div>
  );
}
