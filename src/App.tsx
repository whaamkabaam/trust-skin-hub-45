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
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OperatorsList from "./pages/admin/OperatorsList";
import NewOperator from "./pages/admin/NewOperator";
import EditOperator from "./pages/admin/EditOperator";
import ContentSections from "./pages/admin/ContentSections";
import MediaLibrary from "./pages/admin/MediaLibrary";
import SEOManager from "./pages/admin/SEOManager";
import ReviewsManager from "./pages/admin/ReviewsManager";
import AdminUsers from "./pages/admin/AdminUsers";

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
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="operators" element={<OperatorsList />} />
              <Route path="operators/new" element={<NewOperator />} />
              <Route path="operators/:id" element={<EditOperator />} />
              <Route path="content" element={<ContentSections />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="reviews" element={<ReviewsManager />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
