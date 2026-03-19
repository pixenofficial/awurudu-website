import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, Share2, Palette, Type, Image as ImageIcon, CheckCircle2, RefreshCw, Heart, Sun, Moon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export default function GreetingCard() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [message, setMessage] = useState(t('wishingProsperousJoyful'));
  const [theme, setTheme] = useState('Gold');
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Update message when language changes if it's the default one
  useEffect(() => {
    setMessage(t('wishingProsperousJoyful'));
  }, [t]);

  const themes = [
    { name: 'Gold', bg: 'bg-[#FFD700]', text: 'text-[#D41922]', accent: 'bg-[#D41922]', border: 'border-[#D41922]', icon: <Sun size={24} /> },
    { name: 'Red', bg: 'bg-[#D41922]', text: 'text-white', accent: 'bg-orange-400', border: 'border-white', icon: <Heart size={24} /> },
    { name: 'Orange', bg: 'bg-orange-500', text: 'text-white', accent: 'bg-[#D41922]', border: 'border-white', icon: <Sparkles size={24} /> },
    { name: 'White', bg: 'bg-white', text: 'text-[#D41922]', accent: 'bg-orange-400', border: 'border-[#D41922]', icon: <Moon size={24} /> }
  ];

  const currentTheme = themes.find(t => t.name === theme) || themes[0];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `avurudu_greeting_${name || 'friend'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Error generating card:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left: Controls */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-[#D41922] text-[10px] font-black uppercase tracking-widest border border-red-100">
                  <ImageIcon size={12} /> {t('greetingCardGenerator')}
                </div>
                <h2 className="text-6xl font-black text-gray-900 font-serif italic tracking-tighter leading-none">
                  {t('spreadJoy').split(' ')[0]} <br /> <span className="text-[#D41922]">{t('spreadJoy').split(' ').slice(1).join(' ')}</span>
                </h2>
                <p className="text-gray-500 font-medium text-lg max-w-sm">
                  {t('createPersonalizedWishes')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('recipientName')}</label>
                  <div className="relative group">
                    <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D41922] transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder={t('enterNameOptional')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-2xl focus:border-[#D41922] outline-none transition-all font-bold shadow-sm text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('yourMessage')}</label>
                  <textarea
                    rows={3}
                    placeholder={t('enterYourMessage')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-6 py-5 bg-white border border-gray-100 rounded-2xl focus:border-[#D41922] outline-none transition-all font-bold shadow-sm resize-none text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('selectTheme')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map(t_item => (
                      <button
                        key={t_item.name}
                        onClick={() => setTheme(t_item.name)}
                        className={cn(
                          "p-4 rounded-2xl font-black transition-all border-2 flex items-center justify-between group",
                          theme === t_item.name 
                            ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200" 
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-6 h-6 rounded-lg", t_item.bg, "border border-gray-100")} />
                          <span className="text-xs uppercase tracking-widest">{t_item.name}</span>
                        </div>
                        {theme === t_item.name && <CheckCircle2 size={16} className="text-[#D41922]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className={cn(
                      "flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all",
                      isGenerating 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-[#D41922] text-white hover:bg-gray-900 hover:shadow-red-100 active:scale-95"
                    )}
                  >
                    {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
                    {isGenerating ? t('generating') : t('downloadCard')}
                  </button>
                  <button
                    className="w-16 h-16 bg-white border border-gray-100 text-gray-900 rounded-2xl flex items-center justify-center shadow-xl hover:bg-gray-50 transition-all active:scale-95"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-7 sticky top-32">
              <div className="relative group">
                {/* Decorative Elements */}
                <div className="absolute -inset-8 bg-red-50 rounded-[5rem] -rotate-3 -z-10 opacity-50" />
                <div className="absolute -inset-8 bg-orange-50 rounded-[5rem] rotate-2 -z-10 opacity-50" />
                
                <div 
                  ref={cardRef}
                  className={cn(
                    "aspect-[4/5] w-full max-w-md mx-auto rounded-[4rem] shadow-2xl overflow-hidden p-16 flex flex-col items-center justify-center text-center relative border-[16px] transition-all duration-500",
                    currentTheme.bg, currentTheme.text, currentTheme.border
                  )}
                >
                  {/* Traditional Motifs */}
                  <div className="absolute top-12 left-12 w-20 h-20 border-t-4 border-l-4 rounded-tl-[2rem] opacity-20" />
                  <div className="absolute top-12 right-12 w-20 h-20 border-t-4 border-r-4 rounded-tr-[2rem] opacity-20" />
                  <div className="absolute bottom-12 left-12 w-20 h-20 border-b-4 border-l-4 rounded-bl-[2rem] opacity-20" />
                  <div className="absolute bottom-12 right-12 w-20 h-20 border-b-4 border-r-4 rounded-br-[2rem] opacity-20" />

                  {/* Content */}
                  <motion.div
                    key={theme}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-10 relative z-10"
                  >
                    <div className={cn(
                      "w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 rotate-12",
                      currentTheme.accent, "text-white"
                    )}>
                      {currentTheme.icon}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-5xl font-black font-serif italic leading-none tracking-tighter">
                        {t('subhaAluthAvuruddak')}
                      </h3>
                      {name && (
                        <p className="text-xl font-black uppercase tracking-[0.2em] opacity-70">
                          {t('dear')} {name}
                        </p>
                      )}
                    </div>

                    <div className="w-12 h-1 bg-current mx-auto opacity-20 rounded-full" />

                    <p className="text-xl font-medium leading-relaxed italic opacity-90 px-4">
                      "{message}"
                    </p>

                    <div className="pt-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50">
                        {t('appName')} 2026
                      </p>
                    </div>
                  </motion.div>

                  {/* Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]" />
                </div>

                <div className="mt-10 flex items-center justify-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={14} className="text-yellow-400" />
                  {t('livePreviewMode')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
