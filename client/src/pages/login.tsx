import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  GraduationCap, 
  PenTool, 
  Shield, 
  Settings, 
  Users, 
  ChartBar,
  MessageCircle,
  Star,
  Globe,
  ChevronLeft,
  ChevronRight,
  Bot
} from "lucide-react";
import { Link } from "wouter";

type UserRole = 'student' | 'teacher' | 'administrator' | null;

interface TestimonialCarouselProps {
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
  }>;
}

function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-auto">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <blockquote className="text-white/90 italic mb-4 min-h-[60px] flex items-center justify-center">
          "{testimonials[currentIndex].quote}"
        </blockquote>
        <div className="text-white/70 text-sm">
          <div className="font-medium">{testimonials[currentIndex].author}</div>
          <div className="text-xs">{testimonials[currentIndex].role}</div>
        </div>
      </div>
      
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={prevTestimonial}
          className="text-white/60 hover:text-white hover:bg-white/10"
          data-testid="button-prev-testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={nextTestimonial}
          className="text-white/60 hover:text-white hover:bg-white/10"
          data-testid="button-next-testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
            onClick={() => setCurrentIndex(index)}
            data-testid={`testimonial-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating books */}
      <div className="absolute top-20 left-10 animate-float">
        <BookOpen className="h-6 w-6 text-blue-300/30" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed">
        <GraduationCap className="h-8 w-8 text-purple-300/30" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float">
        <PenTool className="h-5 w-5 text-green-300/30" />
      </div>
      <div className="absolute top-60 right-40 animate-float-delayed">
        <BookOpen className="h-7 w-7 text-orange-300/30" />
      </div>
      
      {/* Floating stars */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`absolute animate-twinkle ${
            i % 2 === 0 ? 'animate-delay-1000' : 'animate-delay-2000'
          }`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        >
          <Star className="h-3 w-3 text-white/20" />
        </div>
      ))}
    </div>
  );
}

function AIAssistant() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer animate-bounce-gentle">
          <Bot className="h-6 w-6 text-white" />
        </div>
        
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-3 max-w-xs transform scale-0 opacity-0 transition-all duration-200 hover:scale-100 hover:opacity-100 group-hover:scale-100 group-hover:opacity-100">
          <div className="text-sm text-gray-800">
            Need help? I'll guide you through login.
          </div>
          <div className="absolute bottom-0 right-4 transform translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [currentQuote, setCurrentQuote] = useState(0);

  const motivationalQuotes = [
    "Today a reader, tomorrow a leader.",
    "Education is the passport to the future.",
    "Learning never exhausts the mind.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Education is the most powerful weapon which you can use to change the world."
  ];

  const testimonials = [
    {
      quote: "Eduverse helped me improve my grades by 30%.",
      author: "Sarah Johnson",
      role: "Student"
    },
    {
      quote: "Managing my class became so easy with Eduverse.",
      author: "Prof. Michael Chen",
      role: "Teacher"
    },
    {
      quote: "The analytics dashboard gives us incredible insights.",
      author: "Dr. Emily Rodriguez",
      role: "Administrator"
    },
    {
      quote: "The AI tutoring feature is a game-changer!",
      author: "Alex Thompson",
      role: "Student"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const roleData = {
    student: {
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      hint: "Use your Student ID or school email.",
      buttonText: "Enter Class",
      benefits: "Track progress, join group chats, explore AI quizzes."
    },
    teacher: {
      icon: PenTool,
      color: "from-green-500 to-emerald-500",
      hint: "Use your faculty email for instant access.",
      buttonText: "Start Teaching",
      benefits: "Create groups, manage lessons & attendance, use AI grading assistant."
    },
    administrator: {
      icon: Shield,
      color: "from-purple-500 to-violet-500",
      hint: "Use your secured admin key to proceed.",
      buttonText: "Manage System",
      benefits: "Manage user access, monitor analytics, keep the system secure."
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password, role: selectedRole, rememberMe });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center pt-12 pb-8">
          <div className="inline-block mb-4">
            <div className="text-6xl font-bold text-white relative">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse-glow">
                EDUVERSE
              </span>
              <div className="absolute inset-0 blur-sm bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent opacity-50 animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl text-white/80 font-light tracking-wide">
            One Universe for All Education
          </p>
        </div>

        <div className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Left Side - Role Selection & Login */}
          <div className="lg:w-1/2 max-w-md w-full">
            {/* Role Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">Choose Your Role</h3>
              <div className="grid grid-cols-1 gap-4">
                {(Object.keys(roleData) as UserRole[]).filter(role => role !== null).map((role) => {
                  const data = roleData[role!];
                  const IconComponent = data.icon;
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedRole === role
                          ? `border-white bg-gradient-to-r ${data.color} shadow-lg scale-105`
                          : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/20'
                      }`}
                      data-testid={`button-role-${role}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          selectedRole === role ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-white font-semibold capitalize">{role}</div>
                          <div className="text-white/70 text-sm">{data.benefits}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Box */}
            {selectedRole && (
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <CardContent className="p-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-white capitalize">
                        {selectedRole} Login
                      </h4>
                      <p className="text-white/70 text-sm mt-1">
                        {roleData[selectedRole].hint}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white/90">Email or Username</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                        placeholder={`Enter your ${selectedRole} email`}
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-white/90">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                        placeholder="Enter your password"
                        data-testid="input-password"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={setRememberMe}
                          data-testid="switch-remember-me"
                        />
                        <Label htmlFor="remember" className="text-white/90 text-sm">
                          Remember Me
                        </Label>
                      </div>
                      <Link href="/forgot-password">
                        <Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">
                          Forgot Password?
                        </Button>
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      className={`w-full bg-gradient-to-r ${roleData[selectedRole].color} hover:shadow-lg transition-all duration-300`}
                      data-testid="button-login"
                    >
                      {roleData[selectedRole].buttonText}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Preview Features & Testimonials */}
          <div className="lg:w-1/2 max-w-lg w-full space-y-8">
            {/* Preview Features */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                Platform Features
              </h3>
              <div className="space-y-4">
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">For Students</h4>
                      <p className="text-white/70 text-sm">Track progress, join group chats, explore AI quizzes.</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <ChartBar className="h-6 w-6 text-green-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">For Teachers</h4>
                      <p className="text-white/70 text-sm">Create groups, manage lessons & attendance, use AI grading assistant.</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Settings className="h-6 w-6 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">For Administrators</h4>
                      <p className="text-white/70 text-sm">Manage user access, monitor analytics, keep the system secure.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Community Feedback Carousel */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                What Our Community Says
              </h3>
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Links */}
              <div className="flex gap-6 text-white/70 text-sm">
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-white/70" />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-24 bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EN">EN</SelectItem>
                    <SelectItem value="AR">AR</SelectItem>
                    <SelectItem value="FR">FR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Motivational Quote */}
              <div className="text-center lg:text-right">
                <p className="text-white/80 italic text-sm max-w-xs">
                  "{motivationalQuotes[currentQuote]}"
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}