import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTABlockProps {
  data: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    style?: 'gradient' | 'solid' | 'outline';
    backgroundImage?: string;
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
}

export const CTABlock = ({ data = {}, isEditing = false }: CTABlockProps) => {
  if (isEditing) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Call-to-Action Block</h3>
        <p className="text-sm text-muted-foreground">
          Configure CTA in the block data JSON
        </p>
      </Card>
    );
  }

  const style = data.style || 'gradient';

  return (
    <div className="container mx-auto px-4 py-16">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-12 text-center",
          style === 'gradient' && "bg-gradient-hero text-white",
          style === 'solid' && "bg-primary text-primary-foreground",
          style === 'outline' && "border-2 border-primary bg-background"
        )}
        style={
          data.backgroundImage
            ? {
                backgroundImage: `url(${data.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {data.backgroundImage && (
          <div className="absolute inset-0 bg-black/60" />
        )}

        <div className="relative z-10 max-w-2xl mx-auto">
          {data.title && (
            <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
          )}
          {data.description && (
            <p className="text-lg mb-8 opacity-90">{data.description}</p>
          )}
          {data.buttonText && (
            <Button
              size="lg"
              className={cn(
                "text-lg px-8 py-6",
                style === 'gradient' && "bg-white text-primary hover:bg-white/90",
                style === 'solid' && "bg-white text-primary hover:bg-white/90",
                style === 'outline' && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              asChild
            >
              <a href={data.buttonLink || '#'}>
                {data.buttonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
