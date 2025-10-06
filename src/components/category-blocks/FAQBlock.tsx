import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQBlockProps {
  data: {
    title?: string;
    description?: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
}

export const FAQBlock = ({ data = { items: [] }, isEditing = false }: FAQBlockProps) => {
  if (isEditing) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">FAQ Block</h3>
        <p className="text-sm text-muted-foreground">
          Configure FAQ items in the block data JSON
        </p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {data.title && (
        <h2 className="text-3xl font-bold mb-3 text-center">{data.title}</h2>
      )}
      {data.description && (
        <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          {data.description}
        </p>
      )}

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {data.items.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border border-border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-2">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
