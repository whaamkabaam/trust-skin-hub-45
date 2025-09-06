import React from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ContentSection {
  id: string;
  section_key: string;
  heading: string;
  rich_text_content: string;
  order_number: number;
}

interface ContentSectionRendererProps {
  sections: ContentSection[];
  className?: string;
}

export function ContentSectionRenderer({ sections, className }: ContentSectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    });
  };

  const sortedSections = [...sections].sort((a, b) => a.order_number - b.order_number);

  return (
    <section id="content-sections" className={className}>
      <div className="space-y-8">
        {sortedSections.map((section, index) => (
          <div key={section.id || index} id={`section-${section.section_key}`}>
            <Card className="border-l-4 border-l-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground">
                  {section.heading}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-neutral dark:prose-invert max-w-none
                    prose-headings:text-foreground prose-p:text-muted-foreground 
                    prose-strong:text-foreground prose-em:text-muted-foreground
                    prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHtml(section.rich_text_content) 
                  }}
                />
              </CardContent>
            </Card>
            {index < sortedSections.length - 1 && (
              <Separator className="my-6 opacity-30" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}