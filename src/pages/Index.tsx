import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import OperatorCard from '@/components/OperatorCard';
import FilterSort from '@/components/FilterSort';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, Clock, Users, ArrowRight } from 'lucide-react';
import { sampleOperators } from '@/lib/sample-data';
import { cn } from '@/lib/utils';

const Index = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState({
    games: [],
    modes: [],
    paymentMethods: [],
    kycRequired: null,
    verified: false,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Top Operators Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Top CS2 Trading Operators</h2>
              <p className="text-muted-foreground">
                Compare platforms based on trust, fees, and community feedback
              </p>
            </div>
            <Button variant="outline">
              View All Operators
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Filter & Sort Controls */}
          <FilterSort
            view={view}
            onViewChange={setView}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Operators Grid/List */}
          <div className={cn(
            "gap-6",
            view === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "flex flex-col space-y-4"
          )}>
            {sampleOperators.map((operator) => (
              <OperatorCard 
                key={operator.id} 
                operator={operator} 
                view={view}
              />
            ))}
          </div>
        </section>

        {/* Trust & Transparency Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Trust Unpacked.gg?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our analysis combines rigorous testing, community feedback, 
              and transparent methodology to help you make informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Security First</h3>
                <p className="text-sm text-muted-foreground">
                  Every operator undergoes comprehensive security and legitimacy checks.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Data Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Real user reviews, payout testing, and fee analysis inform our ratings.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Always Current</h3>
                <p className="text-sm text-muted-foreground">
                  Daily updates ensure our recommendations reflect latest changes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gaming-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-gaming-blue" />
                </div>
                <h3 className="font-semibold mb-2">Community Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Built by traders, for traders, with transparent editorial policies.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  CS2 Cases
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Analyze case odds, drop tables, and expected returns.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Revolution Case</Badge>
                  <Badge variant="outline">Recoil Case</Badge>
                  <Badge variant="outline">Dreams & Nightmares</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Mystery Boxes
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Third-party boxes with verified odds and fairness ratings.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Knife Boxes</Badge>
                  <Badge variant="outline">Glove Collections</Badge>
                  <Badge variant="outline">Rare Skins</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Trading Guides
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn trading strategies, security best practices, and market analysis.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Beginner Guide</Badge>
                  <Badge variant="outline">Security Tips</Badge>
                  <Badge variant="outline">Market Trends</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
