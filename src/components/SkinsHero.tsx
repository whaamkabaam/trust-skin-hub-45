import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Users, TrendingUp, Clock, CheckCircle2, Star } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const SkinsHero = () => {
  const games = [
    { 
      name: 'Counter-Strike 2', 
      shortName: 'CS2', 
      path: '/cases',
      color: 'from-orange-500 to-red-600',
      icon: '🔫'
    },
    { 
      name: 'Dota 2', 
      shortName: 'Dota2', 
      path: '/cases?game=dota2',
      color: 'from-red-500 to-pink-600',
      icon: '⚔️'
    },
    { 
      name: 'Rust', 
      shortName: 'Rust', 
      path: '/cases?game=rust',
      color: 'from-amber-600 to-orange-700',
      icon: '🔨'
    },
    { 
      name: 'Team Fortress 2', 
      shortName: 'TF2', 
      path: '/cases?game=tf2',
      color: 'from-blue-500 to-purple-600',
      icon: '🎯'
    }
  ];

  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${heroBg})`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Expert Skins Platform
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Reviews & Analysis
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-200">
            5+ years of expert analysis. We test every skins platform with real trades, 
            verify security measures, and provide transparent ratings you can trust.
          </p>

          {/* Game Navigation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 justify-center mb-12 max-w-5xl mx-auto">
            {games.map((game) => (
              <Button 
                key={game.shortName}
                size="lg" 
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-3 md:px-4 py-4 md:py-6 text-sm md:text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 min-h-[80px] md:min-h-[100px]"
                asChild
              >
                <Link to={game.path}>
                  <div className="flex flex-col items-center gap-1 md:gap-2">
                    <span className="text-xl md:text-2xl">{game.icon}</span>
                    <span className="text-center leading-tight">{game.shortName}</span>
                  </div>
                </Link>
              </Button>
            ))}
          </div>

          {/* EEAT Trust Strip */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 text-sm">
            <a 
              href="/methodology/skins-testing" 
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <Shield className="w-4 h-4" />
              How we test skins platforms
            </a>
            <a 
              href="/guides/skins-safety" 
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Skins trading safety guide
            </a>
            <a 
              href="/methodology/verification" 
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <Users className="w-4 h-4" />
              Platform verification process
            </a>
            <div className="flex items-center gap-2 text-green-400">
              <Clock className="w-4 h-4" />
              Updated hourly
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Badge variant="outline" className="bg-white/10 border-white/30 text-white px-4 py-2 text-base backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              47 Skins Platforms Reviewed
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/30 text-white px-4 py-2 text-base backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2" />
              4.2 Avg Platform Rating
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/30 text-white px-4 py-2 text-base backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              $2.4M+ Skins Value Tracked
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkinsHero;