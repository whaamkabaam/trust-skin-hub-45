import { useState } from 'react';
import { Star, Shield, CheckCircle, Clock, Users, Trophy, Gamepad2, Gift, CreditCard, Lock, ChevronRight, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Hero from '@/components/Hero';
import SkinsHero from '@/components/SkinsHero';
import TrustIndicator from '@/components/TrustIndicator';
import RatingBadge from '@/components/RatingBadge';
import CaseCard from '@/components/CaseCard';
import OperatorCard from '@/components/OperatorCard';
import ReviewCard from '@/components/ReviewCard';
import FilterSort from '@/components/FilterSort';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const StyleGuide = () => {
  const [filterState, setFilterState] = useState({
    view: 'grid' as 'grid' | 'list',
    sortBy: 'rating',
    filters: {
      games: [] as string[],
      modes: [] as string[],
      paymentMethods: [] as string[],
      kycRequired: null as boolean | null,
      verified: false
    }
  });

  const handleViewChange = (view: 'grid' | 'list') => {
    setFilterState(prev => ({ ...prev, view }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilterState(prev => ({ ...prev, sortBy }));
  };

  const handleFiltersChange = (filters: any) => {
    setFilterState(prev => ({ ...prev, filters }));
  };

  // Sample data for components
  const sampleOperator = {
    id: 'csgoroll',
    name: 'CSGORoll',
    logo: '/placeholder.svg',
    verdict: 'Premium CS2 case opening site with verified drops',
    overallRating: 4.5,
    feeLevel: 'Low' as const,
    paymentMethods: ['skins', 'crypto', 'cards'] as ('skins' | 'crypto' | 'cards')[],
    modes: ['Cases', 'Upgrader', 'Roulette', 'Crash'],
    pros: ['Provably Fair', 'Instant Payouts', '24/7 Support', 'Mobile Optimized'],
    cons: ['High minimum deposit', 'Limited game selection'],
    trustScore: 4.2,
    fees: {
      deposit: 0,
      withdrawal: 2.5,
      trading: 1.5
    },
    payoutSpeed: '1-24h',
    kycRequired: true,
    countries: ['US', 'EU', 'CA'],
    url: 'https://csgoroll.com',
    verified: true
  };

  const sampleCase = {
    id: 'dragon-lore-case',
    name: 'Dragon Lore Collection',
    image: '/placeholder.svg',
    game: 'CS2' as const,
    minPrice: 29.99,
    oddsDisclosed: 'Yes' as const,
    verified: true,
    highlights: [
      { name: 'AWP Dragon Lore', icon: '/placeholder.svg', rarity: 'Covert' },
      { name: 'AK-47 Redline', icon: '/placeholder.svg', rarity: 'Classified' },
      { name: 'M4A4 Howl', icon: '/placeholder.svg', rarity: 'Legendary' }
    ],
    stats: {
      openCount: 15420,
      avgReturn: 0.85
    },
    releaseDate: '2024-01-15'
  };

  const sampleReview = {
    id: 'review-1',
    entityId: 'csgoroll',
    entityType: 'operator' as const,
    user: 'GamerPro123',
    verified: 'operator' as const,
    rating: 4.5,
    subscores: {
      trust: 4.8,
      fees: 4.2,
      ux: 4.5,
      support: 4.7
    },
    title: 'Excellent Service Overall',
    body: 'Amazing site with fast payouts and great customer support. The drop rates feel fair and the interface is smooth.',
    helpful: {
      up: 42,
      down: 3
    },
    createdAt: '2024-01-15T10:00:00Z'
  };

  // Sample data for new components
  const stepsData = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your account in under 30 seconds',
      icon: Users
    },
    {
      number: 2,
      title: 'Deposit',
      description: 'Add funds using crypto, cards, or e-wallets',
      icon: CreditCard
    },
    {
      number: 3,
      title: 'Open Cases',
      description: 'Choose from hundreds of cases and start winning',
      icon: Gift
    },
    {
      number: 4,
      title: 'Withdraw',
      description: 'Cash out your winnings instantly',
      icon: CheckCircle
    }
  ];

  const tableData = [
    { site: 'CSGORoll', rating: 4.5, bonus: '$500', payoutTime: '1-24h', established: '2016' },
    { site: 'CSGOEmpire', rating: 4.3, bonus: '$300', payoutTime: '2-48h', established: '2018' },
    { site: 'Hellcase', rating: 4.1, bonus: '$200', payoutTime: '1-12h', established: '2014' },
    { site: 'DatDrop', rating: 4.0, bonus: '$150', payoutTime: '6-24h', established: '2017' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* Page Header */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Design System & Component Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive showcase of all reusable components, typography, and design elements available in our system.
          </p>
        </section>

        {/* Typography Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Typography</h2>
            <p className="text-muted-foreground mb-8">Headings, text styles, and font specifications</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Heading Hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold">Heading 1 - Main Page Title</h1>
                  <code className="text-sm text-muted-foreground">text-4xl font-bold</code>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Heading 2 - Section Title</h2>
                  <code className="text-sm text-muted-foreground">text-3xl font-bold</code>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">Heading 3 - Subsection</h3>
                  <code className="text-sm text-muted-foreground">text-2xl font-semibold</code>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Heading 4 - Card Title</h4>
                  <code className="text-sm text-muted-foreground">text-xl font-semibold</code>
                </div>
                <div>
                  <h5 className="text-lg font-medium">Heading 5 - Component Title</h5>
                  <code className="text-sm text-muted-foreground">text-lg font-medium</code>
                </div>
                <div>
                  <h6 className="text-base font-medium">Heading 6 - Label</h6>
                  <code className="text-sm text-muted-foreground">text-base font-medium</code>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <p className="text-lg">Large body text for introductions</p>
                  <code className="text-sm text-muted-foreground">text-lg</code>
                </div>
                <div>
                  <p className="text-base">Regular body text for content</p>
                  <code className="text-sm text-muted-foreground">text-base</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Small text for captions and metadata</p>
                  <code className="text-sm text-muted-foreground">text-sm text-muted-foreground</code>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <p className="bg-gradient-text bg-clip-text text-transparent text-2xl font-bold">
                    Gradient Text Effect
                  </p>
                  <code className="text-sm text-muted-foreground">bg-gradient-text bg-clip-text text-transparent</code>
                </div>
                <div>
                  <p className="text-primary font-semibold">Primary colored text</p>
                  <code className="text-sm text-muted-foreground">text-primary</code>
                </div>
                <div>
                  <p className="text-destructive font-semibold">Destructive/Error text</p>
                  <code className="text-sm text-muted-foreground">text-destructive</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Hero Sections */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Hero Sections</h2>
            <p className="text-muted-foreground mb-8">Different hero variations for various page types</p>
          </div>

          <Tabs defaultValue="main" className="space-y-4">
            <TabsList>
              <TabsTrigger value="main">Main Hero</TabsTrigger>
              <TabsTrigger value="skins">Skins Hero</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Main Homepage Hero</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Hero />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skins" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skins Page Hero</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <SkinsHero />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Cards Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Card Components</h2>
            <p className="text-muted-foreground mb-8">Various card designs for different content types</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Operator Card</h3>
              <OperatorCard operator={sampleOperator} />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Case Card</h3>
              <CaseCard case={sampleCase} />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Review Card</h3>
              <ReviewCard review={sampleReview} />
            </div>
          </div>
        </section>

        {/* NEW: Numbered Steps */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Numbered Steps</h2>
            <p className="text-muted-foreground mb-8">Step-by-step process cards with numbers and icons</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stepsData.map((step, index) => (
                  <div key={step.number} className="relative">
                    <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                            {step.number}
                          </div>
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-2 mx-auto">
                            <step.icon className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Connector Arrow */}
                    {index < stepsData.length - 1 && (
                      <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-primary w-6 h-6 z-10" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* NEW: Responsive Tables */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Tables & Data Display</h2>
            <p className="text-muted-foreground mb-8">Responsive tables that transform to cards on mobile</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Comparison Table</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Welcome Bonus</TableHead>
                      <TableHead>Payout Time</TableHead>
                      <TableHead>Established</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item) => (
                      <TableRow key={item.site}>
                        <TableCell className="font-medium">{item.site}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.bonus}</TableCell>
                        <TableCell>{item.payoutTime}</TableCell>
                        <TableCell>{item.established}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Visit Site</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {tableData.map((item) => (
                  <Card key={item.site}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{item.site}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{item.rating}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Bonus:</span>
                          <div className="font-medium">{item.bonus}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payout:</span>
                          <div className="font-medium">{item.payoutTime}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Since:</span>
                          <div className="font-medium">{item.established}</div>
                        </div>
                      </div>
                      
                      <Button className="w-full" size="sm">
                        Visit Site
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* UI Components */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">UI Components</h2>
            <p className="text-muted-foreground mb-8">Buttons, badges, indicators, and interactive elements</p>
          </div>

          <div className="grid gap-8">
            
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button disabled>Disabled</Button>
                  <Button>
                    <Star className="w-4 h-4 mr-2" />
                    With Icon
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges and Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Badges & Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Badges</h4>
                  <div className="flex flex-wrap gap-4">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Rating Badge</h4>
                  <div className="flex gap-4">
                    <RatingBadge rating={4.5} />
                    <RatingBadge rating={3.8} />
                    <RatingBadge rating={5.0} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Trust Indicators</h4>
                  <div className="flex gap-4">
                    <TrustIndicator score={4.2} />
                    <TrustIndicator score={3.5} />
                    <TrustIndicator score={2.8} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress & Loading */}
            <Card>
              <CardHeader>
                <CardTitle>Progress & Loading States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Loading</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="bg-muted" />
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* Interactive Components */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Interactive Components</h2>
            <p className="text-muted-foreground mb-8">Accordions, tabs, and other interactive elements</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Accordion */}
            <Card>
              <CardHeader>
                <CardTitle>Accordion</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern and is fully keyboard navigable.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It comes with default styles that matches the other components' aesthetic.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Filter Sort Component */}
            <Card>
              <CardHeader>
                <CardTitle>Filter & Sort</CardTitle>
              </CardHeader>
              <CardContent>
                <FilterSort 
                  view={filterState.view}
                  onViewChange={handleViewChange}
                  sortBy={filterState.sortBy}
                  onSortChange={handleSortChange}
                  filters={filterState.filters}
                  onFiltersChange={handleFiltersChange}
                />
              </CardContent>
            </Card>

          </div>
        </section>

        {/* Layout Components */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Layout Components</h2>
            <p className="text-muted-foreground mb-8">Headers, footers, and structural elements</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Header Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The header component is displayed at the top of this page and includes:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Logo and branding</li>
                  <li>Multi-level dropdown navigation</li>
                  <li>Search functionality</li>
                  <li>Theme toggle</li>
                  <li>Mobile responsive menu</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Footer />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Color System */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Color System</h2>
            <p className="text-muted-foreground mb-8">Color tokens and semantic usage</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Semantic Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-16 bg-primary rounded-lg"></div>
                  <div className="text-center">
                    <div className="font-medium">Primary</div>
                    <code className="text-xs">bg-primary</code>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-16 bg-secondary rounded-lg"></div>
                  <div className="text-center">
                    <div className="font-medium">Secondary</div>
                    <code className="text-xs">bg-secondary</code>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-16 bg-muted rounded-lg"></div>
                  <div className="text-center">
                    <div className="font-medium">Muted</div>
                    <code className="text-xs">bg-muted</code>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-16 bg-destructive rounded-lg"></div>
                  <div className="text-center">
                    <div className="font-medium">Destructive</div>
                    <code className="text-xs">bg-destructive</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default StyleGuide;