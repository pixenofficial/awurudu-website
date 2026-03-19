import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Heart, Upload, User, CheckCircle2, AlertCircle, Camera, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/LanguageContext';

interface Contestant {
  id: string;
  name: string;
  image_url: string;
  category: string;
  votes: number;
}

export default function PrincePrincessVoting() {
  const { t } = useLanguage();
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [category, setCategory] = useState<'Prince' | 'Princess'>('Prince');
  const [isUploading, setIsUploading] = useState(false);
  const [votedToday, setVotedToday] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Prince', image: null as File | null });

  useEffect(() => {
    fetchContestants();
    checkVoteStatus();
  }, [category]);

  const fetchContestants = async () => {
    try {
      const { data, error } = await supabase
        .from('contestants')
        .select('*')
        .eq('category', category)
        .order('votes', { ascending: false })
        .limit(10);
      if (error) throw error;
      setContestants(data || []);
    } catch (e) {
      console.error('Error fetching contestants:', e);
    }
  };

  const checkVoteStatus = () => {
    const lastVote = localStorage.getItem('last_avurudu_vote');
    if (lastVote === new Date().toDateString()) {
      setVotedToday(true);
    }
  };

  const handleVote = async (contestantId: string) => {
    if (votedToday) return;

    try {
      // Increment vote count
      const { error: updateError } = await supabase.rpc('increment_vote', { contestant_id: contestantId });
      
      // If RPC fails, use standard update
      if (updateError) {
        const contestant = contestants.find(c => c.id === contestantId);
        await supabase
          .from('contestants')
          .update({ votes: (contestant?.votes || 0) + 1 })
          .eq('id', contestantId);
      }

      // Record vote
      await supabase.from('votes').insert({ contestant_id: contestantId });
      
      localStorage.setItem('last_avurudu_vote', new Date().toDateString());
      setVotedToday(true);
      fetchContestants();
    } catch (e) {
      console.error('Error voting:', e);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.name) return;

    setIsUploading(true);
    try {
      // 1. Upload Image to Supabase Storage
      const fileExt = formData.image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contestants')
        .upload(fileName, formData.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('contestants')
        .getPublicUrl(fileName);

      // 2. Create Contestant Record
      const { error: insertError } = await supabase
        .from('contestants')
        .insert({
          name: formData.name,
          category: formData.category,
          image_url: publicUrl,
          votes: 0
        });

      if (insertError) throw insertError;

      setShowUpload(false);
      setFormData({ name: '', category: 'Prince', image: null });
      fetchContestants();
    } catch (e) {
      console.error('Error uploading:', e);
      alert(t('uploadFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-[#D41922] font-serif italic mb-2">{t('avuruduPrincePrincess')}</h2>
          <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">{t('voteFavorites')}</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-gray-200">
          <button
            onClick={() => setCategory('Prince')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${category === 'Prince' ? 'bg-[#D41922] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            {t('prince')}
          </button>
          <button
            onClick={() => setCategory('Princess')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${category === 'Princess' ? 'bg-[#D41922] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            {t('princess')}
          </button>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-orange-600 transition-all"
        >
          <Upload size={20} /> {t('joinContest')}
        </button>
      </div>

      {votedToday && (
        <div className="mb-8 bg-green-50 border-2 border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-700 font-bold justify-center animate-in fade-in slide-in-from-top">
          <CheckCircle2 size={20} />
          {t('alreadyVoted')}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {contestants.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-2 border-gray-100 group relative"
          >
            {/* Rank Badge */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full shadow-lg flex items-center gap-2">
              <Trophy size={14} className={i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-400'} />
              <span className="font-black text-sm">#{i + 1}</span>
            </div>

            <div className="aspect-[3/4] overflow-hidden relative">
              <img 
                src={c.image_url || 'https://picsum.photos/seed/person/400/500'} 
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <button
                  onClick={() => handleVote(c.id)}
                  disabled={votedToday}
                  className={`
                    w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all
                    ${votedToday ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-[#D41922] text-white hover:bg-[#B0141B] active:scale-95'}
                  `}
                >
                  <Heart size={20} fill={votedToday ? 'currentColor' : 'none'} />
                  {votedToday ? t('voted') : t('voteNow')}
                </button>
              </div>
            </div>

            <div className="p-6 text-center">
              <h3 className="text-xl font-black text-gray-800 mb-1 font-serif italic">{c.name}</h3>
              <div className="flex items-center justify-center gap-2 text-[#D41922]">
                <Heart size={16} fill="currentColor" />
                <span className="font-black text-lg">{c.votes} {t('votes')}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {contestants.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="text-6xl mb-4 opacity-20">🎭</div>
            <p className="text-gray-400 font-bold uppercase tracking-widest">{t('noContestants')}</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpload(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 overflow-hidden"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-[#D41922] font-serif italic mb-2">{t('joinTheContest')}</h3>
                <p className="text-gray-500 text-sm font-medium">{t('uploadPhotoParticipate')}</p>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">{t('fullName')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('enterYourName')}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#D41922] outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">{t('category')}</label>
                  <div className="flex gap-2">
                    {['Prince', 'Princess'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat as 'Prince' | 'Princess' })}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${formData.category === cat ? 'bg-[#D41922] border-[#D41922] text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >
                        {t(cat.toLowerCase() as any)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">{t('photo')}</label>
                  <label className="relative block cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                      className="hidden"
                    />
                    <div className="w-full py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-[#D41922] transition-all">
                      {formData.image ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold">
                          <CheckCircle2 size={20} />
                          <span>{formData.image.name}</span>
                        </div>
                      ) : (
                        <>
                          <Camera className="text-gray-400 group-hover:text-[#D41922]" size={32} />
                          <span className="text-gray-400 font-bold text-sm">{t('selectImage')}</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className={`
                    w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-xl transition-all
                    ${isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#D41922] text-white hover:bg-[#B0141B] active:scale-95'}
                  `}
                >
                  {isUploading ? <RefreshCw className="animate-spin" /> : <Upload />}
                  {isUploading ? t('uploading') : t('submitEntry')}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-2 text-orange-500 bg-orange-50 p-4 rounded-2xl text-xs font-bold">
                <AlertCircle size={16} />
                <span>{t('agreePublicPhoto')}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
