import { Link } from 'react-router-dom';
import { Home, ChevronRight, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface EnhancedBreadcrumbsProps {
  categoryName: string;
  categorySlug: string;
}

export const EnhancedBreadcrumbs = ({ categoryName, categorySlug }: EnhancedBreadcrumbsProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="border-b bg-muted/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span className="sr-only md:not-sr-only">Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/mystery-boxes">Mystery Boxes</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{categoryName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="hidden sm:flex"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
            >
              <Bookmark className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
