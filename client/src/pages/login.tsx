import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | null;

// Form validation schemas
const signUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(['student', 'teacher', 'parent', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

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
    <div className="relative luxury-card border-0 rounded-2xl p-6 max-w-md mx-auto shadow-2xl">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <blockquote className="text-gray-800 italic mb-4 min-h-[60px] flex items-center justify-center">
          "{testimonials[currentIndex].quote}"
        </blockquote>
        <div className="text-gray-600 text-sm">
          <div className="font-luxury">{testimonials[currentIndex].author}</div>
          <div className="text-xs font-elegant">{testimonials[currentIndex].role}</div>
        </div>
      </div>
      
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={prevTestimonial}
          className="text-blue-600 hover:text-yellow-500 hover:bg-blue-50/30"
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
          className="text-blue-600 hover:text-yellow-500 hover:bg-blue-50/30"
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
              index === currentIndex ? 'bg-yellow-500' : 'bg-gray-300'
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
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    // Remember user's preferred role
    if (typeof window !== 'undefined') {
      return localStorage.getItem('eduverse_preferred_role') as UserRole || null;
    }
    return null;
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  
  // Form instances
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const { login, isAuthenticated, user } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

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

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectToRoleBasedHome(user.role);
    }
  }, [isAuthenticated, user]);

  // Save role preference when selected
  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('eduverse_preferred_role', selectedRole);
    }
  }, [selectedRole]);

  const redirectToRoleBasedHome = (role: string) => {
    // All roles now redirect to the unified portal landing page
    // which provides personalized dashboards based on user role
    setLocation('/portal');
  };

  // Sign up form handler
  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Account Created!",
          description: "Welcome to EduVerse! You can now log in with your credentials.",
        });
        setIsSignUpOpen(false);
        signUpForm.reset();
        setSelectedRole(values.role);
        setEmail(values.email);
      } else {
        const error = await response.json();
        toast({
          title: "Sign Up Failed",
          description: error.message || "Unable to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password form handler
  const handleForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Reset Link Sent!",
          description: "If an account exists with that email, you'll receive a password reset link.",
        });
        setIsForgotPasswordOpen(false);
        forgotPasswordForm.reset();
        
        // In development, show the reset token
        if (data.resetToken) {
          toast({
            title: "Development Mode",
            description: `Reset token: ${data.resetToken} (Use this to reset your password)`,
          });
          // Automatically fill the reset form for development
          resetPasswordForm.setValue('token', data.resetToken);
          setIsResetPasswordOpen(true);
        }
      } else {
        const error = await response.json();
        toast({
          title: "Request Failed",
          description: error.message || "Unable to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password form handler
  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: values.token,
          newPassword: values.newPassword,
        }),
      });

      if (response.ok) {
        toast({
          title: "Password Reset!",
          description: "Your password has been successfully reset. You can now log in.",
        });
        setIsResetPasswordOpen(false);
        resetPasswordForm.reset();
      } else {
        const error = await response.json();
        toast({
          title: "Reset Failed",
          description: error.message || "Unable to reset password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    parent: {
      icon: Users,
      color: "from-orange-500 to-orange-600",
      hint: "Use your registered parent email address.",
      buttonText: "Parent Portal",
      benefits: "Monitor your child's progress, communicate with teachers."
    },
    admin: {
      icon: Shield,
      color: "from-purple-500 to-violet-500",
      hint: "Use your secured admin key to proceed.",
      buttonText: "Manage System",
      benefits: "Manage user access, monitor analytics, keep the system secure."
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Role Required",
        description: "Please select your role before logging in.",
        variant: "destructive",
      });
      return;
    }

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        username: email,
        password: password
      });

      if (result.success) {
        toast({
          title: "Welcome to EduVerse!",
          description: `Successfully logged in as ${selectedRole}.`,
        });
        // Redirect will happen automatically via useEffect when auth state updates
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen luxury-gradient relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center pt-12 pb-8">
          <div className="inline-block mb-4">
            <div className="text-6xl font-luxury font-bold relative">
              <span className="luxury-text-gradient animate-pulse-glow drop-shadow-2xl">
                EDUVERSE
              </span>
              <div className="absolute inset-0 blur-sm luxury-text-gradient opacity-50 animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl text-white/90 font-elegant tracking-wide drop-shadow-lg">
            One Universe for All Education
          </p>
        </div>

        <div className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Left Side - Role Selection & Login */}
          <div className="lg:w-1/2 max-w-md w-full">
            {/* Role Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-luxury text-white/90 mb-6 text-center drop-shadow-lg">Choose Your Role</h3>
              <div className="grid grid-cols-1 gap-4">
                {(Object.keys(roleData) as UserRole[]).filter(role => role !== null).map((role) => {
                  const data = roleData[role!];
                  const IconComponent = data.icon;
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`luxury-card p-4 rounded-xl border-0 transition-all duration-400 hover:scale-105 ${
                        selectedRole === role
                          ? `bg-gradient-to-r ${data.color} shadow-2xl scale-105 border border-yellow-300/50`
                          : 'hover:border-yellow-200/30 hover:shadow-xl'
                      }`}
                      data-testid={`button-role-${role}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          selectedRole === role ? 'bg-white/20' : 'bg-blue-50'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${selectedRole === role ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        <div className="text-left">
                          <div className={`font-luxury capitalize ${selectedRole === role ? 'text-white' : 'text-gray-800'}`}>{role}</div>
                          <div className={`text-sm font-elegant ${selectedRole === role ? 'text-white/70' : 'text-gray-600'}`}>{data.benefits}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Box */}
            {selectedRole && (
              <Card className="luxury-card border-0 shadow-2xl">
                <CardContent className="p-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-luxury text-gray-800 capitalize">
                        {selectedRole} Login
                      </h4>
                      <p className="text-gray-600 font-elegant text-sm mt-1">
                        {roleData[selectedRole].hint}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-premium">Email or Username</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gradient-to-r from-white to-yellow-50/30 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-yellow-400 focus:shadow-lg transition-all duration-300"
                        placeholder={`Enter your ${selectedRole} email`}
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-gray-700 font-premium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gradient-to-r from-white to-yellow-50/30 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-yellow-400 focus:shadow-lg transition-all duration-300"
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
                        <Label htmlFor="remember" className="text-gray-700 text-sm font-premium">
                          Remember Me
                        </Label>
                      </div>
                      <Button 
                        variant="link" 
                        className="luxury-text-gradient hover:opacity-80 p-0 h-auto font-premium"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        type="button"
                        data-testid="button-forgot-password"
                      >
                        Forgot Password?
                      </Button>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className={`luxury-button w-full bg-gradient-to-r ${roleData[selectedRole].color} hover:shadow-2xl transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed font-luxury text-white border-2 border-yellow-300/40 relative overflow-hidden`}
                      data-testid="button-login"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse"></div>
                      <span className="relative z-10">{isLoading ? "Signing In..." : roleData[selectedRole].buttonText}</span>
                    </Button>

                    {/* Social Login Preparation */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" type="button" disabled className="bg-white hover:bg-gray-50">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="sr-only">Google</span>
                      </Button>
                      <Button variant="outline" type="button" disabled className="bg-white hover:bg-gray-50">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="sr-only">Facebook</span>
                      </Button>
                      <Button variant="outline" type="button" disabled className="bg-white hover:bg-gray-50">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017z"/>
                        </svg>
                        <span className="sr-only">Apple</span>
                      </Button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <span className="text-sm text-gray-600 font-premium">Don't have an account? </span>
                      <Button 
                        variant="link" 
                        className="luxury-text-gradient hover:opacity-80 p-0 h-auto font-premium"
                        onClick={() => setIsSignUpOpen(true)}
                        type="button"
                        data-testid="button-sign-up"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Testimonials */}
          <div className="lg:w-1/2 max-w-lg w-full">
            {/* Community Feedback Carousel */}
            <div>
              <h3 className="text-xl font-luxury text-white/90 mb-4 text-center drop-shadow-lg">
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
              <div className="flex gap-6 text-gray-600 text-sm font-elegant">
                <Link href="/about" className="hover:text-yellow-500 transition-colors">About</Link>
                <Link href="/contact" className="hover:text-yellow-500 transition-colors">Support</Link>
                <Link href="/terms" className="hover:text-yellow-500 transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-yellow-500 transition-colors">Privacy</Link>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-600" />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-24 bg-white border-gray-300 text-gray-800">
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
                <p className="text-gray-700 italic text-sm max-w-xs">
                  "{motivationalQuotes[currentQuote]}"
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}