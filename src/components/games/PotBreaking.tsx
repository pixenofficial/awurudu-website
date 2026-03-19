import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Zap, Coins } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const POT_COUNT = 5;

export default function PotBreaking() {
  const [pots, setPots] = useState<{ id: number; x: number; y: number; hasReward: boolean; isBroken: boolean }[]>([]);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      setGameStatus('finished');
      saveScore(score);
    }
  }, [gameStatus, timeLeft]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(() => {
        setPots(prev => prev.map(pot => ({
          ...pot,
          x: Math.max(10, Math.min(90, pot.x + (Math.random() - 0.5) * 10)),
          y: Math.max(10, Math.min(90, pot.y + (Math.random() - 0.5) * 10))
        })));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [gameStatus]);

  const startGame = () => {
    const newPots = Array(POT_COUNT).fill(null).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      hasReward: Math.random() > 0.7,
      isBroken: false
    }));
    setPots(newPots);
    setScore(0);
    setTimeLeft(30);
    setGameStatus('playing');
  };

  const handlePotClick = (id: number) => {
    if (gameStatus !== 'playing') return;
    
    setPots(prev => prev.map(pot => {
      if (pot.id === id && !pot.isBroken) {
        if (pot.hasReward) {
          setScore(s => s + 500);
        } else {
          setScore(s => s + 50);
        }
        return { ...pot, isBroken: true };
      }
      return pot;
    }));

    // Check if all pots are broken
    if (pots.every(p => p.id === id ? true : p.isBroken)) {
      // Respawn pots
      setTimeout(() => {
        const newPots = Array(POT_COUNT).fill(null).map((_, i) => ({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          hasReward: Math.random() > 0.7,
          isBroken: false
        }));
        setPots(newPots);
      }, 500);
    }
  };

  const saveScore = async (finalScore: number) => {
    try {
      await supabase.from('leaderboard').insert({
        user_name: 'Guest User',
        score: finalScore,
        game_type: 'Pot Breaking'
      });
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#D41922] relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#D41922] font-serif italic mb-2">Kana Mutti Bindeema</h2>
          <p className="text-gray-500 font-medium">Digital Pot Breaking Challenge</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-[#D41922] font-bold text-2xl">
            <Zap size={24} />
            <span>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-bold text-2xl">
            <Trophy size={24} />
            <span>Score: {score}</span>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="relative h-96 bg-sky-50 rounded-3xl border-4 border-sky-100 overflow-hidden shadow-inner"
        >
          {gameStatus === 'idle' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startGame}
                className="bg-[#D41922] text-white px-12 py-4 rounded-2xl font-black text-2xl shadow-xl hover:bg-[#B0141B] transition-all flex items-center gap-3"
              >
                <Play fill="currentColor" />
                START GAME
              </button>
            </div>
          ) : (
            <>
              {pots.map(pot => (
                <motion.div
                  key={pot.id}
                  animate={{ left: `${pot.x}%`, top: `${pot.y}%` }}
                  transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                  onClick={() => handlePotClick(pot.id)}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all
                    ${pot.isBroken ? 'opacity-0 scale-150 pointer-events-none' : 'hover:scale-110'}
                  `}
                >
                  <div className="text-6xl filter drop-shadow-lg">🏺</div>
                  {pot.isBroken && pot.hasReward && (
                    <motion.div 
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -50 }}
                      className="absolute top-0 left-0 text-3xl font-black text-orange-500"
                    >
                      <Coins size={32} className="animate-bounce" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </>
          )}
        </div>

        <AnimatePresence>
          {gameStatus === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-8 bg-orange-50 rounded-3xl border-2 border-orange-100 text-center"
            >
              <h4 className="text-4xl font-black text-orange-600 mb-2 font-serif italic">Time Up!</h4>
              <p className="text-xl text-orange-400 mb-6 font-bold uppercase tracking-widest">
                Final Score: {score}
              </p>
              <button 
                onClick={startGame}
                className="bg-[#D41922] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#B0141B] transition-all flex items-center gap-2 mx-auto shadow-lg"
              >
                <RefreshCw size={20} />
                PLAY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
          Break the pots to find rewards! Some pots have more points!
        </div>
      </div>
    </div>
  );
}
