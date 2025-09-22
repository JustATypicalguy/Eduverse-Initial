import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Baby, Users, GraduationCap, Check } from "lucide-react";
import highSchoolImage from "@assets/stock_images/high_school_students_fab51db8.jpg";

export default function Programs() {
  return (
    <div className="pt-24">
      {/* Programs Header */}
      <section className="py-20 bg-eduverse-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Academic Programs</h1>
            <p className="text-xl text-eduverse-gray max-w-3xl mx-auto">
              Comprehensive educational pathways designed to challenge, inspire, and prepare 
              students for university and beyond.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Elementary Program */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300" 
                alt="Young elementary students engaged in colorful classroom activities" 
                className="w-full h-48 object-cover" 
              />
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <Baby className="text-yellow-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Elementary School</h3>
                </div>
                <p className="text-eduverse-gray mb-6">Ages 5-10 | Primary Years Programme (PYP)</p>
                <p className="text-gray-600 mb-6">
                  Foundation years focusing on inquiry-based learning, creativity, and building 
                  essential skills through play and exploration.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    Inquiry-based curriculum
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    Multilingual education
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    Creative arts integration
                  </li>
                </ul>
                <Button className="w-full bg-eduverse-blue text-white hover:bg-eduverse-dark">
                  Learn More
                </Button>
              </CardContent>
            </Card>
            
            {/* Middle School Program */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300" 
                alt="Middle school students conducting science experiments in modern laboratory" 
                className="w-full h-48 object-cover" 
              />
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Middle School</h3>
                </div>
                <p className="text-eduverse-gray mb-6">Ages 11-14 | Middle Years Programme (MYP)</p>
                <p className="text-gray-600 mb-6">
                  Challenging academic curriculum that encourages students to make connections 
                  between subjects and real-world applications.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    Interdisciplinary learning
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    Personal project development
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    Leadership opportunities
                  </li>
                </ul>
                <Button className="w-full bg-eduverse-blue text-white hover:bg-eduverse-dark">
                  Learn More
                </Button>
              </CardContent>
            </Card>
            
            {/* High School Program */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={highSchoolImage} 
                alt="High school students in classroom learning environment" 
                className="w-full h-48 object-cover" 
              />
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <GraduationCap className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">High School</h3>
                </div>
                <p className="text-eduverse-gray mb-6">Ages 15-18 | Diploma Programme (DP)</p>
                <p className="text-gray-600 mb-6">
                  Rigorous pre-university curriculum that develops intellectual, personal, 
                  emotional and social skills needed for university success.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    IB Diploma Programme
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    University preparation
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="text-green-500 mr-2" size={16} />
                    Extended essay project
                  </li>
                </ul>
                <Button className="w-full bg-eduverse-blue text-white hover:bg-eduverse-dark">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Curriculum Framework</h2>
            <p className="text-xl text-eduverse-gray max-w-3xl mx-auto">
              Our international curriculum is designed to develop well-rounded, globally-minded students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-semibold text-gray-800 mb-2">Academic Excellence</h3>
                <p className="text-sm text-eduverse-gray">
                  Rigorous academics that challenge students to reach their full potential across all subject areas.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="font-semibold text-gray-800 mb-2">International Mindedness</h3>
                <p className="text-sm text-eduverse-gray">
                  Developing global perspectives and cultural understanding through diverse experiences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-semibold text-gray-800 mb-2">Creative Expression</h3>
                <p className="text-sm text-eduverse-gray">
                  Encouraging creativity through arts, music, drama, and innovative project-based learning.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">⚽</div>
                <h3 className="font-semibold text-gray-800 mb-2">Physical Development</h3>
                <p className="text-sm text-eduverse-gray">
                  Promoting healthy lifestyles through sports, fitness, and wellness programs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-semibold text-gray-800 mb-2">Service Learning</h3>
                <p className="text-sm text-eduverse-gray">
                  Building character through community service and social responsibility initiatives.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💭</div>
                <h3 className="font-semibold text-gray-800 mb-2">Critical Thinking</h3>
                <p className="text-sm text-eduverse-gray">
                  Developing analytical and problem-solving skills for lifelong learning success.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/subjects">
              <Button className="bg-eduverse-blue text-white hover:bg-eduverse-dark px-8 py-3">
                Explore Our Subjects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
