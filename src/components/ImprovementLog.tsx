import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Mic, MicOff } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  date: string;
  tag?: 'Valentina' | 'Jorge' | 'Para mis hijos';
}

export default function ImprovementLog({ onBack, username }: { onBack: () => void, username: string | null }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [filter, setFilter] = useState<'All' | 'Valentina' | 'Jorge' | 'Para mis hijos'>('All');

  useEffect(() => {
    if (username) {
      const savedNotes = localStorage.getItem(`improvement_log_${username}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    } else {
      // Guest mode: use sessionStorage or clear
      const savedGuestNotes = sessionStorage.getItem('improvement_log_guest');
      if (savedGuestNotes) {
        setNotes(JSON.parse(savedGuestNotes));
      } else {
        setNotes([]);
      }
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewNote(prev => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          setIsListening(false);
          return;
        }
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [username]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    if (username) {
      localStorage.setItem(`improvement_log_${username}`, JSON.stringify(updatedNotes));
    } else {
      sessionStorage.setItem('improvement_log_guest', JSON.stringify(updatedNotes));
    }
  };

  const getTagFromText = (text: string): 'Valentina' | 'Jorge' | 'Para mis hijos' => {
    const lowerText = text.toLowerCase().trim().replace(/[.,!?;:]+$/, '');
    
    // Check for specific child references
    // Removed 'la' and 'el' to avoid false positives with common articles
    const hasValentina = /\b(valentina|niña|hija)\b/.test(lowerText);
    const hasJorge = /\b(jorge|niño|hijo)\b/.test(lowerText);
    const hasPlural = /\b(niños|hijos|ambos|los dos|mis hijos)\b/.test(lowerText);

    // If both are mentioned or plural keywords are used
    if (hasPlural || (hasValentina && hasJorge)) return 'Para mis hijos';
    
    if (hasValentina) return 'Valentina';
    if (hasJorge) return 'Jorge';
    
    // Fallback based on ending if mixed or unclear, prioritizing explicit names at the end
    if (lowerText.endsWith('valentina')) return 'Valentina';
    if (lowerText.endsWith('jorge')) return 'Jorge';
    
    return 'Para mis hijos';
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const tag = getTagFromText(newNote);
    
    const note: Note = {
      id: Date.now().toString(),
      text: newNote,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
      tag: tag
    };
    saveNotes([note, ...notes]);
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (!editingId || !editText.trim()) return;
    saveNotes(notes.map(n => n.id === editingId ? { ...n, text: editText, tag: getTagFromText(editText) } : n));
    setEditingId(null);
    setEditText('');
  };

  const filteredNotes = filter === 'All' ? notes : notes.filter(n => n.tag === filter);

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative font-sans">
      <header className="flex items-center p-6 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="ml-4 text-xl font-bold tracking-tight text-gray-900">Registro de Mejoras</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-4">
            Anota aquí observaciones, ideas o áreas de mejora para el bienestar de tus hijos.
          </p>
          
          <div className="flex gap-3 items-center mb-6">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={isListening ? "Escuchando..." : "Escribe una nueva nota..."}
              className="flex-1 border-b border-gray-200 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            />
            <button
              onClick={toggleListening}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-600'}`}
              title="Usar voz"
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Minimalist Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {(['All', 'Valentina', 'Jorge', 'Para mis hijos'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filter === f 
                    ? 'bg-black text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f === 'All' ? 'Todos' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotes.map(note => (
            <div key={note.id} className="group bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-all relative">
              {editingId === note.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-black"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded">
                    <Save size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:bg-gray-100 p-1 rounded">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <p className="text-gray-900 text-sm leading-relaxed">{note.text}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] text-gray-400">{note.date}</span>
                      {note.tag && (
                        <span className="text-[10px] font-medium px-2 py-0.5 border border-gray-300 rounded-full text-gray-600 uppercase tracking-wide">
                          {note.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                    <button onClick={() => startEdit(note)} className="text-gray-400 hover:text-black p-1">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-12 text-gray-300">
              <p className="text-sm italic">No hay notas registradas aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
