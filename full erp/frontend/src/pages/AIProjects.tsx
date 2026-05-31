import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Code, 
  Users, 
  FileText, 
  Upload, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Award,
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  User,
  Settings,
  Plus
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  aiArea: string;
  program: string;
  section: string;
  status: 'idea' | 'in-progress' | 'completed';
  guide: string;
  team: string[];
  rating: number;
  reviews: number;
  semester: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  progress: number;
}

const AIProjects = () => {
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const programs = [
    { id: 'btech', name: 'B.Tech (Computer Science / IT)', icon: <Code className="h-4 w-4" /> },
    { id: 'bcom', name: 'B.Com / BBA', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'mba', name: 'MBA (Marketing, HR, Finance)', icon: <Users className="h-4 w-4" /> },
    { id: 'pharma', name: 'B.Pharma / M.Pharma', icon: <Target className="h-4 w-4" /> },
    { id: 'bsc', name: 'B.Sc / M.Sc (Maths, Physics, Chemistry, Biology)', icon: <BookOpen className="h-4 w-4" /> }
  ];

  const projects: Project[] = [
    // B.Tech Projects
    {
      id: '1',
      title: 'Movie Recommendation System',
      description: 'Suggests movies based on user preferences using collaborative filtering and content-based algorithms',
      aiArea: 'Machine Learning',
      program: 'btech',
      section: 'CSE-A',
      status: 'completed',
      guide: 'Dr. Sarah Johnson',
      team: ['John Doe', 'Jane Smith', 'Mike Chen'],
      rating: 4.8,
      reviews: 45,
      semester: '6th Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'TensorFlow', 'Pandas', 'Scikit-learn'],
      progress: 100
    },
    {
      id: '2',
      title: 'AI Virtual Assistant (Jarvis)',
      description: 'Voice-controlled AI assistant with natural language processing and speech recognition',
      aiArea: 'NLP + Speech',
      program: 'btech',
      section: 'CSE-B',
      status: 'in-progress',
      guide: 'Prof. Robert Wilson',
      team: ['Alex Brown', 'Emma Davis'],
      rating: 4.6,
      reviews: 32,
      semester: '7th Semester',
      difficulty: 'advanced',
      technologies: ['Python', 'SpeechRecognition', 'NLTK', 'OpenAI'],
      progress: 75
    },
    {
      id: '3',
      title: 'Face Recognition Attendance System',
      description: 'Automated attendance marking using facial recognition and computer vision',
      aiArea: 'Computer Vision',
      program: 'btech',
      section: 'IT-A',
      status: 'completed',
      guide: 'Dr. Lisa Chen',
      team: ['David Lee', 'Sophie Wang'],
      rating: 4.9,
      reviews: 67,
      semester: '5th Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'OpenCV', 'Face Recognition', 'SQLite'],
      progress: 100
    },
    {
      id: '4',
      title: 'Traffic Sign Recognition',
      description: 'Real-time traffic sign classification using Convolutional Neural Networks',
      aiArea: 'Deep Learning',
      program: 'btech',
      section: 'CSE-A',
      status: 'in-progress',
      guide: 'Prof. Michael Brown',
      team: ['Ryan Johnson', 'Maria Garcia'],
      rating: 4.5,
      reviews: 28,
      semester: '8th Semester',
      difficulty: 'advanced',
      technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
      progress: 60
    },
    {
      id: '5',
      title: 'Self-Driving Car Simulation',
      description: 'Reinforcement learning-based autonomous driving simulation',
      aiArea: 'Reinforcement Learning',
      program: 'btech',
      section: 'CSE-B',
      status: 'idea',
      guide: 'Dr. James Wilson',
      team: ['Tom Anderson', 'Sarah Miller'],
      rating: 0,
      reviews: 0,
      semester: '8th Semester',
      difficulty: 'advanced',
      technologies: ['Python', 'PyTorch', 'Gym', 'Unity'],
      progress: 0
    },

    // B.Com/BBA Projects
    {
      id: '6',
      title: 'Stock Market Predictor',
      description: 'LSTM-based stock price prediction using historical market data',
      aiArea: 'Time Series',
      program: 'bcom',
      section: 'BCOM-A',
      status: 'completed',
      guide: 'Prof. Emily Davis',
      team: ['Kevin Zhang', 'Rachel Green'],
      rating: 4.7,
      reviews: 89,
      semester: '6th Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'TensorFlow', 'Pandas', 'Yahoo Finance API'],
      progress: 100
    },
    {
      id: '7',
      title: 'Sales Prediction System',
      description: 'Machine learning model to predict future product sales',
      aiArea: 'ML Regression',
      program: 'bcom',
      section: 'BBA-C',
      status: 'in-progress',
      guide: 'Dr. Amanda White',
      team: ['Chris Lee', 'Jessica Kim'],
      rating: 4.4,
      reviews: 56,
      semester: '5th Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
      progress: 80
    },
    {
      id: '8',
      title: 'Customer Sentiment Analysis',
      description: 'NLP-based sentiment analysis of customer reviews and social media',
      aiArea: 'NLP',
      program: 'bcom',
      section: 'BCOM-B',
      status: 'completed',
      guide: 'Prof. Daniel Kim',
      team: ['Lisa Park', 'Mark Thompson'],
      rating: 4.6,
      reviews: 73,
      semester: '7th Semester',
      difficulty: 'beginner',
      technologies: ['Python', 'NLTK', 'TextBlob', 'Pandas'],
      progress: 100
    },

    // MBA Projects
    {
      id: '9',
      title: 'AI for Resume Shortlisting',
      description: 'NLP-based intelligent resume filtering system for HR recruitment',
      aiArea: 'NLP',
      program: 'mba',
      section: 'MBA-HR',
      status: 'completed',
      guide: 'Dr. Patricia Johnson',
      team: ['Amanda Wilson', 'Brian Davis'],
      rating: 4.8,
      reviews: 94,
      semester: '3rd Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'Spacy', 'Scikit-learn', 'PDF Processing'],
      progress: 100
    },
    {
      id: '10',
      title: 'Customer Segmentation',
      description: 'Unsupervised learning to cluster customers by behavior patterns',
      aiArea: 'Unsupervised ML',
      program: 'mba',
      section: 'MBA-MKT',
      status: 'in-progress',
      guide: 'Prof. Richard Brown',
      team: ['Samantha Lee', 'Kevin Chen'],
      rating: 4.5,
      reviews: 41,
      semester: '2nd Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'Scikit-learn', 'KMeans', 'DBSCAN'],
      progress: 70
    },

    // Pharma Projects
    {
      id: '11',
      title: 'Disease Prediction System',
      description: 'Machine learning model to predict diseases based on symptoms',
      aiArea: 'Classification ML',
      program: 'pharma',
      section: 'PHARMA-A',
      status: 'completed',
      guide: 'Dr. Jennifer Smith',
      team: ['Michael Johnson', 'Emily Brown'],
      rating: 4.9,
      reviews: 156,
      semester: '6th Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
      progress: 100
    },
    {
      id: '12',
      title: 'Medical Image Analysis',
      description: 'Deep learning model to detect tumors in X-ray and MRI scans',
      aiArea: 'Deep Learning (CNN)',
      program: 'pharma',
      section: 'PHARMA-B',
      status: 'in-progress',
      guide: 'Prof. David Wilson',
      team: ['Sarah Davis', 'Robert Lee'],
      rating: 4.7,
      reviews: 78,
      semester: '7th Semester',
      difficulty: 'advanced',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Medical Imaging'],
      progress: 85
    },

    // B.Sc/M.Sc Projects
    {
      id: '13',
      title: 'Chemical Compound Classifier',
      description: 'Machine learning model to predict compound categories based on molecular structure',
      aiArea: 'ML Classification',
      program: 'bsc',
      section: 'BSC-MATH',
      status: 'completed',
      guide: 'Dr. Thomas Anderson',
      team: ['Laura Wilson', 'James Brown'],
      rating: 4.6,
      reviews: 62,
      semester: '5th Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'RDKit', 'Scikit-learn', 'Chemistry Libraries'],
      progress: 100
    },
    {
      id: '14',
      title: 'Plant Disease Detection',
      description: 'Computer vision system to detect diseases from plant leaf photographs',
      aiArea: 'Computer Vision',
      program: 'bsc',
      section: 'MSC-BIO',
      status: 'in-progress',
      guide: 'Prof. Maria Garcia',
      team: ['Carlos Rodriguez', 'Anna Kim'],
      rating: 4.4,
      reviews: 35,
      semester: '4th Semester',
      difficulty: 'intermediate',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Image Processing'],
      progress: 65
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'idea': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'idea': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesProgram = selectedProgram === 'all' || project.program === selectedProgram;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.aiArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesStatus && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <Code className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Project Hub
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore and manage AI projects across different academic programs
        </p>
      </div>

      <Tabs defaultValue="projects" className="flex-1">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="projects">All Projects</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="submit">Submit Project</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {/* Filters */}
          <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Project Filters</CardTitle>
              <CardDescription>Filter projects by program, status, and search terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Program</label>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input 
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                        </Badge>
                        <Badge className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">AI Area:</span>
                      <span className="font-medium">{project.aiArea}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Program:</span>
                      <span className="font-medium">{programs.find(p => p.id === project.program)?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Section:</span>
                      <span className="font-medium">{project.section}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Guide:</span>
                      <span className="font-medium">{project.guide}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{project.rating}</span>
                      <span className="text-sm text-gray-500">({project.reviews})</span>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => {
              const programProjects = projects.filter(p => p.program === program.id);
              const completedProjects = programProjects.filter(p => p.status === 'completed').length;
              const inProgressProjects = programProjects.filter(p => p.status === 'in-progress').length;
              const totalProjects = programProjects.length;

              return (
                <Card key={program.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {program.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <CardDescription>{totalProjects} total projects</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{inProgressProjects}</div>
                        <div className="text-xs text-gray-500">In Progress</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{totalProjects - completedProjects - inProgressProjects}</div>
                        <div className="text-xs text-gray-500">Ideas</div>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      View Projects
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="submit" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Submit New AI Project</CardTitle>
                  <CardDescription>Share your AI project idea with the community</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Title</label>
                    <Input placeholder="Enter project title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea 
                      placeholder="Describe your project idea..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">AI Area</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ml">Machine Learning</SelectItem>
                        <SelectItem value="nlp">Natural Language Processing</SelectItem>
                        <SelectItem value="cv">Computer Vision</SelectItem>
                        <SelectItem value="dl">Deep Learning</SelectItem>
                        <SelectItem value="rl">Reinforcement Learning</SelectItem>
                        <SelectItem value="ts">Time Series</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Program</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Section</label>
                    <Input placeholder="e.g., CSE-A, MBA-HR" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Technologies</label>
                    <Input placeholder="e.g., Python, TensorFlow, OpenCV" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Team Members</label>
                    <Input placeholder="Enter team member names" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Files</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Drag and drop files here or click to browse</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Total Projects</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{projects.length}</p>
                <p className="text-xs text-green-700">Across all programs</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Completed</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{projects.filter(p => p.status === 'completed').length}</p>
                <p className="text-xs text-blue-700">Successfully finished</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Active Teams</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{projects.filter(p => p.status === 'in-progress').length}</p>
                <p className="text-xs text-purple-700">Currently working</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Avg Rating</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">4.7</p>
                <p className="text-xs text-orange-700">Out of 5 stars</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-white to-indigo-50/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Project Analytics</CardTitle>
              <CardDescription>Detailed insights into AI project performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Projects by Program</h4>
                  <div className="space-y-3">
                    {programs.map((program) => {
                      const count = projects.filter(p => p.program === program.id).length;
                      const percentage = (count / projects.length) * 100;
                      return (
                        <div key={program.id} className="flex items-center justify-between">
                          <span className="text-sm">{program.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Projects by Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm font-medium">{projects.filter(p => p.status === 'completed').length}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">In Progress</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-sm font-medium">{projects.filter(p => p.status === 'in-progress').length}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ideas</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm font-medium">{projects.filter(p => p.status === 'idea').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIProjects; 