import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Sparkles, BookOpen, Droplets, Heart, Brain, Star, CheckCircle, Rewind, FastForward, Activity, Eye, Clock, Hand, Smile, Shield, ListChecks } from 'lucide-react';
import { TaskData } from '../data/tasks';
import { ValentinaAvatar, JorgeAvatar } from './Avatars';

interface Props {
  childId: string;
  childName: string;
  tasks: TaskData[];
  isWeekend: boolean;
}

interface ScriptSegment {
  text: string;
  type: 'intro' | 'task' | 'outro';
  task?: TaskData;
  index: number;
}

export default function DailyBriefingVideo({ childId, childName, tasks, isWeekend }: Props) {
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
    setSegments(generateSegments());
    setCurrentSegmentIndex(0);
    setProgress(0);
    handleStop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, childName]);

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
    }, 50);
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

  const handleVideoTap = () => {
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
        className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-4 flex items-center justify-center select-none cursor-pointer"
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

        {/* Animated Background when playing */}
        {isPlaying && (
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 animate-pulse" />
          </div>
        )}
        
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
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30 pointer-events-none">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center pointer-events-none">
              <Play size={32} className="ml-2 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button onClick={togglePlayPause} className="text-white hover:text-gray-300 transition-colors z-50">
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
          </button>
          <button 
            onClick={handleStop} 
            disabled={!isPlaying && !isPaused}
            className={`transition-colors z-50 ${(!isPlaying && !isPaused) ? 'text-gray-600' : 'text-white hover:text-gray-300'}`}
          >
            <Square size={16} className="fill-current" />
          </button>
        </div>
        
        {/* Simple Progress Text instead of bar */}
        <div className="flex-1 text-center text-xs text-gray-400 font-mono">
          {Math.round(progress)}%
        </div>
        
        <Volume2 size={18} className={`text-gray-400 ${isPlaying ? 'animate-pulse text-white' : ''}`} />
      </div>
    </div>
  );
}
