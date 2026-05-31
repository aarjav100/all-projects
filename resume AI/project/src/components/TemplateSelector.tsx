import React from 'react';
import { X, Check } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplate, 
  onSelectTemplate, 
  onClose 
}) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, contemporary design with blue accents',
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Timeless design perfect for conservative industries',
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'creative',
      name: 'Creative Designer',
      description: 'Bold, colorful template for creative professionals',
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'minimalist',
      name: 'Minimalist Clean',
      description: 'Simple, elegant design with maximum white space',
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'executive',
      name: 'Executive Professional',
      description: 'Sophisticated design for senior-level positions',
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'tech',
      name: 'Tech Specialist',
      description: 'Modern template designed for tech professionals',
      preview: '/api/placeholder/300/400'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Choose Template</h2>
            <p className="text-slate-600">Select a template that matches your style</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Template Preview */}
                <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-lg shadow-md mb-4 mx-auto flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-400">T</span>
                    </div>
                    <p className="text-slate-500 text-sm">Template Preview</p>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-600">{template.description}</p>
                </div>

                {/* Selected Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Selected: {templates.find(t => t.id === selectedTemplate)?.name}
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;