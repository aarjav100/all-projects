import { useState } from 'react';
import { Download, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

const FORMATS = [
  { id: 'docx', label: 'Word (.docx)', icon: '📝' },
  { id: 'md', label: 'Markdown (.md)', icon: '📄' },
  { id: 'html', label: 'HTML (.html)', icon: '🌐' },
  { id: 'txt', label: 'Plain Text (.txt)', icon: '📋' },
  { id: 'csv', label: 'CSV (.csv)', icon: '📊' },
  { id: 'ipynb', label: 'Jupyter Notebook (.ipynb)', icon: '🔬' },
  { id: 'pptx', label: 'PowerPoint (.pptx)', icon: '📊' },
];

export function ConversionPanel() {
  const { jobId, status } = useStore();
  const [selected, setSelected] = useState('');
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const isReady = status === 'done' && jobId;

  const handleConvert = async () => {
    if (!jobId || !selected) return;
    setConverting(true);
    setError('');
    setDownloadUrl('');
    try {
      const res = await api.convert(jobId, selected);
      setDownloadUrl(res.download_url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-indigo-400" />
        <h2 className="font-semibold text-[var(--text)]">Format Conversion</h2>
      </div>

      {!isReady && (
        <p className="text-sm text-[var(--text-muted)]">
          Complete the AI summary step first to enable conversion.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            disabled={!isReady}
            onClick={() => setSelected(f.id)}
            className={`
              glass p-3 rounded-xl text-left transition-all text-sm
              flex items-center gap-2
              ${selected === f.id ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}
              ${!isReady ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--primary)]/50'}
            `}
          >
            <span>{f.icon}</span>
            <span className="font-medium">{f.label}</span>
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary w-full"
        disabled={!selected || !isReady || converting}
        onClick={handleConvert}
      >
        {converting ? (
          <><Loader2 size={16} className="animate-spin" /> Converting…</>
        ) : (
          <><Download size={16} /> Convert &amp; Download</>
        )}
      </button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 hover:bg-emerald-500/20 transition-colors animate-fade-in"
        >
          <CheckCircle2 size={16} /> File ready — click to download
        </a>
      )}

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
    </div>
  );
}
