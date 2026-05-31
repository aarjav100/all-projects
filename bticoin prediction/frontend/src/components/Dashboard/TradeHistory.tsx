import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

const equityData = Array.from({ length: 30 }).map((_, i) => ({
  value: 1400000 + (Math.sin(i / 3) * 50000) + (i * 3000) + (Math.random() * 10000)
}));

const trades = [
  { id: 'TRD-901', side: 'LONG',  price: 61200, pnl: '+4,200', pnlPct: '+6.86%', win: true  },
  { id: 'TRD-900', side: 'SHORT', price: 64850, pnl: '+1,150', pnlPct: '+1.77%', win: true  },
  { id: 'TRD-899', side: 'LONG',  price: 63900, pnl: '-2,400', pnlPct: '-3.75%', win: false },
  { id: 'TRD-898', side: 'SHORT', price: 62100, pnl: '+5,800', pnlPct: '+9.33%', win: true  },
];

export default function TradeHistory() {
  return (
    <div className="pro-card p-6 h-full flex flex-col fade-slide-up">
      <div className="text-[12px] font-bold tracking-[0.1em] text-text-primary uppercase mb-4 flex justify-between items-center border-b border-border pb-2">
         <span>Algorithmic Trade History</span>
         <span className="flex items-center gap-1 text-[10px] text-accent-light">
           Win Rate: <strong className="text-text-primary">78.4%</strong>
         </span>
      </div>

      {/* Trade Cards list */}
      <div className="flex flex-col gap-2 mb-6">
        {trades.map((t, i) => (
          <div key={i} className="flex justify-between items-center p-3 border border-border bg-background hover:bg-surface transition-colors cursor-pointer">
             <div className="flex items-center gap-4">
               <div className={`w-10 h-10 flex flex-col items-center justify-center border ${t.side === 'LONG' ? 'border-[#00FF88]/40 bg-[#00FF88]/10 text-[#00FF88]' : 'border-loss-neon/40 bg-loss-neon/10 text-loss-neon'}`}>
                 <span className="text-[9px] font-bold tracking-widest">{t.side}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-text-muted font-mono">{t.id}</span>
                 <span className="font-mono text-[13px] font-bold text-text-primary">${t.price.toLocaleString()}</span>
               </div>
             </div>
             
             <div className="flex flex-col items-end">
               <div className="flex items-center gap-2">
                 {t.win ? (
                   <span className="text-xs bg-accent/20 text-accent-light px-1 font-bold">WIN</span>
                 ) : (
                   <span className="text-xs bg-loss/20 text-loss-neon px-1 font-bold">LOSS</span>
                 )}
               </div>
               <span className={`font-mono text-[12px] font-bold ${t.win ? 'text-[#00FF88]' : 'text-loss-neon'}`}>
                 {t.pnl} ({t.pnlPct})
               </span>
             </div>
          </div>
        ))}
      </div>

      {/* Equity Curve */}
      <div className="flex-1 w-full min-h-[140px] flex flex-col">
        <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
          <Target size={12} /> Cumulative Equity Curve
        </div>
        <div className="flex-1 bg-surface border border-border p-2">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={equityData}>
               <defs>
                 <linearGradient id="colorEq" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                   <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Area type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorEq)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
