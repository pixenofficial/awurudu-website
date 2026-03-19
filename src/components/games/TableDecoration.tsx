import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Download, Share2, Trash2, Plus, Minus, RotateCcw, RotateCw, Sparkles, Camera, Heart, Info, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { cn } from '../../lib/utils';

const FOOD_ITEMS = [
  { id: 'kavum', emoji: '🥮', label: 'Kavum', category: 'Sweets' },
  { id: 'kokis', emoji: '🍪', label: 'Kokis', category: 'Sweets' },
  { id: 'aluwa', emoji: '🥥', label: 'Aluwa', category: 'Sweets' },
  { id: 'asmi', emoji: '🍯', label: 'Asmi', category: 'Sweets' },
  { id: 'mun_kevum', emoji: '🥟', label: 'Mun Kavum', category: 'Sweets' },
  { id: 'kiribath', emoji: '🍚', label: 'Kiribath', category: 'Main' },
  { id: 'lunu_miris', emoji: '🌶️', label: 'Lunu Miris', category: 'Main' },
  { id: 'banana', emoji: '🍌', label: 'Banana', category: 'Fruit' },
  { id: 'mango', emoji: '🥭', label: 'Mango', category: 'Fruit' },
  { id: 'pineapple', emoji: '🍍', label: 'Pineapple', category: 'Fruit' },
  { id: 'oil_lamp', emoji: '🪔', label: 'Pana', category: 'Decor' },
  { id: 'flowers', emoji: '🌸', label: 'Flowers', category: 'Decor' },
  { id: 'betel', emoji: '🍃', label: 'Bulath', category: 'Decor' },
];

const TABLE_CLOTHS = [
  { id: 'white', color: 'bg-white', pattern: 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]' },
  { id: 'red', color: 'bg-red-50', pattern: 'bg-[url("https://www.transparenttextures.com/patterns/diagonal-stripes.png")]' },
  { id: 'gold', color: 'bg-yellow-50', pattern: 'bg-[url("https://www.transparenttextures.com/patterns/luxury.png")]' },
  { id: 'floral', color: 'bg-orange-50', pattern: 'bg-[url("https://www.transparenttextures.com/patterns/flower-trail.png")]' },
];

interface PlacedItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export default function TableDecoration() {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tableCloth, setTableCloth] = useState(TABLE_CLOTHS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleAddItem = (item: typeof FOOD_ITEMS[0]) => {
    const id = `${item.id}-${Date.now()}`;
    const newItem: PlacedItem = {
      id,
      emoji: item.emoji,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setPlacedItems([...placedItems, newItem]);
    setSelectedId(id);
  };

  const handleRemoveItem = (id: string) => {
    setPlacedItems(placedItems.filter(item => item.id !== id));
    setSelectedId(null);
  };

  const handleDragEnd = (id: string, info: any) => {
    if (!tableRef.current) return;
    const rect = tableRef.current.getBoundingClientRect();
    
    // Calculate relative position within the table
    const x = ((info.point.x - rect.left) / rect.width) * 100;
    const y = ((info.point.y - rect.top) / rect.height) * 100;
    
    setPlacedItems(prev => prev.map(item => 
      item.id === id ? { ...item, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : item
    ));
  };

  const handleScale = (id: string, delta: number) => {
    setPlacedItems(prev => prev.map(item => 
      item.id === id ? { ...item, scale: Math.max(0.5, Math.min(3, item.scale + delta)) } : item
    ));
  };

  const handleRotate = (id: string, delta: number) => {
    setPlacedItems(prev => prev.map(item => 
      item.id === id ? { ...item, rotation: item.rotation + delta } : item
    ));
  };

  const handleSaveImage = async () => {
    if (!tableRef.current) return;
    setIsGenerating(true);
    setSelectedId(null); // Deselect for clean capture
    
    try {
      // Small delay to ensure selection ring is gone
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        backgroundColor: '#8B4513',
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `avurudu_table_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Error saving table image:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!tableRef.current) return;
    setIsGenerating(true);
    setSelectedId(null);
    
    try {
      const canvas = await html2canvas(tableRef.current, { scale: 1.5 });
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      
      if (blob && navigator.share) {
        const file = new File([blob], 'avurudu_table.png', { type: 'image/png' });
        await navigator.share({
          title: 'My Avurudu Table',
          text: 'Check out my decorated Avurudu table!',
          files: [file]
        });
      } else {
        // Fallback: just download
        handleSaveImage();
      }
    } catch (e) {
      console.error('Error sharing table:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedItem = placedItems.find(item => item.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Panel: Assets & Controls */}
        <div className="w-full lg:w-80 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#D41922] font-serif italic">Assets</h3>
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Info size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {['Sweets', 'Main', 'Fruit', 'Decor'].map(category => (
                <div key={category}>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">{category}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {FOOD_ITEMS.filter(item => item.category === category).map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleAddItem(item)}
                        className="aspect-square flex flex-col items-center justify-center bg-gray-50 rounded-2xl hover:bg-orange-50 hover:scale-105 border-2 border-transparent hover:border-orange-200 transition-all group"
                        title={item.label}
                      >
                        <span className="text-3xl group-hover:rotate-12 transition-transform">{item.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-2">Table Cloth</h4>
            <div className="flex gap-4">
              {TABLE_CLOTHS.map(cloth => (
                <button
                  key={cloth.id}
                  onClick={() => setTableCloth(cloth)}
                  className={cn(
                    "w-12 h-12 rounded-xl border-4 transition-all overflow-hidden relative",
                    tableCloth.id === cloth.id ? "border-[#D41922] scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <div className={cn("absolute inset-0", cloth.color)} />
                  <div className={cn("absolute inset-0 opacity-20", cloth.pattern)} />
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedId && selectedItem && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-blue-100 p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Item Controls</h4>
                  <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase text-center">Scale</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleScale(selectedId, -0.2)} className="flex-1 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100"><Minus size={16} /></button>
                      <button onClick={() => handleScale(selectedId, 0.2)} className="flex-1 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase text-center">Rotate</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleRotate(selectedId, -15)} className="flex-1 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100"><RotateCcw size={16} /></button>
                      <button onClick={() => handleRotate(selectedId, 15)} className="flex-1 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100"><RotateCw size={16} /></button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemoveItem(selectedId)}
                  className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} /> Remove Item
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: The Table */}
        <div className="flex-1 space-y-8">
          <div className="relative group">
            {/* Table Shadow/Glow */}
            <div className="absolute -inset-4 bg-black/10 blur-3xl rounded-[5rem] -z-10" />
            
            <div 
              ref={tableRef}
              className="relative aspect-[16/9] bg-[#5D2E0C] rounded-[4rem] border-[2rem] border-[#4A250A] shadow-inner overflow-hidden"
            >
              {/* Table Cloth */}
              <div className={cn(
                "absolute inset-4 rounded-[3rem] shadow-inner transition-all duration-500",
                tableCloth.color
              )}>
                <div className={cn("absolute inset-0 opacity-20", tableCloth.pattern)} />
                <div className="absolute inset-0 border-4 border-dashed border-black/5 rounded-[2.8rem]" />
              </div>
              
              {/* Placed Items */}
              {placedItems.map((item) => (
                <motion.div
                  key={item.id}
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => handleDragEnd(item.id, info)}
                  onMouseDown={() => setSelectedId(item.id)}
                  initial={false}
                  animate={{ 
                    left: `${item.x}%`, 
                    top: `${item.y}%`,
                    scale: item.scale,
                    rotate: item.rotation
                  }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 cursor-move select-none transition-shadow",
                    selectedId === item.id ? "z-50" : "z-10"
                  )}
                >
                  <div className={cn(
                    "relative group/item",
                    selectedId === item.id && "after:absolute after:-inset-4 after:border-2 after:border-blue-400 after:border-dashed after:rounded-full after:animate-spin-slow"
                  )}>
                    <span className="text-7xl sm:text-8xl filter drop-shadow-2xl block group-hover/item:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {placedItems.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-black/5 pointer-events-none"
                  >
                    <div className="text-center space-y-4">
                      <div className="text-[12rem] opacity-20">🍽️</div>
                      <p className="text-3xl font-black font-serif italic uppercase tracking-[0.3em]">Decorate Your Table</p>
                      <p className="text-sm font-bold opacity-40">Drag items from the side to begin</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Help Overlay */}
            <AnimatePresence>
              {showHelp && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-12 left-12 right-12 bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white z-[60] text-center"
                >
                  <button 
                    onClick={() => setShowHelp(false)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
                  >
                    <X size={20} />
                  </button>
                  <Sparkles className="mx-auto text-orange-400 mb-4" size={32} />
                  <h5 className="text-xl font-black text-gray-900 mb-2">How to Play</h5>
                  <p className="text-gray-500 font-medium max-w-md mx-auto">
                    Click an item to add it to the table. Drag items to move them. 
                    Select an item to resize or rotate it using the controls.
                  </p>
                  <button 
                    onClick={() => setShowHelp(false)}
                    className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
                  >
                    Got it!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            <button 
              onClick={handleSaveImage}
              disabled={isGenerating || placedItems.length === 0}
              className="bg-[#D41922] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-red-100 hover:bg-[#B0141B] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <RefreshCw className="animate-spin" /> : <Camera size={20} />}
              Save Image
            </button>
            <button 
              onClick={handleShare}
              disabled={isGenerating || placedItems.length === 0}
              className="bg-blue-500 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-100 hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 size={20} /> Share Layout
            </button>
            <button 
              onClick={() => {
                if(confirm('Are you sure you want to clear the table?')) setPlacedItems([]);
              }}
              className="bg-white text-gray-400 px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 border-2 border-gray-100 hover:border-gray-200 hover:text-gray-600 transition-all"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
