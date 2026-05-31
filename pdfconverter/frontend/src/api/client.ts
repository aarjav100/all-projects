const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async uploadFile(file: File): Promise<{ job_id: string; status: string; file_url?: string }> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error((await res.json()).detail || 'Upload failed');
    return res.json();
  },

  async uploadUrl(url: string): Promise<{ job_id: string; status: string; file_url?: string }> {
    const res = await fetch(`${API_BASE}/upload/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'URL upload failed');
    return res.json();
  },

  async getJob(jobId: string) {
    const res = await fetch(`${API_BASE}/job/${jobId}`);
    if (!res.ok) throw new Error('Job not found');
    return res.json();
  },

  async convert(jobId: string, targetFormat: string): Promise<{ download_url: string; expires_in: number }> {
    const res = await fetch(`${API_BASE}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, target_format: targetFormat }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Conversion failed');
    return res.json();
  },

  async editPdf(jobId: string, edits: object[]): Promise<{ download_url: string }> {
    const res = await fetch(`${API_BASE}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, edits }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Edit failed');
    return res.json();
  },

  async getTemplates() {
    const res = await fetch(`${API_BASE}/templates`);
    return res.json();
  },

  async applyTemplate(jobId: string, templateId: string, overrides?: object): Promise<{ html: string }> {
    const res = await fetch(`${API_BASE}/apply-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, template_id: templateId, overrides }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Template apply failed');
    return res.json();
  },

  streamSummary(jobId: string): EventSource {
    return new EventSource(`${API_BASE}/job/${jobId}/stream`);
  },
};
