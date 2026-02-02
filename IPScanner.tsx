import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Copy,
  Check,
  Server,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Signal,
  Filter,
  Star,
  Scan,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { IPResult, DomainResult } from '@/types';

interface IPScannerProps {
  t: (key: string) => string;
  onAddToHistory: (result: IPResult) => void;
  favorites: (IPResult | DomainResult)[];
  onToggleFavorite: (result: IPResult) => void;
}

const TARGET_SERVERS = [
  { name: 'Cloudflare', domains: ['1.1.1.1', '1.0.0.1', '104.16.0.0/12'], icon: CloudflareIcon },
  { name: 'Discord', domains: ['discord.com', 'discord.gg', 'discordapp.com'], icon: DiscordIcon },
  { name: 'X (Twitter)', domains: ['x.com', 'twitter.com', 'api.twitter.com'], icon: XIcon },
  { name: 'Instagram', domains: ['instagram.com', 'www.instagram.com'], icon: InstagramIcon },
  { name: 'Telegram', domains: ['telegram.org', 'web.telegram.org'], icon: TelegramIcon },
  { name: 'YouTube', domains: ['youtube.com', 'www.youtube.com', 'youtu.be'], icon: YouTubeIcon },
  { name: 'Aparat', domains: ['aparat.com', 'www.aparat.com'], icon: VideoIcon },
];

function CloudflareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12.5 0C9.053 0 6.051 2.2 4.788 5.228a.5.5 0 0 0 .47.692h2.042a.5.5 0 0 0 .47-.328C8.355 4.028 10.286 2.8 12.5 2.8c2.968 0 5.4 2.432 5.4 5.4 0 .276-.024.548-.064.816a.5.5 0 0 0 .496.584h2.032a.5.5 0 0 0 .5-.468c.036-.308.064-.62.064-.932 0-4.628-3.764-8.2-8.468-8.2zM1.5 12a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h21a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-21zm2.5 3.2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h16a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H4zm1.5 3.2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H5.5z"/>
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function VideoIcon() {
  return <Server className="w-5 h-5" />;
}

export function IPScanner({ t, onAddToHistory, favorites, onToggleFavorite }: IPScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState(TARGET_SERVERS[0]);
  const [results, setResults] = useState<IPResult[]>([]);
  const [customIP, setCustomIP] = useState('');
  const [copiedIP, setCopiedIP] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'clean' | 'dirty'>('all');

  const simulateScan = useCallback(async () => {
    setIsScanning(true);
    setProgress(0);
    setResults([]);

    const domains = customIP ? [customIP] : selectedTarget.domains;
    const newResults: IPResult[] = [];

    for (let i = 0; i < domains.length; i++) {
      const domain = domains[i];
      
      // Simulate ping measurement
      const ping = Math.floor(Math.random() * 150) + 20;
      const isClean = ping < 100 && Math.random() > 0.3;
      
      const result: IPResult = {
        ip: domain,
        ping,
        status: isClean ? 'clean' : 'dirty',
        provider: selectedTarget.name,
        location: ['US', 'EU', 'Asia', 'IR'][Math.floor(Math.random() * 4)],
        lastTested: new Date(),
      };

      newResults.push(result);
      setResults([...newResults]);
      setProgress(((i + 1) / domains.length) * 100);
      
      onAddToHistory(result);
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setIsScanning(false);
  }, [selectedTarget, customIP, onAddToHistory]);

  const copyToClipboard = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIP(ip);
    setTimeout(() => setCopiedIP(null), 2000);
  };

  const filteredResults = results.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const stats = {
    total: results.length,
    clean: results.filter(r => r.status === 'clean').length,
    dirty: results.filter(r => r.status === 'dirty').length,
    avgPing: results.length > 0 ? Math.round(results.reduce((a, b) => a + b.ping, 0) / results.length) : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scan className="w-7 h-7 text-cyan-400" />
            {t('scanner.title')}
          </h2>
          <p className="text-slate-400 mt-1">Scan and find the best clean IPs</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setFilter('all')}
            className={`${filter === 'all' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-slate-700 text-slate-400'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            All
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilter('clean')}
            className={`${filter === 'clean' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-slate-700 text-slate-400'}`}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Clean
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilter('dirty')}
            className={`${filter === 'dirty' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'border-slate-700 text-slate-400'}`}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Dirty
          </Button>
        </div>
      </div>

      {/* Target Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {TARGET_SERVERS.map((server) => {
          const Icon = server.icon;
          return (
            <button
              key={server.name}
              onClick={() => {
                setSelectedTarget(server);
                setCustomIP('');
              }}
              className={`
                p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2
                ${selectedTarget.name === server.name && !customIP
                  ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                }
              `}
            >
              <Icon />
              <span className="text-xs font-medium">{server.name}</span>
            </button>
          );
        })}
      </div>

      {/* Custom IP Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Enter custom IP or domain..."
            value={customIP}
            onChange={(e) => setCustomIP(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        <Button
          onClick={simulateScan}
          disabled={isScanning}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6"
        >
          {isScanning ? (
            <Pause className="w-5 h-5 mr-2" />
          ) : (
            <Play className="w-5 h-5 mr-2" />
          )}
          {isScanning ? t('scanner.scanning') : t('scanner.startScan')}
        </Button>
      </div>

      {/* Progress */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm text-slate-400">
              <span>Scanning {selectedTarget.name}...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Server className="w-4 h-4" />
              <span className="text-sm">{t('scanner.totalScanned')}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">{t('scanner.cleanIPs')}</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.clean}</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">{t('scanner.dirtyIPs')}</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.dirty}</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{t('scanner.averagePing')}</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">{stats.avgPing}ms</p>
          </div>
        </motion.div>
      )}

      {/* Results Table */}
      {filteredResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">IP/Domain</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">{t('scanner.ping')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">{t('scanner.status')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">{t('scanner.provider')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">{t('scanner.location')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredResults.map((result, index) => (
                  <motion.tr
                    key={`${result.ip}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <span className="text-white font-mono text-sm">{result.ip}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Signal className={`w-4 h-4 ${result.ping < 50 ? 'text-green-400' : result.ping < 100 ? 'text-yellow-400' : 'text-red-400'}`} />
                        <span className={`font-mono ${result.ping < 50 ? 'text-green-400' : result.ping < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {result.ping}ms
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={`
                          ${result.status === 'clean' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }
                        `}
                      >
                        {result.status === 'clean' ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> Clean</>
                        ) : (
                          <><XCircle className="w-3 h-3 mr-1" /> Dirty</>
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{result.provider}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {result.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyToClipboard(result.ip)}
                          className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          title="Copy"
                        >
                          {copiedIP === result.ip ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onToggleFavorite(result)}
                          className={`p-2 rounded-lg hover:bg-slate-700 transition-colors ${favorites.some(f => 'ip' in f && f.ip === result.ip) ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}
                          title="Add to favorites"
                        >
                          <Star className={`w-4 h-4 ${favorites.some(f => 'ip' in f && f.ip === result.ip) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {results.length === 0 && !isScanning && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800 flex items-center justify-center">
            <Scan className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No scans yet</h3>
          <p className="text-slate-400">Select a target and start scanning to find clean IPs</p>
        </div>
      )}
    </div>
  );
}
