import React from 'react';
import { Check } from 'lucide-react';
import { ResumeTemplate, resumeTemplates } from '../utils/resumeGenerator';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateSelect: (template: ResumeTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect
}) => {
  const getTemplatePreview = (style: string) => {
    const previews = {
      modern: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-500',
      classic: 'bg-gray-50 border border-gray-300',
      creative: 'bg-gradient-to-br from-purple-50 to-pink-100 border-l-4 border-purple-500',
      minimal: 'bg-white border border-gray-200'
    };
    return previews[style as keyof typeof previews] || previews.modern;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Resume Template</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {resumeTemplates.map((template) => (
          <div
            key={template.name}
            onClick={() => onTemplateSelect(template)}
            className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedTemplate.name === template.name
                ? 'ring-2 ring-indigo-500 shadow-lg'
                : 'hover:shadow-md'
            } ${getTemplatePreview(template.style)}`}
          >
            {selectedTemplate.name === template.name && (
              <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            <div className="mb-3">
              <div className="h-20 bg-white/50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">Preview</span>
              </div>
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;