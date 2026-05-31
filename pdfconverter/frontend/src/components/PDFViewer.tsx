import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PDFViewerProps {
  url: string;
  onPageCount?: (n: number) => void;
}

export function PDFViewer({ url, onPageCount }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    pdfjsLib.getDocument(url).promise.then((doc: any) => {
      setPdf(doc);
      setTotalPages(doc.numPages);
      setCurrentPage(1);
      onPageCount?.(doc.numPages);
      setLoading(false);
    });
  }, [url]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    pdf.getPage(currentPage).then((page: any) => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const viewport = page.getViewport({ scale: 1.4 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const task = page.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      task.promise.catch(() => {});
    });
  }, [pdf, currentPage]);

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] flex-shrink-0">
        <span className="text-sm text-[var(--text-muted)]">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-1">
          <button
            className="btn btn-ghost btn-sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="btn btn-ghost btn-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto flex justify-center p-4 bg-[var(--surface)]">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full text-[var(--text-muted)]">
            Loading PDF…
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="shadow-2xl rounded-lg max-w-full"
            style={{ height: 'auto' }}
          />
        )}
      </div>
    </div>
  );
}
