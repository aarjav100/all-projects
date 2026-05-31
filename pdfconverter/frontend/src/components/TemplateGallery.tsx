import { useEffect, useState } from 'react';
import { Loader2, Palette, Type, Layout, Download } from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

interface Overrides {
  primaryColor: string;
  fontFamily: string;
  bgColor: string;
  textColor: string;
}

const FONTS = ['Inter, sans-serif', 'Georgia, serif', 'Roboto, sans-serif', 'Merriweather, serif', 'Courier New, monospace'];

export function TemplateGallery() {
  const { jobId, status } = useStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState('');
  const [overrides, setOverrides] = useState<Overrides>({
    primaryColor: '#6366f1',
    fontFamily: 'Inter, sans-serif',
    bgColor: '#ffffff',
    textColor: '#1f2937',
  });
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isReady = status === 'done' && jobId;

  useEffect(() => {
    api.getTemplates().then((res) => setTemplates(res.templates || []));
  }, []);

  const handleApply = async (templateId: string) => {
    if (!jobId) return;
    setSelected(templateId);
    setLoading(true);
    setError('');
    try {
      const res = await api.applyTemplate(jobId, templateId, overrides);
      setHtml(res.html);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOverrideChange = async (key: keyof Overrides, value: string) => {
    const newOverrides = { ...overrides, [key]: value };
    setOverrides(newOverrides);
    if (selected && jobId) {
      setLoading(true);
      try {
        const res = await api.applyTemplate(jobId, selected, newOverrides);
        setHtml(res.html);
      } catch { /* ignore */ }
      setLoading(false);
    }
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected || 'document'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* Left: Template picker + controls */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layout size={16} className="text-indigo-400" />
            <h2 className="font-semibold text-sm text-[var(--text)]">Templates</h2>
          </div>
          <div className="space-y-2">
            {templates.map((t) => (
              <button
                key={t.id}
                disabled={!isReady}
                onClick={() => handleApply(t.id)}
                className={`w-full glass p-3 rounded-xl text-left transition-all ${
                  selected === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'hover:border-[var(--primary)]/40'
                } ${!isReady ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <p className="font-medium text-sm text-[var(--text)]">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Style controls */}
        {selected && (
          <div className="glass p-4 space-y-4 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Customize</p>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Palette size={12} /> Primary Color
              </label>
              <input
                type="color"
                value={overrides.primaryColor}
                onChange={(e) => handleOverrideChange('primaryColor', e.target.value)}
                className="w-full h-9 rounded-lg border border-[var(--border)] bg-transparent cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Palette size={12} /> Background
              </label>
              <input
                type="color"
                value={overrides.bgColor}
                onChange={(e) => handleOverrideChange('bgColor', e.target.value)}
                className="w-full h-9 rounded-lg border border-[var(--border)] bg-transparent cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Type size={12} /> Font Family
              </label>
              <select
                value={overrides.fontFamily}
                onChange={(e) => handleOverrideChange('fontFamily', e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500"
              >
                {FONTS.map((f) => <option key={f} value={f}>{f.split(',')[0]}</option>)}
              </select>
            </div>

            {html && (
              <button onClick={downloadHtml} className="btn btn-primary w-full btn-sm">
                <Download size={14} /> Download HTML
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right: Live preview */}
      <div className="flex-1 glass rounded-2xl overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-[var(--surface)]/80 flex items-center justify-center z-10">
            <Loader2 size={28} className="animate-spin text-indigo-400" />
          </div>
        )}
        {html ? (
          <iframe
            srcDoc={html}
            title="Template Preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] gap-3">
            <Layout size={48} className="opacity-20" />
            <p className="text-sm">Select a template to preview</p>
          </div>
        )}
        {error && <p className="absolute bottom-4 left-4 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
