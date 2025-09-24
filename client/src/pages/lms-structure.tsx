import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  Trophy, 
  Target, 
  TrendingUp, 
  BookOpen,
  Award,
  Calendar,
  Users
} from "lucide-react";

interface Subject {
  name: string;
  grade: number;
  maxGrade: number;
  progress: number;
  emoji: string;
  color: string;
  assignments: number;
  completedAssignments: number;
}

interface Student {
  name: string;
  avatar: string;
  id: string;
  overallGrade: number;
  subjects: Subject[];
  rank: number;
  totalStudents: number;
}

const studentData: Student = {
  name: "Ahmad Hassan",
  avatar: "🎓",
  id: "ST2025001",
  overallGrade: 87.5,
  rank: 12,
  totalStudents: 150,
  subjects: [
    {
      name: "Mathematics",
      grade: 92,
      maxGrade: 100,
      progress: 85,
      emoji: "🧮",
      color: "bg-blue-500",
      assignments: 12,
      completedAssignments: 10
    },
    {
      name: "Science",
      grade: 88,
      maxGrade: 100,
      progress: 78,
      emoji: "🔬", 
      color: "bg-green-500",
      assignments: 10,
      completedAssignments: 8
    },
    {
      name: "English",
      grade: 85,
      maxGrade: 100,
      progress: 90,
      emoji: "📚",
      color: "bg-purple-500",
      assignments: 15,
      completedAssignments: 14
    },
    {
      name: "History",
      grade: 90,
      maxGrade: 100,
      progress: 95,
      emoji: "🏛️",
      color: "bg-orange-500",
      assignments: 8,
      completedAssignments: 8
    },
    {
      name: "Art",
      grade: 86,
      maxGrade: 100,
      progress: 70,
      emoji: "🎨",
      color: "bg-pink-500",
      assignments: 6,
      completedAssignments: 4
    }
  ]
};

const exampleStudents = [
  { name: "Sarah Ahmed", grade: 94, avatar: "👩‍🎓", rank: 1 },
  { name: "Omar Khalil", grade: 91, avatar: "👨‍🎓", rank: 2 },
  { name: "Layla Hassan", grade: 89, avatar: "👩‍💻", rank: 3 },
  { name: "Ahmad Hassan", grade: 87.5, avatar: "🎓", rank: 12 }
];

export default function LMSStructure() {
  const [selectedStudent] = useState<Student>(studentData);
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'achievements' | 'analytics'>('overview');

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 bg-green-50";
    if (grade >= 80) return "text-blue-600 bg-blue-50";
    if (grade >= 70) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 95) return "A+";
    if (grade >= 90) return "A";
    if (grade >= 85) return "B+";
    if (grade >= 80) return "B";
    if (grade >= 75) return "C+";
    if (grade >= 70) return "C";
    return "D";
  };

  const getPerformanceMessage = (grade: number) => {
    if (grade >= 90) return "🌟 Outstanding Performance!";
    if (grade >= 80) return "👍 Great Work!";
    if (grade >= 70) return "📈 Good Progress!";
    return "💪 Keep Improving!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with floating effect */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <TrendingUp className="text-white" size={32} />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Progress Dashboard
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your personalized learning journey with real-time insights and achievements! 🚀
            </p>
          </div>
          
          {/* Modern Tab Navigation */}
          <div className="flex justify-center mt-6">
            <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/30">
              {[
                { key: 'overview', label: 'Overview', icon: Target },
                { key: 'subjects', label: 'Subjects', icon: BookOpen },
                { key: 'achievements', label: 'Achievements', icon: Trophy },
                { key: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-white/50'
                  }`}
                  data-testid={`tab-${key}`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Render content based on active tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Modern Student Overview Card */}
              <Card className="mb-8 relative overflow-hidden border-0 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/5 to-indigo-700/10 opacity-50"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-lg"></div>
                        <Avatar className="w-20 h-20 bg-white/10 border-3 border-white/30 backdrop-blur-sm relative z-10">
                          <AvatarFallback className="text-3xl bg-gradient-to-br from-white to-blue-100 text-blue-600">
                            {selectedStudent.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-white">
                        <CardTitle className="text-3xl font-bold mb-1">{selectedStudent.name}</CardTitle>
                        <p className="text-white/80 text-lg">Student ID: {selectedStudent.id}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                            <Trophy size={14} />
                            <span>Rank #{selectedStudent.rank}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                            <Users size={14} />
                            <span>of {selectedStudent.totalStudents}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-white">
                      <div className="flex flex-col items-end">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl px-8 py-6 border border-white/20">
                            <div className="text-7xl font-bold mb-2 bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent">
                              {selectedStudent.overallGrade}%
                            </div>
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-4 py-2 text-lg border-0">
                              {getGradeLetter(selectedStudent.overallGrade)} Grade
                            </Badge>
                          </div>
                        </div>
                        <div className="text-white/90 text-lg font-medium">
                          {getPerformanceMessage(selectedStudent.overallGrade)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 text-white">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">{getGradeLetter(selectedStudent.overallGrade)}</div>
                      <p className="text-white/80 text-sm">Letter Grade</p>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">#{selectedStudent.rank}</div>
                      <p className="text-white/80 text-sm">Class Rank</p>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">{selectedStudent.subjects.length}</div>
                      <p className="text-white/80 text-sm">Subjects</p>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">
                        {selectedStudent.subjects.reduce((acc, subject) => acc + subject.completedAssignments, 0)}
                      </div>
                      <p className="text-white/80 text-sm">Completed Tasks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subject Progress Cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="text-eduverse-blue" />
              Subject Progress
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedStudent.subjects.map((subject) => (
                <Card key={subject.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{subject.emoji}</span>
                        <span className="text-lg">{subject.name}</span>
                      </div>
                      <Badge className={`${getGradeColor(subject.grade)} border-0`}>
                        {subject.grade}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Grade Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Grade Progress</span>
                        <span className="font-medium">{subject.grade}/{subject.maxGrade}</span>
                      </div>
                      <Progress value={subject.grade} className="h-2" />
                    </div>
                    
                    {/* Assignment Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Assignments</span>
                        <span className="font-medium">
                          {subject.completedAssignments}/{subject.assignments}
                        </span>
                      </div>
                      <Progress 
                        value={(subject.completedAssignments / subject.assignments) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* Subject Stats */}
                    <div className="grid grid-cols-2 gap-2 text-center text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-bold text-eduverse-blue">
                          {getGradeLetter(subject.grade)}
                        </div>
                        <div className="text-gray-500">Letter</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-bold text-eduverse-blue">
                          {subject.progress}%
                        </div>
                        <div className="text-gray-500">Complete</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Overall Progress Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eduverse-blue">
                  <Target size={24} />
                  Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{selectedStudent.overallGrade >= 90 ? "🏆" : selectedStudent.overallGrade >= 80 ? "🥇" : "📈"}</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {getPerformanceMessage(selectedStudent.overallGrade)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Overall Progress</span>
                    <span className="font-bold">{selectedStudent.overallGrade}%</span>
                  </div>
                  <Progress value={selectedStudent.overallGrade} className="h-3" />
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Strongest Subject:</span>
                        <span className="font-medium text-eduverse-blue">
                          Mathematics (92%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Focus Area:</span>
                        <span className="font-medium text-orange-600">
                          Art (86%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-eduverse-blue">
                  <TrendingUp size={24} />
                  Class Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exampleStudents.map((student, index) => (
                    <div 
                      key={student.name}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        student.name === selectedStudent.name 
                          ? 'bg-eduverse-light border border-eduverse-blue' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          student.rank <= 3 ? 'bg-eduverse-gold' : 'bg-gray-400'
                        }`}>
                          {student.rank}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.avatar}</div>
                        </div>
                      </div>
                      <Badge className={getGradeColor(student.grade)}>
                        {student.grade}%
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-sm text-gray-600">
                    Ranked <span className="font-bold text-eduverse-blue">#{selectedStudent.rank}</span> out of{" "}
                    <span className="font-bold">{selectedStudent.totalStudents}</span> students
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Example Usage */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Award size={24} />
                📊 Example: Student Progress Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-bold text-green-800 mb-2">📈 Grades Overview:</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Math: 92% (A-)</li>
                    <li>• Science: 88% (B+)</li>  
                    <li>• English: 85% (B+)</li>
                    <li>• Overall: 87.5% (B+)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-blue-800 mb-2">🎯 Progress Status:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Class Rank: #12 of 150</li>
                    <li>• Assignments: 44/46 completed</li>
                    <li>• Strong in: Mathematics</li>
                    <li>• Focus on: Art projects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-purple-800 mb-2">🏆 Achievements:</h4>
                  <ul className="space-y-1 text-purple-700">
                    <li>• Top 10% in Math</li>
                    <li>• Perfect History scores</li>
                    <li>• 95% assignment completion</li>
                    <li>• Honor roll candidate</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}