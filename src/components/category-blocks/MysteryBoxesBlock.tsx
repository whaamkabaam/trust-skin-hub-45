import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategoryBoxes, CategoryBoxAssignment } from '@/hooks/useCategoryBoxes';
import MysteryBoxCard from '@/components/MysteryBoxCard';
import { supabase } from '@/integrations/supabase/client';

interface MysteryBoxesBlockProps {
  data: {
    title?: string;
    description?: string;
    displayMode?: 'grid-2' | 'grid-3' | 'grid-4' | 'carousel';
    selectedBoxIds?: string[];
    maxBoxes?: number;
    boxesData?: any[];
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
  categoryId?: string;
}

export const MysteryBoxesBlock = ({ 
  data = {}, 
  onChange, 
  isEditing = false,
  categoryId 
}: MysteryBoxesBlockProps) => {
  const [localData, setLocalData] = useState(data);
  const [boxes, setBoxes] = useState<CategoryBoxAssignment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { loading, fetchCategoryBoxes } = useCategoryBoxes();

  useEffect(() => {
    if (categoryId && isEditing) {
      fetchCategoryBoxes(categoryId).then(setBoxes);
    }
  }, [categoryId, isEditing]);
  
  const handleChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    console.log('MysteryBoxesBlock - handleChange:', { field, value, newData });
    setLocalData(newData);
    onChange?.(newData);
  };

  const toggleBoxSelection = (boxId: string) => {
    const currentIds = localData.selectedBoxIds || [];
    const newIds = currentIds.includes(boxId)
      ? currentIds.filter(id => id !== boxId)
      : [...currentIds, boxId];
    console.log('MysteryBoxesBlock - toggleBoxSelection:', { boxId, currentIds, newIds });
    const newData = { ...localData, selectedBoxIds: newIds };
    setLocalData(newData);
    setHasUnsavedChanges(true);
    // Immediate call to onChange
    onChange?.(newData);
  };

  const handleSaveSelections = () => {
    console.log('MysteryBoxesBlock - Manual save triggered:', localData);
    onChange?.(localData);
    setHasUnsavedChanges(false);
  };

  const selectedBoxes = boxes.filter(box => 
    (localData.selectedBoxIds || []).includes(box.id)
  );

  const gridCols = {
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    'carousel': 'flex overflow-x-auto gap-4',
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Mystery Boxes Block</h3>
        
        <div className="space-y-2">
          <Label>Block Title</Label>
          <Input
            value={localData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Featured Mystery Boxes"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={localData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Check out these amazing boxes..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Display Mode</Label>
            <Select
              value={localData.displayMode || 'grid-3'}
              onValueChange={(value) => handleChange('displayMode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid-2">2 Columns</SelectItem>
                <SelectItem value="grid-3">3 Columns</SelectItem>
                <SelectItem value="grid-4">4 Columns</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Max Boxes to Show</Label>
            <Input
              type="number"
              value={localData.maxBoxes || 6}
              onChange={(e) => handleChange('maxBoxes', parseInt(e.target.value))}
              min={1}
              max={20}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select Mystery Boxes ({(localData.selectedBoxIds || []).length} selected)</Label>
          <div className="max-h-64 overflow-y-auto border rounded-lg p-4 space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading boxes...</p>
            ) : boxes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No boxes assigned to this category yet. Assign boxes from the Providers section first.</p>
            ) : (
              boxes.map((box) => (
                <div key={box.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={(localData.selectedBoxIds || []).includes(box.id)}
                    onCheckedChange={() => toggleBoxSelection(box.id)}
                  />
                  <label className="text-sm cursor-pointer flex-1">
                    {box.box_name} ({box.provider}) - ${box.box_price}
                  </label>
                </div>
              ))
            )}
          </div>
          {hasUnsavedChanges && (
            <Button 
              onClick={handleSaveSelections}
              className="w-full mt-2"
              variant="default"
            >
              Save {(localData.selectedBoxIds || []).length} Selected Boxes
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const [enrichedBoxes, setEnrichedBoxes] = useState<any[]>([]);
  const [fetchingBoxes, setFetchingBoxes] = useState(false);

  // Efficiently fetch only the specific boxes we need from CMS
  useEffect(() => {
    const fetchSpecificBoxes = async () => {
      // In edit mode or if no boxesData, use selectedBoxes
      const boxesToFetch = isEditing ? selectedBoxes : (localData.boxesData || []);
      
      if (boxesToFetch.length === 0) {
        setEnrichedBoxes([]);
        return;
      }

      setFetchingBoxes(true);
      
      try {
        const enriched = [];
        
        // Group boxes by provider for efficient batch fetching
        const byProvider: Record<string, any[]> = {};
        boxesToFetch.forEach(box => {
          const provider = box.provider || 'rillabox';
          if (!byProvider[provider]) byProvider[provider] = [];
          byProvider[provider].push(box);
        });

        // Fetch from each provider table
        for (const [provider, providerBoxes] of Object.entries(byProvider)) {
          const boxNames = providerBoxes.map(b => b.box_name).filter(Boolean);
          
          if (boxNames.length === 0) continue;

          // Fetch complete box data for these specific boxes
          const { data, error } = await supabase
            .from(provider)
            .select('*')
            .in('box_name', boxNames);

          if (!error && data) {
            // Match and enrich
            data.forEach(fullBox => {
              enriched.push({
                ...fullBox,
                expected_value_percent_of_price: fullBox.expected_value_percent || 0,
                provider: provider,
              });
            });
          }
        }

        setEnrichedBoxes(enriched);
      } catch (error) {
        console.error('Error fetching specific boxes:', error);
        setEnrichedBoxes([]);
      } finally {
        setFetchingBoxes(false);
      }
    };

    fetchSpecificBoxes();
  }, [localData.boxesData, selectedBoxes, isEditing]);

  const transformedBoxes = enrichedBoxes;

  return (
    <div className="container mx-auto px-4 py-12">
      {localData.title && (
        <h2 className="text-3xl font-bold mb-2">{localData.title}</h2>
      )}
      {localData.description && (
        <p className="text-muted-foreground mb-8">{localData.description}</p>
      )}
      
      {fetchingBoxes ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: localData.maxBoxes || 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-96"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid ${gridCols[localData.displayMode || 'grid-3']} gap-6`}>
          {transformedBoxes.map((box, index) => (
            <MysteryBoxCard 
              key={box.box_name}
              box={box}
              index={index}
              isVisible={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
