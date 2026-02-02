import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  RefreshCw,
  ExternalLink,
  Clock,
  TrendingUp,
  Sparkles,
  Bot,
  Brain,
  Cpu,
  Code,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  category: 'llm' | 'image' | 'video' | 'code' | 'research' | 'business';
  publishedAt: Date;
  readTime: number;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'GPT-5 Announcement: OpenAI Reveals Next-Generation Model',
    summary: 'OpenAI has officially announced GPT-5 with groundbreaking improvements in reasoning, multimodal capabilities, and reduced hallucinations.',
    source: 'OpenAI Blog',
    url: 'https://openai.com',
    category: 'llm',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    readTime: 5,
  },
  {
    id: '2',
    title: 'DeepSeek Releases New Coding Model with 90% Accuracy',
    summary: 'DeepSeek\'s latest coding assistant achieves state-of-the-art results on HumanEval and other coding benchmarks.',
    source: 'DeepSeek',
    url: 'https://deepseek.com',
    category: 'code',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    readTime: 3,
  },
  {
    id: '3',
    title: 'Kimi AI Introduces 2 Million Token Context Window',
    summary: 'Moonshot AI\'s Kimi now supports context windows up to 2 million tokens, enabling analysis of entire codebases and books.',
    source: 'Moonshot AI',
    url: 'https://kimi.moonshot.cn',
    category: 'llm',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    readTime: 4,
  },
  {
    id: '4',
    title: 'Google Gemini 2.0: Multimodal AI Revolution',
    summary: 'Gemini 2.0 brings native multimodal understanding with seamless integration of text, images, audio, and video.',
    source: 'Google AI',
    url: 'https://gemini.google.com',
    category: 'llm',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    readTime: 6,
  },
  {
    id: '5',
    title: 'Midjourney V7: Photorealistic Image Generation',
    summary: 'The latest version of Midjourney produces images nearly indistinguishable from real photographs.',
    source: 'Midjourney',
    url: 'https://midjourney.com',
    category: 'image',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    readTime: 3,
  },
  {
    id: '6',
    title: 'Runway Gen-4: AI Video Generation Breakthrough',
    summary: 'Runway\'s new model generates consistent characters and scenes across multiple video clips.',
    source: 'Runway',
    url: 'https://runwayml.com',
    category: 'video',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
    readTime: 4,
  },
  {
    id: '7',
    title: 'Claude 4: Anthropic\'s Most Capable AI Assistant',
    summary: 'Claude 4 features enhanced reasoning, longer context, and improved tool use capabilities.',
    source: 'Anthropic',
    url: 'https://claude.ai',
    category: 'llm',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
    readTime: 5,
  },
  {
    id: '8',
    title: 'Perplexity AI Raises $500M at $3B Valuation',
    summary: 'The AI search startup continues its rapid growth with another massive funding round.',
    source: 'TechCrunch',
    url: 'https://techcrunch.com',
    category: 'business',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    readTime: 2,
  },
  {
    id: '9',
    title: 'Stable Diffusion 4: Open Source Image Model',
    summary: 'Stability AI releases the most powerful open-source image generation model to date.',
    source: 'Stability AI',
    url: 'https://stability.ai',
    category: 'image',
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    readTime: 4,
  },
  {
    id: '10',
    title: 'AI Agents: The Next Frontier in Automation',
    summary: 'Research shows AI agents can now perform complex multi-step tasks with 95% accuracy.',
    source: 'AI Research',
    url: 'https://arxiv.org',
    category: 'research',
    publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
    readTime: 7,
  },
];

const CATEGORY_ICONS = {
  llm: Brain,
  image: Sparkles,
  video: Play,
  code: Code,
  research: Cpu,
  business: TrendingUp,
};

const CATEGORY_COLORS = {
  llm: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  image: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  video: 'bg-red-500/20 text-red-400 border-red-500/30',
  code: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  research: 'bg-green-500/20 text-green-400 border-green-500/30',
  business: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function AINews({ t }: { t: (key: string) => string }) {
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        
        // Reset scroll when reaching end
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(n => n.category === selectedCategory);

  const refreshNews = () => {
    // Shuffle and update timestamps
    const shuffled = [...news].sort(() => Math.random() - 0.5);
    setNews(shuffled.map(n => ({
      ...n,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Newspaper className="w-7 h-7 text-cyan-400" />
            {t('news.title')}
          </h2>
          <p className="text-slate-400 mt-1">Latest AI news and updates</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="border-slate-700 text-slate-400"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={refreshNews}
            className="border-slate-700 text-slate-400"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('news.refresh')}
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORY_ICONS).map(([cat, Icon]) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* News Reel */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
        
        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredNews.map((item, index) => {
            const Icon = CATEGORY_ICONS[item.category];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80 snap-start"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${CATEGORY_COLORS[item.category]} capitalize flex items-center gap-1`}>
                        <Icon className="w-3 h-3" />
                        {item.category}
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                      {item.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-slate-500" />
                        <span className="text-xs text-slate-500">{item.source}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="text-xs">{item.readTime} min read</span>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar Animation */}
                  {isPlaying && (
                    <div className="h-1 bg-slate-700">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 10, repeat: Infinity }}
                      />
                    </div>
                  )}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Featured News Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredNews.slice(0, 4).map((item, index) => {
          const Icon = CATEGORY_ICONS[item.category];
          return (
            <motion.div
              key={`featured-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-slate-800/30 border border-slate-700 rounded-xl hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[item.category]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`px-2 py-0.5 rounded text-xs border ${CATEGORY_COLORS[item.category]}`}>
                      {item.category}
                    </div>
                    <span className="text-xs text-slate-500">{formatTimeAgo(item.publishedAt)}</span>
                  </div>
                  
                  <h4 className="text-white font-medium mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {item.summary}
                  </p>
                </div>
                
                <ExternalLink className="w-5 h-5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
