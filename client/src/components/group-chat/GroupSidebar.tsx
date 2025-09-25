import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Plus, Settings, LogOut, MessageCircle, UserPlus, Globe, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CreateGroupModal } from './CreateGroupModal';
import { queryClient } from '@/lib/queryClient';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { getAuthHeaders } = useAuth();
  const { toast } = useToast();

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

  // Fetch public groups (for discovery)
  const { data: publicGroups = [], isLoading: isLoadingPublic } = useQuery({
    queryKey: ['public-groups'],
    queryFn: async () => {
      const response = await fetch('/api/groups/public');
      if (!response.ok) throw new Error('Failed to fetch public groups');
      return response.json();
    }
  });

  // Join group mutation
  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join group');
      }
      return response.json();
    },
    onSuccess: () => {
      // Refresh both queries
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      queryClient.invalidateQueries({ queryKey: ['public-groups'] });
      toast({
        title: "Success",
        description: "You've successfully joined the group!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const filteredGroups = groups.filter((group: Group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter public groups that user is not already a member of
  const userGroupIds = groups.map((group: Group) => group.id);
  const filteredPublicGroups = publicGroups.filter((group: Group) => 
    !userGroupIds.includes(group.id) &&
    (group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     group.description?.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return <Globe className="h-4 w-4 text-green-600" />;
      case 'private': return <Lock className="h-4 w-4 text-red-600" />;
      case 'invite_only': return <Mail className="h-4 w-4 text-orange-600" />;
      default: return <Globe className="h-4 w-4 text-green-600" />;
    }
  };

  const handleJoinGroup = (groupId: string) => {
    joinGroupMutation.mutate(groupId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-luxury text-gray-800">Groups</h1>
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
          <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm">
            <Avatar>
              <AvatarFallback className="bg-eduverse-blue text-white">
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-luxury text-gray-900 truncate">{user.fullName}</p>
              <p className="text-sm text-gray-600 font-elegant">@{user.username}</p>
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

      {/* Groups Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="my-groups" className="h-full flex flex-col">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-groups" className="text-xs">
                My Groups ({filteredGroups.length})
              </TabsTrigger>
              <TabsTrigger value="discover" className="text-xs">
                Discover ({filteredPublicGroups.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-groups" className="flex-1 overflow-y-auto m-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading groups...
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No groups found' : 'No groups available'}
                <div className="mt-2 text-xs">
                  {user?.role === 'teacher' || user?.role === 'admin' ? 'Create your first group!' : 'Ask your teacher to add you to a group'}
                </div>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredGroups.map((group: Group) => (
                  <button
                    key={group.id}
                    onClick={() => onGroupSelect(group)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                      selectedGroup?.id === group.id
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg'
                        : 'hover:bg-white/60 hover:shadow-md backdrop-blur-sm'
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
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="flex-1 overflow-y-auto m-0">
            {isLoadingPublic ? (
              <div className="p-4 text-center text-gray-500">
                Loading public groups...
              </div>
            ) : filteredPublicGroups.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No public groups found' : 'No public groups available to join'}
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredPublicGroups.map((group: Group) => (
                  <div
                    key={group.id}
                    className="w-full p-3 rounded-lg border border-gray-200 hover:border-eduverse-blue/50 transition-colors"
                    data-testid={`public-group-item-${group.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getGroupIcon(group.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate text-gray-900">
                            {group.name}
                          </p>
                          <Badge variant="secondary" className={`text-xs ${getGroupTypeColor(group.type)}`}>
                            {group.type}
                          </Badge>
                        </div>
                        {group.description && (
                          <p className="text-sm text-gray-500 truncate mb-2">
                            {group.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              {getPrivacyIcon(group.privacy)}
                              <span className="capitalize">{group.privacy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>0/{group.memberLimit}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleJoinGroup(group.id)}
                            disabled={joinGroupMutation.isPending}
                            className="h-7 px-2 text-xs"
                            data-testid={`button-join-${group.id}`}
                          >
                            {joinGroupMutation.isPending ? (
                              <>
                                <div className="w-3 h-3 border-2 border-gray-300 border-t-eduverse-blue rounded-full animate-spin mr-1" />
                                Joining...
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3 mr-1" />
                                Join
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
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
              onClick={() => setShowCreateModal(true)}
              data-testid="button-create-group"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}