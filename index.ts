export interface IPResult {
  ip: string;
  ping: number;
  status: 'clean' | 'dirty' | 'unknown';
  provider: string;
  location: string;
  lastTested: Date;
  port?: number;
}

export interface DomainResult {
  domain: string;
  ip: string;
  ping: number;
  status: 'clean' | 'dirty' | 'unknown';
  service: string;
  lastTested: Date;
  ssl?: boolean;
}

export interface ScanTarget {
  name: string;
  domains: string[];
  ips?: string[];
  icon: string;
  category: 'social' | 'ai' | 'cdn' | 'streaming' | 'messaging';
}

export interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  server: string;
  timestamp: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  category: string;
}

export interface AppState {
  theme: 'light' | 'dark';
  language: 'fa' | 'en';
  isLoggedIn: boolean;
  scanHistory: IPResult[];
}

export type ScanType = 'ip' | 'domain' | 'turbo';

export interface MenuItem {
  id: string;
  label: string;
  labelFa: string;
  icon: string;
  path: string;
  badge?: number;
}
