import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Award, TrendingUp, BookOpen, Calculator, Download, BarChart3, Calendar, Filter, Eye, FileText, Printer, Share2, TrendingDown, Target, Trophy, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';

const Grades = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock grades data with more details
  const [grades, setGrades] = useState([
    {
      id: 1,
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      assignment: 'Midterm Exam',
      score: 85,
      maxScore: 100,
      grade: 'B+',
      date: '2024-10-15',
      instructor: 'Dr. Smith',
      semester: 'Fall 2024',
      weight: 30,
      comments: 'Good understanding of basic concepts. Consider reviewing recursion.',
      category: 'Exam'
    },
    {
      id: 2,
      courseCode: 'MATH201',
      courseName: 'Calculus I',
      assignment: 'Final Exam',
      score: 92,
      maxScore: 100,
      grade: 'A-',
      date: '2024-12-10',
      instructor: 'Dr. Johnson',
      semester: 'Fall 2024',
      weight: 40,
      comments: 'Excellent work! Strong analytical skills demonstrated.',
      category: 'Exam'
    },
    {
      id: 3,
      courseCode: 'ENG101',
      courseName: 'English Composition',
      assignment: 'Research Paper',
      score: 88,
      maxScore: 100,
      grade: 'B+',
      date: '2024-11-20',
      instructor: 'Dr. Williams',
      semester: 'Fall 2024',
      weight: 25,
      comments: 'Well-researched paper with clear arguments. Minor grammar issues.',
      category: 'Assignment'
    },
    {
      id: 4,
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      assignment: 'Programming Assignment 1',
      score: 95,
      maxScore: 100,
      grade: 'A',
      date: '2024-09-25',
      instructor: 'Dr. Smith',
      semester: 'Fall 2024',
      weight: 15,
      comments: 'Excellent code structure and documentation.',
      category: 'Assignment'
    },
    {
      id: 5,
      courseCode: 'MATH201',
      courseName: 'Calculus I',
      assignment: 'Homework Set 1',
      score: 78,
      maxScore: 100,
      grade: 'C+',
      date: '2024-09-15',
      instructor: 'Dr. Johnson',
      semester: 'Fall 2024',
      weight: 10,
      comments: 'Several calculation errors. Review derivative rules.',
      category: 'Homework'
    },
    {
      id: 6,
      courseCode: 'ENG101',
      courseName: 'English Composition',
      assignment: 'Essay 1',
      score: 91,
      maxScore: 100,
      grade: 'A-',
      date: '2024-10-05',
      instructor: 'Dr. Williams',
      semester: 'Fall 2024',
      weight: 20,
      comments: 'Strong thesis and supporting evidence. Well-written conclusion.',
      category: 'Assignment'
    }
  ]);

  // Filtered grades based on semester
  const filteredGrades = useMemo(() => {
    if (selectedSemester === 'all') return grades;
    return grades.filter(grade => grade.semester === selectedSemester);
  }, [grades, selectedSemester]);

  // Available semesters
  const semesters = useMemo(() => {
    const uniqueSemesters = [...new Set(grades.map(grade => grade.semester))];
    return ['all', ...uniqueSemesters];
  }, [grades]);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getGradePoints = (grade: string) => {
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    return gradePoints[grade as keyof typeof gradePoints] || 0;
  };

  const calculateGPA = () => {
    const totalPoints = filteredGrades.reduce((sum, grade) => {
      return sum + getGradePoints(grade.grade);
    }, 0);
    
    return filteredGrades.length > 0 ? (totalPoints / filteredGrades.length).toFixed(2) : '0.00';
  };

  const calculateWeightedGPA = () => {
    const totalWeightedPoints = filteredGrades.reduce((sum, grade) => {
      return sum + (getGradePoints(grade.grade) * grade.weight);
    }, 0);
    
    const totalWeight = filteredGrades.reduce((sum, grade) => sum + grade.weight, 0);
    
    return totalWeight > 0 ? (totalWeightedPoints / totalWeight).toFixed(2) : '0.00';
  };

  const averageScore = filteredGrades.length > 0 
    ? filteredGrades.reduce((sum, grade) => sum + grade.score, 0) / filteredGrades.length 
    : 0;

  const gradeDistribution = useMemo(() => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    filteredGrades.forEach(grade => {
      if (grade.grade.startsWith('A')) distribution.A++;
      else if (grade.grade.startsWith('B')) distribution.B++;
      else if (grade.grade.startsWith('C')) distribution.C++;
      else if (grade.grade.startsWith('D')) distribution.D++;
      else distribution.F++;
    });
    return distribution;
  }, [filteredGrades]);

  const coursePerformance = useMemo(() => {
    const courseMap = new Map();
    filteredGrades.forEach(grade => {
      if (!courseMap.has(grade.courseCode)) {
        courseMap.set(grade.courseCode, {
          courseCode: grade.courseCode,
          courseName: grade.courseName,
          grades: [],
          averageScore: 0,
          averageGrade: '',
          totalWeight: 0
        });
      }
      const course = courseMap.get(grade.courseCode);
      course.grades.push(grade);
      course.totalWeight += grade.weight;
    });

    // Calculate averages for each course
    courseMap.forEach(course => {
      const totalScore = course.grades.reduce((sum: number, grade: any) => sum + grade.score, 0);
      course.averageScore = totalScore / course.grades.length;
      
      const totalGradePoints = course.grades.reduce((sum: number, grade: any) => sum + getGradePoints(grade.grade), 0);
      const avgGradePoints = totalGradePoints / course.grades.length;
      
      // Convert grade points back to letter grade
      if (avgGradePoints >= 3.7) course.averageGrade = 'A-';
      else if (avgGradePoints >= 3.3) course.averageGrade = 'B+';
      else if (avgGradePoints >= 3.0) course.averageGrade = 'B';
      else if (avgGradePoints >= 2.7) course.averageGrade = 'B-';
      else if (avgGradePoints >= 2.3) course.averageGrade = 'C+';
      else if (avgGradePoints >= 2.0) course.averageGrade = 'C';
      else if (avgGradePoints >= 1.7) course.averageGrade = 'C-';
      else if (avgGradePoints >= 1.3) course.averageGrade = 'D+';
      else if (avgGradePoints >= 1.0) course.averageGrade = 'D';
      else course.averageGrade = 'F';
    });

    return Array.from(courseMap.values());
  }, [filteredGrades]);

  const exportGrades = () => {
    const csvContent = [
      ['Course Code', 'Course Name', 'Assignment', 'Score', 'Max Score', 'Grade', 'Date', 'Instructor', 'Weight', 'Comments'],
      ...filteredGrades.map(grade => [
        grade.courseCode,
        grade.courseName,
        grade.assignment,
        grade.score,
        grade.maxScore,
        grade.grade,
        grade.date,
        grade.instructor,
        grade.weight,
        grade.comments
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades-${selectedSemester}-${user?.firstName}-${user?.lastName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printGrades = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Academic Grades Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #ccc; padding: 15px; text-align: center; }
            .grade-row { border-bottom: 1px solid #eee; padding: 10px 0; }
            .grade { font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ACADEMIC GRADES REPORT</h1>
            <h2>${user?.firstName} ${user?.lastName}</h2>
            <p>Student ID: ${user?.studentId}</p>
            <p>Semester: ${selectedSemester}</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <h3>GPA</h3>
              <p style="font-size: 24px; font-weight: bold;">${calculateGPA()}</p>
            </div>
            <div class="stat-card">
              <h3>Average Score</h3>
              <p style="font-size: 24px; font-weight: bold;">${averageScore.toFixed(1)}%</p>
            </div>
            <div class="stat-card">
              <h3>Total Assignments</h3>
              <p style="font-size: 24px; font-weight: bold;">${filteredGrades.length}</p>
            </div>
          </div>
          
          <h3>Grade Details</h3>
          ${filteredGrades.map(grade => `
            <div class="grade-row">
              <strong>${grade.courseCode} - ${grade.courseName}</strong><br>
              ${grade.assignment} | Score: ${grade.score}/${grade.maxScore} | Grade: <span class="grade">${grade.grade}</span> | Date: ${new Date(grade.date).toLocaleDateString()}<br>
              Instructor: ${grade.instructor} | Weight: ${grade.weight}%
            </div>
          `).join('')}
          
          <div class="footer">
            <p>This is an official academic transcript from the University ERP System.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-full shadow-lg">
            <Award className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Academic Grades
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back, {user?.firstName}! Here's your academic performance overview.
        </p>
      </div>

      {/* Semester Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Label className="font-medium">Semester:</Label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {semesters.map(semester => (
                <SelectItem key={semester} value={semester}>
                  {semester === 'all' ? 'All Semesters' : semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportGrades}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={printGrades}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Grade Details</TabsTrigger>
          <TabsTrigger value="courses">Course Performance</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{calculateGPA()}</p>
                    <p className="text-sm text-gray-600 font-medium">Current GPA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-green-50/50 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{averageScore.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600 font-medium">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{filteredGrades.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Total Assignments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{calculateWeightedGPA()}</p>
                    <p className="text-sm text-gray-600 font-medium">Weighted GPA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Overview of your performance across all assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{gradeDistribution.A}</p>
                  <p className="text-sm text-muted-foreground">A Grades</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{gradeDistribution.B}</p>
                  <p className="text-sm text-muted-foreground">B Grades</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{gradeDistribution.C}</p>
                  <p className="text-sm text-muted-foreground">C Grades</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{gradeDistribution.D}</p>
                  <p className="text-sm text-muted-foreground">D Grades</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{gradeDistribution.F}</p>
                  <p className="text-sm text-muted-foreground">F Grades</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grade Details</CardTitle>
              <CardDescription>Detailed breakdown of all your assignments and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGrades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{grade.courseCode} - {grade.courseName}</h3>
                        <Badge className={getGradeColor(grade.grade)}>
                          {grade.grade}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {grade.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {grade.assignment} • {grade.instructor} • Weight: {grade.weight}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(grade.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {grade.score}/{grade.maxScore}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedGrade(grade)}
                        className="mt-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>Performance breakdown by course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursePerformance.map((course) => (
                  <Card key={course.courseCode}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>{course.courseCode} - {course.courseName}</CardTitle>
                          <CardDescription>
                            {course.grades.length} assignments • Average: {course.averageScore.toFixed(1)}%
                          </CardDescription>
                        </div>
                        <Badge className={getGradeColor(course.averageGrade)}>
                          {course.averageGrade}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {course.grades.map((grade) => (
                          <div key={grade.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <div>
                              <p className="font-medium">{grade.assignment}</p>
                              <p className="text-sm text-muted-foreground">{grade.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{grade.score}/{grade.maxScore}</p>
                              <Badge className={getGradeColor(grade.grade)}>
                                {grade.grade}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your academic progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Performance</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">Improving</span>
                    </div>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Course Load</span>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-600 font-medium">Balanced</span>
                    </div>
                  </div>
                  <Progress value={60} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Study Efficiency</span>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="text-purple-600 font-medium">Good</span>
                    </div>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggestions for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Trophy className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Strong Performance</p>
                      <p className="text-sm text-blue-600">You're doing well in most courses. Keep up the good work!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Areas for Improvement</p>
                      <p className="text-sm text-yellow-600">Consider additional practice in Calculus I homework assignments.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Next Steps</p>
                      <p className="text-sm text-green-600">Focus on upcoming final exams and maintain current study habits.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Grade Details Dialog */}
      <Dialog open={!!selectedGrade} onOpenChange={() => setSelectedGrade(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Grade Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this assignment
            </DialogDescription>
          </DialogHeader>
          
          {selectedGrade && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{selectedGrade.courseCode} - {selectedGrade.courseName}</h3>
                  <Badge className={getGradeColor(selectedGrade.grade)}>
                    {selectedGrade.grade}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{selectedGrade.assignment}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Score:</span>
                    <p>{selectedGrade.score}/{selectedGrade.maxScore} ({(selectedGrade.score / selectedGrade.maxScore * 100).toFixed(1)}%)</p>
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span>
                    <p>{selectedGrade.weight}%</p>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>
                    <p>{new Date(selectedGrade.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Instructor:</span>
                    <p>{selectedGrade.instructor}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Instructor Comments</h4>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                  {selectedGrade.comments}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Grades; 