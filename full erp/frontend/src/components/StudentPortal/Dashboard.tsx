import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useEnrollments, useGrades, useAssignments, useAnnouncements } from "@/hooks/useProfile";
import { useMemo } from "react";
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  User, 
  Bell,
  GraduationCap,
  FileText,
  Clock,
  Award,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// =====================
// Enhanced Student ERP Dashboard Structure (for future modularity)
//
// Sidebar Navigation:
//   - My Courses
//   - Attendance
//   - Grades
//   - Messages
//   - Pay Fees
//
// Quick Actions (Card):
//   - View Courses: Go to your enrolled courses
//   - Attendance: Check your attendance overview
//   - Grades: View your grade report
//   - Messages: Read college messages
//   - Pay Fees: Pay tuition securely
// =====================

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useEnrollments();
  const { data: grades, isLoading: gradesLoading, error: gradesError } = useGrades();
  const { data: assignments, isLoading: assignmentsLoading, error: assignmentsError } = useAssignments();
  const { data: announcements, isLoading: announcementsLoading, error: announcementsError } = useAnnouncements();

  const navigate = useNavigate();

  // Memoized statistics
  const enrolledCourses = useMemo(() => enrollments?.length || 0, [enrollments]);
  const pendingAssignments = useMemo(() => assignments?.filter(a => new Date(a.due_date || '') > new Date()).length || 0, [assignments]);
  const gradeAverage = useMemo(() => grades?.length ? grades.reduce((sum, grade) => sum + (grade.score || 0), 0) / grades.length : 0, [grades]);
  const totalCredits = useMemo(() => enrollments?.reduce((sum, enrollment) => sum + (enrollment.courses?.credits || 0), 0) || 0, [enrollments]);

  // Loading and error states
  if (profileLoading || enrollmentsLoading || gradesLoading || assignmentsLoading || announcementsLoading) {
    return <div className="flex items-center justify-center min-h-screen"><span>Loading dashboard...</span></div>;
  }
  if (profileError || enrollmentsError || gradesError || assignmentsError || announcementsError) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">
      <span>Error loading dashboard: {profileError?.message || enrollmentsError?.message || gradesError?.message || assignmentsError?.message || announcementsError?.message}</span>
    </div>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md shadow-cool">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Student Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.first_name || user?.email}
              </span>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.first_name || 'Student'}!
          </h2>
          <p className="text-muted-foreground">Here's what's happening with your academic journey today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-cool text-primary-foreground shadow-cool">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-foreground">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary-foreground/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-foreground">{enrolledCourses}</div>
              <p className="text-xs text-primary-foreground/80">This semester</p>
            </CardContent>
          </Card>

          <Card className="gradient-warm text-secondary-foreground shadow-warm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-secondary-foreground">Current GPA</CardTitle>
              <Award className="h-4 w-4 text-secondary-foreground/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-foreground">{gradeAverage.toFixed(1)}%</div>
              <p className="text-xs text-secondary-foreground/80">Overall grade average</p>
            </CardContent>
          </Card>

          <Card className="bg-accent/20 border-accent shadow-warm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <FileText className="h-4 w-4 text-accent-foreground/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssignments}</div>
              <p className="text-xs text-muted-foreground">Due this week</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border-primary shadow-cool">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Credits Earned</CardTitle>
              <Clock className="h-4 w-4 text-primary/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalCredits}</div>
              <p className="text-xs text-primary/80">This semester</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card className="shadow-cool">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Today's Schedule</span>
                </CardTitle>
                <CardDescription>Your classes and events for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrollments && enrollments.length > 0 ? enrollments.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div>
                        <h4 className="font-semibold">{enrollment.courses?.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.courses?.room} - {enrollment.courses?.instructor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{enrollment.courses?.schedule}</p>
                        <Badge variant={enrollment.status === 'enrolled' ? 'default' : 'outline'}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-4">No courses scheduled today</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest academic updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments && assignments.length > 0 ? assignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-cool">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-3" variant="outline" onClick={() => navigate("/courses")}> 
                  <BookOpen className="h-5 w-5 mr-1 text-blue-600" />
                  <span className="flex flex-col items-start">
                    <span className="font-semibold">View Courses</span>
                    <span className="text-xs text-muted-foreground">Go to your enrolled courses</span>
                  </span>
                </Button>
                <Button className="w-full justify-start gap-3" variant="outline" onClick={() => navigate("/attendance")}> 
                  <Calendar className="h-5 w-5 mr-1 text-green-600" />
                  <span className="flex flex-col items-start">
                    <span className="font-semibold">Attendance</span>
                    <span className="text-xs text-muted-foreground">Check your attendance overview</span>
                  </span>
                </Button>
                <Button className="w-full justify-start gap-3" variant="outline" onClick={() => navigate("/grades")}> 
                  <FileText className="h-5 w-5 mr-1 text-yellow-600" />
                  <span className="flex flex-col items-start">
                    <span className="font-semibold">Check Grades</span>
                    <span className="text-xs text-muted-foreground">View your grade report</span>
                  </span>
                </Button>
                <Button className="w-full justify-start gap-3" variant="outline" onClick={() => navigate("/messages")}> 
                  <MessageSquare className="h-5 w-5 mr-1 text-purple-600" />
                  <span className="flex flex-col items-start">
                    <span className="font-semibold">Messages</span>
                    <span className="text-xs text-muted-foreground">Read college messages</span>
                  </span>
                </Button>
                <Button className="w-full justify-start gap-3" variant="outline" onClick={() => navigate("/tuition")}> 
                  <CreditCard className="h-5 w-5 mr-1 text-pink-600" />
                  <span className="flex flex-col items-start">
                    <span className="font-semibold">Pay Fees</span>
                    <span className="text-xs text-muted-foreground">Pay tuition securely</span>
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements && announcements.length > 0 ? announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-4">No announcements</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="shadow-cool">
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tuition Balance</span>
                    <span className="text-sm font-medium">$2,450.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Financial Aid</span>
                    <span className="text-sm font-medium text-green-600">$15,000.00</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Due</span>
                    <span className="text-sm font-bold">$2,450.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}