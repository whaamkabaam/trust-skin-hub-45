import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonTableBlockProps {
  data: {
    title?: string;
    description?: string;
    columns: Array<{
      header: string;
      items: (string | boolean)[];
      highlight?: boolean;
    }>;
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
}

export const ComparisonTableBlock = ({ data = { columns: [] }, isEditing = false }: ComparisonTableBlockProps) => {
  if (isEditing) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Comparison Table Block</h3>
        <p className="text-sm text-muted-foreground">
          Configure comparison table in the block data JSON
        </p>
      </Card>
    );
  }

  const maxRows = Math.max(...data.columns.map(col => col.items?.length || 0));

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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {data.columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "p-4 text-left font-bold border-b-2",
                    col.highlight ? "bg-primary/5 border-primary" : "border-border"
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-muted/30 transition-colors">
                {data.columns.map((col, colIdx) => {
                  const value = col.items?.[rowIdx];
                  return (
                    <td
                      key={colIdx}
                      className={cn(
                        "p-4 border-b border-border",
                        col.highlight && "bg-primary/5"
                      )}
                    >
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check className="w-5 h-5 text-success" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground" />
                        )
                      ) : (
                        <span className={colIdx === 0 ? "font-medium" : ""}>
                          {value || '—'}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
