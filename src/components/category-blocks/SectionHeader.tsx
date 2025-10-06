import { Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  id: string;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeader = ({ id, title, description, className }: SectionHeaderProps) => {
  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div id={id} className={cn("scroll-mt-24", className)}>
      <div className="flex items-center gap-2 group mb-4">
        <h2 className="text-2xl font-bold text-foreground">
          {title}
        </h2>
        <button
          onClick={copyLink}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
          aria-label="Copy link to section"
        >
          <Link2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
    </div>
  );
};
