import { useState } from 'react';

export default function RiskCalculator() {
  const [entry, setEntry] = useState(64250);
  const [stop, setStop] = useState(62800);
  const [target, setTarget] = useState(67000);
  const [size, setSize] = useState(2.5); // BTC

  const risk = (entry - stop) * size;
  const reward = (target - entry) * size;
  const rrRatio = reward / risk;

  const totalRange = target - stop;
  const entryPos = ((entry - stop) / totalRange) * 100;

  return (
    <div className="pro-card p-6 flex flex-col h-full fade-slide-up">
      <div className="text-[12px] font-bold tracking-[0.1em] text-text-primary uppercase mb-6 flex justify-between items-center border-b border-border pb-2">
        <span>Risk & Position Manager</span>
        <span className="font-mono text-accent-light">R:R {rrRatio.toFixed(2)}</span>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Input Form */}
        <div className="w-1/2 flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Entry Price (USD)</label>
            <input 
              type="number" value={entry} onChange={e => setEntry(Number(e.target.value))}
              className="bg-background border border-border text-text-primary font-mono text-sm px-3 py-2 w-full focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 text-[#00FF88]">Take Profit</label>
            <input 
              type="number" value={target} onChange={e => setTarget(Number(e.target.value))}
              className="bg-background border border-border text-[#00FF88] font-mono text-sm px-3 py-2 w-full focus:outline-none focus:border-[#00FF88]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 text-loss-neon">Stop Loss</label>
            <input 
              type="number" value={stop} onChange={e => setStop(Number(e.target.value))}
              className="bg-background border border-border text-loss-neon font-mono text-sm px-3 py-2 w-full focus:outline-none focus:border-loss-neon"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Position Size (BTC)</label>
            <input 
              type="number" value={size} step="0.1" onChange={e => setSize(Number(e.target.value))}
              className="bg-background border border-border text-accent-light font-mono text-sm px-3 py-2 w-full focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Visual Ruler & Output */}
        <div className="w-1/2 flex gap-4 pl-4 border-l border-border">
          {/* Vertical Ruler */}
          <div className="w-6 h-full bg-background border border-border relative">
            <div className="absolute top-0 w-full bg-[#00FF88]/20 border-t border-[#00FF88]" style={{ height: `${100 - entryPos}%` }}></div>
            <div className="absolute bottom-0 w-full bg-loss-neon/20 border-b border-loss-neon" style={{ height: `${entryPos}%` }}></div>
            
            {/* Markers */}
            <div className="absolute w-12 h-[1px] bg-[#00FF88] -left-3 top-0"></div>
            <div className="absolute w-12 h-[1px] bg-accent-light left-0 z-10" style={{ top: `${100 - entryPos}%` }}></div>
            <div className="absolute w-12 h-[1px] bg-loss-neon -left-3 bottom-0"></div>
          </div>

          <div className="flex flex-col justify-between py-1 w-full flex-1">
            <div>
              <div className="text-[10px] text-text-muted font-bold uppercase mb-1">Target P&L</div>
              <div className="font-mono text-xl text-[#00FF88] font-bold">+${reward.toLocaleString()}</div>
            </div>
            
            <div className="border border-border p-2 bg-background flex flex-col justify-center items-center">
              <span className="text-[9px] text-text-muted font-bold tracking-widest">Entry</span>
              <span className="font-mono font-bold text-sm text-accent-light">${entry.toLocaleString()}</span>
            </div>

            <div>
              <div className="text-[10px] text-text-muted font-bold uppercase mb-1">Risked Capital</div>
              <div className="font-mono text-lg text-loss-neon font-bold">-${risk.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
