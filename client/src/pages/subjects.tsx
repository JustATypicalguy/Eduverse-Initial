import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subjectCategories, getSubjectsByCategory } from "@/lib/subjects";
import { 
  Calculator, 
  FlaskConical, 
  Languages, 
  Palette, 
  Globe, 
  Laptop, 
  Activity, 
  Lightbulb,
  Check
} from "lucide-react";

const iconMap = {
  calculator: Calculator,
  flask: FlaskConical,
  language: Languages,
  palette: Palette,
  "globe-americas": Globe,
  "laptop-code": Laptop,
  running: Activity,
  lightbulb: Lightbulb,
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="pt-24">
      {/* Subjects Header */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Academic Subjects</h1>
            <p className="text-xl text-eduverse-gray max-w-3xl mx-auto">
              Comprehensive curriculum covering all essential subjects with innovative teaching 
              methods and real-world applications.
            </p>
          </div>
          
          {/* Subject Categories */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
            {subjectCategories.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Calculator;
              const colorClasses = colorMap[category.color as keyof typeof colorMap] || colorMap.blue;
              const [gradientClasses, iconBgClass] = colorClasses.split(" bg-");
              
              return (
                <Card 
                  key={category.id}
                  className={`bg-gradient-to-br ${gradientClasses} hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedCategory === category.id ? 'ring-2 ring-eduverse-blue' : ''
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-${iconBgClass} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Category Details */}
          {selectedCategory && (
            <div className="mb-12">
              <div className="bg-eduverse-light rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  {subjectCategories.find(cat => cat.id === selectedCategory)?.name} Subjects
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {getSubjectsByCategory(selectedCategory).map((subject) => (
                    <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold text-gray-800 mb-3">{subject.name}</h4>
                        <p className="text-gray-600 mb-4">{subject.description}</p>
                        <div className="space-y-2">
                          {subject.details.map((detail, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Check className="text-green-500 flex-shrink-0" size={16} />
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Featured Subject Detail */}
          <div className="bg-eduverse-light rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Interactive Learning Experience</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our subjects are taught using innovative pedagogical approaches that engage students 
                  through hands-on activities, collaborative projects, and real-world applications.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-eduverse-blue rounded-full flex items-center justify-center">
                      <Check className="text-white" size={14} />
                    </div>
                    <span className="text-gray-700">Project-based learning approach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-eduverse-blue rounded-full flex items-center justify-center">
                      <Check className="text-white" size={14} />
                    </div>
                    <span className="text-gray-700">Technology-enhanced classrooms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-eduverse-blue rounded-full flex items-center justify-center">
                      <Check className="text-white" size={14} />
                    </div>
                    <span className="text-gray-700">International curriculum standards</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-eduverse-blue rounded-full flex items-center justify-center">
                      <Check className="text-white" size={14} />
                    </div>
                    <span className="text-gray-700">Personalized learning paths</span>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Students using tablets and technology in modern interactive classroom" 
                  className="rounded-xl shadow-lg w-full" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
