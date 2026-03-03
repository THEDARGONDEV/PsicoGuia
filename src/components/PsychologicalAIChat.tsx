import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Bot, Loader2, Mic, MicOff, Plus, Trash2, MessageSquare, Menu, X } from 'lucide-react';
import { generateLocalResponse } from '../services/localAIEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export default function PsychologicalAIChat({ onBack, username }: { onBack: () => void, username: string | null }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const usernameRef = useRef(username);

  // Update username ref when prop changes
  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  // Load sessions from localStorage on mount or username change
  useEffect(() => {
    let savedSessions: string | null = null;
    
    if (username) {
      savedSessions = localStorage.getItem(`psychological_chat_sessions_${username}`);
    } else {
      savedSessions = sessionStorage.getItem('psychological_chat_sessions_guest');
    }

    if (savedSessions) {
      const parsedSessions: ChatSession[] = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      if (parsedSessions.length > 0) {
        setCurrentSessionId(parsedSessions[0].id);
      } else {
        createNewSession();
      }
    } else {
      // If no saved sessions, clear state and create new one
      setSessions([]);
      createNewSession();
    }
  }, [username]);

  // Save sessions whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      const currentUsername = usernameRef.current;
      if (currentUsername) {
        localStorage.setItem(`psychological_chat_sessions_${currentUsername}`, JSON.stringify(sessions));
      } else {
        sessionStorage.setItem('psychological_chat_sessions_guest', JSON.stringify(sessions));
      }
    }
  }, [sessions]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, currentSessionId]);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
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
  }, []);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Nueva conversación',
      messages: [],
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    
    if (currentSessionId === sessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSessionId(updatedSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const currentMessages = currentSession?.messages || [];

  const handleSend = async () => {
    if (!input.trim() || !currentSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    // Optimistic update
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        // Update title if it's the first message
        const newTitle = session.messages.length === 0 ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : session.title;
        return {
          ...session,
          title: newTitle,
          messages: [...session.messages, userMessage]
        };
      }
      return session;
    }));

    setInput('');
    setIsLoading(true);

    try {
      // Generar respuesta usando el motor local avanzado, pasando el historial para dar contexto
      const text = await generateLocalResponse(input, currentMessages);

      // Simular tiempo de pensamiento de la IA basado en la longitud de la respuesta
      // para que se sienta más natural y fluida (entre 800ms y 3000ms)
      const delay = Math.min(Math.max(text.length * 10, 800), 3000);
      await new Promise(resolve => setTimeout(resolve, delay));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text
      };

      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, aiMessage]
          };
        }
        return session;
      }));

    } catch (error: any) {
      console.error("Error in local AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-white h-full relative font-sans overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        absolute md:relative z-30 h-full w-64 bg-gray-50 border-r border-gray-100 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-900">Historial</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 hover:bg-gray-200 rounded">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <button 
            onClick={createNewSession}
            className="w-full flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            Nuevo Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => {
                setCurrentSessionId(session.id);
                setIsSidebarOpen(false);
              }}
              className={`
                group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
                ${currentSessionId === session.id ? 'bg-white shadow-sm border border-gray-100' : 'hover:bg-gray-100 text-gray-500'}
              `}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className={currentSessionId === session.id ? 'text-black' : 'text-gray-400'} />
                <span className={`text-sm truncate ${currentSessionId === session.id ? 'font-medium text-gray-900' : ''}`}>
                  {session.title}
                </span>
              </div>
              <button 
                onClick={(e) => deleteSession(e, session.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors md:hidden"
            >
              <Menu size={24} className="text-gray-900" />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">Orientación Familiar</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Especialista en TDAH y PC</p>
            </div>
          </div>
          
          {/* Desktop New Chat Button (visible when sidebar is hidden on medium screens) */}
          <button 
            onClick={createNewSession}
            className="hidden md:flex lg:hidden items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          >
            <Plus size={14} />
            Nuevo
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
              <Bot size={48} className="mb-4 text-gray-300" />
              <p className="text-sm text-gray-400 max-w-xs">
                Hola. Estoy aquí para apoyarte con tus hijos (TDAH y Parálisis Cerebral). Pregúntame lo que necesites.
              </p>
            </div>
          )}

          {currentMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-gray-400" />
                <span className="text-xs text-gray-400">Pensando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-600'}`}
              title="Usar voz"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder={isListening ? "Escuchando..." : "Escribe o habla aquí..."}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-900 placeholder-gray-400"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
