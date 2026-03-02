import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Sparkles, BookOpen, Droplets, Heart, Brain, Star, CheckCircle } from 'lucide-react';
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
      if (synthRef.current) synthRef.current.cancel();
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
    
    isCanceledRef.current = true;
    synthRef.current.cancel();
    isCanceledRef.current = false;

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
      if (!isCanceledRef.current) {
        playSegment(index + 1, segs);
      }
    };

    utterance.onerror = (e) => {
      if (!isCanceledRef.current) {
        console.error('Speech synthesis error', e);
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePlay = () => {
    if (!synthRef.current) return;
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    // If finished, restart
    const startIndex = progress >= 99 ? 0 : currentSegmentIndex;
    playSegment(startIndex);
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      isCanceledRef.current = true;
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSegmentIndex(0);
      setProgress(0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (segments.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    
    const targetIndex = Math.floor(percentage * segments.length);
    const clampedIndex = Math.max(0, Math.min(targetIndex, segments.length - 1));
    
    setProgress(percentage * 100);
    
    if (isPlaying || isPaused) {
      playSegment(clampedIndex);
    } else {
      setCurrentSegmentIndex(clampedIndex);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'hygiene': return <Droplets className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" size={48} />;
      case 'homework': return <BookOpen className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" size={48} />;
      case 'health': return <Heart className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" size={48} />;
      case 'learning': return <Brain className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" size={48} />;
      case 'behavior': return <Star className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" size={48} />;
      case 'chores': return <CheckCircle className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" size={48} />;
      default: return <Sparkles className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" size={48} />;
    }
  };

  const currentSegment = segments[currentSegmentIndex];

  return (
    <div className="bg-black text-white rounded-3xl p-4 mb-8 relative overflow-hidden shadow-lg border border-gray-800">
      <h3 className="text-lg font-bold mb-3 text-center">
        Resumen del Día
      </h3>
      
      {/* Video Player Area */}
      <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
        {/* Animated Background when playing */}
        {isPlaying && (
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 animate-pulse" />
          </div>
        )}
        
        {/* Avatar Container */}
        <div className={`relative z-10 w-32 h-32 transition-transform duration-500 ${isPlaying ? 'scale-110' : 'scale-100'}`}>
          <div className={isPlaying ? 'animate-bounce' : ''}>
            {childId === 'jorge' ? <JorgeAvatar /> : <ValentinaAvatar />}
          </div>
        </div>

        {/* Thematic Animations based on current segment */}
        {currentSegment?.type === 'task' && isPlaying && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 animate-bounce z-20">
            {getCategoryIcon(currentSegment.task?.category)}
          </div>
        )}

        {/* Subtitles / Current Task Title */}
        {currentSegment?.type === 'task' && (isPlaying || isPaused) && (
          <div className="absolute bottom-4 left-0 right-0 text-center px-4 z-20 animate-fade-in">
            <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 shadow-lg">
              {currentSegment.task?.title}
            </span>
          </div>
        )}
        
        {/* Overlay for paused state */}
        {!isPlaying && !isPaused && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
            <button 
              onClick={handlePlay}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Play size={32} className="ml-2 fill-current" />
            </button>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          {isPlaying ? (
            <button onClick={handlePause} className="text-white hover:text-gray-300 transition-colors">
              <Pause size={20} className="fill-current" />
            </button>
          ) : (
            <button onClick={handlePlay} className="text-white hover:text-gray-300 transition-colors">
              <Play size={20} className="fill-current" />
            </button>
          )}
          <button 
            onClick={handleStop} 
            disabled={!isPlaying && !isPaused}
            className={`transition-colors ${(!isPlaying && !isPaused) ? 'text-gray-600' : 'text-white hover:text-gray-300'}`}
          >
            <Square size={16} className="fill-current" />
          </button>
        </div>
        
        {/* Interactive Progress Bar */}
        <div 
          className="flex-1 mx-4 h-3 bg-gray-800 rounded-full overflow-hidden relative cursor-pointer group"
          onClick={handleSeek}
        >
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Progress Fill */}
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
          
          {/* Segment Markers */}
          {segments.map((_, idx) => (
            <div 
              key={idx}
              className="absolute top-0 bottom-0 w-px bg-black/50"
              style={{ left: `${(idx / segments.length) * 100}%` }}
            />
          ))}
        </div>
        
        <Volume2 size={18} className={`text-gray-400 ${isPlaying ? 'animate-pulse text-white' : ''}`} />
      </div>
    </div>
  );
}
