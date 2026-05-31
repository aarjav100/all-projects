import { Activity, LayoutDashboard, LineChart, Cpu, ShieldAlert, Image, Layers, History, FileSpreadsheet } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Live Predictor', icon: Activity },
  { name: 'Buy/Sell Signals', icon: LineChart },
  { name: '7-Day Forecast', icon: LineChart },
  { name: 'Model Voting', icon: Cpu },
  { name: 'Risk Manager', icon: ShieldAlert },
  { name: 'Image Processing', icon: Image },
  { name: 'CNN Classifier', icon: Layers },
  { name: 'Trade History', icon: History },
  { name: 'Tableau Export', icon: FileSpreadsheet },
];

export default function Sidebar() {
  return (
    <div className="w-[240px] h-full bg-background border-r border-border shrink-0 flex flex-col hidden md:flex fade-slide-up">
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors",
                  item.active 
                    ? "bg-accent/10 border-l-[3px] border-accent text-accent-light" 
                    : "text-text-muted hover:text-text-primary hover:bg-surface border-l-[3px] border-transparent"
                )}
              >
                <item.icon size={16} />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
