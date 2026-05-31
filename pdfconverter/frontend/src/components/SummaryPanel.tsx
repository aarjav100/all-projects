import { BookOpen, List, Table2, Loader2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function SummaryPanel() {
  const { summary, streamingText, isStreaming, status } = useStore();

  const isPending = status === 'pending' || status === 'processing';

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <BookOpen size={18} className="text-indigo-400" />
        <h2 className="font-semibold text-[var(--text)]">AI Summary</h2>
        {isStreaming && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-indigo-400 animate-pulse">
            <Loader2 size={12} className="animate-spin" /> Generating…
          </span>
        )}
        {status === 'done' && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 size={12} /> Complete
          </span>
        )}
      </div>

      {/* Streaming raw text (typewriter) */}
      {(isStreaming || (streamingText && !summary)) && (
        <div className="glass p-4 overflow-y-auto flex-1 text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap font-mono">
          <span className={isStreaming ? 'streaming-cursor' : ''}>{streamingText}</span>
        </div>
      )}

      {/* Structured summary cards */}
      {summary && (
        <div className="flex-1 overflow-y-auto space-y-4 animate-fade-in">
          {/* Executive Summary */}
          {summary.executive_summary && (
            <div className="glass p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <BookOpen size={13} /> Executive Summary
              </div>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                {summary.executive_summary}
              </p>
            </div>
          )}

          {/* Key Topics */}
          {summary.key_topics?.length > 0 && (
            <div className="glass p-4 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                <List size={13} /> Key Topics
              </div>
              <ul className="space-y-1.5">
                {summary.key_topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Tables/Data */}
          {summary.extracted_tables && (
            <div className="glass p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Table2 size={13} /> Extracted Data
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                {summary.extracted_tables}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isPending && !isStreaming && !summary && !streamingText && (
        <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] gap-3">
          <BookOpen size={40} className="opacity-20" />
          <p className="text-sm">Upload a PDF to generate an AI summary</p>
        </div>
      )}
    </div>
  );
}
