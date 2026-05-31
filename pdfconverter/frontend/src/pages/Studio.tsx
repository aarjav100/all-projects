import { useEffect } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { FileText, Sparkles, Download, Pencil, Layout, X, RotateCcw, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PDFViewer } from '../components/PDFViewer';
import { SummaryPanel } from '../components/SummaryPanel';
import { ConversionPanel } from '../components/ConversionPanel';
import { PDFEditor } from '../components/PDFEditor';
import { TemplateGallery } from '../components/TemplateGallery';
import { ProgressBar } from '../components/ProgressBar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = [
  { id: 'summary', label: 'AI Summary', icon: Sparkles },
  { id: 'convert', label: 'Convert', icon: Download },
  { id: 'editor', label: 'Editor', icon: Pencil },
  { id: 'templates', label: 'Templates', icon: Layout },
] as const;

export function Studio() {
  const { jobId, fileUrl, status, progress, error, activeTab, setActiveTab, resetJob } = useStore();

  const pdfUrl = fileUrl ?? null;

  // Simulate progress for pending state
  useEffect(() => {
    if (status === 'processing' && progress < 60) {
      const t = setInterval(() => {
        useStore.setState((s) => ({
          progress: Math.min(s.progress + 2, 60),
        }));
      }, 800);
      return () => clearInterval(t);
    }
  }, [status, progress]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] flex-shrink-0 bg-[var(--surface)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-white" />
          </div>
          <span className="font-bold text-[var(--text)]">PDF Studio</span>
        </div>

        {/* Status badge */}
        {status !== 'idle' && (
          <div className="flex items-center gap-2 ml-4">
            {(status === 'pending' || status === 'processing') && (
              <Loader2 size={14} className="animate-spin text-indigo-400" />
            )}
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              status === 'done' ? 'bg-emerald-500/15 text-emerald-400' :
              status === 'error' ? 'bg-red-500/15 text-red-400' :
              'bg-indigo-500/15 text-indigo-400'
            }`}>
              {status === 'pending' && 'Uploading…'}
              {status === 'processing' && 'Processing…'}
              {status === 'done' && 'Ready'}
              {status === 'error' && 'Error'}
            </span>
          </div>
        )}

        {/* Progress bar in header */}
        {(status === 'pending' || status === 'processing') && (
          <div className="flex-1 max-w-xs">
            <ProgressBar progress={progress} />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {status !== 'idle' && (
            <button onClick={resetJob} className="btn btn-ghost btn-sm">
              <RotateCcw size={14} /> New PDF
            </button>
          )}
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-5 py-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm flex-shrink-0">
          <X size={14} /> {error}
        </div>
      )}

      {/* Main split layout */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup orientation="horizontal" className="h-full">
          {/* Left panel: PDF viewer */}
          <Panel defaultSize={50} minSize={25} className="h-full overflow-hidden">
            <div className="h-full bg-[var(--surface)] overflow-hidden">
              {pdfUrl ? (
                <PDFViewer url={pdfUrl} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] gap-3">
                  <FileText size={48} className="opacity-20" />
                  <p className="text-sm">PDF preview will appear here</p>
                </div>
              )}
            </div>
          </Panel>

          {/* Resize handle */}
          <PanelResizeHandle className="w-1.5 bg-[var(--border)] hover:bg-indigo-500 transition-colors cursor-col-resize" />

          {/* Right panel: Tools */}
          <Panel defaultSize={50} minSize={30} className="h-full overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] flex-shrink-0 bg-[var(--surface)]">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className={`flex-1 overflow-hidden p-4 ${activeTab === 'templates' ? '' : 'overflow-y-auto'}`}>
              {activeTab === 'summary' && <SummaryPanel />}
              {activeTab === 'convert' && <ConversionPanel />}
              {activeTab === 'editor' && <PDFEditor />}
              {activeTab === 'templates' && <div className="h-full"><TemplateGallery /></div>}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
