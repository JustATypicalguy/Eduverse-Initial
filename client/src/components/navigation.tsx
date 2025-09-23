import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
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
  { name: "👥 Group Chat", href: "/group-chat", icon: "💬" },
  { name: "🚀 AR Learning", href: "/ar-learning", icon: "👁️" },
  { name: "❤️ Emotional Learning", href: "/emotional-learning", icon: "🧠" },
  { name: "👤 Avatars", href: "/avatars", icon: "🎨" },
  { name: "📊 Progress Tracker", href: "/lms-structure", icon: "📈" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    return location === href;
  };

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
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
            
            {/* Interactive Features Dropdown */}
            <div className="relative group mr-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                ✨ Features
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180 duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="p-3">
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">🚀 Interactive Learning</h3>
                    <p className="text-sm text-gray-500">Explore our innovative features</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {featureItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-eduverse-light hover:to-purple-50 transition-all duration-200 transform hover:scale-102 ${
                          isActive(item.href) 
                            ? "bg-gradient-to-r from-eduverse-light to-purple-50 text-eduverse-blue font-semibold shadow-md" 
                            : "text-gray-700 hover:text-eduverse-blue"
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <span className="text-sm font-semibold block">{item.name}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-eduverse-blue transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    ))}
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
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium ${
                    isActive(item.href) 
                      ? "text-eduverse-blue font-medium" 
                      : "text-gray-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Features Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-semibold text-eduverse-blue mb-3">✨ Features</p>
                {featureItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 font-medium mb-2 ${
                      isActive(item.href) 
                        ? "text-eduverse-blue font-medium" 
                        : "text-gray-600"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </Link>
                ))}
              </div>
              
              <Link
                href="/ai-chat"
                className="bg-eduverse-blue text-white px-4 py-2 rounded-lg inline-block text-center"
              >
                🤖 Ask EduVerse AI
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
