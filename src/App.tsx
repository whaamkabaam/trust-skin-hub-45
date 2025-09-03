import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OperatorReview from "./pages/OperatorReview";
import OnlineCasinoReview from "./pages/OnlineCasinoReview";
import CaseDetail from "./pages/CaseDetail";
import MysteryBoxDetail from "./pages/MysteryBoxDetail";
import MysteryBoxReviews from "./pages/MysteryBoxReviews";
import OperatorsArchive from "./pages/OperatorsArchive";
import CasesArchive from "./pages/CasesArchive";
import MysteryBoxesArchive from "./pages/MysteryBoxesArchive";
import MysteryBoxOperators from "./pages/MysteryBoxOperators";
import AppleMysteryBoxes from "./pages/AppleMysteryBoxes";
import Skins from "./pages/Skins";
import NotFound from "./pages/NotFound";
import StyleGuide from "./pages/StyleGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/skins" element={<Skins />} />
          <Route path="/operators" element={<OperatorsArchive />} />
          <Route path="/operators/:id/review" element={<OperatorReview />} />
          <Route path="/casino-review" element={<OnlineCasinoReview />} />
          <Route path="/cases" element={<CasesArchive />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/mystery-boxes" element={<MysteryBoxesArchive />} />
          <Route path="/mystery-boxes/reviews" element={<MysteryBoxReviews />} />
          <Route path="/mystery-boxes/apple" element={<AppleMysteryBoxes />} />
          <Route path="/mystery-boxes/operators" element={<MysteryBoxOperators />} />
          <Route path="/mystery-boxes/:id" element={<MysteryBoxDetail />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
