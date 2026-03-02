import React, { useState } from 'react';
import { Plus, Eye, Trash2, Sun, Sunset, Moon, X, ChevronDown, ChevronUp } from 'lucide-react';

interface RoutineItem {
  id: string;
  title: string;
  category: 'Mañana' | 'Tarde' | 'Noche';
}

export default function CustomRoutineManager() {
  const [items, setItems] = useState<RoutineItem[]>([
    { id: '1', title: 'Levantarse y tender la cama', category: 'Mañana' },
    { id: '2', title: 'Cepillarse los dientes', category: 'Mañana' },
    { id: '3', title: 'Hacer la tarea', category: 'Tarde' },
    { id: '4', title: 'Ducharse', category: 'Noche' },
  ]);
  
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Mañana' | 'Tarde' | 'Noche'>('Mañana');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdd = () => {
    if (!newItemTitle.trim()) return;
    setItems([...items, { id: Date.now().toString(), title: newItemTitle, category: newItemCategory }]);
    setNewItemTitle('');
  };

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const categories = [
    { name: 'Mañana', icon: <Sun size={20} className="mr-2" /> },
    { name: 'Tarde', icon: <Sunset size={20} className="mr-2" /> },
    { name: 'Noche', icon: <Moon size={20} className="mr-2" /> },
  ] as const;

  if (isPreviewOpen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col p-6 overflow-y-auto text-white animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mi Rutina</h1>
          <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X size={32} />
          </button>
        </div>
        
        <div className="space-y-8 flex-1">
          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat.name);
            if (catItems.length === 0) return null;
            return (
              <div key={cat.name} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationFillMode: 'both' }}>
                <h2 className="text-2xl font-bold flex items-center mb-4 text-gray-400 border-b-2 border-gray-800 pb-2">
                  {cat.icon} {cat.name}
                </h2>
                <ul className="space-y-4">
                  {catItems.map((item, index) => (
                    <li key={item.id} className="flex items-center text-xl bg-gray-900 p-4 rounded-2xl border border-gray-800">
                      <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center mr-4 font-bold text-sm">
                        {index + 1}
                      </div>
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-3xl border-2 border-black mt-8 overflow-hidden transition-all duration-300">
      <div 
        className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold">Rutina Personalizada</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewOpen(true);
            }} 
            className="p-2 bg-black text-white rounded-full hover:scale-105 transition-transform" 
            title="Ver Rutina Completa"
          >
            <Eye size={20} />
          </button>
          <div className="p-2">
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 pt-0 border-t-2 border-gray-200">
          <div className="flex flex-col gap-3 mb-6 mt-4">
            <input 
              type="text" 
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Ej. Cepillarse los dientes..."
              className="w-full p-3 border-2 border-black rounded-xl focus:outline-none"
            />
            <div className="flex gap-2">
              <select 
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="flex-1 p-3 border-2 border-black rounded-xl bg-white focus:outline-none font-bold"
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
              <button onClick={handleAdd} className="px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center">
                <Plus size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {categories.map(cat => {
              const catItems = items.filter(i => i.category === cat.name);
              return (
                <div key={cat.name} className={catItems.length === 0 ? 'hidden' : ''}>
                  <h3 className="text-lg font-bold flex items-center mb-3 border-b-2 border-gray-200 pb-2">
                    {cat.icon} {cat.name}
                  </h3>
                  <ul className="space-y-2">
                    {catItems.map(item => (
                      <li key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl border-2 border-gray-200">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full border-2 border-black mr-3"></div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md">
                          <Trash2 size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
