// Teacher-specific permissions and role-based access control

export interface Permission {
  resource: string;
  action: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
}

// Define available permissions for teachers
export const TEACHER_PERMISSIONS: Permission[] = [
  // Class Management
  { resource: 'classes', action: 'create', description: 'Create new classes' },
  { resource: 'classes', action: 'read', description: 'View class information' },
  { resource: 'classes', action: 'update', description: 'Edit class details' },
  { resource: 'classes', action: 'delete', description: 'Delete classes' },
  { resource: 'classes', action: 'manage_students', description: 'Add/remove students from classes' },
  
  // Student Management
  { resource: 'students', action: 'read', description: 'View student profiles and information' },
  { resource: 'students', action: 'update', description: 'Edit student information' },
  { resource: 'students', action: 'view_grades', description: 'View student grades' },
  { resource: 'students', action: 'edit_grades', description: 'Modify student grades' },
  { resource: 'students', action: 'send_messages', description: 'Send messages to students' },
  { resource: 'students', action: 'view_attendance', description: 'View student attendance' },
  { resource: 'students', action: 'mark_attendance', description: 'Mark student attendance' },
  
  // Assessment Management
  { resource: 'assessments', action: 'create', description: 'Create assignments and quizzes' },
  { resource: 'assessments', action: 'read', description: 'View assessments' },
  { resource: 'assessments', action: 'update', description: 'Edit assessments' },
  { resource: 'assessments', action: 'delete', description: 'Delete assessments' },
  { resource: 'assessments', action: 'grade', description: 'Grade student submissions' },
  { resource: 'assessments', action: 'publish', description: 'Publish assessment results' },
  
  // Content Library
  { resource: 'content', action: 'create', description: 'Upload and create content' },
  { resource: 'content', action: 'read', description: 'Access content library' },
  { resource: 'content', action: 'update', description: 'Edit content materials' },
  { resource: 'content', action: 'delete', description: 'Delete content materials' },
  { resource: 'content', action: 'share', description: 'Share content with others' },
  { resource: 'content', action: 'bookmark', description: 'Bookmark content' },
  
  // Analytics and Reporting
  { resource: 'analytics', action: 'view_class_performance', description: 'View class performance analytics' },
  { resource: 'analytics', action: 'view_student_progress', description: 'View individual student progress' },
  { resource: 'analytics', action: 'export_reports', description: 'Export analytics reports' },
  { resource: 'analytics', action: 'view_engagement', description: 'View student engagement metrics' },
  
  // Communication
  { resource: 'communication', action: 'create_announcements', description: 'Create class announcements' },
  { resource: 'communication', action: 'send_messages', description: 'Send direct messages' },
  { resource: 'communication', action: 'manage_forums', description: 'Participate in teacher forums' },
  { resource: 'communication', action: 'create_support_tickets', description: 'Create support tickets' },
  { resource: 'communication', action: 'manage_group_chats', description: 'Manage class group chats' },
  
  // Profile and Settings
  { resource: 'profile', action: 'read', description: 'View own profile' },
  { resource: 'profile', action: 'update', description: 'Edit own profile' },
  { resource: 'profile', action: 'change_password', description: 'Change password' },
  { resource: 'profile', action: 'manage_notifications', description: 'Manage notification settings' },
  { resource: 'profile', action: 'export_data', description: 'Export personal data' },
  
  // Administrative (for senior teachers/department heads)
  { resource: 'admin', action: 'view_all_classes', description: 'View all classes in department' },
  { resource: 'admin', action: 'manage_teachers', description: 'Manage other teachers' },
  { resource: 'admin', action: 'view_department_analytics', description: 'View department-wide analytics' },
  { resource: 'admin', action: 'approve_content', description: 'Approve shared content' },
];

// Define teacher roles with different permission levels
export const TEACHER_ROLES: Role[] = [
  {
    id: 'new_teacher',
    name: 'New Teacher',
    description: 'Basic permissions for newly hired teachers',
    isActive: true,
    permissions: [
      // Basic class access
      { resource: 'classes', action: 'read', description: 'View assigned classes' },
      { resource: 'students', action: 'read', description: 'View student profiles' },
      { resource: 'students', action: 'view_grades', description: 'View student grades' },
      { resource: 'students', action: 'view_attendance', description: 'View student attendance' },
      
      // Basic content access
      { resource: 'content', action: 'read', description: 'Access shared content' },
      { resource: 'content', action: 'bookmark', description: 'Bookmark content' },
      
      // Basic communication
      { resource: 'communication', action: 'send_messages', description: 'Send messages to students' },
      { resource: 'communication', action: 'create_support_tickets', description: 'Create support tickets' },
      
      // Profile management
      { resource: 'profile', action: 'read', description: 'View own profile' },
      { resource: 'profile', action: 'update', description: 'Edit own profile' },
      { resource: 'profile', action: 'change_password', description: 'Change password' },
      { resource: 'profile', action: 'manage_notifications', description: 'Manage notifications' },
    ]
  },
  {
    id: 'standard_teacher',
    name: 'Teacher',
    description: 'Standard permissions for regular teachers',
    isActive: true,
    permissions: [
      // Full class management
      { resource: 'classes', action: 'create', description: 'Create new classes' },
      { resource: 'classes', action: 'read', description: 'View class information' },
      { resource: 'classes', action: 'update', description: 'Edit class details' },
      { resource: 'classes', action: 'manage_students', description: 'Manage class enrollment' },
      
      // Student management
      { resource: 'students', action: 'read', description: 'View student profiles' },
      { resource: 'students', action: 'update', description: 'Edit student information' },
      { resource: 'students', action: 'view_grades', description: 'View student grades' },
      { resource: 'students', action: 'edit_grades', description: 'Modify student grades' },
      { resource: 'students', action: 'send_messages', description: 'Send messages to students' },
      { resource: 'students', action: 'view_attendance', description: 'View student attendance' },
      { resource: 'students', action: 'mark_attendance', description: 'Mark student attendance' },
      
      // Assessment management
      { resource: 'assessments', action: 'create', description: 'Create assessments' },
      { resource: 'assessments', action: 'read', description: 'View assessments' },
      { resource: 'assessments', action: 'update', description: 'Edit assessments' },
      { resource: 'assessments', action: 'delete', description: 'Delete assessments' },
      { resource: 'assessments', action: 'grade', description: 'Grade submissions' },
      { resource: 'assessments', action: 'publish', description: 'Publish results' },
      
      // Content management
      { resource: 'content', action: 'create', description: 'Create content' },
      { resource: 'content', action: 'read', description: 'Access content library' },
      { resource: 'content', action: 'update', description: 'Edit own content' },
      { resource: 'content', action: 'delete', description: 'Delete own content' },
      { resource: 'content', action: 'share', description: 'Share content' },
      { resource: 'content', action: 'bookmark', description: 'Bookmark content' },
      
      // Analytics
      { resource: 'analytics', action: 'view_class_performance', description: 'View class analytics' },
      { resource: 'analytics', action: 'view_student_progress', description: 'View student progress' },
      { resource: 'analytics', action: 'export_reports', description: 'Export reports' },
      { resource: 'analytics', action: 'view_engagement', description: 'View engagement metrics' },
      
      // Communication
      { resource: 'communication', action: 'create_announcements', description: 'Create announcements' },
      { resource: 'communication', action: 'send_messages', description: 'Send messages' },
      { resource: 'communication', action: 'manage_forums', description: 'Participate in forums' },
      { resource: 'communication', action: 'create_support_tickets', description: 'Create support tickets' },
      { resource: 'communication', action: 'manage_group_chats', description: 'Manage group chats' },
      
      // Profile
      { resource: 'profile', action: 'read', description: 'View own profile' },
      { resource: 'profile', action: 'update', description: 'Edit own profile' },
      { resource: 'profile', action: 'change_password', description: 'Change password' },
      { resource: 'profile', action: 'manage_notifications', description: 'Manage notifications' },
      { resource: 'profile', action: 'export_data', description: 'Export data' },
    ]
  },
  {
    id: 'senior_teacher',
    name: 'Senior Teacher',
    description: 'Enhanced permissions for experienced teachers',
    isActive: true,
    permissions: [
      // Full class management
      { resource: 'classes', action: 'create', description: 'Create new classes' },
      { resource: 'classes', action: 'read', description: 'View class information' },
      { resource: 'classes', action: 'update', description: 'Edit class details' },
      { resource: 'classes', action: 'delete', description: 'Delete classes' },
      { resource: 'classes', action: 'manage_students', description: 'Manage class enrollment' },
      
      // Student management
      { resource: 'students', action: 'read', description: 'View student profiles' },
      { resource: 'students', action: 'update', description: 'Edit student information' },
      { resource: 'students', action: 'view_grades', description: 'View student grades' },
      { resource: 'students', action: 'edit_grades', description: 'Modify student grades' },
      { resource: 'students', action: 'send_messages', description: 'Send messages to students' },
      { resource: 'students', action: 'view_attendance', description: 'View student attendance' },
      { resource: 'students', action: 'mark_attendance', description: 'Mark student attendance' },
      
      // Assessment management
      { resource: 'assessments', action: 'create', description: 'Create assessments' },
      { resource: 'assessments', action: 'read', description: 'View assessments' },
      { resource: 'assessments', action: 'update', description: 'Edit assessments' },
      { resource: 'assessments', action: 'delete', description: 'Delete assessments' },
      { resource: 'assessments', action: 'grade', description: 'Grade submissions' },
      { resource: 'assessments', action: 'publish', description: 'Publish results' },
      
      // Content management
      { resource: 'content', action: 'create', description: 'Create content' },
      { resource: 'content', action: 'read', description: 'Access content library' },
      { resource: 'content', action: 'update', description: 'Edit own content' },
      { resource: 'content', action: 'delete', description: 'Delete own content' },
      { resource: 'content', action: 'share', description: 'Share content' },
      { resource: 'content', action: 'bookmark', description: 'Bookmark content' },
      
      // Analytics
      { resource: 'analytics', action: 'view_class_performance', description: 'View class analytics' },
      { resource: 'analytics', action: 'view_student_progress', description: 'View student progress' },
      { resource: 'analytics', action: 'export_reports', description: 'Export reports' },
      { resource: 'analytics', action: 'view_engagement', description: 'View engagement metrics' },
      
      // Communication
      { resource: 'communication', action: 'create_announcements', description: 'Create announcements' },
      { resource: 'communication', action: 'send_messages', description: 'Send messages' },
      { resource: 'communication', action: 'manage_forums', description: 'Participate in forums' },
      { resource: 'communication', action: 'create_support_tickets', description: 'Create support tickets' },
      { resource: 'communication', action: 'manage_group_chats', description: 'Manage group chats' },
      
      // Profile
      { resource: 'profile', action: 'read', description: 'View own profile' },
      { resource: 'profile', action: 'update', description: 'Edit own profile' },
      { resource: 'profile', action: 'change_password', description: 'Change password' },
      { resource: 'profile', action: 'manage_notifications', description: 'Manage notifications' },
      { resource: 'profile', action: 'export_data', description: 'Export data' },
      
      // Additional administrative permissions
      { resource: 'admin', action: 'view_all_classes', description: 'View all department classes' },
      { resource: 'admin', action: 'view_department_analytics', description: 'View department analytics' },
      { resource: 'admin', action: 'approve_content', description: 'Approve shared content' },
    ]
  },
  {
    id: 'department_head',
    name: 'Department Head',
    description: 'Full administrative permissions for department heads',
    isActive: true,
    permissions: [
      // All permissions
      ...TEACHER_PERMISSIONS,
    ]
  },
  {
    id: 'substitute_teacher',
    name: 'Substitute Teacher',
    description: 'Limited permissions for substitute teachers',
    isActive: true,
    permissions: [
      // Limited access
      { resource: 'classes', action: 'read', description: 'View assigned classes' },
      { resource: 'students', action: 'read', description: 'View student profiles' },
      { resource: 'students', action: 'view_attendance', description: 'View attendance' },
      { resource: 'students', action: 'mark_attendance', description: 'Mark attendance' },
      { resource: 'students', action: 'send_messages', description: 'Send basic messages' },
      
      // Basic content access
      { resource: 'content', action: 'read', description: 'Access shared lesson plans' },
      
      // Basic communication
      { resource: 'communication', action: 'send_messages', description: 'Send messages' },
      { resource: 'communication', action: 'create_support_tickets', description: 'Create support tickets' },
      
      // Basic profile
      { resource: 'profile', action: 'read', description: 'View own profile' },
      { resource: 'profile', action: 'update', description: 'Edit basic profile info' },
    ]
  }
];

// Helper functions for permission checking
export function hasPermission(userRole: string, resource: string, action: string): boolean {
  const role = TEACHER_ROLES.find(r => r.id === userRole);
  if (!role || !role.isActive) return false;
  
  return role.permissions.some(p => p.resource === resource && p.action === action);
}

export function getRolePermissions(roleId: string): Permission[] {
  const role = TEACHER_ROLES.find(r => r.id === roleId);
  return role?.permissions || [];
}

export function getAllPermissionsForResource(resource: string): Permission[] {
  return TEACHER_PERMISSIONS.filter(p => p.resource === resource);
}

export function canAccessRoute(userRole: string, route: string): boolean {
  const routePermissions: Record<string, { resource: string; action: string }> = {
    '/teacher': { resource: 'profile', action: 'read' },
    '/teacher/classes': { resource: 'classes', action: 'read' },
    '/teacher/students': { resource: 'students', action: 'read' },
    '/teacher/assessments': { resource: 'assessments', action: 'read' },
    '/teacher/content': { resource: 'content', action: 'read' },
    '/teacher/analytics': { resource: 'analytics', action: 'view_class_performance' },
    '/teacher/communication': { resource: 'communication', action: 'send_messages' },
    '/teacher/profile': { resource: 'profile', action: 'read' },
  };

  const requiredPermission = routePermissions[route];
  if (!requiredPermission) return false;

  return hasPermission(userRole, requiredPermission.resource, requiredPermission.action);
}

// Default role assignments
export const DEFAULT_TEACHER_ROLE = 'standard_teacher';
export const NEW_TEACHER_ROLE = 'new_teacher';

// Permission groups for UI organization
export const PERMISSION_GROUPS = {
  'Class Management': ['classes'],
  'Student Management': ['students'],
  'Assessment Management': ['assessments'],
  'Content Library': ['content'],
  'Analytics & Reporting': ['analytics'],
  'Communication': ['communication'],
  'Profile & Settings': ['profile'],
  'Administrative': ['admin']
} as const;