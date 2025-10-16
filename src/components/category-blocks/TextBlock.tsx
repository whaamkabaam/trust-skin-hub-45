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
        className="prose prose-lg max-w-none 
          prose-table:border-collapse prose-table:w-full prose-table:my-4
          prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:font-semibold prose-th:text-left
          prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 prose-td:min-w-[80px]
          prose-thead:bg-muted prose-tbody:divide-y prose-tbody:divide-border"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(localData.content || '', {
            ADD_TAGS: ['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col'],
            ADD_ATTR: ['colspan', 'rowspan', 'style', 'class', 'data-row', 'data-col', 'width', 'height', 'contenteditable'],
            ALLOWED_ATTR: ['class', 'colspan', 'rowspan', 'style', 'data-row', 'data-col'],
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
            FORBID_ATTR: ['onclick', 'onload', 'onerror']
          }) 
        }}
      />
    </div>
  );
};
