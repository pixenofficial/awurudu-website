import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, User, Clock, Star, TrendingUp, Search, Filter, Crown, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  game_name: string;
  score: number;
  created_at: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const games = [
    { id: 'all', name: 'All Games', icon: '🏆' },
    { id: 'Word Search', name: 'Word Search', icon: '🔍' },
    { id: 'Pancha Keliya', name: 'Pancha Keliya', icon: '🎲' },
    { id: 'Virtual Raban', name: 'Virtual Raban', icon: '🥁' },
    { id: 'Kotta Pora', name: 'Kotta Pora', icon: '⚔️' },
    { id: 'Memory Match', name: 'Memory Match', icon: '🎴' },
    { id: 'Avurudu Quiz', name: 'Quiz', icon: '❓' },
    { id: 'Blindfold Elephant', name: 'Blindfold Elephant', icon: '🐘' },
    { id: 'Pot Breaking', name: 'Pot Breaking', icon: '🏺' }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [gameFilter]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);

      if (gameFilter !== 'all') {
        query = query.eq('game_name', gameFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEntries(data || []);
    } catch (e) {
      console.error('Error fetching leaderboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => 
    entry.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topThree = filteredEntries.slice(0, 3);
  const rest = filteredEntries.slice(3);

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase tracking-widest border border-yellow-100"
            >
              <Trophy size={12} /> Global Rankings
            </motion.div>
            <h2 className="text-6xl font-black text-gray-900 font-serif italic tracking-tighter leading-none">
              Hall of <br /> <span className="text-[#D41922]">Fame</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
              Celebrating the champions of our traditional New Year games.
            </p>
          </div>

          {/* Podium Section */}
          {!isLoading && topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end max-w-4xl mx-auto">
              {/* 2nd Place */}
              {topThree[1] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 text-center relative order-2 md:order-1 h-64 flex flex-col justify-center"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400 font-black shadow-lg">
                    2
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gray-50 mx-auto mb-4 flex items-center justify-center text-gray-400">
                    <User size={32} />
                  </div>
                  <h4 className="font-black text-xl text-gray-900 mb-1">{topThree[1].player_name}</h4>
                  <p className="text-[#D41922] font-black text-sm uppercase tracking-widest">{topThree[1].score.toLocaleString()} pts</p>
                </motion.div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 p-10 rounded-[3.5rem] shadow-2xl shadow-red-100 text-center relative order-1 md:order-2 h-80 flex flex-col justify-center border-4 border-[#D41922]"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-[2rem] bg-[#D41922] border-4 border-white flex items-center justify-center text-white font-black shadow-2xl">
                    <Crown size={32} />
                  </div>
                  <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center text-white">
                    <User size={40} />
                  </div>
                  <h4 className="font-black text-2xl text-white mb-2">{topThree[0].player_name}</h4>
                  <p className="text-[#D41922] font-black text-lg uppercase tracking-widest">{topThree[0].score.toLocaleString()} pts</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest mx-auto">
                    {topThree[0].game_name}
                  </div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 text-center relative order-3 h-56 flex flex-col justify-center"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-orange-50 border-2 border-white flex items-center justify-center text-orange-400 font-black shadow-lg">
                    3
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gray-50 mx-auto mb-4 flex items-center justify-center text-gray-400">
                    <User size={32} />
                  </div>
                  <h4 className="font-black text-xl text-gray-900 mb-1">{topThree[2].player_name}</h4>
                  <p className="text-[#D41922] font-black text-sm uppercase tracking-widest">{topThree[2].score.toLocaleString()} pts</p>
                </motion.div>
              )}
            </div>
          )}

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="flex-1 flex flex-wrap gap-2">
              {games.map(game => (
                <button
                  key={game.id}
                  onClick={() => setGameFilter(game.id)}
                  className={cn(
                    "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 border",
                    gameFilter === game.id 
                      ? "bg-[#D41922] border-[#D41922] text-white shadow-xl shadow-red-100" 
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  )}
                >
                  <span className="text-base">{game.icon}</span>
                  {game.name}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D41922] transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search player..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:border-[#D41922] outline-none transition-all font-bold shadow-sm text-sm"
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Player</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Game</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                    {rest.map((entry, index) => (
                      <motion.tr
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.02 }}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-10 py-6">
                          <span className="font-black text-gray-400 text-sm tabular-nums">#{index + 4}</span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#D41922] group-hover:text-white transition-all">
                              <User size={18} />
                            </div>
                            <span className="font-black text-gray-900">{entry.player_name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest group-hover:bg-white transition-colors border border-gray-100">
                            {entry.game_name}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2 text-gray-900">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="font-black text-lg tabular-nums">{entry.score.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 text-gray-400 text-xs font-bold">
                            <Clock size={12} />
                            {new Date(entry.created_at).toLocaleDateString()}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {isLoading && (
              <div className="py-32 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[#D41922] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Loading Rankings...</p>
              </div>
            )}

            {!isLoading && filteredEntries.length === 0 && (
              <div className="py-32 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-4xl grayscale opacity-50">
                  🏜️
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No rankings found</p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-8 group hover:border-[#D41922] transition-colors">
              <div className="w-20 h-20 rounded-[2rem] bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-[#D41922] group-hover:text-white transition-all">
                <TrendingUp size={36} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Players</h4>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">1,284</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-8 group hover:border-[#D41922] transition-colors">
              <div className="w-20 h-20 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-[#D41922] group-hover:text-white transition-all">
                <Star size={36} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Score</h4>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">4,850</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-8 group hover:border-[#D41922] transition-colors">
              <div className="w-20 h-20 rounded-[2rem] bg-green-50 flex items-center justify-center text-green-500 group-hover:bg-[#D41922] group-hover:text-white transition-all">
                <Trophy size={36} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Games Played</h4>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">12,402</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
