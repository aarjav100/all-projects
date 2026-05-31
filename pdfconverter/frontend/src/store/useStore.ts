import { create } from 'zustand';

export interface Summary {
  executive_summary: string;
  key_topics: string[];
  extracted_tables: string;
  raw: string;
}

export interface JobState {
  jobId: string | null;
  status: 'idle' | 'pending' | 'processing' | 'done' | 'error';
  progress: number;
  summary: Summary | null;
  error: string | null;
  pageCount: number;
  streamingText: string;
  isStreaming: boolean;
  filePath: string | null;
  fileUrl: string | null;
}

export interface AppStore extends JobState {
  activeTab: 'summary' | 'convert' | 'editor' | 'templates';
  setActiveTab: (tab: AppStore['activeTab']) => void;
  setJob: (partial: Partial<JobState>) => void;
  appendStreamToken: (token: string) => void;
  resetJob: () => void;
}

const initialJob: JobState = {
  jobId: null,
  status: 'idle',
  progress: 0,
  summary: null,
  error: null,
  pageCount: 0,
  streamingText: '',
  isStreaming: false,
  filePath: null,
  fileUrl: null,
};

export const useStore = create<AppStore>((set) => ({
  ...initialJob,
  activeTab: 'summary',

  setActiveTab: (tab) => set({ activeTab: tab }),

  setJob: (partial) => set((s) => ({ ...s, ...partial })),

  appendStreamToken: (token) =>
    set((s) => ({ streamingText: s.streamingText + token })),

  resetJob: () => set({ ...initialJob, activeTab: 'summary' }),
}));
