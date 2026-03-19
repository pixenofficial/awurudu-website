import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, LogOut, Star, Trophy, Clock, Shield, Bell, Palette, ChevronRight, Camera, Edit3, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFormData({ name: user.user_metadata?.full_name || 'Avurudu Player', email: user.email || '' });
      }
    } catch (e) {
      console.error('Error fetching user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: 'Avurudu Player' }
          }
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        fetchUser();
      }
    } catch (err: any) {
      setError(err.message || t('authError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: formData.name }
      });
      if (error) throw error;
      setIsEditing(false);
      fetchUser();
    } catch (e) {
      console.error('Error updating user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!user && !isLoading) {
    return (
      <div className="max-w-md mx-auto p-8 mt-12 bg-white rounded-[3rem] shadow-2xl border-2 border-gray-100">
        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-8 rotate-3">
          <User size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2 text-center">{t(authMode === 'signin' ? 'signIn' : 'signUp')}</h2>
        <p className="text-gray-500 font-medium text-center mb-8">
          {t('createAccountDesc')}
        </p>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#D41922] outline-none transition-all font-bold"
              placeholder="example@email.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('password')}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#D41922] outline-none transition-all font-bold"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D41922] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-[#B0141B] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? <RefreshCw className="animate-spin" /> : null}
            {t(authMode === 'signin' ? 'signIn' : 'signUp')}
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-gray-400">OR</span></div>
        </div>

        <button 
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="w-full bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-black text-lg shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-3 mb-6"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          {t('signInWithGoogle')}
        </button>

        <p className="text-center text-sm font-bold text-gray-500">
          {t(authMode === 'signin' ? 'dontHaveAccount' : 'alreadyHaveAccount')}{' '}
          <button 
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            className="text-[#D41922] hover:underline"
          >
            {t(authMode === 'signin' ? 'signUp' : 'signIn')}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[3rem] shadow-2xl border-2 border-gray-100 p-12 text-center relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-32 bg-[#D41922] -z-10" />
            
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full border-8 border-white shadow-xl mx-auto overflow-hidden bg-gray-100">
                <img 
                  src={user?.user_metadata?.avatar_url || 'https://picsum.photos/seed/avatar/200/200'} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="absolute bottom-0 right-1/2 translate-x-16 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-all">
                <Camera size={18} />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-black text-gray-800 mb-1">{formData.name}</h3>
              <p className="text-gray-400 font-bold text-sm">{formData.email}</p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-orange-50 px-4 py-2 rounded-xl text-orange-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Star size={14} fill="currentColor" /> {t('level')} 12
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} /> {t('pro')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('rank')}</p>
                <p className="text-xl font-black text-gray-800">#42</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('points')}</p>
                <p className="text-xl font-black text-gray-800">12.5k</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border-2 border-gray-100 p-4 space-y-2">
            {[
              { icon: Settings, label: t('settings'), color: 'text-gray-500' },
              { icon: Bell, label: t('notifications'), color: 'text-blue-500' },
              { icon: Palette, label: t('appearance'), color: 'text-purple-500' },
              { icon: Shield, label: t('privacy'), color: 'text-green-500' },
              { icon: LogOut, label: t('logout'), color: 'text-red-500', onClick: handleLogout }
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full p-4 rounded-2xl flex items-center justify-between group hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${item.color} group-hover:bg-white transition-colors`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-bold text-gray-700">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 p-12 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            
            <div className="flex items-center justify-between mb-16 relative">
              <div className="space-y-2">
                <h4 className="text-4xl font-black text-gray-900 font-serif italic tracking-tighter">{t('profileDetails')}</h4>
                <div className="w-12 h-1 bg-[#D41922] rounded-full" />
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg",
                  isEditing 
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                    : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200"
                )}
              >
                {isEditing ? <X size={14} /> : <Edit3 size={14} />}
                {isEditing ? t('cancel') : t('editProfile')}
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-10 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('fullName')}</label>
                  <div className="relative group">
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-8 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:border-[#D41922] focus:bg-white outline-none transition-all font-bold text-lg disabled:opacity-60 group-hover:border-gray-200"
                    />
                    {isEditing && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-400"><Edit3 size={18} /></div>}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('emailAddress')}</label>
                  <div className="relative group">
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full px-8 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] outline-none font-bold text-lg opacity-60 cursor-not-allowed"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300"><Shield size={18} /></div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#D41922] text-white px-16 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-red-200 hover:bg-[#B0141B] active:scale-95 transition-all flex items-center gap-4 group"
                  >
                    {isLoading ? <RefreshCw className="animate-spin" /> : <CheckCircle2 className="group-hover:scale-110 transition-transform" />}
                    {t('saveChanges')}
                  </button>
                </motion.div>
              )}
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 p-12 group">
              <div className="flex items-center justify-between mb-12">
                <h4 className="text-2xl font-black text-gray-900 font-serif italic flex items-center gap-3">
                  <Trophy className="text-yellow-500 group-hover:rotate-12 transition-transform" /> {t('achievements')}
                </h4>
                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">{t('viewAll')}</button>
              </div>
              <div className="space-y-8">
                {[
                  { label: t('wordMaster'), desc: t('found100Words'), date: `2 ${t('daysAgo')}`, icon: '🔍', color: 'bg-orange-50 text-orange-500' },
                  { label: t('rabanKing'), desc: t('perfectRhythmScore'), date: `1 ${t('weekAgo')}`, icon: '🥁', color: 'bg-blue-50 text-blue-500' },
                  { label: t('potBreaker'), desc: t('broke50Pots'), date: `2 ${t('weeksAgo')}`, icon: '🏺', color: 'bg-purple-50 text-purple-500' }
                ].map((ach, i) => (
                  <div key={i} className="flex items-center gap-6 group/item">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all group-hover/item:scale-110 group-hover/item:rotate-3 shadow-lg shadow-black/5",
                      ach.color
                    )}>
                      {ach.icon}
                    </div>
                    <div>
                      <h5 className="font-black text-gray-900 text-lg leading-tight">{ach.label}</h5>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] mt-1">{ach.desc} · {ach.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 p-12 group">
              <div className="flex items-center justify-between mb-12">
                <h4 className="text-2xl font-black text-gray-900 font-serif italic flex items-center gap-3">
                  <Clock className="text-blue-500 group-hover:rotate-12 transition-transform" /> {t('gameHistory')}
                </h4>
                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">{t('fullHistory')}</button>
              </div>
              <div className="space-y-6">
                {[
                  { game: t('memoryMatch'), score: '2,400', date: t('today'), trend: '+12%' },
                  { game: t('avuruduQuiz'), score: '1,850', date: t('yesterday'), trend: '+5%' },
                  { game: t('kottaPora'), score: `42 ${t('taps')}`, date: `3 ${t('daysAgo')}`, trend: '-2%' }
                ].map((hist, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] border-2 border-gray-50 hover:border-orange-100 hover:bg-orange-50/10 transition-all group/item">
                    <div className="space-y-1">
                      <h5 className="font-black text-gray-900 text-lg leading-tight">{hist.game}</h5>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{hist.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#D41922] text-xl leading-none">{hist.score}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{t('score')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
