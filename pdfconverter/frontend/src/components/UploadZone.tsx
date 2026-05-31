import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Link, FileText, AlertCircle } from 'lucide-react';
import { useUpload } from '../hooks/useUpload';

export function UploadZone() {
  const { uploadFile, uploadUrl } = useUpload();
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [localError, setLocalError] = useState('');

  const onDrop = useCallback(
    (accepted: File[], rejected: any[]) => {
      setLocalError('');
      if (rejected.length > 0) {
        setLocalError('Invalid file. Only PDFs up to 50 MB are accepted.');
        return;
      }
      if (accepted[0]) uploadFile(accepted[0]);
    },
    [uploadFile],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput);
    } catch {
      setLocalError('Please enter a valid URL.');
      return;
    }
    uploadUrl(urlInput.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2 justify-center">
        <button
          className={`btn btn-sm ${!urlMode ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setUrlMode(false)}
        >
          <Upload size={14} /> Upload File
        </button>
        <button
          className={`btn btn-sm ${urlMode ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setUrlMode(true)}
        >
          <Link size={14} /> From URL
        </button>
      </div>

      {!urlMode ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive && !isDragReject ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : ''}
            ${isDragReject ? 'border-red-500 bg-red-500/10' : ''}
            ${!isDragActive ? 'border-[var(--border)] hover:border-indigo-500/60 hover:bg-indigo-500/5' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragActive ? 'bg-indigo-500/20' : 'bg-[var(--surface-2)]'}`}>
              {isDragReject ? (
                <AlertCircle size={32} className="text-red-400" />
              ) : (
                <FileText size={32} className={isDragActive ? 'text-indigo-400' : 'text-[var(--text-muted)]'} />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--text)]">
                {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF'}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                or <span className="text-indigo-400 font-medium">click to browse</span> · Max 50 MB · PDF only
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUrlSubmit} className="glass p-6 space-y-3">
          <label className="block text-sm font-medium text-[var(--text-muted)]">
            PDF URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/document.pdf"
              className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button type="submit" className="btn btn-primary">
              <Upload size={16} /> Fetch
            </button>
          </div>
        </form>
      )}

      {localError && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} /> {localError}
        </div>
      )}
    </div>
  );
}
