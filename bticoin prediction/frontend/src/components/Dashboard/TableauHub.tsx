import { useEffect, useState } from 'react';
import { RefreshCw, Download, ExternalLink, Database, Server, LineChart as ChartIcon } from 'lucide-react';
import clsx from 'clsx';

export default function TableauHub() {
  const [loading, setLoading] = useState(true);

  // Simulate Tableau iframe loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-full border-t-[3px] border-t-bitcoin">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
            <ChartIcon className="text-bitcoin" />
            Tableau Analytics Hub
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-profit animate-pulse"></div>
            <span className="text-sm text-text-muted">Connected to Tableau Server</span>
          </div>
        </div>

        <div className="flex bg-surface rounded-lg p-1 border border-border">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors border-r border-border">
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors border-r border-border">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors">
            Full Dashboard <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Quick Report Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['Weekly Forecast', 'Model Performance (LSTM)', 'Trade History', 'Portfolio Breakdown'].map((report, idx) => (
          <span key={idx} className={clsx(
            "text-xs px-3 py-1 rounded-full cursor-pointer transition-colors border",
            idx === 0 
              ? "bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]" 
              : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-text-muted"
          )}>
            {report}
          </span>
        ))}
      </div>

      {/* Tableau Frame Placeholder */}
      <div className="flex-1 w-full bg-surface/50 border border-border rounded-xl relative overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-full h-12 bg-border/50 animate-pulse rounded mb-4"></div>
            <div className="flex items-end w-full gap-4 h-48 mb-4">
               <div className="w-1/4 h-[40%] bg-border/30 animate-pulse rounded-t"></div>
               <div className="w-1/4 h-[70%] bg-[#00E5FF]/10 animate-pulse rounded-t"></div>
               <div className="w-1/4 h-[60%] bg-border/20 animate-pulse rounded-t"></div>
               <div className="w-1/4 h-[90%] bg-bitcoin/20 animate-pulse rounded-t"></div>
            </div>
            <div className="w-full h-8 bg-border/40 animate-pulse rounded"></div>
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-background/50">
               <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-[#00E5FF]" size={28} />
                  <span className="font-mono text-sm text-text-muted tracking-widest uppercase">Fetching Dashboard...</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted p-8 text-center bg-surface/30">
            {/* The actual Tableau Embed would go here. */}
            <div className="opacity-40 mb-4 mix-blend-screen">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-bitcoin">
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                 <line x1="3" y1="9" x2="21" y2="9" />
                 <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <p className="font-heading text-xl font-bold mb-2">Tableau Visualization Ready</p>
            <p className="max-w-md text-sm leading-relaxed font-mono opacity-80">
              In a production app, the <code>&lt;tableau-viz&gt;</code> Web Component or iframe injects the server dashboard here.
            </p>
          </div>
        )}
      </div>

      {/* Data Pipeline Vis */}
      <div className="mt-6 flex items-center justify-between text-xs font-mono text-text-muted px-4 py-3 bg-surface/50 border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-text-muted" />
           BTC Data
        </div>
        <div className="flex-1 h-px bg-border mx-4 relative">
           <div className="absolute top-0 left-0 w-1/3 h-full bg-[#00E5FF] shadow-[0_0_5px_#00E5FF] animate-[pulse_2s_infinite]"></div>
        </div>
        <div className="flex items-center gap-2 text-text-primary px-3 py-1 bg-border/50 rounded-md">
          <Server size={14} className="text-bitcoin" />
           ML Model
        </div>
        <div className="flex-1 h-px bg-border mx-4 relative">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-profit shadow-[0_0_5px_#00FF87] animate-[pulse_2s_infinite_1s]"></div>
        </div>
        <div className="flex items-center gap-2">
          <ChartIcon size={14} className="text-[#00FF87]" />
           Tableau
        </div>
      </div>
    </div>
  );
}
