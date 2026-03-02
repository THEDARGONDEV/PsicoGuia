import React from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { TaskData } from '../data/tasks';

interface Props {
  task: TaskData;
  onToggle: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const TaskListItem: React.FC<Props> = ({ task, onToggle, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
        ${task.completed ? 'border-gray-300 bg-gray-50 opacity-60' : 'border-black bg-white hover:bg-gray-50'}`}
    >
      <div className="mr-4" onClick={onToggle}>
        {task.completed ? (
          <CheckCircle2 size={28} className="text-black" />
        ) : (
          <Circle size={28} className="text-black" />
        )}
      </div>
      <span className={`flex-1 text-lg font-bold ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}>
        {task.title}
      </span>
      <ChevronRight size={24} className="text-gray-400" />
    </div>
  );
}

export default TaskListItem;
