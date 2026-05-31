import { useState, useEffect } from 'react';
import { Bitcoin, User, Circle } from 'lucide-react';
import clsx from 'clsx';

const navLinks = ['Dashboard', 'Predictions', 'Trade', 'Analytics', 'Tableau'];

export default function TopNav() {
  const [btcPrice, setBtcPrice] = useState(64250.0);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | 'neutral'>('neutral');

  // Simulate live price ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 50;
      setBtcPrice((prev) => {
        const newPrice = prev + change;
        if (newPrice > prev) setPriceChange('up');
        else if (newPrice < prev) setPriceChange('down');
        else setPriceChange('neutral');
        return newPrice;
      });
      
      // Reset color flash after 500ms
      setTimeout(() => setPriceChange('neutral'), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full h-16 border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="text-bitcoin glow-bitcoin">
          <Bitcoin size={28} />
        </div>
        <span className="font-heading font-bold text-xl tracking-wide text-text-primary">
          BitPredict
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <button
            key={link}
            className={clsx(
              "text-sm font-medium transition-colors hover:text-text-primary",
              link === 'Dashboard' ? "text-bitcoin" : "text-text-muted"
            )}
          >
            {link}
          </button>
        ))}
      </div>

      {/* Right Side Info */}
      <div className="flex items-center gap-6">
        {/* Live BTC Ticker */}
        <div className="flex flex-col items-end">
          <span className="text-xs text-text-muted font-mono uppercase tracking-wider">Live BTC/USD</span>
          <span
            className={clsx(
              "font-mono font-bold text-lg transition-colors duration-300",
              priceChange === 'up' && "text-profit glow-profit",
              priceChange === 'down' && "text-loss glow-loss",
              priceChange === 'neutral' && "text-text-primary"
            )}
          >
            ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Network Status */}
        <div className="flex items-center gap-2" title="Network Live">
           <Circle size={10} className="text-profit animate-pulse fill-profit" />
           <span className="text-xs text-text-muted hidden lg:inline">Live</span>
        </div>

        {/* User & Wallet */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex flex-col items-end">
            <span className="text-xs text-text-muted">Balance</span>
            <span className="font-mono text-sm font-medium">2.45 BTC</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-text-muted hover:text-text-primary border border-transparent hover:border-bitcoin transition-colors cursor-pointer">
            <User size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
}
