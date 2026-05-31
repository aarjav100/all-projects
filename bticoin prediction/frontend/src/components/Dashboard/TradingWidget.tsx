import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowLeftRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

type OrderType = 'Market' | 'Limit' | 'Stop-Loss';
type Side = 'BUY' | 'SELL';

export default function TradingWidget() {
  const [side, setSide] = useState<Side>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('Limit');
  const [amount, setAmount] = useState<string>('0.5');
  const [price, setPrice] = useState<string>('64250.00');

  const btcAmount = parseFloat(amount) || 0;
  const priceNum = parseFloat(price.replace(/,/g, '')) || 64250.00;
  const total = btcAmount * priceNum;
  const fee = total * 0.001; // 0.1% fee

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-full">
      <div className="flex bg-surface rounded-lg p-1 mb-6 border border-border">
        <button
          onClick={() => setSide('BUY')}
          className={clsx(
            "flex-1 py-2 text-sm font-bold rounded-md transition-all",
            side === 'BUY' ? "bg-profit/20 text-profit glow-profit" : "text-text-muted hover:text-text-primary"
          )}
        >
          BUY
        </button>
        <button
          onClick={() => setSide('SELL')}
          className={clsx(
            "flex-1 py-2 text-sm font-bold rounded-md transition-all",
            side === 'SELL' ? "bg-loss/20 text-loss glow-loss" : "text-text-muted hover:text-text-primary"
          )}
        >
          SELL
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['Market', 'Limit', 'Stop-Loss'].map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type as OrderType)}
            className={clsx(
              "flex-1 py-1.5 text-xs font-medium rounded border transition-colors",
              orderType === type
                ? "border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10"
                : "border-border text-text-muted hover:border-text-muted"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-text-muted mb-1.5 block">Amount (BTC)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg py-2.5 px-3 text-text-primary font-mono focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono flex items-center gap-2">
              <ArrowLeftRight size={14} className="cursor-pointer hover:text-text-primary" />
              BTC
            </div>
          </div>
        </div>

        {orderType !== 'Market' && (
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Limit Price (USD)</label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg py-2.5 px-3 text-text-primary font-mono focus:outline-none focus:border-[#00E5FF] transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono">USD</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-lg p-4 mb-6 border border-border space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Total (Excl. Fee)</span>
          <span className="font-mono text-text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Est. Fee (0.1%)</span>
          <span className="font-mono text-text-primary">${fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="border-t border-border pt-2 mt-2 flex justify-between">
          <span className="text-sm font-bold text-text-primary">Net Total</span>
          <span className="font-mono font-bold text-lg text-text-primary">
            ${(total + (side === 'BUY' ? fee : -fee)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <button
        className={clsx(
          "w-full py-4 rounded-xl font-bold tracking-wider text-background transition-all hover:-translate-y-0.5 mt-auto",
          side === 'BUY' ? "bg-profit glow-profit shadow-[0_0_20px_rgba(0,255,135,0.4)]" : "bg-loss glow-loss shadow-[0_0_20px_rgba(255,59,92,0.4)]"
        )}
      >
        {side === 'BUY' ? 'EXECUTE BUY' : 'EXECUTE SELL'}
      </button>

      {/* Recent Orders */}
      <div className="mt-8">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 border-b border-border pb-2">Recent Orders</h4>
        <div className="space-y-3">
          {[
            { id: '1', type: 'Limit Buy', amt: '0.25', status: 'Filled', price: '$64,100' },
            { id: '2', type: 'Market Sell', amt: '0.10', status: 'Pending', price: 'Market' },
            { id: '3', type: 'Stop-Loss', amt: '1.50', status: 'Canceled', price: '$63,500' },
          ].map((order) => (
             <div key={order.id} className="flex items-center justify-between text-sm">
               <div className="flex items-center gap-2">
                 {order.status === 'Filled' && <CheckCircle2 size={14} className="text-[#00E5FF]" />}
                 {order.status === 'Pending' && <Clock size={14} className="text-bitcoin" />}
                 {order.status === 'Canceled' && <XCircle size={14} className="text-text-muted" />}
                 <div className="flex flex-col">
                   <span className="font-medium">{order.type}</span>
                   <span className="text-[10px] text-text-muted font-mono">{order.amt} BTC @ {order.price}</span>
                 </div>
               </div>
               <span className={clsx(
                 "text-xs px-2 py-0.5 rounded border font-mono font-medium",
                 order.status === 'Filled' ? "border-[#00E5FF]/30 text-[#00E5FF] bg-[#00E5FF]/10" :
                 order.status === 'Pending' ? "border-bitcoin/30 text-bitcoin bg-bitcoin/10" :
                 "border-border text-text-muted bg-surface"
               )}>
                 {order.status}
               </span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
