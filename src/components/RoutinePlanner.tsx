import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, Sun, Sunset, Moon, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Reorder, useDragControls } from 'motion/react';

interface RoutineItem {
  id: string;
  title: string;
  category: 'Mañana' | 'Tarde' | 'Noche';
}

const CATEGORIES = ['Mañana', 'Tarde', 'Noche'] as const;

export default function RoutinePlanner() {
  const [items, setItems] = useState<RoutineItem[]>([
    { id: '1', title: 'Levantarse y tender la cama', category: 'Mañana' },
    { id: '2', title: 'Cepillarse los dientes', category: 'Mañana' },
    { id: '3', title: 'Hacer la tarea', category: 'Tarde' },
    { id: '4', title: 'Ducharse', category: 'Noche' },
  ]);
  
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jorge_routine_v2');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const saveItems = (newItems: RoutineItem[]) => {
    setItems(newItems);
    localStorage.setItem('jorge_routine_v2', JSON.stringify(newItems));
  };

  const handleAdd = (category: 'Mañana' | 'Tarde' | 'Noche') => {
    if (!newItemTitle.trim()) return;
    const newItem: RoutineItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      category
    };
    saveItems([...items, newItem]);
    setNewItemTitle('');
  };

  const handleRemove = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const handleReorder = (newOrder: RoutineItem[]) => {
    saveItems(newOrder);
  };

  // Group items for display, but we need a flat list for Reorder to work across lists easily
  // However, framer-motion Reorder works best with a single list. 
  // To simulate moving between categories, we can just change the category property.
  // For simplicity in this "minimalist bar" design, let's keep it simple:
  // We will have 3 separate Reorder.Group lists. Moving between them requires more complex setup.
  // Given the constraint "intercalarlas libremente en las secciones... según el deseo del usuario",
  // a true drag-and-drop between lists is ideal.
  // But without a heavy dnd library, we can use a simple "Move to" action or just simple reorder within lists.
  // Let's try to implement a simple "Change Category" dropdown or cycle on click for minimalism?
  // Or better: Just 3 lists.

  return (
    <div className="bg-white rounded-3xl border border-gray-200 mt-8 overflow-hidden transition-all duration-300 shadow-sm">
      <div 
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold tracking-tight">Rutina Diaria</h2>
        <div className="p-2 bg-gray-100 rounded-full">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 pt-0 border-t border-gray-100">
          <div className="flex flex-col gap-4 mb-8 mt-6">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Nueva actividad..."
                className="flex-1 p-3 border-b border-gray-200 focus:outline-none focus:border-black transition-colors bg-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('Mañana')}
              />
              <div className="flex gap-1">
                <button onClick={() => handleAdd('Mañana')} disabled={!newItemTitle} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold disabled:opacity-50">Mañana</button>
                <button onClick={() => handleAdd('Tarde')} disabled={!newItemTitle} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold disabled:opacity-50">Tarde</button>
                <button onClick={() => handleAdd('Noche')} disabled={!newItemTitle} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold disabled:opacity-50">Noche</button>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {CATEGORIES.map(category => {
              const categoryItems = items.filter(i => i.category === category);
              
              return (
                <div key={category}>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    {category === 'Mañana' && <Sun size={16} />}
                    {category === 'Tarde' && <Sunset size={16} />}
                    {category === 'Noche' && <Moon size={16} />}
                    {category}
                  </h3>
                  
                  <Reorder.Group 
                    axis="y" 
                    values={categoryItems} 
                    onReorder={(newOrder) => {
                      // We need to merge the reordered items back into the main list
                      // preserving the order of other categories
                      const otherItems = items.filter(i => i.category !== category);
                      saveItems([...otherItems, ...newOrder]);
                    }}
                    className="space-y-3"
                  >
                    {categoryItems.map(item => (
                      <Reorder.Item key={item.id} value={item} className="relative touch-none">
                        <div className="flex items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm group hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing select-none">
                          <GripVertical size={16} className="text-gray-300 mr-3 shrink-0" />
                          <span className="font-medium text-gray-800 flex-1">{item.title}</span>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Move buttons for simple category switching */}
                            {category !== 'Mañana' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent drag start
                                  const updated = items.map(i => i.id === item.id ? { ...i, category: 'Mañana' as const } : i);
                                  saveItems(updated);
                                }}
                                className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                              >
                                Mañana
                              </button>
                            )}
                            {category !== 'Tarde' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = items.map(i => i.id === item.id ? { ...i, category: 'Tarde' as const } : i);
                                  saveItems(updated);
                                }}
                                className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                              >
                                Tarde
                              </button>
                            )}
                            {category !== 'Noche' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = items.map(i => i.id === item.id ? { ...i, category: 'Noche' as const } : i);
                                  saveItems(updated);
                                }}
                                className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                              >
                                Noche
                              </button>
                            )}
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(item.id);
                              }} 
                              className="text-gray-400 hover:text-red-500 ml-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                  
                  {categoryItems.length === 0 && (
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center text-gray-300 text-sm">
                      Sin actividades
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
