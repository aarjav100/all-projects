import { FileText, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UploadZone } from '../components/UploadZone';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

const FEATURES = [
  { icon: Sparkles, title: 'AI-Powered Summary', desc: 'Claude generates executive summaries, key topics, and data extraction in real-time.' },
  { icon: Zap, title: '7 Export Formats', desc: 'Convert to Word, Markdown, HTML, Jupyter, CSV, PowerPoint, and plain text.' },
  { icon: FileText, title: 'In-Browser Editor', desc: 'Highlight, annotate, redact sections, and reorder pages without leaving your browser.' },
  { icon: Globe, title: 'Website Templates', desc: '5 professional HTML templates. Customize colors, fonts, and layout live.' },
  { icon: Shield, title: 'Secure by Default', desc: 'Magic byte validation, 50 MB limit, XSS sanitization, and auto-deletion after 1 hour.' },
];

export function Home() {
  const navigate = useNavigate();
  const { status } = useStore();

  // Auto-navigate to studio once job starts
  useEffect(() => {
    if (status !== 'idle') navigate('/studio');
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-[var(--text)]">PDF Studio</span>
        </div>
        <span className="text-xs text-[var(--text-muted)] hidden sm:block">
          AI · Convert · Edit · Publish
        </span>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-400 font-medium">
            <Sparkles size={14} /> Powered by Claude claude-sonnet-4-20250514
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-[var(--text)] leading-tight mb-4 max-w-3xl">
          Your PDF,{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            reimagined
          </span>
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-xl mb-12 leading-relaxed">
          Upload any PDF to get an AI summary, convert to any format, edit in-browser, and publish as a beautiful website — all in one place.
        </p>

        <UploadZone />
      </section>

      {/* Feature grid */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass p-5 rounded-2xl space-y-2 hover:border-indigo-500/40 transition-colors">
              <div className="w-9 h-9 bg-indigo-500/15 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-indigo-400" />
              </div>
              <h3 className="font-semibold text-[var(--text)]">{title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
        PDF Studio · Built with FastAPI + React + Claude AI
      </footer>
    </div>
  );
}
