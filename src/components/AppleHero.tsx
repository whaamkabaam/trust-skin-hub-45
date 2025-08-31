import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, Star, Apple, Package, Zap, Search, TrendingUp, ExternalLink } from 'lucide-react';

const AppleHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
          <Apple className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full backdrop-blur-sm flex items-center justify-center">
          <Package className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 animate-pulse">
        <div className="w-14 h-14 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
          <Zap className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Main Content */}
            <div className="text-left">
              {/* Premium Badge */}
              <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Premium Apple Mystery Boxes
              </Badge>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Unbox the Latest
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  Apple Products
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                From iPhone 15 Pro Max to MacBooks, Apple Watch, and AirPods. 
                <span className="text-blue-400 font-medium"> Verified authentic products</span> with 
                <span className="text-green-400 font-medium"> worldwide shipping</span>.
              </p>

              {/* Search Bar */}
              <div className="mb-12">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    placeholder="Search for iPhone, MacBook, Apple Watch..." 
                    className="pl-12 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">4.8/5</span>
                  <span className="text-gray-400">(2,847 reviews)</span>
                </div>
                <div className="h-6 w-px bg-white/30 hidden md:block" />
                <div className="text-gray-300">
                  <span className="text-2xl font-bold text-white">15,000+</span> Happy Winners
                </div>
                <div className="h-6 w-px bg-white/30 hidden md:block" />
                <div className="text-gray-300">
                  <span className="text-2xl font-bold text-green-400">$2.4M+</span> in Prizes Won
                </div>
              </div>
            </div>

            {/* Right Column - Featured Box */}
            <div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-xs">
                      Staff Pick
                    </Badge>
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    {/* Box Image */}
                    <div className="w-20 h-20 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <Apple className="w-10 h-10 text-blue-400" />
                    </div>
                    
                    {/* Box Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">iPhone 15 Pro Mystery Box</h3>
                      <p className="text-sm text-gray-300 mb-2">
                        Premium Apple mystery box with guaranteed iPhone 15 Pro and exclusive accessories.
                      </p>
                    </div>
                  </div>

                  {/* Jackpot Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-gray-400">Top Jackpot Items</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>iPhone 15 Pro Max 1TB</span>
                        <span className="font-medium text-yellow-400">$1,599</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>AirPods Pro (2nd Gen)</span>
                        <span className="font-medium text-blue-400">$249</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Apple Watch Ultra 2</span>
                        <span className="font-medium text-purple-400">$799</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-xl font-bold">$899</div>
                      <div className="text-xs text-gray-400">Box Price</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-xl font-bold text-green-400">$1,299</div>
                      <div className="text-xs text-gray-400">Expected Value</div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default AppleHero;