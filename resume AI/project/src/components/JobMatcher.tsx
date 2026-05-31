import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Star, ExternalLink, Filter, Target } from 'lucide-react';
import { matchJobs } from '../lib/database';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

interface JobMatcherProps {
  user: User | null;
  profile: Profile | null;
}

const JobMatcher: React.FC<JobMatcherProps> = ({ user, profile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user && profile) {
      loadJobs();
    }
  }, [user, profile]);

  const loadJobs = async () => {
    if (!user || !profile) return;

    setIsLoading(true);
    try {
      const jobsData = await matchJobs(profile, searchQuery, selectedLocation, selectedType);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    await loadJobs();
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600 bg-green-100';
    if (match >= 80) return 'text-blue-600 bg-blue-100';
    if (match >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchIcon = (match: number) => {
    if (match >= 90) return '🎯';
    if (match >= 80) return '⭐';
    if (match >= 70) return '👍';
    return '📝';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Matcher</h1>
        <p className="text-slate-600">Find jobs that match your skills and experience with AI-powered recommendations</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, companies, or skills..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>{isLoading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="san francisco">San Francisco</option>
                <option value="new york">New York</option>
                <option value="austin">Austin</option>
                <option value="los angeles">Los Angeles</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
              <select
                value={selectedSalary}
                onChange={(e) => setSelectedSalary(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="">All Salaries</option>
                <option value="50-80k">$50k - $80k</option>
                <option value="80-120k">$80k - $120k</option>
                <option value="120k+">$120k+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Job Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {jobs.length} Jobs Found
            </h2>
            <select className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
              <option>Best Match</option>
              <option>Most Recent</option>
              <option>Highest Salary</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-500 mt-4">Finding matching jobs...</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                      {job.logo}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
                      <p className="text-slate-600 mb-2">{job.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.match)}`}>
                      {getMatchIcon(job.match)} {job.match}% Match
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Posted {job.posted}</span>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 transition-colors">
                      <Star className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      <span>Apply</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {!isLoading && jobs.length === 0 && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No jobs found matching your criteria</p>
              <button
                onClick={loadJobs}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search Again
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Match Profile</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-900">Profile Strength</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900">85%</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Profile Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Title:</span>
                    <span className="text-slate-900">{profile?.professional_title || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span className="text-slate-900">{profile?.location || 'Not set'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Recommended Actions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Complete your profile for better matches</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Add more skills to your resume</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Update your professional summary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatcher;