import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, RefreshCw, Play, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function KottaPora() {
  const [player1Taps, setPlayer1Taps] = useState(0);
  const [player2Taps, setPlayer2Taps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [winner, setWinner] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      finishGame();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus, timeLeft]);

  const startGame = () => {
    setPlayer1Taps(0);
    setPlayer2Taps(0);
    setTimeLeft(10);
    setGameStatus('playing');
    setWinner(null);
  };

  const finishGame = async () => {
    setGameStatus('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    
    const win = player1Taps > player2Taps ? 1 : player2Taps > player1Taps ? 2 : 0;
    setWinner(win);

    if (win === 1) {
      await saveScore(player1Taps);
    }
  };

  const saveScore = async (score: number) => {
    try {
      await supabase.from('leaderboard').insert({
        user_name: 'Guest User',
        score: score,
        game_type: 'Kotta Pora'
      });
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  const handleP1Tap = () => {
    if (gameStatus === 'playing') {
      setPlayer1Taps(t => t + 1);
    }
  };

  const handleP2Tap = () => {
    if (gameStatus === 'playing') {
      setPlayer2Taps(t => t + 1);
    }
  };

  const p1Power = (player1Taps / (player1Taps + player2Taps || 1)) * 100;
  const p2Power = (player2Taps / (player1Taps + player2Taps || 1)) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#D41922] relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#D41922] font-serif italic mb-2">Kotta Pora</h2>
          <p className="text-gray-500 font-medium">Digital Pillow Fight Challenge</p>
        </div>

        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2 text-[#D41922] font-bold text-2xl">
            <Timer size={24} />
            <span>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-bold text-2xl">
            <Zap size={24} />
            <span>Total Taps: {player1Taps + player2Taps}</span>
          </div>
        </div>

        {/* Game Arena */}
        <div className="relative h-64 bg-sky-50 rounded-3xl border-2 border-sky-100 overflow-hidden mb-12">
          {/* The Beam */}
          <div className="absolute bottom-16 left-0 right-0 h-4 bg-orange-800 rounded-full shadow-lg" />
          
          {/* Players */}
          <div className="absolute inset-0 flex items-end justify-center gap-32 pb-16">
            <motion.div
              animate={{
                x: (p1Power - 50) * 2,
                rotate: player1Taps % 2 === 0 ? 5 : -5,
                scale: gameStatus === 'playing' ? [1, 1.1, 1] : 1
              }}
              className="relative"
            >
              <div className="text-8xl">🤼</div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md font-bold text-[#D41922]">
                P1: {player1Taps}
              </div>
            </motion.div>

            <motion.div
              animate={{
                x: (50 - p2Power) * 2,
                rotate: player2Taps % 2 === 0 ? -5 : 5,
                scale: gameStatus === 'playing' ? [1, 1.1, 1] : 1
              }}
              className="relative"
            >
              <div className="text-8xl scale-x-[-1]">🤼</div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md font-bold text-blue-600">
                P2: {player2Taps}
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-4 left-8 right-8 h-6 bg-gray-200 rounded-full overflow-hidden flex border-2 border-white shadow-inner">
            <motion.div 
              animate={{ width: `${p1Power}%` }}
              className="h-full bg-[#D41922]"
            />
            <motion.div 
              animate={{ width: `${p2Power}%` }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-8">
          <button
            onMouseDown={handleP1Tap}
            onTouchStart={handleP1Tap}
            disabled={gameStatus !== 'playing'}
            className={`
              py-12 rounded-3xl font-black text-3xl shadow-xl transition-all active:scale-95
              ${gameStatus === 'playing' ? 'bg-[#D41922] text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
            `}
          >
            TAP P1
          </button>
          <button
            onMouseDown={handleP2Tap}
            onTouchStart={handleP2Tap}
            disabled={gameStatus !== 'playing'}
            className={`
              py-12 rounded-3xl font-black text-3xl shadow-xl transition-all active:scale-95
              ${gameStatus === 'playing' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
            `}
          >
            TAP P2
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          {gameStatus === 'idle' ? (
            <button
              onClick={startGame}
              className="bg-orange-500 text-white px-12 py-4 rounded-2xl font-black text-2xl shadow-xl hover:bg-orange-600 transition-all flex items-center gap-3"
            >
              <Play fill="currentColor" />
              START GAME
            </button>
          ) : gameStatus === 'finished' ? (
            <div className="text-center">
              <h3 className="text-4xl font-black text-[#D41922] mb-4 font-serif italic">
                {winner === 0 ? "It's a Draw!" : `Player ${winner} Wins!`}
              </h3>
              <button
                onClick={startGame}
                className="bg-gray-800 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={20} />
                PLAY AGAIN
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-8 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
          Tap as fast as you can for 10 seconds!
        </div>
      </div>
    </div>
  );
}
