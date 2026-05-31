import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Lightbulb,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudyRecommendation {
  id: string;
  type: 'schedule' | 'technique' | 'resource' | 'reminder';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

const AIStudyAssistant = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [studyStats, setStudyStats] = useState({
    totalStudyTime: 0,
    efficiency: 85,
    focusScore: 78,
    improvement: 12
  });

  const handleAskAI = async () => {
    if (!userQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question or request.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations: StudyRecommendation[] = [
        {
          id: '1',
          type: 'schedule',
          title: 'Optimize Study Schedule',
          description: 'Based on your performance patterns, study Mathematics in the morning when your focus is highest.',
          priority: 'high',
          estimatedTime: 30
        },
        {
          id: '2',
          type: 'technique',
          title: 'Active Recall Method',
          description: 'Use flashcards and practice tests for Science topics to improve retention by 40%.',
          priority: 'medium',
          estimatedTime: 45
        },
        {
          id: '3',
          type: 'resource',
          title: 'Recommended Resources',
          description: 'Check out Khan Academy videos for Physics concepts you\'re struggling with.',
          priority: 'low',
          estimatedTime: 20
        }
      ];

      setRecommendations(mockRecommendations);
      toast({
        title: "AI Analysis Complete",
        description: "Your personalized study recommendations are ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'schedule': return <Clock className="h-4 w-4" />;
      case 'technique': return <Brain className="h-4 w-4" />;
      case 'resource': return <BookOpen className="h-4 w-4" />;
      case 'reminder': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full shadow-lg">
            <Brain className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI Study Assistant
        </h1>
        <p className="text-lg text-muted-foreground">
          Get personalized study recommendations and optimize your learning
        </p>
      </div>

      {/* Study Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Study Time</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{studyStats.totalStudyTime}h</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Efficiency</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{studyStats.efficiency}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Focus Score</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{studyStats.focusScore}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Improvement</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">+{studyStats.improvement}%</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Interface */}
      <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Ask Your AI Study Assistant</CardTitle>
              <CardDescription>
                Get personalized study advice, schedule optimization, and learning strategies
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Ask me anything about your studies, schedule, or learning strategies..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button 
            onClick={handleAskAI}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ask AI Assistant
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lightbulb className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  Personalized suggestions based on your study patterns and performance
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <div key={recommendation.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(recommendation.type)}
                      <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                    </div>
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{recommendation.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Estimated time: {recommendation.estimatedTime} minutes</span>
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Tracking */}
      <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Track your improvement across different subjects
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mathematics</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Science</span>
                <span>72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>English</span>
                <span>91%</span>
              </div>
              <Progress value={91} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIStudyAssistant; 