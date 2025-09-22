import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Users, Plus, Settings, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Group, User } from '@shared/schema';

interface GroupSidebarProps {
  user: User | null;
  selectedGroup: Group | null;
  onGroupSelect: (group: Group) => void;
  onlineUsers: string[];
  onLogout: () => void;
}

export function GroupSidebar({ user, selectedGroup, onGroupSelect, onlineUsers, onLogout }: GroupSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { getAuthHeaders } = useAuth();

  // Fetch user's groups
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['user-groups', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`/api/users/${user.id}/groups`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch groups');
      return response.json();
    },
    enabled: !!user
  });

  const filteredGroups = groups.filter((group: Group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'class': return '🏫';
      case 'project': return '📋';
      case 'announcement': return '📢';
      default: return '💬';
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'project': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Groups</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarFallback className="bg-eduverse-blue text-white">
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
              <Badge variant={user.role === 'teacher' || user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                {user.role === 'teacher' ? '👩‍🏫 Teacher' : user.role === 'admin' ? '👨‍💼 Admin' : '👨‍🎓 Student'}
              </Badge>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-groups"
          />
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Loading groups...
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No groups found' : 'No groups available'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredGroups.map((group: Group) => (
              <button
                key={group.id}
                onClick={() => onGroupSelect(group)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedGroup?.id === group.id
                    ? 'bg-eduverse-blue text-white'
                    : 'hover:bg-gray-100'
                }`}
                data-testid={`group-item-${group.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getGroupIcon(group.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium truncate ${
                        selectedGroup?.id === group.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {group.name}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          selectedGroup?.id === group.id 
                            ? 'bg-white/20 text-white' 
                            : getGroupTypeColor(group.type)
                        }`}
                      >
                        {group.type}
                      </Badge>
                    </div>
                    {group.description && (
                      <p className={`text-sm truncate ${
                        selectedGroup?.id === group.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {group.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">12</span>
                    </div>
                    {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Button */}
      {user && (user.role === 'teacher' || user.role === 'admin') && (
        <>
          <Separator />
          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full" 
              size="sm"
              data-testid="button-create-group"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </>
      )}
    </div>
  );
}