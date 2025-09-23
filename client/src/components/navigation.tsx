import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, Home } from "lucide-react";
import { Logo } from "./logo";

const navigationItems = [
  { name: "Home", href: "/home" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Subjects", href: "/subjects" },
  { name: "News", href: "/news" },
  { name: "Events", href: "/events" },
  { name: "Staff", href: "/staff" },
  { name: "Admissions", href: "/admissions" },
  { name: "Contact", href: "/contact" },
];

const featureItems = [
  { 
    name: "AI Study Assistant", 
    href: "/ai-chat", 
    icon: "🤖",
    description: "Get personalized help from our AI tutor",
    color: "from-blue-100 to-blue-200" 
  },
  { 
    name: "Group Chat", 
    href: "/group-chat", 
    icon: "💬",
    description: "Collaborate with classmates in study groups",
    color: "from-emerald-100 to-emerald-200" 
  },
  { 
    name: "Learning Avatars", 
    href: "/avatars", 
    icon: "🎨",
    description: "Create your personalized learning character",
    color: "from-purple-100 to-purple-200" 
  },
  { 
    name: "Progress Tracking", 
    href: "/lms-structure", 
    icon: "📈",
    description: "Monitor your academic achievements",
    color: "from-orange-100 to-orange-200" 
  },
  { 
    name: "Study Materials", 
    href: "/subjects", 
    icon: "📚",
    description: "Access comprehensive learning resources",
    color: "from-teal-100 to-teal-200" 
  },
  { 
    name: "Live Events", 
    href: "/events", 
    icon: "📅",
    description: "Join educational events and workshops",
    color: "from-indigo-100 to-indigo-200" 
  },
  { 
    name: "News & Updates", 
    href: "/news", 
    icon: "📰",
    description: "Stay updated with educational news",
    color: "from-rose-100 to-rose-200" 
  },
  { 
    name: "Staff Directory", 
    href: "/staff", 
    icon: "👥",
    description: "Connect with teachers and staff members",
    color: "from-cyan-100 to-cyan-200" 
  },
];

// Breadcrumb component for better navigation
function Breadcrumb({ location }: { location: string }) {
  const getBreadcrumbs = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/home' }];
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      // Special handling for known routes
      const routeLabels: Record<string, string> = {
        'ai-chat': 'AI Study Buddy',
        'group-chat': 'Group Chat',
        'ar-learning': 'AR Learning',
        'emotional-learning': 'Emotional Learning',
        'lms-structure': 'LMS Structure',
        'teacher-dashboard': 'Teacher Dashboard',
        'student-dashboard': 'Student Dashboard',
        'admin-dashboard': 'Admin Dashboard'
      };
      
      breadcrumbs.push({
        label: routeLabels[segment] || label,
        path: currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs(location);
  
  if (location === '/' || location === '/home' || breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
      <div className="container mx-auto px-6 py-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center">
                {index === 0 && <Home className="w-4 h-4 mr-1 text-eduverse-blue" />}
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <Link 
                      href={crumb.path}
                      className="text-eduverse-blue hover:text-eduverse-dark transition-colors font-medium"
                    >
                      {crumb.label}
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                  </>
                ) : (
                  <span className="text-gray-700 font-semibold">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    return location === href;
  };

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-blue-100' 
          : 'bg-white shadow-lg'
      }`}>
        <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          
          {/* Desktop Navigation - Organized & Creative */}
          <div className="hidden lg:flex items-center">
            {/* Main Navigation Group */}
            <div className="flex items-center space-x-1 bg-gray-50/80 rounded-full px-6 py-2 mr-8">
              <Link
                href="/home"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/home") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                🏠 Home
              </Link>
              <Link
                href="/about"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/about") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                📚 About
              </Link>
            </div>

            {/* Academic Section */}
            <div className="flex items-center space-x-1 bg-blue-50/80 rounded-full px-6 py-2 mr-8">
              <Link
                href="/programs"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/programs") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                🎓 Programs
              </Link>
              <Link
                href="/subjects"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/subjects") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                📖 Subjects
              </Link>
            </div>

            {/* Community Section */}
            <div className="flex items-center space-x-1 bg-purple-50/80 rounded-full px-6 py-2 mr-8">
              <Link
                href="/news"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/news") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                📰 News
              </Link>
              <Link
                href="/events"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/events") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                📅 Events
              </Link>
              <Link
                href="/staff"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/staff") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                👥 Staff
              </Link>
            </div>

            {/* Contact Section */}
            <div className="flex items-center space-x-1 bg-green-50/80 rounded-full px-6 py-2 mr-8">
              <Link
                href="/admissions"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/admissions") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                📝 Admissions
              </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive("/contact") 
                    ? "bg-eduverse-blue text-white shadow-md transform scale-105" 
                    : "text-gray-700 hover:text-eduverse-blue hover:bg-white/50"
                }`}
              >
                📞 Contact
              </Link>
            </div>
            
            {/* Interactive Features Dropdown - Enhanced */}
            <div className="relative group mr-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-500 via-blue-500 to-indigo-500 text-white rounded-full font-bold hover:from-slate-600 hover:via-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/20">
                <span className="text-xl animate-spin-slow">✨</span>
                <span className="text-lg">Explore Features</span>
                <svg className="w-5 h-5 transition-transform group-hover:rotate-180 duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Compact Features Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-[90vw] sm:w-80 md:w-96 lg:w-[600px] xl:w-[700px] bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50" data-testid="features-dropdown">
                <div className="p-3">
                  {/* Compact Header */}
                  <div className="text-center mb-3 pb-2 border-b border-gray-100">
                    <h3 className="font-semibold text-sm text-gray-700 flex items-center justify-center gap-2">
                      <span className="text-lg">✨</span>
                      EduVerse Features
                    </h3>
                  </div>
                  
                  {/* Compact Features Grid with Responsive Breakpoints */}
                  <div className="max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {featureItems.map((item, index) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group/item relative overflow-hidden rounded-lg p-2 transition-all duration-200 hover:shadow-md ${
                            isActive(item.href) 
                              ? "bg-gradient-to-r " + item.color + " text-gray-800 shadow-sm" 
                              : "bg-gray-50 hover:bg-gradient-to-r hover:" + item.color + " hover:text-gray-800"
                          }`}
                          data-testid={`feature-link-${item.href.slice(1)}`}
                        >
                          <div className="relative z-10 text-center">
                            {/* Compact Icon */}
                            <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                              <span className="text-xl">{item.icon}</span>
                            </div>
                            
                            {/* Compact Content */}
                            <div className="font-medium text-xs mb-1 leading-tight line-clamp-2">
                              {item.name}
                            </div>
                            <p className="text-xs opacity-75 leading-tight line-clamp-2 hidden sm:block">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Chat Button - Premium Style */}
            <Link
              href="/ai-chat"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-eduverse-blue to-blue-600 text-white rounded-full font-semibold hover:from-eduverse-dark hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-blue-300/30"
            >
              <span className="animate-pulse">🤖</span>
              <span>Ask EduVerse AI</span>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-eduverse-blue"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Enhanced Mobile Navigation with Animations */}
        <div className={`lg:hidden transition-all duration-500 ease-out ${
          isOpen 
            ? 'max-h-screen opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden'
        }`}>
          <div className="mt-4 pb-4 space-y-4">
            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-3">
              {navigationItems.slice(0, 4).map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`p-3 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                    isActive(item.href) 
                      ? "bg-eduverse-blue text-white shadow-lg border-eduverse-blue" 
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-center font-medium text-sm">{item.name}</div>
                </Link>
              ))}
            </div>
            
            {/* Remaining Navigation */}
            <div className="space-y-2">
              {navigationItems.slice(4).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-2 px-4 rounded-lg transition-colors ${
                    isActive(item.href) 
                      ? "text-eduverse-blue bg-blue-50 font-semibold" 
                      : "text-gray-600 hover:text-eduverse-blue hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile Features Section with Enhanced Design */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm font-semibold text-eduverse-blue mb-3 flex items-center">
                <span className="animate-pulse mr-1">✨</span> 
                Interactive Features
              </p>
              <div className="grid grid-cols-1 gap-2">
                {featureItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive(item.href) 
                        ? "text-eduverse-blue bg-blue-50 font-medium shadow-sm" 
                        : "text-gray-600 hover:text-eduverse-blue hover:bg-blue-50"
                    }`}
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Enhanced AI Chat Button */}
            <Link
              href="/ai-chat"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-eduverse-blue to-blue-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="animate-bounce">🤖</span>
              <span>Ask EduVerse AI</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">NEW</span>
            </Link>
          </div>
        </div>
      </nav>
      </header>
      
      {/* Add Breadcrumb Navigation */}
      <div className="pt-20">
        <Breadcrumb location={location} />
      </div>
    </>
  );
}
