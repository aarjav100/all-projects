import React, { useEffect, useState } from 'react';
import { TradingAPI } from '../../services/api';

type Signal = 'BUY' | 'SELL' | 'HOLD';

export default function SignalBadge() {
  const [signal, setSignal] = useState<Signal>('HOLD');
  const [confidence, setConfidence] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch prediction from Python Backend via API
  useEffect(() => {
    let int: ReturnType<typeof setInterval>;
    
    const fetchSignal = async () => {
      try {
        const data = await TradingAPI.getLatestPrediction();
        
        // Match the combined_signal from Python ("STRONG BUY", "BUY", "SELL")
        let newSignal: Signal = 'HOLD';
        if (data.combined_signal.includes('BUY')) newSignal = 'BUY';
        if (data.combined_signal.includes('SELL')) newSignal = 'SELL';
        
        // Prevent unnecessary state updates if values haven't changed
        setSignal(prev => {
          if (prev !== newSignal) {
            setPulse(true);
            setTimeout(() => setPulse(false), 1500);
          }
          return newSignal;
        });

        // Set CNN confidence
        setConfidence(Math.round(data.cnn_confidence));
      } catch (err) {
        console.error("Failed to load signal", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSignal();
    // Poll the backend every 10 seconds for fresh CSV output
    int = setInterval(fetchSignal, 10000);
    
    return () => clearInterval(int);
  }, []);

  const color = signal === 'BUY' ? '#00FF88' : signal === 'SELL' ? '#FF3B3B' : '#F59E0B';
  const shadowClass = signal === 'BUY' ? 'glow-profit' : signal === 'SELL' ? 'glow-loss' : 'shadow-[0_0_15px_rgba(245,158,11,0.4)]';

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="pro-card p-6 flex flex-col items-center justify-center relative w-full h-[280px]">
      <div className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.15em] text-text-muted uppercase">Global Master Signal</div>
      
      <div className="relative flex items-center justify-center w-[220px] h-[220px]">
        {/* Glow effect back layer */}
        <div 
          className="absolute inset-4 rounded-full opacity-20 blur-[20px] transition-all duration-1000"
          style={{ backgroundColor: color }}
        />
        
        {/* SVG Radial Meter */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="110" cy="110" r={radius} 
            className="stroke-border fill-transparent" strokeWidth="8"
          />
          <circle
            cx="110" cy="110" r={radius} 
            className="fill-transparent transition-all duration-1000 ease-out" 
            strokeWidth="8" stroke={color}
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="square"
          />
        </svg>

        {/* Text inside */}
        <div className={`flex flex-col items-center justify-center ${pulse ? 'animate-pulse' : ''} transition-all duration-[1.5s]`}>
          <span 
            className="font-sans font-bold leading-none tracking-tight transition-colors duration-1000"
            style={{ fontSize: '64px', color: color, textShadow: `0 0 20px ${color}80` }}
          >
            {signal}
          </span>
          <span className="font-mono text-xs font-bold text-text-muted mt-2 tracking-widest">{confidence}% CONFIDENCE</span>
        </div>
      </div>
    </div>
  );
}
