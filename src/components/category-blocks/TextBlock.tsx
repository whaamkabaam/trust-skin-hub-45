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
        className="prose prose-lg max-w-none prose-table:border-collapse prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:font-semibold prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(localData.content || '', {
            ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
            ADD_ATTR: ['colspan', 'rowspan', 'style', 'data-row', 'data-col', 'width', 'height']
          }) 
        }}
      />
    </div>
  );
};
