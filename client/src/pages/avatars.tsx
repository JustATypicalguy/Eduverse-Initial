import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Sparkles, Shuffle, Download } from "lucide-react";

interface Avatar {
  emoji: string;
  title: string;
  description: string;
  traits: string[];
  color: string;
}

const avatarTypes: Avatar[] = [
  {
    emoji: "🧑‍🚀",
    title: "Astronaut Explorer",
    description: "Bold adventurers who reach for the stars!",
    traits: ["Curious", "Brave", "Scientific", "Ambitious"],
    color: "bg-blue-100 border-blue-300"
  },
  {
    emoji: "🧙‍♀️",
    title: "Knowledge Wizard",
    description: "Masters of wisdom and learning magic!",
    traits: ["Wise", "Creative", "Problem-solver", "Mentor"],
    color: "bg-purple-100 border-purple-300"
  },
  {
    emoji: "🦸‍♂️",
    title: "Study Superhero",
    description: "Defenders of education and learning!",
    traits: ["Determined", "Strong", "Helpful", "Leader"],
    color: "bg-red-100 border-red-300"
  },
  {
    emoji: "🧑‍🔬",
    title: "Science Pioneer",
    description: "Inventors and discoverers of tomorrow!",
    traits: ["Analytical", "Innovative", "Precise", "Logical"],
    color: "bg-green-100 border-green-300"
  },
  {
    emoji: "🎭",
    title: "Creative Artist",
    description: "Painters of imagination and dreams!",
    traits: ["Artistic", "Expressive", "Imaginative", "Unique"],
    color: "bg-pink-100 border-pink-300"
  },
  {
    emoji: "🧑‍💻",
    title: "Tech Genius",
    description: "Coders and builders of the digital future!",
    traits: ["Logical", "Innovative", "Detail-oriented", "Tech-savvy"],
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    emoji: "🌟",
    title: "Bright Star",
    description: "Shining lights that inspire everyone!",
    traits: ["Inspiring", "Positive", "Motivating", "Charismatic"],
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    emoji: "🦋",
    title: "Graceful Learner",
    description: "Elegant minds that transform knowledge!",
    traits: ["Graceful", "Adaptable", "Gentle", "Transformative"],
    color: "bg-teal-100 border-teal-300"
  },
  {
    emoji: "🏆",
    title: "Champion Scholar",
    description: "Winners who excel in everything they do!",
    traits: ["Competitive", "Dedicated", "Achieving", "Persistent"],
    color: "bg-orange-100 border-orange-300"
  },
  {
    emoji: "🌈",
    title: "Rainbow Dreamer",
    description: "Colorful minds with endless possibilities!",
    traits: ["Optimistic", "Diverse", "Hopeful", "Inclusive"],
    color: "bg-gradient-to-r from-red-100 to-purple-100 border-pink-300"
  }
];

// Avatar assignment algorithm based on name characteristics
const getAvatarForName = (name: string): Avatar => {
  if (!name) return avatarTypes[0];
  
  const nameUpper = name.toUpperCase();
  const nameSum = nameUpper.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  // Special cases for demo (as requested in user example)
  if (nameUpper.includes('OMAR')) return avatarTypes[0]; // 🧑‍🚀 Astronaut Explorer
  if (nameUpper.includes('SARA') || nameUpper.includes('SARAH')) return avatarTypes[1]; // 🧙‍♀️ Knowledge Wizard  
  if (nameUpper.includes('ALI')) return avatarTypes[2]; // 🦸‍♂️ Study Superhero
  if (nameUpper.includes('AHMED')) return avatarTypes[3]; // 🧑‍🔬 Science Pioneer
  if (nameUpper.includes('FATIMA')) return avatarTypes[4]; // 🎭 Creative Artist
  if (nameUpper.includes('HASSAN')) return avatarTypes[5]; // 🧑‍💻 Tech Genius
  if (nameUpper.includes('LAYLA') || nameUpper.includes('LEILA')) return avatarTypes[6]; // 🌟 Bright Star
  if (nameUpper.includes('MARYAM') || nameUpper.includes('MARIAM')) return avatarTypes[7]; // 🦋 Graceful Learner
  if (nameUpper.includes('YUSUF') || nameUpper.includes('JOSEPH')) return avatarTypes[8]; // 🏆 Champion Scholar
  
  // Algorithm for other names
  const index = nameSum % avatarTypes.length;
  return avatarTypes[index];
};

export default function Avatars() {
  const [studentName, setStudentName] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [randomAvatar, setRandomAvatar] = useState<Avatar | null>(null);
  const [isRandomMode, setIsRandomMode] = useState(false);
  
  // Use random avatar if in random mode, otherwise generate from name
  const currentAvatar = useMemo(() => {
    if (isRandomMode && randomAvatar) {
      return randomAvatar;
    }
    return getAvatarForName(studentName);
  }, [studentName, randomAvatar, isRandomMode]);
  
  const generateAvatar = () => {
    if (studentName.trim()) {
      setIsRandomMode(false);
      setShowAvatar(true);
    }
  };
  
  const randomizeAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatarTypes.length);
    const selectedAvatar = avatarTypes[randomIndex];
    setRandomAvatar(selectedAvatar);
    setIsRandomMode(true);
    setShowAvatar(true);
  };
  
  const exampleNames = [
    { name: "Omar", avatar: "🧑‍🚀 Astronaut Explorer" },
    { name: "Sara", avatar: "🧙‍♀️ Knowledge Wizard" },
    { name: "Ali", avatar: "🦸‍♂️ Study Superhero" },
    { name: "Ahmed", avatar: "🧑‍🔬 Science Pioneer" }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <title>EduVerse Learning Avatars - Create Your Unique Learning Character</title>
      <meta name="description" content="Generate your personalized learning avatar with EduVerse. Discover your unique character based on your personality and learning style." />
      
      <div className="pt-24 min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Purple/Violet Theme Header */}
          <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 text-white py-12 mb-8 rounded-2xl shadow-lg" data-testid="avatars-header">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-6xl animate-bounce">🎨</span>
                <h1 className="text-4xl font-bold">
                  Learning Avatars Generator
                </h1>
              </div>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                Unleash your creativity! Discover your unique learning avatar based on your personality ✨
              </p>
            </div>
          </div>

          {/* Name Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Sparkles size={24} />
                Enter Your Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your name... (e.g., Omar, Sara, Ali)"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (e.target.value.trim()) {
                      setIsRandomMode(false);
                      setShowAvatar(true);
                    }
                  }}
                  className="flex-1 text-lg"
                  data-testid="input-student-name"
                />
                <Button 
                  onClick={generateAvatar}
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                  data-testid="button-generate-avatar"
                >
                  <Sparkles className="mr-2" size={16} />
                  Generate
                </Button>
                <Button 
                  onClick={randomizeAvatar}
                  variant="outline"
                  className="border-violet-500 text-violet-600 hover:bg-violet-500 hover:text-white"
                  data-testid="button-random-avatar"
                >
                  <Shuffle className="mr-2" size={16} />
                  Random
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Avatar */}
          {showAvatar && studentName.trim() && (
            <Card className={`mb-8 ${currentAvatar.color} border-2`}>
              <CardHeader>
                <CardTitle className="text-center">
                  Your Personal Learning Avatar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  {/* Avatar Display */}
                  <div className="relative">
                    <div className="text-9xl mb-4 animate-bounce-in">
                      {currentAvatar.emoji}
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-eduverse-blue text-white">
                        {studentName}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Avatar Info */}
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-gray-800">
                      {currentAvatar.title}
                    </h3>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                      {currentAvatar.description}
                    </p>
                    
                    {/* Traits */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentAvatar.traits.map((trait) => (
                        <Badge 
                          key={trait} 
                          variant="outline" 
                          className="border-eduverse-blue text-eduverse-blue"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="bg-eduverse-gold text-black hover:bg-yellow-500 px-8"
                    data-testid="button-save-avatar"
                  >
                    <Download className="mr-2" size={16} />
                    Save My Avatar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Example Avatars */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-eduverse-blue">
                Example Avatars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exampleNames.map((example) => (
                  <div key={example.name} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl mb-2">{getAvatarForName(example.name).emoji}</div>
                    <div className="font-semibold text-eduverse-blue">{example.name}</div>
                    <div className="text-xs text-gray-500">{example.avatar}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Available Avatars */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-eduverse-blue">
                All Available Avatars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {avatarTypes.map((avatar, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg text-center border-2 ${avatar.color} hover:scale-105 transition-transform cursor-pointer`}
                    onClick={() => {
                      setStudentName(`Demo User ${index + 1}`);
                      setShowAvatar(true);
                    }}
                    data-testid={`avatar-option-${index}`}
                  >
                    <div className="text-4xl mb-2">{avatar.emoji}</div>
                    <div className="font-semibold text-sm text-gray-800">{avatar.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {avatar.traits[0]}, {avatar.traits[1]}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-eduverse-blue to-eduverse-gold text-white">
              <CardContent className="py-6">
                <h3 className="text-xl font-bold mb-4">🎯 How Avatar Assignment Works</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="text-left">
                    <h4 className="font-semibold mb-2">📝 Special Names:</h4>
                    <ul className="space-y-1">
                      <li>• Omar → 🧑‍🚀 Astronaut Explorer</li>
                      <li>• Sara → 🧙‍♀️ Knowledge Wizard</li>
                      <li>• Ali → 🦸‍♂️ Study Superhero</li>
                      <li>• Ahmed → 🧑‍🔬 Science Pioneer</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold mb-2">🧮 Algorithm:</h4>
                    <ul className="space-y-1">
                      <li>• Analyzes name characteristics</li>
                      <li>• Assigns based on letter patterns</li>
                      <li>• Each name gets unique traits</li>
                      <li>• Reflects learning personality!</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}