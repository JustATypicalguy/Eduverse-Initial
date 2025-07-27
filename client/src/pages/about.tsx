import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Tag, Globe, Star } from "lucide-react";

export default function About() {
  return (
    <div className="pt-24">
      {/* About Header */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Nilo</h1>
            <p className="text-xl text-nilo-gray max-w-3xl mx-auto">
              A pioneering educational institution dedicated to nurturing young minds and preparing them for a 
              globally connected world through innovative education and cultural diversity.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            {/* Mission */}
            <Card className="text-center bg-nilo-light">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-nilo-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-nilo-gray leading-relaxed">
                  To provide exceptional international education that develops critical thinkers, 
                  compassionate leaders, and global citizens ready to make a positive impact on the world.
                </p>
              </CardContent>
            </Card>
            
            {/* Vision */}
            <Card className="text-center bg-nilo-light">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-nilo-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-nilo-gray leading-relaxed">
                  To be a leading educational institution that inspires excellence, celebrates diversity, 
                  and creates a collaborative learning environment where every student thrives.
                </p>
              </CardContent>
            </Card>
            
            {/* Values */}
            <Card className="text-center bg-nilo-light">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-nilo-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h3>
                <p className="text-nilo-gray leading-relaxed">
                  Excellence, Integrity, Respect, Innovation, and Global Citizenship guide everything we do, 
                  fostering an inclusive community of lifelong learners.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Accreditation & Diversity */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">International Accreditation</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Tag className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">International Baccalaureate (IB)</h4>
                    <p className="text-nilo-gray">World School authorization for PYP, MYP, and DP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Cambridge International</h4>
                    <p className="text-nilo-gray">IGCSE and A-Level program accreditation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">WASC Accredited</h4>
                    <p className="text-nilo-gray">Western Association of Schools and Colleges</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Diverse group of international students collaborating on project" 
                className="rounded-xl shadow-lg w-full" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Educational Philosophy */}
      <section className="py-20 bg-nilo-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Educational Philosophy</h2>
            <p className="text-xl text-nilo-gray max-w-3xl mx-auto">
              We believe in developing the whole child through inquiry-based learning, 
              international-mindedness, and personal growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="font-semibold text-gray-800 mb-2">Global Citizenship</h3>
                <p className="text-sm text-nilo-gray">
                  Developing awareness and understanding of global issues and interconnectedness.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-semibold text-gray-800 mb-2">Inquiry-Based Learning</h3>
                <p className="text-sm text-nilo-gray">
                  Encouraging curiosity and critical thinking through student-led investigations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-semibold text-gray-800 mb-2">Collaboration</h3>
                <p className="text-sm text-nilo-gray">
                  Building teamwork and communication skills through collaborative projects.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="font-semibold text-gray-800 mb-2">Innovation</h3>
                <p className="text-sm text-nilo-gray">
                  Embracing creativity and new technologies to enhance learning experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
