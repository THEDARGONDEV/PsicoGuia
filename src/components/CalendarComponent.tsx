import React, { useMemo } from 'react';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

interface Props {
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export default function CalendarComponent({ selectedDayIndex, onSelectDay }: Props) {
  const currentWeekDates = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
    // Calculate the date of the Monday of the current week
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      dates.push(nextDate.getDate());
    }
    return dates;
  }, []);

  return (
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-3xl border-2 border-black overflow-x-auto hide-scrollbar">
      {DAYS.map((day, index) => {
        const isSelected = index === selectedDayIndex;
        return (
          <div 
            key={day} 
            className="flex flex-col items-center cursor-pointer min-w-[3rem]"
            onClick={() => onSelectDay(index)}
          >
            <span className={`text-xs font-bold mb-2 ${isSelected ? 'text-black' : 'text-gray-400'}`}>{day}</span>
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-black border-transparent hover:border-gray-300'}`}
            >
              {currentWeekDates[index]}
            </div>
            {/* Indicador visual de tareas */}
            <div className={`h-1.5 w-1.5 rounded-full mt-1 transition-colors ${isSelected ? 'bg-black' : 'bg-transparent'}`}></div>
          </div>
        );
      })}
    </div>
  );
}
