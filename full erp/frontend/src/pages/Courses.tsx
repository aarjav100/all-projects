import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Users, Calendar, MapPin, FileText, Download, Upload, MessageSquare, Star, Bookmark, Share2, Eye, Edit, Trash2, Plus, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useMemo, useState } from 'react';

const Courses = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('courseCode');
  const [sortOrder, setSortOrder] = useState('asc');

  // Mock course data with more details
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseCode: 'CS101',
      title: 'Introduction to Computer Science',
      description: 'Basic concepts of programming and computer science fundamentals',
      credits: 3,
      instructor: 'Dr. Smith',
      schedule: 'MWF 10:00-11:15',
      room: 'Room 101',
      enrolledStudents: 25,
      maxStudents: 30,
      status: 'enrolled',
      semester: 'Fall 2024',
      progress: 75,
      grade: 'A-',
      assignments: [
        { id: 1, title: 'Programming Assignment 1', dueDate: '2024-12-15', status: 'submitted', grade: 95 },
        { id: 2, title: 'Midterm Exam', dueDate: '2024-12-20', status: 'pending', grade: null },
        { id: 3, title: 'Final Project', dueDate: '2024-12-30', status: 'pending', grade: null }
      ],
      materials: [
        { id: 1, title: 'Course Syllabus', type: 'pdf', size: '2.5 MB', uploaded: '2024-09-01' },
        { id: 2, title: 'Lecture Notes - Week 1', type: 'pdf', size: '1.8 MB', uploaded: '2024-09-03' },
        { id: 3, title: 'Programming Exercises', type: 'zip', size: '5.2 MB', uploaded: '2024-09-05' }
      ],
      announcements: [
        { id: 1, title: 'Office Hours Changed', content: 'Office hours moved to Tuesday 2-4 PM', date: '2024-12-10' },
        { id: 2, title: 'Assignment Extension', content: 'Assignment 1 deadline extended by 2 days', date: '2024-12-08' }
      ]
    },
    {
      id: 2,
      courseCode: 'MATH201',
      title: 'Calculus I',
      description: 'Introduction to differential calculus and its applications',
      credits: 4,
      instructor: 'Dr. Johnson',
      schedule: 'TTh 14:00-15:30',
      room: 'Room 202',
      enrolledStudents: 20,
      maxStudents: 25,
      status: 'enrolled',
      semester: 'Fall 2024',
      progress: 60,
      grade: 'B+',
      assignments: [
        { id: 1, title: 'Homework Set 1', dueDate: '2024-12-12', status: 'submitted', grade: 88 },
        { id: 2, title: 'Midterm Exam', dueDate: '2024-12-18', status: 'submitted', grade: 92 },
        { id: 3, title: 'Final Exam', dueDate: '2024-12-25', status: 'pending', grade: null }
      ],
      materials: [
        { id: 1, title: 'Calculus Textbook', type: 'pdf', size: '15.2 MB', uploaded: '2024-09-01' },
        { id: 2, title: 'Practice Problems', type: 'pdf', size: '3.1 MB', uploaded: '2024-09-02' }
      ],
      announcements: [
        { id: 1, title: 'Extra Credit Opportunity', content: 'Complete bonus problems for extra credit', date: '2024-12-09' }
      ]
    },
    {
      id: 3,
      courseCode: 'ENG101',
      title: 'English Composition',
      description: 'College-level writing and composition skills',
      credits: 3,
      instructor: 'Dr. Williams',
      schedule: 'MWF 13:00-14:15',
      room: 'Room 303',
      enrolledStudents: 18,
      maxStudents: 22,
      status: 'enrolled',
      semester: 'Fall 2024',
      progress: 85,
      grade: 'A',
      assignments: [
        { id: 1, title: 'Essay 1', dueDate: '2024-12-10', status: 'submitted', grade: 96 },
        { id: 2, title: 'Essay 2', dueDate: '2024-12-22', status: 'submitted', grade: 94 },
        { id: 3, title: 'Final Essay', dueDate: '2024-12-28', status: 'pending', grade: null }
      ],
      materials: [
        { id: 1, title: 'Writing Guide', type: 'pdf', size: '1.2 MB', uploaded: '2024-09-01' },
        { id: 2, title: 'Sample Essays', type: 'pdf', size: '2.8 MB', uploaded: '2024-09-03' }
      ],
      announcements: [
        { id: 1, title: 'Writing Workshop', content: 'Optional writing workshop this Friday', date: '2024-12-11' }
      ]
    }
  ]);

  // Filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [courses, searchTerm, sortBy, sortOrder]);

  // Memoized calculations for better performance
  const courseStats = useMemo(() => ({
    totalCourses: courses.length,
    totalCredits: courses.reduce((total, course) => total + course.credits, 0),
    totalClassmates: courses.reduce((total, course) => total + course.enrolledStudents, 0),
    averageGrade: courses.reduce((total, course) => {
      const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 };
      return total + (gradePoints[course.grade as keyof typeof gradePoints] || 0);
    }, 0) / courses.length
  }), [courses]);

  const getStatusColor = (status: string) => {
    const statusColors = {
      enrolled: 'bg-green-100 text-green-800',
      waitlist: 'bg-yellow-100 text-yellow-800',
      dropped: 'bg-red-100 text-red-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CourseCard = ({ course }: { course: typeof courses[0] }) => (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1">
            <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                {course.courseCode}
              </span>
              - {course.title}
              <Badge className={`${getStatusColor(course.status)} font-medium px-3 py-1`}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-2 text-sm leading-relaxed text-gray-600">
              {course.description}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-sm shrink-0 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 text-green-700 font-medium">
              {course.credits} Credits
            </Badge>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Grade</p>
              <p className="text-lg font-bold text-green-600">{course.grade}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{course.schedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{course.room}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm">{course.enrolledStudents}/{course.maxStudents}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Course Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedCourse(course);
              setActiveTab('overview');
            }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 font-medium"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedCourse(course);
              setActiveTab('assignments');
            }}
            className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700 hover:from-green-100 hover:to-green-200 transition-all duration-200 font-medium"
          >
            <FileText className="h-4 w-4 mr-1" />
            Assignments
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedCourse(course);
              setActiveTab('materials');
            }}
            className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 font-medium"
          >
            <Download className="h-4 w-4 mr-1" />
            Materials
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const StatsCard = ({ icon: Icon, value, label, color, subtitle }: {
    icon: any;
    value: number | string;
    label: string;
    color: string;
    subtitle?: string;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color.replace('text-', 'from-').replace('-500', '-400')} to-${color.replace('text-', '').replace('-500', '-600')} shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600 font-medium">{label}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-3">No Courses Enrolled</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                You haven't enrolled in any courses yet. Contact your academic advisor to get started.
              </p>
              <Button className="w-full">Browse Available Courses</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Courses
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back, {user?.firstName}! Here are your enrolled courses for {courses[0]?.semester}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="courseCode">Course Code</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={BookOpen}
          value={courseStats.totalCourses}
          label="Enrolled Courses"
          color="text-blue-500"
        />
        <StatsCard
          icon={Clock}
          value={courseStats.totalCredits}
          label="Total Credits"
          color="text-green-500"
        />
        <StatsCard
          icon={Users}
          value={courseStats.totalClassmates}
          label="Total Classmates"
          color="text-purple-500"
        />
        <StatsCard
          icon={Star}
          value={courseStats.averageGrade.toFixed(2)}
          label="GPA"
          color="text-orange-500"
          subtitle="Current Semester"
        />
      </div>

      {/* Course List */}
      <div className="flex-1 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Current Semester</h2>
          <p className="text-muted-foreground">Fall 2024</p>
        </div>
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Course Details Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {selectedCourse?.courseCode} - {selectedCourse?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedCourse?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Instructor:</span>
                        <span>{selectedCourse.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Schedule:</span>
                        <span>{selectedCourse.schedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Room:</span>
                        <span>{selectedCourse.room}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Credits:</span>
                        <span>{selectedCourse.credits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Enrollment:</span>
                        <span>{selectedCourse.enrolledStudents}/{selectedCourse.maxStudents}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Course Progress</span>
                          <span>{selectedCourse.progress}%</span>
                        </div>
                        <Progress value={selectedCourse.progress} className="h-2" />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedCourse.grade}</p>
                        <p className="text-sm text-muted-foreground">Current Grade</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Assignments</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Submit Assignment
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedCourse.assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getAssignmentStatusColor(assignment.status)}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Badge>
                            {assignment.grade && (
                              <p className="text-sm font-medium mt-1">Grade: {assignment.grade}%</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Course Materials</h3>
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedCourse.materials.map((material) => (
                    <Card key={material.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium">{material.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {material.size} • {material.type.toUpperCase()} • Uploaded {new Date(material.uploaded).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="announcements" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Announcements</h3>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact Instructor
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedCourse.announcements.map((announcement) => (
                    <Card key={announcement.id}>
                      <CardContent className="p-4">
                        <div>
                          <h4 className="font-medium">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {announcement.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Posted: {new Date(announcement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
