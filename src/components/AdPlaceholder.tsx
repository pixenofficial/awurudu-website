import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Info } from 'lucide-react';

interface AdPlaceholderProps {
  type: 'banner' | 'native' | 'interstitial' | 'rewarded';
  className?: string;
}

export default function AdPlaceholder({ type, className }: AdPlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center group transition-all hover:border-orange-200 hover:bg-orange-50/30
        ${type === 'banner' ? 'h-32' : 'h-64'}
        ${className}
      `}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <Info size={10} /> Sponsored
      </div>

      <div className="text-4xl mb-3 opacity-20 group-hover:scale-110 transition-transform">
        {type === 'banner' ? '📢' : type === 'native' ? '🖼️' : '🎁'}
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
          {type} Ad Space
        </h4>
        <p className="text-[10px] text-gray-400 font-medium max-w-[150px] mx-auto">
          Monetag Ad Integration Placeholder
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Learn More <ExternalLink size={10} />
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-200 rounded-tl-xl group-hover:border-orange-200" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-200 rounded-tr-xl group-hover:border-orange-200" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-200 rounded-bl-xl group-hover:border-orange-200" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-200 rounded-br-xl group-hover:border-orange-200" />
    </motion.div>
  );
}
