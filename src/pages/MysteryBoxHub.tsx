import { useUnifiedBoxData } from "@/hooks/useUnifiedBoxData";
import DotBackground from "@/components/ui/dot-background";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import BoxfolioDashboard from "@/components/BoxfolioDashboard";
import SkeletonStatsCard from "@/components/SkeletonStatsCard";
import HuntExperience from "@/components/scouter/HuntExperience";
import CompactStats from "@/components/CompactStats";
import { useItemSearch } from "@/hooks/useItemSearch";
import { useHuntReport } from "@/hooks/useHuntReport";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MysteryBoxHub = () => {
  const [searchParams] = useSearchParams();
  const [showAlert, setShowAlert] = useState(true);
  const isMobile = useIsMobile();

  // Get provider filter from URL params but don't restrict data fetching
  const providerParam = searchParams.get('provider');
  
  // Always fetch all providers' data in Hub, don't restrict by selectedProviders
  const {
    summaryData,
    boxesData,
    loading,
    error
  } = useUnifiedBoxData(undefined, 5000); // undefined means fetch all providers, increased limit

  // Item Hunter functionality
  const {
    searchQuery,
    searchResults,
    selectedItem,
    handleSearch,
    handleItemSelect,
    handleClearSearch
  } = useItemSearch(boxesData);
  const huntResults = useHuntReport(boxesData, selectedItem);

  // Helper function to get item image
  const getItemImage = (itemName: string): string => {
    for (const box of boxesData) {
      const allItems = [...box.jackpot_items, ...box.unwanted_items, ...box.all_items];
      const item = allItems.find(item => item.name === itemName);
      if (item?.image) {
        return item.image;
      }
    }
    return 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop';
  };

  console.log('Hub component render:', {
    providerParam,
    summaryData,
    boxesCount: boxesData.length,
    loading,
    error
  });

  // Show error state with retry option
  if (error) {
    return (
      <>
        <Header />
        <DotBackground className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-xl">Error loading mystery box data: {error}</div>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Retry
            </button>
          </div>
        </DotBackground>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Helmet>
        <title>Mystery Box Hub - Compare Drop Rates & Expected Values | Unpacked.gg</title>
        <meta name="description" content="Compare mystery box drop rates, expected values, and volatility across RillaBox, Hypedrop, Cases.GG, and Luxdrop. Find the most profitable mystery boxes with comprehensive analytics." />
        <meta name="keywords" content="mystery boxes, drop rates, expected value, RillaBox, Hypedrop, Cases.GG, Luxdrop, unboxing, case opening, gambling analytics" />
        
        <meta property="og:title" content="Mystery Box Analytics Hub | Unpacked.gg" />
        <meta property="og:description" content="Find the best mystery boxes with comprehensive drop rate analysis and expected value calculations across multiple providers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://unpacked.gg/mystery-boxes" />
        
        <meta name="twitter:title" content="Mystery Box Analytics Hub | Unpacked.gg" />
        <meta name="twitter:description" content="Compare mystery box drop rates and expected values across multiple providers. Find profitable boxes with detailed analytics." />
        
        <link rel="canonical" href="https://unpacked.gg/mystery-boxes" />
        
        {/* Organization Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Unpacked.gg",
          "url": "https://unpacked.gg",
          "description": "Mystery box analytics platform for comparing drop rates and expected values",
          "sameAs": []
        })}
        </script>
      </Helmet>
      
      <DotBackground className="min-h-screen">
        {/* Alert */}
        {showAlert && (
          <div className="mx-4 sm:mx-6 mt-4 sm:mt-6">
            <div className="relative">
              <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm leading-relaxed text-blue-800 pr-10">
                  We gather this information and data to the best of our knowledge to provide value, but we cannot guarantee that the data is always accurate.
                </AlertDescription>
              </Alert>
              <button 
                onClick={() => setShowAlert(false)} 
                className="absolute top-1.5 right-1.5 p-1.5 rounded-full text-gray-600 hover:text-gray-800 hover:bg-blue-100 transition-colors flex items-center justify-center w-7 h-7" 
                aria-label="Dismiss alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
            {/* Hero Section with Improved Mobile Logo */}
            <header className="text-center space-y-6">
              <div className={`flex items-center justify-center ${isMobile ? 'gap-2' : 'gap-4 lg:gap-6'}`}>
                <img 
                  src="/images/208a85a9-4108-4646-8cb0-aed2a05655ab.png"
                  alt="Unpacked.gg Logo" 
                  className={`object-contain ${isMobile ? 'h-16' : 'h-24 md:h-32 lg:h-48'} flex-shrink-0`}
                  onError={(e) => {
                    console.warn('Main logo failed to load:', e.currentTarget.src);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className={`${isMobile ? 'w-0.5' : 'w-1'} bg-black ${isMobile ? 'h-12' : 'h-16 md:h-20 lg:h-32'} shadow-[0_0_4px_rgba(255,255,255,0.8)] flex-shrink-0`}></div>
                <span className={`font-bold text-gray-800 ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl lg:text-5xl'} flex-shrink-0 min-w-0`}>Hub</span>
              </div>
              <div className="space-y-6">
                <div className="py-4">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent leading-[1.2] pb-2">
                    Online Mystery Boxes – Find Yours
                  </h1>
                </div>
                <div className="inline-block mx-auto">
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg shadow-purple-500/10 px-4 py-2">
                    <p className="text-xl text-gray-700 font-semibold leading-relaxed">
                      Unbox the Best Mystery Boxes – Don't Settle for Poor Drop Rates
                    </p>
                  </div>
                </div>
                <div className="max-w-3xl mx-auto">
                  <div className="inline-block bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg shadow-purple-500/10 px-4 py-2">
                    <p className="text-base text-gray-700 leading-relaxed">
                      Discover profitable mystery boxes with comprehensive analytics. Compare expected values, drop rates, and volatility across multiple providers.
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Enhanced Compact Statistics Display with Pattern Background */}
            <div className="relative w-fit mx-auto">
              <div className="backdrop-blur-md rounded-2xl border border-purple-200/50 shadow-2xl shadow-purple-500/20 ring-1 ring-purple-100/50 p-1 animate-pulse-subtle box-stats-pattern-blurred">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl relative z-10">
                  <CompactStats boxesData={boxesData} loading={loading} />
                </div>
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-2xl blur-xl -z-10"></div>
            </div>

            {/* Item Hunter Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Item Hunter - Find Mystery Boxes with Your Target Items
              </h2>
              <HuntExperience 
                searchQuery={searchQuery} 
                searchResults={searchResults} 
                selectedItem={selectedItem} 
                huntResults={huntResults} 
                onSearchChange={handleSearch} 
                onItemSelect={handleItemSelect} 
                onClearSearch={handleClearSearch} 
                getItemImage={getItemImage} 
              />
            </section>

            {/* Statistics Cards - Show Skeleton While Loading */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Mystery Box Analytics & Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                  // Show skeleton cards while loading
                  <>
                    <SkeletonStatsCard />
                    <SkeletonStatsCard />
                    <SkeletonStatsCard />
                    <SkeletonStatsCard />
                  </>
                ) : (
                  // Show actual data once loaded
                  summaryData && (
                    <BoxfolioDashboard 
                      summaryData={summaryData} 
                      boxesData={boxesData} 
                      isUnified={true} 
                      showOnlyStats={true} 
                      selectedProvider={providerParam} 
                    />
                  )
                )}
              </div>
            </section>

            {/* Main Dashboard - Show Skeleton or Real Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Browse All Mystery Boxes
              </h2>
              {loading ? (
                <div className="space-y-6">
                  {/* Skeleton for filter controls */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-48">
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skeleton grid for boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-4">
                          <div className="h-40 bg-gray-200 rounded-lg"></div>
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="flex justify-between">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-12"></div>
                          </div>
                          <div className="h-8 bg-gray-200 rounded w-20 mx-auto"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                summaryData && (
                  <BoxfolioDashboard 
                    summaryData={summaryData} 
                    boxesData={boxesData} 
                    isUnified={true} 
                    showOnlyContent={true} 
                    selectedProvider={providerParam} 
                  />
                )
              )}
            </section>
          </div>
        </div>
      </DotBackground>
      <Footer />
    </>
  );
};

export default MysteryBoxHub;
