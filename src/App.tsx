import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary, AdminErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';

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
import OperatorContent from "./pages/admin/OperatorContent";
import OperatorMedia from "./pages/admin/OperatorMedia";
import OperatorSEO from "./pages/admin/OperatorSEO";
import ContentSections from "./pages/admin/ContentSections";
import MediaLibrary from "./pages/admin/MediaLibrary";
import SEOManager from "./pages/admin/SEOManager";
import ReviewsManager from "./pages/admin/ReviewsManager";
import AdminUsers from "./pages/admin/AdminUsers";
import PublishingManager from "./pages/admin/PublishingManager";
import Auth from "./pages/Auth";
import LegacyOperatorReview from "./pages/LegacyOperatorReview";

// Redirect component for legacy review URLs
const ReviewRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/operators/${id}`} replace />;
};

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/skins" element={<Skins />} />
            <Route path="/operators" element={<OperatorsArchive />} />
            <Route path="/operators/:id" element={<LegacyOperatorReview />} />
            <Route path="/operators/:id/new" element={<OperatorReview />} />
            <Route path="/operators/:id/review" element={<ReviewRedirect />} />
            <Route path="/casino-review" element={<OnlineCasinoReview />} />
            <Route path="/cases" element={<CasesArchive />} />
            <Route path="/cases/:id" element={<CaseDetail />} />
            <Route path="/mystery-boxes" element={<MysteryBoxesArchive />} />
            <Route path="/mystery-boxes/reviews" element={<MysteryBoxReviews />} />
            <Route path="/mystery-boxes/apple" element={<AppleMysteryBoxes />} />
            <Route path="/mystery-boxes/operators" element={<MysteryBoxOperators />} />
            <Route path="/mystery-boxes/:id" element={<MysteryBoxDetail />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminErrorBoundary>
                  <AdminLayout />
                </AdminErrorBoundary>
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="operators" element={<OperatorsList />} />
              <Route path="operators/new" element={<NewOperator />} />
              <Route path="operators/:id" element={<EditOperator />} />
              <Route path="operators/:id/content" element={<OperatorContent />} />
              <Route path="operators/:id/media" element={<OperatorMedia />} />
              <Route path="operators/:id/seo" element={<OperatorSEO />} />
              <Route path="publishing" element={<PublishingManager />} />
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
      </ErrorBoundary>
    </TooltipProvider>
  </HelmetProvider>
);

export default App;