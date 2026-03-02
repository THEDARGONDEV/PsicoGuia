import React, { useState, useEffect } from 'react';
import { Play, Calendar, Bell, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function OnboardingTutorial({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "¡Bienvenido a PsicoGuía!",
      description: "Tu asistente personal para gestionar las rutinas y el desarrollo de tus hijos de manera organizada y efectiva.",
      icon: <Shield size={80} className="text-blue-500 animate-bounce" />,
      color: "bg-blue-50"
    },
    {
      title: "Resumen Diario en Video",
      description: "Escucha un resumen animado de las actividades del día. ¡Puedes adelantar, retroceder y ver animaciones de cada tarea!",
      icon: <Play size={80} className="text-purple-500 animate-pulse" />,
      color: "bg-purple-50"
    },
    {
      title: "Organización Semanal",
      description: "Visualiza rápidamente las tareas de cada día usando el calendario interactivo superior.",
      icon: <Calendar size={80} className="text-green-500 animate-bounce" />,
      color: "bg-green-50"
    },
    {
      title: "Herramientas Específicas",
      description: "Alarmas personalizadas para Valentina y configuraciones previas de normas para Jorge, adaptadas a sus necesidades.",
      icon: <Bell size={80} className="text-red-500 animate-wiggle" />,
      color: "bg-red-50"
    },
    {
      title: "¡Gracias por tu atención!",
      description: "Espero que PsicoGuía sea de gran ayuda para ti y tus pequeños.",
      icon: (
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-blue-500 flex items-center justify-center overflow-hidden relative shadow-inner">
            <div className="w-16 h-16 bg-orange-200 rounded-full relative flex items-center justify-center mt-2">
              <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full animate-blink"></div>
              <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full animate-blink"></div>
              <div className="absolute top-7 w-6 h-3 border-b-2 border-black rounded-full"></div>
              <div className="absolute -top-2 w-16 h-6 bg-gray-800 rounded-t-full"></div>
            </div>
            <div className="absolute bottom-0 w-20 h-8 bg-blue-600 rounded-t-3xl border-t-2 border-blue-800">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-4 bg-orange-200 rounded-b-full"></div>
            </div>
          </div>
        </div>
      ),
      color: "bg-blue-50",
      isFinal: true
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="flex gap-2 p-6">
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${idx <= step ? 'bg-black' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500 ${currentStep.color}`}>
        <div className="mb-8 p-8 bg-white rounded-full shadow-xl">
          {currentStep.icon}
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tight">
          {currentStep.title}
        </h2>
        <p className="text-lg text-gray-600 font-medium max-w-xs">
          {currentStep.description}
        </p>
        
        {currentStep.isFinal && (
          <div className="mt-8 flex flex-col items-center animate-in fade-in duration-700">
            <p className="text-sm text-gray-500 mb-1 font-bold tracking-widest uppercase">Creador</p>
            <p className="font-handwriting text-4xl text-blue-700 -rotate-2">Emilio M. Ch</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-white border-t-2 border-gray-100">
        <button
          onClick={() => {
            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              onComplete();
            }
          }}
          className="w-full bg-black text-white p-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors active:scale-95"
        >
          {step < steps.length - 1 ? (
            <>Siguiente <ArrowRight size={24} /></>
          ) : (
            <>¡Comenzar! <CheckCircle2 size={24} /></>
          )}
        </button>
      </div>
    </div>
  );
}
