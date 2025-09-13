import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Info, Sparkles, RotateCcw } from "lucide-react";

interface Planet {
  id: string;
  name: string;
  emoji: string;
  color: string;
  size: number;
  distance: number;
  info: {
    type: string;
    diameter: string;
    temperature: string;
    funFact: string;
  };
}

const planets: Planet[] = [
  {
    id: "sun",
    name: "Sun",
    emoji: "☀️",
    color: "bg-yellow-400",
    size: 80,
    distance: 0,
    info: {
      type: "Star",
      diameter: "1.39 million km",
      temperature: "5,778K (surface)",
      funFact: "The Sun is so big, about 1.3 million Earths could fit inside it!"
    }
  },
  {
    id: "mercury",
    name: "Mercury",
    emoji: "🪐",
    color: "bg-gray-400",
    size: 20,
    distance: 120,
    info: {
      type: "Rocky Planet",
      diameter: "4,879 km",
      temperature: "427°C (day), -173°C (night)",
      funFact: "Mercury has no atmosphere and extreme temperature swings!"
    }
  },
  {
    id: "venus",
    name: "Venus",
    emoji: "🌕",
    color: "bg-orange-300",
    size: 25,
    distance: 160,
    info: {
      type: "Rocky Planet",
      diameter: "12,104 km", 
      temperature: "462°C (hottest planet)",
      funFact: "Venus rotates backwards compared to most planets!"
    }
  },
  {
    id: "earth",
    name: "Earth",
    emoji: "🌍",
    color: "bg-blue-400",
    size: 26,
    distance: 200,
    info: {
      type: "Rocky Planet",
      diameter: "12,756 km",
      temperature: "15°C average",
      funFact: "The only known planet with life! 71% of surface is water."
    }
  },
  {
    id: "mars",
    name: "Mars",
    emoji: "🔴",
    color: "bg-red-400",
    size: 22,
    distance: 240,
    info: {
      type: "Rocky Planet",
      diameter: "6,792 km",
      temperature: "-65°C average",
      funFact: "Mars has the largest volcano in the solar system - Olympus Mons!"
    }
  },
  {
    id: "jupiter",
    name: "Jupiter",
    emoji: "🪐",
    color: "bg-orange-500",
    size: 60,
    distance: 320,
    info: {
      type: "Gas Giant",
      diameter: "142,984 km",
      temperature: "-110°C",
      funFact: "Jupiter is so massive it could contain all other planets combined!"
    }
  },
  {
    id: "saturn",
    name: "Saturn",
    emoji: "🪐",
    color: "bg-yellow-600",
    size: 50,
    distance: 400,
    info: {
      type: "Gas Giant",
      diameter: "120,536 km",
      temperature: "-140°C",
      funFact: "Saturn's rings are made of ice and rock particles!"
    }
  }
];

export default function ARLearning() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(planet);
  };

  const resetView = () => {
    setSelectedPlanet(null);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white overflow-hidden">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="text-eduverse-gold" size={40} />
            <h1 className="text-4xl font-bold">
              AR Solar System Explorer
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Tap any planet to discover amazing facts! 🚀✨
          </p>
          
          {/* Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              onClick={toggleAnimation}
              variant="outline" 
              className="border-eduverse-gold text-eduverse-gold hover:bg-eduverse-gold hover:text-black"
              data-testid="button-animation"
            >
              <RotateCcw size={16} className="mr-2" />
              {isAnimating ? "Pause Orbits" : "Start Orbits"}
            </Button>
            <Button 
              onClick={resetView}
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
              data-testid="button-reset"
            >
              <Sparkles size={16} className="mr-2" />
              Reset View
            </Button>
          </div>
        </div>

        {/* Solar System Visualization */}
        <div className="relative w-full h-96 mx-auto mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 to-black border border-gray-700">
          {/* Orbital Paths */}
          {planets.slice(1).map((planet) => (
            <div
              key={`orbit-${planet.id}`}
              className="absolute border border-gray-600 rounded-full opacity-30"
              style={{
                width: `${planet.distance * 2}px`,
                height: `${planet.distance * 2}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
          ))}
          
          {/* Planets */}
          {planets.map((planet, index) => {
            const angle = isAnimating ? (Date.now() / (1000 + index * 200)) % (2 * Math.PI) : 0;
            const x = planet.distance * Math.cos(angle);
            const y = planet.distance * Math.sin(angle);
            
            return (
              <div
                key={planet.id}
                className={`absolute cursor-pointer transform transition-all duration-300 hover:scale-125 ${
                  selectedPlanet?.id === planet.id ? "scale-150 z-10" : ""
                }`}
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
                }}
                onClick={() => handlePlanetClick(planet)}
                data-testid={`planet-${planet.id}`}
              >
                <div
                  className={`w-full h-full rounded-full ${planet.color} flex items-center justify-center text-lg shadow-lg animate-pulse`}
                  style={{ fontSize: `${planet.size / 4}px` }}
                >
                  {planet.emoji}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-center whitespace-nowrap">
                  {planet.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Planet Information Panel */}
        {selectedPlanet ? (
          <Card className="bg-gray-900 border-eduverse-gold text-white max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-eduverse-gold">
                <span className="text-3xl">{selectedPlanet.emoji}</span>
                <div>
                  <h3 className="text-2xl font-bold">{selectedPlanet.name}</h3>
                  <Badge className="bg-eduverse-gold text-black mt-1">
                    {selectedPlanet.info.type}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400">Diameter</div>
                  <div className="font-bold text-blue-400">{selectedPlanet.info.diameter}</div>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400">Temperature</div>
                  <div className="font-bold text-red-400">{selectedPlanet.info.temperature}</div>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400">Distance from Sun</div>
                  <div className="font-bold text-green-400">{selectedPlanet.distance}px</div>
                </div>
              </div>
              
              <div className="p-4 bg-eduverse-blue bg-opacity-20 rounded-lg border border-eduverse-gold">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="text-eduverse-gold" size={20} />
                  <span className="font-semibold text-eduverse-gold">Amazing Fact!</span>
                </div>
                <p className="text-gray-200">{selectedPlanet.info.funFact}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-900 border-gray-700 text-white max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🪐</div>
              <h3 className="text-xl font-bold mb-2">Explore the Solar System!</h3>
              <p className="text-gray-400">
                Click on any planet to learn fascinating facts about it.
                Watch the planets orbit around the sun!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Example Usage */}
        <div className="mt-8 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-800 to-blue-800 border-0 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-eduverse-gold" />
                How AR Learning Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-eduverse-gold mb-2">🎯 Interactive Exploration</h4>
                  <ul className="space-y-1 text-gray-200 text-sm">
                    <li>• Tap planets to see detailed information</li>
                    <li>• Watch realistic orbital movements</li>
                    <li>• Learn size comparisons visually</li>
                    <li>• Discover amazing space facts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-eduverse-gold mb-2">🚀 Example: Mars</h4>
                  <p className="text-gray-200 text-sm">
                    "Tap on Mars 🔴 → See it's the 'Red Planet' → Learn about Olympus Mons, 
                    the largest volcano in our solar system! Temperature: -65°C average."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}