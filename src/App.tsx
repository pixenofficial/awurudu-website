import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { LanguageProvider } from './lib/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdPlaceholder from './components/AdPlaceholder';

// Lazy load games and features for better performance
const WordSearch = React.lazy(() => import('./components/games/WordSearch'));
const PanchaKeliya = React.lazy(() => import('./components/games/PanchaKeliya'));
const VirtualRaban = React.lazy(() => import('./components/games/VirtualRaban'));
const KottaPora = React.lazy(() => import('./components/games/KottaPora'));
const MemoryMatch = React.lazy(() => import('./components/games/MemoryMatch'));
const Quiz = React.lazy(() => import('./components/games/Quiz'));
const BlindfoldElephant = React.lazy(() => import('./components/games/BlindfoldElephant'));
const TableDecoration = React.lazy(() => import('./components/games/TableDecoration'));
const PotBreaking = React.lazy(() => import('./components/games/PotBreaking'));
const PrincePrincessVoting = React.lazy(() => import('./components/games/PrincePrincessVoting'));

const Leaderboard = React.lazy(() => import('./components/Leaderboard'));
const AuspiciousTimes = React.lazy(() => import('./components/AuspiciousTimes'));
const Recipes = React.lazy(() => import('./components/Recipes'));
const GreetingCard = React.lazy(() => import('./components/GreetingCard'));
const DailyRewards = React.lazy(() => import('./components/DailyRewards'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const AdminPortal = React.lazy(() => import('./components/AdminPortal'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="w-16 h-16 border-4 border-[#D41922] border-t-transparent rounded-full animate-spin" />
    <p className="text-[#D41922] font-black uppercase tracking-widest text-sm animate-pulse">Loading Avurudu Magic...</p>
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-[#FDFCF0] text-[#1A1A1A] font-sans selection:bg-[#D41922] selection:text-white">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
              {/* Top Ad Placeholder */}
              <div className="mb-8">
                <AdPlaceholder type="banner" />
              </div>

              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  
                  {/* Games */}
                  <Route path="/games/word-search" element={<WordSearch />} />
                  <Route path="/games/pancha-keliya" element={<PanchaKeliya />} />
                  <Route path="/games/virtual-raban" element={<VirtualRaban />} />
                  <Route path="/games/kotta-pora" element={<KottaPora />} />
                  <Route path="/games/memory-match" element={<MemoryMatch />} />
                  <Route path="/games/quiz" element={<Quiz />} />
                  <Route path="/games/blindfold-elephant" element={<BlindfoldElephant />} />
                  <Route path="/games/table-decoration" element={<TableDecoration />} />
                  <Route path="/games/pot-breaking" element={<PotBreaking />} />
                  <Route path="/games/voting" element={<PrincePrincessVoting />} />
                  
                  {/* Features */}
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/nakath" element={<AuspiciousTimes />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/greeting-card" element={<GreetingCard />} />
                  <Route path="/rewards" element={<DailyRewards />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/admin" element={<AdminPortal />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>

              {/* Bottom Ad Placeholder */}
              <div className="mt-12">
                <AdPlaceholder type="banner" />
              </div>
            </main>

            <Footer />
            
            {/* Monetag Script Injection Simulation */}
            <div id="monetag-vignette"></div>
          </div>
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
