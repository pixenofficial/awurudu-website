import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, Send, Menu, X, Clock, Star, Trophy, Gift, User, Sparkles, Languages, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'webpixen@gmail.com';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    checkAdmin();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === ADMIN_EMAIL) {
      setIsAdmin(true);
    }
  }

  const navItems = [
    { to: '/', icon: <Home size={18} />, label: t('home') },
    { to: '/games/word-search', icon: <Sparkles size={18} />, label: t('games') },
    { to: '/nakath', icon: <Clock size={18} />, label: t('nakath') },
    { to: '/recipes', icon: <Utensils size={18} />, label: t('recipes') },
    { to: '/games/voting', icon: <Star size={18} />, label: t('voting') },
    { to: '/greeting-card', icon: <Send size={18} />, label: t('greetings') },
    { to: '/leaderboard', icon: <Trophy size={18} />, label: t('leaderboard') },
    { to: '/rewards', icon: <Gift size={18} />, label: t('rewards') },
    { to: '/profile', icon: <User size={18} />, label: t('profile') },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', icon: <Shield size={18} />, label: t('admin') });
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm py-2" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 bg-white rounded-2xl px-6 shadow-sm border border-gray-100">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-black tracking-tighter italic font-serif text-[#D41922]">{t('appName')}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.to} 
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 font-black text-[10px] uppercase tracking-widest hover:bg-[#D41922] hover:text-white transition-all shadow-sm"
            >
              <Languages size={16} />
              <span className="hidden sm:inline">{language === 'en' ? 'සිංහල' : 'English'}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <div className="xl:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[#D41922] hover:text-white transition-all shadow-sm"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="xl:hidden absolute top-full left-0 right-0 mt-2 mx-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 flex flex-col space-y-1 max-h-[70vh] overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest",
                    location.pathname === item.to 
                      ? "bg-[#D41922] text-white shadow-lg shadow-red-200" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#D41922]"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest relative",
        isActive ? "bg-[#D41922] text-white shadow-lg shadow-red-200" : "text-gray-500 hover:bg-gray-50 hover:text-[#D41922]"
      )}
    >
      {icon}
      <span>{label}</span>
      {isActive && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute inset-0 bg-[#D41922] rounded-xl -z-10 blur-md opacity-20"
        />
      )}
    </Link>
  );
}
