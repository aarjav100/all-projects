import { Target, Shield, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PredictionInsights() {
  const [data, setData] = useState({
    min_band: 63100.00,
    predicted_close: 64950.00,
    max_band: 65800.00,
    cnn_confidence: 91.2,
    cnn_pattern: 'Bull flag',
    combined_signal: 'STRONG BUY'
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/prediction')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Failed to fetch api", err));
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 24h Predicted Range */}
      <div className="glass-card rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:glow-cyan">
        <div className="text-text-muted text-sm font-medium mb-4">Next 24h Predicted Range</div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-surface border border-border px-3 py-2 rounded-lg">
            <span className="text-text-muted text-xs">Max (Band)</span>
            <span className="font-mono font-bold text-profit">${data.max_band.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between items-center bg-surface border border-border px-3 py-2 rounded-lg">
            <span className="text-text-muted text-xs">Expected</span>
            <span className="font-mono font-bold text-[#00E5FF]">${data.predicted_close.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between items-center bg-surface border border-border px-3 py-2 rounded-lg">
            <span className="text-text-muted text-xs">Min (Band)</span>
            <span className="font-mono font-bold text-loss">${data.min_band.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>
      </div>

      {/* Sentiment & Accuracy */}
      <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:glow-bitcoin">
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-text-muted text-sm font-medium">Model Status ({data.cnn_pattern})</span>
            <span className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono text-[#00E5FF]">
              LSTM · {data.cnn_confidence.toFixed(1)}% Acc
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚡</span>
              <span className="font-heading font-bold text-lg text-profit">{data.combined_signal}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-border overflow-hidden flex">
              <div className="h-full bg-loss" style={{ width: '15%' }}></div>
              <div className="h-full bg-text-muted" style={{ width: '10%' }}></div>
              <div className="h-full bg-profit glow-profit" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-loss/10 text-loss flex items-center justify-center">
                <Shield size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted">Resistance</span>
                <span className="font-mono text-sm font-bold">$65,200</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-profit/10 text-profit flex items-center justify-center">
                <Target size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted">Support</span>
                <span className="font-mono text-sm font-bold">$62,800</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-bitcoin/10 text-bitcoin flex items-center justify-center">
                <ArrowUpRight size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted">Target (7d)</span>
                <span className="font-mono text-sm font-bold">$68,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
