import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Server,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { DomainResult } from '@/types';

interface DomainScannerProps {
  t: (key: string) => string;
  onAddToHistory: (result: DomainResult) => void;
}

const AI_SERVICES = [
  { name: 'ChatGPT', domain: 'chat.openai.com', category: 'ai' },
  { name: 'GPT-5', domain: 'openai.com', category: 'ai' },
  { name: 'Kimi AI', domain: 'kimi.moonshot.cn', category: 'ai' },
  { name: 'DeepSeek', domain: 'deepseek.com', category: 'ai' },
  { name: 'Gemini', domain: 'gemini.google.com', category: 'ai' },
  { name: 'AI Studio', domain: 'aistudio.google.com', category: 'ai' },
  { name: 'Claude', domain: 'claude.ai', category: 'ai' },
  { name: 'Perplexity', domain: 'perplexity.ai', category: 'ai' },
  { name: 'Midjourney', domain: 'midjourney.com', category: 'ai' },
  { name: 'Stable Diffusion', domain: 'stability.ai', category: 'ai' },
];

interface DomainInfo {
  domain: string;
  ip: string;
  ping: number;
  status: 'clean' | 'dirty' | 'unknown';
  ssl: boolean;
  sslExpiry?: string;
  dns: string[];
  subdomains: string[];
  whois: {
    registrar: string;
    created: string;
    expires: string;
    updated: string;
  };
}

export function DomainScanner({ t, onAddToHistory }: DomainScannerProps) {
  const [domain, setDomain] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DomainInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const scanDomain = useCallback(async () => {
    if (!domain) return;
    
    setIsScanning(true);
    setResult(null);

    // Simulate domain scan
    await new Promise(resolve => setTimeout(resolve, 2000));

    const ping = Math.floor(Math.random() * 200) + 30;
    const isClean = ping < 100 && Math.random() > 0.2;

    const mockResult: DomainInfo = {
      domain,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      ping,
      status: isClean ? 'clean' : 'dirty',
      ssl: Math.random() > 0.1,
      sslExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dns: [
        `ns1.${domain}`,
        `ns2.${domain}`,
        `ns3.${domain}`,
      ],
      subdomains: [
        `www.${domain}`,
        `api.${domain}`,
        `mail.${domain}`,
        `cdn.${domain}`,
        `blog.${domain}`,
      ],
      whois: {
        registrar: ['Cloudflare', 'GoDaddy', 'Namecheap', 'Google Domains'][Math.floor(Math.random() * 4)],
        created: new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        expires: new Date(Date.now() + Math.random() * 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        updated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    };

    setResult(mockResult);
    setIsScanning(false);

    onAddToHistory({
      domain,
      ip: mockResult.ip,
      ping: mockResult.ping,
      status: mockResult.status,
      service: 'Custom',
      lastTested: new Date(),
      ssl: mockResult.ssl,
    });
  }, [domain, onAddToHistory]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const quickScanAI = (serviceDomain: string) => {
    setDomain(serviceDomain);
    setTimeout(() => scanDomain(), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Globe className="w-7 h-7 text-purple-400" />
          {t('domain.title')}
        </h2>
        <p className="text-slate-400 mt-1">Analyze domain health and connectivity</p>
      </div>

      {/* AI Services Quick Scan */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          AI Services Quick Scan
        </h3>
        <div className="flex flex-wrap gap-2">
          {AI_SERVICES.map((service) => (
            <button
              key={service.name}
              onClick={() => quickScanAI(service.domain)}
              className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-cyan-500/20 border border-slate-600 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 text-sm transition-all duration-200"
            >
              {service.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            placeholder={t('domain.placeholder')}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && scanDomain()}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        <Button
          onClick={scanDomain}
          disabled={isScanning || !domain}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
        >
          {isScanning ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          ) : (
            <Search className="w-5 h-5 mr-2" />
          )}
          {isScanning ? t('domain.checking') : t('domain.check')}
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Overview Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    result.status === 'clean' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {result.status === 'clean' ? (
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{result.domain}</h3>
                    <div className="flex items-center gap-2 mt-1">
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
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> {t('domain.clean')}</>
                        ) : (
                          <><XCircle className="w-3 h-3 mr-1" /> {t('domain.dirty')}</>
                        )}
                      </Badge>
                      {result.ssl && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          <Lock className="w-3 h-3 mr-1" /> SSL
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">{t('scanner.ping')}</p>
                    <p className={`text-2xl font-bold ${
                      result.ping < 50 ? 'text-green-400' : result.ping < 100 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {result.ping}ms
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">IP Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-cyan-400 font-mono">{result.ip}</code>
                    <button
                      onClick={() => copyToClipboard(result.ip, 'ip')}
                      className="text-slate-500 hover:text-white"
                    >
                      {copiedField === 'ip' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">SSL Status</p>
                  <div className="flex items-center gap-2">
                    {result.ssl ? (
                      <><Lock className="w-4 h-4 text-green-400" /><span className="text-green-400">Secure</span></>
                    ) : (
                      <><Unlock className="w-4 h-4 text-red-400" /><span className="text-red-400">Insecure</span></>
                    )}
                  </div>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">SSL Expiry</p>
                  <p className="text-white">{result.sslExpiry}</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Registrar</p>
                  <p className="text-white">{result.whois.registrar}</p>
                </div>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* DNS Records */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('dns')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white">DNS Records</span>
                  </div>
                  {expandedSections.includes('dns') ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes('dns') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-2">
                        {result.dns.map((ns, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                            <code className="text-cyan-400 font-mono text-sm">{ns}</code>
                            <button
                              onClick={() => copyToClipboard(ns, `dns-${i}`)}
                              className="text-slate-500 hover:text-white"
                            >
                              {copiedField === `dns-${i}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Subdomains */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('subdomains')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">{t('domain.subdomains')}</span>
                  </div>
                  {expandedSections.includes('subdomains') ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes('subdomains') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-2">
                        {result.subdomains.map((sub, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                            <code className="text-purple-400 font-mono text-sm">{sub}</code>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyToClipboard(sub, `sub-${i}`)}
                                className="text-slate-500 hover:text-white"
                              >
                                {copiedField === `sub-${i}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                              <a
                                href={`https://${sub}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-cyan-400"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* WHOIS Info */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden md:col-span-2">
                <button
                  onClick={() => toggleSection('whois')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-pink-400" />
                    <span className="font-medium text-white">{t('domain.whois')} Information</span>
                  </div>
                  {expandedSections.includes('whois') ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes('whois') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-slate-900/50 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Registrar</p>
                            <p className="text-white font-medium">{result.whois.registrar}</p>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Created</p>
                            <p className="text-white font-medium">{result.whois.created}</p>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Expires</p>
                            <p className="text-white font-medium">{result.whois.expires}</p>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Last Updated</p>
                            <p className="text-white font-medium">{result.whois.updated}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!result && !isScanning && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800 flex items-center justify-center">
            <Globe className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Enter a domain to scan</h3>
          <p className="text-slate-400">Check domain health, SSL status, and DNS records</p>
        </div>
      )}
    </div>
  );
}
