import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, BookOpen, Megaphone, FolderOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { queryClient } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { getAuthHeaders, user } = useAuth();

  const groupTypes = [
    { value: 'class', label: 'Class Discussion', icon: '🏫', description: 'Subject-based learning group' },
    { value: 'project', label: 'Project Team', icon: '📋', description: 'Collaborative project work' },
    { value: 'announcement', label: 'Announcements', icon: '📢', description: 'Important updates and news' },
    { value: 'study', label: 'Study Group', icon: '📚', description: 'Peer learning and support' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission data:', { name: name.trim(), type, description: description.trim() });
    
    if (!name.trim() || !type) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    const requestData = {
      name: name.trim(),
      description: description.trim() || undefined,
      type
    };
    
    console.log('Sending request data:', requestData);

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to create group');
      }

      // Invalidate groups query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      
      // Reset form and close modal
      setName('');
      setDescription('');
      setType('');
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (typeValue: string) => {
    return groupTypes.find(t => t.value === typeValue)?.icon || '💬';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-eduverse-blue" />
            Create New Group
          </DialogTitle>
          <DialogDescription>
            Create a new group for collaboration, discussions, or announcements.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">
              Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="group-name"
              type="text"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-group-name"
              disabled={isLoading}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-type">
              Group Type <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={setType} disabled={isLoading}>
              <SelectTrigger data-testid="select-group-type">
                <SelectValue placeholder="Select a group type">
                  {type && (
                    <div className="flex items-center gap-2">
                      <span>{getTypeIcon(type)}</span>
                      <span>{groupTypes.find(t => t.value === type)?.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {groupTypes.map((groupType) => (
                  <SelectItem key={groupType.value} value={groupType.value}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{groupType.icon}</span>
                      <div>
                        <div className="font-medium">{groupType.label}</div>
                        <div className="text-xs text-gray-500">{groupType.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-description">Description (Optional)</Label>
            <Textarea
              id="group-description"
              placeholder="Describe the purpose of this group"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="textarea-group-description"
              disabled={isLoading}
              maxLength={300}
              rows={3}
            />
            <div className="text-xs text-gray-500 text-right">
              {description.length}/300 characters
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || !type}
              className="flex-1 bg-eduverse-blue hover:bg-eduverse-dark"
              data-testid="button-create-group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Create Group
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}