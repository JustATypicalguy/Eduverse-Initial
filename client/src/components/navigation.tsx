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
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium hover:text-eduverse-blue transition-colors ${
                  isActive(item.href) 
                    ? "text-eduverse-blue font-medium" 
                    : "text-gray-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Features Dropdown */}
            <div className="relative group">
              <button className="font-medium text-gray-600 hover:text-eduverse-blue transition-colors flex items-center gap-1">
                ✨ Features
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {featureItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-eduverse-light transition-colors ${
                        isActive(item.href) 
                          ? "bg-eduverse-light text-eduverse-blue font-medium" 
                          : "text-gray-700 hover:text-eduverse-blue"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link
              href="/ai-chat"
              className="bg-eduverse-blue text-white px-4 py-2 rounded-lg hover:bg-eduverse-dark transition-colors"
            >
              🤖 Ask EduVerse AI
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
