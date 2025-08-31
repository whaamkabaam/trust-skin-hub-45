import { Link } from 'react-router-dom';
import { Star, ExternalLink, Home, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MysteryBoxOperators = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back to Hub */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/mystery-boxes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mystery Boxes
            </Link>
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="w-4 h-4" />
          <span>Hub</span>
          <span>/</span>
          <Link to="/mystery-boxes" className="hover:text-foreground">Mystery Boxes</Link>
          <span>/</span>
          <span className="text-foreground">Top Operators</span>
        </div>
      </div>

      {/* Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Top Rated Mystery Box Operators</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most trusted platforms for mystery box openings, ranked by community reviews and box selection
          </p>
        </div>
      </section>

      {/* Top Rated Operators */}
      <section className="container mx-auto px-4 pb-12">
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Full-width operator card */}
          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 flex-1">
                <img 
                  src="https://wordpress-1472941-5579290.cloudwaysapps.com/hub/images/ccc8c7f7-53cc-41ac-8e6d-0fe13f968fd3.png" 
                  alt="CSGOEmpire" 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-bold">CSGOEmpire</h3>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.8</span>
                        <span className="text-muted-foreground text-sm">(2,847 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span>Number of boxes: <span className="text-blue-600 font-medium">127</span></span>
                    <span>Trust Score: <span className="text-green-600 font-medium">9.2/10</span></span>
                    <span>Payout Speed: <span className="font-medium">Instant</span></span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">Mystery Boxes</Badge>
                    <Badge variant="outline">CS2 Cases</Badge>
                    <Badge variant="outline">Physical Items</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-none">Read Review</Button>
                <Button variant="outline" className="flex-1 sm:flex-none">Visit Site</Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 flex-1">
                <img 
                  src="https://wordpress-1472941-5579290.cloudwaysapps.com/hub/images/ccc8c7f7-53cc-41ac-8e6d-0fe13f968fd3.png" 
                  alt="Cases.GG" 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-bold">Cases.GG</h3>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.6</span>
                        <span className="text-muted-foreground text-sm">(1,923 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span>Number of boxes: <span className="text-blue-600 font-medium">89</span></span>
                    <span>Trust Score: <span className="text-green-600 font-medium">8.9/10</span></span>
                    <span>Payout Speed: <span className="font-medium">1-2 hours</span></span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">Mystery Boxes</Badge>
                    <Badge variant="outline">Novelty Items</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-none">Read Review</Button>
                <Button variant="outline" className="flex-1 sm:flex-none">Visit Site</Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 flex-1">
                <img 
                  src="https://wordpress-1472941-5579290.cloudwaysapps.com/hub/images/ccc8c7f7-53cc-41ac-8e6d-0fe13f968fd3.png" 
                  alt="DatDrop" 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-bold">DatDrop</h3>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.5</span>
                        <span className="text-muted-foreground text-sm">(1,654 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span>Number of boxes: <span className="text-blue-600 font-medium">73</span></span>
                    <span>Trust Score: <span className="text-green-600 font-medium">8.7/10</span></span>
                    <span>Payout Speed: <span className="font-medium">2-4 hours</span></span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">Mystery Boxes</Badge>
                    <Badge variant="outline">Digital Items</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-none">Read Review</Button>
                <Button variant="outline" className="flex-1 sm:flex-none">Visit Site</Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 flex-1">
                <img 
                  src="https://wordpress-1472941-5579290.cloudwaysapps.com/hub/images/ccc8c7f7-53cc-41ac-8e6d-0fe13f968fd3.png" 
                  alt="KeyDrop" 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-bold">KeyDrop</h3>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.4</span>
                        <span className="text-muted-foreground text-sm">(1,387 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span>Number of boxes: <span className="text-blue-600 font-medium">56</span></span>
                    <span>Trust Score: <span className="text-green-600 font-medium">8.5/10</span></span>
                    <span>Payout Speed: <span className="font-medium">3-6 hours</span></span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">Mystery Boxes</Badge>
                    <Badge variant="outline">Premium Items</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-none">Read Review</Button>
                <Button variant="outline" className="flex-1 sm:flex-none">Visit Site</Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 flex-1">
                <img 
                  src="https://wordpress-1472941-5579290.cloudwaysapps.com/hub/images/ccc8c7f7-53cc-41ac-8e6d-0fe13f968fd3.png" 
                  alt="Hellcase" 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-bold">Hellcase</h3>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.2</span>
                        <span className="text-muted-foreground text-sm">(2,156 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span>Number of boxes: <span className="text-blue-600 font-medium">42</span></span>
                    <span>Trust Score: <span className="text-green-600 font-medium">8.3/10</span></span>
                    <span>Payout Speed: <span className="font-medium">4-8 hours</span></span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">Mystery Boxes</Badge>
                    <Badge variant="outline">Budget Options</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-none">Read Review</Button>
                <Button variant="outline" className="flex-1 sm:flex-none">Visit Site</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link to="/operators">View All Operators</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MysteryBoxOperators;