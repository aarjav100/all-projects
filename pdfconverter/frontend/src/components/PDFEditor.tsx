import { useState, useRef } from 'react';
import { Highlighter, MessageSquare, EyeOff, Download, Loader2 } from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

type EditTool = 'highlight' | 'annotate' | 'redact' | null;

interface PendingEdit {
  type: string;
  page: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  text?: string;
}

export function PDFEditor() {
  const { jobId, status } = useStore();
  const [activeTool, setActiveTool] = useState<EditTool>(null);
  const [edits, setEdits] = useState<PendingEdit[]>([]);
  const [annotText, setAnnotText] = useState('');
  const [saving, setSaving] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  const isReady = status === 'done' && jobId;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTool || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edit: PendingEdit = {
      type: activeTool,
      page: 1,
      x: Math.round(x),
      y: Math.round(y),
      ...(activeTool === 'highlight' ? { width: 200, height: 20, color: 'yellow' } : {}),
      ...(activeTool === 'redact' ? { width: 150, height: 20 } : {}),
      ...(activeTool === 'annotate' ? { text: annotText || 'Annotation' } : {}),
    };

    setEdits((prev) => [...prev, edit]);
  };

  const handleSave = async () => {
    if (!jobId || edits.length === 0) return;
    setSaving(true);
    setError('');
    try {
      const res = await api.editPdf(jobId, edits);
      setDownloadUrl(res.download_url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const tools = [
    { id: 'highlight' as EditTool, icon: <Highlighter size={16} />, label: 'Highlight', color: 'text-yellow-400' },
    { id: 'annotate' as EditTool, icon: <MessageSquare size={16} />, label: 'Annotate', color: 'text-blue-400' },
    { id: 'redact' as EditTool, icon: <EyeOff size={16} />, label: 'Redact', color: 'text-red-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {tools.map((t) => (
          <button
            key={t.id}
            disabled={!isReady}
            onClick={() => setActiveTool(activeTool === t.id ? null : t.id)}
            className={`btn btn-sm ${activeTool === t.id ? 'btn-primary' : 'btn-ghost'} ${t.color}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
        {activeTool === 'annotate' && (
          <input
            type="text"
            placeholder="Annotation text…"
            value={annotText}
            onChange={(e) => setAnnotText(e.target.value)}
            className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-indigo-500"
          />
        )}
      </div>

      {activeTool && (
        <p className="text-xs text-[var(--text-muted)]">
          Click on the PDF viewer to place a <strong className="text-[var(--text)]">{activeTool}</strong> at that position.
        </p>
      )}

      {/* Click overlay for the PDF area */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className={`relative min-h-[200px] rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${
          activeTool
            ? 'border-indigo-500/60 bg-indigo-500/5 cursor-crosshair'
            : 'border-[var(--border)] cursor-default'
        }`}
      >
        <p className="text-sm text-[var(--text-muted)]">
          {activeTool
            ? `Click anywhere to add ${activeTool}`
            : 'Select a tool above to start editing'}
        </p>
        {/* Visual markers for placed edits */}
        {edits.map((edit, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: edit.x, top: edit.y }}
          >
            {edit.type === 'highlight' && (
              <div className="bg-yellow-400/40 border border-yellow-400" style={{ width: edit.width, height: edit.height }} />
            )}
            {edit.type === 'redact' && (
              <div className="bg-black border border-gray-700" style={{ width: edit.width, height: edit.height }} />
            )}
            {edit.type === 'annotate' && (
              <div className="bg-blue-500/80 text-white text-xs px-2 py-0.5 rounded shadow">
                {edit.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {edits.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">{edits.length} edit(s) pending</span>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => setEdits([])}>Clear</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Save & Download
            </button>
          </div>
        </div>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 hover:bg-emerald-500/20 transition-colors"
        >
          <Download size={16} /> Edited PDF ready — click to download
        </a>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
