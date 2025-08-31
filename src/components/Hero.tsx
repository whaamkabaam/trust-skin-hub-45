import { ArrowRight, Shield, Clock, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
            Trade CS2 Skins{' '}
            <span className="text-gaming-orange">Securely</span>
            {' '}& Fast
          </h1>

          {/* Value Proposition */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            Compare operators, analyze cases, and make informed decisions with our 
            trust-first analysis and community reviews.
          </p>

          {/* Gaming Hubs CTAs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 justify-center mb-12 max-w-5xl mx-auto">
            <Button 
              size="lg" 
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-3 md:px-4 py-4 md:py-6 text-sm md:text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 min-h-[80px] md:min-h-[100px]"
              asChild
            >
              <a href="/casinos">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <span className="text-xl md:text-2xl">🎰</span>
                  <span className="text-center leading-tight">Casinos</span>
                </div>
              </a>
            </Button>
            <Button 
              size="lg" 
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-3 md:px-4 py-4 md:py-6 text-sm md:text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 min-h-[80px] md:min-h-[100px]"
              asChild
            >
              <a href="/esports">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <span className="text-xl md:text-2xl">🏆</span>
                  <span className="text-center leading-tight">eSports</span>
                </div>
              </a>
            </Button>
            <Button 
              size="lg" 
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-3 md:px-4 py-4 md:py-6 text-sm md:text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 min-h-[80px] md:min-h-[100px]"
              asChild
            >
              <a href="/cases">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <span className="text-xl md:text-2xl">📦</span>
                  <span className="text-center leading-tight">Cases</span>
                </div>
              </a>
            </Button>
            <Button 
              size="lg" 
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-3 md:px-4 py-4 md:py-6 text-sm md:text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 min-h-[80px] md:min-h-[100px]"
              asChild
            >
              <a href="/mystery-boxes">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <span className="text-xl md:text-2xl">🎁</span>
                  <span className="text-center leading-tight">Mystery Boxes</span>
                </div>
              </a>
            </Button>
          </div>

          {/* Trust Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8">
            <a 
              href="/methodology" 
              className="flex items-center justify-center space-x-2 text-white/80 hover:text-white transition-colors group"
            >
              <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">How we rate</span>
            </a>
            <a 
              href="/editorial-policy" 
              className="flex items-center justify-center space-x-2 text-white/80 hover:text-white transition-colors group"
            >
              <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Editorial policy</span>
            </a>
            <a 
              href="/affiliate-disclosure" 
              className="flex items-center justify-center space-x-2 text-white/80 hover:text-white transition-colors group"
            >
              <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Affiliate disclosure</span>
            </a>
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