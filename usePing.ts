import { useState, useCallback, useRef } from 'react';

interface PingResult {
  ip: string;
  ping: number;
  success: boolean;
  error?: string;
}

export function usePing() {
  const [isPinging, setIsPinging] = useState(false);
  const [results, setResults] = useState<PingResult[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const ping = useCallback(async (target: string): Promise<PingResult> => {
    const startTime = performance.now();
    
    try {
      // Try to fetch a small resource to measure latency
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch(`https://${target}/favicon.ico`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-store',
      }).catch(() => {
        // Fallback: try without favicon
        return fetch(`https://${target}`, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal,
          cache: 'no-store',
        });
      });
      
      clearTimeout(timeoutId);
      
      const endTime = performance.now();
      const pingTime = Math.round(endTime - startTime);
      
      return {
        ip: target,
        ping: pingTime,
        success: true,
      };
    } catch (error) {
      // Fallback: use DNS resolution timing
      try {
        const dnsStart = performance.now();
        await fetch(`https://dns.google/resolve?name=${target}&type=A`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
        });
        const dnsEnd = performance.now();
        
        return {
          ip: target,
          ping: Math.round(dnsEnd - dnsStart),
          success: true,
        };
      } catch {
        return {
          ip: target,
          ping: -1,
          success: false,
          error: 'Timeout or unreachable',
        };
      }
    }
  }, []);

  const pingMultiple = useCallback(async (targets: string[]) => {
    setIsPinging(true);
    setResults([]);
    
    abortControllerRef.current = new AbortController();
    
    const newResults: PingResult[] = [];
    
    for (const target of targets) {
      if (abortControllerRef.current.signal.aborted) {
        break;
      }
      
      const result = await ping(target);
      newResults.push(result);
      setResults(prev => [...prev, result]);
      
      // Small delay between pings
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsPinging(false);
    return newResults;
  }, [ping]);

  const stopPing = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsPinging(false);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    ping,
    pingMultiple,
    isPinging,
    results,
    stopPing,
    clearResults,
  };
}
