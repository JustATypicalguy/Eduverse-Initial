import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Subjects", href: "/subjects" },
  { name: "Admissions", href: "/admissions" },
  { name: "Contact", href: "/contact" },
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
          <div className="hidden lg:flex items-center space-x-8">
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
            <Link
              href="/ai-chat"
              className="bg-eduverse-blue text-white px-4 py-2 rounded-lg hover:bg-eduverse-dark transition-colors"
            >
              Ask EduVerse AI
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
              <Link
                href="/ai-chat"
                className="bg-eduverse-blue text-white px-4 py-2 rounded-lg inline-block text-center"
              >
                Ask EduVerse AI
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
