import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Download, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import AdPlaceholder from '../components/AdPlaceholder';
import { useLanguage } from '../lib/LanguageContext';

const TEMPLATES = [
  { id: 1, name: 'Traditional Red', color: '#D41922', textColor: '#FFD700', bg: 'https://picsum.photos/seed/ny1/800/600' },
  { id: 2, name: 'Golden Festive', color: '#FFD700', textColor: '#D41922', bg: 'https://picsum.photos/seed/ny2/800/600' },
  { id: 3, name: 'Floral White', color: '#FFFFFF', textColor: '#D41922', bg: 'https://picsum.photos/seed/ny3/800/600' },
];

export default function Greetings() {
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();
  const monetagSmartLink = "https://omg10.com/4/10218707";

  const generateCard = () => {
    if (!name) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedTemplate.bg;
    
    img.onload = () => {
      canvas.width = 800;
      canvas.height = 600;
      
      // Draw background
      ctx.drawImage(img, 0, 0, 800, 600);
      
      // Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, 800, 600);
      
      // Text
      ctx.textAlign = 'center';
      ctx.fillStyle = selectedTemplate.textColor;
      
      ctx.font = 'bold 40px serif';
      ctx.fillText(t('happyNewYear'), 400, 250);
      
      ctx.font = 'italic 60px serif';
      ctx.fillText(name, 400, 350);
      
      ctx.font = '24px sans-serif';
      ctx.fillText(t('wishingProsperity'), 400, 420);
      
      setGeneratedImage(canvas.toDataURL('image/png'));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out my New Year Greeting Card! 🌸 ${monetagSmartLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-black text-[#D41922] mb-2 font-serif italic">{t('viralGreetingGenerator')}</h1>
        <p className="text-gray-600">{t('createCustomCard')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{t('yourName')}</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enterName')}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{t('selectTemplate')}</label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    selectedTemplate.id === t.id ? 'border-[#D41922] scale-105' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          </div>

          <button 
            onClick={generateCard}
            disabled={!name}
            className="w-full bg-[#D41922] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#B3151C] transition-colors disabled:opacity-50"
          >
            <Sparkles size={20} />
            {t('generateCard')}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <canvas ref={canvasRef} className="hidden" />
          
          {generatedImage ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 w-full"
            >
              <img src={generatedImage} alt="Generated Card" className="w-full rounded-2xl shadow-2xl border-4 border-white" />
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `NewYearGreeting_${name}.png`;
                    link.href = generatedImage;
                    link.click();
                  }}
                  className="flex-1 bg-white text-[#1A1A1A] py-3 rounded-xl font-bold border-2 border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <Download size={18} />
                  {t('download')}
                </button>
                <button 
                  onClick={shareToWhatsApp}
                  className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors"
                >
                  <Share2 size={18} />
                  {t('whatsapp')}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-medium">
              {t('previewPlaceholder')}
            </div>
          )}
        </div>
      </div>

      <div className="pt-12">
        <AdPlaceholder type="banner" />
      </div>
    </div>
  );
}
