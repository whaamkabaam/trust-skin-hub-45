import { useState, useEffect } from 'react';
import { Share2, BookmarkPlus, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
}

interface CategorySidebarProps {
  sections: Section[];
}

export const CategorySidebar = ({ sections }: CategorySidebarProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Make sticky after scrolling past hero
      setIsSticky(window.scrollY > 200);

      // Update active section based on scroll position
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className={cn(
      "hidden lg:block w-64 flex-shrink-0 transition-all duration-200",
      isSticky && "sticky top-20"
    )}>
      <Card className="p-4">
        <div className="space-y-4">
          {/* Table of Contents */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">On This Page</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "block w-full text-left text-sm py-2 px-3 rounded-md transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Page
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Bookmark
            </Button>
            {isSticky && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={scrollToTop}
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Back to Top
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
