import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Star, CheckCircle2, Lock, Sparkles, Zap, Trophy, ChevronRight, X, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DailyRewards() {
  const [streak, setStreak] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const rewards = [
    { day: 1, amount: 100, icon: '🌟', color: 'bg-yellow-50 text-yellow-600' },
    { day: 2, amount: 250, icon: '🔥', color: 'bg-orange-50 text-orange-600' },
    { day: 3, amount: 500, icon: '💎', color: 'bg-blue-50 text-blue-600' },
    { day: 4, amount: 750, icon: '⚡', color: 'bg-purple-50 text-purple-600' },
    { day: 5, amount: 1000, icon: '🏆', color: 'bg-emerald-50 text-emerald-600' },
    { day: 6, amount: 1500, icon: '👑', color: 'bg-indigo-50 text-indigo-600' },
    { day: 7, amount: 5000, icon: '🎁', color: 'bg-red-50 text-red-600' }
  ];

  useEffect(() => {
    const lastClaim = localStorage.getItem('avurudu_last_claim');
    const currentStreak = parseInt(localStorage.getItem('avurudu_streak') || '0');
    
    if (lastClaim === new Date().toDateString()) {
      setClaimedToday(true);
    }
    
    setStreak(currentStreak);
  }, []);

  const handleClaim = () => {
    if (claimedToday) return;

    const newStreak = (streak % 7) + 1;
    const reward = rewards[newStreak - 1].amount;
    
    setRewardAmount(reward);
    setStreak(newStreak);
    setClaimedToday(true);
    setShowReward(true);

    localStorage.setItem('avurudu_last_claim', new Date().toDateString());
    localStorage.setItem('avurudu_streak', newStreak.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-[#D41922] text-[10px] font-black uppercase tracking-widest border border-red-100"
            >
              <Gift size={12} /> Daily Blessings
            </motion.div>
            <h2 className="text-6xl font-black text-gray-900 font-serif italic tracking-tighter leading-none">
              Claim Your <br /> <span className="text-[#D41922]">Rewards</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
              Return every day to unlock special Avurudu surprises and bonuses.
            </p>
          </div>

          <div className="bg-white rounded-[4rem] shadow-2xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
            <div className="p-12 lg:p-20">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-orange-50 flex flex-col items-center justify-center text-orange-500 border-2 border-orange-100 shadow-xl shadow-orange-50">
                    <Zap size={40} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Streak</p>
                    <p className="text-5xl font-black text-gray-900 tracking-tighter">{streak} Days</p>
                  </div>
                </div>

                <div className="flex-1 max-w-md w-full">
                  <button
                    onClick={handleClaim}
                    disabled={claimedToday}
                    className={cn(
                      "w-full py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl",
                      claimedToday 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-[#D41922] text-white hover:bg-gray-900 hover:shadow-red-100 active:scale-95"
                    )}
                  >
                    {claimedToday ? <CheckCircle2 size={24} /> : <Gift size={24} />}
                    {claimedToday ? 'Already Claimed' : 'Claim Today\'s Reward'}
                  </button>
                  {claimedToday && (
                    <p className="text-center mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Come back tomorrow for Day { (streak % 7) + 1 }!
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
                {rewards.map((r, i) => {
                  const isClaimed = i < streak;
                  const isCurrent = i === streak && !claimedToday;
                  const isLocked = i > streak || (i === streak && claimedToday);

                  return (
                    <motion.div
                      key={r.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "relative p-8 rounded-[2.5rem] border-2 text-center transition-all group overflow-hidden",
                        isClaimed ? "bg-green-50 border-green-100 text-green-600" : "",
                        isCurrent ? "bg-white border-[#D41922] text-[#D41922] shadow-2xl shadow-red-50 scale-110 z-10" : "",
                        isLocked ? "bg-gray-50/50 border-transparent text-gray-300 opacity-60" : "bg-white border-gray-100 text-gray-500"
                      )}
                    >
                      {isCurrent && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D41922]" />
                      )}
                      
                      <div className="text-[10px] font-black uppercase tracking-widest mb-4">Day {r.day}</div>
                      <div className={cn(
                        "text-4xl mb-4 transition-transform group-hover:scale-125 duration-500",
                        isLocked ? "grayscale" : ""
                      )}>{r.icon}</div>
                      <div className="font-black text-xl tracking-tighter">+{r.amount}</div>
                      
                      {isClaimed && (
                        <div className="absolute top-4 right-4 text-green-500">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-20 p-10 rounded-[3.5rem] bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer hover:bg-gray-800 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D41922] rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                
                <div className="flex items-center gap-8 relative z-10">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-yellow-400 shadow-2xl">
                    <Trophy size={36} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black font-serif italic mb-1">Weekly Grand Prize</h4>
                    <p className="text-white/60 font-medium">Complete a 7-day streak to unlock the <span className="text-yellow-400 font-bold">Golden Raban</span> achievement!</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Progress</p>
                    <p className="text-xl font-black">{streak}/7 Days</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-[#D41922] transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Animation Modal */}
      <AnimatePresence>
        {showReward && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReward(false)}
              className="absolute inset-0 bg-gray-900/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="relative bg-white p-16 rounded-[4rem] shadow-2xl text-center max-w-md w-full overflow-hidden border border-gray-100"
            >
              {/* Confetti Effect (CSS) */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      backgroundColor: ['#D41922', '#F97316', '#EAB308', '#22C55E'][Math.floor(Math.random() * 4)],
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 space-y-8">
                <div className="w-40 h-40 mx-auto bg-red-50 rounded-[3rem] flex items-center justify-center text-7xl mb-4 shadow-inner border-2 border-red-100 rotate-12">
                  🎁
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-gray-900 font-serif italic tracking-tighter leading-none">Congratulations!</h3>
                  <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">You've unlocked a daily blessing</p>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-6xl font-black text-[#D41922] tracking-tighter">
                  <Star size={48} className="fill-current text-yellow-400" />
                  {rewardAmount}
                </div>

                <button
                  onClick={() => setShowReward(false)}
                  className="w-full py-6 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-gray-800 active:scale-95 transition-all"
                >
                  Collect Reward
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
