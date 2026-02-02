import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Trash2,
  Star,
  Copy,
  Check,
  Filter,
  Search,
  Download,
  Upload,
  Clock,
  Server,
  Globe,
  CheckCircle2,
  XCircle,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { IPResult, DomainResult } from '@/types';

interface PreviousIPsProps {
  t: (key: string) => string;
  history: (IPResult | DomainResult)[];
  favorites: (IPResult | DomainResult)[];
  onClearHistory: () => void;
  onRemoveItem: (index: number) => void;
  onToggleFavorite: (item: IPResult | DomainResult) => void;
}

type SortField = 'date' | 'ping' | 'status';
type SortOrder = 'asc' | 'desc';

export function PreviousIPs({ 
  t, 
  history, 
  favorites, 
  onClearHistory, 
  onRemoveItem,
  onToggleFavorite 
}: PreviousIPsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'clean' | 'dirty'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  const isIPResult = (item: IPResult | DomainResult): item is IPResult => {
    return 'ip' in item && !('domain' in item);
  };

  const getItemKey = (item: IPResult | DomainResult, index: number) => {
    if (isIPResult(item)) {
      return `ip-${item.ip}-${index}`;
    }
    return `domain-${item.domain}-${index}`;
  };

  const getItemDisplay = (item: IPResult | DomainResult) => {
    if (isIPResult(item)) {
      return item.ip;
    }
    return item.domain;
  };

  const filterAndSort = (items: (IPResult | DomainResult)[]) => {
    let filtered = items.filter(item => {
      const display = getItemDisplay(item).toLowerCase();
      const matchesSearch = display.includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(b.lastTested).getTime() - new Date(a.lastTested).getTime();
          break;
        case 'ping':
          comparison = a.ping - b.ping;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  };

  const filteredHistory = filterAndSort(history);
  const filteredFavorites = filterAndSort(favorites);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(text);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const exportData = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        console.log('Imported:', data);
      } catch (error) {
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderItem = (item: IPResult | DomainResult, index: number, isFavorite: boolean) => {
    const key = getItemKey(item, index);
    const display = getItemDisplay(item);
    const isIP = isIPResult(item);

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            item.status === 'clean' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {isIP ? (
              <Server className={`w-5 h-5 ${item.status === 'clean' ? 'text-green-400' : 'text-red-400'}`} />
            ) : (
              <Globe className={`w-5 h-5 ${item.status === 'clean' ? 'text-green-400' : 'text-red-400'}`} />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <code className="text-white font-mono">{display}</code>
              <div className={`px-2 py-0.5 rounded text-xs ${
                item.status === 'clean' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {item.status === 'clean' ? 'Clean' : 'Dirty'}
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(item.lastTested).toLocaleString()}
              </span>
              <span className={`${
                item.ping < 50 ? 'text-green-400' : item.ping < 100 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {item.ping}ms
              </span>
              {'provider' in item && <span>• {item.provider}</span>}
              {'service' in item && <span>• {item.service}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(display)}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Copy"
          >
            {copiedItem === display ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onToggleFavorite(item)}
            className={`p-2 rounded-lg hover:bg-slate-700 transition-colors ${
              isFavorite ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          {!isFavorite && (
            <button
              onClick={() => onRemoveItem(index)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const currentItems = activeTab === 'history' ? filteredHistory : filteredFavorites;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-cyan-400" />
            {t('menu.previousIPs')}
          </h2>
          <p className="text-slate-400 mt-1">View and manage your scan history</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
            <Button variant="outline" className="border-slate-700 text-slate-400" asChild>
              <span><Upload className="w-4 h-4 mr-2" /> Import</span>
            </Button>
          </label>
          <Button
            variant="outline"
            onClick={exportData}
            disabled={history.length === 0}
            className="border-slate-700 text-slate-400"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button
            variant="outline"
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          History ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            activeTab === 'favorites'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          Favorites ({favorites.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search IPs or domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFilterStatus('all')}
            className={`${filterStatus === 'all' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-slate-700 text-slate-400'}`}
          >
            <Filter className="w-4 h-4 mr-2" /> All
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilterStatus('clean')}
            className={`${filterStatus === 'clean' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-slate-700 text-slate-400'}`}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Clean
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilterStatus('dirty')}
            className={`${filterStatus === 'dirty' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'border-slate-700 text-slate-400'}`}
          >
            <XCircle className="w-4 h-4 mr-2" /> Dirty
          </Button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <span className="text-sm text-slate-400 py-2">Sort by:</span>
        {(['date', 'ping', 'status'] as SortField[]).map((field) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1 ${
              sortField === field
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {sortField === field && (
              sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>

      {/* Items List */}
      <AnimatePresence mode="popLayout">
        {currentItems.length > 0 ? (
          <div className="space-y-2">
            {currentItems.map((item, index) => 
              renderItem(item, index, activeTab === 'favorites')
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800 flex items-center justify-center">
              {activeTab === 'history' ? (
                <History className="w-12 h-12 text-slate-600" />
              ) : (
                <Star className="w-12 h-12 text-slate-600" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'history' ? 'No history yet' : 'No favorites'}
            </h3>
            <p className="text-slate-400">
              {activeTab === 'history' 
                ? 'Start scanning to build your history' 
                : 'Add items to favorites for quick access'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
