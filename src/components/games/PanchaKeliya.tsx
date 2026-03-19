import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const KAVADI_COUNT = 6;

export default function PanchaKeliya() {
  const [results, setResults] = useState<boolean[]>(Array(KAVADI_COUNT).fill(true));
  const [isRolling, setIsRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const roll = async () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Simulate rolling animation
    const interval = setInterval(() => {
      setResults(Array(KAVADI_COUNT).fill(null).map(() => Math.random() > 0.5));
    }, 100);

    setTimeout(async () => {
      clearInterval(interval);
      const finalResults = Array(KAVADI_COUNT).fill(null).map(() => Math.random() > 0.5);
      setResults(finalResults);
      setIsRolling(false);
      
      const heads = finalResults.filter(r => r).length;
      let points = 0;
      
      // Traditional scoring
      if (heads === 0) points = 12;
      else if (heads === 1) points = 1;
      else if (heads === 2) points = 2;
      else if (heads === 3) points = 3;
      else if (heads === 4) points = 4;
      else if (heads === 5) points = 5;
      else if (heads === 6) points = 6;

      setScore(points);
      setTotalScore(prev => prev + points);
      setHistory(prev => [points, ...prev].slice(0, 5));

      if (totalScore + points > 100) {
        await saveScore(totalScore + points);
      }
    }, 1000);
  };

  const saveScore = async (finalScore: number) => {
    try {
      await supabase.from('leaderboard').insert({
        user_name: 'Guest User',
        score: finalScore,
        game_type: 'Pancha Keliya'
      });
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  const reset = () => {
    setResults(Array(KAVADI_COUNT).fill(true));
    setScore(0);
    setTotalScore(0);
    setHistory([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-orange-400 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-tr-full -z-10 opacity-50" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#D41922] font-serif italic mb-2">Pancha Keliya</h2>
          <p className="text-gray-500 font-medium">Digital Kavadi Rolling Game</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {results.map((isHeads, i) => (
            <motion.div
              key={i}
              animate={isRolling ? { rotateY: 360, scale: [1, 1.2, 1] } : { rotateY: isHeads ? 0 : 180 }}
              transition={isRolling ? { repeat: Infinity, duration: 0.3 } : { type: 'spring', stiffness: 260, damping: 20 }}
              className={`
                w-16 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-bold shadow-lg
                ${isHeads ? 'bg-orange-50 border-orange-400 text-orange-600' : 'bg-gray-800 border-gray-600 text-gray-400'}
              `}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Kavadi Shape */}
                <div className={`w-10 h-16 rounded-full ${isHeads ? 'bg-orange-200' : 'bg-gray-700'} flex flex-col items-center justify-center gap-2`}>
                  {isHeads && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
                  {isHeads && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 text-center">
            <span className="text-sm font-bold text-orange-400 uppercase tracking-widest block mb-1">Last Roll</span>
            <span className="text-4xl font-black text-orange-600">{score}</span>
          </div>
          <div className="bg-[#D41922]/5 p-6 rounded-2xl border-2 border-[#D41922]/10 text-center">
            <span className="text-sm font-bold text-[#D41922]/60 uppercase tracking-widest block mb-1">Total Score</span>
            <span className="text-4xl font-black text-[#D41922]">{totalScore}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={roll}
            disabled={isRolling}
            className={`
              flex-1 py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-xl transition-all
              ${isRolling ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#D41922] text-white hover:bg-[#B0141B] active:scale-95'}
            `}
          >
            {isRolling ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" />}
            {isRolling ? 'Rolling...' : 'Roll Kavadi'}
          </button>
          <button
            onClick={reset}
            className="p-4 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={24} />
          </button>
        </div>

        {history.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Roll History</h4>
            <div className="flex gap-2">
              {history.map((h, i) => (
                <div key={i} className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center font-bold text-gray-400 border border-gray-100">
                  {h}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-orange-500" />
          Scoring Rules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-gray-500">
          <div className="bg-white p-2 rounded-lg shadow-sm">0 Heads = 12 pts</div>
          <div className="bg-white p-2 rounded-lg shadow-sm">1 Head = 1 pt</div>
          <div className="bg-white p-2 rounded-lg shadow-sm">6 Heads = 6 pts</div>
          <div className="bg-white p-2 rounded-lg shadow-sm">Other = # of Heads</div>
        </div>
      </div>
    </div>
  );
}
