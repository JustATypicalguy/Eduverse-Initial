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
    <div className="pt-24 min-h-screen bg-gradient-to-br from-eduverse-light via-white to-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="text-eduverse-blue" size={40} />
              <h1 className="text-4xl font-bold text-gray-800">
                LMS Progress Tracker
              </h1>
            </div>
            <p className="text-xl text-eduverse-gray">
              Track academic progress, grades, and achievements in real-time! 📊✨
            </p>
          </div>

          {/* Student Overview Card */}
          <Card className="mb-8 bg-gradient-to-r from-eduverse-blue to-eduverse-gold text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 bg-white border-2 border-white/20">
                    <AvatarFallback className="text-2xl text-eduverse-blue bg-white">
                      {selectedStudent.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{selectedStudent.name}</CardTitle>
                    <p className="text-blue-100">Student ID: {selectedStudent.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{selectedStudent.overallGrade}%</div>
                  <p className="text-blue-100">Overall Grade</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{getGradeLetter(selectedStudent.overallGrade)}</div>
                  <p className="text-blue-100 text-sm">Letter Grade</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">#{selectedStudent.rank}</div>
                  <p className="text-blue-100 text-sm">Class Rank</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedStudent.subjects.length}</div>
                  <p className="text-blue-100 text-sm">Subjects</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {selectedStudent.subjects.reduce((acc, subject) => acc + subject.completedAssignments, 0)}
                  </div>
                  <p className="text-blue-100 text-sm">Completed Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

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