import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const forecastData = [
  { day: 'Day 1', date: 'Mar 27', price: 64950.00, signal: 'BUY', trend: 'up', change: '+1.08%' },
  { day: 'Day 2', date: 'Mar 28', price: 65200.50, signal: 'BUY', trend: 'up', change: '+0.38%' },
  { day: 'Day 3', date: 'Mar 29', price: 65100.00, signal: 'HOLD', trend: 'flat', change: '-0.15%' },
  { day: 'Day 4', date: 'Mar 30', price: 64800.25, signal: 'SELL', trend: 'down', change: '-0.46%' },
  { day: 'Day 5', date: 'Mar 31', price: 64100.00, signal: 'SELL', trend: 'down', change: '-1.08%' },
  { day: 'Day 6', date: 'Apr 01', price: 63850.50, signal: 'HOLD', trend: 'flat', change: '-0.38%' },
  { day: 'Day 7', date: 'Apr 02', price: 64400.00, signal: 'BUY', trend: 'up', change: '+0.86%' },
];

export default function ForecastTable() {
  return (
    <div className="pro-card p-6 h-full flex flex-col fade-slide-up">
      <div className="text-[12px] font-bold tracking-[0.1em] text-text-primary uppercase mb-6 flex justify-between items-center border-b border-border pb-2">
        <span>7-Day Predictive Path</span>
        <span className="font-mono text-accent-light text-[10px]">Model: Ensemble</span>
      </div>

      <div className="flex-1 w-full overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase text-text-muted tracking-widest">
              <th className="pb-3 pt-1">Date</th>
              <th className="pb-3 pt-1 text-right">Target Price</th>
              <th className="pb-3 pt-1 text-right pr-4">Change</th>
              <th className="pb-3 pt-1 text-center">Signal</th>
              <th className="pb-3 pt-1">Trend</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {forecastData.map((row, idx) => {
              const rowClass = idx % 2 === 0 ? 'bg-background hover:bg-surface' : 'bg-surface hover:bg-border/50';
              const sColor = row.signal === 'BUY' ? '#00FF88' : row.signal === 'SELL' ? '#FF3B3B' : '#F59E0B';
              return (
                <tr key={idx} className={`${rowClass} border-b border-border transition-colors`}>
                  <td className="py-2.5">
                    <span className="font-bold">{row.day}</span>
                    <span className="text-text-muted ml-2 text-[10px]">{row.date}</span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold">
                    ${row.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="py-2.5 text-right pr-4 font-mono font-medium text-[11px]" style={{ color: sColor }}>
                    {row.change}
                  </td>
                  <td className="py-2.5 text-center">
                    <span 
                      className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
                      style={{ color: sColor, backgroundColor: `${sColor}15`, border: `1px solid ${sColor}40` }}
                    >
                      {row.signal}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="w-6 h-6 flex items-center justify-center bg-background border border-border">
                      {row.trend === 'up' && <ArrowUpRight size={14} className="text-[#00FF88]" />}
                      {row.trend === 'down' && <ArrowDownRight size={14} className="text-loss-neon" />}
                      {row.trend === 'flat' && <Minus size={14} className="text-text-muted" />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
