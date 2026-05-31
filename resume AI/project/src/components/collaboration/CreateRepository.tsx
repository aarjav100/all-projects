import React, { useState } from 'react';
import { ArrowLeft, GitBranch, Lock, Globe, Users, Plus, X } from 'lucide-react';

interface CreateRepositoryProps {
  onBack: () => void;
  onCreate: (repoData: any) => void;
}

const CreateRepository: React.FC<CreateRepositoryProps> = ({ onBack, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    collaborators: [''],
    template: 'blank'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Repository name is required';
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.name)) {
      newErrors.name = 'Repository name can only contain letters, numbers, hyphens, and underscores';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const repoData = {
      ...formData,
      collaborators: formData.collaborators.filter(email => email.trim() !== '')
    };

    onCreate(repoData);
  };

  const addCollaborator = () => {
    setFormData(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, '']
    }));
  };

  const removeCollaborator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, i) => i !== index)
    }));
  };

  const updateCollaborator = (index: number, email: string) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.map((collab, i) => i === index ? email : collab)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Repository</h1>
              <p className="text-gray-600">Set up a new resume repository for collaboration</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Repository Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repository Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GitBranch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="senior-developer-resume"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Use lowercase letters, numbers, hyphens, and underscores only
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="A professional resume for senior software developer positions"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Privacy Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Repository Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!formData.isPrivate}
                    onChange={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">Public</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Anyone can see this repository. You choose who can commit.
                    </p>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={formData.isPrivate}
                    onChange={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-900">Private</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      You choose who can see and commit to this repository.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Initialize with Template
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="template"
                    value="blank"
                    checked={formData.template === 'blank'}
                    onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Blank Repository</div>
                    <div className="text-sm text-gray-600">Start from scratch</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="template"
                    value="basic"
                    checked={formData.template === 'basic'}
                    onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Basic Template</div>
                    <div className="text-sm text-gray-600">Pre-filled sections</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Collaborators */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Collaborators (Optional)
              </label>
              <div className="space-y-3">
                {formData.collaborators.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateCollaborator(index, e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="colleague@example.com"
                      />
                    </div>
                    {formData.collaborators.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCollaborator(index)}
                        className="p-3 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCollaborator}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Collaborator</span>
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Collaborators will be able to view and edit this repository
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Repository
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRepository;