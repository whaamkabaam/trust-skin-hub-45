import { ArrowRight, Shield, Clock, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="CS2 Skins Trading Platform"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find the best Mystery Box Sites, Online Casinos and CSGO Betting Sites
          </h1>

          {/* Value Proposition */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            Compare operators, analyze cases, and make informed decisions with our 
            trust-first analysis and community reviews.
          </p>

          {/* Gaming Hubs CTAs - Playful Card Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-center mb-12 max-w-6xl mx-auto">
            <div className="group cursor-pointer">
              <Link to="/casinos" className="block">
                <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 min-h-[120px] md:min-h-[140px] bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 transform transition-all duration-300 hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <div className="text-3xl md:text-4xl mb-3 transform transition-transform group-hover:scale-110">🎰</div>
                    <span className="text-lg md:text-xl font-bold text-center">Casinos</span>
                    <span className="text-xs md:text-sm opacity-90 mt-1">Best Bonuses</span>
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </Link>
            </div>
            
            <div className="group cursor-pointer">
              <Link to="/esports" className="block">
                <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 min-h-[120px] md:min-h-[140px] bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 transform transition-all duration-300 hover:scale-105 hover:-rotate-1 shadow-lg hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <div className="text-3xl md:text-4xl mb-3 transform transition-transform group-hover:scale-110">🏆</div>
                    <span className="text-lg md:text-xl font-bold text-center">eSports</span>
                    <span className="text-xs md:text-sm opacity-90 mt-1">Live Betting</span>
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                </div>
              </Link>
            </div>
            
            <div className="group cursor-pointer">
              <Link to="/cases" className="block">
                <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 min-h-[120px] md:min-h-[140px] bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 transform transition-all duration-300 hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <div className="text-3xl md:text-4xl mb-3 transform transition-transform group-hover:scale-110">📦</div>
                    <span className="text-lg md:text-xl font-bold text-center">Cases</span>
                    <span className="text-xs md:text-sm opacity-90 mt-1">Open & Win</span>
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </Link>
            </div>
            
            <div className="group cursor-pointer">
              <Link to="/mystery-boxes" className="block">
                <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 min-h-[120px] md:min-h-[140px] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 transform transition-all duration-300 hover:scale-105 hover:-rotate-1 shadow-lg hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <div className="text-3xl md:text-4xl mb-3 transform transition-transform group-hover:scale-110">🎁</div>
                    <span className="text-lg md:text-xl font-bold text-center">Mystery Boxes</span>
                    <span className="text-xs md:text-sm opacity-90 mt-1">Unbox Skins</span>
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </Link>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8">
            <Link 
              to="/methodology" 
              className="flex items-center justify-center space-x-2 text-white/80 hover:text-white transition-colors group"
            >
              <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">How we rate</span>
            </Link>
            <Link 
              to="/editorial-policy" 
              className="flex items-center justify-center space-x-2 text-white/80 hover:text-white transition-colors group"
            >
              <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Editorial policy</span>
            </Link>
            <Link 
              to="/affiliate-disclosure" 
              className="flex items-center justify-center space-x-2 text-white/80 hover:text-white transition-colors group"
            >
              <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Affiliate disclosure</span>
            </Link>
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Updated daily</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-white/90">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
              <strong className="font-semibold">50+</strong> operators reviewed
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
              <strong className="font-semibold">4.2★</strong> average Trust score
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
              <strong className="font-semibold">99.8%</strong> platform uptime
            </Badge>
          </div>
        </div>
      </div>

      {/* Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;