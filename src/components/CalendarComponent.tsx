import React from 'react';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DATES = [12, 13, 14, 15, 16, 17, 18];

interface Props {
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export default function CalendarComponent({ selectedDayIndex, onSelectDay }: Props) {
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
              {DATES[index]}
            </div>
            {/* Indicador visual de tareas */}
            <div className={`h-1.5 w-1.5 rounded-full mt-1 transition-colors ${isSelected ? 'bg-black' : 'bg-transparent'}`}></div>
          </div>
        );
      })}
    </div>
  );
}
