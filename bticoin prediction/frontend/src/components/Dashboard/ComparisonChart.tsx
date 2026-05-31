import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot, Legend } from 'recharts';
import clsx from 'clsx';

const timeRanges = ['1D', '1W', '1M', '3M', '1Y'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const realPrice = payload.find((p: any) => p.dataKey === 'real')?.value;
    const predictedPrice = payload.find((p: any) => p.dataKey === 'predicted')?.value;
    
    const delta = realPrice && predictedPrice ? ((predictedPrice - realPrice) / realPrice) * 100 : 0;

    return (
      <div className="bg-surface/90 backdrop-blur-md border border-border p-4 rounded-xl shadow-xl">
        <p className="text-text-muted text-sm mb-2">{label}</p>
        {realPrice && (
          <p className="text-bitcoin font-mono font-bold">
            Real: ${realPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        )}
        {predictedPrice && (
          <p className="text-[#00E5FF] font-mono font-bold">
            Predicted: ${predictedPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        )}
        {realPrice && predictedPrice && (
          <p className={clsx("text-xs font-bold mt-2", delta >= 0 ? "text-profit" : "text-loss")}>
            Delta: {delta > 0 ? '+' : ''}{delta.toFixed(2)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function ComparisonChart() {
  const [activeRange, setActiveRange] = useState('1M');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/chart-data')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Failed to fetch chart data", err));
  }, []);


  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-text-primary">BTC/USD — Real vs Predicted</h2>
          <p className="text-sm text-text-muted mt-1">Live model tracking on 1h timeframe</p>
        </div>
        
        {/* Time Range Tabs */}
        <div className="flex bg-background border border-border rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={clsx(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                activeRange === range
                  ? "bg-surface text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[350px] mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F7931A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1F2E" vertical={false} />
            <XAxis dataKey="name" stroke="#5A6478" tick={{ fill: '#5A6478', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis 
              domain={['dataMin - 2000', 'dataMax + 2000']} 
              stroke="#5A6478" 
              tick={{ fill: '#5A6478', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            <Area 
              type="monotone" 
              dataKey="real" 
              name="Real Price"
              stroke="#F7931A" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorReal)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              name="Predicted Price"
              stroke="#00E5FF" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent" 
              animationDuration={1500}
              style={{ filter: "drop-shadow(0px 0px 8px rgba(0, 229, 255, 0.5))" }}
            />

            {/* Simulated Buy/Sell Annotation Markers */}
            {data.length > 15 && (
              <>
                <ReferenceDot x={data[5].name} y={data[5].real} r={6} fill="#00FF87" stroke="none" />
                <ReferenceDot x={data[15].name} y={data[15].real} r={6} fill="#FF3B5C" stroke="none" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
