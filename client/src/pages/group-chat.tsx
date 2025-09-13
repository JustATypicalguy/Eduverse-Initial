import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Users, MessageCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  student: string;
  message: string;
  timestamp: Date;
  avatar: string;
  subject?: string;
}

export default function GroupChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      student: "Ali",
      message: "Can someone help me understand photosynthesis? I'm having trouble with the process.",
      timestamp: new Date(Date.now() - 300000),
      avatar: "🌱",
      subject: "Biology"
    },
    {
      id: "2", 
      student: "Sara",
      message: "Sure Ali! Photosynthesis is how plants make their own food using sunlight, water, and CO2. The equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. Think of it as plants 'eating' sunlight! 🌞",
      timestamp: new Date(Date.now() - 240000),
      avatar: "🧬",
      subject: "Biology"
    },
    {
      id: "3",
      student: "Ahmed", 
      message: "Thanks Sara! That's really helpful. The equation makes it so much clearer! 🙏",
      timestamp: new Date(Date.now() - 180000),
      avatar: "📚",
      subject: "Biology"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [currentStudent, setCurrentStudent] = useState("You");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        student: currentStudent,
        message: newMessage,
        timestamp: new Date(),
        avatar: "🎓"
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-eduverse-light via-white to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="text-eduverse-blue" size={40} />
              <h1 className="text-4xl font-bold text-gray-800">
                Study Group Chat
              </h1>
            </div>
            <p className="text-xl text-eduverse-gray">
              Connect with classmates, ask questions, and help each other learn! 💬✨
            </p>
          </div>

          {/* Chat Container */}
          <Card className="h-96 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="text-eduverse-blue" size={24} />
                  Biology Study Group
                </CardTitle>
                <Badge variant="secondary" className="bg-eduverse-blue text-white">
                  {messages.length} messages
                </Badge>
              </div>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3 group">
                  <Avatar>
                    <AvatarFallback className="text-lg">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-eduverse-blue">
                        {msg.student}
                      </span>
                      {msg.subject && (
                        <Badge variant="outline" className="text-xs">
                          {msg.subject}
                        </Badge>
                      )}
                      <span className="text-xs text-eduverse-gray opacity-0 group-hover:opacity-100 transition-opacity">
                        {getTimeAgo(msg.timestamp)}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-gray-800">
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message... Ask questions, share answers, help classmates! 🤝"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                  data-testid="input-message"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-eduverse-blue hover:bg-eduverse-dark px-6"
                  data-testid="button-send"
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </Card>

          {/* Example Usage */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  💡 How to Use Group Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-700">
                  <li>• Ask questions about homework or concepts</li>
                  <li>• Share helpful explanations with classmates</li>
                  <li>• Form study groups for different subjects</li>
                  <li>• Thank others for their help</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  🌟 Example Interaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-blue-700 text-sm">
                  <div><strong>Ali:</strong> "Help with photosynthesis?"</div>
                  <div><strong>Sara:</strong> "Plants use CO2 + H2O + light → glucose!"</div>
                  <div><strong>Ahmed:</strong> "Thanks Sara! Very clear! 🙏"</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}