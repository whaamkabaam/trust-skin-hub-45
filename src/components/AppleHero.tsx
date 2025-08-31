import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Shield, Trophy, Star, Apple, Package, Zap } from 'lucide-react';

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
          <div className="text-center mb-12">
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
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              From iPhone 15 Pro Max to MacBooks, Apple Watch, and AirPods. 
              <span className="text-blue-400 font-medium"> Verified authentic products</span> with 
              <span className="text-green-400 font-medium"> worldwide shipping</span>.
            </p>

            {/* Value Proposition Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-lg font-semibold mb-2">Authentic Products</h3>
                  <p className="text-gray-300 text-sm">All Apple products are brand new, sealed, and come with full warranty</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-lg font-semibold mb-2">Best Odds</h3>
                  <p className="text-gray-300 text-sm">Industry-leading drop rates with transparent probability disclosure</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-semibold mb-2">Global Shipping</h3>
                  <p className="text-gray-300 text-sm">Free worldwide delivery with full insurance and tracking</p>
                </CardContent>
              </Card>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto">
                <Apple className="w-6 h-6 mr-2" />
                Open Apple Boxes
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto">
                View All Products
              </Button>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
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
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default AppleHero;