import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, RefreshCw, Play, Eye, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ELEPHANT_IMAGE = 'https://picsum.photos/seed/elephant/800/600';
const EYE_POS = { x: 0.65, y: 0.35 }; // Normalized coordinates (0-1)

export default function BlindfoldElephant() {
  const [gameStatus, setGameStatus] = useState<'idle' | 'memorizing' | 'guessing' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState(5);
  const [guess, setGuess] = useState<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameStatus === 'memorizing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameStatus === 'memorizing') {
      setGameStatus('guessing');
    }
  }, [gameStatus, timeLeft]);

  const startGame = () => {
    setGameStatus('memorizing');
    setTimeLeft(5);
    setGuess(null);
    setScore(0);
  };

  const handleGuess = async (e: React.MouseEvent | React.TouchEvent) => {
    if (gameStatus !== 'guessing' || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    setGuess({ x, y });
    setGameStatus('finished');

    // Calculate distance
    const dist = Math.sqrt(Math.pow(x - EYE_POS.x, 2) + Math.pow(y - EYE_POS.y, 2));
    const calculatedScore = Math.max(0, Math.round((1 - dist) * 1000));
    setScore(calculatedScore);

    await saveScore(calculatedScore);
  };

  const saveScore = async (finalScore: number) => {
    try {
      await supabase.from('leaderboard').insert({
        user_name: 'Guest User',
        score: finalScore,
        game_type: 'Blindfold Elephant'
      });
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#D41922] relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#D41922] font-serif italic mb-2">Aliyata Aha Thabeema</h2>
          <p className="text-gray-500 font-medium">Blindfold Elephant Eye Challenge</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-[#D41922] font-bold text-2xl">
            <Timer size={24} />
            <span>{gameStatus === 'memorizing' ? timeLeft : 0}s</span>
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-bold text-2xl">
            <Trophy size={24} />
            <span>Score: {score}</span>
          </div>
        </div>

        <div 
          ref={containerRef}
          onClick={handleGuess}
          className={`
            relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-gray-100 shadow-inner cursor-crosshair
            ${gameStatus === 'idle' ? 'bg-gray-50 flex items-center justify-center' : ''}
          `}
        >
          {gameStatus === 'idle' ? (
            <button
              onClick={startGame}
              className="bg-[#D41922] text-white px-12 py-4 rounded-2xl font-black text-2xl shadow-xl hover:bg-[#B0141B] transition-all flex items-center gap-3"
            >
              <Play fill="currentColor" />
              START GAME
            </button>
          ) : (
            <>
              <img 
                src={ELEPHANT_IMAGE} 
                alt="Elephant"
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  gameStatus === 'guessing' ? 'blur-3xl grayscale brightness-50' : ''
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Correct Eye Position (only visible during memorizing or finished) */}
              {(gameStatus === 'memorizing' || gameStatus === 'finished') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ 
                    left: `${EYE_POS.x * 100}%`, 
                    top: `${EYE_POS.y * 100}%` 
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-500/50 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                >
                  <Eye size={16} className="text-white" />
                </motion.div>
              )}

              {/* User's Guess */}
              {guess && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ 
                    left: `${guess.x * 100}%`, 
                    top: `${guess.y * 100}%` 
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500/50 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                >
                  <Target size={16} className="text-white" />
                </motion.div>
              )}

              {/* Connection Line */}
              {guess && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line 
                    x1={`${EYE_POS.x * 100}%`} 
                    y1={`${EYE_POS.y * 100}%`} 
                    x2={`${guess.x * 100}%`} 
                    y2={`${guess.y * 100}%`} 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeDasharray="4"
                  />
                </svg>
              )}
            </>
          )}
        </div>

        <AnimatePresence>
          {gameStatus === 'finished' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-8 bg-orange-50 rounded-3xl border-2 border-orange-100 text-center"
            >
              <h4 className="text-4xl font-black text-orange-600 mb-2 font-serif italic">
                {score > 800 ? 'Perfect!' : score > 500 ? 'Great Job!' : 'Nice Try!'}
              </h4>
              <p className="text-xl text-orange-400 mb-6 font-bold uppercase tracking-widest">
                Accuracy Score: {score}
              </p>
              <button 
                onClick={startGame}
                className="bg-[#D41922] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#B0141B] transition-all flex items-center gap-2 mx-auto shadow-lg"
              >
                <RefreshCw size={20} />
                TRY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
          {gameStatus === 'memorizing' ? 'Memorize the eye position!' : gameStatus === 'guessing' ? 'Tap where the eye should be!' : 'Ready to try again?'}
        </div>
      </div>
    </div>
  );
}
