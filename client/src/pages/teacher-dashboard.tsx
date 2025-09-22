import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Bell, 
  BookOpen,
  Clock,
  TrendingUp,
  Plus
} from "lucide-react";
import { Link } from "wouter";

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  pendingSubmissions: number;
  unreadMessages: number;
}

interface RecentActivity {
  id: string;
  type: 'submission' | 'message' | 'enrollment';
  content: string;
  time: string;
  studentName?: string;
  className?: string;
}

interface UpcomingClass {
  id: string;
  name: string;
  time: string;
  students: number;
  room?: string;
}

export default function TeacherDashboard() {
  // Mock data for now - this will be replaced with real API calls
  const mockStats: DashboardStats = {
    totalClasses: 5,
    totalStudents: 147,
    pendingSubmissions: 23,
    unreadMessages: 8
  };

  const mockRecentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "submission",
      content: "Math Homework Assignment #3",
      time: "10 minutes ago",
      studentName: "Sarah Johnson",
      className: "Algebra I"
    },
    {
      id: "2", 
      type: "message",
      content: "New message in General Discussion",
      time: "25 minutes ago",
      className: "Biology 101"
    },
    {
      id: "3",
      type: "enrollment",
      content: "New student enrolled",
      time: "1 hour ago",
      studentName: "Mike Chen",
      className: "Chemistry"
    }
  ];

  const mockUpcomingClasses: UpcomingClass[] = [
    {
      id: "1",
      name: "Algebra I",
      time: "9:00 AM",
      students: 28,
      room: "Room 101"
    },
    {
      id: "2", 
      name: "Biology 101",
      time: "11:30 AM",
      students: 35,
      room: "Lab 203"
    },
    {
      id: "3",
      name: "Chemistry",
      time: "2:00 PM", 
      students: 22,
      room: "Lab 105"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your classes today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-classes">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-classes">
                {mockStats.totalClasses}
              </div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>

          <Card data-testid="card-total-students">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-students">
                {mockStats.totalStudents}
              </div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>

          <Card data-testid="card-pending-submissions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600" data-testid="text-pending-submissions">
                {mockStats.pendingSubmissions}
              </div>
              <p className="text-xs text-muted-foreground">Submissions to grade</p>
            </CardContent>
          </Card>

          <Card data-testid="card-unread-messages">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="text-unread-messages">
                {mockStats.unreadMessages}
              </div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2" data-testid="card-todays-schedule">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your upcoming classes for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingClasses.map((classItem) => (
                  <div 
                    key={classItem.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    data-testid={`class-schedule-${classItem.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">{classItem.time}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {classItem.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {classItem.students} students
                          </span>
                          {classItem.room && (
                            <span>{classItem.room}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-join-class-${classItem.id}`}>
                      Join Class
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link href="/teacher/classes">
                  <Button variant="ghost" className="w-full" data-testid="button-view-all-classes">
                    <Plus className="h-4 w-4 mr-2" />
                    View All Classes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card data-testid="card-recent-activity">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className="flex-shrink-0">
                      {activity.type === 'submission' && (
                        <FileText className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === 'message' && (
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.type === 'enrollment' && (
                        <Users className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.content}
                      </p>
                      {activity.studentName && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          by {activity.studentName}
                        </p>
                      )}
                      {activity.className && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {activity.className}
                        </Badge>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" className="w-full text-sm" data-testid="button-view-all-activity">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used teacher tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/teacher/classes/new">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2" data-testid="button-create-class">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm">Create Class</span>
                  </Button>
                </Link>
                
                <Link href="/teacher/assignments/new">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2" data-testid="button-create-assignment">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">New Assignment</span>
                  </Button>
                </Link>
                
                <Link href="/teacher/content">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2" data-testid="button-content-library">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm">Content Library</span>
                  </Button>
                </Link>
                
                <Link href="/teacher/analytics">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2" data-testid="button-analytics">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}