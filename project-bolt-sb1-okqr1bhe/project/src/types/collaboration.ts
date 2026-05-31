export interface GitRepository {
  id: string;
  name: string;
  description: string;
  owner: string;
  collaborators: string[];
  isPrivate: boolean;
  createdAt: string;
  lastModified: string;
  resumeVersions: ResumeVersion[];
}

export interface ResumeVersion {
  id: string;
  version: string;
  author: string;
  message: string;
  timestamp: string;
  resumeData: any;
  changes: string[];
}

export interface CollaborationInvite {
  id: string;
  repositoryId: string;
  inviterEmail: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  section: string;
  resolved: boolean;
}