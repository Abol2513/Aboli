import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Scan,
  Globe,
  Zap,
  Moon,
  Sun,
  Languages,
  Gauge,
  Newspaper,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

type ViewType = 'previous' | 'ip-scan' | 'domain-scan' | 'turbo' | 'speedtest' | 'news';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  language: 'en' | 'fa';
  onLanguageToggle: () => void;
  t: (key: string) => string;
  scanHistoryCount: number;
}

const menuItems: { id: ViewType; icon: typeof History; labelKey: string; badge?: boolean }[] = [
  { id: 'previous', icon: History, labelKey: 'menu.previousIPs', badge: true },
  { id: 'ip-scan', icon: Scan, labelKey: 'menu.ipScanner' },
  { id: 'domain-scan', icon: Globe, labelKey: 'menu.domainScanner' },
  { id: 'turbo', icon: Zap, labelKey: 'menu.turboScan' },
  { id: 'speedtest', icon: Gauge, labelKey: 'menu.speedTest' },
  { id: 'news', icon: Newspaper, labelKey: 'menu.aiNews' },
];

export function Sidebar({
  isOpen,
  onToggle,
  currentView,
  onViewChange,
  theme,
  onThemeToggle,
  language,
  onLanguageToggle,
  t,
  scanHistoryCount,
}: SidebarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden md:flex flex-col h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 z-30"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="logo-expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-sm">QESHAEAE</h1>
                  <p className="text-xs text-slate-400">Scanner</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center mx-auto"
              >
                <Shield className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onViewChange(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                        ${isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="whitespace-nowrap overflow-hidden text-sm font-medium"
                          >
                            {t(item.labelKey)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {item.badge && scanHistoryCount > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-auto bg-cyan-500/20 text-cyan-400 text-xs"
                        >
                          {scanHistoryCount}
                        </Badge>
                      )}
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full"
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                      {t(item.labelKey)}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* Theme Toggle */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onThemeToggle}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-purple-400" />
                  )}
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden text-sm font-medium"
                      >
                        {theme === 'dark' ? t('common.light') : t('common.dark')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  {theme === 'dark' ? t('common.light') : t('common.dark')}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {/* Language Toggle */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLanguageToggle}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <Languages className="w-5 h-5 text-green-400" />
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden text-sm font-medium"
                      >
                        {language === 'fa' ? t('common.en') : t('common.fa')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  {language === 'fa' ? t('common.en') : t('common.fa')}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {/* Logout */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden text-sm font-medium"
                      >
                        {t('menu.logout')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  {t('menu.logout')}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">QESHAEAE</h1>
            <p className="text-xs text-slate-400">Scanner</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="text-slate-400 hover:text-white"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 z-30 bg-slate-900 border-b border-slate-800 p-4"
          >
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
                    <span className="text-sm font-medium">{t(item.labelKey)}</span>
                    {item.badge && scanHistoryCount > 0 && (
                      <Badge className="ml-auto bg-cyan-500/20 text-cyan-400">
                        {scanHistoryCount}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onThemeToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="text-sm">{theme === 'dark' ? t('common.light') : t('common.dark')}</span>
              </button>
              
              <button
                onClick={onLanguageToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Languages className="w-5 h-5" />
                <span className="text-sm">{language === 'fa' ? t('common.en') : t('common.fa')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
