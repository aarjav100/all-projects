import LivePriceTicker from './Dashboard/LivePriceTicker';
import { User, Shield } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="w-full h-16 bg-surface border-b border-border flex items-center justify-between px-6 z-40 relative sticky top-0">
      
      {/* Logo Area */}
      <div className="flex items-center gap-4 border-r border-border pr-6 h-full">
        <div className="w-8 h-8 bg-accent text-background flex items-center justify-center font-bold font-mono text-xl shadow-[0_0_15px_rgba(59,130,246,0.6)]">
          ₿
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-bold text-[15px] tracking-wide text-text-primary uppercase leading-tight">BitPredict_Pro</span>
          <span className="text-[9px] font-mono text-accent-light uppercase tracking-widest leading-tight">Terminal V2.4</span>
        </div>
      </div>

      <div className="flex-1 px-6">
         <LivePriceTicker />
      </div>

      {/* User / Portfolio Summary */}
      <div className="flex items-center gap-6 border-l border-border pl-6 h-full">
         <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#00FF88]/10 border border-[#00FF88]/30">
            <Shield size={14} className="text-[#00FF88]" />
            <span className="text-[11px] font-bold text-[#00FF88] uppercase tracking-wider">Sentiment: Risk-On</span>
         </div>
         
         <div className="flex flex-col items-end">
           <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Equity</span>
           <span className="font-mono text-sm font-bold text-text-primary">$1.48M</span>
         </div>
         
         <div className="w-8 h-8 bg-background border border-border flex items-center justify-center text-accent-light cursor-pointer hover:bg-border transition-colors">
            <User size={16} />
         </div>
      </div>

    </div>
  );
}
