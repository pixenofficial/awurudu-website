import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Sparkles, Zap } from 'lucide-react';

interface SmartLinkProps {
  href: string;
  label: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function SmartLink({ href, label, className, variant = 'primary' }: SmartLinkProps) {
  const baseStyles = "relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all active:scale-95 group overflow-hidden shadow-xl";
  
  const variants = {
    primary: "bg-[#D41922] text-white hover:bg-[#B0141B] shadow-[#D41922]/20",
    secondary: "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20",
    ghost: "bg-white/10 backdrop-blur-md text-white border-2 border-white/20 hover:bg-white/20"
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Icon Left */}
      <Sparkles size={20} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
      
      {/* Label */}
      <span className="relative z-10 tracking-tight">{label}</span>
      
      {/* Icon Right */}
      <div className="relative flex items-center justify-center">
        <Zap size={18} className="absolute text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 blur-[2px]" />
        <ExternalLink size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>

      {/* Particle Effects (CSS only) */}
      <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping delay-75" />
    </motion.a>
  );
}
