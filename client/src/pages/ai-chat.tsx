import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, User, Send, Info } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AiChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      message: "",
      response: "Hello! 👋 I'm EduVerse AI, your comprehensive educational assistant! I'm here to support your learning journey in every way possible.\n\nI can help you with:\n\n📚 **Academic Subjects**: Math, Science, Languages, History, Arts, and more\n🎯 **Study Support**: Learning strategies, exam prep, note-taking techniques\n🎓 **Educational Guidance**: Course selection, university prep, career planning\n💡 **Homework Help**: Concept explanations, problem-solving, research assistance\n🌟 **Personal Growth**: Building confidence, managing study stress, goal setting\n\nWhether you're struggling with a specific topic or looking to excel further, I'm here to make learning engaging and accessible for you. What would you like to explore today?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: data.message,
        response: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    },
    onError: (error) => {
      toast({
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      response: "",
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Send to AI
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  const suggestedQuestions = [
    "Help me understand quadratic equations",
    "What are effective study techniques?",
    "Explain photosynthesis in simple terms",
    "How do I write a strong essay?",
    "What is the IB curriculum?",
    "Tips for managing exam stress",
    "How do I prepare for university?",
    "Explain the water cycle",
    "What languages can I learn at EduVerse?",
    "Help with research methods",
    "Tell me about STEM programs",
    "How to improve my presentation skills"
  ];

  return (
    <div className="pt-24">
      {/* AI Chat Header */}
      <section className="py-20 bg-gradient-to-br from-eduverse-blue to-eduverse-dark text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="text-white" size={48} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Ask EduVerse AI</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your comprehensive educational companion! I'm here to help with homework, 
              explain concepts, provide study strategies, and support your learning journey 
              across all subjects and academic levels.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Chat Interface */}
            <Card className="overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="bg-eduverse-light p-6 border-b">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-eduverse-blue rounded-full flex items-center justify-center">
                    <Bot className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">EduVerse AI Assistant</h3>
                    <p className="text-eduverse-gray">Your friendly educational companion - ready to help with any learning challenge!</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4" id="chat-messages">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.isUser ? (
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="bg-eduverse-blue rounded-lg p-4 max-w-md text-white">
                          <p>{msg.message}</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="text-gray-600" size={16} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-eduverse-blue rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="text-white" size={16} />
                        </div>
                        <div className="bg-eduverse-light rounded-lg p-4 max-w-md">
                          <p className="text-gray-800 whitespace-pre-wrap">{msg.response}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {chatMutation.isPending && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-eduverse-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white" size={16} />
                    </div>
                    <div className="bg-eduverse-light rounded-lg p-4 max-w-md">
                      <p className="text-gray-800">Thinking...</p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat Input */}
              <div className="border-t p-6">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Ask me anything educational - homework help, study tips, concept explanations, and more!"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={chatMutation.isPending}
                      className="focus:ring-2 focus:ring-eduverse-blue focus:border-transparent"
                      data-testid="input-chat-message"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-eduverse-blue text-white hover:bg-eduverse-dark flex items-center space-x-2"
                    disabled={chatMutation.isPending || !inputMessage.trim()}
                    data-testid="button-send-message"
                  >
                    <Send size={16} />
                    <span>Send</span>
                  </Button>
                </form>
                
                {/* Suggested Questions */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">💡 Try asking me about:</p>
                  <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-xs hover:bg-eduverse-blue hover:text-white transition-colors"
                        data-testid={`button-suggested-question-${index}`}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            {/* AI Disclaimer */}
            <div className="mt-8 text-center">
              <p className="text-blue-100 text-sm flex items-center justify-center">
                <Info className="mr-2" size={16} />
                EduVerse AI focuses on educational support and learning assistance. For admissions, enrollment, and school administration, please contact our admissions team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
