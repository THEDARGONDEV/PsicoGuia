import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { ValentinaAvatar, JorgeAvatar } from './Avatars';
import { TaskData } from '../data/tasks';
import OnboardingTutorial from './OnboardingTutorial';

interface Props {
  onSelectChild: (id: string) => void;
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

  const getProgress = (childId: string) => {
    const childTasks = tasks.filter(t => t.childId === childId);
    if (childTasks.length === 0) return 0;
    const completed = childTasks.filter(t => t.completed).length;
    return (completed / childTasks.length) * 100;
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
          onClick={() => onSelectChild('valentina')}
          className="w-full group flex flex-col items-center p-8 rounded-3xl border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 relative"
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
        </button>

        <button
          onClick={() => onSelectChild('jorge')}
          className="w-full group flex flex-col items-center p-8 rounded-3xl border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 relative"
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
        </button>
      </div>

      {showTutorial && (
        <OnboardingTutorial onComplete={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
