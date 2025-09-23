import { useState } from "react";
import { 
  TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, 
  Star, Trophy, Target, Calendar, MessageCircle, Bell, 
  BookOpen, FileText, Users, BarChart3, Plus, ArrowRight,
  Play, Pause, MoreHorizontal, Award, Zap, Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
  onClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue', 
  subtitle,
  onClick 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 animate-fade-in ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
      data-testid={`stats-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  vs last week
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Progress Widget Component
interface ProgressWidgetProps {
  title: string;
  current: number;
  total: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
  subtitle?: string;
  icon?: React.ElementType;
}

export function ProgressWidget({ 
  title, 
  current, 
  total, 
  color = 'blue', 
  showPercentage = true,
  subtitle,
  icon: Icon
}: ProgressWidgetProps) {
  const percentage = Math.round((current / total) * 100);
  
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400', 
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400'
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className={`h-5 w-5 ${colorClasses[color]}`} />}
            <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          </div>
          {showPercentage && (
            <span className={`text-sm font-medium ${colorClasses[color]}`}>
              {percentage}%
            </span>
          )}
        </div>
        
        <Progress 
          value={percentage} 
          className="h-2 mb-2"
          data-testid={`progress-${title.toLowerCase().replace(/\s+/g, '-')}`}
        />
        
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>{current} of {total}</span>
          {subtitle && <span>{subtitle}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Action Card Component
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  onClick: () => void;
  badge?: string;
}

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  color = 'blue', 
  onClick,
  badge 
}: QuickActionProps) {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20',
    green: 'border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-900/20',
    purple: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/20',
    orange: 'border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:border-orange-700 dark:hover:bg-orange-900/20',
    red: 'border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-900/20'
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400'
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounce-in ${colorClasses[color]}`}
      onClick={onClick}
      data-testid={`quick-action-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6 text-center">
        <div className="relative mb-4">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
            <Icon className={`h-6 w-6 ${iconColorClasses[color]}`} />
          </div>
          {badge && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
              {badge}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        <ArrowRight className="h-4 w-4 mx-auto mt-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </CardContent>
    </Card>
  );
}

// Achievement Badge Component
interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  earnedDate?: string;
  color?: 'gold' | 'silver' | 'bronze' | 'blue' | 'green';
}

export function AchievementBadge({ 
  title, 
  description, 
  icon: Icon, 
  earned, 
  earnedDate,
  color = 'gold' 
}: AchievementBadgeProps) {
  const colorClasses = {
    gold: earned ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400' : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700',
    silver: earned ? 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700',
    bronze: earned ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700',
    blue: earned ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700',
    green: earned ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
  };

  return (
    <div 
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300 
        ${colorClasses[color]} 
        ${earned ? 'animate-pulse-glow hover:scale-105' : 'opacity-60'}
      `}
      data-testid={`achievement-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {earned && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-green-500 text-white rounded-full p-1">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
      )}
      
      <div className="text-center">
        <div className="mb-3">
          <Icon className={`h-8 w-8 mx-auto ${earned ? '' : 'opacity-50'}`} />
        </div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs opacity-80">{description}</p>
        {earned && earnedDate && (
          <p className="text-xs mt-2 opacity-60">Earned {earnedDate}</p>
        )}
      </div>
    </div>
  );
}

// Activity Feed Widget
interface ActivityItem {
  id: string;
  type: 'assignment' | 'grade' | 'message' | 'announcement' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 5 }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'assignment': return FileText;
      case 'grade': return BarChart3;
      case 'message': return MessageCircle;
      case 'announcement': return Bell;
      case 'achievement': return Trophy;
      default: return Bell;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'assignment': return 'text-blue-600 dark:text-blue-400';
      case 'grade': return 'text-green-600 dark:text-green-400';
      case 'message': return 'text-purple-600 dark:text-purple-400';
      case 'announcement': return 'text-orange-600 dark:text-orange-400';
      case 'achievement': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayedActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div 
                key={activity.id} 
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`activity-${activity.id}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${getActivityColor(activity.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      {activity.user && (
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                          <AvatarFallback className="text-xs">
                            {activity.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {activities.length > maxItems && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" className="w-full text-sm" data-testid="view-all-activities">
              View all activities
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Schedule Widget Component
interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: 'class' | 'assignment' | 'meeting' | 'event';
  location?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

interface ScheduleWidgetProps {
  title: string;
  items: ScheduleItem[];
  date?: string;
}

export function ScheduleWidget({ title, items, date }: ScheduleWidgetProps) {
  const getTypeIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'class': return BookOpen;
      case 'assignment': return FileText;
      case 'meeting': return Users;
      case 'event': return Calendar;
      default: return Calendar;
    }
  };

  const colorClasses = {
    blue: 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400',
    green: 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400',
    purple: 'bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
    orange: 'bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400',
    red: 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{title}</span>
          </div>
          {date && (
            <span className="text-sm text-gray-600 dark:text-gray-400">{date}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No scheduled items today</p>
          </div>
        ) : (
          items.map((item, index) => {
            const Icon = getTypeIcon(item.type);
            return (
              <div 
                key={item.id}
                className={`
                  p-3 rounded-lg border-l-4 hover:shadow-sm transition-all duration-200 animate-slide-up
                  ${colorClasses[item.color || 'blue']}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`schedule-item-${item.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      {item.location && (
                        <p className="text-xs opacity-75">{item.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.time}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

// Performance Overview Widget
interface PerformanceData {
  subject: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

interface PerformanceOverviewProps {
  title: string;
  data: PerformanceData[];
  overallGPA?: number;
}

export function PerformanceOverview({ title, data, overallGPA }: PerformanceOverviewProps) {
  const getTrendIcon = (trend: PerformanceData['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <MoreHorizontal className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>{title}</span>
          </div>
          {overallGPA && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              GPA: {overallGPA.toFixed(2)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div 
            key={item.subject}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
            data-testid={`performance-${item.subject.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.subject}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">{item.score}%</span>
                {getTrendIcon(item.trend)}
              </div>
            </div>
            <Progress 
              value={item.score} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Quick Actions Panel
interface QuickActionsProps {
  actions: QuickActionProps[];
  title?: string;
}

export function QuickActionsPanel({ actions, title = "Quick Actions" }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <QuickActionCard 
              key={action.title}
              {...action}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}