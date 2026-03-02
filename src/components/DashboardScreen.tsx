import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Calendar as CalendarIcon, Bell, Activity, Trophy } from 'lucide-react';
import CalendarComponent from './CalendarComponent';
import TaskListItem from './TaskListItem';
import ReminderCard from './ReminderCard';
import TaskDetailScreen from './TaskDetailScreen';
import RoutinePlanner from './RoutinePlanner';
import DailyBriefingVideo from './DailyBriefingVideo';
import JorgeRulesTracker from './JorgeRulesTracker';
import { TaskData } from '../data/tasks';

// Mock Data (In a real app, this would come from a ViewModel/State Management)
const CHILDREN_INFO: Record<string, { name: string, condition: string }> = {
  'valentina': { name: 'Valentina', condition: 'Parálisis Cerebral (PCI)' },
  'jorge': { name: 'Jorge', condition: 'TDAH' }
};

interface ReminderData {
  id: number;
  childId: string;
  title: string;
  description: string;
  icon: string;
}

const REMINDERS: ReminderData[] = [
  // Valentina
  { id: 1, childId: 'valentina', title: 'Masajes', description: 'Realizar masajes de relajación diarios', icon: 'star' },
  { id: 2, childId: 'valentina', title: 'Constancia Sensorial', description: 'Ser consecuente en las actividades sensoriales', icon: 'alert' },
  
  // Jorge
  { id: 3, childId: 'jorge', title: 'Refuerzo Positivo', description: 'Elogiar y premiar sus buenas acciones', icon: 'star' },
  { id: 4, childId: 'jorge', title: 'Reglas en Casa', description: 'Mantener claras y firmes las normas del hogar', icon: 'alert' },
];

interface Props {
  childId: string;
  onBack: () => void;
  tasks: TaskData[];
  onToggleTask: (taskId: number) => void;
}

export default function DashboardScreen({ childId, onBack, tasks, onToggleTask }: Props) {
  const child = CHILDREN_INFO[childId];
  const reminders = REMINDERS.filter(r => r.childId === childId);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Lunes por defecto

  const openWhatsApp = () => {
    window.open('https://wa.me/51916076791', '_blank');
  };

  if (selectedTask) {
    return (
      <TaskDetailScreen 
        task={selectedTask} 
        onBack={() => setSelectedTask(null)} 
        onComplete={() => onToggleTask(selectedTask.id)}
      />
    );
  }

  const childTasks = tasks.filter(t => t.childId === childId);
  const currentDayTasks = childTasks.filter(t => t.dayIndex === selectedDayIndex);
  const isWeekend = selectedDayIndex === 5 || selectedDayIndex === 6;

  return (
    <div className="flex-1 flex flex-col bg-white relative h-full">
      {/* Header */}
      <header className="flex items-center p-6 border-b-2 border-black">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={28} />
        </button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold tracking-tight">{child.name}</h1>
          <p className="text-sm text-gray-500 font-medium">{child.condition}</p>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8">
        
        <div className="text-center mb-2">
          <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase">TuEresSuGuía</h2>
        </div>

        {/* Daily Briefing Video or Weekend Trophy */}
        {isWeekend ? (
          <div className="bg-green-100 border-2 border-green-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
              <Trophy size={48} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">¡Lo hiciste genial esta semana, {child.name}!</h3>
            <p className="text-green-700 font-medium">Tómate un merecido descanso.</p>
          </div>
        ) : (
          <DailyBriefingVideo 
            childId={childId}
            childName={child.name} 
            tasks={currentDayTasks} 
            isWeekend={isWeekend} 
          />
        )}

        {/* Jorge's Rules Tracker */}
        {childId === 'jorge' && (
          <JorgeRulesTracker />
        )}

        {/* Calendar Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon size={20} />
              Esta Semana
            </h2>
          </div>
          <CalendarComponent 
            selectedDayIndex={selectedDayIndex} 
            onSelectDay={setSelectedDayIndex} 
          />
        </section>

        {/* Tasks Section */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity size={20} />
            Programa
          </h2>
          
          {isWeekend ? (
            <div className="bg-green-100 border-2 border-green-500 rounded-3xl p-6 text-center">
              <h3 className="text-2xl font-bold text-green-800">FIN DE SEMANA</h3>
            </div>
          ) : (
            <div className="space-y-3">
              {currentDayTasks.map(task => (
                <TaskListItem 
                  key={task.id} 
                  task={task} 
                  onToggle={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }} 
                  onClick={() => setSelectedTask(task)}
                />
              ))}
              {currentDayTasks.length === 0 && (
                <p className="text-gray-500 italic">No hay actividades programadas para este día.</p>
              )}
            </div>
          )}
        </section>

        {/* Reminders Section - Only for Jorge */}
        {childId !== 'valentina' && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell size={20} />
              Recordatorios
            </h2>
            <div className="space-y-3">
              {reminders.map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
               {reminders.length === 0 && (
                <p className="text-gray-500 italic">No hay recordatorios.</p>
              )}
            </div>
          </section>
        )}

        {/* Custom Routine for Jorge */}
        {childId === 'jorge' && (
          <section>
            <RoutinePlanner />
          </section>
        )}

      </div>

      {/* FAB */}
      <button
        onClick={openWhatsApp}
        className="absolute bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95"
        aria-label="Contactar Psicólogo"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
