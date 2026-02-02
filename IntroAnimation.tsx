import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, Server } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showHello, setShowHello] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowHello(true);
    }, 1500);

    const timer2 = setTimeout(() => {
      setShowLogo(false);
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showLogo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 grid-bg opacity-50" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  opacity: 0,
                }}
                animate={{
                  y: [null, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main Logo Container */}
          <div className="relative flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              className="relative w-40 h-40 mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 100 }}
            >
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 border-4 border-cyan-400/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Middle Ring */}
              <motion.div
                className="absolute inset-4 border-4 border-purple-400/40 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Inner Ring */}
              <motion.div
                className="absolute inset-8 border-4 border-pink-400/50 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />

              {/* Center Logo */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
              >
                <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-10 h-10 text-white" />
                  
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl blur-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Orbiting Icons */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-cyan-400/50">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-purple-400/50">
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-pink-400/50">
                  <Server className="w-4 h-4 text-pink-400" />
                </div>
              </motion.div>
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold gradient-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              QESHAEAE
            </motion.h1>

            <motion.p
              className="text-slate-400 text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Advanced IP & Domain Scanner
            </motion.p>

            {/* Hello Animation */}
            <AnimatePresence>
              {showHello && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-3xl font-bold shadow-2xl">
                    Hello!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Bar */}
            <motion.div
              className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 1.2 }}
              />
            </motion.div>

            {/* Creator Credit */}
            <motion.p
              className="absolute bottom-8 text-slate-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Created by Qeshaeae
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
