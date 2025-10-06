import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface HeroBlockProps {
  data: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
}

export const HeroBlock = ({ data = {}, onChange, isEditing = false }: HeroBlockProps) => {
  const [localData, setLocalData] = useState(data);

  const handleChange = (field: string, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange?.(newData);
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Hero Block</h3>
        
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={localData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter hero title"
          />
        </div>

        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea
            value={localData.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="Enter hero subtitle"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Background Image URL</Label>
          <Input
            value={localData.backgroundImage || ''}
            onChange={(e) => handleChange('backgroundImage', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>CTA Button Text</Label>
            <Input
              value={localData.ctaText || ''}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              placeholder="Explore Boxes"
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input
              value={localData.ctaLink || ''}
              onChange={(e) => handleChange('ctaLink', e.target.value)}
              placeholder="#boxes"
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div 
      className="relative h-[400px] flex items-center justify-center text-white bg-cover bg-center"
      style={{
        backgroundImage: localData.backgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${localData.backgroundImage})`
          : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">{localData.title || 'Category Title'}</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{localData.subtitle || 'Discover amazing mystery boxes'}</p>
        {localData.ctaText && (
          <a 
            href={localData.ctaLink || '#'} 
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            {localData.ctaText}
          </a>
        )}
      </div>
    </div>
  );
};
