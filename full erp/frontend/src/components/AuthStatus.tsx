import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';

interface AuthStatusProps {
  showSignOut?: boolean;
  className?: string;
}

const AuthStatus = ({ showSignOut = false, className = '' }: AuthStatusProps) => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="outline" className="flex items-center gap-1">
          <LogIn className="h-3 w-3" />
          Not Signed In
        </Badge>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge className="flex items-center gap-1">
        <User className="h-3 w-3" />
        {user.firstName} {user.lastName}
      </Badge>
      {user.role && (
        <Badge variant="secondary">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      )}
      {showSignOut && (
        <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-1">
          <LogOut className="h-3 w-3" />
          Sign Out
        </Button>
      )}
    </div>
  );
};

export default AuthStatus; 