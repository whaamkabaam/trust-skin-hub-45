import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, ThumbsUp, MessageSquare, Calendar, Shield } from 'lucide-react';

const UserReviews = () => {
  const overallStats = {
    averageRating: 4.6,
    totalReviews: 2847,
    verifiedUsers: 2156,
    responseRate: 96
  };

  const reviews = [
    {
      user: "CryptoTrader_Mike",
      rating: 5,
      verified: true,
      date: "3 days ago",
      title: "Saved me from a scam site",
      content: "Their warnings about SuspiciousSite.com were spot on. I was about to deposit $500 but saw their risk alert first. Turns out the site disappeared a week later. These guys know what they're doing.",
      helpful: 47,
      category: "Site Warning"
    },
    {
      user: "SkinCollector23", 
      rating: 5,
      verified: true,
      date: "1 week ago", 
      title: "Transparent and detailed analysis",
      content: "Love how they break down the actual odds vs advertised odds. Found out my favorite site was inflating their payout rates by 3%. Switched to their top recommendation and my returns improved noticeably.",
      helpful: 32,
      category: "Data Analysis"
    },
    {
      user: "ProGamer_Sarah",
      rating: 4,
      verified: false,
      date: "2 weeks ago",
      title: "Good coverage but could use more operators",
      content: "The analysis is solid and I trust their methodology. Would love to see coverage of some smaller operators too. Their complaint resolution help was amazing when I had issues with a payout.",
      helpful: 28,
      category: "Coverage"
    },
    {
      user: "BlockchainBen",
      rating: 5,
      verified: true,
      date: "3 weeks ago",
      title: "Technical expertise is impressive",
      content: "As someone who works in blockchain security, I'm impressed by their technical analysis. They actually understand provably fair systems and can spot fake implementations. Not just marketing fluff like other review sites.",
      helpful: 41,
      category: "Technical Analysis"
    },
    {
      user: "NewbieBettor",
      rating: 4,
      verified: true,
      date: "1 month ago",
      title: "Helped me understand the risks",
      content: "New to mystery boxes and their beginner guides were incredibly helpful. The risk calculator helped me set proper limits. Customer support helped me recover funds from a dodgy operator.",
      helpful: 19,
      category: "Education"
    },
    {
      user: "DataNerd42",
      rating: 5,
      verified: true,
      date: "1 month ago",
      title: "Love the transparency",
      content: "Finally a review site that shows their methodology and data sources. The fact that they publish negative reviews of their affiliate partners shows real integrity. Keep up the great work!",
      helpful: 55,
      category: "Transparency"
    }
  ];

  const categoryStats = [
    { category: "Site Warnings", count: 892, rating: 4.8 },
    { category: "Data Analysis", count: 645, rating: 4.7 },
    { category: "Technical Analysis", count: 423, rating: 4.9 },
    { category: "Education", count: 556, rating: 4.5 },
    { category: "Transparency", count: 331, rating: 4.8 }
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-2xl font-bold">{overallStats.averageRating}/5</span>
          <span className="text-muted-foreground">
            ({overallStats.totalReviews.toLocaleString()} reviews)
          </span>
        </div>
        <p className="text-muted-foreground">
          {overallStats.verifiedUsers.toLocaleString()} verified users • {overallStats.responseRate}% response rate
        </p>
      </div>

      {/* Review Categories */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {categoryStats.map((category, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <h4 className="font-semibold text-sm mb-2">{category.category}</h4>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{category.rating}</span>
              </div>
              <div className="text-xs text-muted-foreground">{category.count} reviews</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Individual Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {reviews.map((review, index) => (
          <Card key={index} className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {review.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{review.user}</span>
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {review.date}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {review.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 ${
                        star <= review.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{review.title}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{review.content}</p>
              
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Helpful ({review.helpful})
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Indicators */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Review Authenticity</h3>
            <p className="text-muted-foreground">How we ensure review quality and prevent manipulation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-semibold mb-2">Verified Users Only</h4>
              <p className="text-sm text-muted-foreground">
                76% of reviews from verified users with confirmed site usage
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Spam Detection</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered analysis removes fake and incentivized reviews
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">Response Guarantee</h4>
              <p className="text-sm text-muted-foreground">
                We respond to 96% of reviews within 24 hours
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline">
              Leave a Review
            </Button>
            <Button>
              View All Reviews
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default UserReviews;