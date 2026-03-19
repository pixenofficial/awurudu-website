import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, RefreshCw, Play, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const FOOD_EMOJIS = ['🥮', '🍪', '🥥', '🍯', '🍚', '🍌', '🥭', '🍍'];
const CARDS = [...FOOD_EMOJIS, ...FOOD_EMOJIS];

export default function MemoryMatch() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      setGameStatus('lost');
    }
  }, [gameStatus, timeLeft]);

  const startGame = () => {
    const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setTimeLeft(60);
    setScore(0);
    setGameStatus('playing');
  };

  const handleCardClick = (index: number) => {
    if (gameStatus !== 'playing' || flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        const newMatched = [...matched, ...newFlipped];
        setMatched(newMatched);
        setFlipped([]);
        setScore(s => s + 200);

        if (newMatched.length === CARDS.length) {
          setGameStatus('won');
          saveScore(score + 200 + timeLeft * 10);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const saveScore = async (finalScore: number) => {
    try {
      await supabase.from('leaderboard').insert({
        user_name: 'Guest User',
        score: finalScore,
        game_type: 'Memory Match'
      });
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#D41922] relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#D41922] font-serif italic mb-2">Memory Match</h2>
          <p className="text-gray-500 font-medium">Match the Avurudu Food Pairs</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-[#D41922] font-bold text-2xl">
            <Timer size={24} />
            <span>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-bold text-2xl">
            <Trophy size={24} />
            <span>Score: {score}</span>
          </div>
        </div>

        {gameStatus === 'idle' ? (
          <div className="flex flex-col items-center justify-center h-80 space-y-6">
            <div className="text-6xl animate-bounce">🥘</div>
            <button
              onClick={startGame}
              className="bg-[#D41922] text-white px-12 py-4 rounded-2xl font-black text-2xl shadow-xl hover:bg-[#B0141B] transition-all flex items-center gap-3"
            >
              <Play fill="currentColor" />
              START GAME
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, i) => {
              const isFlipped = flipped.includes(i) || matched.includes(i);
              const isMatched = matched.includes(i);

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(i)}
                  className={`
                    aspect-square rounded-2xl cursor-pointer transition-all duration-500 preserve-3d relative
                    ${isFlipped ? 'rotate-y-180' : ''}
                  `}
                >
                  {/* Front Side */}
                  <div className={`
                    absolute inset-0 bg-gray-100 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-4xl backface-hidden
                    ${isMatched ? 'bg-green-50 border-green-200' : ''}
                  `}>
                    <span className="text-gray-300 font-black text-2xl">?</span>
                  </div>

                  {/* Back Side */}
                  <div className={`
                    absolute inset-0 bg-white rounded-2xl border-2 border-[#D41922] flex items-center justify-center text-5xl rotate-y-180 backface-hidden
                    ${isMatched ? 'bg-green-50 border-green-200' : ''}
                  `}>
                    {card}
                    {isMatched && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {(gameStatus === 'won' || gameStatus === 'lost') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-8 p-8 rounded-3xl text-center text-white font-bold shadow-xl ${
                gameStatus === 'won' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <h4 className="text-4xl mb-2 font-serif italic">{gameStatus === 'won' ? 'Excellent!' : 'Time Up!'}</h4>
              <p className="text-xl mb-6">Final Score: {score + (gameStatus === 'won' ? timeLeft * 10 : 0)}</p>
              <button 
                onClick={startGame}
                className="bg-white text-gray-800 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={20} />
                PLAY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
          Find all matching pairs before time runs out!
        </div>
      </div>
    </div>
  );
}
