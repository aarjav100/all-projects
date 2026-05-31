import React, { useState } from 'react';
import { 
  GitBranch, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Lock, 
  Globe,
  ArrowRight,
  GitCommit,
  MessageSquare,
  Eye
} from 'lucide-react';
import { GitRepository, ResumeVersion } from '../../types/collaboration';
import { useAuth } from '../../contexts/AuthContext';

interface GitDashboardProps {
  onCreateRepository: () => void;
  onOpenRepository: (repo: GitRepository) => void;
}

const GitDashboard: React.FC<GitDashboardProps> = ({ onCreateRepository, onOpenRepository }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'owned' | 'collaborated'>('all');

  // Mock repositories data
  const [repositories] = useState<GitRepository[]>([
    {
      id: '1',
      name: 'senior-developer-resume',
      description: 'Professional resume for senior software developer position',
      owner: user?.email || 'john@example.com',
      collaborators: ['jane@example.com', 'mike@example.com'],
      isPrivate: false,
      createdAt: '2024-01-15T10:00:00Z',
      lastModified: '2024-01-20T14:30:00Z',
      resumeVersions: [
        {
          id: 'v1',
          version: '1.2.0',
          author: 'john@example.com',
          message: 'Updated experience section with latest project',
          timestamp: '2024-01-20T14:30:00Z',
          resumeData: {},
          changes: ['Added new project experience', 'Updated skills section']
        }
      ]
    },
    {
      id: '2',
      name: 'marketing-manager-cv',
      description: 'Resume template for marketing management roles',
      owner: 'jane@example.com',
      collaborators: [user?.email || 'john@example.com'],
      isPrivate: true,
      createdAt: '2024-01-10T09:00:00Z',
      lastModified: '2024-01-18T16:45:00Z',
      resumeVersions: []
    },
    {
      id: '3',
      name: 'data-scientist-portfolio',
      description: 'Comprehensive resume for data science positions',
      owner: user?.email || 'john@example.com',
      collaborators: [],
      isPrivate: false,
      createdAt: '2024-01-05T11:00:00Z',
      lastModified: '2024-01-15T13:20:00Z',
      resumeVersions: []
    }
  ]);

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'owned' && repo.owner === user?.email) ||
                         (filterType === 'collaborated' && repo.collaborators.includes(user?.email || ''));
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Repositories</h1>
              <p className="text-gray-600">Collaborate on resumes with version control and team features</p>
            </div>
            <button
              onClick={onCreateRepository}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Repository</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search repositories..."
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Repositories</option>
                <option value="owned">Owned by Me</option>
                <option value="collaborated">Collaborated</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Repository Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepositories.map((repo) => (
            <div
              key={repo.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onOpenRepository(repo)}
            >
              <div className="p-6">
                {/* Repository Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {repo.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {repo.isPrivate ? (
                      <Lock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Globe className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {repo.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <GitCommit className="h-4 w-4" />
                      <span>{repo.resumeVersions.length} versions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{repo.collaborators.length + 1}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(repo.lastModified)}</span>
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {repo.owner.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600">
                      {repo.owner === user?.email ? 'You' : repo.owner}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRepositories.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <GitBranch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No repositories found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first repository to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={onCreateRepository}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Create Repository</span>
              </button>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              {repositories.filter(r => r.owner === user?.email).length}
            </div>
            <div className="text-sm text-gray-600">Owned Repositories</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {repositories.filter(r => r.collaborators.includes(user?.email || '')).length}
            </div>
            <div className="text-sm text-gray-600">Collaborations</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {repositories.reduce((acc, r) => acc + r.resumeVersions.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Versions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {repositories.filter(r => !r.isPrivate).length}
            </div>
            <div className="text-sm text-gray-600">Public Repositories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitDashboard;