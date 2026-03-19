import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Clock, Users, Star, Search, ChevronRight, X, Flame, Heart, Share2, Bookmark } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  image_url: string;
  prep_time: string;
  servings: number;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchRecipes();
    const saved = localStorage.getItem('avurudu_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*');
      if (error) throw error;
      setRecipes(data || []);
    } catch (e) {
      console.error('Error fetching recipes:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavs = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('avurudu_favorites', JSON.stringify(newFavs));
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100"
            >
              <ChefHat size={12} /> Traditional Flavors
            </motion.div>
            <h2 className="text-6xl font-black text-gray-900 font-serif italic tracking-tighter leading-none">
              Traditional <br /> <span className="text-[#D41922]">Recipes</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
              Master the art of traditional Sinhala and Tamil New Year treats!
            </p>
          </div>

          <div className="relative mb-16 max-w-2xl mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D41922] transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search recipes (Kevum, Kokis, Aluwa...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-[2.5rem] focus:border-[#D41922] outline-none transition-all font-bold shadow-xl shadow-gray-100/50 text-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRecipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(recipe)}
                className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-100/50 border border-gray-100 group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={recipe.image_url || `https://picsum.photos/seed/${recipe.title}/600/800`} 
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <div className="flex items-center gap-4 text-white mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{recipe.prep_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{recipe.servings} People</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                      View Recipe
                    </button>
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(recipe.id, e)}
                    className={cn(
                      "absolute top-6 right-6 w-12 h-12 rounded-2xl backdrop-blur-xl border flex items-center justify-center transition-all",
                      favorites.includes(recipe.id) 
                        ? "bg-[#D41922] border-[#D41922] text-white" 
                        : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-gray-900"
                    )}
                  >
                    <Bookmark size={20} className={favorites.includes(recipe.id) ? "fill-current" : ""} />
                  </button>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 font-serif italic group-hover:text-[#D41922] transition-colors leading-tight">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-yellow-400">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={12} fill="currentColor" />)}
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Traditional
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[#D41922] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Loading Recipes...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-gray-800 hover:bg-[#D41922] hover:text-white transition-all"
              >
                <X size={24} />
              </button>

              <div className="lg:w-2/5 relative h-64 lg:h-auto">
                <img 
                  src={selected.image_url || `https://picsum.photos/seed/${selected.title}/800/1200`} 
                  alt={selected.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent lg:hidden" />
              </div>

              <div className="lg:w-3/5 p-8 lg:p-16 overflow-y-auto">
                <div className="mb-12">
                  <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4">
                    <Flame size={14} /> Traditional Recipe
                  </div>
                  <h3 className="text-5xl font-black text-gray-900 font-serif italic mb-8 leading-none tracking-tighter">{selected.title}</h3>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <Clock size={18} className="text-[#D41922]" />
                      <span className="font-black text-xs uppercase tracking-widest text-gray-600">{selected.prep_time}</span>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <Users size={18} className="text-[#D41922]" />
                      <span className="font-black text-xs uppercase tracking-widest text-gray-600">{selected.servings} Servings</span>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <Heart size={18} className="text-[#D41922]" />
                      <span className="font-black text-xs uppercase tracking-widest text-gray-600">Easy</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <section>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-4">
                      <div className="w-8 h-0.5 bg-gray-100" /> Ingredients
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selected.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-4 text-gray-600 font-bold bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                          <div className="w-2 h-2 bg-orange-400 rounded-full" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-4">
                      <div className="w-8 h-0.5 bg-gray-100" /> Instructions
                    </h4>
                    <div className="space-y-6">
                      {selected.instructions.map((step, i) => (
                        <div key={i} className="flex gap-6 group">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#D41922] font-black text-sm group-hover:bg-[#D41922] group-hover:text-white transition-all">
                            {i + 1}
                          </div>
                          <p className="text-gray-600 font-medium leading-relaxed text-lg pt-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="pt-8 border-t border-gray-100 flex gap-4">
                    <button className="flex-1 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                      <Share2 size={18} /> Share Recipe
                    </button>
                    <button 
                      onClick={(e) => toggleFavorite(selected.id, e)}
                      className={cn(
                        "w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all",
                        favorites.includes(selected.id) 
                          ? "bg-[#D41922] border-[#D41922] text-white" 
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      )}
                    >
                      <Bookmark size={24} className={favorites.includes(selected.id) ? "fill-current" : ""} />
                    </button>
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
