import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      className="relative w-full min-h-[500px] flex items-center justify-center bg-cover bg-center"
      style={localData.backgroundImage ? {
        backgroundImage: `url(${localData.backgroundImage})`,
      } : undefined}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl py-16">
        {localData.title && (
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">{localData.title}</h1>
        )}
        {localData.subtitle && (
          <p className="text-2xl mb-8 opacity-90">{localData.subtitle}</p>
        )}
        {localData.ctaText && (
          <Button 
            className="mt-6 text-lg px-8 py-6 hover:scale-105 transition-transform"
            size="lg"
            onClick={() => window.location.href = localData.ctaLink || '#'}
          >
            {localData.ctaText}
          </Button>
        )}
      </div>
    </div>
  );
};
