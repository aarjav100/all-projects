import React from 'react';

const models = [
  { name: 'XGBoost Auto', signal: 'BUY', conf: 92, rmse: '124.5', winner: true },
  { name: 'LightGBM Reg', signal: 'BUY', conf: 85, rmse: '138.2', winner: false },
  { name: 'RandomForest', signal: 'HOLD', conf: 45, rmse: '219.0', winner: false },
  { name: 'Ridge Linear', signal: 'SELL', conf: 76, rmse: '198.4', winner: false },
  { name: 'ChartCNN_v1',  signal: 'BUY', conf: 89, rmse: 'N/A', winner: false },
  { name: 'ResNet50_TL',  signal: 'SELL', conf: 61, rmse: 'N/A', winner: false },
  { name: 'LSTM_Prices',  signal: 'BUY', conf: 81, rmse: '144.1', winner: false },
  { name: 'Ensemble_Avg', signal: 'BUY', conf: 88, rmse: '131.7', winner: false }
];

export default function ModelVoting() {
  return (
    <div className="pro-card p-6 w-full h-full flex flex-col">
      <div className="text-[12px] font-bold tracking-[0.1em] text-text-primary uppercase mb-4 flex justify-between">
        <span>Model Voting Matrix</span>
        <span className="text-accent-light bg-accent/10 px-2 py-0.5 border border-accent/20">8 Active</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
        {models.map((m, idx) => {
          const color = m.signal === 'BUY' ? '#00FF88' : m.signal === 'SELL' ? '#FF3B3B' : '#F59E0B';
          return (
            <div 
              key={idx} 
              className={`bg-background border p-3 flex flex-col justify-between transition-colors hover:bg-surface relative group ${m.winner ? 'border-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'border-border'}`}
            >
              {/* Tooltip popover simulation */}
              <div className="absolute top-0 left-0 w-full h-[80%] bg-surface border border-accent/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-center -translate-y-[80%] pointer-events-none p-2 shadow-2xl">
                 <span className="text-[9px] text-text-muted uppercase">Accuracy Span (24h)</span>
                 <div className="w-full bg-border h-4 mt-1 border-l-2 border-accent"></div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-text-primary font-mono">{m.name}</span>
                {m.winner && <span className="text-[8px] uppercase tracking-wider text-[#00FF88] bg-[#00FF88]/10 px-1 border border-[#00FF88]/30">Primary</span>}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border"
                  style={{ color: color, borderColor: color, backgroundColor: `${color}15` }}
                >
                  {m.signal}
                </span>
                <span className="font-mono text-[10px] text-text-muted">RMSE {m.rmse}</span>
              </div>

              <div className="w-full h-1 bg-border relative">
                <div className="absolute top-0 left-0 h-full" style={{ backgroundColor: color, width: `${m.conf}%` }}></div>
              </div>
              <div className="mt-1 text-right text-[9px] font-mono text-text-muted">{m.conf}% CONF</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
