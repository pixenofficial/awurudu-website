import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, RefreshCw, Trophy } from 'lucide-react';

const RABAN_SOUNDS = [
  { id: 'center', note: 'Don', color: '#D41922', freq: 150 },
  { id: 'edge-top', note: 'Tak', color: '#FFD700', freq: 300 },
  { id: 'edge-right', note: 'Tik', color: '#FFD700', freq: 450 },
  { id: 'edge-bottom', note: 'Tak', color: '#FFD700', freq: 300 },
  { id: 'edge-left', note: 'Tik', color: '#FFD700', freq: 450 },
];

export default function VirtualRaban() {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [mode, setMode] = useState<'free' | 'rhythm'>('free');
  const [pattern, setPattern] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [isPlayingPattern, setIsPlayingPattern] = useState(false);
  const [score, setScore] = useState(0);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioCtx.current?.close();
    };
  }, []);

  const playSound = (freq: number) => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.5, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.5);
  };

  const handleZoneClick = (id: string, freq: number) => {
    setActiveZone(id);
    playSound(freq);
    setTimeout(() => setActiveZone(null), 100);

    if (mode === 'rhythm' && !isPlayingPattern) {
      const newUserPattern = [...userPattern, id];
      setUserPattern(newUserPattern);
      
      // Check if correct
      if (newUserPattern[newUserPattern.length - 1] !== pattern[newUserPattern.length - 1]) {
        setMode('free');
        setScore(0);
        alert('Wrong rhythm! Try again.');
        return;
      }

      if (newUserPattern.length === pattern.length) {
        setScore(s => s + 10);
        setTimeout(() => startNextLevel(), 500);
      }
    }
  };

  const startNextLevel = () => {
    const newPattern = [...pattern, RABAN_SOUNDS[Math.floor(Math.random() * RABAN_SOUNDS.length)].id];
    setPattern(newPattern);
    setUserPattern([]);
    playPattern(newPattern);
  };

  const playPattern = async (p: string[]) => {
    setIsPlayingPattern(true);
    for (const id of p) {
      const zone = RABAN_SOUNDS.find(z => z.id === id)!;
      setActiveZone(id);
      playSound(zone.freq);
      await new Promise(r => setTimeout(r, 500));
      setActiveZone(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setIsPlayingPattern(false);
  };

  const startRhythmMode = () => {
    setMode('rhythm');
    setScore(0);
    setPattern([]);
    setUserPattern([]);
    setTimeout(() => startNextLevel(), 500);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#D41922] relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#D41922] font-serif italic mb-2">Virtual Raban</h2>
          <p className="text-gray-500 font-medium">Traditional Drum Simulator</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            {/* Raban Body */}
            <div className="absolute inset-0 rounded-full bg-orange-100 border-8 border-orange-300 shadow-inner" />
            
            {/* Center Zone */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleZoneClick('center', 150)}
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-dashed border-orange-400
                flex items-center justify-center transition-all
                ${activeZone === 'center' ? 'bg-[#D41922] text-white scale-105' : 'bg-orange-50 text-orange-400 hover:bg-orange-100'}
              `}
            >
              <span className="font-black text-2xl font-serif italic">Don</span>
            </motion.button>

            {/* Edge Zones */}
            {RABAN_SOUNDS.filter(z => z.id !== 'center').map((zone, i) => {
              const angles = [270, 0, 90, 180]; // Top, Right, Bottom, Left
              const angle = angles[i];
              return (
                <motion.button
                  key={zone.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleZoneClick(zone.id, zone.freq)}
                  style={{ 
                    transform: `rotate(${angle}deg) translateY(-110px) rotate(-${angle}deg)`,
                    left: 'calc(50% - 32px)',
                    top: 'calc(50% - 32px)'
                  }}
                  className={`
                    absolute w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all
                    ${activeZone === zone.id ? 'bg-[#FFD700] text-gray-800 scale-110' : 'bg-white text-gray-400 border-gray-200 hover:border-orange-300'}
                  `}
                >
                  <span className="font-bold text-sm">{zone.note}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={startRhythmMode}
            disabled={isPlayingPattern}
            className={`
              flex-1 py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-xl transition-all
              ${mode === 'rhythm' ? 'bg-orange-500 text-white' : 'bg-[#D41922] text-white hover:bg-[#B0141B]'}
              ${isPlayingPattern ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {mode === 'rhythm' ? <Music className="animate-bounce" /> : <Play fill="currentColor" />}
            {mode === 'rhythm' ? `Level: ${pattern.length}` : 'Start Rhythm Mode'}
          </button>
          
          {mode === 'rhythm' && (
            <div className="bg-orange-50 px-6 py-4 rounded-2xl border-2 border-orange-100 flex items-center gap-3">
              <Trophy className="text-orange-500" />
              <span className="font-black text-2xl text-orange-600">{score}</span>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {mode === 'free' ? 'Tap the raban to play freely' : isPlayingPattern ? 'Listen to the rhythm...' : 'Repeat the pattern!'}
          </p>
        </div>
      </div>
    </div>
  );
}
