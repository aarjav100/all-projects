import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  MessageSquare, 
  Send, 
  Loader2,
  CheckCircle,
  XCircle,
  BookOpen,
  Calculator,
  Flask,
  Globe,
  Music,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TutorMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  subject?: string;
}

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
}

const AITutor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [currentSubject, setCurrentSubject] = useState('math');
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: <Calculator className="h-4 w-4" /> },
    { id: 'science', name: 'Science', icon: <Flask className="h-4 w-4" /> },
    { id: 'english', name: 'English', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'history', name: 'History', icon: <Globe className="h-4 w-4" /> },
    { id: 'art', name: 'Art', icon: <Palette className="h-4 w-4" /> },
    { id: 'music', name: 'Music', icon: <Music className="h-4 w-4" /> }
  ];

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const userMsg: TutorMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
      subject: currentSubject
    };

    setMessages(prev => [...prev, userMsg]);
    setUserMessage('');
    setLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateAIResponse(userMessage, currentSubject);
      const aiMsg: TutorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        subject: currentSubject
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = (message: string, subject: string): string => {
    const responses = {
      math: [
        "Let me help you with that math problem! The key concept here is understanding the relationship between variables. Would you like me to break it down step by step?",
        "Great question! In mathematics, this involves applying the fundamental theorem. Let me explain the process...",
        "I can see you're working on algebraic expressions. Remember to follow the order of operations: PEMDAS!"
      ],
      science: [
        "Excellent question about science! This involves understanding the scientific method and experimental design.",
        "In this experiment, we need to consider variables and controls. Let me explain the process...",
        "This scientific concept relates to natural laws. Would you like me to provide some examples?"
      ],
      english: [
        "Great question about English! Let's analyze the grammar and structure of this sentence.",
        "In literature, this technique is called foreshadowing. It helps build suspense and engage readers.",
        "For writing, remember to use clear topic sentences and supporting details."
      ]
    };

    const subjectResponses = responses[subject as keyof typeof responses] || responses.math;
    return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
  };

  const startPracticeSession = async () => {
    setPracticeMode(true);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockQuestion: PracticeQuestion = {
        id: '1',
        question: currentSubject === 'math' 
          ? "What is the value of x in the equation 2x + 5 = 13?"
          : currentSubject === 'science'
          ? "Which of the following is a chemical change?"
          : "Identify the part of speech for the word 'quickly' in the sentence: 'She quickly ran to the store.'",
        options: currentSubject === 'math' 
          ? ["x = 3", "x = 4", "x = 5", "x = 6"]
          : currentSubject === 'science'
          ? ["Melting ice", "Burning paper", "Breaking glass", "Dissolving salt"]
          : ["Noun", "Verb", "Adjective", "Adverb"],
        correctAnswer: currentSubject === 'math' ? 1 : currentSubject === 'science' ? 1 : 3,
        explanation: currentSubject === 'math'
          ? "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4"
          : currentSubject === 'science'
          ? "Burning paper is a chemical change because it produces new substances (ash and smoke) that cannot be reversed."
          : "'Quickly' is an adverb because it modifies the verb 'ran' by describing how the action was performed.",
        subject: currentSubject
      };
      
      setCurrentQuestion(mockQuestion);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion(null);
    startPracticeSession();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI Tutor
        </h1>
        <p className="text-lg text-muted-foreground">
          Get personalized tutoring and practice questions for any subject
        </p>
      </div>

      {/* Subject Selection */}
      <Card className="bg-gradient-to-br from-white to-indigo-50/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Choose Your Subject</CardTitle>
          <CardDescription>Select a subject to start learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                variant={currentSubject === subject.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  currentSubject === subject.id 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                    : ''
                }`}
                onClick={() => setCurrentSubject(subject.id)}
              >
                {subject.icon}
                <span className="text-sm">{subject.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practice Mode Toggle */}
      <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Learning Mode</CardTitle>
          <CardDescription>Choose between chat tutoring or practice questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant={!practiceMode ? "default" : "outline"}
              onClick={() => setPracticeMode(false)}
              className={!practiceMode ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : ''}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Tutor
            </Button>
            <Button
              variant={practiceMode ? "default" : "outline"}
              onClick={() => setPracticeMode(true)}
              className={practiceMode ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Practice Questions
            </Button>
          </div>
        </CardContent>
      </Card>

      {!practiceMode ? (
        /* Chat Interface */
        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Chat with Your AI Tutor</CardTitle>
            <CardDescription>Ask questions and get detailed explanations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Start a conversation with your AI tutor!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border shadow-sm p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Textarea
                placeholder="Ask your AI tutor anything..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Practice Questions */
        <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Practice Questions</CardTitle>
            <CardDescription>Test your knowledge with interactive questions</CardDescription>
          </CardHeader>
          <CardContent>
            {!currentQuestion ? (
              <div className="text-center space-y-4">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-600">Ready to practice {subjects.find(s => s.id === currentSubject)?.name}?</p>
                <Button 
                  onClick={startPracticeSession}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Start Practice'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 border rounded-lg bg-white">
                  <h3 className="font-semibold mb-4">{currentQuestion.question}</h3>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full justify-start h-auto p-3 ${
                          selectedAnswer === index
                            ? index === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : ''
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <div className="flex items-center space-x-2">
                          {selectedAnswer === index && (
                            index === currentQuestion.correctAnswer ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )
                          )}
                          <span>{String.fromCharCode(65 + index)}. {option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {showExplanation && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
                    <p className="text-blue-800">{currentQuestion.explanation}</p>
                  </div>
                )}

                {showExplanation && (
                  <Button 
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    Next Question
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AITutor; 