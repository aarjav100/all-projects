import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, Mail, Shield, Calendar, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400';
      case 'teacher':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400';
      case 'student':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'teacher':
        return <GraduationCap className="h-3 w-3" />;
      case 'student':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-all duration-200 group">
          <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-0" align="end" forceMount>
        {/* User Info Header */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Mail className="h-3 w-3 text-gray-400" />
                <p className="text-xs text-gray-600 truncate">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={`${getRoleColor(user.role)} text-xs px-2 py-1 flex items-center space-x-1`}>
                  {getRoleIcon(user.role)}
                  <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                </Badge>
                {user.studentId && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    ID: {user.studentId}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional User Info */}
          <div className="mt-3 space-y-2">
            {user.program && (
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <GraduationCap className="h-3 w-3" />
                <span>{user.program}</span>
              </div>
            )}
            {user.yearLevel && (
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>Year {user.yearLevel}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <User className="h-3 w-3" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <DropdownMenuItem 
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">View Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem 
            onClick={signOut}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile; 