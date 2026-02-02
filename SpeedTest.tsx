import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gauge,
  Play,
  RotateCcw,
  Download,
  Upload,
  Clock,
  Activity,
  Server,
  MapPin,
  History,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SpeedTestResult } from '@/types';

interface SpeedTestProps {
  t: (key: string) => string;
}

const TEST_SERVERS = [
  { name: 'Auto Select', location: 'Best Server', distance: 0 },
  { name: 'Cloudflare', location: 'Global CDN', distance: 10 },
  { name: 'Fastly', location: 'US East', distance: 120 },
  { name: 'AWS', location: 'Europe', distance: 250 },
  { name: 'Google', location: 'Asia', distance: 180 },
];

export function SpeedTest({ t }: SpeedTestProps) {
  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedServer, setSelectedServer] = useState(TEST_SERVERS[0]);
  const [showServerSelect, setShowServerSelect] = useState(false);
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const [gaugeValue, setGaugeValue] = useState(0);

  // Load history from localStorage
  useState(() => {
    const saved = localStorage.getItem('speedTestHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  });

  const simulateTest = useCallback(async () => {
    setPhase('ping');
    setProgress(0);
    setGaugeValue(0);

    // Ping phase
    const pingValues: number[] = [];
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const ping = Math.floor(Math.random() * 30) + 10;
      pingValues.push(ping);
      setGaugeValue(ping * 3);
    }
    const avgPing = Math.round(pingValues.reduce((a, b) => a + b, 0) / pingValues.length);
    const jitter = Math.round(Math.sqrt(pingValues.reduce((sum, p) => sum + Math.pow(p - avgPing, 2), 0) / pingValues.length));

    // Download phase
    setPhase('download');
    setProgress(0);
    
    const downloadSpeeds: number[] = [];
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress(i);
      const speed = Math.random() * 50 + 50 + Math.sin(i / 10) * 20;
      downloadSpeeds.push(speed);
      setGaugeValue(Math.min(speed * 2, 200));
    }
    const avgDownload = Math.round(downloadSpeeds.reduce((a, b) => a + b, 0) / downloadSpeeds.length * 10) / 10;

    // Upload phase
    setPhase('upload');
    setProgress(0);
    
    const uploadSpeeds: number[] = [];
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 60));
      setProgress(i);
      const speed = Math.random() * 30 + 20 + Math.sin(i / 10) * 10;
      uploadSpeeds.push(speed);
      setGaugeValue(Math.min(speed * 3, 150));
    }
    const avgUpload = Math.round(uploadSpeeds.reduce((a, b) => a + b, 0) / uploadSpeeds.length * 10) / 10;

    // Complete
    const newResult: SpeedTestResult = {
      downloadSpeed: avgDownload,
      uploadSpeed: avgUpload,
      ping: avgPing,
      jitter,
      server: selectedServer.name,
      timestamp: new Date(),
    };

    setResult(newResult);
    setPhase('complete');
    setGaugeValue(0);

    // Save to history
    const newHistory = [newResult, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('speedTestHistory', JSON.stringify(newHistory));
  }, [selectedServer, history]);

  const getPhaseColor = () => {
    switch (phase) {
      case 'ping': return 'text-cyan-400';
      case 'download': return 'text-green-400';
      case 'upload': return 'text-purple-400';
      default: return 'text-white';
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'ping': return 'Measuring Ping...';
      case 'download': return 'Testing Download...';
      case 'upload': return 'Testing Upload...';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Gauge className="w-7 h-7 text-green-400" />
            {t('speedtest.title')}
          </h2>
          <p className="text-slate-400 mt-1">Test your internet connection speed</p>
        </div>
        
        {/* Server Selection */}
        <div className="relative">
          <button
            onClick={() => setShowServerSelect(!showServerSelect)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:border-slate-600 transition-colors"
          >
            <Server className="w-4 h-4 text-cyan-400" />
            <span>{selectedServer.name}</span>
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">{selectedServer.location}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
          
          <AnimatePresence>
            {showServerSelect && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-10"
              >
                {TEST_SERVERS.map((server) => (
                  <button
                    key={server.name}
                    onClick={() => {
                      setSelectedServer(server);
                      setShowServerSelect(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700 transition-colors"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{server.name}</p>
                      <p className="text-slate-400 text-xs">{server.location}</p>
                    </div>
                    {selectedServer.name === server.name && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Gauge */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-80 h-40">
          {/* SVG Gauge */}
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="15"
              strokeLinecap="round"
            />
            
            {/* Value Arc */}
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (gaugeValue / 200) * 251.2 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Ticks */}
            {[0, 25, 50, 75, 100, 125, 150, 175, 200].map((tick, i) => {
              const angle = (i / 8) * 180;
              const rad = (angle * Math.PI) / 180;
              const x1 = 100 + 65 * Math.cos(rad);
              const y1 = 100 - 65 * Math.sin(rad);
              const x2 = 100 + 75 * Math.cos(rad);
              const y2 = 100 - 75 * Math.sin(rad);
              
              return (
                <g key={tick}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="2" />
                  <text
                    x={100 + 55 * Math.cos(rad)}
                    y={100 - 55 * Math.sin(rad)}
                    fill="#64748b"
                    fontSize="8"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center Value */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <motion.div
              key={phase}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold gradient-text"
            >
              {phase === 'complete' && result ? (
                result.downloadSpeed
              ) : phase === 'idle' ? (
                '0.0'
              ) : (
                gaugeValue.toFixed(1)
              )}
            </motion.div>
            <p className="text-slate-400 text-sm mt-1">
              {phase === 'complete' ? 'Mbps Download' : phase === 'idle' ? 'Mbps' : getPhaseLabel()}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {phase !== 'idle' && phase !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className={getPhaseColor()}>{getPhaseLabel()}</span>
            <span className="text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                phase === 'ping' ? 'bg-cyan-400' :
                phase === 'download' ? 'bg-green-400' :
                'bg-purple-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Results */}
      {phase === 'complete' && result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <Download className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{result.downloadSpeed}</p>
            <p className="text-xs text-slate-400">{t('speedtest.download')} Mbps</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <Upload className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{result.uploadSpeed}</p>
            <p className="text-xs text-slate-400">{t('speedtest.upload')} Mbps</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{result.ping}</p>
            <p className="text-xs text-slate-400">{t('speedtest.ping')} ms</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <Activity className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{result.jitter}</p>
            <p className="text-xs text-slate-400">{t('speedtest.jitter')} ms</p>
          </div>
        </motion.div>
      )}

      {/* Control Button */}
      <div className="flex justify-center">
        <Button
          onClick={phase === 'idle' || phase === 'complete' ? simulateTest : () => {}}
          disabled={phase !== 'idle' && phase !== 'complete'}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 text-lg font-semibold"
        >
          {phase === 'idle' ? (
            <><Play className="w-5 h-5 mr-2" /> {t('speedtest.start')}</>
          ) : phase === 'complete' ? (
            <><RotateCcw className="w-5 h-5 mr-2" /> Test Again</>
          ) : (
            <><Activity className="w-5 h-5 mr-2 animate-pulse" /> {t('speedtest.testing')}</>
          )}
        </Button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            {t('speedtest.history')}
          </h3>
          
          <div className="space-y-3">
            {history.slice(0, 5).map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{item.downloadSpeed}</p>
                    <p className="text-xs text-slate-500">Mbps</p>
                  </div>
                  <div className="h-8 w-px bg-slate-700" />
                  <div>
                    <p className="text-sm text-slate-300">{item.server}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-400">
                    <Download className="w-4 h-4" />
                    {item.downloadSpeed}
                  </div>
                  <div className="flex items-center gap-1 text-purple-400">
                    <Upload className="w-4 h-4" />
                    {item.uploadSpeed}
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400">
                    <Clock className="w-4 h-4" />
                    {item.ping}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
