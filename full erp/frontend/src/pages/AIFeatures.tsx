import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  GraduationCap, 
  BarChart3, 
  Sparkles,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Target,
  Lightbulb,
  Zap,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Bookmark,
  Share2
} from 'lucide-react';

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [studyGoal, setStudyGoal] = useState('');
  const [aiPreferences, setAiPreferences] = useState({
    notifications: true,
    autoScheduling: true,
    personalizedContent: true,
    peerMatching: false
  });

  const aiFeatures = [
    {
      id: 'study-assistant',
      title: 'AI Study Assistant',
      description: 'Get personalized study recommendations and schedule optimization',
      icon: <Brain className="h-6 w-6" />,
      color: 'from-purple-500 to-blue-600',
      status: 'active'
    },
    {
      id: 'ai-tutor',
      title: 'AI Tutor',
      description: 'Interactive learning sessions with explanations and practice questions',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'from-indigo-500 to-purple-600',
      status: 'active'
    },
    {
      id: 'analytics',
      title: 'AI Analytics',
      description: 'Performance insights and predictive analytics for your learning',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'from-blue-500 to-purple-600',
      status: 'active'
    },
    {
      id: 'smart-scheduler',
      title: 'Smart Scheduler',
      description: 'AI-powered schedule optimization based on your learning patterns',
      icon: <Calendar className="h-6 w-6" />,
      color: 'from-green-500 to-blue-600',
      status: 'active'
    },
    {
      id: 'content-generator',
      title: 'Content Generator',
      description: 'Generate study materials and practice questions automatically',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-orange-500 to-red-600',
      status: 'active'
    },
    {
      id: 'peer-matching',
      title: 'AI Peer Matching',
      description: 'Find study partners based on learning styles and goals',
      icon: <Users className="h-6 w-6" />,
      color: 'from-pink-500 to-purple-600',
      status: 'active'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700 rounded-full shadow-lg">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          AI Learning Hub
        </h1>
        <p className="text-lg text-muted-foreground">
          Experience the future of education with AI-powered learning tools
        </p>
      </div>

      {/* Simple Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'overview' ? "default" : "outline"}
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'study-assistant' ? "default" : "outline"}
          onClick={() => setActiveTab('study-assistant')}
          className={activeTab === 'study-assistant' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
        >
          Study Assistant
        </Button>
        <Button
          variant={activeTab === 'tutor' ? "default" : "outline"}
          onClick={() => setActiveTab('tutor')}
          className={activeTab === 'tutor' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
        >
          AI Tutor
        </Button>
        <Button
          variant={activeTab === 'analytics' ? "default" : "outline"}
          onClick={() => setActiveTab('analytics')}
          className={activeTab === 'analytics' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
        >
          Analytics
        </Button>
        <Button
          variant={activeTab === 'scheduler' ? "default" : "outline"}
          onClick={() => setActiveTab('scheduler')}
          className={activeTab === 'scheduler' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
        >
          Smart Scheduler
        </Button>
        <Button
          variant={activeTab === 'content' ? "default" : "outline"}
          onClick={() => setActiveTab('content')}
          className={activeTab === 'content' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
        >
          Content Generator
        </Button>
        <Button
          variant={activeTab === 'peers' ? "default" : "outline"}
          onClick={() => setActiveTab('peers')}
          className={activeTab === 'peers' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
        >
          Peer Matching
        </Button>
        <Button
          variant={activeTab === 'packages' ? "default" : "outline"}
          onClick={() => setActiveTab('packages')}
          className={activeTab === 'packages' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
        >
          Campus Packages
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((feature) => (
              <Card key={feature.id} className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-lg`}>
                      {feature.icon}
                    </div>
                    <Badge 
                      variant={feature.status === 'active' ? 'default' : 'secondary'}
                      className={feature.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {feature.status === 'active' ? 'Active' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab(feature.id)}
                  >
                    Launch
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">AI Sessions</span>
                </div>
                <p className="text-2xl font-bold text-green-900">24</p>
                <p className="text-xs text-green-700">This month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Study Time</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">18.5h</p>
                <p className="text-xs text-blue-700">AI-assisted</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Efficiency</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">87%</p>
                <p className="text-xs text-purple-700">+12% improvement</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Score Boost</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">+15%</p>
                <p className="text-xs text-orange-700">Average improvement</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Preferences */}
          <Card className="bg-gradient-to-br from-white to-indigo-50/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>AI Preferences</CardTitle>
              <CardDescription>Customize your AI learning experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">AI Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={aiPreferences.notifications}
                      onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoScheduling">Auto Scheduling</Label>
                    <Switch
                      id="autoScheduling"
                      checked={aiPreferences.autoScheduling}
                      onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, autoScheduling: checked }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="personalizedContent">Personalized Content</Label>
                    <Switch
                      id="personalizedContent"
                      checked={aiPreferences.personalizedContent}
                      onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, personalizedContent: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="peerMatching">Peer Matching</Label>
                    <Switch
                      id="peerMatching"
                      checked={aiPreferences.peerMatching}
                      onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, peerMatching: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'study-assistant' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>AI Study Assistant</CardTitle>
                  <CardDescription>Get personalized study recommendations and optimize your learning</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                The AI Study Assistant analyzes your learning patterns and provides personalized recommendations 
                to help you study more effectively.
              </p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommended Study Schedule</h4>
                  <p className="text-blue-800">Study Mathematics in the morning when your focus is highest.</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-900 mb-2">Learning Technique</h4>
                  <p className="text-green-800">Use active recall methods for Science topics to improve retention.</p>
                </div>
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-900 mb-2">Resource Recommendation</h4>
                  <p className="text-purple-800">Check out Khan Academy videos for Physics concepts.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'tutor' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-indigo-50/50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>AI Tutor</CardTitle>
                  <CardDescription>Interactive learning sessions with explanations and practice questions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                The AI Tutor provides interactive learning sessions, explains complex concepts, 
                and offers practice questions to test your understanding.
              </p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-indigo-50">
                  <h4 className="font-semibold text-indigo-900 mb-2">Current Session</h4>
                  <p className="text-indigo-800">Mathematics: Solving Quadratic Equations</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-900 mb-2">Practice Question</h4>
                  <p className="text-green-800">What is the value of x in the equation 2x² + 5x - 3 = 0?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>AI Analytics</CardTitle>
                  <CardDescription>Performance insights and predictive analytics for your learning</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                AI Analytics provides detailed insights into your learning performance, 
                identifies patterns, and predicts future outcomes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-2">Performance Trend</h4>
                  <p className="text-blue-800">Mathematics: +7% improvement</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-900 mb-2">Study Efficiency</h4>
                  <p className="text-green-800">84% efficiency score</p>
                </div>
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-900 mb-2">Predicted Score</h4>
                  <p className="text-purple-800">Next month: 88%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'scheduler' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Smart Scheduler</CardTitle>
                  <CardDescription>AI-powered schedule optimization based on your learning patterns</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Study Preferences</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Study Duration</span>
                        <span className="text-sm font-medium">45 minutes</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Break Duration</span>
                        <span className="text-sm font-medium">15 minutes</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Preferred Time</span>
                        <span className="text-sm font-medium">Morning (8-11 AM)</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Generate Smart Schedule
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Optimized Schedule</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">Mathematics</p>
                          <p className="text-sm text-blue-700">8:00 AM - 8:45 AM</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">High Focus</Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-900">Science</p>
                          <p className="text-sm text-green-700">9:00 AM - 9:45 AM</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Medium Focus</Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg bg-purple-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-purple-900">English</p>
                          <p className="text-sm text-purple-700">10:00 AM - 10:45 AM</p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Low Focus</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Content Generator</CardTitle>
                  <CardDescription>Generate study materials and practice questions automatically</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content-subject">Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="practice-questions">Practice Questions</SelectItem>
                        <SelectItem value="study-notes">Study Notes</SelectItem>
                        <SelectItem value="flashcards">Flashcards</SelectItem>
                        <SelectItem value="summaries">Topic Summaries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content-topic">Topic or Concept</Label>
                    <Input placeholder="Enter the topic you want to study" />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Content
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Generated Content</h4>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Calculus Practice Question</h5>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Find the derivative of f(x) = x³ + 2x² - 5x + 3</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Mathematics</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Bookmark className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Physics Summary</h5>
                        <Badge variant="outline">Easy</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Newton's Laws of Motion: 1) Inertia, 2) F=ma, 3) Action-Reaction</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Science</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Bookmark className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'peers' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-pink-50/50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Users className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <CardTitle>AI Peer Matching</CardTitle>
                  <CardDescription>Find study partners based on learning styles and goals</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="peer-subject">Study Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="study-style">Your Study Style</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your study style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Visual Learner</SelectItem>
                        <SelectItem value="auditory">Auditory Learner</SelectItem>
                        <SelectItem value="kinesthetic">Kinesthetic Learner</SelectItem>
                        <SelectItem value="reading">Reading/Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="availability">Preferred Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                        <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
                        <SelectItem value="night">Night (8 PM - 12 AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                    <Users className="h-4 w-4 mr-2" />
                    Find Study Partners
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Recommended Study Partners</h4>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium">Sarah Johnson</h5>
                          <p className="text-sm text-gray-600">Mathematics</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">4.8</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            95% Match
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Study Style:</span> Visual Learner</p>
                        <p><span className="font-medium">Availability:</span> Weekdays 2-4 PM</p>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium">Mike Chen</h5>
                          <p className="text-sm text-gray-600">Science</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">4.6</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            87% Match
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Study Style:</span> Active Learner</p>
                        <p><span className="font-medium">Availability:</span> Weekends 10 AM-12 PM</p>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-emerald-50/50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle>Top 10 Campus Packages</CardTitle>
                  <CardDescription>AI-curated best packages and deals available on campus</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Package 1 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">#1</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Premium Study Package</h4>
                    <p className="text-sm text-gray-600 mb-3">Complete access to library, study rooms, and online resources</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$299</span>
                      <span className="text-sm text-gray-500 line-through">$399</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.9/5</span>
                      <span className="text-sm text-gray-500">(1,234 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 2 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-orange-500 text-white">#2</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-t-lg flex items-center justify-center">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Group Study Bundle</h4>
                    <p className="text-sm text-gray-600 mb-3">Study group access, collaborative tools, and peer tutoring</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$199</span>
                      <span className="text-sm text-gray-500 line-through">$249</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.8/5</span>
                      <span className="text-sm text-gray-500">(856 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 3 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500 text-white">#3</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-t-lg flex items-center justify-center">
                      <Brain className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">AI Learning Suite</h4>
                    <p className="text-sm text-gray-600 mb-3">Full access to AI tutors, analytics, and personalized learning</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$399</span>
                      <span className="text-sm text-gray-500 line-through">$499</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.9/5</span>
                      <span className="text-sm text-gray-500">(2,156 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 4 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500 text-white">#4</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-t-lg flex items-center justify-center">
                      <Target className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Exam Prep Pro</h4>
                    <p className="text-sm text-gray-600 mb-3">Comprehensive exam preparation with practice tests and analytics</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$149</span>
                      <span className="text-sm text-gray-500 line-through">$199</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.7/5</span>
                      <span className="text-sm text-gray-500">(1,089 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 5 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-blue-500 text-white">#5</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-teal-500 to-green-600 rounded-t-lg flex items-center justify-center">
                      <FileText className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Research & Writing</h4>
                    <p className="text-sm text-gray-600 mb-3">Access to research databases, writing tools, and citation help</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$179</span>
                      <span className="text-sm text-gray-500 line-through">$229</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.6/5</span>
                      <span className="text-sm text-gray-500">(743 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-green-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 6 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-purple-500 text-white">#6</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Time Management Pro</h4>
                    <p className="text-sm text-gray-600 mb-3">Smart scheduling, productivity tools, and study planning</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$99</span>
                      <span className="text-sm text-gray-500 line-through">$129</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.5/5</span>
                      <span className="text-sm text-gray-500">(567 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 7 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-pink-500 text-white">#7</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-pink-500 to-rose-600 rounded-t-lg flex items-center justify-center">
                      <MessageSquare className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Communication Skills</h4>
                    <p className="text-sm text-gray-600 mb-3">Presentation tools, public speaking practice, and feedback</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$129</span>
                      <span className="text-sm text-gray-500 line-through">$159</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.4/5</span>
                      <span className="text-sm text-gray-500">(432 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 8 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-indigo-500 text-white">#8</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-t-lg flex items-center justify-center">
                      <TrendingUp className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Career Development</h4>
                    <p className="text-sm text-gray-600 mb-3">Resume building, interview prep, and career counseling</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$199</span>
                      <span className="text-sm text-gray-500 line-through">$249</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.8/5</span>
                      <span className="text-sm text-gray-500">(891 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 9 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-teal-500 text-white">#9</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-t-lg flex items-center justify-center">
                      <Zap className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Wellness & Balance</h4>
                    <p className="text-sm text-gray-600 mb-3">Stress management, mindfulness, and work-life balance tools</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$89</span>
                      <span className="text-sm text-gray-500 line-through">$119</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.6/5</span>
                      <span className="text-sm text-gray-500">(678 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 10 */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gray-500 text-white">#10</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-slate-500 to-gray-600 rounded-t-lg flex items-center justify-center">
                      <Award className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">Complete Student Bundle</h4>
                    <p className="text-sm text-gray-600 mb-3">All-inclusive package with everything you need for success</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">$599</span>
                      <span className="text-sm text-gray-500 line-through">$899</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.9/5</span>
                      <span className="text-sm text-gray-500">(3,421 reviews)</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-slate-500 to-gray-600">
                      Get Package
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIFeatures; 