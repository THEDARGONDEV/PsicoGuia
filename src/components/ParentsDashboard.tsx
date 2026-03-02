import React, { useState } from 'react';
import { ArrowLeft, BookOpen, MessageCircle } from 'lucide-react';
import ImprovementLog from './ImprovementLog';
import PsychologicalAIChat from './PsychologicalAIChat';

export default function ParentsDashboard({ onBack, username }: { onBack: () => void, username: string | null }) {
  const [activeSection, setActiveSection] = useState<'log' | 'chat' | null>(null);

  if (activeSection === 'log') {
    return <ImprovementLog onBack={() => setActiveSection(null)} username={username} />;
  }

  if (activeSection === 'chat') {
    return <PsychologicalAIChat onBack={() => setActiveSection(null)} username={username} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative font-sans animate-in fade-in zoom-in duration-300">
      <header className="flex items-center p-6 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="ml-4 text-xl font-bold tracking-tight text-gray-900">Espacio para Padres</h1>
      </header>

      <div className="flex-1 p-6 flex flex-col md:flex-row landscape:flex-row justify-center items-center gap-8 w-full max-w-4xl mx-auto">
        <button 
          onClick={() => setActiveSection('log')}
          className="w-full md:w-1/2 max-w-md bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:scale-[1.02] active:scale-[0.98] group h-full"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100 group-hover:border-black transition-colors">
            <BookOpen size={32} className="text-gray-700 group-hover:text-black transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Registro de Mejoras</h2>
          <p className="text-sm text-gray-500">
            Anota observaciones y áreas de oportunidad para el bienestar de tus hijos.
          </p>
        </button>

        <button 
          onClick={() => setActiveSection('chat')}
          className="w-full md:w-1/2 max-w-md bg-black hover:bg-gray-900 text-white rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg h-full"
        >
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">IA Psicológica</h2>
          <p className="text-sm text-gray-400">
            Consulta a nuestro asistente virtual especializado en orientación familiar.
          </p>
        </button>
      </div>
    </div>
  );
}
