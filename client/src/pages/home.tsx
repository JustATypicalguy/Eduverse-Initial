import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Award, Globe, Users, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-eduverse-light via-white to-blue-50 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-eduverse-blue bg-opacity-10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-yellow-400 bg-opacity-20 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-green-400 bg-opacity-15 rounded-full animate-bounce-in"></div>
        
        <div className="container mx-auto px-6 py-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="mb-6">
                <span className="text-eduverse-gold font-semibold text-lg" style={{color: '#D4AF37'}}>
                  🌟 Excellence in Education
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 mb-6">
                Welcome to <span className="text-eduverse-gold font-extrabold animate-gradient" style={{color: '#D4AF37'}}>EduVerse</span>
              </h1>
              <p className="text-xl text-eduverse-gray mb-8 leading-relaxed">
                🚀 Empowering global citizens through excellence in education, fostering creativity, 
                critical thinking, and cultural understanding in our diverse learning community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/programs">
                  <Button className="bg-gradient-to-r from-eduverse-blue to-eduverse-gold text-white px-8 py-4 rounded-xl creative-shadow hover:scale-105 transition-transform">
                    ✨ Explore Our Curriculum
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-2 border-eduverse-blue text-eduverse-blue hover:bg-eduverse-blue hover:text-white px-8 py-4 rounded-xl glass-effect hover:scale-105 transition-transform">
                    📅 Schedule a Visit
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Diverse students learning together in modern classroom" 
                  className="rounded-3xl creative-shadow w-full hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-eduverse-blue/20 to-transparent rounded-3xl"></div>
              </div>
              <Card className="absolute -bottom-6 -left-6 border-gray-100 glass-effect animate-bounce-in">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse-slow">
                      <Award className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">🏆 IB Accredited</p>
                      <p className="text-sm text-eduverse-gray">Excellence Certified</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center creative-shadow hover:scale-105 transition-transform animate-bounce-in bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-2">🌍</div>
                <div className="text-3xl font-bold text-eduverse-blue mb-2">1,200+</div>
                <p className="text-eduverse-gray font-medium">Global Students</p>
              </CardContent>
            </Card>
            <Card className="text-center creative-shadow hover:scale-105 transition-transform animate-bounce-in bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-3xl font-bold text-eduverse-blue mb-2">45</div>
                <p className="text-eduverse-gray font-medium">Countries</p>
              </CardContent>
            </Card>
            <Card className="text-center creative-shadow hover:scale-105 transition-transform animate-bounce-in bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-2">👨‍🏫</div>
                <div className="text-3xl font-bold text-eduverse-blue mb-2">150+</div>
                <p className="text-eduverse-gray font-medium">Expert Teachers</p>
              </CardContent>
            </Card>
            <Card className="text-center creative-shadow hover:scale-105 transition-transform animate-bounce-in bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-2">📚</div>
                <div className="text-3xl font-bold text-eduverse-blue mb-2">25+</div>
                <p className="text-eduverse-gray font-medium">Programs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Overview Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-eduverse-blue to-eduverse-gold rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 animate-pulse-slow"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              🌟 Why Choose <span className="text-eduverse-gold font-bold" style={{color: '#D4AF37'}}>EduVerse</span>?
            </h2>
            <p className="text-xl text-eduverse-gray max-w-3xl mx-auto">
              Discover what makes our educational community exceptional and transformative.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-0 animate-slide-up">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-eduverse-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                  <Globe className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🌍 Global Perspective</h3>
                <p className="text-eduverse-gray leading-relaxed">
                  Students from 45+ countries create a truly diverse learning environment 
                  that prepares graduates for success in our interconnected world.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border-0 animate-slide-up">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                  <BookOpen className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📚 Rigorous Academics</h3>
                <p className="text-eduverse-gray leading-relaxed">
                  IB and IGCSE programs provide world-class education with inquiry-based learning 
                  and critical thinking at the core of our curriculum.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-0 animate-slide-up">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                  <Users className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🤝 Supportive Community</h3>
                <p className="text-eduverse-gray leading-relaxed">
                  Small class sizes and dedicated teachers ensure personalized attention 
                  and support for every student's individual learning journey.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/about">
              <Button className="bg-gradient-to-r from-eduverse-blue to-purple-600 text-white hover:scale-105 transition-transform px-10 py-4 rounded-xl creative-shadow">
                ✨ Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subjects Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-5 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-5 animate-pulse-slow"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              📚 Explore Our <span className="text-eduverse-gold font-bold" style={{color: '#D4AF37'}}>Subjects</span>
            </h2>
            <p className="text-xl text-eduverse-gray max-w-3xl mx-auto">
              Comprehensive curriculum designed to inspire curiosity and foster academic excellence across all disciplines.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-0 animate-slide-up">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🧮</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Mathematics</h3>
                <p className="text-sm text-eduverse-gray">Algebra, Geometry, Calculus, Statistics</p>
              </CardContent>
            </Card>
            
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border-0 animate-slide-up">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Sciences</h3>
                <p className="text-sm text-eduverse-gray">Physics, Chemistry, Biology, Environmental</p>
              </CardContent>
            </Card>
            
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-0 animate-slide-up">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🗣️</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Languages</h3>
                <p className="text-sm text-eduverse-gray">English, Spanish, French, Mandarin</p>
              </CardContent>
            </Card>
            
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-pink-50 to-pink-100 border-0 animate-slide-up">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Arts</h3>
                <p className="text-sm text-eduverse-gray">Visual Arts, Music, Drama, Digital Media</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 border-0 animate-slide-up">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Social Studies</h3>
                <p className="text-sm text-eduverse-gray">History, Geography, Economics, Psychology</p>
              </CardContent>
            </Card>
            
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 border-0 animate-slide-up">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Technology</h3>
                <p className="text-sm text-eduverse-gray">Computer Science, Robotics, Digital Design</p>
              </CardContent>
            </Card>
            
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 border-0 animate-slide-up">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏃‍♂️</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Physical Education</h3>
                <p className="text-sm text-eduverse-gray">Sports, Health, Wellness, Fitness</p>
              </CardContent>
            </Card>
            
            <Card className="text-center creative-shadow hover:scale-105 transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 border-0 animate-slide-up">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Life Skills</h3>
                <p className="text-sm text-eduverse-gray">Critical Thinking, Leadership, Communication</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Link href="/subjects">
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 text-white hover:scale-105 transition-transform px-12 py-4 rounded-xl creative-shadow">
                🚀 Explore All Subjects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
