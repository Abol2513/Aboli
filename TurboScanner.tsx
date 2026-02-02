import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Server,
  Globe,
  CheckCircle2,
  XCircle,
  Activity,
  Target,
  Settings,
  Cpu,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import type { IPResult, DomainResult } from '@/types';

interface TurboScannerProps {
  t: (key: string) => string;
  onAddToHistory: (result: IPResult | DomainResult) => void;
}

interface ScanJob {
  id: string;
  target: string;
  type: 'ip' | 'domain';
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  progress: number;
  result?: {
    ping: number;
    status: 'clean' | 'dirty';
  };
}

const PRESETS = {
  all: [
    '1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4',
    'discord.com', 'twitter.com', 'instagram.com', 'telegram.org',
    'openai.com', 'gemini.google.com', 'deepseek.com', 'kimi.moonshot.cn',
    'youtube.com', 'aparat.com', 'cloudflare.com',
  ],
  social: ['discord.com', 'twitter.com', 'instagram.com', 'telegram.org'],
  ai: ['openai.com', 'gemini.google.com', 'deepseek.com', 'kimi.moonshot.cn', 'claude.ai'],
  cdn: ['cloudflare.com', 'fastly.com', 'akamai.com'],
};

export function TurboScanner({ t, onAddToHistory }: TurboScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [jobs, setJobs] = useState<ScanJob[]>([]);
  const [threads, setThreads] = useState(5);
  const [timeoutValue, setTimeoutValue] = useState(5000);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESETS>('all');
  const [customTargets, setCustomTargets] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const createJobs = useCallback(() => {
    const targets = customTargets 
      ? customTargets.split('\n').filter(t => t.trim())
      : PRESETS[selectedPreset];
    
    return targets.map((target, i) => ({
      id: `job-${i}`,
      target: target.trim(),
      type: target.match(/^\d+\.\d+\.\d+\.\d+$/) ? 'ip' as const : 'domain' as const,
      status: 'pending' as const,
      progress: 0,
    }));
  }, [selectedPreset, customTargets]);

  const startScan = useCallback(async () => {
    const newJobs = createJobs();
    setJobs(newJobs);
    setIsScanning(true);

    const batchSize = threads;
    for (let i = 0; i < newJobs.length; i += batchSize) {
      const batch = newJobs.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (job) => {
        setJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: 'scanning' } : j
        ));

        // Simulate scan progress
        for (let prog = 0; prog <= 100; prog += 20) {
          await new Promise(resolve => setTimeout(resolve, timeoutValue / 5 / batchSize));
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, progress: prog } : j
          ));
        }

        const ping = Math.floor(Math.random() * 150) + 20;
        const isClean = ping < 100;

        setJobs(prev => prev.map(j => 
          j.id === job.id ? { 
            ...j, 
            status: 'completed',
            progress: 100,
            result: { ping, status: isClean ? 'clean' : 'dirty' }
          } : j
        ));

        // Add to history
        if (job.type === 'ip') {
          onAddToHistory({
            ip: job.target,
            ping,
            status: isClean ? 'clean' : 'dirty',
            provider: 'Turbo Scan',
            location: 'Unknown',
            lastTested: new Date(),
          });
        } else {
          onAddToHistory({
            domain: job.target,
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            ping,
            status: isClean ? 'clean' : 'dirty',
            service: 'Turbo Scan',
            lastTested: new Date(),
          });
        }
      }));
    }

    setIsScanning(false);
  }, [createJobs, threads, timeoutValue, onAddToHistory]);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    setJobs(prev => prev.map(j => j.status === 'scanning' ? { ...j, status: 'failed' } : j));
  }, []);

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === 'completed').length,
    clean: jobs.filter(j => j.result?.status === 'clean').length,
    dirty: jobs.filter(j => j.result?.status === 'dirty').length,
    avgPing: jobs.filter(j => j.result).length > 0
      ? Math.round(jobs.filter(j => j.result).reduce((a, b) => a + (b.result?.ping || 0), 0) / jobs.filter(j => j.result).length)
      : 0,
  };

  const overallProgress = jobs.length > 0 
    ? jobs.reduce((a, b) => a + b.progress, 0) / jobs.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="w-7 h-7 text-yellow-400" />
            {t('turbo.title')}
          </h2>
          <p className="text-slate-400 mt-1">{t('turbo.description')}</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowSettings(!showSettings)}
          className="border-slate-700 text-slate-400 hover:text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300 mb-3">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  {t('turbo.threads')}: {threads}
                </label>
                <Slider
                  value={[threads]}
                  onValueChange={(v) => setThreads(v[0])}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300 mb-3">
                  <Activity className="w-4 h-4 text-purple-400" />
                  {t('turbo.timeout')}: {timeoutValue}ms
                </label>
                <Slider
                  value={[timeoutValue]}
                  onValueChange={(v) => setTimeoutValue(v[0])}
                  min={1000}
                  max={10000}
                  step={500}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preset Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.keys(PRESETS).map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setSelectedPreset(preset as keyof typeof PRESETS);
              setCustomTargets('');
            }}
            className={`
              p-4 rounded-xl border transition-all duration-200 capitalize
              ${selectedPreset === preset && !customTargets
                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
              }
            `}
          >
            <Target className="w-5 h-5 mx-auto mb-2" />
            <span className="text-sm font-medium">{preset}</span>
            <p className="text-xs text-slate-500 mt-1">{PRESETS[preset as keyof typeof PRESETS].length} targets</p>
          </button>
        ))}
      </div>

      {/* Custom Targets */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Custom Targets (one per line)</label>
        <textarea
          value={customTargets}
          onChange={(e) => setCustomTargets(e.target.value)}
          placeholder="Enter IPs or domains...&#10;1.1.1.1&#10;example.com"
          className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-500 resize-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={isScanning ? stopScan : startScan}
          className={`flex-1 ${
            isScanning 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
          } text-white font-semibold py-6`}
        >
          {isScanning ? (
            <><Pause className="w-5 h-5 mr-2" /> Stop Scan</>
          ) : (
            <><Play className="w-5 h-5 mr-2" /> Start Turbo Scan</>
          )}
        </Button>
        
        {jobs.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              setJobs([]);
              setIsScanning(false);
            }}
            className="border-slate-700 text-slate-400"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Progress */}
      {jobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Overall Progress</span>
            <span className="text-white font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 bg-slate-800" />
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-cyan-400">{stats.clean}</p>
              <p className="text-xs text-slate-400">Clean</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{stats.dirty}</p>
              <p className="text-xs text-slate-400">Dirty</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{stats.avgPing}ms</p>
              <p className="text-xs text-slate-400">Avg Ping</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Jobs Grid */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                relative p-4 rounded-xl border overflow-hidden
                ${job.status === 'completed' 
                  ? job.result?.status === 'clean'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                  : job.status === 'scanning'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-slate-800/50 border-slate-700'
                }
              `}
            >
              {/* Progress Bar */}
              {job.status === 'scanning' && (
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                />
              )}
              
              <div className="flex items-center gap-2 mb-2">
                {job.type === 'ip' ? (
                  <Server className="w-4 h-4 text-slate-400" />
                ) : (
                  <Globe className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs text-slate-500 uppercase">{job.type}</span>
              </div>
              
              <p className="text-white font-medium text-sm truncate mb-2">{job.target}</p>
              
              {job.status === 'completed' && job.result && (
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      job.result.status === 'clean' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {job.result.status === 'clean' ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Clean</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Dirty</>
                    )}
                  </Badge>
                  <span className={`text-xs font-mono ${
                    job.result.ping < 50 ? 'text-green-400' : job.result.ping < 100 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {job.result.ping}ms
                  </span>
                </div>
              )}
              
              {job.status === 'scanning' && (
                <div className="flex items-center gap-2 text-yellow-400 text-xs">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Scanning...
                </div>
              )}
              
              {job.status === 'pending' && (
                <div className="text-slate-500 text-xs">Waiting...</div>
              )}
              
              {job.status === 'failed' && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  Failed
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
