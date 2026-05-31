import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, BookOpen, Award, MessageSquare, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
    {
      title: 'My Courses',
      description: 'View enrolled courses',
      icon: <BookOpen className="h-6 w-6" />,
      path: '/courses',
      color: 'bg-blue-500'
    },
    {
      title: 'Attendance',
      description: 'Check attendance records',
      icon: <Calendar className="h-6 w-6" />,
      path: '/attendance',
      color: 'bg-green-500'
    },
    {
      title: 'Grades',
      description: 'View academic performance',
      icon: <Award className="h-6 w-6" />,
      path: '/grades',
      color: 'bg-purple-500'
    },
    {
      title: 'Messages',
      description: 'Check communications',
      icon: <MessageSquare className="h-6 w-6" />,
      path: '/messages',
      color: 'bg-orange-500'
    },
    {
      title: 'Pay Fees',
      description: 'Manage payments',
      icon: <CreditCard className="h-6 w-6" />,
      path: '/tuition',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Welcome Section */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your Student ERP Portal
        </p>
        <div className="flex justify-center gap-3">
          <Badge className={`${getRoleColor(user?.role || '')} px-4 py-2 text-sm font-medium`}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </Badge>
          {user?.studentId && (
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
              ID: {user.studentId}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Info Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Profile Information
              </CardTitle>
              <CardDescription>Your current account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                {user?.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-lg">{user.phone}</p>
                  </div>
                )}
                {user?.program && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Program</label>
                    <p className="text-lg">{user.program}</p>
                  </div>
                )}
                {user?.yearLevel && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year Level</label>
                    <p className="text-lg">Year {user.yearLevel}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-lg capitalize">{user?.status || 'Active'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Quick Actions
              </CardTitle>
              <CardDescription>Access your most important features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-muted-foreground/20" 
                    onClick={() => navigate(action.path)}
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Enrolled Courses</p>
                    <p className="text-2xl font-bold text-blue-900">3</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-green-900">95%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">GPA</p>
                    <p className="text-2xl font-bold text-purple-900">3.8</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest academic activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-green-900">Successfully logged in</p>
                    <p className="text-sm text-green-700">Just now</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-blue-900">Portal accessed</p>
                    <p className="text-sm text-blue-700">Welcome to your dashboard</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-purple-900">Course registration completed</p>
                    <p className="text-sm text-purple-700">Fall 2024 semester</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
