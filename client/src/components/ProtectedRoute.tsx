import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import type { UserRole } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = "/",
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // TEMPORARY COMMENT OUT REDIRECT LOGIC FOR TESTING PURPOSES
    /*
    if (requireAuth && !isAuthenticated) {
      setLocation("/");
      return;
    }

    if (isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
      const roleDashboards: Record<UserRole, string> = {
        'student': '/student',
        'teacher': '/teacher',
        'admin': '/admin',
        'parent': '/parent'
      };
      
      const userDashboard = roleDashboards[user.role as UserRole];
      if (userDashboard && userDashboard !== window.location.pathname) {
        setLocation(userDashboard);
        return;
      }
    }
    */
  }, [isAuthenticated, user, allowedRoles, setLocation, requireAuth]);

  // Show loading state while checking authentication
  if (requireAuth && isAuthenticated === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // Component will unmount due to redirect
  }

  // Show access denied if user doesn't have required role
  if (isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have permission to access this page. You'll be redirected to your dashboard.
            </p>
            <Button 
              onClick={() => {
                const roleDashboards: Record<UserRole, string> = {
                  'student': '/student',
                  'teacher': '/teacher', 
                  'admin': '/admin',
                  'parent': '/parent'
                };
                setLocation(roleDashboards[user.role as UserRole] || '/');
              }}
              className="w-full"
            >
              Go to My Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Component for pages that should only be accessible to non-authenticated users
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // TEMPORARILY COMMENT OUT FOR TESTING
    /*
    if (isAuthenticated && user) {
      const roleDashboards: Record<UserRole, string> = {
        'student': '/student',
        'teacher': '/teacher',
        'admin': '/admin', 
        'parent': '/parent'
      };
      
      setLocation(roleDashboards[user.role as UserRole] || '/home');
    }
    */
  }, [isAuthenticated, user, setLocation]);

  if (isAuthenticated && user) {
    return null; // Component will unmount due to redirect
  }

  return <>{children}</>;
}

// Role-based route helper components
export function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      {children}
    </ProtectedRoute>
  );
}

export function TeacherRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function ParentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['parent']}>
      {children}
    </ProtectedRoute>
  );
}

// Multi-role route for pages accessible by multiple roles
export function MultiRoleRoute({ 
  children, 
  roles 
}: { 
  children: React.ReactNode;
  roles: UserRole[];
}) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      {children}
    </ProtectedRoute>
  );
}