import { Clock, ArrowRight, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const NewsAndBlogs = () => {
  const newsArticles = [
    {
      id: 1,
      category: "Market Updates",
      categoryColor: "bg-gaming-orange/10 text-gaming-orange",
      title: "Major CS2 Skin Market Crash: AK-47 Redline Drops 40%",
      author: "Sarah Chen",
      authorAvatar: "/api/placeholder/32/32",
      readTime: "4 min read",
      date: "Jan 15, 2025",
      image: "/api/placeholder/200/120"
    },
    {
      id: 2,
      category: "Site Reviews", 
      categoryColor: "bg-gaming-blue/10 text-gaming-blue",
      title: "New Mystery Box Site 'UnboxKings' Launches with Exclusive CS2 Cases",
      author: "Marcus Rodriguez",
      authorAvatar: "/api/placeholder/32/32", 
      readTime: "3 min read",
      date: "Jan 14, 2025",
      image: "/api/placeholder/200/120"
    },
    {
      id: 3,
      category: "Industry News",
      categoryColor: "bg-gaming-purple/10 text-gaming-purple", 
      title: "Valve Announces New Anti-Fraud Measures for CS2 Trading",
      author: "Elena Petrov",
      authorAvatar: "/api/placeholder/32/32",
      readTime: "5 min read", 
      date: "Jan 13, 2025",
      image: "/api/placeholder/200/120"
    }
  ];

  const blogs = [
    {
      title: "CS2 Trading Hub",
      description: "Your ultimate source for CS2 skin trading news, market analysis, and insider tips from veteran traders.",
      author: "Trading Team",
      role: "Market Analysts", 
      image: "/api/placeholder/150/100",
      gradient: "from-gaming-orange via-gaming-red to-gaming-pink",
      link: "/blog/trading-hub"
    },
    {
      title: "Unboxing Central", 
      description: "Deep dives into mystery box mechanics, case opening strategies, and the latest unboxing trends.",
      author: "Unbox Squad",
      role: "Gaming Experts",
      image: "/api/placeholder/150/100", 
      gradient: "from-gaming-blue via-gaming-purple to-gaming-cyan",
      link: "/blog/unboxing-central"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The home of news and commentary from{' '}
            <span className="bg-gradient-to-r from-gaming-orange via-gaming-red to-gaming-pink bg-clip-text text-transparent">
              gaming insiders
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Read today's breaking stories</h3>
              <Button variant="ghost" className="text-gaming-blue hover:text-gaming-blue/80">
                Visit Gaming News <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-6">
              {newsArticles.map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-gaming-purple/30 hover:border-l-gaming-purple">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-6">
                      <div className="flex-shrink-0">
                        <img 
                          src={article.image}
                          alt={article.title}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={article.categoryColor}>
                            {article.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{article.date}</span>
                        </div>
                        
                        <h4 className="font-semibold text-lg mb-3 group-hover:text-gaming-purple transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <img 
                              src={article.authorAvatar}
                              alt={article.author}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Blog Discovery Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gaming-purple via-gaming-pink to-gaming-blue rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-6">Discover our blogs</h3>
              
              <div className="space-y-6">
                {blogs.map((blog, index) => (
                  <div key={index} className="group">
                    <div className="flex gap-4 mb-4">
                      <img 
                        src={blog.image}
                        alt={blog.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{blog.title}</h4>
                        <p className="text-sm text-white/90 mb-2 line-clamp-2">
                          {blog.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-2 h-2" />
                          </div>
                          <span>{blog.author}</span>
                          <span>•</span>
                          <span>{blog.role}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 group-hover:scale-105 transition-all"
                      asChild
                    >
                      <a href={blog.link}>
                        Visit {blog.title.split(' ')[0]} Blog <ArrowRight className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                    
                    {index < blogs.length - 1 && <div className="h-px bg-white/20 my-6" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsAndBlogs;