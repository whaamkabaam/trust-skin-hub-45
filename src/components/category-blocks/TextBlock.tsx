import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StableRichTextEditor } from '@/components/admin/StableRichTextEditor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import DOMPurify from 'dompurify';

interface TextBlockProps {
  data: {
    content?: string;
    heading?: string;
    showHeading?: boolean;
    includeInNav?: boolean;
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
}

export const TextBlock = ({ data = {}, onChange, isEditing = false }: TextBlockProps) => {
  const [localData, setLocalData] = useState(data);

  const handleChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange?.(newData);
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Text Content</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add a heading to include this section in page navigation
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="heading">Section Heading (optional)</Label>
          <Input
            id="heading"
            value={localData.heading || ''}
            onChange={(e) => handleChange('heading', e.target.value)}
            placeholder="e.g., Introduction, How It Works, Final Thoughts"
            maxLength={50}
          />
          {localData.heading && localData.heading.length > 40 && (
            <p className="text-xs text-yellow-600">Keep headings under 40 characters for best display</p>
          )}
        </div>

        {localData.heading && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showHeading"
                checked={localData.showHeading !== false}
                onCheckedChange={(checked) => handleChange('showHeading', checked)}
              />
              <Label htmlFor="showHeading" className="text-sm font-normal cursor-pointer">
                Show heading on page
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeInNav"
                checked={localData.includeInNav !== false}
                onCheckedChange={(checked) => handleChange('includeInNav', checked)}
              />
              <Label htmlFor="includeInNav" className="text-sm font-normal cursor-pointer">
                Include in navigation menu
              </Label>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Content</Label>
          <StableRichTextEditor
            value={localData.content || ''}
            onChange={(content) => handleChange('content', content)}
            placeholder="Write your content here..."
          />
        </div>
      </Card>
    );
  }

  const headingSlug = localData.heading 
    ? localData.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
    : '';

  return (
    <div className="container mx-auto px-4 py-8">
      {localData.heading && localData.showHeading !== false && (
        <h2 
          id={headingSlug}
          className="text-3xl font-bold mb-6 scroll-mt-20"
        >
          {localData.heading}
        </h2>
      )}
      {localData.heading && localData.showHeading === false && (
        <div id={headingSlug} className="scroll-mt-20" />
      )}
      <div 
        className="prose prose-lg max-w-none dark:prose-invert text-block-content"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(localData.content || '', {
            ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 's', 'ol', 'ul', 'li', 'blockquote', 'pre', 'code', 'a', 'span', 'div'],
            ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
            FORBID_ATTR: ['onclick', 'onload', 'onerror']
          }) 
        }}
      />
      
      <style>{`
        .text-block-content h1 {
          font-size: 2.25em;
          font-weight: 800;
          line-height: 1.1;
          margin-top: 0;
          margin-bottom: 0.8888889em;
          color: inherit;
        }
        .text-block-content h2 {
          font-size: 1.875em;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 1.5em;
          margin-bottom: 0.8em;
          color: inherit;
        }
        .text-block-content h3 {
          font-size: 1.5em;
          font-weight: 600;
          line-height: 1.3;
          margin-top: 1.6em;
          margin-bottom: 0.6em;
          color: inherit;
        }
        .text-block-content h4 {
          font-size: 1.25em;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: inherit;
        }
        .text-block-content h5 {
          font-size: 1.125em;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: inherit;
        }
        .text-block-content h6 {
          font-size: 1em;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: inherit;
        }
        .text-block-content p {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          line-height: 1.75;
        }
        .text-block-content strong {
          font-weight: 600;
        }
        .text-block-content em {
          font-style: italic;
        }
        .text-block-content u {
          text-decoration: underline;
        }
        .text-block-content s {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};
