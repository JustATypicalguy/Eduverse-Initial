import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradeLevels, getSubjectsByGrade } from "@/lib/subjects";
import { 
  Calculator, 
  FlaskConical, 
  Languages, 
  Palette, 
  Globe, 
  Laptop, 
  Activity, 
  Lightbulb,
  Check,
  Baby,
  School,
  GraduationCap,
  BookOpen,
  Users,
  Heart,
  Briefcase
} from "lucide-react";

const gradeIconMap = {
  baby: Baby,
  school: School,
  "graduation-cap": GraduationCap,
};

const subjectIconMap = {
  calculator: Calculator,
  flask: FlaskConical,
  languages: Languages,
  palette: Palette,
  globe: Globe,
  laptop: Laptop,
  running: Activity,
  lightbulb: Lightbulb,
  "book-open": BookOpen,
  briefcase: Briefcase,
  heart: Heart,
};

const colorMap = {
  blue: "from-blue-50 to-blue-100 bg-blue-500",
  green: "from-green-50 to-green-100 bg-green-500",
  purple: "from-purple-50 to-purple-100 bg-purple-500",
  pink: "from-pink-50 to-pink-100 bg-pink-500",
  orange: "from-orange-50 to-orange-100 bg-orange-500",
  indigo: "from-indigo-50 to-indigo-100 bg-indigo-500",
  red: "from-red-50 to-red-100 bg-red-500",
  yellow: "from-yellow-50 to-yellow-100 bg-yellow-500",
};

export default function Subjects() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  return (
    <>
      {/* SEO Meta Tags */}
      <title>EduVerse Study Materials - Academic Subjects by Grade Level</title>
      <meta name="description" content="Explore comprehensive study materials and academic subjects organized by grade level at EduVerse. Access age-appropriate learning resources." />
      
      <div className="pt-24 luxury-gradient min-h-screen">
        {/* Luxury Theme Header */}
        <section className="py-20" data-testid="subjects-header">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-6xl animate-pulse">📚</span>
                <h1 className="text-5xl font-luxury text-white/90 drop-shadow-2xl">Study Materials & Subjects</h1>
              </div>
              <p className="text-xl text-white/80 max-w-3xl mx-auto font-elegant drop-shadow-lg">
                Discover comprehensive learning resources organized by grade level with engaging activities and examples
              </p>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-20 bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-luxury text-white/90 mb-4 drop-shadow-2xl">Academic Subjects by Grade Level</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-elegant drop-shadow-lg">
              Discover age-appropriate subjects with specific examples and activities designed for each grade level.
            </p>
          </div>
          
          {/* Grade Level Selection */}
          {!selectedGrade && (
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {gradeLevels.map((grade) => {
                const IconComponent = gradeIconMap[grade.icon as keyof typeof gradeIconMap] || GraduationCap;
                const colorClasses = colorMap[grade.color as keyof typeof colorMap] || colorMap.blue;
                const [gradientClasses, iconBgClass] = colorClasses.split(" bg-");
                
                return (
                  <Card 
                    key={grade.id}
                    className="luxury-card border-0 shadow-2xl hover:scale-105 transition-all duration-400 cursor-pointer"
                    onClick={() => setSelectedGrade(grade.id)}
                    data-testid={`grade-card-${grade.id}`}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                        <IconComponent className="text-white" size={32} />
                      </div>
                      <h3 className="text-2xl font-luxury text-gray-800 mb-2">{grade.name}</h3>
                      <p className="text-lg text-gray-700 mb-3 font-premium">{grade.ageRange}</p>
                      <p className="text-gray-600 text-sm leading-relaxed font-elegant">{grade.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Selected Grade Subjects */}
          {selectedGrade && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-luxury text-white/90 mb-2 drop-shadow-lg">
                    {gradeLevels.find(g => g.id === selectedGrade)?.name} Subjects
                  </h2>
                  <p className="text-white/80 font-elegant drop-shadow-sm">
                    {gradeLevels.find(g => g.id === selectedGrade)?.ageRange}
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedGrade(null);
                    setSelectedSubject(null);
                  }}
                  className="luxury-button bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:shadow-2xl transition-all duration-400 border-2 border-yellow-300/40 relative overflow-hidden font-luxury"
                  data-testid="button-back-to-grades"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse"></div>
                  <span className="relative z-10">← Back to Grade Levels</span>
                </Button>
              </div>
              
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-8">
                {getSubjectsByGrade(selectedGrade).map((subject) => {
                  const IconComponent = subjectIconMap[subject.icon as keyof typeof subjectIconMap] || Calculator;
                  const colorClasses = colorMap[subject.color as keyof typeof colorMap] || colorMap.blue;
                  const [gradientClasses, iconBgClass] = colorClasses.split(" bg-");
                  
                  return (
                    <Card 
                      key={subject.id} 
                      className={`luxury-card border-0 shadow-2xl hover:scale-105 transition-all duration-400 cursor-pointer ${
                        selectedSubject === subject.id ? 'ring-2 ring-yellow-400' : ''
                      }`}
                      onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                      data-testid={`subject-card-${subject.id}`}
                    >
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <h3 className="text-lg font-luxury text-gray-800 mb-2">{subject.name}</h3>
                        <p className="text-gray-600 text-sm font-elegant">{subject.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Selected Subject Details */}
              {selectedSubject && (
                <div className="luxury-card rounded-2xl p-8 border-0 shadow-2xl">
                  {(() => {
                    const subject = getSubjectsByGrade(selectedGrade).find(s => s.id === selectedSubject);
                    if (!subject) return null;
                    
                    return (
                      <>
                        <h3 className="text-3xl font-luxury text-gray-800 mb-6">{subject.name}</h3>
                        <div className="grid lg:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-xl font-luxury text-gray-800 mb-4">What You'll Learn</h4>
                            <div className="space-y-3">
                              {subject.examples.map((example, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="text-white" size={12} />
                                  </div>
                                  <span className="text-gray-700 text-sm leading-relaxed font-elegant">{example}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-luxury text-gray-800 mb-4">Skills You'll Develop</h4>
                            <div className="space-y-3">
                              {subject.skills.map((skill, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Lightbulb className="text-white" size={12} />
                                  </div>
                                  <span className="text-gray-700 text-sm leading-relaxed font-elegant">{skill}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
          
          {/* Featured Learning Experience */}
          {!selectedGrade && (
            <div className="luxury-card rounded-2xl p-8 lg:p-12 border-0 shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-luxury text-gray-800 mb-6">Grade-Appropriate Learning</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed font-elegant">
                    Our curriculum is carefully designed to match developmental stages, ensuring students 
                    receive age-appropriate challenges and build foundational skills progressively.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="text-white" size={14} />
                      </div>
                      <span className="text-gray-700 font-elegant">Age-appropriate learning activities</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="text-white" size={14} />
                      </div>
                      <span className="text-gray-700 font-elegant">Progressive skill development</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="text-white" size={14} />
                      </div>
                      <span className="text-gray-700 font-elegant">Interactive and engaging methods</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="text-white" size={14} />
                      </div>
                      <span className="text-gray-700 font-elegant">Real-world application examples</span>
                    </div>
                  </div>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                    alt="Students of different ages learning with technology and interactive methods" 
                    className="rounded-xl shadow-2xl w-full border-4 border-yellow-300/30 luxury-card" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
}
