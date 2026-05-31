import { Clock, Database, Radio, CheckCircle2 } from 'lucide-react';

export default function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-background border-t border-border z-50 flex items-center justify-between px-4 text-[11px] font-mono text-text-muted">
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Database size={12} className="text-text-primary" />
           DATA: <span className="text-text-primary">Bitcoin.csv</span>
        </div>
        <div className="flex items-center gap-2">
           <Clock size={12} className="text-text-primary" />
           LAST RUN: <span className="text-text-primary">2026-03-26 14:02 UTC</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Radio size={12} className="text-accent-light animate-pulse" />
           MODELS ACTIVE: <span className="text-text-primary font-bold">8 / 8</span>
        </div>
        <div className="flex items-center gap-2 border-l border-border pl-6">
           <CheckCircle2 size={12} className="text-[#00FF88]" />
           <span className="text-[#00FF88] uppercase tracking-wider font-sans font-bold text-[10px]">Connected to server</span>
        </div>
      </div>
      
    </div>
  );
}
