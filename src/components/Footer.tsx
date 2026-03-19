import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t-2 border-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-4xl font-black tracking-tighter italic font-serif text-[#D41922]">{t('appName')}</span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#D41922] hover:text-white transition-all shadow-sm"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('games')}</h4>
            <ul className="space-y-4">
              {['Word Search', 'Pancha Keliya', 'Virtual Raban', 'Kotta Pora'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-gray-600 font-bold hover:text-[#D41922] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('features')}</h4>
            <ul className="space-y-4">
              {[
                { key: 'nakath', label: t('nakath') },
                { key: 'recipes', label: t('recipes') },
                { key: 'greetings', label: t('greetings') },
                { key: 'leaderboard', label: t('leaderboard') }
              ].map(item => (
                <li key={item.key}>
                  <Link to={`/${item.key}`} className="text-gray-600 font-bold hover:text-[#D41922] transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Monetization</h4>
            <div className="bg-orange-50 p-8 rounded-[2rem] border-2 border-orange-100">
              <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-[10px] mb-2">
                <Sparkles size={12} /> {t('partnerProgram')}
              </div>
              <p className="text-gray-600 text-sm font-bold mb-4">{t('interestedInAds')}</p>
              <button className="w-full py-3 bg-white text-orange-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-orange-600 hover:text-white transition-all">
                {t('contactUs')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-gray-100 gap-6">
          <p className="text-gray-400 text-sm font-medium">
            {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            {t('madeWith')} <Heart size={16} className="text-[#D41922] fill-current" /> {t('inSriLanka')}
          </div>
          <div className="flex gap-8">
            <Link to="#" className="text-gray-400 text-sm font-medium hover:text-gray-600">{t('privacyPolicy')}</Link>
            <Link to="#" className="text-gray-400 text-sm font-medium hover:text-gray-600">{t('termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
