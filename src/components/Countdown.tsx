import { useEffect, useState } from 'react';
import { getCountdown } from '../lib/utils';
import { motion } from 'motion/react';

export default function Countdown({ targetDate, title }: { targetDate: string; title: string }) {
  const [timeLeft, setTimeLeft] = useState(getCountdown(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getCountdown(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl border-2 border-[#D41922]">
        <h2 className="text-2xl font-bold text-[#D41922] mb-2">{title}</h2>
        <p className="text-gray-600 font-medium">The auspicious time has arrived!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-[#D41922] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FFD700]"></div>
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 text-center uppercase tracking-widest">{title}</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-4xl font-black text-[#D41922] font-mono"
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">{label}</span>
    </div>
  );
}
