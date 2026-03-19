import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, Sparkles, Zap, Star, TrendingUp, ChevronRight } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target: April 14, 2026, 00:00:00
    const targetDate = new Date('2026-04-14T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: '📅' },
    { label: 'Hours', value: timeLeft.hours, icon: '⏰' },
    { label: 'Minutes', value: timeLeft.minutes, icon: '⏳' },
    { label: 'Seconds', value: timeLeft.seconds, icon: '🔥' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl border-2 border-gray-100 overflow-hidden">
        <div className="bg-[#D41922] p-12 text-center text-white relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="grid grid-cols-10 gap-4 p-4">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rounded-full" />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6"
            >
              <Clock size={14} /> Countdown to Avurudu
            </motion.div>
            <h2 className="text-5xl font-black font-serif italic mb-4">The New Year Awaits</h2>
            <p className="text-white/70 font-medium max-w-md mx-auto">
              Get ready for the most auspicious time of the year!
            </p>
          </div>
        </div>

        <div className="p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {timeUnits.map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 rounded-[2.5rem] border-2 border-gray-100 text-center transition-all group hover:border-orange-200 hover:bg-orange-50/30"
              >
                <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">{unit.label}</div>
                <div className="text-5xl font-black text-[#D41922] tabular-nums mb-4 group-hover:scale-110 transition-transform">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">{unit.icon}</div>
                
                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-[2.5rem] bg-gray-50 border-2 border-gray-100 flex items-center justify-between group cursor-pointer hover:border-orange-200 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#D41922] shadow-sm">
                <Sparkles size={28} />
              </div>
              <div>
                <h4 className="text-lg font-black text-gray-800">Special Avurudu Events</h4>
                <p className="text-gray-500 text-sm font-medium">Join our live events starting from April 13th!</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-[#D41922] group-hover:translate-x-1 transition-all" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
