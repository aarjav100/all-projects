import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, Download, BarChart3, CalendarDays, AlertTriangle, Target, FileText, Printer, Filter, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useMemo } from 'react';

interface AttendanceRecord {
  id: number;
  courseCode: string;
  courseName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  instructor: string;
  notes: string;
  time: string;
  duration: string;
  location: string;
  semester: string;
}

const Attendance = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock attendance data with more details
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    {
      id: 1,
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      date: '2024-12-15',
      status: 'present',
      instructor: 'Dr. Smith',
      notes: '',
      time: '10:00 AM',
      duration: '75 minutes',
      location: 'Room 101',
      semester: 'Fall 2024'
    },
    {
      id: 2,
      courseCode: 'MATH201',
      courseName: 'Calculus I',
      date: '2024-12-15',
      status: 'present',
      instructor: 'Dr. Johnson',
      notes: '',
      time: '2:00 PM',
      duration: '90 minutes',
      location: 'Room 202',
      semester: 'Fall 2024'
    },
    {
      id: 3,
      courseCode: 'ENG101',
      courseName: 'English Composition',
      date: '2024-12-15',
      status: 'late',
      instructor: 'Dr. Williams',
      notes: 'Arrived 10 minutes late',
      time: '1:00 PM',
      duration: '75 minutes',
      location: 'Room 303',
      semester: 'Fall 2024'
    },
    {
      id: 4,
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      date: '2024-12-13',
      status: 'absent',
      instructor: 'Dr. Smith',
      notes: 'Medical appointment',
      time: '10:00 AM',
      duration: '75 minutes',
      location: 'Room 101',
      semester: 'Fall 2024'
    },
    {
      id: 5,
      courseCode: 'MATH201',
      courseName: 'Calculus I',
      date: '2024-12-13',
      status: 'present',
      instructor: 'Dr. Johnson',
      notes: '',
      time: '2:00 PM',
      duration: '90 minutes',
      location: 'Room 202',
      semester: 'Fall 2024'
    },
    {
      id: 6,
      courseCode: 'ENG101',
      courseName: 'English Composition',
      date: '2024-12-13',
      status: 'present',
      instructor: 'Dr. Williams',
      notes: '',
      time: '1:00 PM',
      duration: '75 minutes',
      location: 'Room 303',
      semester: 'Fall 2024'
    },
    {
      id: 7,
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      date: '2024-12-11',
      status: 'present',
      instructor: 'Dr. Smith',
      notes: '',
      time: '10:00 AM',
      duration: '75 minutes',
      location: 'Room 101',
      semester: 'Fall 2024'
    },
    {
      id: 8,
      courseCode: 'MATH201',
      courseName: 'Calculus I',
      date: '2024-12-11',
      status: 'late',
      instructor: 'Dr. Johnson',
      notes: 'Arrived 5 minutes late',
      time: '2:00 PM',
      duration: '90 minutes',
      location: 'Room 202',
      semester: 'Fall 2024'
    },
    {
      id: 9,
      courseCode: 'ENG101',
      courseName: 'English Composition',
      date: '2024-12-11',
      status: 'present',
      instructor: 'Dr. Williams',
      notes: '',
      time: '1:00 PM',
      duration: '75 minutes',
      location: 'Room 303',
      semester: 'Fall 2024'
    },
    {
      id: 10,
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      date: '2024-12-09',
      status: 'present',
      instructor: 'Dr. Smith',
      notes: '',
      time: '10:00 AM',
      duration: '75 minutes',
      location: 'Room 101',
      semester: 'Fall 2024'
    },
    {
      id: 11,
      courseCode: 'MATH201',
      courseName: 'Calculus I',
      date: '2024-12-09',
      status: 'absent',
      instructor: 'Dr. Johnson',
      notes: 'Family emergency',
      time: '2:00 PM',
      duration: '90 minutes',
      location: 'Room 202',
      semester: 'Fall 2024'
    },
    {
      id: 12,
      courseCode: 'ENG101',
      courseName: 'English Composition',
      date: '2024-12-09',
      status: 'present',
      instructor: 'Dr. Williams',
      notes: '',
      time: '1:00 PM',
      duration: '75 minutes',
      location: 'Room 303',
      semester: 'Fall 2024'
    }
  ]);

  // Filtered attendance based on course and month
  const filteredAttendance = useMemo(() => {
    let filtered = attendance;
    
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(record => record.courseCode === selectedCourse);
    }
    
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(record => {
        const recordMonth = new Date(record.date).getMonth();
        const selectedMonthNum = parseInt(selectedMonth);
        return recordMonth === selectedMonthNum;
      });
    }
    
    return filtered;
  }, [attendance, selectedCourse, selectedMonth]);

  // Available courses and months
  const courses = useMemo(() => {
    const uniqueCourses = [...new Set(attendance.map(record => record.courseCode))];
    return ['all', ...uniqueCourses];
  }, [attendance]);

  const months = useMemo(() => {
    const uniqueMonths = [...new Set(attendance.map(record => {
      const date = new Date(record.date);
      return date.getMonth();
    }))];
    return ['all', ...uniqueMonths.map(month => month.toString())];
  }, [attendance]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excused':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'excused':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 border-green-200';
      case 'absent':
        return 'bg-red-50 border-red-200';
      case 'late':
        return 'bg-yellow-50 border-yellow-200';
      case 'excused':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-green-700';
      case 'absent':
        return 'text-red-700';
      case 'late':
        return 'text-yellow-700';
      case 'excused':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'border-green-300';
      case 'absent':
        return 'border-red-300';
      case 'late':
        return 'border-yellow-300';
      case 'excused':
        return 'border-blue-300';
      default:
        return 'border-gray-300';
    }
  };

  // Calculate attendance statistics
  const totalSessions = filteredAttendance.length;
  const presentSessions = filteredAttendance.filter(a => a.status === 'present').length;
  const absentSessions = filteredAttendance.filter(a => a.status === 'absent').length;
  const lateSessions = filteredAttendance.filter(a => a.status === 'late').length;
  const attendanceRate = totalSessions > 0 ? ((presentSessions + lateSessions) / totalSessions * 100).toFixed(1) : '0';

  // Group by course
  const courseAttendance = useMemo(() => {
    return filteredAttendance.reduce((acc, record) => {
      if (!acc[record.courseCode]) {
        acc[record.courseCode] = {
          courseName: record.courseName,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          instructor: record.instructor
        };
      }
      acc[record.courseCode].total++;
      if (record.status === 'present') acc[record.courseCode].present++;
      else if (record.status === 'absent') acc[record.courseCode].absent++;
      else if (record.status === 'late') acc[record.courseCode].late++;
      return acc;
    }, {} as Record<string, { total: number; present: number; absent: number; late: number; courseName: string; instructor: string }>);
  }, [filteredAttendance]);

  // Weekly trends
  const weeklyTrends = useMemo(() => {
    const weeks: Record<string, { total: number; present: number; absent: number; late: number }> = {};
    filteredAttendance.forEach(record => {
      const date = new Date(record.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { total: 0, present: 0, absent: 0, late: 0 };
      }
      weeks[weekKey].total++;
      if (record.status === 'present') weeks[weekKey].present++;
      else if (record.status === 'absent') weeks[weekKey].absent++;
      else if (record.status === 'late') weeks[weekKey].late++;
    });
    
    return Object.entries(weeks).map(([week, data]) => ({
      week,
      ...data,
      rate: ((data.present + data.late) / data.total * 100).toFixed(1)
    })).sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }, [filteredAttendance]);

  const exportAttendance = () => {
    const csvContent = [
      ['Course Code', 'Course Name', 'Date', 'Time', 'Status', 'Instructor', 'Location', 'Notes'],
      ...filteredAttendance.map(record => [
        record.courseCode,
        record.courseName,
        record.date,
        record.time,
        record.status,
        record.instructor,
        record.location,
        record.notes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedCourse}-${selectedMonth}-${user?.firstName}-${user?.lastName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printAttendance = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #ccc; padding: 15px; text-align: center; }
            .attendance-row { border-bottom: 1px solid #eee; padding: 10px 0; }
            .status { font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ATTENDANCE REPORT</h1>
            <h2>${user?.firstName} ${user?.lastName}</h2>
            <p>Student ID: ${user?.studentId}</p>
            <p>Course: ${selectedCourse === 'all' ? 'All Courses' : selectedCourse}</p>
            <p>Period: ${selectedMonth === 'all' ? 'All Time' : new Date(2024, parseInt(selectedMonth)).toLocaleDateString('en-US', { month: 'long' })}</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <h3>Attendance Rate</h3>
              <p style="font-size: 24px; font-weight: bold;">${attendanceRate}%</p>
            </div>
            <div class="stat-card">
              <h3>Present</h3>
              <p style="font-size: 24px; font-weight: bold;">${presentSessions}</p>
            </div>
            <div class="stat-card">
              <h3>Absent</h3>
              <p style="font-size: 24px; font-weight: bold;">${absentSessions}</p>
            </div>
            <div class="stat-card">
              <h3>Late</h3>
              <p style="font-size: 24px; font-weight: bold;">${lateSessions}</p>
            </div>
          </div>
          
          <h3>Attendance Details</h3>
          ${filteredAttendance.map(record => `
            <div class="attendance-row">
              <strong>${record.courseCode} - ${record.courseName}</strong><br>
              ${record.date} | ${record.time} | Status: <span class="status">${record.status}</span> | Instructor: ${record.instructor}<br>
              Location: ${record.location}${record.notes ? ` | Notes: ${record.notes}` : ''}
            </div>
          `).join('')}
          
          <div class="footer">
            <p>This is an official attendance report from the University ERP System.</p>
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
          <div className="p-4 bg-gradient-to-br from-blue-500 to-green-600 rounded-full shadow-lg">
            <Calendar className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Attendance Record
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back, {user?.firstName}! Here's your attendance overview.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Course:</span>
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course} value={course}>
                  {course === 'all' ? 'All Courses' : course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Month:</span>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>
                  {month === 'all' ? 'All' : new Date(2024, parseInt(month)).toLocaleDateString('en-US', { month: 'short' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={exportAttendance}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={printAttendance}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{attendanceRate}%</p>
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{presentSessions}</p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{absentSessions}</p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{lateSessions}</p>
                    <p className="text-sm text-muted-foreground">Late</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course-wise Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Course-wise Attendance</CardTitle>
              <CardDescription>Your attendance breakdown by course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(courseAttendance).map(([courseCode, data]) => {
                  const courseRate = ((data.present + data.late) / data.total * 100).toFixed(1);
                  return (
                    <div key={courseCode} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold">{courseCode} - {data.courseName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Instructor: {data.instructor}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Present: {data.present} | Absent: {data.absent} | Late: {data.late}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{courseRate}%</p>
                        <Badge className={parseFloat(courseRate) >= 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {parseFloat(courseRate) >= 80 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Details</CardTitle>
              <CardDescription>Complete breakdown of your attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAttendance.map((record) => (
                  <div key={record.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${getStatusBackground(record.status)} ${getStatusBorderColor(record.status)}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{record.courseCode} - {record.courseName}</h3>
                        <Badge className={`${getStatusColor(record.status)} font-semibold`}>
                          {getStatusIcon(record.status)}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()} • {record.time} • {record.duration} • {record.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {record.instructor}
                      </p>
                      {record.notes && (
                        <p className={`text-sm mt-1 ${getStatusTextColor(record.status)}`}>
                          <span className="font-medium">Note:</span> {record.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${record.status === 'present' ? 'bg-green-500' : record.status === 'absent' ? 'bg-red-500' : record.status === 'late' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedRecord(record)}
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

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Trends</CardTitle>
                <CardDescription>Your attendance performance over weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyTrends.map((week) => (
                    <div key={week.week} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          Week of {new Date(week.week).toLocaleDateString()}
                        </span>
                        <Badge className={parseFloat(week.rate) >= 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {week.rate}%
                        </Badge>
                      </div>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>Present: {week.present}</span>
                        <span>Absent: {week.absent}</span>
                        <span>Late: {week.late}</span>
                      </div>
                      <Progress value={parseFloat(week.rate)} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Analysis of your attendance patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Target className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800">Attendance Goal</p>
                      <p className="text-sm text-green-600">Target: 85% • Current: {attendanceRate}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-800">Trend Analysis</p>
                      <p className="text-sm text-blue-600">
                        {parseFloat(attendanceRate) >= 85 ? 'Excellent attendance record!' : 'Consider improving attendance to meet academic requirements.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-yellow-800">Late Arrivals</p>
                      <p className="text-sm text-yellow-600">
                        {lateSessions} late arrivals. Consider arriving 5-10 minutes early.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>Visual representation of your attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Late</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Excused</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium text-sm p-2">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(2024, 11, 1 + i);
                    const dateStr = date.toISOString().split('T')[0];
                    const dayAttendance = filteredAttendance.filter(record => record.date === dateStr);
                    
                    return (
                      <div key={i} className="p-2 border rounded text-center text-sm min-h-[60px] flex flex-col justify-between">
                        <div className="font-medium">{date.getDate()}</div>
                        <div className="flex flex-col gap-1 mt-1">
                          {dayAttendance.map(record => (
                            <div 
                              key={record.id} 
                              className={`w-3 h-3 mx-auto rounded-full shadow-sm ${
                                record.status === 'present' ? 'bg-green-500' : 
                                record.status === 'absent' ? 'bg-red-500' : 
                                record.status === 'late' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}
                              title={`${record.courseCode} - ${record.status}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attendance Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Attendance Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this attendance record
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{selectedRecord.courseCode} - {selectedRecord.courseName}</h3>
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date:</span>
                    <p>{new Date(selectedRecord.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Time:</span>
                    <p>{selectedRecord.time}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p>{selectedRecord.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p>{selectedRecord.location}</p>
                  </div>
                  <div>
                    <span className="font-medium">Instructor:</span>
                    <p>{selectedRecord.instructor}</p>
                  </div>
                  <div>
                    <span className="font-medium">Semester:</span>
                    <p>{selectedRecord.semester}</p>
                  </div>
                </div>
                {selectedRecord.notes && (
                  <div className="mt-3">
                    <span className="font-medium text-sm">Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance; 