import { useCallback, useRef } from 'react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

export function useUpload() {
  const { setJob, appendStreamToken } = useStore();
  const esRef = useRef<EventSource | null>(null);

  const startStream = useCallback((jobId: string) => {
    if (esRef.current) esRef.current.close();

    setJob({ isStreaming: true, streamingText: '' });
    const es = api.streamSummary(jobId);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.token) {
          appendStreamToken(data.token);
        }
        if (data.done) {
          setJob({
            status: 'done',
            progress: 100,
            summary: data.summary,
            isStreaming: false,
          });
          es.close();
        }
        if (data.error) {
          setJob({ status: 'error', error: data.error, isStreaming: false });
          es.close();
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setJob({ isStreaming: false });
      es.close();
    };
  }, [setJob, appendStreamToken]);

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        setJob({ status: 'pending', progress: 5, error: null, streamingText: '', fileUrl: null });
        const { job_id, file_url } = await api.uploadFile(file);
        setJob({ jobId: job_id, status: 'processing', progress: 15, fileUrl: file_url ?? null });
        startStream(job_id);
      } catch (err: any) {
        setJob({ status: 'error', error: err.message });
      }
    },
    [setJob, startStream],
  );

  const uploadUrl = useCallback(
    async (url: string) => {
      try {
        setJob({ status: 'pending', progress: 5, error: null, streamingText: '', fileUrl: null });
        const { job_id, file_url } = await api.uploadUrl(url);
        setJob({ jobId: job_id, status: 'processing', progress: 15, fileUrl: file_url ?? null });
        startStream(job_id);
      } catch (err: any) {
        setJob({ status: 'error', error: err.message });
      }
    },
    [setJob, startStream],
  );

  return { uploadFile, uploadUrl };
}
