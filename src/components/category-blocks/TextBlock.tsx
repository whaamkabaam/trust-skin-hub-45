import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StableRichTextEditor } from '@/components/admin/StableRichTextEditor';
import DOMPurify from 'dompurify';

interface TextBlockProps {
  data: {
    content?: string;
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
}

export const TextBlock = ({ data = {}, onChange, isEditing = false }: TextBlockProps) => {
  const [localData, setLocalData] = useState(data);

  const handleChange = (content: string) => {
    const newData = { content };
    setLocalData(newData);
    onChange?.(newData);
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Text Content</h3>
        <StableRichTextEditor
          value={localData.content || ''}
          onChange={handleChange}
          placeholder="Write your content here..."
        />
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div 
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(localData.content || '', {
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
            FORBID_ATTR: ['onclick', 'onload', 'onerror']
          }) 
        }}
      />
    </div>
  );
};
