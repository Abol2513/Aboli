import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroAnimation } from '@/components/IntroAnimation';
import { LoginModal } from '@/components/LoginModal';
import { Sidebar } from '@/components/Sidebar';
import { IPScanner } from '@/components/IPScanner';
import { DomainScanner } from '@/components/DomainScanner';
import { TurboScanner } from '@/components/TurboScanner';
import { SpeedTest } from '@/components/SpeedTest';
import { AINews } from '@/components/AINews';
import { PreviousIPs } from '@/components/PreviousIPs';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import type { IPResult, DomainResult } from '@/types';
import { Sparkles, Scan } from 'lucide-react';

type ViewType = 'previous' | 'ip-scan' | 'domain-scan' | 'turbo' | 'speedtest' | 'news';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('ip-scan');
  const [scanHistory, setScanHistory] = useState<(IPResult | DomainResult)[]>([]);
  const [favorites, setFavorites] = useState<(IPResult | DomainResult)[]>([]);
  
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setScanHistory(parsed.map((item: IPResult | DomainResult) => ({
          ...item,
          lastTested: new Date(item.lastTested),
        })));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
    
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed.map((item: IPResult | DomainResult) => ({
          ...item,
          lastTested: new Date(item.lastTested),
        })));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  // Save data to localStorage when changed
  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowLogin(true);
  };

  const handleLogin = () => {
    setShowLogin(false);
    setIsLoggedIn(true);
  };

  const addToHistory = useCallback((result: IPResult | DomainResult) => {
    setScanHistory(prev => {
      // Avoid duplicates
      const exists = prev.some(item => {
        if ('ip' in item && 'ip' in result) return item.ip === result.ip;
        if ('domain' in item && 'domain' in result) return item.domain === result.domain;
        return false;
      });
      
      if (exists) {
        // Update existing entry
        return prev.map(item => {
          if ('ip' in item && 'ip' in result && item.ip === result.ip) return result;
          if ('domain' in item && 'domain' in result && item.domain === result.domain) return result;
          return item;
        });
      }
      
      return [result, ...prev].slice(0, 100); // Keep last 100 items
    });
  }, []);

  const toggleFavorite = useCallback((item: IPResult | DomainResult) => {
    setFavorites(prev => {
      const exists = prev.some(fav => {
        if ('ip' in fav && 'ip' in item) return fav.ip === item.ip;
        if ('domain' in fav && 'domain' in item) return fav.domain === item.domain;
        return false;
      });
      
      if (exists) {
        return prev.filter(fav => {
          if ('ip' in fav && 'ip' in item) return fav.ip !== item.ip;
          if ('domain' in fav && 'domain' in item) return fav.domain !== item.domain;
          return true;
        });
      }
      
      return [item, ...prev];
    });
  }, []);

  const clearHistory = useCallback(() => {
    setScanHistory([]);
  }, []);

  const removeHistoryItem = useCallback((index: number) => {
    setScanHistory(prev => prev.filter((_, i) => i !== index));
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'previous':
        return (
          <PreviousIPs
            t={t}
            history={scanHistory}
            favorites={favorites}
            onClearHistory={clearHistory}
            onRemoveItem={removeHistoryItem}
            onToggleFavorite={toggleFavorite}
          />
        );
      case 'ip-scan':
        return (
          <IPScanner
            t={t}
            onAddToHistory={addToHistory}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
      case 'domain-scan':
        return (
          <DomainScanner
            t={t}
            onAddToHistory={addToHistory}
          />
        );
      case 'turbo':
        return (
          <TurboScanner
            t={t}
            onAddToHistory={addToHistory}
          />
        );
      case 'speedtest':
        return (
          <SpeedTest t={t} />
        );
      case 'news':
        return (
          <AINews t={t} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 ${theme} grid-bg`}>
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onLogin={handleLogin} t={t} />

      {/* Main Application */}
      <AnimatePresence>
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex"
          >
            {/* Sidebar */}
            <Sidebar
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
              currentView={currentView}
              onViewChange={setCurrentView}
              theme={theme}
              onThemeToggle={toggleTheme}
              language={language}
              onLanguageToggle={toggleLanguage}
              t={t}
              scanHistoryCount={scanHistory.length}
            />

            {/* Main Content */}
            <main 
              className={`
                flex-1 min-h-screen transition-all duration-300
                ${sidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'}
                pt-16 md:pt-0
              `}
            >
              {/* Header */}
              <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                      {currentView === 'previous' && t('menu.previousIPs')}
                      {currentView === 'ip-scan' && <><Scan className="w-5 h-5 text-cyan-400" /> {t('scanner.title')}</>}
                      {currentView === 'domain-scan' && t('domain.title')}
                      {currentView === 'turbo' && t('turbo.title')}
                      {currentView === 'speedtest' && t('speedtest.title')}
                      {currentView === 'news' && t('news.title')}
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Live Stats */}
                    <div className="hidden md:flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-slate-400">
                          {scanHistory.filter(h => h.status === 'clean').length} Clean
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-slate-400">
                          {scanHistory.filter(h => h.status === 'dirty').length} Dirty
                        </span>
                      </div>
                    </div>
                    
                    {/* Creator Badge */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-cyan-400 font-medium">{t('app.createdBy')}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Content Area */}
              <div className="p-6">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-7xl mx-auto"
                >
                  {renderContent()}
                </motion.div>
              </div>

              {/* Footer */}
              <footer className="border-t border-slate-800 px-6 py-4 mt-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                  <p>© 2025 Qeshaeae Scanner. All rights reserved.</p>
                  <div className="flex items-center gap-4">
                    <span>Real Ping Measurement</span>
                    <span>•</span>
                    <span>Advanced Network Analysis</span>
                    <span>•</span>
                    <span>AI-Powered</span>
                  </div>
                </div>
              </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
