import { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown } from 'lucide-react';

const sparklineData = Array.from({ length: 60 }).map((_, i) => ({
  value: 64000 + (Math.random() - 0.4) * 1000 + (i * 10)
}));

export default function LivePriceTicker() {
  const [price, setPrice] = useState(64250.50);
  const [change, setChange] = useState<'up'|'down'>('up');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const int = setInterval(() => {
      const dir = Math.random() > 0.4 ? 1 : -1;
      setPrice(prev => {
        const p = prev + (Math.random() * 50 * dir);
        setChange(p >= prev ? 'up' : 'down');
        return p;
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 3000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="flex items-center gap-4 bg-surface px-4 py-2 border border-border">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-text-muted tracking-[0.1em]">BTC/USD LIVE</span>
        <div className="flex items-center gap-2">
          <span className={`font-mono text-3xl font-bold transition-colors duration-300 ${
              pulse ? (change === 'up' ? 'text-[#00FF88]' : 'text-loss-neon') : 'text-text-primary'
            } slot-machine`}>
            ${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </span>
        </div>
      </div>

      <div className={`flex items-center gap-1 font-mono text-sm font-bold px-2 py-1 ${change === 'up' ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-loss-neon/10 text-loss-neon'}`}>
         {change === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
         {change === 'up' ? '+' : ''}{(1.24).toFixed(2)}%
      </div>

      <div className="w-32 h-10 ml-4 hidden lg:block opacity-70">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={1.5} fill="rgba(59, 130, 246, 0.1)" />
            </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
