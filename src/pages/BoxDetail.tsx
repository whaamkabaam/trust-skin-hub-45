
import { useParams, useNavigate } from 'react-router-dom';
import { useBoxDetail } from "@/hooks/useBoxDetail";
import { useBoxSuggestions } from "@/hooks/useBoxSuggestions";
import DotBackground from "@/components/ui/dot-background";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import BoxDetailContent from '@/components/box/BoxDetailContent';
import ProviderBreadcrumb from '@/components/ui/ProviderBreadcrumb';
import { PROVIDER_CONFIGS } from '@/types/filters';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Helmet } from 'react-helmet-async';
import { generateSlug } from '@/utils/slugUtils';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BoxDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-6 max-w-7xl">
    <div className="mb-6 flex items-center gap-4">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-6 w-96" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-96 w-full" />
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </div>
);

const BoxDetail = () => {
  const { boxSlug } = useParams<{ boxSlug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { boxData, loading, error } = useBoxDetail(boxSlug || '');
  const { suggestions, loading: suggestionsLoading, findSuggestions } = useBoxSuggestions();

  // Load suggestions when box is not found
  useEffect(() => {
    if (!loading && !boxData && !error && boxSlug) {
      findSuggestions(boxSlug);
    }
  }, [loading, boxData, error, boxSlug, findSuggestions]);

  if (loading) {
    return (
      <>
        <Header />
        <DotBackground className="min-h-screen">
          <BoxDetailSkeleton />
        </DotBackground>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <DotBackground className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-xl">Error loading mystery box: {error}</div>
            <Button onClick={() => navigate('/mystery-boxes', { replace: true })} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hub
            </Button>
          </div>
        </DotBackground>
        <Footer />
      </>
    );
  }

  if (!boxData) {
    return (
      <>
        <Header />
        <Helmet>
          <title>Mystery Box Not Found | Unpacked.gg</title>
          <meta name="description" content="The requested mystery box could not be found. Browse our collection of mystery boxes with detailed drop rate analysis." />
        </Helmet>
        <DotBackground className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
            <div className="space-y-2">
              <div className="text-red-600 text-xl font-semibold">Mystery box not found</div>
              <p className="text-gray-600">We couldn't find a box matching "{boxSlug}"</p>
            </div>
            
            {/* Show suggestions if available */}
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 justify-center text-gray-700">
                  <Search className="h-4 w-4" />
                  <span className="font-medium">Did you mean one of these?</span>
                </div>
                <div className="grid gap-3 max-w-md mx-auto">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-between text-left h-auto p-4"
                      onClick={() => navigate(`/hub/box/${suggestion.slug}`, { replace: true })}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">{suggestion.box_name}</span>
                        <span className="text-xs text-gray-500">{suggestion.provider_name}</span>
                      </div>
                      <div className="text-xs text-purple-600 font-mono">
                        {Math.round(suggestion.score * 100)}% match
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Loading suggestions */}
            {suggestionsLoading && (
              <div className="flex items-center gap-2 justify-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm">Finding similar boxes...</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/mystery-boxes', { replace: true })} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Button>
              <Button onClick={() => navigate('/mystery-boxes', { replace: true })} variant="default">
                Browse All Boxes
              </Button>
            </div>
          </div>
        </DotBackground>
        <Footer />
      </>
    );
  }

  const providerConfig = PROVIDER_CONFIGS[boxData.provider as keyof typeof PROVIDER_CONFIGS];
  const currentBoxSlug = generateSlug(boxData.box_name);

  return (
    <>
      <Header />
      <Helmet>
        <title>{boxData.box_name} ({boxData.provider === 'rillabox' ? 'RillaBox' : boxData.provider === 'hypedrop' ? 'Hypedrop' : boxData.provider === 'casesgg' ? 'Cases.GG' : boxData.provider === 'luxdrop' ? 'Luxdrop' : 'Mystery Box'}) - Mystery Box Analysis | Unpacked.gg</title>
        <meta 
          name="description" 
          content={`Detailed analysis of ${boxData.box_name} mystery box from ${providerConfig?.displayName}. EV: ${boxData.expected_value_percent_of_price.toFixed(1)}%, Floor Rate: ${boxData.floor_rate_percent.toFixed(1)}%, Price: $${boxData.box_price}. View drop rates and item statistics.`} 
        />
        <meta 
          name="keywords" 
          content={`${boxData.box_name}, ${providerConfig?.displayName}, mystery box, drop rates, expected value, ${boxData.category}, unboxing`} 
        />
        
        <meta property="og:title" content={`${boxData.box_name} (${providerConfig?.displayName}) - Mystery Box Analysis | Unpacked.gg`} />
        <meta property="og:description" content={`${boxData.expected_value_percent_of_price.toFixed(1)}% EV • $${boxData.box_price} • ${boxData.floor_rate_percent.toFixed(1)}% Floor Rate • Detailed drop rate analysis`} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={boxData.box_image || 'https://unpacked.gg/lovable-uploads/5287436e-c9c8-46af-a4b6-4b553d93c81a.png'} />
        <meta property="og:url" content={`https://unpacked.gg/hub/box/${currentBoxSlug}`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${boxData.box_name} (${providerConfig?.displayName}) - Mystery Box Analysis | Unpacked.gg`} />
        <meta name="twitter:description" content={`${boxData.expected_value_percent_of_price.toFixed(1)}% EV • $${boxData.box_price} • Comprehensive drop rate analysis`} />
        <meta name="twitter:image" content={boxData.box_image || 'https://unpacked.gg/lovable-uploads/5287436e-c9c8-46af-a4b6-4b553d93c81a.png'} />
        
        <link rel="canonical" href={`https://unpacked.gg/hub/box/${currentBoxSlug}`} />
        
        {/* Structured Data for Product */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": boxData.box_name,
            "image": boxData.box_image,
            "description": `Mystery box with ${boxData.expected_value_percent_of_price.toFixed(1)}% expected value and ${boxData.floor_rate_percent.toFixed(1)}% floor rate.`,
            "brand": {
              "@type": "Brand",
              "name": providerConfig?.displayName
            },
            "offers": {
              "@type": "Offer",
              "price": boxData.box_price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "category": boxData.category,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": Math.min(5, (boxData.expected_value_percent_of_price / 20)),
              "ratingCount": 1
            }
          })}
        </script>

        {/* Breadcrumb Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://unpacked.gg"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Mystery Boxes Hub",
                "item": "https://unpacked.gg/hub"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": providerConfig?.displayName,
                "item": `https://unpacked.gg/hub/${boxData.provider}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": boxData.box_name
              }
            ]
          })}
        </script>
      </Helmet>

      <DotBackground className="min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Enhanced Navigation with Responsive Design */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/mystery-boxes', { replace: true })} 
                variant="outline"
                className="flex items-center gap-2 shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Hub
              </Button>
            </div>
            
            {/* Enhanced Breadcrumb Navigation */}
            <ProviderBreadcrumb
              providerId={boxData.provider as keyof typeof PROVIDER_CONFIGS}
              boxName={boxData.box_name}
              className="text-sm"
            />
          </div>
          
          <BoxDetailContent box={boxData} />
        </div>
      </DotBackground>
      <Footer />
    </>
  );
};

export default BoxDetail;
