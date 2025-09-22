import { useQuery } from "@tanstack/react-query";
import { hasPermission, canAccessRoute, getRolePermissions, type Permission } from "@shared/permissions";

// Mock user data - in real app this would come from authentication context
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
}

// Mock current user
const mockCurrentUser: User = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.johnson@eduverse.edu",
  role: "standard_teacher", // Can be: new_teacher, standard_teacher, senior_teacher, department_head, substitute_teacher
  department: "Mathematics",
  isActive: true
};

// Hook to get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      // In a real app, this would fetch from an API endpoint
      // For now, return mock data
      return mockCurrentUser;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to check if user has specific permission
export function useHasPermission(resource: string, action: string) {
  const { data: user } = useCurrentUser();
  
  if (!user || !user.isActive) return false;
  
  return hasPermission(user.role, resource, action);
}

// Hook to check if user can access a route
export function useCanAccessRoute(route: string) {
  const { data: user } = useCurrentUser();
  
  if (!user || !user.isActive) return false;
  
  return canAccessRoute(user.role, route);
}

// Hook to get all permissions for current user's role
export function useUserPermissions() {
  const { data: user } = useCurrentUser();
  
  return useQuery({
    queryKey: ['user-permissions', user?.role],
    queryFn: async () => {
      if (!user) return [];
      return getRolePermissions(user.role);
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to check multiple permissions at once
export function useHasPermissions(permissions: { resource: string; action: string }[]) {
  const { data: user } = useCurrentUser();
  
  if (!user || !user.isActive) return {};
  
  const results: Record<string, boolean> = {};
  permissions.forEach(({ resource, action }) => {
    const key = `${resource}:${action}`;
    results[key] = hasPermission(user.role, resource, action);
  });
  
  return results;
}

// Helper function to check permission with fallback
export function checkPermission(userRole: string | undefined, resource: string, action: string): boolean {
  if (!userRole) return false;
  return hasPermission(userRole, resource, action);
}

// Hook to get permissions grouped by resource
export function useGroupedPermissions() {
  const { data: permissions = [] } = useUserPermissions();
  
  const grouped = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
  
  return grouped;
}