import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Sparkles, BookOpen, Droplets, Heart, Brain, Star, CheckCircle, Rewind, FastForward, Activity, Eye, Clock, Hand, Smile, Shield, ListChecks } from 'lucide-react';
import { TaskData } from '../data/tasks';
import { ValentinaAvatar, JorgeAvatar } from './Avatars';

import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface Props {
  childId: string;
  childName: string;
  tasks: TaskData[];
  isWeekend: boolean;
  userId: string | null;
}

interface ScriptSegment {
  text: string;
  type: 'intro' | 'task' | 'outro';
  task?: TaskData;
  index: number;
}

export default function DailyBriefingVideo({ childId, childName, tasks, isWeekend, userId }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [segments, setSegments] = useState<ScriptSegment[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showRewind, setShowRewind] = useState(false);
  const [showForward, setShowForward] = useState(false);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCanceledRef = useRef(false);

  const generateSegments = (): ScriptSegment[] => {
    if (tasks.length === 0) {
      return [{
        text: `El día de hoy ${childName} no tiene actividades programadas. Es un excelente momento para que descanse.`,
        type: 'intro',
        index: 0
      }];
    }

    const newSegments: ScriptSegment[] = [];
    newSegments.push({
      text: `Hoy es un gran día para ${childName}. ${childName} realizará ${tasks.length} actividades. Te resumo los pasos: `,
      type: 'intro',
      index: 0
    });

    tasks.forEach((task, index) => {
      newSegments.push({
        text: `Paso ${index + 1}: ${childName} hará la actividad de: ${task.title}. La indicación es: ${task.description}. `,
        type: 'task',
        task: task,
        index: index + 1
      });
    });

    newSegments.push({
      text: `¡${childName} lo hará excelente hoy!`,
      type: 'outro',
      index: tasks.length + 1
    });

    return newSegments;
  };

  useEffect(() => {
    const newSegments = generateSegments();
    setSegments(newSegments);
    
    const loadProgress = async () => {
      let initialIndex = 0;
      
      if (userId) {
        // Load from Firestore
        try {
          const docRef = doc(db, 'users', userId, 'videoProgress', childId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.index >= 0 && data.index < newSegments.length) {
              initialIndex = data.index;
            }
          }
        } catch (error) {
          console.error("Error loading video progress:", error);
        }
      } else {
        // Load from localStorage
        const savedIndex = localStorage.getItem(`psicoguia_video_progress_${childId}`);
        if (savedIndex) {
          const index = parseInt(savedIndex, 10);
          if (!isNaN(index) && index >= 0 && index < newSegments.length) {
            initialIndex = index;
          }
        }
      }

      setCurrentSegmentIndex(initialIndex);
      setProgress((initialIndex / newSegments.length) * 100);
    };

    loadProgress();
    
    // Reset player state but keep position
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, childName, userId]);

  // Save progress whenever segment changes
  useEffect(() => {
    if (segments.length > 0) {
      if (userId) {
        // Save to Firestore
        const saveToFirestore = async () => {
          try {
            const docRef = doc(db, 'users', userId, 'videoProgress', childId);
            await setDoc(docRef, { index: currentSegmentIndex, updatedAt: new Date().toISOString() }, { merge: true });
          } catch (error) {
            console.error("Error saving video progress:", error);
          }
        };
        saveToFirestore();
      }
      // Always save to localStorage as backup/offline
      localStorage.setItem(`psicoguia_video_progress_${childId}`, currentSegmentIndex.toString());
    }
  }, [currentSegmentIndex, childId, segments.length, userId]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => { synthRef.current?.getVoices(); };
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getVoiceScore = (voice: SpeechSynthesisVoice) => {
    let score = 0;
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();

    if (lang === 'es-pe') score += 1000;
    else if (lang === 'es-mx' || lang === 'es-us' || lang === 'es-419') score += 500;
    else if (lang.startsWith('es')) score += 100;

    if (childId === 'jorge') {
      if (/(jorge|diego|juan|raul|pablo|carlos|male|masculino)/i.test(name)) score += 200;
      if (/(camila|sabina|helena|paulina|monica|female|femenino|margarita|victoria|laura)/i.test(name)) score -= 200;
    } else {
      if (/(camila|sabina|helena|paulina|monica|female|femenino|margarita|victoria|laura)/i.test(name)) score += 200;
      if (/(jorge|diego|juan|raul|pablo|carlos|male|masculino)/i.test(name)) score -= 200;
    }

    if (/(premium|enhanced|natural|neural|high)/i.test(name)) score += 50;
    return score;
  };

  const playSegment = (index: number, segs = segments) => {
    if (!synthRef.current || segs.length === 0) return;
    
    // Remove event listeners from the previous utterance to prevent race conditions
    // where canceling triggers onend and skips to the wrong segment.
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current.onboundary = null;
    }
    
    synthRef.current.cancel();

    if (index >= segs.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSegmentIndex(0);
      setProgress(100);
      return;
    }

    setCurrentSegmentIndex(index);
    const segment = segs[index];
    
    if (!segment) {
      console.warn('Segment not found at index', index);
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(segment.text);
    
    const voices = synthRef.current.getVoices();
    const spanishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('es'));
    if (spanishVoices.length > 0) {
      const bestVoice = spanishVoices.reduce((best, current) => {
        return getVoiceScore(current) > getVoiceScore(best) ? current : best;
      }, spanishVoices[0]);
      utterance.voice = bestVoice;
    }

    utterance.rate = 0.92;
    utterance.pitch = childId === 'jorge' ? 0.7 : 0.9;
    utterance.volume = 0.5;

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const segmentProgress = e.charIndex / segment.text.length;
        const totalProgress = ((index + segmentProgress) / segs.length) * 100;
        setProgress(totalProgress);
      }
    };

    utterance.onend = () => {
      playSegment(index + 1, segs);
    };

    utterance.onerror = (e) => {
      // Ignore interruption errors as they happen when skipping/rewinding
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return;
      }
      console.error('Speech synthesis error', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    
    // Small timeout to ensure the previous cancel has fully processed before speaking again
    // This prevents the new utterance from being swallowed by the previous cancel command
    setTimeout(() => {
      if (synthRef.current && utteranceRef.current === utterance) {
        synthRef.current.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
      }
    }, 100);
  };

  const togglePlayPause = () => {
    if (!synthRef.current) return;
    
    if (isPlaying) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      // Start from beginning or current
      const startIndex = progress >= 99 ? 0 : currentSegmentIndex;
      playSegment(startIndex);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
        utteranceRef.current.onboundary = null;
      }
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSegmentIndex(0);
      setProgress(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    
    const newIndex = Math.floor((newProgress / 100) * segments.length);
    const safeIndex = Math.min(Math.max(newIndex, 0), segments.length - 1);
    
    setCurrentSegmentIndex(safeIndex);
    
    // If we are dragging, we might want to pause or just update the visual
    // For now, let's just update visual. The user will release to play.
  };

  const handleSeekEnd = () => {
    // When user releases the slider, play from that point if it was playing, 
    // or just set the point ready to play.
    if (isPlaying) {
      playSegment(currentSegmentIndex);
    }
  };

  const handleDoubleTapLeft = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent single tap
    setShowRewind(true);
    setTimeout(() => setShowRewind(false), 500);
    
    if (currentSegmentIndex > 0) {
      playSegment(currentSegmentIndex - 1);
    } else {
      playSegment(0);
    }
  };

  const handleDoubleTapRight = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent single tap
    setShowForward(true);
    setTimeout(() => setShowForward(false), 500);
    
    if (currentSegmentIndex < segments.length - 1) {
      playSegment(currentSegmentIndex + 1);
    }
  };

  const handleVideoTap = (e: React.MouseEvent) => {
    // Prevent toggling if clicking on controls (though controls are outside this div usually)
    // But if we have overlay controls, we need to be careful.
    togglePlayPause();
  };

  const getTaskIcon = (task?: TaskData) => {
    if (!task) return <Sparkles className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" size={48} />;
    
    switch (task.animationType) {
      case 'stretching': return <Activity className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" size={48} />;
      case 'sensory': return <Eye className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" size={48} />;
      case 'posture': return <Clock className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" size={48} />;
      case 'stop': return <Hand className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" size={48} />;
      case 'turtle': return <Shield className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" size={48} />;
      case 'emotions': return <Smile className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" size={48} />;
      case 'rules': return <ListChecks className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" size={48} />;
      case 'brain': return <Brain className="text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" size={48} />;
      default: return <Star className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" size={48} />;
    }
  };

  const currentSegment = segments[currentSegmentIndex];

  return (
    <div className="bg-black text-white rounded-3xl p-4 mb-8 relative overflow-hidden shadow-lg border border-gray-800">
      <h3 className="text-lg font-bold mb-3 text-center">
        Resumen del Día
      </h3>
      
      {/* Video Player Area */}
      <div 
        className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-4 flex items-center justify-center select-none cursor-pointer group"
        onClick={handleVideoTap}
      >
        
        {/* Double Tap Zones */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/3 z-40" 
          onDoubleClick={handleDoubleTapLeft}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 z-40" 
          onDoubleClick={handleDoubleTapRight}
        />

        {/* Double Tap Feedback Animations */}
        {showRewind && (
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-50 bg-black/50 rounded-full p-4 animate-pulse pointer-events-none">
            <Rewind size={32} className="text-white" />
            <span className="text-xs font-bold block text-center mt-1">-1 Paso</span>
          </div>
        )}
        {showForward && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 bg-black/50 rounded-full p-4 animate-pulse pointer-events-none">
            <FastForward size={32} className="text-white" />
            <span className="text-xs font-bold block text-center mt-1">+1 Paso</span>
          </div>
        )}

        {/* Minimalist Background - removed gradient pulse */}
        
        {/* Avatar Container */}
        <div className={`relative z-10 w-32 h-32 transition-transform duration-500 ${isPlaying ? 'scale-110' : 'scale-100'} pointer-events-none`}>
          <div className={isPlaying ? 'animate-bounce' : ''}>
            {childId === 'jorge' ? <JorgeAvatar /> : <ValentinaAvatar />}
          </div>
        </div>

        {/* Thematic Animations based on current segment */}
        {currentSegment?.type === 'task' && (isPlaying || isPaused) && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 animate-bounce z-20 pointer-events-none">
            {getTaskIcon(currentSegment.task)}
          </div>
        )}

        {/* Subtitles / Current Task Title */}
        {currentSegment?.type === 'task' && (isPlaying || isPaused) && (
          <div className="absolute bottom-4 left-0 right-0 text-center px-4 z-20 animate-fade-in pointer-events-none">
            <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 shadow-lg">
              {currentSegment.task?.title}
            </span>
          </div>
        )}
        
        {/* Overlay for paused state */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30 pointer-events-none transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center pointer-events-none">
              <Play size={32} className="ml-2 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Minimalist Controls Bar */}
      <div className="flex flex-col gap-2 px-1">
        {/* Progress Slider */}
        <div className="w-full flex items-center gap-2 group">
           <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:h-2 transition-all duration-200"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlayPause} className="text-white hover:text-gray-300 transition-colors">
              {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
            </button>
            
            <div className="text-xs text-gray-400 font-mono">
              {Math.floor(progress)}%
            </div>
          </div>
          
          <button 
            onClick={handleStop} 
            className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-wider font-bold"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
