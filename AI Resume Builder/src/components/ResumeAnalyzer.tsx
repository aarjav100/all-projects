import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Target, Award, Zap, Eye } from 'lucide-react';

interface ResumeAnalyzerProps {
  atsScore: number;
  keywordScore: number;
  readabilityScore: string;
  suggestions: string[];
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  atsScore,
  keywordScore,
  readabilityScore,
  suggestions
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 80) return 'bg-blue-100 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 70) return <TrendingUp className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const overallScore = Math.round((atsScore + keywordScore) / 2);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900">Resume Analysis</h3>
      </div>
      
      {/* Overall Score */}
      <div className={`p-4 rounded-lg border-2 mb-6 ${getScoreBgColor(overallScore)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-indigo-600" />
            <div>
              <h4 className="font-bold text-gray-900">Overall Score</h4>
              <p className="text-sm text-gray-600">Interview Readiness</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <div className="text-sm text-gray-600">{readabilityScore}</div>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(overallScore)}`}
            style={{ width: `${overallScore}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Individual Scores */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              {getScoreIcon(atsScore)}
              <div>
                <span className="font-semibold text-gray-900">ATS Compatibility</span>
                <p className="text-xs text-gray-600">Applicant Tracking System</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xl font-bold ${getScoreColor(atsScore)}`}>{atsScore}%</span>
              <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(atsScore)}`}
                  style={{ width: `${atsScore}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              {getScoreIcon(keywordScore)}
              <div>
                <span className="font-semibold text-gray-900">Keyword Optimization</span>
                <p className="text-xs text-gray-600">Industry relevance</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xl font-bold ${getScoreColor(keywordScore)}`}>{keywordScore}%</span>
              <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(keywordScore)}`}
                  style={{ width: `${keywordScore}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <span className="font-semibold text-gray-900">Readability Score</span>
                <p className="text-xs text-gray-600">Human reviewer friendly</p>
              </div>
            </div>
            <span className="font-bold text-green-600 text-lg">{readabilityScore}</span>
          </div>
        </div>

        {/* Improvement Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-orange-500" />
              🚀 Boost Your Interview Chances
            </h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <span className="text-orange-500 mt-1 font-bold">•</span>
                  <span className="leading-relaxed">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Indicators */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            ✅ Interview-Ready Checklist
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className={atsScore >= 80 ? "text-green-500" : "text-gray-400"}>
                {atsScore >= 80 ? "✓" : "○"}
              </span>
              <span className={atsScore >= 80 ? "text-green-700" : "text-gray-500"}>
                ATS Optimized
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={keywordScore >= 80 ? "text-green-500" : "text-gray-400"}>
                {keywordScore >= 80 ? "✓" : "○"}
              </span>
              <span className={keywordScore >= 80 ? "text-green-700" : "text-gray-500"}>
                Keyword Rich
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={overallScore >= 85 ? "text-green-500" : "text-gray-400"}>
                {overallScore >= 85 ? "✓" : "○"}
              </span>
              <span className={overallScore >= 85 ? "text-green-700" : "text-gray-500"}>
                Interview Ready
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={suggestions.length <= 2 ? "text-green-500" : "text-gray-400"}>
                {suggestions.length <= 2 ? "✓" : "○"}
              </span>
              <span className={suggestions.length <= 2 ? "text-green-700" : "text-gray-500"}>
                Minimal Issues
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;