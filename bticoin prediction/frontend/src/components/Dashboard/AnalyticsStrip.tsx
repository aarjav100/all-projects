import { Cpu, Gauge, Clock, ArrowUpDown } from 'lucide-react';

export default function AnalyticsStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 24h High/Low */}
      <div className="glass-card rounded-xl p-5 flex items-center gap-4 transition-colors hover:border-[#00E5FF]/40">
        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-text-muted">
          <ArrowUpDown size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-text-muted font-medium">24h High / Low</span>
          <span className="font-mono text-sm font-bold text-text-primary mt-1">
            <span className="text-profit">65.2k</span> <span className="text-text-muted font-normal mx-1">/</span> <span className="text-loss">62.8k</span>
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="glass-card rounded-xl p-5 flex items-center gap-4 transition-colors hover:border-[#00E5FF]/40">
        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-text-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-text-muted font-medium">Trading Volume (BTC)</span>
          <span className="font-mono text-sm font-bold text-text-primary mt-1">
            24,185.3
          </span>
        </div>
      </div>

      {/* Model Retrained */}
      <div className="glass-card rounded-xl p-5 flex items-center gap-4 transition-colors hover:border-[#00E5FF]/40">
        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-text-muted">
          <Cpu size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-text-muted font-medium">Model Synchronized</span>
          <div className="flex items-center gap-1 mt-1">
            <Clock size={12} className="text-[#00E5FF]" />
            <span className="font-mono text-sm font-bold text-text-primary">2 mins ago</span>
          </div>
        </div>
      </div>

      {/* Fear & Greed */}
      <div className="glass-card rounded-xl p-5 flex items-center gap-4 transition-colors hover:border-[#00E5FF]/40 relative overflow-hidden">
        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-text-muted z-10">
          <Gauge size={20} />
        </div>
        <div className="flex flex-col z-10">
          <span className="text-xs text-text-muted font-medium">Fear & Greed Index</span>
          <span className="font-heading text-sm font-bold text-profit mt-1">
            72 — Greed
          </span>
        </div>
        
        {/* Decorative Gauge background */}
        <div className="absolute right-[-20%] bottom-[-50%] w-24 h-24 rounded-full border-4 border-profit/20 border-t-profit" style={{ transform: 'rotate(-45deg)' }}></div>
      </div>
    </div>
  );
}
