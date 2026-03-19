import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Sun, Moon, Sparkles, Info, ChevronRight, Bell, BellOff, Share2, MapPin, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

interface Nakath {
  id: string;
  title: string;
  time: string;
  description: string;
  category: string;
  direction?: string;
  color?: string;
}

export default function AuspiciousTimes() {
  const { t, language } = useLanguage();
  const [nakathList, setNakathList] = useState<Nakath[]>([]);
  const [selected, setSelected] = useState<Nakath | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNakath();
    const saved = localStorage.getItem('avurudu_notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  const fetchNakath = async () => {
    try {
      const { data, error } = await supabase
        .from('auspicious_times')
        .select('*')
        .order('time', { ascending: true });
      if (error) throw error;
      
      // Add default direction/color if missing
      const enrichedData = (data || []).map(n => ({
        ...n,
        direction: n.direction || t('north'),
        color: n.color || t('white')
      }));

      setNakathList(enrichedData);
      if (enrichedData?.[0]) setSelected(enrichedData[0]);
    } catch (e) {
      console.error('Error fetching nakath:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = (id: string) => {
    const newNotifs = notifications.includes(id)
      ? notifications.filter(n => n !== id)
      : [...notifications, id];
    setNotifications(newNotifs);
    localStorage.setItem('avurudu_notifications', JSON.stringify(newNotifs));
  };

  const handleShare = (nakath: Nakath) => {
    if (navigator.share) {
      navigator.share({
        title: `Avurudu Nakath: ${nakath.title}`,
        text: `${nakath.title} at ${nakath.time}. ${nakath.description}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: List */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-[#D41922] text-[10px] font-black uppercase tracking-widest border border-red-100">
                  <Clock size={12} /> {t('nakathList2026')}
                </div>
                <h2 className="text-6xl font-black text-gray-900 font-serif italic tracking-tighter leading-none">
                  {t('auspicious')} <br /> <span className="text-[#D41922]">{t('times')}</span>
                </h2>
                <p className="text-gray-500 font-medium text-lg max-w-sm">
                  {t('planNewYear')}
                </p>
              </div>

              <div className="space-y-3">
                {nakathList.map((n, i) => (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(n)}
                    className={cn(
                      "w-full p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group relative overflow-hidden",
                      selected?.id === n.id 
                        ? "bg-white border-[#D41922] shadow-xl shadow-red-100" 
                        : "bg-white/50 border-transparent hover:bg-white hover:border-gray-200"
                    )}
                  >
                    {selected?.id === n.id && (
                      <motion.div 
                        layoutId="active-nakath-bg"
                        className="absolute inset-0 bg-red-50/30 -z-10"
                      />
                    )}
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                        selected?.id === n.id ? "bg-[#D41922] text-white rotate-6" : "bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-[#D41922]"
                      )}>
                        <Clock size={24} />
                      </div>
                      <div>
                        <h4 className={cn(
                          "font-black text-xl transition-colors",
                          selected?.id === n.id ? "text-gray-900" : "text-gray-500"
                        )}>{n.title}</h4>
                        <p className="text-xs font-black uppercase tracking-widest text-[#D41922]">
                          {n.time}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className={cn(
                      "transition-all",
                      selected?.id === n.id ? "text-[#D41922] translate-x-1" : "text-gray-300"
                    )} />
                  </motion.button>
                ))}

                {isLoading && (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-full h-24 bg-white/50 animate-pulse rounded-3xl border-2 border-transparent" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[3rem] shadow-2xl shadow-red-100/50 border border-gray-100 overflow-hidden sticky top-32"
                  >
                    <div className="relative h-64 bg-gray-900 flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://picsum.photos/seed/tradition/1200/800" 
                        alt="Tradition" 
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                      
                      <div className="relative z-10 text-center px-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-4 border border-white/20">
                          <Sparkles size={14} className="text-yellow-400" /> {selected.category}
                        </div>
                        <h3 className="text-5xl font-black text-white font-serif italic tracking-tight">{selected.title}</h3>
                      </div>

                      <div className="absolute bottom-6 right-6 flex gap-2">
                        <button 
                          onClick={() => handleShare(selected)}
                          className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all"
                        >
                          <Share2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="p-12">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-[2rem] bg-red-50 flex flex-col items-center justify-center text-[#D41922] border-2 border-red-100 shadow-lg shadow-red-50">
                            <Clock size={40} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('auspiciousTime')}</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{selected.time}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleNotification(selected.id)}
                          className={cn(
                            "px-10 py-5 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl text-sm uppercase tracking-widest",
                            notifications.includes(selected.id) 
                              ? "bg-green-500 text-white hover:bg-green-600 shadow-green-100" 
                              : "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-200"
                          )}
                        >
                          {notifications.includes(selected.id) ? <Bell size={20} /> : <BellOff size={20} />}
                          {notifications.includes(selected.id) ? t('reminderSet') : t('remindMe')}
                        </button>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 relative">
                          <div className="absolute -top-3 left-8 px-4 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {t('instructions')}
                          </div>
                          <p className="text-gray-600 font-medium leading-relaxed text-xl">
                            {selected.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-8 rounded-3xl bg-white border border-gray-100 flex items-center gap-5 group hover:border-[#D41922] transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-[#D41922] group-hover:text-white transition-all">
                              <MapPin size={24} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('direction')}</p>
                              <p className="font-black text-gray-900 text-lg">{selected.direction}</p>
                            </div>
                          </div>
                          <div className="p-8 rounded-3xl bg-white border border-gray-100 flex items-center gap-5 group hover:border-[#D41922] transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-[#D41922] group-hover:text-white transition-all">
                              <Palette size={24} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('color')}</p>
                              <p className="font-black text-gray-900 text-lg">{selected.color}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center py-32">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-4xl grayscale opacity-50">
                        🏮
                      </div>
                      <p className="text-gray-400 font-black uppercase tracking-widest text-sm">
                        {t('selectNakathDetails')}
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
