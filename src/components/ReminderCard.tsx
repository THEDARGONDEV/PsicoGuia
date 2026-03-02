import React from 'react';
import { Pill, Star, AlertCircle } from 'lucide-react';

interface Reminder {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface Props {
  reminder: Reminder;
}

const ReminderCard: React.FC<Props> = ({ reminder }) => {
  const getIcon = () => {
    switch (reminder.icon) {
      case 'pill': return <Pill size={24} />;
      case 'star': return <Star size={24} />;
      default: return <AlertCircle size={24} />;
    }
  };

  return (
    <div className="flex items-start p-4 rounded-2xl bg-black text-white">
      <div className="mr-4 mt-1">
        {getIcon()}
      </div>
      <div>
        <h3 className="text-lg font-bold">{reminder.title}</h3>
        <p className="text-sm opacity-80 mt-1">{reminder.description}</p>
      </div>
    </div>
  );
}

export default ReminderCard;
