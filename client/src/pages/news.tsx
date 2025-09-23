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
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📰 EduVerse News & Updates
            </h1>
            <p className="text-xl text-eduverse-gray max-w-2xl mx-auto">
              Stay informed about the latest happenings, achievements, and important updates from our educational community.
            </p>
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