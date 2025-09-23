import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, Clock, Eye, MessageCircle, Search, 
  ChevronRight, Pin, User, BookOpen, Trophy, 
  GraduationCap, Heart
} from "lucide-react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import type { NewsArticle } from "@shared/schema";

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: articles, isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
  });

  const categories = [
    { id: "all", name: "All News", icon: BookOpen, color: "bg-blue-500" },
    { id: "general", name: "General", icon: MessageCircle, color: "bg-gray-500" },
    { id: "academic", name: "Academic", icon: GraduationCap, color: "bg-green-500" },
    { id: "sports", name: "Sports", icon: Trophy, color: "bg-yellow-500" },
    { id: "achievements", name: "Achievements", icon: Heart, color: "bg-red-500" },
  ];

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    let filtered = articles;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      // Sort by pinned status first, then by publication date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
    });
  }, [articles, selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eduverse-light via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eduverse-blue mx-auto mb-4"></div>
          <p className="text-eduverse-gray">Loading news articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eduverse-light via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-12">
          {/* Creative Header Section */}
          <div className="relative text-center mb-12">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -top-5 -right-10 w-24 h-24 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute -bottom-5 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-40 animate-ping"></div>
            </div>
            
            {/* Main Title */}
            <div className="relative z-10 mb-8">
              <div className="inline-flex items-center justify-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-4xl">📰</span>
                </div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  EduVerse News Hub
                </h1>
                <div className="p-4 bg-gradient-to-r from-pink-500 to-red-600 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-4xl">✨</span>
                </div>
              </div>
              
              {/* Creative Subtitle */}
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl transform rotate-1 opacity-50"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-200">
                  <p className="text-2xl font-medium text-gray-700 leading-relaxed mb-4">
                    🚀 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Stay Connected
                    </span> with the latest happenings, amazing achievements, and exciting updates from our vibrant educational community! 
                  </p>
                  
                  {/* Fun Stats */}
                  <div className="flex justify-center items-center gap-8 text-sm font-semibold">
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Breaking News</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <span>Student Achievements</span>
                    </div>
                    <div className="flex items-center gap-2 text-pink-600">
                      <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <span>Community Updates</span>
                    </div>
                  </div>
                  
                  {/* Animated Quote */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-l-4 border-yellow-500">
                    <p className="text-lg italic text-gray-700 font-medium">
                      💡 "Every story here celebrates the incredible journey of learning and growth at EduVerse!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Action Elements */}
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 hidden lg:block">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <span className="text-white font-bold">📚</span>
              </div>
            </div>
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 hidden lg:block">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{ animationDelay: '0.5s' }}>
                <span className="text-white font-bold">🎓</span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search news articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id 
                        ? `${category.color} text-white` 
                        : 'border-gray-300'
                    }`}
                    data-testid={`filter-${category.id}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </header>
      {/* News Content */}
      <main className="container mx-auto px-6 py-8">
        {filteredArticles?.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No News Found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No articles match your search for "${searchQuery}"`
                : "No news articles available for this category"
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredArticles?.map((article) => (
              <Card 
                key={article.id} 
                className={`hover:shadow-lg transition-shadow ${
                  article.isPinned ? 'border-yellow-300 bg-yellow-50' : ''
                }`}
                data-testid={`article-${article.id}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {article.isPinned && (
                          <Badge className="bg-yellow-500 text-white">
                            <Pin className="h-3 w-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        <Badge 
                          variant="secondary"
                          className={`${
                            categories.find(cat => cat.id === article.category)?.color || 'bg-gray-500'
                          } text-white`}
                        >
                          {categories.find(cat => cat.id === article.category)?.name || article.category}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl font-bold text-gray-900 hover:text-eduverse-blue cursor-pointer">
                        {article.title}
                      </CardTitle>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          EduVerse Staff
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(article.publishedAt || article.createdAt), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(article.publishedAt || article.createdAt), "h:mm a")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views || 0} views
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {article.excerpt || article.content.substring(0, 200) + "..."}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {article.tags && Array.isArray(article.tags) && article.tags.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          {(article.tags as string[]).slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-eduverse-blue hover:text-eduverse-blue hover:bg-eduverse-light"
                      data-testid={`button-read-${article.id}`}
                    >
                      Read More
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}