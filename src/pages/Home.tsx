import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Trophy, Sparkles, Zap, Star, ChevronRight, Play, Heart, Clock } from 'lucide-react';
import SmartLink from '../components/SmartLink';
import { useLanguage } from '../lib/LanguageContext';

export default function Home() {
  const { t, language } = useLanguage();

  const games = [
    { 
      title: language === 'si' ? 'වචන සෙවීම' : 'Word Search', 
      path: '/games/word-search', 
      icon: '🔍', 
      color: 'bg-blue-500', 
      desc: language === 'si' ? 'අවුරුදු වචන සොයන්න' : 'Find Avurudu words' 
    },
    { 
      title: language === 'si' ? 'පංච කෙළිය' : 'Pancha Keliya', 
      path: '/games/pancha-keliya', 
      icon: '🎲', 
      color: 'bg-orange-500', 
      desc: language === 'si' ? 'සාම්ප්‍රදායික පංච ක්‍රීඩාව' : 'Traditional dice game' 
    },
    { 
      title: language === 'si' ? 'ඩිජිටල් රබන්' : 'Virtual Raban', 
      path: '/games/virtual-raban', 
      icon: '🥁', 
      color: 'bg-[#D41922]', 
      desc: language === 'si' ? 'රබන් පද වයන්න' : 'Play the traditional drum' 
    },
    { 
      title: language === 'si' ? 'කොට්ට පොර' : 'Kotta Pora', 
      path: '/games/kotta-pora', 
      icon: '⚔️', 
      color: 'bg-purple-500', 
      desc: language === 'si' ? 'ඩිජිටල් කොට්ට පොර' : 'Digital pillow fight' 
    },
    { 
      title: language === 'si' ? 'මතක ක්‍රීඩාව' : 'Memory Match', 
      path: '/games/memory-match', 
      icon: '🎴', 
      color: 'bg-green-500', 
      desc: language === 'si' ? 'අවුරුදු කෑම වර්ග ගලපන්න' : 'Match Avurudu treats' 
    },
    { 
      title: language === 'si' ? 'අවුරුදු පැන විසඳුම්' : 'Avurudu Quiz', 
      path: '/games/quiz', 
      icon: '❓', 
      color: 'bg-yellow-500', 
      desc: language === 'si' ? 'ඔබේ දැනුම පරීක්ෂා කරන්න' : 'Test your knowledge' 
    },
    { 
      title: language === 'si' ? 'අලියාට ඇස තැබීම' : 'Blindfold Elephant', 
      path: '/games/blindfold-elephant', 
      icon: '🐘', 
      color: 'bg-indigo-500', 
      desc: language === 'si' ? 'ඇස තැබිය යුතු තැන අනුමාන කරන්න' : 'Guess the eye position' 
    },
    { 
      title: language === 'si' ? 'කණ මුට්ටි බිඳීම' : 'Pot Breaking', 
      path: '/games/pot-breaking', 
      icon: '🏺', 
      color: 'bg-red-500', 
      desc: language === 'si' ? 'මුට්ටි බිඳින්න' : 'Break the pots' 
    },
    { 
      title: language === 'si' ? 'මේසය සැරසීම' : 'Table Decoration', 
      path: '/games/table-decoration', 
      icon: '🍽️', 
      color: 'bg-teal-500', 
      desc: language === 'si' ? 'ඔබේ අවුරුදු මේසය සරසන්න' : 'Decorate your table' 
    },
    { 
      title: language === 'si' ? 'අවුරුදු කුමරා/කුමරිය' : 'Prince/Princess', 
      path: '/games/voting', 
      icon: '👑', 
      color: 'bg-pink-500', 
      desc: language === 'si' ? 'ඔබේ කැමැත්ත ප්‍රකාශ කරන්න' : 'Vote for your favorites' 
    }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-[4rem] bg-[#D41922] text-white p-12">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="grid grid-cols-12 gap-4 p-8">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full" />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-sm font-black uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles size={16} /> {t('welcome')}
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black font-serif italic mb-8 leading-none"
          >
            {language === 'si' ? 'සිංහල හා දෙමළ' : 'Celebrate the'} <br /> {language === 'si' ? 'අලුත් අවුරුද්ද!' : 'New Year!'}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t('heroDesc')}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/games/word-search"
              className="bg-white text-[#D41922] px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-[#FFD700] transition-all active:scale-95 flex items-center gap-3"
            >
              <Play fill="currentColor" /> {t('startPlaying')}
            </Link>
            <SmartLink 
              href="https://monetag.com/smartlink" 
              label={t('claimReward')} 
              variant="secondary"
            />
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-20 left-20 text-6xl opacity-20 hidden lg:block"
        >
          🥁
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-20 right-20 text-6xl opacity-20 hidden lg:block"
        >
          🏺
        </motion.div>
      </section>

      {/* Games Grid */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-black text-[#D41922] font-serif italic mb-2">{t('traditionalGames')}</h2>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">{t('digitalVersions')}</p>
          </div>
          <Link to="/leaderboard" className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-xs hover:text-orange-600 transition-colors">
            <Trophy size={16} /> {t('viewLeaderboard')} <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {games.map((game, i) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                to={game.path}
                className="group block bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-200 transition-all relative overflow-hidden h-full"
              >
                <div className={`w-16 h-16 rounded-2xl ${game.color} text-white flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2 font-serif italic">{game.title}</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">{game.desc}</p>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap size={20} className="text-orange-400" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Bento */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          <Link 
            to="/nakath" 
            className="md:col-span-8 bg-white rounded-[3rem] border-2 border-gray-100 shadow-xl p-12 flex flex-col justify-between group hover:border-[#D41922] transition-all overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center mb-8">
                <Clock size={32} />
              </div>
              <h3 className="text-4xl font-black text-gray-800 font-serif italic mb-4">{t('auspiciousTimes')}</h3>
              <p className="text-gray-500 font-medium max-w-md">
                {language === 'si' ? 'වැදගත්ම මොහොත අතපසු කරගන්න එපා. සියලුම චාරිත්‍ර සඳහා නැකත් වේලාවන් මෙතැනින් බලන්න.' : "Don't miss the most important moments. Check the Nakath for all traditional rituals."}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-2 text-[#D41922] font-black uppercase tracking-widest text-xs">
              {t('checkNakath')} <ChevronRight size={16} />
            </div>
          </Link>

          <Link 
            to="/recipes" 
            className="md:col-span-4 bg-[#D41922] rounded-[3rem] shadow-xl p-12 flex flex-col justify-between group hover:bg-[#B0141B] transition-all text-white"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-8">
                <Star size={32} />
              </div>
              <h3 className="text-4xl font-black font-serif italic mb-4">{t('recipes')}</h3>
              <p className="text-white/70 font-medium">
                {language === 'si' ? 'කැවුම්, කොකිස් සහ තවත් බොහෝ දේ සෑදීමේ කලාව ප්‍රගුණ කරන්න.' : 'Master the art of making Kevum, Kokis, and more.'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#FFD700] font-black uppercase tracking-widest text-xs">
              {language === 'si' ? 'වට්ටෝරු බලන්න' : 'View Recipes'} <ChevronRight size={16} />
            </div>
          </Link>

          <Link 
            to="/greeting-card" 
            className="md:col-span-4 bg-orange-500 rounded-[3rem] shadow-xl p-12 flex flex-col justify-between group hover:bg-orange-600 transition-all text-white"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-8">
                <Heart size={32} />
              </div>
              <h3 className="text-4xl font-black font-serif italic mb-4">{t('greetings')}</h3>
              <p className="text-white/70 font-medium">
                {language === 'si' ? 'ලස්සන අවුරුදු සුබපැතුම් පත් සාදා බෙදා ගන්න.' : 'Create and share beautiful Avurudu cards.'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs">
              {t('createCard')} <ChevronRight size={16} />
            </div>
          </Link>

          <Link 
            to="/leaderboard" 
            className="md:col-span-8 bg-gray-900 rounded-[3rem] shadow-xl p-12 flex flex-col justify-between group hover:bg-black transition-all text-white"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-yellow-500 flex items-center justify-center mb-8">
                <Trophy size={32} />
              </div>
              <h3 className="text-4xl font-black font-serif italic mb-4">{t('leaderboard')}</h3>
              <p className="text-white/50 font-medium">
                {language === 'si' ? 'ලොව පුරා සිටින ක්‍රීඩකයින් සමඟ තරඟ කර ඉහළටම යන්න.' : 'Compete with players worldwide and reach the top.'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-xs">
              {t('viewRankings')} <ChevronRight size={16} />
            </div>
          </Link>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="bg-white rounded-[4rem] border-2 border-gray-100 shadow-2xl p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-gray-800 font-serif italic mb-8">{t('dontMissFun')}</h2>
            <p className="text-gray-500 font-medium text-lg mb-12">
              {t('newsletterDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder={t('enterEmail')} 
                className="flex-1 px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#D41922] outline-none transition-all font-bold"
              />
              <button className="bg-[#D41922] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-[#B0141B] transition-all active:scale-95">
                {t('joinNow')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
