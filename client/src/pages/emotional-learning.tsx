import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Smile, Frown, AlertTriangle, Star, RefreshCw } from "lucide-react";

interface EmotionState {
  emotion: string;
  emoji: string;
  color: string;
  message: string;
  tips: string[];
  bgGradient: string;
}

const emotions: Record<string, EmotionState> = {
  happy: {
    emotion: "Happy",
    emoji: "😊",
    color: "text-green-600",
    message: "🎉 Amazing! Your positive energy is fantastic for learning!",
    tips: [
      "✨ Keep this great mood going - you're ready to tackle any subject!",
      "🚀 This is perfect time for creative projects and brainstorming",
      "📚 Try learning something completely new today",
      "🤝 Share your enthusiasm - help a classmate with their studies!"
    ],
    bgGradient: "from-green-100 to-emerald-100"
  },
  excited: {
    emotion: "Excited",
    emoji: "🤩",
    color: "text-yellow-600",
    message: "🔥 Your excitement is contagious! Channel this energy into learning!",
    tips: [
      "⚡ Perfect time for challenging subjects like math or science",
      "🎯 Set ambitious learning goals - you can achieve them!",
      "💡 Start that project you've been thinking about",
      "🌟 Your enthusiasm will inspire your classmates!"
    ],
    bgGradient: "from-yellow-100 to-orange-100"
  },
  calm: {
    emotion: "Calm",
    emoji: "😌",
    color: "text-blue-600",
    message: "🧘‍♀️ Your calm mind is perfect for focused learning!",
    tips: [
      "📖 Great time for deep reading and comprehension",
      "🔍 Perfect for detailed research and analysis",
      "✍️ Ideal for writing essays and creative work",
      "🎧 Try meditation or soft music while studying"
    ],
    bgGradient: "from-blue-100 to-cyan-100"
  },
  stressed: {
    emotion: "Stressed",
    emoji: "😰",
    color: "text-red-600",
    message: "💙 Take a deep breath. You've got this! Let's reduce that stress.",
    tips: [
      "🌬️ Try 5 deep breaths - inhale for 4, hold for 4, exhale for 6",
      "🚶‍♀️ Take a 10-minute walk or do light stretching",
      "📝 Break large tasks into smaller, manageable steps",
      "🗣️ Talk to a teacher, friend, or family member about what's worrying you",
      "💧 Stay hydrated and take regular breaks",
      "🎵 Listen to calming music or nature sounds"
    ],
    bgGradient: "from-red-100 to-pink-100"
  },
  tired: {
    emotion: "Tired",
    emoji: "😴",
    color: "text-purple-600",
    message: "💤 Your brain needs rest to learn effectively. Let's recharge!",
    tips: [
      "⏰ Take a 15-20 minute power nap if possible",
      "💧 Drink water - dehydration causes fatigue",
      "🚶‍♂️ Get some fresh air and light exercise",
      "🍎 Have a healthy snack - fruits or nuts work great",
      "📚 Switch to easier subjects or review material",
      "🛏️ Plan for 7-9 hours of sleep tonight"
    ],
    bgGradient: "from-purple-100 to-indigo-100"
  },
  confused: {
    emotion: "Confused",
    emoji: "🤔",
    color: "text-gray-600",
    message: "🤝 Confusion is part of learning! Let's clear things up together.",
    tips: [
      "❓ Write down exactly what you don't understand",
      "🔄 Try explaining the concept to someone else",
      "📹 Look for videos or different explanations online",
      "👥 Form a study group with classmates",
      "🏫 Ask your teacher during office hours",
      "📖 Break the topic into smaller, simpler parts"
    ],
    bgGradient: "from-gray-100 to-slate-100"
  }
};

export default function EmotionalLearning() {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>(emotions.happy);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const detectEmotion = () => {
    setIsAnalyzing(true);
    setShowTips(false);
    
    // Simulate emotion detection with random selection for demo
    setTimeout(() => {
      const emotionKeys = Object.keys(emotions);
      const randomEmotion = emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
      setCurrentEmotion(emotions[randomEmotion]);
      setIsAnalyzing(false);
      setShowTips(true);
    }, 2000);
  };

  const selectEmotion = (emotionKey: string) => {
    setCurrentEmotion(emotions[emotionKey]);
    setShowTips(true);
  };

  useEffect(() => {
    // Auto-detect on component mount
    detectEmotion();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-eduverse-light via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="text-eduverse-blue" size={40} />
              <h1 className="text-4xl font-bold text-gray-800">
                Emotional Learning Assistant
              </h1>
            </div>
            <p className="text-xl text-eduverse-gray">
              Your emotions affect how you learn. Let's optimize your study experience! 💝📚
            </p>
          </div>

          {/* Emotion Detection Card */}
          <Card className={`mb-8 bg-gradient-to-r ${currentEmotion.bgGradient} border-2 border-eduverse-blue`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="text-eduverse-blue" size={32} />
                  <span>Emotion Detection</span>
                </div>
                <Button 
                  onClick={detectEmotion}
                  disabled={isAnalyzing}
                  className="bg-eduverse-blue hover:bg-eduverse-dark"
                  data-testid="button-detect-emotion"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="animate-spin mr-2" size={16} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2" size={16} />
                      Detect My Emotion
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4 animate-pulse">🧠</div>
                  <p className="text-lg text-gray-600">
                    Analyzing your emotional state...
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-4">{currentEmotion.emoji}</div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge className={`text-lg px-4 py-2 ${currentEmotion.color} bg-white`}>
                      You seem {currentEmotion.emotion}
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {currentEmotion.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Tips */}
          {showTips && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eduverse-blue">
                  <Star size={24} />
                  Personalized Learning Tips for {currentEmotion.emotion} Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentEmotion.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-eduverse-blue font-bold text-sm">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 flex-1">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Emotion Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Or Choose Your Current Emotion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(emotions).map(([key, emotion]) => (
                  <Button
                    key={key}
                    variant="outline"
                    onClick={() => selectEmotion(key)}
                    className={`p-6 h-auto flex flex-col gap-2 hover:scale-105 transition-transform ${
                      currentEmotion.emotion === emotion.emotion 
                        ? 'border-eduverse-blue bg-eduverse-light' 
                        : ''
                    }`}
                    data-testid={`button-emotion-${key}`}
                  >
                    <span className="text-3xl">{emotion.emoji}</span>
                    <span className="font-semibold">{emotion.emotion}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Example Usage */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Smile size={24} />
                  Example: Happy Student
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-blue-700">
                  <div><strong>Detected:</strong> 😊 Happy</div>
                  <div><strong>Message:</strong> "Amazing energy for learning!"</div>
                  <div><strong>Tip:</strong> "Perfect time for creative projects!"</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle size={24} />
                  Example: Stressed Student
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-red-700">
                  <div><strong>Detected:</strong> 😰 Stressed</div>
                  <div><strong>Message:</strong> "Take a deep breath. You've got this!"</div>
                  <div><strong>Tip:</strong> "Try 5 deep breaths and break tasks into smaller steps"</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}