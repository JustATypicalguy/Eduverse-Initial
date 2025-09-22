import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Users, 
  Phone, 
  Video,
  Hand,
  BarChart3,
  Wifi,
  WifiOff
} from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { Group, User, GroupMessage } from '@shared/schema';

interface ChatAreaProps {
  group: Group;
  user: User | null;
  messages: GroupMessage[];
  onSendMessage: (content: string, messageType?: string, metadata?: any) => void;
  typingUsers: string[];
  isConnected: boolean;
}

export function ChatArea({ 
  group, 
  user, 
  messages, 
  onSendMessage, 
  typingUsers,
  isConnected 
}: ChatAreaProps) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim() && user) {
      onSendMessage(messageText.trim());
      setMessageText('');
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    // Handle typing indicators
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      // Send typing start via WebSocket
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Send typing stop via WebSocket
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'class': return '🏫';
      case 'project': return '📋';
      case 'announcement': return '📢';
      default: return '💬';
    }
  };

  const canRaiseHand = user?.role === 'student';
  const canCreatePoll = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getGroupIcon(group.type)}</div>
            <div>
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                {group.name}
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-500" title="Connected" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" title="Disconnected" />
                )}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Users className="h-3 w-3" />
                12 members • {group.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {canRaiseHand && (
              <Button
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                data-testid="button-raise-hand"
              >
                <Hand className="h-4 w-4 mr-1" />
                Raise Hand
              </Button>
            )}
            
            {canCreatePoll && (
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                data-testid="button-create-poll"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Poll
              </Button>
            )}
            
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">{getGroupIcon(group.type)}</div>
              <h3 className="font-medium mb-1">Welcome to {group.name}</h3>
              <p className="text-sm">Start the conversation by sending a message</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentUser={user}
                isFirstInGroup={index === 0 || messages[index - 1].userId !== message.userId}
                isLastInGroup={index === messages.length - 1 || messages[index + 1]?.userId !== message.userId}
              />
            ))}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <TypingIndicator users={typingUsers} />
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <Button variant="ghost" size="sm" className="mb-2">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <Input
              placeholder={`Message ${group.name}...`}
              value={messageText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] resize-none"
              data-testid="input-message"
              disabled={!isConnected}
            />
          </div>
          
          <Button variant="ghost" size="sm" className="mb-2">
            <Smile className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected}
            className="bg-eduverse-blue hover:bg-eduverse-dark mb-2"
            size="sm"
            data-testid="button-send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <WifiOff className="h-3 w-3" />
            Disconnected. Trying to reconnect...
          </p>
        )}
      </div>
    </div>
  );
}