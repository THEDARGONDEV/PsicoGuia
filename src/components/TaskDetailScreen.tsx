import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Activity, Eye, Clock, Hand, Smile, Shield, Bell, Settings, Save, Info, Lightbulb, AlertTriangle, ListChecks, Brain } from 'lucide-react';
import { TaskData } from '../data/tasks';

interface Props {
  task: TaskData;
  onBack: () => void;
  onComplete: () => void;
}

export default function TaskDetailScreen({ task, onBack, onComplete }: Props) {
  const [alarmTime, setAlarmTime] = useState<string>('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [setupData, setSetupData] = useState<string>('');
  const [isSetupSaved, setIsSetupSaved] = useState(false);

  // Load saved alarm/setup data from localStorage
  useEffect(() => {
    const savedAlarm = localStorage.getItem(`alarm_${task.id}`);
    if (savedAlarm) {
      setAlarmTime(savedAlarm);
      setIsAlarmSet(true);
    }

    const savedSetup = localStorage.getItem(`setup_${task.id}`);
    if (savedSetup) {
      setSetupData(savedSetup);
      setIsSetupSaved(true);
    }
  }, [task.id]);

  const handleSetAlarm = () => {
    if (alarmTime) {
      // Request notification permissions if not granted
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      localStorage.setItem(`alarm_${task.id}`, alarmTime);
      setIsAlarmSet(true);
      alert(`Alarma programada para las ${alarmTime}`);
    }
  };

  const handleClearAlarm = () => {
    localStorage.removeItem(`alarm_${task.id}`);
    setAlarmTime('');
    setIsAlarmSet(false);
  };

  const handleSaveSetup = () => {
    if (setupData.trim()) {
      localStorage.setItem(`setup_${task.id}`, setupData);
      setIsSetupSaved(true);
      alert('Configuración guardada correctamente');
    }
  };

  const needsSetup = task.childId === 'jorge' && 
    (task.title.toLowerCase().includes('norma') || 
     task.title.toLowerCase().includes('terapia') || 
     task.title.toLowerCase().includes('regla') ||
     task.title.toLowerCase().includes('comportamiento'));

  const renderAnimation = () => {
    switch (task.animationType) {
      case 'stretching':
        return (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-3xl mb-6 border-2 border-black overflow-hidden">
            <Activity size={64} className="text-black animate-pulse" />
          </div>
        );
      case 'sensory':
        return (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-3xl mb-6 border-2 border-black overflow-hidden gap-4">
            <Eye size={48} className="text-black animate-bounce" />
            <Hand size={48} className="text-black animate-pulse" />
          </div>
        );
      case 'posture':
        return (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-3xl mb-6 border-2 border-black overflow-hidden">
            <Clock size={64} className="text-black animate-spin-slow" style={{ animationDuration: '3s' }} />
          </div>
        );
      case 'stop':
        return (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-3xl mb-6 border-2 border-black overflow-hidden">
            <div className="bg-red-500 text-white font-bold text-2xl p-4 rounded-full border-4 border-black animate-pulse">
              STOP
            </div>
          </div>
        );
      case 'turtle':
        return (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-3xl mb-6 border-2 border-black overflow-hidden">
            <Shield size={64} className="text-green-600 animate-breathe" />
          </div>
        );
      case 'emotions':
        return (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-3xl mb-6 border-2 border-black overflow-hidden gap-4">
            <Smile size={48} className="text-black animate-wiggle" />
          </div>
        );
      case 'rules':
        return (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-3xl mb-6 border-2 border-black overflow-hidden">
            <ListChecks size={64} className="text-blue-600 animate-bounce" />
          </div>
        );
      case 'brain':
        return (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-3xl mb-6 border-2 border-black overflow-hidden">
            <Brain size={64} className="text-purple-600 animate-pulse" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative h-full">
      <header className="flex items-center p-6 border-b-2 border-black">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={28} />
        </button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold tracking-tight">Detalle de Actividad</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <h2 className="text-3xl font-bold mb-4">{task.title}</h2>
        
        {renderAnimation()}

        {/* Jorge's Setup/Extension Feature */}
        {needsSetup && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
            <h3 className="text-gray-900 font-bold flex items-center gap-2 mb-3 text-sm uppercase tracking-wide">
              <Settings size={16} /> Configuración Previa
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Define los pasos específicos antes de comenzar.
            </p>
            <textarea 
              value={setupData}
              onChange={(e) => {
                setSetupData(e.target.value);
                setIsSetupSaved(false);
              }}
              placeholder="Ej: 1. No gritar en casa. 2. Pedir por favor..."
              className="w-full border border-gray-200 rounded-xl p-4 bg-white text-gray-900 focus:outline-none focus:border-black min-h-[100px] mb-4 text-sm"
            />
            <button 
              onClick={handleSaveSetup}
              disabled={!setupData.trim() || isSetupSaved}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                isSetupSaved 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50'
              }`}
            >
              {isSetupSaved ? (
                <><CheckCircle2 size={16} /> Guardado</>
              ) : (
                <><Save size={16} /> Guardar</>
              )}
            </button>
          </div>
        )}

        <div className="mb-8">
          <p className="text-lg font-medium text-gray-800 leading-relaxed">{task.description}</p>
        </div>

        {/* Minimalist Info Blocks */}
        <div className="space-y-6 mb-8">
          {task.instructions && (
            <div className="group">
              <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                <Info size={14} /> Instrucciones
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed border-l-2 border-gray-200 pl-4 group-hover:border-black transition-colors">
                {task.instructions}
              </p>
            </div>
          )}

          {task.tips && (
            <div className="group">
              <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                <Lightbulb size={14} /> Consejo
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed border-l-2 border-gray-200 pl-4 group-hover:border-black transition-colors">
                {task.tips}
              </p>
            </div>
          )}

          {task.keyInfo && (
            <div className="group">
              <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                <AlertTriangle size={14} /> Importante
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed border-l-2 border-gray-200 pl-4 group-hover:border-black transition-colors">
                {task.keyInfo}
              </p>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold mb-4">Pasos a seguir:</h3>
        <div className="space-y-4 mb-8">
          {task.steps.map((step, index) => (
            <div key={index} className="flex items-start bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold shrink-0 mr-4">
                {index + 1}
              </div>
              <p className="text-lg font-medium pt-0.5">{step}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            onComplete();
            onBack();
          }}
          className={`w-full p-4 rounded-full font-bold text-xl flex items-center justify-center transition-all border-4
            ${task.completed 
              ? 'bg-white text-black border-black hover:bg-gray-50' 
              : 'bg-black text-white border-black hover:scale-105 active:scale-95'}`}
        >
          <CheckCircle2 size={28} className="mr-2" />
          {task.completed ? 'Marcar como pendiente' : '¡Actividad Completada!'}
        </button>
      </div>
    </div>
  );
}
