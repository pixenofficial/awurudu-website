import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, ChevronRight, X, Clock, Users } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';
import { useLanguage } from '../lib/LanguageContext';

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const { t } = useLanguage();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-black text-[#D41922] mb-2 font-serif italic">{t('traditionalRecipes')}</h1>
        <p className="text-gray-600">{t('authenticFlavors')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))
        ) : (
          recipes?.map((recipe) => (
            <motion.div 
              key={recipe.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={recipe.image_url || 'https://picsum.photos/seed/food/400/300'} 
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#D41922] text-white p-2 rounded-lg">
                  <Utensils size={16} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#D41922] transition-colors">{recipe.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {recipe.instructions}
                </p>
                <button 
                  onClick={() => setSelectedRecipe(recipe)}
                  className="text-[#D41922] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {t('viewFullRecipe')}
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <AdPlaceholder type="native" />
        <AdPlaceholder type="native" />
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-800 hover:bg-white transition-colors shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto">
                <div className="h-64 sm:h-80 relative">
                  <img 
                    src={selectedRecipe.image_url || 'https://picsum.photos/seed/food/800/600'} 
                    alt={selectedRecipe.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <h2 className="text-3xl sm:text-4xl font-black text-white font-serif italic">{selectedRecipe.title}</h2>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-[#D41922]" />
                      <span>{t('traditional')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-[#D41922]" />
                      <span>{t('familySize')}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#D41922]">
                      <span className="w-8 h-8 bg-[#D41922]/10 rounded-lg flex items-center justify-center text-sm">01</span>
                      {t('ingredients')}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedRecipe.ingredients?.map((ingredient: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D41922] mt-2 shrink-0" />
                          <span className="text-sm">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#D41922]">
                      <span className="w-8 h-8 bg-[#D41922]/10 rounded-lg flex items-center justify-center text-sm">02</span>
                      {t('instructions')}
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {selectedRecipe.instructions}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <AdPlaceholder type="banner" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
