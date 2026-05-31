import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Users,
  Calendar,
  Lightbulb
} from 'lucide-react';

interface PerformanceMetric {
  subject: string;
  currentScore: number;
  previousScore: number;
  improvement: number;
  trend: 'up' | 'down' | 'stable';
  predictedScore: number;
}

interface LearningPattern {
  dayOfWeek: string;
  studyHours: number;
  efficiency: number;
  focusScore: number;
}

interface AIInsight {
  id: string;
  type: 'improvement' | 'warning' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

const AIAnalytics = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  useEffect(() => {
    // Simulate loading data
    const mockPerformanceData: PerformanceMetric[] = [
      {
        subject: 'Mathematics',
        currentScore: 85,
        previousScore: 78,
        improvement: 7,
        trend: 'up',
        predictedScore: 88
      },
      {
        subject: 'Science',
        currentScore: 72,
        previousScore: 75,
        improvement: -3,
        trend: 'down',
        predictedScore: 70
      },
      {
        subject: 'English',
        currentScore: 91,
        previousScore: 89,
        improvement: 2,
        trend: 'up',
        predictedScore: 93
      },
      {
        subject: 'History',
        currentScore: 68,
        previousScore: 65,
        improvement: 3,
        trend: 'up',
        predictedScore: 72
      }
    ];

    const mockLearningPatterns: LearningPattern[] = [
      { dayOfWeek: 'Monday', studyHours: 3.5, efficiency: 85, focusScore: 78 },
      { dayOfWeek: 'Tuesday', studyHours: 4.2, efficiency: 92, focusScore: 85 },
      { dayOfWeek: 'Wednesday', studyHours: 2.8, efficiency: 75, focusScore: 70 },
      { dayOfWeek: 'Thursday', studyHours: 3.9, efficiency: 88, focusScore: 82 },
      { dayOfWeek: 'Friday', studyHours: 2.1, efficiency: 65, focusScore: 60 },
      { dayOfWeek: 'Saturday', studyHours: 1.5, efficiency: 70, focusScore: 65 },
      { dayOfWeek: 'Sunday', studyHours: 2.0, efficiency: 80, focusScore: 75 }
    ];

    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'improvement',
        title: 'Strong Performance in Mathematics',
        description: 'Your math scores have improved by 7% this month. Keep up the excellent work!',
        priority: 'high',
        action: 'Continue current study methods'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Science Performance Declining',
        description: 'Science scores have dropped by 3%. Consider reviewing recent topics.',
        priority: 'high',
        action: 'Schedule extra study time'
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Optimal Study Time Identified',
        description: 'You perform best on Tuesdays with 92% efficiency. Schedule important topics then.',
        priority: 'medium',
        action: 'Adjust study schedule'
      },
      {
        id: '4',
        type: 'achievement',
        title: 'Consistent English Performance',
        description: 'Maintaining high scores in English. Consider advanced topics.',
        priority: 'low',
        action: 'Explore advanced materials'
      }
    ];

    setPerformanceData(mockPerformanceData);
    setLearningPatterns(mockLearningPatterns);
    setInsights(mockInsights);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case 'achievement': return <CheckCircle className="h-4 w-4 text-purple-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <BarChart3 className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Analytics Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-powered insights into your learning performance and patterns
        </p>
      </div>

      {/* Timeframe Selector */}
      <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            {['week', 'month', 'semester'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={selectedTimeframe === timeframe ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Average Score</span>
            </div>
            <p className="text-2xl font-bold text-green-900">79%</p>
            <p className="text-xs text-green-700">+2.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Study Hours</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">42h</p>
            <p className="text-xs text-blue-700">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Efficiency</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">84%</p>
            <p className="text-xs text-purple-700">+5% improvement</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Subjects</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">4</p>
            <p className="text-xs text-orange-700">Active courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Subject Performance Analysis</CardTitle>
          <CardDescription>AI-powered insights into your academic progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.map((subject) => (
              <div key={subject.subject} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{subject.currentScore}%</p>
                    <p className={`text-sm ${subject.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {subject.improvement >= 0 ? '+' : ''}{subject.improvement}%
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Current Score</span>
                    <span>{subject.currentScore}%</span>
                  </div>
                  <Progress value={subject.currentScore} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Predicted Score (Next Month)</span>
                    <span>{subject.predictedScore}%</span>
                  </div>
                  <Progress value={subject.predictedScore} className="h-2 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Patterns */}
      <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Weekly Learning Patterns</CardTitle>
          <CardDescription>AI analysis of your study habits and optimal learning times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {learningPatterns.map((pattern) => (
              <div key={pattern.dayOfWeek} className="text-center space-y-2">
                <div className="p-2 bg-white rounded-lg border">
                  <p className="text-xs font-medium text-gray-600">{pattern.dayOfWeek}</p>
                  <p className="text-lg font-bold text-gray-900">{pattern.studyHours}h</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Eff.</span>
                      <span>{pattern.efficiency}%</span>
                    </div>
                    <Progress value={pattern.efficiency} className="h-1" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Focus</span>
                      <span>{pattern.focusScore}%</span>
                    </div>
                    <Progress value={pattern.focusScore} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
          <CardDescription>Personalized recommendations based on your learning data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg bg-white">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{insight.description}</p>
                    {insight.action && (
                      <Button variant="outline" size="sm">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card className="bg-gradient-to-br from-white to-indigo-50/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
          <CardDescription>AI predictions for your future performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Next Month Predictions</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overall GPA</span>
                  <span className="font-semibold text-gray-900">3.4 → 3.6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Study Efficiency</span>
                  <span className="font-semibold text-gray-900">84% → 87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Focus Score</span>
                  <span className="font-semibold text-gray-900">78% → 82%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-yellow-800">Science Performance</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Medium Risk
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-800">Mathematics Progress</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Low Risk
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-800">Study Consistency</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Improving
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalytics; 